"""
cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2023-present CoCoCov

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
import db.update as update_db

DIRNAME = os.path.realpath('.')
BASE_PATH = r'./public/data'
METAGAME_PATH = rf'{BASE_PATH}/metagame'
FORCE_UPDATE = False
# Remember to update /images/last_set_image.jpg
LAST_SET = ["Bloomburrow", "Bloomburrow Commander"] # [base set, commander decks, optional 3rd set]

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
# Hacemos el corte en torneos con al menos 48 jugadores y solo tomamos en cuenta a jugadores con al menos 2 wins o la data crece mucho y queda sucia.
raw_lists = edhtop16.get_metagame_top_decklists(min_wins=0, min_tournament_size=48)
logs.end_log_block('Decklists from EDH Top 16 got')

# PRE-PREPROCESS EDHTOP16 DATA
logs.begin_log_block('Preprocessing EDH Top 16 data')
raw_lists_by_hash = edhtop16.index_decklists_by_hash(raw_lists) # TODO: Manejar el caso de que una lista esté en más de un torneo
commanders = edhtop16.get_commanders_from_data(raw_lists)
decklist_hashes_by_commander = edhtop16.get_decklist_hashes_by_commander(raw_lists)
decklist_hashes_by_tournament = edhtop16.get_decklist_hashes_by_tournament(raw_lists)
logs.end_log_block('EDH Top 16 data preprocessed')

# LOAD SAVED DECKLISTS
logs.begin_log_block('Loading saved decklists')
saved_decklists_by_hash: dict[str, moxfield_t.DecklistV3] = files.read_json_file(METAGAME_PATH, 'decklists.json') if not FORCE_UPDATE else {}
logs.end_log_block('Saved decklists loaded')

# GET DECKLISTS FROM HASHES (NOT SAVED)
logs.begin_log_block('Getting decklists from hashes')
decklists_by_commander: dict[str, list[moxfield_t.DecklistV3]] = {}
total_lists = len(raw_lists)
cant_hashes_requested = 0
no_new_data = True
to_delete = []
cant_decklists_by_hash = {}
decklists_by_hash = {}
for commander in commanders:
  decklists_by_commander[commander] = []
  for hash in decklist_hashes_by_commander[commander]:
    logs.loading_log("Getting decklists from hashes", cant_hashes_requested, total_lists)
    if hash in saved_decklists_by_hash.keys():
      if 'status' in list(saved_decklists_by_hash[hash].keys()): # status in response usually means error 404
        cant_hashes_requested += 1
        continue
      if hash in cant_decklists_by_hash.keys():
        cant_decklists_by_hash[hash] += 1
      else:
        cant_decklists_by_hash[hash] = 1
      decklists_by_hash[hash] = saved_decklists_by_hash[hash] # Save the decklists in a new hash to avoid process old ones
      decklists_by_commander[commander].append(decklists_by_hash[hash])
    else:
      decklist: moxfield_t.DecklistV3 = {} # type: ignore
      try:
        decklist = moxfield.get_decklists_data(hash, version=3, no_log=True)
      except Exception:
        cant_hashes_requested += 1
        continue
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
  # Replace old decklists with new ones to avoid process old versions of decklists
  # DO NOT PROCESS OLD TOURNAMENTS OR DECKLISTS COULD CHANGE!
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
  # Nos saltamos commanders sin listas válidas
  if not stats_by_commander[commander]['isValid']:
    continue
  moxfield.VALID_DECKS = len(decklists_by_commander[commander])
  metagame_cards_by_commander[commander] = pre_processing.process_cards(pre_processing.reduce_decks_to_cards(pre_processing.get_decklists_data(decklists_by_commander[commander]), has_multiple_printings, get_last_set_for_card))
  metagame_cards_by_commander[commander] = processing.get_cards_winrate(metagame_cards_by_commander[commander], raw_lists)
  stats_by_commander[commander]['lastSet'] = LAST_SET[0]
  stats_by_commander[commander]['lastSetTop10'] = processing.last_set_top_10(metagame_cards_by_commander[commander], LAST_SET)
  uses_by_card_types = processing.get_uses_by_card_types(decklists_by_commander[commander])
  stats_by_commander[commander]['useOfCards'] = {**stats_by_commander[commander]['useOfCards'], **uses_by_card_types}
logs.end_log_block('Cards by commander processed!')

# PROCESS TOURNAMENTS

# LOAD SAVED TOURNAMENTS
logs.begin_log_block('Loading saved tournaments')
tournaments: list[edhtop16_t.Tournament] = files.read_json_file(METAGAME_PATH, 'tournaments.json', []) if not FORCE_UPDATE else []
logs.end_log_block('Saved tournaments loaded')

# GET TOURNAMENTS RESUME
logs.begin_log_block('Getting tournaments list')
list_of_tournaments_to_process = list(decklist_hashes_by_tournament.keys())
mapped_tournament_names = {}
for tournament in list_of_tournaments_to_process:
  # Algunos torneos tienen espacios al final del nombre y por ello le hacemos un trim
  # Pero para poder hacer los request a la API de EDH Top 16 necesitamos el nombre sin trim
  mapped_tournament_names[tournament] = raw_lists_by_hash[decklist_hashes_by_tournament[tournament][0]]['tournamentName']
tournaments = edhtop16.get_tournaments_resume(tournaments, list_of_tournaments_to_process, mapped_tournament_names)
logs.end_log_block('Tournaments list got!')

logs.begin_log_block(f'Processing tournaments')
cant_tournament_processed = 0
commanders_by_hash = {}
for commander in decklist_hashes_by_commander.keys():
  for hash in decklist_hashes_by_commander[commander]:
    commanders_by_hash[hash] = commander

logs.loading_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% - ", 0, 0)

for tournament in list_of_tournaments_to_process:
  tournament_obj: edhtop16_t.Tournament = tournaments[[x['name'] for x in tournaments].index(tournament)] # Obtenemos el objeto del torneo para actualizar

  tournament_decklists_by_hash = {}

  tournament_raw_lists = []
  tournament_commanders = []
  tournament_decklists_by_commander = {}
  cant_tournament_decklists_processed = 0
  tournament_cant_decklists_by_hash = {}
  if tournament_obj['processed']:
    continue
  for hash in decklist_hashes_by_tournament[tournament]:
    # Si no se tiene cacheada, vamos a buscarla a la lista de decks que usamos en el metagame (debería tener gran parte de los decks)
    if hash in decklists_by_hash.keys():
      if not 'status' in list(decklists_by_hash[hash].keys()): # status in response usually means error 404
        tournament_commanders.append(commanders_by_hash[hash])
        tournament_raw_lists.append(raw_lists_by_hash[hash])
        tournament_decklists_by_hash[hash] = decklists_by_hash[hash]
        if raw_lists_by_hash[hash]['commander'] not in tournament_decklists_by_commander.keys():
          tournament_decklists_by_commander[raw_lists_by_hash[hash]['commander']] = []
        tournament_decklists_by_commander[raw_lists_by_hash[hash]['commander']].append(decklists_by_hash[hash])

    if hash in tournament_cant_decklists_by_hash.keys():
      tournament_cant_decklists_by_hash[hash] += 1
    else:
      tournament_cant_decklists_by_hash[hash] = 1

    logs.loading_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% - ", cant_tournament_decklists_processed, len(decklist_hashes_by_tournament[tournament]), end=f"\r")
    cant_tournament_decklists_processed += 1
    # FIN iteración de decklists

  logs.ephemeral_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% processing metagame resume...")
  tournament_commanders = list(set(tournament_commanders))
  tournament_condensed_commanders_data = edhtop16.get_condensed_commanders_data(tournament_commanders, tournament_raw_lists)
  tournament_stats_by_commander = edhtop16.get_commander_stats_by_commander(tournament_commanders, tournament_raw_lists, tournament_decklists_by_commander)
  tournament_metagame_resume = edhtop16.get_metagame_resume(tournament_commanders, tournament_raw_lists, tournament_stats_by_commander, dict(zip([tournament], [decklist_hashes_by_tournament[tournament]])))

  logs.ephemeral_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% Processing cards...")
  tournament_full_decklists = []
  for hash in tournament_decklists_by_hash.keys():
    for _ in range(tournament_cant_decklists_by_hash[hash] if hash in tournament_cant_decklists_by_hash.keys() else 1):
      tournament_full_decklists.append(tournament_decklists_by_hash[hash])

  moxfield.VALID_DECKS = len(tournament_full_decklists)

  tournament_metagame_resume['cantLists'] = len(tournament_full_decklists) # valid decklists
  tournament_metagame_resume['size'] = tournament_obj['size'] # total size with valid and invalid decklists
  tournament_metagame_cards = pre_processing.process_cards(pre_processing.reduce_decks_to_cards(pre_processing.get_decklists_data(tournament_full_decklists), has_multiple_printings, get_last_set_for_card))
  tournament_metagame_resume['lastSet'] = LAST_SET[0]
  tournament_metagame_resume['lastSetTop10'] = processing.last_set_top_10(tournament_metagame_cards, LAST_SET)
  tournament_metagame_cards = processing.get_cards_winrate(tournament_metagame_cards, tournament_raw_lists)

  logs.ephemeral_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% Saving cards...")
  # SAVE CARDS
  files.create_new_file('', f"{METAGAME_PATH}/tournaments/{tournament}", 'competitiveCards.json', tournament_metagame_cards, with_log=False)

  logs.ephemeral_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% Getting tags...")
  # UPDATE TAGS FOR TOURNAMENT
  subprocess.Popen(['python3', 'scripts/update_tags.py', 'True']).wait()

  # USE OF CARD TYPES
  logs.ephemeral_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% Calculating use of card types...")
  tournament_uses_by_card_types = processing.get_uses_by_card_types(tournament_full_decklists)
  tournament_metagame_resume['useOfCards'] = {**tournament_metagame_resume['useOfCards'], **tournament_uses_by_card_types}

  logs.ephemeral_log(f"Getting decklists from tournaments [{cant_tournament_processed}/{len(list_of_tournaments_to_process)}] {round((cant_tournament_processed/len(list_of_tournaments_to_process))*100, 2)}% Saving tournament files...")
  cant_tournament_processed += 1

  # Si el torneo está mal subido y no tiene ni siquiera 16 decklists válidas, lo ignoramos
  tournaments = [x for x in tournaments if x['name'] != tournament]
  if tournament_metagame_resume['cantLists'] >= 16:
    # Solo guardamos el torneo si tiene la suficiente cantidad de listas válidas
    files.create_new_file('', f"{METAGAME_PATH}/tournaments/{tournament}", 'metagame_resume.json', tournament_metagame_resume, with_log=False)
    files.create_new_file('', f"{METAGAME_PATH}/tournaments/{tournament}", 'condensed_commanders_data.json', tournament_condensed_commanders_data, with_log=False)
    # No guardamos los stats by commander porque es mucha data que no entrega mucho valor enfocada en un torneo
    #files.create_new_file('', f"{METAGAME_PATH}/tournaments/{tournament}", 'stats_by_commander.json', tournament_stats_by_commander, with_log=False)
    # Actualizamos el torneo como procesado

    tournaments.append({**tournament_obj, 'validLists': len(tournament_full_decklists), 'processed': True })
# FIN iteración de torneos
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

# SPLIT CARDS BY COMMANDER
subprocess.Popen(['python3', 'scripts/split_commander_cards.py']).wait()

print('Updating date...', end='\r')

update_date = {}
update_date_path = os.path.join(DIRNAME, r'public/data/update_date.json')
with open(update_date_path, 'r+') as f:
  update_date = json.load(f) if os.stat(update_date_path).st_size > 0 else {}

update_date['metagame'] = u_date.custom_strftime('%B {S}, %Y', datetime.today())

with open(update_date_path, 'w', encoding='utf8') as f:
  json.dump(update_date, f, ensure_ascii=False)

print('\033[KDate updated \033[92mDone!\033[0m')

# UPDATE DB
update_db.update_metagame_cards()

# CLEANING
files.clear_csv_directory()
files.delete_file('public/data/metagame/metagame_cards_by_commander.json')
files.delete_file('public/data/metagame/metagame_cards.json')

# GIT
git.update_to_new_branch('chore: update Metagame', 'chore/update_metagame')
