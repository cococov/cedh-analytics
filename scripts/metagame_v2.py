import os
import json
import subprocess
import utils.date as u_date
import utils.files as files
import data.moxfield as moxfield
import utils.logs as logs
import utils.git as git
import data.moxfield_t as moxfield_t
import data.edhtop16_t as edhtop16_t
import data.mtg_json as mtg_json
import data.pre_processing as pre_processing
import data.processing as processing
import data.edhtop16 as edhtop16
from datetime import datetime
import utils.misc as misc

DIRNAME = os.path.realpath('.')
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
# Hacemos el corte en torneos con al menos 52 jugadores y solo tomamos en cuenta a jugadores con al menos 2 wins o la data crece mucho y queda sucia.
raw_lists = edhtop16.get_metagame_top_decklists(min_wins=2, min_tournament_size=52)
# Para los torneos tomamos en cuenta toda la data pero igual hacemos el corte en torneos con al menos 52 jugadores.
all_raw_lists = edhtop16.get_metagame_top_decklists(min_wins=0, min_tournament_size=52)
logs.end_log_block('Decklists from EDH Top 16 got')

# PRE-PREPROCESS EDHTOP16 DATA
logs.begin_log_block('Preprocessing EDH Top 16 data')
raw_lists_by_hash = edhtop16.index_decklists_by_hash(raw_lists)
commanders = edhtop16.get_commanders_from_data(raw_lists)
decklist_hashes_by_commander = edhtop16.get_decklist_hashes_by_commander(raw_lists)
decklist_hashes_by_tournament = edhtop16.get_decklist_hashes_by_tournament(raw_lists)

all_raw_lists_by_hash = edhtop16.index_decklists_by_hash(all_raw_lists)
all_commanders = edhtop16.get_commanders_from_data(all_raw_lists)
all_decklist_hashes_by_commander = edhtop16.get_decklist_hashes_by_commander(all_raw_lists)
all_decklist_hashes_by_tournament = edhtop16.get_decklist_hashes_by_tournament(all_raw_lists)
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
      if 'status' in list(decklists_by_hash[hash].keys()): # status in response usually means error 404
        cant_hashes_requested += 1
        continue
      if hash in cant_decklists_by_hash.keys():
        cant_decklists_by_hash[hash] += 1
      else:
        cant_decklists_by_hash[hash] = 1
      decklists_by_commander[commander].append(decklists_by_hash[hash])
    else:
      decklist = moxfield.get_decklists_data(hash, version=3, no_log=True)
      if 'status' in list(decklist.keys()): # status in response usually means error 404
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
  for _ in range(cant_decklists_by_hash[hash] if hash in cant_decklists_by_hash.keys() else 1):
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

# USE OF CARD TYPES
logs.begin_log_block('Calculating use of card types')
uses_by_card_types = processing.get_uses_by_card_types(full_decklists)
metagame_resume['useOfCards'] = {**metagame_resume['useOfCards'], **uses_by_card_types}
logs.end_log_block('Use of card types calculated!')

# PROCESS CARDS BY COMMANDER
logs.begin_log_block('Processing cards by commander')
metagame_cards_by_commander = {}
for commander in commanders:
  metagame_cards_by_commander[commander] = pre_processing.process_cards(pre_processing.reduce_decks_to_cards(pre_processing.get_decklists_data(decklists_by_commander[commander]), has_multiple_printings, get_last_set_for_card))
  metagame_cards_by_commander[commander] = processing.get_cards_winrate(metagame_cards_by_commander[commander], raw_lists)
  stats_by_commander[commander]['lastSet'] = LAST_SET[0]
  stats_by_commander[commander]['lastSetTop10'] = processing.last_set_top_10(metagame_cards_by_commander[commander], LAST_SET)
  uses_by_card_types = processing.get_uses_by_card_types(decklists_by_commander[commander])
  stats_by_commander[commander]['useOfCards'] = {**stats_by_commander[commander]['useOfCards'], **uses_by_card_types}
logs.end_log_block('Cards by commander processed!')

# PROCESS TOURNAMENTS

# LOAD SAVED DECKLISTS
logs.begin_log_block('Loading saved tournaments')
tournaments: list[edhtop16_t.Tournament] = files.read_json_file(METAGAME_PATH, 'tournaments.json', []) if not FORCE_UPDATE else []
logs.end_log_block('Saved tournaments loaded')

# GET TOURNAMENTS RESUME
logs.begin_log_block('Getting tournaments list')
tournaments = edhtop16.get_tournaments_resume(tournaments, list(all_decklist_hashes_by_tournament.keys()))
logs.end_log_block('Tournaments list got!')

#[X] iterar por los torneos no procesados
#[X] obtener lista de decklists
#[X] cargar decklists guardadas que no están en el json de decklists base desde la carpeta del torneo
#[X] descargar y mezclar decklists del torneo que no están en el json de decklists base
#[X] guardar decklists que no están en el json de decklists base en carpeta de torneo (ignorar el archivo en git)
#[X] obtener get_commander_stats_by_commander para cada torneo
#[X] obtener get_metagame_resume para cada torneo
#[] obtener metagame_cards para cada torneo
#[] No obtendremos data por comandante para cada torneo, solo la data general
#[] Actualizar en la lista de torneos los torneos como procesados
list_of_tournaments_to_process = all_decklist_hashes_by_tournament.keys()

logs.begin_log_block(f'Processing tournaments')
cant_tournament_processed = 0
commanders_by_hash = {}
for commander in all_decklist_hashes_by_commander.keys():
  for hash in all_decklist_hashes_by_commander[commander]:
    commanders_by_hash[hash] = commander
logs.loading_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% - ", 0, 0)
for tournament in list_of_tournaments_to_process:
  tournament_decklists_by_hash = files.read_json_file(f"{METAGAME_PATH}/{tournament}", 'decklists.t.json') if not FORCE_UPDATE else {}
  tournament_raw_lists = []
  tournament_commanders = []
  tournament_decklists_by_commander = {}
  cant_tournament_decklists_processed = 0
  has_changes = False
  for hash in all_decklist_hashes_by_tournament[tournament]:
    if hash in tournament_decklists_by_hash.keys():
      if 'status' in list(tournament_decklists_by_hash[hash].keys()):
        continue
      tournament_commanders.append(commanders_by_hash[hash])
      tournament_raw_lists.append(all_raw_lists_by_hash[hash])
      if all_raw_lists_by_hash[hash]['commander'] not in tournament_decklists_by_commander.keys():
        tournament_decklists_by_commander[all_raw_lists_by_hash[hash]['commander']] = []
      tournament_decklists_by_commander[all_raw_lists_by_hash[hash]['commander']].append(tournament_decklists_by_hash[hash])
    else:
      if hash in decklists_by_hash.keys():
        if 'status' in list(decklists_by_hash[hash].keys()): # status in response usually means error 404
          continue
        tournament_commanders.append(commanders_by_hash[hash])
        tournament_raw_lists.append(all_raw_lists_by_hash[hash])
        tournament_decklists_by_hash[hash] = decklists_by_hash[hash]
        if all_raw_lists_by_hash[hash]['commander'] not in tournament_decklists_by_commander.keys():
          tournament_decklists_by_commander[all_raw_lists_by_hash[hash]['commander']] = []
        tournament_decklists_by_commander[all_raw_lists_by_hash[hash]['commander']].append(decklists_by_hash[hash])
      else:
        decklist = moxfield.get_decklists_data(hash, version=3, no_log=True)
        if 'status' in list(decklist.keys()): # status in response usually means error 404
          continue
        tournament_commanders.append(commanders_by_hash[hash])
        tournament_raw_lists.append(all_raw_lists_by_hash[hash])
        if all_raw_lists_by_hash[hash]['commander'] not in tournament_decklists_by_commander.keys():
          tournament_decklists_by_commander[all_raw_lists_by_hash[hash]['commander']] = []
        tournament_decklists_by_commander[all_raw_lists_by_hash[hash]['commander']].append(decklist)
        tournament_decklists_by_hash[hash] = decklist
        decklists_by_hash[hash] = decklist
      has_changes = True
    logs.loading_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% - ", cant_tournament_decklists_processed, len(all_decklist_hashes_by_tournament[tournament]))
    cant_tournament_decklists_processed += 1
  if has_changes:
    files.create_new_file('', f"{METAGAME_PATH}/{tournament}", 'decklists.t.json', tournament_decklists_by_hash, with_log=False)

  tournament_commanders = list(set(tournament_commanders))

  tournament_stats_by_commander = edhtop16.get_commander_stats_by_commander(tournament_commanders, tournament_raw_lists, tournament_decklists_by_commander)
  tournament_metagame_resume = edhtop16.get_metagame_resume(tournament_commanders, tournament_raw_lists, tournament_stats_by_commander, dict(zip([tournament], [all_decklist_hashes_by_tournament[tournament]])))
  cant_tournament_processed += 1
  cant_tournament_decklists_processed += 1

  tournament_obj = tournaments[[x['name'] for x in tournaments].index(tournament)] # Obtenemos el objeto del torneo para actualizar
  # Si el torneo está mal subido y no tiene ni siquiera 16 decklists válidas, lo ignoramos
  tournaments = [x for x in tournaments if x['name'] != tournament]
  if tournament_metagame_resume['cantLists'] >= 16:
    # Solo guardamos el torneo si tiene la suficiente cantidad de listas válidas
    files.create_new_file('', f"{METAGAME_PATH}/{tournament}", 'metagame_resume.json', tournament_metagame_resume, with_log=False)
    # Actualizamos el torneo como procesado
    tournaments.append({**tournament_obj, 'processed': True})
logs.end_log_block('Tournaments processed!')

# SAVE TOURNAMENTS
logs.begin_log_block('Updating tournaments list')
files.create_new_file('', METAGAME_PATH, 'tournaments.json', tournaments)
logs.end_log_block('Tournaments list saved!')

# SAVE NEW FILES
files.create_new_file('', METAGAME_PATH, 'condensed_commanders_data.json', condensed_commanders_data)
files.create_new_file('', METAGAME_PATH, 'stats_by_commander.json', stats_by_commander)
files.create_new_file('', METAGAME_PATH, 'metagame_resume.json', metagame_resume)
files.create_new_file('', METAGAME_PATH, 'metagame_cards_by_commander.json', metagame_cards_by_commander)

# CLEANING
files.clear_csv_directory()

print('Updating date...', end='\r')

update_date = {}
update_date_path = os.path.join(DIRNAME, r'public/data/update_date.json')
with open(update_date_path, 'r+') as f:
  update_date = json.load(f) if os.stat(update_date_path).st_size > 0 else {}

update_date['metagame'] = u_date.custom_strftime('%B {S}, %Y', datetime.today())

with open(update_date_path, 'w', encoding='utf8') as f:
  json.dump(update_date, f, ensure_ascii=False)

print('\033[KDate updated \033[92mDone!\033[0m')

# GIT
#git.update_to_new_branch('chore: update Metagame', 'chore/update_metagame')
