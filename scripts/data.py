#!/usr/bin/env python
import requests
import json
from functools import reduce

DB_JSON_URL = 'https://raw.githubusercontent.com/AverageDragon/cEDH-Decklist-Database/master/_data/database.json'

print('Beginning')
print('Getting decklists...')

raw_lists = requests.get(DB_JSON_URL)
lists = json.loads(raw_lists.text)

print('Getting decklists \033[92mDone!\033[0m')
print('Procesing hashes...')

def reduce_competitive_lists_hashes(accumulated, current):
  if current['section'] != 'COMPETITIVE': return accumulated
  striped_lists = list(map(lambda dl: dl['link'].strip(), current['decklists']))
  filtered_lists = list(filter(lambda l: l.find('moxfield') != -1, striped_lists))
  hashes = list(map(lambda l: l.split('/')[-1], filtered_lists))
  hashes_without_blanks = list(filter(lambda h: h != '', hashes))
  return accumulated + hashes_without_blanks

all_competitive_deck_hashes = reduce(reduce_competitive_lists_hashes, lists, [])

VALID_DECKS = len(all_competitive_deck_hashes)

print('Procesing hashes \033[92mDone!\033[0m')
print('Getting decklists data...')

decklists_data_getted_number = 0
def get_decklists_data(hash):
  global decklists_data_getted_number
  raw_data = requests.get(f"https://api.moxfield.com/v2/decks/all/{hash}")
  data = json.loads(raw_data.text)
  data['url'] = f"https://www.moxfield.com/decks/{hash}"
  decklists_data_getted_number += 1
  print(f"Getting decklists data [{decklists_data_getted_number}/{VALID_DECKS}]")
  return data

decklists_data = list(map(get_decklists_data, all_competitive_deck_hashes))

print('Getting decklists data \033[92mDone!\033[0m')

print(decklists_data)