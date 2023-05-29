#!/usr/bin/env python3
import os
import json
import utils.files as files
import utils.git as git
import utils.logs as logs
import data.moxfield as moxfield
import data.eminence as eminence
import data.mtg_json as mtg_json
import data.pre_processing as pre_processing
import data.processing as processing

TOURNAMENT_ID = 'carrot_compost_1'

tournament_json_file = open('public/data/tournaments/list.json')
TOURNAMENTS_INFO = next(filter(lambda x: x['id'] == TOURNAMENT_ID, json.load(tournament_json_file)), None)

if TOURNAMENTS_INFO is None:
  logs.error_log(f'Tournament with id {TOURNAMENT_ID} not found')
  exit(1)

TOURNAMENT_BOOKMARK_ID = TOURNAMENTS_INFO['bookmark']
TOURNAMENT_NAME = TOURNAMENTS_INFO['name']
KIND = TOURNAMENTS_INFO['kind']
tournament_json_file.close()

DIRNAME = os.path.realpath('.')
PARENT_FOLDER_PATH = rf'public/data/tournaments/{TOURNAMENT_ID}'
FOLDER_PATH = rf'{PARENT_FOLDER_PATH}/cards'
FILE_NAME = r'/competitiveCards.json'
OVERVIEW_PATH = rf'{PARENT_FOLDER_PATH}/home_overview.json'
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
if KIND == 'moxfield_bookmark':
  lists = moxfield.get_decklists_from_bookmark(TOURNAMENT_BOOKMARK_ID)
elif KIND == 'eminence':
  lists = eminence.get_all_decklists(TOURNAMENT_NAME)
  logs.error_log('KIND eminence not implemented yet')
  files.clear_csv_directory()
  exit(1)
else:
  logs.error_log(f'KIND {KIND} not implemented')
  files.clear_csv_directory()
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
files.create_new_file(DIRNAME, FOLDER_PATH, FILE_NAME, reduced_data)

# UPDATE HOME OVERVIEW
files.update_home_overview(DIRNAME, OVERVIEW_PATH, home_overview)

# CLEANING
files.clear_csv_directory()

# GIT
git.update(f'chore: update tournament {TOURNAMENT_ID}')
