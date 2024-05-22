#!/usr/bin/env python3
"""
cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2022-present CoCoCov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Original Repo: https://github.com/cococov/cedh-analytics
https://www.cedh-analytics.com/
"""

import os
import json
import subprocess
import utils.files as files
import utils.git as git
import utils.logs as logs
import utils.misc as misc
import data.moxfield as moxfield
import scripts.data.edhtop16 as edhtop16
import data.mtg_json as mtg_json
import data.pre_processing as pre_processing
import data.processing as processing

""" Tournaments data script.
Get all the cards from the DB and process them to get the data for the website, using sources like Moxfield and Scryfall.
The result is saved in the file `public/data/tournaments/{TOURNAMENT_ID}/cards/competitiveCards.json`.
"""

ALL_TOURNAMENTS = False

DIRNAME = os.path.realpath('.')
tournament_json_file = open('public/data/tournaments/list.json')
tournament_json = json.load(open('public/data/tournaments/list.json'))
FILE_NAME = r'/competitiveCards.json'

def run_setup(t_id):
  global TOURNAMENT_ID, VALID_DECKS, TOURNAMENTS_INFO, PARENT_FOLDER_PATH, FOLDER_PATH, OVERVIEW_PATH, tournament_json
  TOURNAMENT_ID = t_id
  TOURNAMENTS_INFO = next(filter(lambda x: x['id'] == TOURNAMENT_ID, tournament_json), {})

  if not bool(TOURNAMENTS_INFO):
    logs.error_log(f'Tournament with id {TOURNAMENT_ID} not found')
    tournament_json_file.close()
    exit(1)


  PARENT_FOLDER_PATH = rf'public/data/tournaments/{TOURNAMENT_ID}'
  FOLDER_PATH = rf'{PARENT_FOLDER_PATH}/cards'
  OVERVIEW_PATH = rf'{PARENT_FOLDER_PATH}/home_overview.json'

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

def get_data_and_process():
  # GET DECKLISTS AND PROCESS HASHES
  logs.begin_log_block('Getting decklists')
  lists = {}
  all_competitive_deck_hashes = []
  if TOURNAMENTS_INFO['kind'] == 'moxfield_bookmark':
    lists = moxfield.get_decklists_from_bookmark(TOURNAMENTS_INFO['bookmark'])
    logs.end_log_block('Getting decklists')
    logs.begin_log_block('Processing hashes')
    all_competitive_deck_hashes = moxfield.get_decklist_hashes_from_bookmark(lists)
  elif TOURNAMENTS_INFO['kind'] == 'eminence':
    lists = edhtop16.get_all_decklists_by_tournament(TOURNAMENTS_INFO['name'])
    logs.end_log_block('Getting decklists')
    logs.begin_log_block('Processing hashes')
    all_competitive_deck_hashes = edhtop16.get_decklist_hashes_from_tournament(lists)
  else:
    misc.error_and_close(f"KIND {TOURNAMENTS_INFO['kind']} not implemented")
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
  logs.end_log_block('Processing decklists data')

  # SAVE NEW FILE
  files.create_new_file(DIRNAME, FOLDER_PATH, FILE_NAME, reduced_data)

  # UPDATE HOME OVERVIEW
  files.update_home_overview(DIRNAME, OVERVIEW_PATH, home_overview)

  # Commit tournament
  if ALL_TOURNAMENTS: git.add_and_commit_tournament(TOURNAMENT_ID)

# Do the thing
if ALL_TOURNAMENTS:
  for t in tournament_json:
    run_setup(t['id'])
    moxfield.VALID_DECKS = 0
    moxfield.decklists_data_obtained_number = 0
    get_data_and_process()
else:
  run_setup('carrot_compost_1')
  get_data_and_process()

# CLEANING
files.clear_csv_directory()

# Update tags
subprocess.Popen(['python3', 'scripts/update_tags.py']).wait()

# GIT
if ALL_TOURNAMENTS:
  git.push_with_log()
else:
  git.update_to_new_branch(f'chore: update tournament {TOURNAMENT_ID}', f'chore/update_tournament_{TOURNAMENT_ID}')

# Close file
tournament_json_file.close()
