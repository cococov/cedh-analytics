#!/usr/bin/env python3
import os
import json
import time
import requests
import glob
import zipfile
from pathlib import Path
import pandas as pd
from functools import reduce, lru_cache
from subprocess import DEVNULL, STDOUT, check_call

TOURNAMENT_DECKLISTS_BOOKMARK_ID = 'EW4eG'
TOURNAMENT_ID = 'melipilla_5'

MOXFIELD_BOOKMARK_URL = f"https://api2.moxfield.com/v1/bookmarks/{TOURNAMENT_DECKLISTS_BOOKMARK_ID}/decks?pageNumber=1&pageSize=1000"
DIRNAME = os.path.realpath('.')
FOLDER_PATH = rf'public/data/tournaments/{TOURNAMENT_ID}/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
ALL_PRINTS_URL = 'https://mtgjson.com/api/v5/AllPrintingsCSVFiles.zip'
VALID_TYPE_SETS = ['expansion', 'commander', 'duel_deck', 'draft_innovation', 'from_the_vault', 'masters', 'arsenal', 'spellbook', 'core', 'starter', 'funny', 'planechase']
INVALID_SETS = ['MB1']
LAST_SET = ["The Brothers' War", "The Brothers' War Commander"] # [base set, commander decks]

print('Beginning')
print('Deleting csv directory content...', end='\r')

files = glob.glob('./csv/*')
for f in files:
  os.remove(f)

print('\033[Kcsv directory content deleted \033[92mDone!\033[0m')
print('Geting all printing...', end='\r')

check_call(['wget', ALL_PRINTS_URL, '-P', './csv'], stdout=DEVNULL, stderr=STDOUT)

print('\033[KGeting all printing \033[92mDone!\033[0m')
print('Unzip all printing...', end='\r')

with zipfile.ZipFile('./csv/AllPrintingsCSVFiles.zip', 'r') as zip_ref:
  zip_ref.extractall('./csv')

print('\033[KUnzip all printing \033[92mDone!\033[0m')
print('Processing all printing...', end='\r')

cards_csv = pd.read_csv('./csv/cards.csv', dtype='unicode').dropna(axis=1)
sets_csv = pd.read_csv('./csv/sets.csv', dtype='unicode').dropna(axis=1).sort_values(by='releaseDate',ascending=False).query("type in @VALID_TYPE_SETS").query("keyruneCode not in @INVALID_SETS").query("isOnlineOnly == '0'")
sets_csv['releaseDate'] = pd.to_datetime(sets_csv['releaseDate'])

@lru_cache(maxsize=None)
def get_last_set_for_card(card_name):
  try:
    if card_name in ['Glenn, the Voice of Calm', 'Rick, Steadfast Leader', 'Daryl, Hunter of Walkers']:
      return 'Secret Lair Drop'
    if card_name in ['Rot Hulk']:
      return 'Game Night'
    card_printing_codes = cards_csv.loc[cards_csv['name'] == card_name].iloc[0]['printings'].split(',')
    card_printing_names = sets_csv.loc[sets_csv['keyruneCode'].isin(card_printing_codes)]['name']
    return card_printing_names.iloc[0]
  except:
    print("Error getting card set: " + card_name)
    return 'Unknown'

@lru_cache(maxsize=None)
def has_multiple_printings(card_name):
  try:
    if card_name in ['Glenn, the Voice of Calm', 'Rick, Steadfast Leader', 'Daryl, Hunter of Walkers']:
      return 'Secret Lair Drop'
    if card_name in ['Rot Hulk']:
      return 'Game Night'
    card_printing_codes = cards_csv.loc[cards_csv['name'] == card_name].iloc[0]['printings'].split(',')
    card_printing_names = sets_csv.loc[sets_csv['keyruneCode'].isin(card_printing_codes)]['name']
    return card_printing_names.count() > 1
  except:
    return False

print('\033[KProcessing all printing \033[92mDone!\033[0m')
print('Getting decklists...', end='\r')

raw_lists = requests.get(MOXFIELD_BOOKMARK_URL)
lists = json.loads(raw_lists.text)
home_overview = {}

print('\033[KGetting decklists \033[92mDone!\033[0m')
print('Processing hashes...', end='\r')

all_competitive_deck_hashes = list(map(lambda x: x['deck']['publicId'], lists['data']))
VALID_DECKS = len(all_competitive_deck_hashes)
home_overview['decks'] = VALID_DECKS

print('\033[KProcesing hashes \033[92mDone!\033[0m')
print('Getting decklists data...', end='\r')

decklists_data_getted_number = 0
def get_decklists_data(hash):
  global decklists_data_getted_number
  time.sleep(1)
  raw_data = requests.get(f"https://api.moxfield.com/v2/decks/all/{hash}")
  data = json.loads(raw_data.text)
  data['url'] = f"https://www.moxfield.com/decks/{hash}"
  decklists_data_getted_number += 1
  print(f"\033[KGetting decklists data [{decklists_data_getted_number}/{VALID_DECKS}]", end='\r')
  return data

decklists_data = list(map(get_decklists_data, all_competitive_deck_hashes))

print('\033[KGetting decklists data \033[92mDone!\033[0m')
print('Processing decklists data...', end='\r')

def map_decklists_data(decklist_data):
  result = {}
  result['deck'] = { 'name': decklist_data['name'], 'url': decklist_data['url'], 'commanders': list(map(lambda x : { 'name': x['card']['name'], 'color_identity': x['card']['color_identity'] }, decklist_data['commanders'].values()))}
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
  hash = {
    'occurrences': 1,
    'cardName': current['card']['name'],
    'colorIdentity': 'C' if len(current['card']['color_identity']) == 0 else ''.join(current['card']['color_identity']),
    'decklists': [current['deck']],
    'cmc': current['card']['cmc'],
    'prices': current['card']['prices'],
    'reserved': current['card']['reserved'],
    'multiplePrintings': bool(has_multiple_printings(current['card']['name'])),
    'lastPrint': get_last_set_for_card(current['card']['name']),
    'multiverse_ids': current['card']['multiverse_ids'] if 'multiverse_ids' in current['card'] else [0],
    'scrapName': current['card']['name'],
    'type': getType(current['card']['type']),
    'typeLine': current['card']['type_line'],
  }

  saved_card_index = next((index for (index, d) in enumerate(accumulated) if d['cardName'] == current['card']['name']), -1)

  if saved_card_index > -1:
    hash['occurrences'] = accumulated[saved_card_index]['occurrences'] + 1
    hash['decklists'] = accumulated[saved_card_index]['decklists'] + [current['deck']]
    del accumulated[saved_card_index]

  return [*accumulated, hash]

def reduce_all_decks(accumulated, current):
  return reduce(reduce_deck, list(map(lambda x: {**x, 'deck': current['deck']}, current['cards'])), accumulated)

def sort_identity(identity):
  if len(identity) == 0:
    return ['C']
  identities = { 'W': 0, 'U': 1, 'B': 2, 'R': 3, 'G': 4 }
  sorted_identities = sorted(identity, key=lambda x: identities[x])
  return sorted_identities

def sort_and_group_decks(decks):
  sorted_decks = sorted(decks, key=lambda x: x['name'])
  grouped_decks = {}
  for deck in sorted_decks:
    splitted_commanders = map(lambda y: y['name'].split(',')[0], deck['commanders'])
    joined_commanders = ' | '.join(sorted(splitted_commanders))
    grouped_decks.setdefault(joined_commanders, []).append(deck)
  unsorted_decks_by_commanders = []
  for key, value in grouped_decks.items():
    color_identity = list(reduce(lambda y, z: set(y + z), map(lambda x: x['color_identity'], value[0]['commanders'])))
    sorted_identity = sort_identity(color_identity)
    unsorted_decks_by_commanders.append({ 'commanders': key, 'decks': value, 'colorIdentity': sorted_identity })
  sorted_decks_by_commanders = sorted(unsorted_decks_by_commanders, key=lambda x: ''.join(x['colorIdentity']) + x['commanders'])
  sorted_by_identity_size_decks_by_commanders = sorted(sorted_decks_by_commanders, key=lambda x: len(x['colorIdentity']))
  return sorted_by_identity_size_decks_by_commanders

def map_cards(card):
  decklists = sort_and_group_decks(card['decklists'])
  return {**card, 'decklists': decklists, 'percentageOfUse': round(card['occurrences'] / VALID_DECKS * 100, 2)}

reduced_data = list(map(map_cards, reduce(reduce_all_decks, mapped_decklists_data, [])))
home_overview['cards'] = len(reduced_data)
home_overview['staples'] = len(list(filter(lambda d: d['occurrences'] > 10, reduced_data)))
home_overview['staples_small'] = len(list(filter(lambda d: d['occurrences'] > 5, reduced_data)))
home_overview['pet'] = len(list(filter(lambda d: d['occurrences'] == 1, reduced_data)))
home_overview['last_set'] = LAST_SET[0]
home_overview['last_set_top_10'] = list(sorted(map(lambda x: {'occurrences': x['occurrences'], 'cardName': x['cardName']}, filter(lambda d: (not d['multiplePrintings']) and ((d['lastPrint'] == LAST_SET[0]) or (d['lastPrint'] == LAST_SET[1])), reduced_data)), key=lambda d: d['occurrences'], reverse=True))[0:10]

print('\033[KProcessing decklists data \033[92mDone!\033[0m')
print('Saving new file...', end='\r')

Path(FOLDER_PATH).mkdir(parents=True, exist_ok=True)

with open(os.path.join(DIRNAME, FILE_PATH), 'w+', encoding='utf8') as f:
  json.dump(reduced_data, f, ensure_ascii=False)

print('\033[KNew file saved \033[92mDone!\033[0m')
print('Updating home overview...', end='\r')

with open(os.path.join(DIRNAME, rf'public/data/tournaments/{TOURNAMENT_ID}/home_overview.json'), 'w+', encoding='utf8') as f:
  json.dump(home_overview, f, ensure_ascii=False)

print('\033[KHome overview saved \033[92mDone!\033[0m')
print('Cleaning...', end='\r')

files = glob.glob('./csv/*')
for f in files:
  os.remove(f)

print('\033[KCleaning \033[92mDone!\033[0m')
time.sleep(1)
print('Uploading changes...', end='\r')
check_call(['git', 'add', '.'], stdout=DEVNULL, stderr=STDOUT)
check_call(['git', 'commit', '-m', '"chore: update DB"'], stdout=DEVNULL, stderr=STDOUT)
check_call(['git', 'push'], stdout=DEVNULL, stderr=STDOUT)

time.sleep(1)
print('\033[K\033[92mDB Updated!\033[0m')
