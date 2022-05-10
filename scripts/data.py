#!/usr/bin/env python
import os
import json
import requests
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
print('Processing decklists data...')

def map_decklists_data(decklist_data):
  result = {}
  result['deck'] = {'name': decklist_data['name'], 'url': decklist_data['url']}
  cards = decklist_data['mainboard'] | decklist_data['companions'] | decklist_data['commanders']
  result['cards'] = list(cards.values())
  return result

mapped_decklists_data = list(map(map_decklists_data, decklists_data))

def getType(type):
    if type == '1':
      return 'Planeswalker'
    if type == '2':
      return 'Creature'
    if type == '3':
      return 'Sorcery'
    if type == '4':
      return 'Instant'
    if type == '5':
      return 'Artifact'
    if type == '6':
      return 'Enchantment'
    if type == '7':
      return 'Land'
    return 'Unknown'

def reduce_deck(accumulated, current):
  print(current['card'])
  hash = {
    'occurrences': 1,
    'cardName': current['card']['name'],
    'colorIdentity': ''.join(current['card']['color_identity']),
    'deckLinks': [current['deck_url']],
    'deckNames': [current['deck_name']],
    'cmc': current['card']['cmc'],
    'prices': current['card']['prices'],
    'reserved': current['card']['reserved'],
    'scrapName': current['card']['name'],
    'type': getType(current['card']['type']),
    'typeLine': current['card']['type_line'],
  }

  saved_card = list(filter(lambda x: x['cardName'] == current['card']['name'], accumulated))

  if saved_card != []:
    hash['occurrences'] = saved_card[0]['occurrences'] + 1
    hash['deckLinks'] = saved_card[0]['deckLinks'] + [current['deck_url']]
    hash['deckNames'] = saved_card[0]['deckNames'] + [current['deck_name']]

  return [*accumulated, hash]

def reduce_all_decks(accumulated, current):
  return reduce(reduce_deck, list(map(lambda x: {**x, 'deck_url': current['deck']['url'], 'deck_name': current['deck']['name']}, current['cards'])), accumulated)

reduced_data = reduce(reduce_all_decks, mapped_decklists_data, [])

print('Processing decklists data \033[92mDone!\033[0m')
print('Saving backup...')

dirname = os.path.realpath('.')
versions_number = len(os.listdir(os.path.join(dirname, r'public/data')))
os.rename(os.path.join(dirname, r'public/data/competitiveCards.json'), os.path.join(dirname, r'public/data/competitiveCards_' + f"{versions_number}.json"))

print('Backup saved \033[92mDone!\033[0m')
print('Saving new file...')

with open(os.path.join(dirname, r'public/data/competitiveCards.json'), 'w') as f:
    json.dump(reduced_data, f)

print('\033[92mDB Updated!\033[0m')
