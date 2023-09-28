import subprocess
import utils.files as files
import data.moxfield as moxfield
import utils.logs as logs
import data.moxfield_t as moxfield_t
from data import edhtop16
import data.mtg_json as mtg_json
import data.pre_processing as pre_processing
import data.processing as processing

BASE_PATH = r'./public/data'
METAGAME_PATH = rf'{BASE_PATH}/metagame'
FORCE_UPDATE = False
LAST_SET = ["Wilds of Eldraine", "Wilds of Eldraine Commander"] # [base set, commander decks]

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

# GET DATA FROM EDHTOP16
logs.begin_log_block('Getting decklists from EDH Top 16')
raw_lists = edhtop16.get_metagame_top_decklists()
logs.end_log_block('Decklists from EDH Top 16 got')

# PRE-PREPROCESS EDHTOP16 DATA
logs.begin_log_block('Preprocessing EDH Top 16 data')
commanders = edhtop16.get_commanders_from_data(raw_lists)
decklist_hashes_by_commander = edhtop16.get_decklist_hashes_by_commander(raw_lists)
decklist_hashes_by_tournament = edhtop16.get_decklist_hashes_by_tournament(raw_lists)
logs.end_log_block('EDH Top 16 data preprocessed')

# LOAD SAVED DECKLISTS
logs.begin_log_block('Loading saved decklists')
decklists_by_hash: dict[str, moxfield_t.DecklistV3] = files.read_json_file(METAGAME_PATH, 'decklists.json') if not FORCE_UPDATE else {}
logs.end_log_block('Saved decklists loaded')

# GET DECKLISTS FROM HASHES (NOT SAVED)
logs.begin_log_block('Getting decklists from hashes')
decklists_by_commander: dict[str, list[moxfield_t.DecklistV3]] = {}
total_lists = len(raw_lists)
cant_hashes_requested = 0
no_new_data = True
to_delete = []
cant_decklists_by_hash = {}
for commander in commanders:
  decklists_by_commander[commander] = []
  for hash in decklist_hashes_by_commander[commander]:
    logs.loading_log("Getting decklists from hashes", cant_hashes_requested, total_lists)
    if hash in decklists_by_hash.keys():
      if 'status' in list(decklists_by_hash[hash].keys()):
        cant_hashes_requested += 1
        continue
      if hash in cant_decklists_by_hash.keys():
        cant_decklists_by_hash[hash] += 1
      else:
        cant_decklists_by_hash[hash] = 1
      decklists_by_commander[commander].append(decklists_by_hash[hash])
    else:
      decklist = moxfield.get_decklists_data(hash, version=3, no_log=True)
      if 'status' in list(decklist.keys()):
        cant_hashes_requested += 1
        continue
      decklists_by_commander[commander].append(decklist)
      decklists_by_hash[hash] = decklist
      cant_decklists_by_hash[hash] = 1
      no_new_data = False
    cant_hashes_requested += 1
  if(len(decklists_by_commander[commander]) == 0):
    to_delete.append(commander)

for commander in to_delete:
  del decklists_by_commander[commander]
  commanders.remove(commander)
  del decklist_hashes_by_commander[commander]


# SAVE DECKLISTS
if not no_new_data:
  files.create_file_with_log(METAGAME_PATH, 'decklists.json', decklists_by_hash, 'Saving decklists', 'Decklists saved!')

full_decklists = []

for hash in decklists_by_hash.keys():
  for _ in range(cant_decklists_by_hash[hash]):
    full_decklists.append(decklists_by_hash[hash])

moxfield.VALID_DECKS = len(full_decklists)

logs.end_log_block('Decklists from hashes got')

# PROCESS DATA FROM EDHTOP16 AND MOXFIELD
logs.begin_log_block('Processing data')
condensed_commanders_data = edhtop16.get_condensed_commanders_data(commanders, raw_lists)
stats_by_commander = edhtop16.get_commander_stats_by_commander(commanders, raw_lists, decklists_by_commander)
metagame_resume = edhtop16.get_metagame_resume(commanders, raw_lists, stats_by_commander, decklist_hashes_by_tournament)
logs.end_log_block('Data processed!')

# PROCESS CARDS
logs.begin_log_block('Processing cards')
metagame_cards = pre_processing.process_cards(pre_processing.reduce_decks_to_cards(pre_processing.get_decklists_data(full_decklists), has_multiple_printings, get_last_set_for_card))
metagame_resume['lastSet'] = LAST_SET[0]
metagame_resume['lastSetTop10'] = processing.last_set_top_10(metagame_cards, LAST_SET)
metagame_cards = processing.get_cards_winrate(metagame_cards, raw_lists)
logs.end_log_block('Cards processed!')

# SAVE CARDS
files.create_new_file('', METAGAME_PATH, 'metagame_cards.json', metagame_cards)

# UPDATE TAGS
subprocess.Popen(['python3', 'scripts/update_tags.py']).wait()

# PROCESS CARDS BY COMMANDER
logs.begin_log_block('Processing cards by commander')
metagame_cards_by_commander = {}
for commander in commanders:
  metagame_cards_by_commander[commander] = pre_processing.process_cards(pre_processing.reduce_decks_to_cards(pre_processing.get_decklists_data(decklists_by_commander[commander]), has_multiple_printings, get_last_set_for_card))
  metagame_cards_by_commander[commander] = processing.get_cards_winrate(metagame_cards_by_commander[commander], raw_lists)
logs.end_log_block('Cards by commander processed!')

# SAVE NEW FILES
files.create_new_file('', METAGAME_PATH, 'condensed_commanders_data.json', condensed_commanders_data)
files.create_new_file('', METAGAME_PATH, 'stats_by_commander.json', stats_by_commander)
files.create_new_file('', METAGAME_PATH, 'metagame_resume.json', metagame_resume)
files.create_new_file('', METAGAME_PATH, 'metagame_cards_by_commander.json', metagame_cards_by_commander)

# CLEANING
files.clear_csv_directory()

