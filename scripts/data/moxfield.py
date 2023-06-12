import json
import time
import requests
import utils.logs as logs
from typing import Union

VALID_DECKS = 0
decklists_data_obtained_number = 0

def get_decklists_from_bookmark(id: str) -> dict[str, Union[int, list[dict]]]:
  url = f"https://api2.moxfield.com/v1/bookmarks/{id}/decks?pageNumber=1&pageSize=1000"
  raw_lists = requests.get(url)
  return json.loads(raw_lists.text)

def get_decklist_hashes_from_bookmark(lists):
  return list(map(lambda x: x['deck']['publicId'], lists['data']))

def get_decklists_data(hash):
  global decklists_data_obtained_number, VALID_DECKS
  time.sleep(1)
  raw_data = requests.get(f"https://api.moxfield.com/v2/decks/all/{hash}")
  data = json.loads(raw_data.text)
  data['url'] = f"https://www.moxfield.com/decks/{hash}"
  decklists_data_obtained_number += 1
  logs.loading_log("Getting decklists data", decklists_data_obtained_number, VALID_DECKS)
  return data

def get_decklists_data_from_hashes(hashes):
  logs.begin_log_block('Getting decklists data')
  decklists_data = list(filter(lambda x: 'name' in x.keys(), list(map(get_decklists_data, hashes)))) # filter out decks without name (without name means that the url returns a 404)
  logs.end_log_block('Getting decklists data')
  return decklists_data
