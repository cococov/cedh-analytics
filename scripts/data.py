#!/usr/bin/env python3
import os
import json
import time
import requests
import glob
import zipfile
import pandas as pd
from datetime import datetime
from functools import reduce, lru_cache
from subprocess import DEVNULL, STDOUT, check_call

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
DB_JSON_URL = 'https://raw.githubusercontent.com/AverageDragon/cEDH-Decklist-Database/master/_data/database.json'
ALL_PRINTS_URL = 'https://mtgjson.com/api/v5/AllPrintingsCSVFiles.zip'
VALID_TYPE_SETS = ['expansion', 'commander', 'duel_deck', 'draft_innovation', 'from_the_vault', 'masters', 'arsenal', 'spellbook', 'core', 'starter', 'funny', 'planechase']
INVALID_SETS = ['MB1']
LAST_SET = "Commander Legends: Battle for Baldur's Gate"

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

raw_lists = requests.get(DB_JSON_URL)
lists = json.loads(raw_lists.text)
home_overview = {}

print('\033[KGetting decklists \033[92mDone!\033[0m')
print('Processing hashes...', end='\r')

def reduce_competitive_lists_hashes(accumulated, current):
  if current['section'] != 'COMPETITIVE': return accumulated
  striped_lists = list(map(lambda dl: dl['link'].strip(), current['decklists']))
  filtered_lists = list(filter(lambda l: l.find('moxfield') != -1, striped_lists))
  hashes = list(map(lambda l: l.split('/')[-1], filtered_lists))
  hashes_without_blanks = list(filter(lambda h: h != '', hashes))
  return accumulated + hashes_without_blanks

all_competitive_deck_hashes = reduce(reduce_competitive_lists_hashes, lists, [])[0:20]

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
  hash = {
    'occurrences': 1,
    'cardName': current['card']['name'],
    'colorIdentity': ''.join(current['card']['color_identity']),
    'deckLinks': [current['deck_url']],
    'deckNames': [current['deck_name']],
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
    hash['deckLinks'] = accumulated[saved_card_index]['deckLinks'] + [current['deck_url']]
    hash['deckNames'] = accumulated[saved_card_index]['deckNames'] + [current['deck_name']]
    del accumulated[saved_card_index]

  return [*accumulated, hash]

def reduce_all_decks(accumulated, current):
  return reduce(reduce_deck, list(map(lambda x: {**x, 'deck_url': current['deck']['url'], 'deck_name': current['deck']['name']}, current['cards'])), accumulated)

def map_cards(card):
  return {**card, 'percentageOfUse': round(card['occurrences'] / VALID_DECKS * 100, 2)}

reduced_data = list(map(map_cards, reduce(reduce_all_decks, mapped_decklists_data, [])))
home_overview['cards'] = len(reduced_data)
home_overview['staples'] = len(list(filter(lambda d: d['occurrences'] > 10, reduced_data)))
home_overview['last_set'] = LAST_SET
home_overview['last_set_top_10'] = list(filter(lambda d: (not d['multiplePrintings']) and (d['lastPrint'] == LAST_SET), reduced_data))

print('\033[KProcessing decklists data \033[92mDone!\033[0m')
print('Saving backup...', end='\r')

if os.path.exists(FILE_PATH):
  versions_number = len(os.listdir(os.path.join(DIRNAME, FOLDER_PATH)))
  os.rename(os.path.join(DIRNAME, FILE_PATH), os.path.join(DIRNAME, FOLDER_PATH + r'/competitiveCards_' + f"{versions_number}.json"))

print('\033[KBackup saved \033[92mDone!\033[0m')
print('Saving new file...', end='\r')

with open(os.path.join(DIRNAME, FILE_PATH), 'w+', encoding='utf8') as f:
  json.dump(reduced_data, f, ensure_ascii=False)


print('\033[KNew file saved \033[92mDone!\033[0m')
print('Updating home overview...', end='\r')

with open(os.path.join(DIRNAME, r'public/data/home_overview.json'), 'w+', encoding='utf8') as f:
  json.dump(home_overview, f, ensure_ascii=False)

print('\033[KHome overview saved \033[92mDone!\033[0m')
print('Updating date...', end='\r')

update_date = {}
update_date_path = os.path.join(DIRNAME, r'public/data/update_date.json')
with open(update_date_path, 'r+') as f:
  update_date = json.load(f) if os.stat(update_date_path).st_size > 0 else {}

update_date['database'] = datetime.today().strftime('%d-%m-%Y')

with open(update_date_path, 'w', encoding='utf8') as f:
  json.dump(update_date, f, ensure_ascii=False)

print('\033[KDate updated \033[92mDone!\033[0m')
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
