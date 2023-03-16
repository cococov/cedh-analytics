import json
import time
import requests

VALID_DECKS = 0
decklists_data_getted_number = 0

def get_decklists_from_bookmark(id):
  url = f"https://api2.moxfield.com/v1/bookmarks/{id}/decks?pageNumber=1&pageSize=1000"
  raw_lists = requests.get(url)
  return json.loads(raw_lists.text)

def get_decklist_hashes_from_bookmark(lists):
  return list(map(lambda x: x['deck']['publicId'], lists['data']))

def get_decklists_data(hash):
  global decklists_data_getted_number, VALID_DECKS
  time.sleep(1)
  raw_data = requests.get(f"https://api.moxfield.com/v2/decks/all/{hash}")
  data = json.loads(raw_data.text)
  data['url'] = f"https://www.moxfield.com/decks/{hash}"
  decklists_data_getted_number += 1
  print(f"\033[KGetting decklists data [{decklists_data_getted_number}/{VALID_DECKS}]", end='\r')
  return data

def get_decklists_data_from_hashes(hashes):
  return list(filter(lambda x: 'name' in x.keys(), list(map(get_decklists_data, hashes)))) # filter out decks without name (without name means that the url returns a 404)
