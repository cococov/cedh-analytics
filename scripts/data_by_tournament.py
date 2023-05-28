#!/usr/bin/env python3
import os
import time
import json
import utils.files as files
import utils.git as git
import utils.logs as logs
import data.moxfield as moxfield
import data.mtg_json as mtg_json
import data.pre_processing as pre_processing
import data.processing as processing

TOURNAMENT_ID = 'carrot_compost_1'

tournament_json_file = open('public/data/tournaments/list.json')
TOURNAMENTS_INFO = next(filter(lambda x: x['id'] == TOURNAMENT_ID, json.load(tournament_json_file)))
TOURNAMENT_DECKLISTS_BOOKMARK_ID = TOURNAMENTS_INFO['bookmark']
KIND = TOURNAMENTS_INFO['kind']
tournament_json_file.close()

DIRNAME = os.path.realpath('.')
FOLDER_PATH = rf'public/data/tournaments/{TOURNAMENT_ID}/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
ALL_PRINTS_URL = 'https://mtgjson.com/api/v5/AllPrintingsCSVFiles.zip'
VALID_TYPE_SETS = ['expansion', 'commander', 'duel_deck', 'draft_innovation', 'from_the_vault', 'masters', 'arsenal', 'spellbook', 'core', 'starter', 'funny', 'planechase']
INVALID_SETS = ['MB1']
LAST_SET = ["The Brothers' War", "The Brothers' War Commander"] # [base set, commander decks]

home_overview = {}

logs.simple_log('Beginning')

# DELETE CSV DIRECTORY CONTENT
files.clear_csv_directory()

# DOWNLOAD ALL PRINTS
files.download_file(ALL_PRINTS_URL, './csv')

# UNZIP ALL PRINTS
files.unzip_file('./csv/AllPrintingsCSVFiles.zip', './csv')

# GET CARDS INFO AND SETS
logs.begin_log_block('Processing all printing')
cards_csv = mtg_json.get_cards_csv()
sets_csv = mtg_json.get_sets_csv(VALID_TYPE_SETS, INVALID_SETS)
get_last_set_for_card = mtg_json.build_get_last_set_for_card(cards_csv, sets_csv)
has_multiple_printings = mtg_json.build_has_multiple_printings(cards_csv, sets_csv)
logs.end_log_block('Processing all printing')

# GET DECKLISTS
logs.begin_log_block('Getting decklists')
lists = {}
if KIND == 'bookmark':
  lists |= moxfield.get_decklists_from_bookmark(TOURNAMENT_DECKLISTS_BOOKMARK_ID)
elif KIND == 'eminence':
  logs.error_log('KIND eminence not implemented yet')
  logs.begin_log_block('Cleaning')
  files.clear_csv_directory()
  logs.end_log_block('Cleaning')
  exit(1)
logs.end_log_block('Getting decklists')

# PROCESSING HASHES
logs.begin_log_block('Processing hashes')
all_competitive_deck_hashes = moxfield.get_decklist_hashes_from_bookmark(lists)
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
home_overview['staples_small'] = processing.staples_number(reduced_data, 5)
home_overview['pet'] = processing.pet_cards_number(reduced_data)
home_overview['last_set'] = LAST_SET[0]
home_overview['last_set_top_10'] = processing.last_set_top_10(reduced_data, LAST_SET)
logs.end_log_block('Processing decklists data')

# SAVE NEW FILE
logs.begin_log_block('Saving new file')
files.create_dir(FOLDER_PATH)
files.create_file(DIRNAME, FILE_PATH, reduced_data)
logs.end_log_block('New file saved')

# UPDATE HOME OVERVIEW
logs.begin_log_block('Updating home overview')
files.create_file(DIRNAME, rf'public/data/tournaments/{TOURNAMENT_ID}/home_overview.json', home_overview)
logs.end_log_block('Home overview saved')

# CLEANING
logs.begin_log_block('Cleaning')
files.clear_csv_directory()
logs.end_log_block('Cleaning')
time.sleep(1)

# GIT
logs.begin_log_block('Uploading changes')
git.add_all()
git.commit(f'chore: update tournament {TOURNAMENT_ID}')
git.push()
time.sleep(1)

logs.success_log('DB Updated!')
