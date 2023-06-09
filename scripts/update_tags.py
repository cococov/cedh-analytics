import utils.files as files
import time
import data.scryfall as scryfall
import utils.misc as misc
import utils.logs as logs

# Read cards (condensing cards with tournaments)

BASE_PATH = r'./public/data'
TOURNAMENTS_PATH = rf'{BASE_PATH}/tournaments'
CARDS_PATH = rf'{BASE_PATH}/cards'

# Load db cards json

cards: list[str] = list(map(lambda x: x['scrapName'], files.read_json_file(CARDS_PATH, 'competitiveCards.json')))

# Load tournaments card json

tournaments: list[str] = files.folder_names_in_directory(TOURNAMENTS_PATH)

for tournament in tournaments:
  tournament_cards: list[dict] = files.read_json_file(rf'{TOURNAMENTS_PATH}/{tournament}/cards', 'competitiveCards.json')
  for card in tournament_cards:
    if card['scrapName'] not in cards:
      cards.append(card['scrapName'])

# Load json

tags: dict[str, list[str]] = files.read_json_file(rf'{BASE_PATH}/cards', 'tags.json')

# Request tags for cards not in json from scryfall
total_cards = len(cards)
cards_processed = 0

for card in cards[:4]:
  if card not in tags:
    tags[card] = scryfall.get_tags_from_card(card)
    cards_processed += 1
    print(f"\033[KGetting decklists data [{cards_processed}/{total_cards}]", end='\r')
    time.sleep(0.2)

misc.pp_json(tags)

# Save json
