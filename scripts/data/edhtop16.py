""" EDH Top 16.
Utility functions to get data from edhtop16.
"""

import json
import requests
import calendar
import functools
import data.moxfield_t as moxfield_t
from data.edhtop16_t import EdhTop16DeckList, CondensedCommanderData, StatsByCommander, ProcessedDecklist, MetagameResume
from datetime import datetime, timedelta

URL = "https://edhtop16.com/api/req"
HEADERS = {'Content-Type': 'application/json', 'Accept': 'application/json'}

def get_all_decklists_by_tournament(name: str) -> list[EdhTop16DeckList]:
  data = {'tourney_filter': {'tournamentName': {'$regex': name}}}
  raw_lists = json.loads(requests.post(URL, json=data, headers=HEADERS).text)
  return raw_lists

def get_decklist_hashes_from_tournament(lists: list[EdhTop16DeckList]):
  return list(map(lambda x: x['decklist'].split('/')[-1], lists))

def get_metagame_top_decklists() -> list[EdhTop16DeckList]:
  """ Get metagame data
  Criteria:
    - Tournament with at least 64 players
    - At least top 32
    - Last year only (now - 1 year)
  """
  data = {
    'standing': { '$lte': 32 },
    'tourney_filter': {
      'size': { '$gte': 64 }
    },
    'dateCreated': {
      '$gte': calendar.timegm((datetime.now()  - timedelta(days=1*365)).timetuple())
    }
  }
  raw_lists = json.loads(requests.post(URL, json=data, headers=HEADERS).text)

  return list(filter(lambda x: 'commander' in x.keys() and x['commander'] != 'Unknown Commander', raw_lists)) # TODO: poner filtro de commander en query

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
    if list['tournamentName'] not in tournaments.keys():
      tournaments[list['tournamentName']] = []
    tournaments[list['tournamentName']].append(list['decklist'].split('/')[-1])
  return tournaments

def get_condensed_commanders_data(commanders: list[str], raw_lists: list[EdhTop16DeckList]) -> list[CondensedCommanderData]:
  data: list[CondensedCommanderData] = []
  for commander in commanders:
    raw_data = list(filter(lambda x: x['commander'] == commander, raw_lists))
    appearances = len(raw_data)
    wins = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['wins'], raw_data))
    avg_win_rate = round(functools.reduce(lambda x, y: float(x + y), map(lambda x: x['winRate'], raw_data)) / appearances, 3)
    best_standing = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['standing'], raw_data))
    worst_standing = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['standing'], raw_data))
    commander_data: CondensedCommanderData = {
      'identity': raw_data[0]['colorID'],
      'commander': commander,
      'appearances': appearances,
      'wins': wins,
      'avgWinRate': avg_win_rate,
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
    data[commander]['avgWinRate'] = round(functools.reduce(lambda x, y: float(x + y), map(lambda x: x['winRate'], filtered_data)) / data[commander]['appearances'], 3)
    data[commander]['bestStanding'] = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['standing'], filtered_data))
    data[commander]['worstStanding'] = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['standing'], filtered_data))
    def process_decklists(decklist: moxfield_t.DecklistV3) -> ProcessedDecklist:
      process_decklist_data: ProcessedDecklist = {} # type: ignore
      edh_top16_data = list(filter(lambda x: x['decklist'] ==  decklist['url'], filtered_data))[0]
      process_decklist_data['url'] = decklist['url']
      process_decklist_data['wins'] = edh_top16_data['wins']
      process_decklist_data['winRate'] = edh_top16_data['winRate']
      process_decklist_data['standing'] = edh_top16_data['standing']
      process_decklist_data['tournamentName'] = edh_top16_data['tournamentName']
      process_decklist_data['dateCreated'] = edh_top16_data['dateCreated']
      process_decklist_data['hasCompanion'] = decklist['boards']['companions']['count'] > 0
      process_decklist_data['companions'] = list(map(lambda x: x['card']['name'], decklist['boards']['companions']['cards'].values()))
      process_decklist_data['hasStickers'] = decklist['boards']['stickers']['count'] > 0
      process_decklist_data['stickers'] = list(map(lambda x: x['card']['name'], decklist['boards']['stickers']['cards'].values()))
      process_decklist_data['tokens'] = list(set(map(lambda y: y['name'], filter(lambda x: x['isToken'], decklist['tokens']))))
      process_decklist_data['colorPercentages'] = decklist['colorPercentages']
      process_decklist_data['colorIdentityPercentages'] = decklist['colorIdentityPercentages']
      mainboard = list(map(lambda x: x['card'], decklist['boards']['mainboard']['cards'].values()))
      commanders = list(map(lambda x: x['card'], decklist['boards']['commanders']['cards'].values()))
      companions = list(map(lambda x: x['card'], decklist['boards']['companions']['cards'].values()))
      all_cards = mainboard + commanders + companions
      process_decklist_data['cantBattles'] = len(list(filter(lambda x: x['type'] == moxfield_t.CardType.BATTLE, all_cards)))
      process_decklist_data['cantPlaneswalkers'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) == moxfield_t.CardType.PLANESWALKER, all_cards)))
      process_decklist_data['cantCreatures'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.CREATURE, all_cards)))
      process_decklist_data['cantSorceries'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.SORCERY, all_cards)))
      process_decklist_data['cantInstants'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.INSTANT, all_cards)))
      process_decklist_data['cantArtifacts'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.ARTIFACT, all_cards)))
      process_decklist_data['cantEnchantments'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.ENCHANTMENT, all_cards)))
      process_decklist_data['cantLands'] = len(list(filter(lambda x: moxfield_t.CardType(x['type']) is moxfield_t.CardType.LAND, all_cards)))
      process_decklist_data['avgCmcWithLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['cmc'], all_cards)) / len(all_cards)), 3)
      process_decklist_data['avgCmcWithoutLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['cmc'], filter(lambda x: moxfield_t.CardType(x['type']) is not moxfield_t.CardType.LAND, all_cards))) / len(list(filter(lambda x: moxfield_t.CardType(x['type']) is not moxfield_t.CardType.LAND, all_cards)))), 3)

      return process_decklist_data
    processed_decklists = list(map(process_decklists, decklists))
    data[commander]['processed_decklists'] = processed_decklists
    data[commander]['avgCantBattles'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantBattles'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCantPlaneswalkers'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantPlaneswalkers'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCantCreatures'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantCreatures'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCantSorceries'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantSorceries'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCantInstants'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantInstants'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCantArtifacts'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantArtifacts'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCantEnchantments'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantEnchantments'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCantLands'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantLands'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['minCantLands'] = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['cantLands'], processed_decklists))
    data[commander]['maxCantLands'] = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['cantLands'], processed_decklists))
    data[commander]['avgCmcWithLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithLands'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['avgCmcWithoutLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithoutLands'], processed_decklists)) / len(processed_decklists)), 3)
    data[commander]['minAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['avgCmcWithLands'], processed_decklists))
    data[commander]['minAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['avgCmcWithoutLands'], processed_decklists))
    data[commander]['maxAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['avgCmcWithLands'], processed_decklists))
    data[commander]['maxAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['avgCmcWithoutLands'], processed_decklists))
    data[commander]['avgColorPercentages'] = {
      'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['white'], processed_decklists)) / len(processed_decklists)), 3),
      'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['blue'], processed_decklists)) / len(processed_decklists)), 3),
      'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['black'], processed_decklists)) / len(processed_decklists)), 3),
      'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['red'], processed_decklists)) / len(processed_decklists)), 3),
      'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorPercentages']['green'], processed_decklists)) / len(processed_decklists)), 3)
    }
    data[commander]['avgColorIdentityPercentages'] = {
      'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['white'], processed_decklists)) / len(processed_decklists)), 3),
      'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['blue'], processed_decklists)) / len(processed_decklists)), 3),
      'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['black'], processed_decklists)) / len(processed_decklists)), 3),
      'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['red'], processed_decklists)) / len(processed_decklists)), 3),
      'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['colorIdentityPercentages']['green'], processed_decklists)) / len(processed_decklists)), 3)
    }
    decksWhitStickers = len(list(filter(lambda x: x['hasStickers'], processed_decklists)))
    decksWhitCompanions = len(list(filter(lambda x: x['hasCompanion'], processed_decklists)))
    data[commander]['cantDecksWithStickers'] = decksWhitStickers
    data[commander]['cantDecksWithCompanions'] = decksWhitCompanions
    data[commander]['percentageDecksWithStickers'] = round((decksWhitStickers / len(processed_decklists)), 3)
    data[commander]['percentageDecksWithCompanions'] = round((decksWhitCompanions / len(processed_decklists)), 3)
    data[commander]['allTokens'] = list(functools.reduce(lambda x, y: list(set(x + y)), map(lambda x: x['tokens'], processed_decklists)))
  return data

def get_metagame_resume(commanders: list[str], raw_lists: list[EdhTop16DeckList], stats_by_commander: dict[str, StatsByCommander], decklist_hashes_by_tournament: dict[str, list[str]]) -> MetagameResume:
  data: MetagameResume = {} # type: ignore
  data['cantCommanders'] = len(commanders)
  data['cantLists'] = len(raw_lists)
  data['cantTournaments'] = len(decklist_hashes_by_tournament.keys())
  data['avgCmcWithLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithLands'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCmcWithoutLands'] = round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgCmcWithoutLands'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['minAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['minAvgCmcWithLands'], stats_by_commander.values()))
  data['minAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x < y else float(y), map(lambda x: x['minAvgCmcWithoutLands'], stats_by_commander.values()))
  data['maxAvgCmcWithLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['maxAvgCmcWithLands'], stats_by_commander.values()))
  data['maxAvgCmcWithoutLands'] = functools.reduce(lambda x, y: float(x) if x > y else float(y), map(lambda x: x['maxAvgCmcWithoutLands'], stats_by_commander.values()))
  data['avgColorPercentages'] = {
    'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['white'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['blue'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['black'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['red'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorPercentages']['green'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  }
  data['avgColorIdentityPercentages'] = {
    'white': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['white'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'blue': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['blue'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'black': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['black'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'red': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['red'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3),
    'green': round((functools.reduce(lambda x, y: float(x + y), map(lambda x: x['avgColorIdentityPercentages']['green'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  }
  data['avgCantBattles'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantBattles'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCantPlaneswalkers'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantPlaneswalkers'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCantCreatures'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantCreatures'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCantSorceries'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantSorceries'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCantInstants'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantInstants'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCantArtifacts'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantArtifacts'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCantEnchantments'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantEnchantments'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['avgCantLands'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['avgCantLands'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['cantDecksWithStickers'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithStickers'], stats_by_commander.values()))
  data['cantDecksWithCompanions'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithCompanions'], stats_by_commander.values()))
  data['percentageDecksWithStickers'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithStickers'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['percentageDecksWithCompanions'] = round((functools.reduce(lambda x, y: int(x + y), map(lambda x: x['cantDecksWithCompanions'], stats_by_commander.values())) / len(stats_by_commander.keys())), 3)
  data['allTokens'] = list(functools.reduce(lambda x, y: list(set(x + y)), map(lambda x: x['allTokens'], stats_by_commander.values())))

  return data
