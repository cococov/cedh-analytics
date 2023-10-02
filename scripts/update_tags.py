import time
import utils.logs as logs
import utils.files as files
import data.scryfall as scryfall

""" Update tags script.
Get tags by card and save them in a json file.
Merge cards cards from DB and tournaments and get the tags for each card from scryfall tagger.
Save the result in the json file `public/data/cards/tags.json`.

By default, the script will only get tags for cards that are not already saved in the json file.
If you want to force the script to get tags for all cards, set the variable `FORCE_UPDATE` to `True`.
"""

BASE_PATH = r'./public/data'
TOURNAMENTS_PATH = rf'{BASE_PATH}/tournaments'
CARDS_PATH = rf'{BASE_PATH}/cards'
METAGAME_PATH = rf'{BASE_PATH}/metagame'
FORCE_UPDATE = False

# Load db cards json
logs.begin_log_block('Loading DB cards...')
cards: list[str] = list(map(lambda x: x['scrapName'], files.read_json_file(CARDS_PATH, 'competitiveCards.json')))
logs.end_log_block('DB cards loaded!')

# Load tournaments card json
logs.begin_log_block('Loading tournament cards...')
tournaments: list[str] = files.folder_names_in_directory(TOURNAMENTS_PATH)

for tournament in tournaments:
  tournament_cards: list[dict] | dict = files.read_json_file(rf'{TOURNAMENTS_PATH}/{tournament}/cards', 'competitiveCards.json')
  for card in tournament_cards:
    if card['scrapName'] not in cards:
      cards.append(card['scrapName'])
logs.end_log_block('Tournament cards loaded!')

# Load metagame cards json
logs.begin_log_block('Loading metagame cards...')
metagame_cards: list[dict] | dict = files.read_json_file(METAGAME_PATH, 'metagame_cards.json')
for card in metagame_cards:
  if card['scrapName'] not in cards:
    cards.append(card['scrapName'])
logs.end_log_block('Metagame cards loaded!')

# Load json
logs.begin_log_block('Loading tags...')
tags: dict[str, list[str]] = files.read_json_file(CARDS_PATH, 'tags.json')
logs.end_log_block('Tags loaded!')

# Request tags for cards not in json from scryfall
logs.begin_log_block('Getting tags...')
total_cards = len(cards)
cards_processed = 0

for card in cards:
  if card not in tags or FORCE_UPDATE:
    tags[card] = scryfall.get_tags_from_card(card)
    time.sleep(0.2)
  cards_processed += 1
  logs.loading_log("Getting card tags", cards_processed, total_cards)
logs.end_log_block('Tags got!')

# Save json
files.create_file_with_log(CARDS_PATH, 'tags.json', tags, 'Saving tags...', 'Tags saved!')
