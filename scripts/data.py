#!/usr/bin/env python3
import os
import subprocess
import utils.files as files
import utils.git as git
import utils.logs as logs
import data.moxfield as moxfield
import data.mtg_json as mtg_json
import data.cedh_db as cedh_db
import data.pre_processing as pre_processing
import data.processing as processing
import db.update as update_db

""" DB data script.
Get all the cards from the cEDH DB lists and process them to get the data for the website, using sources like Moxfield and Scryfall.
The result is saved in the file `public/data/cards/competitiveCards.json`.
"""

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
HOME_OVERVIEW_PATH = r'public/data/home_overview.json'
LAST_SET = ["Fallout", "Fallout Commander"] # [base set, commander decks, optional 3rd set]

home_overview = {}

logs.simple_log('Beginning')

# DELETE CSV DIRECTORY CONTENT
files.clear_csv_directory()

# DOWNLOAD ALL PRINTS
mtg_json.download_csv_files()

# GET CARDS INFO AND SETS
logs.begin_log_block('Processing all printing')
cards_csv = mtg_json.get_cards_csv()
sets_csv = mtg_json.get_sets_csv()
get_last_set_for_card = mtg_json.build_get_last_set_for_card(cards_csv, sets_csv)
has_multiple_printings = mtg_json.build_has_multiple_printings(cards_csv, sets_csv)
logs.end_log_block('Processing all printing')

# GET DECKLISTS
lists = cedh_db.get_decklists_from_db()

# PROCESSING HASHES
logs.begin_log_block('Processing hashes')
all_competitive_deck_hashes = cedh_db.get_hashes(lists)
moxfield.VALID_DECKS = len(all_competitive_deck_hashes)
home_overview['decks'] = moxfield.VALID_DECKS
logs.end_log_block('Processing hashes')

# GET DECKLISTS DATA
decklists_data = moxfield.get_decklists_data_from_hashes(all_competitive_deck_hashes)

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
files.backup_file(FILE_PATH, DIRNAME, FOLDER_PATH)

# SAVE NEW FILE
files.create_data_file(DIRNAME, FILE_PATH, reduced_data)

# UPDATE HOME OVERVIEW
files.update_home_overview(DIRNAME, HOME_OVERVIEW_PATH, home_overview)

# UPDATE DB UPDATE DATE
files.update_db_date(DIRNAME)

# CLEANING
files.clear_csv_directory()

# Update tags
subprocess.Popen(['python3', 'scripts/update_tags.py']).wait()

# GIT
git.update_to_new_branch('chore: update DB', 'chore/update_db')

# UPDATE DB
update_db.update_db_cards()
