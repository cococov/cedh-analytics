""" EDH Top 16.
Utility functions to get data from edhtop16.
"""

import json
import requests
import calendar
import functools
from datetime import datetime, timedelta
from typing import Union

URL = "https://edhtop16.com/api/req"
HEADERS = {'Content-Type': 'application/json', 'Accept': 'application/json'}

def get_all_decklists_by_tournament(name: str) -> list[dict[str, Union[int, str, None]]]:
  data = {'tourney_filter': {'tournamentName': {'$regex': name}}}
  raw_lists = json.loads(requests.post(URL, json=data, headers=HEADERS).text)
  return raw_lists

def get_decklist_hashes_from_tournament(lists):
  return list(map(lambda x: x['decklist'].split('/')[-1], lists))

def get_metagame_top_decklists():
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

  return list(filter(lambda x: 'commander' in x.keys(), raw_lists))

def get_commanders_from_data(data: list[dict[str, Union[float, int, str]]]) -> list[str]:
  commanders = []
  for list in data:
    if list['commander'] not in commanders:
      commanders.append(list['commander'])
  return commanders

def get_decklist_hashes_by_commander(raw_lists: list[dict[str, str]]) -> dict[str, list[str]]:
  commanders = {}
  for list in raw_lists:
    if list['commander'] not in commanders.keys():
      commanders[list['commander']] = []
    commanders[list['commander']].append(list['decklist'].split('/')[-1])
  return commanders

def get_condensed_commanders_data(commanders: list[str], raw_lists: list[dict[str, Union[float, int, str]]]) -> list[dict[str, Union[int, float]]]:
  data = []
  for commander in commanders:
    raw_data = list(filter(lambda x: x['commander'] == commander, raw_lists))
    appearances = len(raw_data)
    wins = functools.reduce(lambda x, y: x + y, map(lambda x: x['wins'], raw_data))
    avg_win_rate = round(functools.reduce(lambda x, y: x + y, map(lambda x: x['winRate'], raw_data)) / appearances, 3)
    best_standing = functools.reduce(lambda x, y: x if x < y else y, map(lambda x: x['standing'], raw_data)) # type: ignore
    worst_standing = functools.reduce(lambda x, y: x if x > y else y, map(lambda x: x['standing'], raw_data)) # type: ignore
    data.append({
      'commander': commander,
      'appearances': appearances,
      'wins': wins,
      'avg_win_rate': avg_win_rate,
      'best_standing': best_standing,
      'worst_standing': worst_standing
    })
  return data
