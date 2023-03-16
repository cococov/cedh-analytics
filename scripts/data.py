#!/usr/bin/env python3
import os
import time
import data.moxfield
from utils.files import clear_csv_directory, download_file, unzip_file, backup_file, create_file, update_db_date
from data.mtg_json import get_cards_csv, get_sets_csv, build_get_last_set_for_card, build_has_multiple_printings
from data.cedh_db import get_decklists_from_db, get_hashes
from data.moxfield import get_decklists_data_from_hashes
from data.pre_processing import get_decklists_data, reduce_decks_to_cards, process_cards
from data.processing import cards_number, staples_number, pet_cards_number, last_set_top_10
from utils.git import add_all, commit, push

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
ALL_PRINTS_URL = 'https://mtgjson.com/api/v5/AllPrintingsCSVFiles.zip'
VALID_TYPE_SETS = ['expansion', 'commander', 'duel_deck', 'draft_innovation', 'from_the_vault', 'masters', 'arsenal', 'spellbook', 'core', 'starter', 'funny', 'planechase']
INVALID_SETS = ['MB1']
LAST_SET = ["Phyrexia: All Will Be One", "Phyrexia: All Will Be One Commander"] # [base set, commander decks]

home_overview = {}

print('Beginning')
print('Deleting csv directory content...', end='\r')

clear_csv_directory()

print('\033[Kcsv directory content deleted \033[92mDone!\033[0m')
print('Geting all printing...', end='\r')

download_file(ALL_PRINTS_URL, './csv')

print('\033[KGeting all printing \033[92mDone!\033[0m')
print('Unzip all printing...', end='\r')

unzip_file('./csv/AllPrintingsCSVFiles.zip', './csv')

print('\033[KUnzip all printing \033[92mDone!\033[0m')
print('Processing all printing...', end='\r')

cards_csv = get_cards_csv()
sets_csv = get_sets_csv(VALID_TYPE_SETS, INVALID_SETS)
get_last_set_for_card = build_get_last_set_for_card(cards_csv, sets_csv)
has_multiple_printings = build_has_multiple_printings(cards_csv, sets_csv)

print('\033[KProcessing all printing \033[92mDone!\033[0m')
print('Getting decklists...', end='\r')

lists = get_decklists_from_db()

print('\033[KGetting decklists \033[92mDone!\033[0m')
print('Processing hashes...', end='\r')

all_competitive_deck_hashes = get_hashes(lists)
data.moxfield.VALID_DECKS = len(all_competitive_deck_hashes)
home_overview['decks'] = data.moxfield.VALID_DECKS

print('\033[KProcesing hashes \033[92mDone!\033[0m')
print('Getting decklists data...', end='\r')

decklists_data = get_decklists_data_from_hashes(all_competitive_deck_hashes)

print('\033[KGetting decklists data \033[92mDone!\033[0m')
print('Pre-Processing decklists data...', end='\r')

mapped_decklists_data = get_decklists_data(decklists_data)
reduced_data = process_cards(reduce_decks_to_cards(mapped_decklists_data, has_multiple_printings, get_last_set_for_card))

print('\033[KPre-Processing decklists data \033[92mDone!\033[0m')
print('Processing decklists data...', end='\r')

home_overview['cards'] = cards_number(reduced_data)
home_overview['staples'] = staples_number(reduced_data, 10)
home_overview['pet'] = pet_cards_number(reduced_data)
home_overview['last_set'] = LAST_SET[0]
home_overview['last_set_top_10'] = last_set_top_10(reduced_data, LAST_SET)

print('\033[KProcessing decklists data \033[92mDone!\033[0m')
print('Saving backup...', end='\r')

backup_file(FILE_PATH, DIRNAME, FOLDER_PATH)

print('\033[KBackup saved \033[92mDone!\033[0m')
print('Saving new file...', end='\r')

create_file(DIRNAME, FILE_PATH, reduced_data)

print('\033[KNew file saved \033[92mDone!\033[0m')
print('Updating home overview...', end='\r')

create_file(DIRNAME, r'public/data/home_overview.json', home_overview)

print('\033[KHome overview saved \033[92mDone!\033[0m')
print('Updating date...', end='\r')

update_db_date(DIRNAME)

print('\033[KDate updated \033[92mDone!\033[0m')
print('Cleaning...', end='\r')

clear_csv_directory()

print('\033[KCleaning \033[92mDone!\033[0m')
time.sleep(1)
print('Uploading changes...', end='\r')

add_all()
commit('chore: update DB')
push()

time.sleep(1)
print('\033[K\033[92mDB Updated!\033[0m')
