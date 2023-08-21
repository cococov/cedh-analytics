""" EDH Top 16.
Utility functions to get data from edhtop16.
"""

import json
import requests
import calendar
import functools
import typing
import data.moxfield_t as moxfield_t
from datetime import datetime, timedelta
from utils.misc import pp_json

URL = "https://edhtop16.com/api/req"
HEADERS = {'Content-Type': 'application/json', 'Accept': 'application/json'}

class EdhTop16DeckList(typing.TypedDict):
  name: str
  profile: str
  decklist: str
  wins: int
  winsSwiss: int
  winsBracket: int
  winRate: float
  winRateSwiss: float
  winRateBracket: typing.Optional[float]
  draws: int
  losses: int
  lossesSwiss: int
  lossesBracket: int
  standing: int
  colorID: str
  commander: str
  tournamentName: str
  dateCreated: int

class CondensedCommanderData(typing.TypedDict):
  identity: str
  commander: str
  appearances: int
  wins: int
  avg_win_rate: float
  best_standing: int
  worst_standing: int

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
  data = []
  for commander in commanders:
    raw_data = list(filter(lambda x: x['commander'] == commander, raw_lists))
    appearances = len(raw_data)
    wins = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['wins'], raw_data))
    avg_win_rate = round(functools.reduce(lambda x, y: float(x + y), map(lambda x: x['winRate'], raw_data)) / appearances, 3)
    best_standing = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['standing'], raw_data))
    worst_standing = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['standing'], raw_data))
    data.append({
      'identity': raw_data[0]['colorID'],
      'commander': commander,
      'appearances': appearances,
      'wins': wins,
      'avg_win_rate': avg_win_rate,
      'best_standing': best_standing,
      'worst_standing': worst_standing
    })
  return data

def get_commander_stats_by_commander(commanders: list[str], raw_lists: list[EdhTop16DeckList], decklists_by_commander: dict[str, list[moxfield_t.Decklist]]):
  data = {}
  for commander in commanders:
    filtered_data = list(filter(lambda x: x['commander'] == commander, raw_lists))
    decklists = decklists_by_commander[commander]
    data[commander] = {}
    data[commander]['appearances'] = len(filtered_data)
    data[commander]['wins'] = functools.reduce(lambda x, y: int(x + y), map(lambda x: x['wins'], filtered_data))
    data[commander]['avg_win_rate'] = round(functools.reduce(lambda x, y: float(x + y), map(lambda x: x['winRate'], filtered_data)) / data[commander]['appearances'], 3)
    data[commander]['best_standing'] = functools.reduce(lambda x, y: int(x) if x < y else int(y), map(lambda x: x['standing'], filtered_data))
    data[commander]['worst_standing'] = functools.reduce(lambda x, y: int(x) if x > y else int(y), map(lambda x: x['standing'], filtered_data))
    def process_decklists(decklist: moxfield_t.Decklist):
      process_decklist_data = {}
      process_decklist_data['hasCompanion'] = decklist['companionsCount'] > 0
      process_decklist_data['companions'] = list(decklist['companions'].keys())
      process_decklist_data['stickers'] = list(decklist['stickers'].keys())
      process_decklist_data['hasStickers'] = decklist['stickersCount'] > 0
      process_decklist_data['tokens'] = list(filter(lambda x: x['isToken'], decklist['tokens']))

      return process_decklist_data
    processed_decklists = map(process_decklists, decklists)
    data[commander]['processed_decklists'] = list(processed_decklists)
  return data

def get_metagame_resume(commanders: list[str], raw_lists: list[EdhTop16DeckList], decklists_by_commander: dict[str, list[moxfield_t.Decklist]]):
  data = {}
  data['cant_commanders'] = len(commanders)
  data['cant_lists'] = len(raw_lists)

  return data
