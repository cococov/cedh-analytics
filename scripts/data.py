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
from utils.logs import simple_log, begin_log_block, end_log_block, success_log

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
ALL_PRINTS_URL = 'https://mtgjson.com/api/v5/AllPrintingsCSVFiles.zip'
VALID_TYPE_SETS = ['expansion', 'commander', 'duel_deck', 'draft_innovation', 'from_the_vault', 'masters', 'arsenal', 'spellbook', 'core', 'starter', 'funny', 'planechase']
INVALID_SETS = ['MB1']
LAST_SET = ["Phyrexia: All Will Be One", "Phyrexia: All Will Be One Commander"] # [base set, commander decks]

home_overview = {}

simple_log('Beginning')

# DELETE CSV DIRECTORY CONTENT
begin_log_block('Deleting csv directory content')
clear_csv_directory()
end_log_block('csv directory content deleted')

# DOWNLOAD ALL PRINTS
begin_log_block('Geting all printing')
download_file(ALL_PRINTS_URL, './csv')
end_log_block('Geting all printing')

# UNZIP ALL PRINTS
begin_log_block('Unzip all printing')
unzip_file('./csv/AllPrintingsCSVFiles.zip', './csv')
end_log_block('Unzip all printing')

# GET CARDS INFO AND SETS
begin_log_block('Processing all printing')
cards_csv = get_cards_csv()
sets_csv = get_sets_csv(VALID_TYPE_SETS, INVALID_SETS)
get_last_set_for_card = build_get_last_set_for_card(cards_csv, sets_csv)
has_multiple_printings = build_has_multiple_printings(cards_csv, sets_csv)
end_log_block('Processing all printing')

# GET DECKLISTS
begin_log_block('Getting decklists')
lists = get_decklists_from_db()
end_log_block('Getting decklists')

# PROCESSING HASHES
begin_log_block('Processing hashes')
all_competitive_deck_hashes = get_hashes(lists)
data.moxfield.VALID_DECKS = len(all_competitive_deck_hashes)
home_overview['decks'] = data.moxfield.VALID_DECKS
end_log_block('Procesing hashes')

# GET DECKLISTS DATA
begin_log_block('Getting decklists data')
decklists_data = get_decklists_data_from_hashes(all_competitive_deck_hashes)
end_log_block('Getting decklists data')

# PRE-PROCESSING DECKLISTS DATA
begin_log_block('Pre-Processing decklists data')
mapped_decklists_data = get_decklists_data(decklists_data)
reduced_data = process_cards(reduce_decks_to_cards(mapped_decklists_data, has_multiple_printings, get_last_set_for_card))
end_log_block('Pre-Processing decklists data')

# PROCESSING DECKLISTS DATA
begin_log_block('Processing decklists data')
home_overview['cards'] = cards_number(reduced_data)
home_overview['staples'] = staples_number(reduced_data, 10)
home_overview['pet'] = pet_cards_number(reduced_data)
home_overview['last_set'] = LAST_SET[0]
home_overview['last_set_top_10'] = last_set_top_10(reduced_data, LAST_SET)
end_log_block('Processing decklists data')

# SAVE BACKUP
begin_log_block('Saving backup')
backup_file(FILE_PATH, DIRNAME, FOLDER_PATH)
end_log_block('Backup saved')

# SAVE NEW FILE
begin_log_block('Saving new file')
create_file(DIRNAME, FILE_PATH, reduced_data)
end_log_block('New file saved')

# UPDATE HOME OVERVIEW
begin_log_block('Updating home overview')
create_file(DIRNAME, r'public/data/home_overview.json', home_overview)
end_log_block('Home overview saved')

# UPDATE DB UPDATE DATE
begin_log_block('Updating date')
update_db_date(DIRNAME)
end_log_block('Date updated')

# CLEANING
begin_log_block('Cleaning')
clear_csv_directory()
end_log_block('Cleaning')
time.sleep(1)

# GIT
begin_log_block('Uploading changes')
add_all()
commit('chore: update DB')
push()
time.sleep(1)

success_log('DB Updated!')
