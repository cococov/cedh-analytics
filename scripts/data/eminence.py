import json
import requests
from typing import Union

def get_all_decklists(name: str) -> list[dict[str, Union[int, str, None]]]:
  url = "https://edhtop16.com/api/req"
  headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
  data = {'tourney_filter': {'tournamentName': {'$regex': name}}}
  raw_lists = json.loads(requests.post(url, json=data, headers=headers).text)
  return raw_lists

def get_decklist_hashes_from_tournament(lists):
  return list(map(lambda x: x['decklist'].split('/')[-1], lists))