import pandas as pd
import utils.logs as logs
import utils.files as files
from functools import lru_cache

MTGJSON_CSV_PATH = 'https://mtgjson.com/api/v5/csv'
CSV_PATH = './csv'

def download_csv_files():
  logs.begin_log_block('Getting all printing')
  files.download_file(f'{MTGJSON_CSV_PATH}/cards.csv', CSV_PATH)
  files.download_file(f'{MTGJSON_CSV_PATH}/sets.csv', CSV_PATH)
  logs.end_log_block('Getting all printing')

def get_cards_csv():
  return pd.read_csv(f'{CSV_PATH}/cards.csv', dtype='unicode').dropna(axis=1)

def get_sets_csv(VALID_TYPE_SETS, INVALID_SETS):
  sets_csv = pd.read_csv(f'{CSV_PATH}/sets.csv', dtype='unicode').dropna(axis=1).sort_values(by='releaseDate',ascending=False).query("type in @VALID_TYPE_SETS").query("keyruneCode not in @INVALID_SETS").query("isOnlineOnly == '0'")
  sets_csv['releaseDate'] = pd.to_datetime(sets_csv['releaseDate'])
  return sets_csv

def build_get_last_set_for_card(cards_csv, sets_csv):
  @lru_cache(maxsize=None)
  def get_last_set_for_card(card_name):
    try:
      if card_name in ['Glenn, the Voice of Calm', 'Rick, Steadfast Leader', 'Daryl, Hunter of Walkers', 'Tadeas, Juniper Ascendant']:
        return 'Secret Lair Drop'
      if card_name in ['Rot Hulk']:
        return 'Game Night'
      card_printing_codes = cards_csv.loc[cards_csv['name'] == card_name].iloc[0]['printings'].split(', ')
      card_printing_names = sets_csv.loc[sets_csv['keyruneCode'].isin(card_printing_codes)]['name']
      return card_printing_names.iloc[0]
    except:
      logs.warning_log("Error getting card set: " + card_name)
      return 'Unknown'
  return get_last_set_for_card

def build_has_multiple_printings(cards_csv, sets_csv):
  @lru_cache(maxsize=None)
  def has_multiple_printings(card_name):
    try:
      if card_name in ['Glenn, the Voice of Calm', 'Rick, Steadfast Leader', 'Daryl, Hunter of Walkers', 'Tadeas, Juniper Ascendant']:
        return False
      if card_name in ['Rot Hulk']:
        return False
      card_printing_codes = cards_csv.loc[cards_csv['name'] == card_name].iloc[0]['printings'].split(', ')
      card_printing_names = sets_csv.loc[sets_csv['keyruneCode'].isin(card_printing_codes)]['name']
      return card_printing_names.count() > 1
    except:
      return False
  return has_multiple_printings