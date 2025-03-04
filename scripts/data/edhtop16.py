""" EDH Top 16.
Utility functions to get data from edhtop16.

cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2023-present CoCoCov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Original Repo: https://github.com/cococov/cedh-analytics
https://www.cedh-analytics.com/
"""

import json
import requests
import calendar
import functools
import data.moxfield_t as moxfield_t
import pandas as pd
from data.edhtop16_t import EdhTop16DeckList, CondensedCommanderData, StatsByCommander, ProcessedDecklist, MetagameResume, Tournament
from datetime import datetime, timedelta
import utils.logs as logs
import utils.misc as misc

URL = "https://edhtop16.com/api/req"
TOURNAMENTS_URL = "https://edhtop16.com/api/list_tourneys"
HEADERS = {'Content-Type': 'application/json', 'Accept': 'application/json'}

def get_all_decklists_by_tournament(name: str) -> list[EdhTop16DeckList]:
  data = {'tourney_filter': {'tournamentName': {'$regex': name}}}
  raw_lists = json.loads(requests.post(URL, json=data, headers=HEADERS).text)
  return raw_lists

def get_decklist_hashes_from_tournament(lists: list[EdhTop16DeckList]):
  return list(map(lambda x: x['decklist'].split('/')[-1], lists))

def get_metagame_top_decklists(min_wins=2, min_tournament_size=64) -> list[EdhTop16DeckList]:
  """ Get metagame data from EDH Top 16
  Criteria:
    - [Default] Tournament with at least 64 players
    - [Default] At least 2 wins
    - Last year only (now - 1 year)
    - Just Moxfield decklists are considered
  """
  data = {
    'wins': { '$gte': min_wins },
    'decklist': { '$regex': 'https://www.moxfield.com/decks/.*' },
    'tourney_filter': {
      'size': { '$gte': min_tournament_size }
    },
    'dateCreated': {
      '$gte': calendar.timegm((datetime.now()  - timedelta(days=1*365)).timetuple())
    }
  }
  raw_lists = json.loads(requests.post(URL, json=data, headers=HEADERS).text)

  return list(filter(lambda x: ('commander' in x.keys() and x['commander'] != 'Unknown Commander' and x['winRate'] is not None), raw_lists)) # TODO: poner filtro de commander y winrate en query

def index_decklists_by_hash(raw_lists: list[EdhTop16DeckList]) -> dict[str, EdhTop16DeckList]:
  decklists_by_hash = {}
  for list in raw_lists:
    decklists_by_hash[list['decklist'].split('/')[-1]] = list
  return decklists_by_hash

def get_commanders_from_data(raw_lists: list[EdhTop16DeckList]) -> list[str]:
  commanders = []
  for list in raw_lists:
    if list['commander'] not in commanders:
      commanders.append(list['commander'])
  return commanders

def get_decklist_hashes_by_commander(raw_lists: list[EdhTop16DeckList]) -> dict[str, list[str]]:
  commanders = {}
  for list in raw_lists:
    if list['commander'] not in commanders.keys():
      commanders[list['commander']] = []
    commanders[list['commander']].append(list['decklist'].split('/')[-1])
  return commanders

def get_decklist_hashes_by_tournament(raw_lists: list[EdhTop16DeckList]) -> dict[str, list[str]]:
  tournaments = {}
  for list in raw_lists:
    if list['tournamentName'].strip() not in tournaments.keys():
      tournaments[list['tournamentName'].strip()] = []
    tournaments[list['tournamentName'].strip()].append(list['decklist'].split('/')[-1])
  return tournaments

def sort_identity_str(identity):
  identities = { 'W': 0, 'U': 1, 'B': 2, 'R': 3, 'G': 4, 'C' : 5 }
  sorted_identities = sorted(list(identity), key=lambda x: identities[x])
  return ''.join(sorted_identities)

def get_condensed_commanders_data(commanders: list[str], raw_lists: list[EdhTop16DeckList]) -> list[CondensedCommanderData]:
  data: list[CondensedCommanderData] = []
  for commander in commanders:
    raw_data = list(filter(lambda x: x['commander'] == commander, raw_lists))
    appearances = len(raw_data)
    wins = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['wins'], raw_data), 0)
    draws = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['draws'], raw_data), 0)
    losses = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['losses'], raw_data), 0)
    avg_draw_rate = round(draws / (wins + draws + losses) if (wins + draws + losses) > 0 else 0, 3)
    avg_win_rate = round(functools.reduce(lambda x, y: float(x + (y if y else 0)), map(lambda x: x['winRate'], raw_data), 0) / appearances, 3)
    best_standing = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['standing'], raw_data))
    worst_standing = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['standing'], raw_data))
    commander_data: CondensedCommanderData = {
      'identity': sort_identity_str(raw_data[0]['colorID']),
      'commander': commander,
      'appearances': appearances,
      'wins': wins,
      'avgWinRate': avg_win_rate,
      'avgDrawRate': avg_draw_rate,
      'bestStanding': best_standing,
      'worstStanding': worst_standing
    }
    data.append(commander_data)
  return data

def get_commander_stats_by_commander(commanders: list[str], raw_lists: list[EdhTop16DeckList], decklists_by_commander: dict[str, list[moxfield_t.DecklistV3]]) -> dict[str, StatsByCommander]:
  data: dict[str, StatsByCommander] = {}
  for commander in commanders:
    filtered_data = list(filter(lambda x: x['commander'] == commander, raw_lists))
    decklists = decklists_by_commander[commander]
    data[commander] = {} # type: ignore
    data[commander]['appearances'] = len(filtered_data)
    data[commander]['colorID'] = filtered_data[0]['colorID']
    data[commander]['wins'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['wins'], filtered_data))
    data[commander]['draws'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['draws'], filtered_data))
    data[commander]['losses'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['losses'], filtered_data))
    data[commander]['avgWinRate'] = round(functools.reduce(lambda x, y: float(x + y), map(lambda x: (0 if not x['winRate'] else x['winRate']), filtered_data)) / data[commander]['appearances'], 3)
    data[commander]['avgDrawRate'] = round(data[commander]['draws'] / (data[commander]['wins'] + data[commander]['draws'] + data[commander]['losses']) if (data[commander]['wins'] + data[commander]['draws'] + data[commander]['losses']) > 0 else 0, 3)
    data[commander]['bestStanding'] = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['standing'], filtered_data))
    data[commander]['worstStanding'] = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['standing'], filtered_data))
    def process_decklists(decklist: moxfield_t.DecklistV3) -> ProcessedDecklist | dict:
      process_decklist_data: ProcessedDecklist = {} # type: ignore
      edh_top16_data_list = list(filter(lambda x: x['decklist'] ==  decklist['url'], filtered_data))
      if len(edh_top16_data_list) == 0:
        return {}
      edh_top16_data = edh_top16_data_list[0]
      process_decklist_data['url'] = decklist['url']
      process_decklist_data['name'] = decklist['name']
      process_decklist_data['hasPartners'] = decklist['boards']['commanders']['count'] > 1
      process_decklist_data['wins'] = edh_top16_data['wins']
      process_decklist_data['losses'] = edh_top16_data['losses']
      process_decklist_data['draws'] = edh_top16_data['draws']
      process_decklist_data['winRate'] = round(edh_top16_data['winRate'], 3)
      process_decklist_data['drawRate'] = round(edh_top16_data['draws'] / (edh_top16_data['wins'] + edh_top16_data['draws'] + edh_top16_data['losses']) if (edh_top16_data['wins'] + edh_top16_data['draws'] + edh_top16_data['losses']) > 0 else 0, 3)
      process_decklist_data['standing'] = edh_top16_data['standing']
      process_decklist_data['tournamentName'] = edh_top16_data['tournamentName'].strip()
      process_decklist_data['dateCreated'] = edh_top16_data['dateCreated']
      process_decklist_data['hasCompanion'] = decklist['boards']['companions']['count'] > 0
      process_decklist_data['companions'] = list(map(lambda x: x['card']['name'], decklist['boards']['companions']['cards'].values()))
      process_decklist_data['hasStickers'] = decklist['boards']['stickers']['count'] > 0
      process_decklist_data['stickers'] = list(map(lambda x: x['card']['name'], decklist['boards']['stickers']['cards'].values()))
      process_decklist_data['tokens'] = list(set(map(lambda y: y['name'], filter(lambda x: x['isToken'], decklist['tokens']))))
      process_decklist_data['colorPercentages'] = decklist['colorPercentages']
      process_decklist_data['colorIdentityPercentages'] = decklist['colorIdentityPercentages']
      mainboard = list(map(lambda x: {**x['card'], 'quantity': x['quantity']} , decklist['boards']['mainboard']['cards'].values()))
      commanders = list(map(lambda x: {**x['card'], 'quantity': x['quantity']} , decklist['boards']['commanders']['cards'].values()))
      companions = list(map(lambda x: {**x['card'], 'quantity': x['quantity']} , decklist['boards']['companions']['cards'].values()))
      all_cards = mainboard + commanders + companions
      process_decklist_data['cantBattles'] = len(list(filter(lambda x: x['type'] == moxfield_t.CardType.BATTLE, all_cards)))
      process_decklist_data['cantPlaneswalkers'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) == moxfield_t.CardType.PLANESWALKER, all_cards)))
      process_decklist_data['cantCreatures'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.CREATURE, all_cards)))
      process_decklist_data['cantSorceries'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.SORCERY, all_cards)))
      process_decklist_data['cantInstants'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.INSTANT, all_cards)))
      process_decklist_data['cantArtifacts'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.ARTIFACT, all_cards)))
      process_decklist_data['cantEnchantments'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.ENCHANTMENT, all_cards)))
      process_decklist_data['cantLands'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['quantity'] if moxfield_t.CardType(x['type']) is moxfield_t.CardType.LAND else 0, all_cards))
      if process_decklist_data['cantLands'] < 15:
        return {}
      process_decklist_data['avgCmcWithLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['cmc'], all_cards)) / len(all_cards)), 3)
      process_decklist_data['avgCmcWithoutLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['cmc'], filter(lambda x: moxfield_t.CardType(x['type']) is not moxfield_t.CardType.LAND, all_cards))) / len(list(filter(lambda x: moxfield_t.CardType(x['type']) is not moxfield_t.CardType.LAND, all_cards)))), 3)

      return process_decklist_data
    processed_decklists:  list[ProcessedDecklist] = list(filter(lambda x: len(x.keys()) != 0, map(process_decklists, decklists))) # type: ignore
    cant_processed_decklists = len(processed_decklists)
    # Eliminamos el comandante si ninguna de sus decklists era válida
    if cant_processed_decklists == 0:
      data[commander]['isValid'] = False
      continue
    data[commander]['processed_decklists'] = processed_decklists
    data[commander]['hasPartners'] = functools.reduce(lambda x, y: x or y, map(lambda x: x['hasPartners'], processed_decklists), False)
    data[commander]['avgCantBattles'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantBattles'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCantPlaneswalkers'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantPlaneswalkers'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCantCreatures'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantCreatures'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCantSorceries'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantSorceries'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCantInstants'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantInstants'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCantArtifacts'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantArtifacts'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCantEnchantments'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantEnchantments'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCantLands'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantLands'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['minCantLands'] = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['cantLands'], processed_decklists), 999)
    data[commander]['maxCantLands'] = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['cantLands'], processed_decklists), 0)
    data[commander]['sortedUseOfLands'] = list(map(lambda x: x['cantLands'], sorted(processed_decklists, key=lambda x: x['cantLands'])))
    data[commander]['avgCmcWithLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithLands'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['avgCmcWithoutLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithoutLands'], processed_decklists), 0) / cant_processed_decklists), 3)
    data[commander]['minAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['avgCmcWithLands'], processed_decklists), 999)
    data[commander]['minAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['avgCmcWithoutLands'], processed_decklists), 999)
    data[commander]['maxAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['avgCmcWithLands'], processed_decklists), 0)
    data[commander]['maxAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['avgCmcWithoutLands'], processed_decklists), 0)
    data[commander]['avgColorPercentages'] = {
      'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['white'], processed_decklists), 0) / cant_processed_decklists), 3),
      'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['blue'], processed_decklists), 0) / cant_processed_decklists), 3),
      'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['black'], processed_decklists), 0) / cant_processed_decklists), 3),
      'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['red'], processed_decklists), 0) / cant_processed_decklists), 3),
      'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['green'], processed_decklists), 0) / cant_processed_decklists), 3)
    }
    data[commander]['avgColorIdentityPercentages'] = {
      'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['white'], processed_decklists), 0) / cant_processed_decklists), 3),
      'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['blue'], processed_decklists), 0) / cant_processed_decklists), 3),
      'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['black'], processed_decklists), 0) / cant_processed_decklists), 3),
      'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['red'], processed_decklists), 0) / cant_processed_decklists), 3),
      'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['green'], processed_decklists), 0) / cant_processed_decklists), 3)
    }
    decksWhitStickers = len(list(filter(lambda x: x['hasStickers'], processed_decklists)))
    decksWhitCompanions = len(list(filter(lambda x: x['hasCompanion'], processed_decklists)))
    data[commander]['cantDecksWithStickers'] = decksWhitStickers
    data[commander]['cantDecksWithCompanions'] = decksWhitCompanions
    data[commander]['percentageDecksWithStickers'] = round((decksWhitStickers / cant_processed_decklists), 3)
    data[commander]['percentageDecksWithCompanions'] = round((decksWhitCompanions / cant_processed_decklists), 3)
    data[commander]['allTokens'] = list(functools.reduce(lambda x, y: list(set(x + y)), map(lambda x: x['tokens'], processed_decklists), []))
    use_of_lads_df = pd.DataFrame(data[commander]['sortedUseOfLands'])
    data[commander]['useOfCards'] = {}
    data[commander]['useOfCards']['minCantLands'] = use_of_lads_df.min().to_dict()[0]
    data[commander]['useOfCards']['q1CantLands'] = use_of_lads_df.quantile([.25]).to_dict()[0][0.25]
    data[commander]['useOfCards']['medianCantLands'] = use_of_lads_df.quantile([.5]).to_dict()[0][0.5]
    data[commander]['useOfCards']['q3CantLands'] = use_of_lads_df.quantile([.75]).to_dict()[0][0.75]
    data[commander]['useOfCards']['maxCantLands'] = use_of_lads_df.max().to_dict()[0]
    data[commander]['isValid'] = True
  return data

def get_metagame_resume(commanders: list[str], raw_lists: list[EdhTop16DeckList], stats_by_commander: dict[str, StatsByCommander], decklist_hashes_by_tournament: dict[str, list[str]]) -> MetagameResume:
  data: MetagameResume = {} # type: ignore
  data['cantCommanders'] = len(commanders)
  data['cantLists'] = sum(map(lambda x: x['appearances'], stats_by_commander.values()))
  data['cantTournaments'] = len(decklist_hashes_by_tournament.keys())
  # Solo condensamos stats de commanders con al menos una decklists válida
  fixed_stats_by_commander = {}
  for commander in commanders:
    if stats_by_commander[commander]['isValid']:
      fixed_stats_by_commander[commander] = stats_by_commander[commander]
  data['avgCmcWithLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithLands'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCmcWithoutLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithoutLands'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['minAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['minAvgCmcWithLands'], fixed_stats_by_commander.values()))
  data['minAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['minAvgCmcWithoutLands'], fixed_stats_by_commander.values()))
  data['maxAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['maxAvgCmcWithLands'], fixed_stats_by_commander.values()))
  data['maxAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['maxAvgCmcWithoutLands'], fixed_stats_by_commander.values()))
  data['avgColorPercentages'] = {
    'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['white'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['blue'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['black'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['red'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['green'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  }
  data['avgColorIdentityPercentages'] = {
    'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['white'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['blue'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['black'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['red'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3),
    'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['green'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  }
  data['avgCantBattles'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantBattles'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCantPlaneswalkers'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantPlaneswalkers'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCantCreatures'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantCreatures'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCantSorceries'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantSorceries'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCantInstants'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantInstants'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCantArtifacts'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantArtifacts'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCantEnchantments'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantEnchantments'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['avgCantLands'] = round((functools.reduce(lambda x, y: x + y, map(lambda x: x['avgCantLands'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  sorted_use_of_lands: list[int] = sorted(functools.reduce(lambda x,y: x + y, (map(lambda x: x['sortedUseOfLands'], fixed_stats_by_commander.values()))))
  use_of_lads_df = pd.DataFrame(sorted_use_of_lands)
  data['useOfCards'] = {}
  data['useOfCards']['minCantLands'] = use_of_lads_df.min().to_dict()[0]
  data['useOfCards']['q1CantLands'] = use_of_lads_df.quantile([.25]).to_dict()[0][0.25]
  data['useOfCards']['medianCantLands'] = use_of_lads_df.quantile([.5]).to_dict()[0][0.5]
  data['useOfCards']['q3CantLands'] = use_of_lads_df.quantile([.75]).to_dict()[0][0.75]
  data['useOfCards']['maxCantLands'] = use_of_lads_df.max().to_dict()[0]
  data['percentageDecksWithPartners'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['appearances'] if x['hasPartners'] else 0, fixed_stats_by_commander.values())) / data['cantLists']), 3)
  data['cantDecksWithStickers'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithStickers'], fixed_stats_by_commander.values()))
  data['cantDecksWithCompanions'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithCompanions'], fixed_stats_by_commander.values()))
  data['percentageDecksWithStickers'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithStickers'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['percentageDecksWithCompanions'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithCompanions'], fixed_stats_by_commander.values())) / len(fixed_stats_by_commander.keys())), 3)
  data['allTokens'] = list(functools.reduce(lambda x, y: list(set(x + y)), map(lambda x: x['allTokens'], fixed_stats_by_commander.values())))

  return data

def get_tournaments_resume(saved_tournaments: list[Tournament], tournament_names: list[str], mapped_tournament_names: dict[str, str]) -> list[Tournament]:
  new_tournaments: list[Tournament] = saved_tournaments
  saved_tournaments_names = list(map(lambda x: x['name'], saved_tournaments))
  for tournament_name in tournament_names:
    if tournament_name not in saved_tournaments_names:
      if mapped_tournament_names[tournament_name].strip() != tournament_name:
        logs.error_log(f'Tournament {tournament_name} is not the same as {mapped_tournament_names[tournament_name]}')
        exit(1)
      data = {'tournamentName': rf'{mapped_tournament_names[tournament_name]}'}
      raw_result = requests.post(TOURNAMENTS_URL, json=data, headers=HEADERS).text
      json_result = list(json.loads(raw_result))
      result = json_result.pop() if len(json_result) > 0 else {}
      if 'TID' not in result.keys():
        logs.warning_log(f'Tournament {tournament_name} not found in EDH Top 16')
        continue
      new_tournaments.append({
        'name': tournament_name,
        'TID': result['TID'],
        'size': result['size'],
        'date': result['date'],
        'validLists': 0,
        'processed': False
      })

  return new_tournaments