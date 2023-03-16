import pandas as pd
from functools import lru_cache

def get_cards_csv():
  return pd.read_csv('./csv/cards.csv', dtype='unicode').dropna(axis=1)

def get_sets_csv(VALID_TYPE_SETS, INVALID_SETS):
  sets_csv = pd.read_csv('./csv/sets.csv', dtype='unicode').dropna(axis=1).sort_values(by='releaseDate',ascending=False).query("type in @VALID_TYPE_SETS").query("keyruneCode not in @INVALID_SETS").query("isOnlineOnly == '0'")
  sets_csv['releaseDate'] = pd.to_datetime(sets_csv['releaseDate'])
  return sets_csv

def build_get_last_set_for_card(cards_csv, sets_csv):
  @lru_cache(maxsize=None)
  def get_last_set_for_card(card_name):
    try:
      if card_name in ['Glenn, the Voice of Calm', 'Rick, Steadfast Leader', 'Daryl, Hunter of Walkers']:
        return 'Secret Lair Drop'
      if card_name in ['Rot Hulk']:
        return 'Game Night'
      card_printing_codes = cards_csv.loc[cards_csv['name'] == card_name].iloc[0]['printings'].split(',')
      card_printing_names = sets_csv.loc[sets_csv['keyruneCode'].isin(card_printing_codes)]['name']
      return card_printing_names.iloc[0]
    except:
      print("Error getting card set: " + card_name)
      return 'Unknown'
  return get_last_set_for_card

def build_has_multiple_printings(cards_csv, sets_csv):
  @lru_cache(maxsize=None)
  def has_multiple_printings(card_name):
    try:
      if card_name in ['Glenn, the Voice of Calm', 'Rick, Steadfast Leader', 'Daryl, Hunter of Walkers']:
        return 'Secret Lair Drop'
      if card_name in ['Rot Hulk']:
        return 'Game Night'
      card_printing_codes = cards_csv.loc[cards_csv['name'] == card_name].iloc[0]['printings'].split(',')
      card_printing_names = sets_csv.loc[sets_csv['keyruneCode'].isin(card_printing_codes)]['name']
      return card_printing_names.count() > 1
    except:
      return False
  return has_multiple_printings