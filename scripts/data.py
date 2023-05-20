#!/usr/bin/env python3
import os
import time
import utils.files as files
import utils.git as git
import utils.logs as logs
import data.moxfield as moxfield
import data.mtg_json as mtg_json
import data.cedh_db as cedh_db
import data.pre_processing as pre_processing
import data.processing as processing

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
ALL_PRINTS_URL = 'https://mtgjson.com/api/v5/AllPrintingsCSVFiles.zip'
VALID_TYPE_SETS = ['expansion', 'commander', 'duel_deck', 'draft_innovation', 'from_the_vault', 'masters', 'arsenal', 'spellbook', 'core', 'starter', 'funny', 'planechase']
INVALID_SETS = ['MB1']
LAST_SET = ["March of the Machine", "March of the Machine Commander"] # [base set, commander decks]

home_overview = {}

logs.simple_log('Beginning')

# DELETE CSV DIRECTORY CONTENT
logs.begin_log_block('Deleting csv directory content')
files.clear_csv_directory()
logs.end_log_block('csv directory content deleted')

# DOWNLOAD ALL PRINTS
logs.begin_log_block('Getting all printing')
files.download_file(ALL_PRINTS_URL, './csv')
logs.end_log_block('Getting all printing')

# UNZIP ALL PRINTS
logs.begin_log_block('Unzip all printing')
files.unzip_file('./csv/AllPrintingsCSVFiles.zip', './csv')
logs.end_log_block('Unzip all printing')

# GET CARDS INFO AND SETS
logs.begin_log_block('Processing all printing')
cards_csv = mtg_json.get_cards_csv()
sets_csv = mtg_json.get_sets_csv(VALID_TYPE_SETS, INVALID_SETS)
get_last_set_for_card = mtg_json.build_get_last_set_for_card(cards_csv, sets_csv)
has_multiple_printings = mtg_json.build_has_multiple_printings(cards_csv, sets_csv)
logs.end_log_block('Processing all printing')

# GET DECKLISTS
logs.begin_log_block('Getting decklists')
lists = cedh_db.get_decklists_from_db()
logs.end_log_block('Getting decklists')

# PROCESSING HASHES
logs.begin_log_block('Processing hashes')
all_competitive_deck_hashes = cedh_db.get_hashes(lists)
moxfield.VALID_DECKS = len(all_competitive_deck_hashes)
home_overview['decks'] = moxfield.VALID_DECKS
logs.end_log_block('Processing hashes')

# GET DECKLISTS DATA
logs.begin_log_block('Getting decklists data')
decklists_data = moxfield.get_decklists_data_from_hashes(all_competitive_deck_hashes)
logs.end_log_block('Getting decklists data')

# PRE-PROCESSING DECKLISTS DATA
logs.begin_log_block('Pre-Processing decklists data')
mapped_decklists_data = pre_processing.get_decklists_data(decklists_data)
reduced_data = pre_processing.process_cards(pre_processing.reduce_decks_to_cards(mapped_decklists_data, has_multiple_printings, get_last_set_for_card))
logs.end_log_block('Pre-Processing decklists data')

# PROCESSING DECKLISTS DATA
logs.begin_log_block('Processing decklists data')
home_overview['cards'] = processing.cards_number(reduced_data)
home_overview['staples'] = processing.staples_number(reduced_data, 10)
home_overview['pet'] = processing.pet_cards_number(reduced_data)
home_overview['last_set'] = LAST_SET[0]
home_overview['last_set_top_10'] = processing.last_set_top_10(reduced_data, LAST_SET)
logs.end_log_block('Processing decklists data')

# SAVE BACKUP
logs.begin_log_block('Saving backup')
files.backup_file(FILE_PATH, DIRNAME, FOLDER_PATH)
logs.end_log_block('Backup saved')

# SAVE NEW FILE
logs.begin_log_block('Saving new file')
files.create_file(DIRNAME, FILE_PATH, reduced_data)
logs.end_log_block('New file saved')

# UPDATE HOME OVERVIEW
logs.begin_log_block('Updating home overview')
files.create_file(DIRNAME, r'public/data/home_overview.json', home_overview)
logs.end_log_block('Home overview saved')

# UPDATE DB UPDATE DATE
logs.begin_log_block('Updating date')
files.update_db_date(DIRNAME)
logs.end_log_block('Date updated')

# CLEANING
logs.begin_log_block('Cleaning')
files.clear_csv_directory()
logs.end_log_block('Cleaning')
time.sleep(1)

# GIT
logs.begin_log_block('Uploading changes')
git.add_all()
git.commit('chore: update DB')
git.push()
time.sleep(1)

logs.success_log('DB Updated!')
