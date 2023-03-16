#!/usr/bin/env python3
import os
import time
import data.moxfield
from utils.files import clear_csv_directory, download_file, unzip_file, create_dir, create_file
from data.mtg_json import get_cards_csv, get_sets_csv, build_get_last_set_for_card, build_has_multiple_printings
from data.moxfield import get_decklists_from_bookmark, get_decklist_hashes_from_bookmark, get_decklists_data_from_hashes
from data.pre_processing import get_decklists_data, reduce_decks_to_cards, process_cards
from data.processing import cards_number, staples_number, pet_cards_number, last_set_top_10
from utils.git import add_all, commit, push
from utils.logs import simple_log, begin_log_block, end_log_block, success_log

TOURNAMENT_DECKLISTS_BOOKMARK_ID = 'YdDnv'
TOURNAMENT_ID = 'oasis_1'

DIRNAME = os.path.realpath('.')
FOLDER_PATH = rf'public/data/tournaments/{TOURNAMENT_ID}/cards'
FILE_PATH = FOLDER_PATH + r'/competitiveCards.json'
ALL_PRINTS_URL = 'https://mtgjson.com/api/v5/AllPrintingsCSVFiles.zip'
VALID_TYPE_SETS = ['expansion', 'commander', 'duel_deck', 'draft_innovation', 'from_the_vault', 'masters', 'arsenal', 'spellbook', 'core', 'starter', 'funny', 'planechase']
INVALID_SETS = ['MB1']
LAST_SET = ["The Brothers' War", "The Brothers' War Commander"] # [base set, commander decks]

home_overview = {}

simple_log('Beginning')
begin_log_block('Deleting csv directory content')

clear_csv_directory()

end_log_block('csv directory content deleted')
begin_log_block('Geting all printing')

download_file(ALL_PRINTS_URL, './csv')

end_log_block('Geting all printing')
begin_log_block('Unzip all printing')

unzip_file('./csv/AllPrintingsCSVFiles.zip', './csv')

end_log_block('Unzip all printing')
begin_log_block('Processing all printing')

cards_csv = get_cards_csv()
sets_csv = get_sets_csv(VALID_TYPE_SETS, INVALID_SETS)
get_last_set_for_card = build_get_last_set_for_card(cards_csv, sets_csv)
has_multiple_printings = build_has_multiple_printings(cards_csv, sets_csv)

end_log_block('Processing all printing')
begin_log_block('Getting decklists')

lists = get_decklists_from_bookmark(TOURNAMENT_DECKLISTS_BOOKMARK_ID)

end_log_block('Getting decklists')
begin_log_block('Processing hashes')

all_competitive_deck_hashes = get_decklist_hashes_from_bookmark(lists)
data.moxfield.VALID_DECKS = len(all_competitive_deck_hashes)
home_overview['decks'] = data.moxfield.VALID_DECKS

end_log_block('Procesing hashes')
begin_log_block('Getting decklists data')

decklists_data = get_decklists_data_from_hashes(all_competitive_deck_hashes)

end_log_block('Getting decklists data')
begin_log_block('Pre-Processing decklists data')

mapped_decklists_data = get_decklists_data(decklists_data)
reduced_data = process_cards(reduce_decks_to_cards(mapped_decklists_data, has_multiple_printings, get_last_set_for_card))

end_log_block('Pre-Processing decklists data')
begin_log_block('Processing decklists data')

home_overview['cards'] = cards_number(reduced_data)
home_overview['staples'] = staples_number(reduced_data, 10)
home_overview['staples_small'] = staples_number(reduced_data, 5)
home_overview['pet'] = pet_cards_number(reduced_data)
home_overview['last_set'] = LAST_SET[0]
home_overview['last_set_top_10'] = last_set_top_10(reduced_data, LAST_SET)

end_log_block('Processing decklists data')
begin_log_block('Saving new file')

create_dir(FOLDER_PATH)
create_file(DIRNAME, FILE_PATH, reduced_data)

end_log_block('New file saved')
begin_log_block('Updating home overview')

create_file(DIRNAME, rf'public/data/tournaments/{TOURNAMENT_ID}/home_overview.json', home_overview)

end_log_block('Home overview saved')
begin_log_block('Cleaning')

clear_csv_directory()

end_log_block('Cleaning')
time.sleep(1)
begin_log_block('Uploading changes')

add_all()
commit(r'chore: update tournament {TOURNAMENT_ID}')
push()

time.sleep(1)
success_log('DB Updated!')
