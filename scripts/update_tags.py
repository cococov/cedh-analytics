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

import sys
import time
import utils.logs as logs
import utils.files as files
import data.scryfall as scryfall
import db.update as update_db

""" Update tags script.
Get tags by card and save them in a json file.
Merge cards cards from DB and tournaments and get the tags for each card from scryfall tagger.
Save the result in the json file `public/data/cards/tags.json`.

By default, the script will only get tags for cards that are not already saved in the json file.
If you want to force the script to get tags for all cards, set the variable `FORCE_UPDATE` to `True`.
"""

BASE_PATH = r'./public/data'
CARDS_PATH = rf'{BASE_PATH}/cards'
METAGAME_PATH = rf'{BASE_PATH}/metagame'
TOURNAMENTS_PATH = rf'{METAGAME_PATH}/tournaments'
FORCE_UPDATE = False

WITH_LOGS = len(sys.argv) == 1 or not (len(sys.argv) > 1 and sys.argv[1] == 'True')

# Load db cards json
if WITH_LOGS: logs.begin_log_block('Loading DB cards...')
cards: list[str] = list(map(lambda x: x['cardName'], files.read_json_file(CARDS_PATH, 'competitiveCards.json')))
if WITH_LOGS: logs.end_log_block('DB cards loaded!')

# Load tournaments card json
if WITH_LOGS: logs.begin_log_block('Loading tournament cards...')
tournaments: list[str] = files.folder_names_in_directory(TOURNAMENTS_PATH)

for tournament in tournaments:
  tournament_cards: list[dict] | dict = files.read_json_file(rf'{TOURNAMENTS_PATH}/{tournament}', 'competitiveCards.json')
  for card in tournament_cards:
    if card['cardName'] not in cards:
      cards.append(card['cardName'])
if WITH_LOGS: logs.end_log_block('Tournament cards loaded!')

# Load metagame cards json
if WITH_LOGS: logs.begin_log_block('Loading metagame cards...')
metagame_cards: list[dict] | dict = files.read_json_file(METAGAME_PATH, 'metagame_cards.json')
for card in metagame_cards:
  if card['cardName'] not in cards:
    cards.append(card['cardName'])
if WITH_LOGS: logs.end_log_block('Metagame cards loaded!')

# Load json
if WITH_LOGS: logs.begin_log_block('Loading tags...')
tags: dict[str, list[str]] = files.read_json_file(CARDS_PATH, 'tags.json')
if WITH_LOGS: logs.end_log_block('Tags loaded!')

# Request tags for cards not in json from scryfall
if WITH_LOGS: logs.begin_log_block('Getting tags...')
total_cards = len(cards)
cards_processed = 0

tags_to_update = {}

for card in cards:
  if card not in tags or FORCE_UPDATE:
    tags[card] = scryfall.get_tags_from_card(card)
    tags_to_update[card] = tags[card]
    time.sleep(0.2)
  cards_processed += 1
  logs.loading_log("Getting card tags", cards_processed, total_cards)
if WITH_LOGS: logs.end_log_block('Tags got!')

# Save json
if WITH_LOGS:
  files.create_file_with_log(CARDS_PATH, 'tags.json', tags, 'Saving tags...', 'Tags saved!')
else:
  files.create_file(CARDS_PATH, 'tags.json', tags)

# Update DB
update_db.update_tags_by_card(tags_to_update)
