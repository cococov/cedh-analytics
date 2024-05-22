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

import data.moxfield
from functools import reduce

number_of_decks_by_identities = {}

########## CARDS ##########

def sort_identity(identity):
  if len(identity) == 0:
    return ['C']
  identities = { 'W': 0, 'U': 1, 'B': 2, 'R': 3, 'G': 4 }
  sorted_identities = sorted(identity, key=lambda x: identities[x])
  return sorted_identities

def sort_identity_str(identity):
  identities = { 'W': 0, 'U': 1, 'B': 2, 'R': 3, 'G': 4, 'C' : 5 }
  sorted_identities = sorted(list(identity), key=lambda x: identities[x])
  return ''.join(sorted_identities)

def getType(type):
  if type == '1':
    return 'Battle'
  if type == '2':
    return 'Planeswalker'
  if type == '3':
    return 'Creature'
  if type == '4':
    return 'Sorcery'
  if type == '5':
    return 'Instant'
  if type == '6':
    return 'Artifact'
  if type == '7':
    return 'Enchantment'
  if type == '8':
    return 'Land'
  return 'Unknown'

def identity_in_identity(identity, identity_to_check):
  identity_to_check_list = list(identity_to_check)
  for sub_identity in identity:
    if sub_identity not in identity_to_check_list:
      return False
  return True

def percentage_of_use_by_identity(occurrences, identity):
  return round(occurrences / possible_number_of_decks_by_identity(identity) * 100, 2)

def map_cards(card):
  decklists = sort_and_group_decks(card['decklists'])
  return {**card, 'colors': sort_identity_str(card['colors']), 'colorIdentity': sort_identity_str(card['colorIdentity']),'decklists': decklists, 'percentageOfUse': round(card['occurrences'] / data.moxfield.VALID_DECKS * 100, 2), 'percentageOfUseByIdentity': percentage_of_use_by_identity(card['occurrences'], card['colorIdentity'])}

def process_cards(cards):
  return list(map(map_cards, cards))

########## DECKS ##########

def map_decklists_data(decklist_data):
  result = {}
  result['deck'] = { 'name': decklist_data['name'], 'url': decklist_data['url'], 'commanders': list(map(lambda x : { 'name': x['card']['name'], 'color_identity': x['card']['color_identity'] }, decklist_data['boards']['commanders']['cards'].values()))}
  color_identity = list(reduce(lambda y, z: set(y + z), map(lambda x: x['color_identity'], result['deck']['commanders']))) # type: ignore
  sorted_identity = sort_identity(color_identity)
  joined_identity = ''.join(sorted_identity)
  if joined_identity in number_of_decks_by_identities:
    number_of_decks_by_identities.update({joined_identity: number_of_decks_by_identities[joined_identity] + 1})
  else:
    number_of_decks_by_identities[joined_identity] = 1
  cards = decklist_data['boards']['mainboard']['cards'] | decklist_data['boards']['companions']['cards'] | decklist_data['boards']['commanders']['cards']
  result['cards'] = list(cards.values())
  return result

def get_decklists_data(decklists_data):
  return list(map(map_decklists_data, decklists_data))

def isCommander(card, deck):
  for commander in deck['commanders']:
    if commander['name'] == card['name']:
      return True
  return False

def build_reduce_deck(has_multiple_printings, get_last_set_for_card):
  def reduce_deck(accumulated, current):
    hash = {
      'occurrences': 1,
      'cardName': current['card']['name'],
      'card_faces': [] if len(current['card']['card_faces']) == 0 else [current['card']['card_faces'][0]['name'], current['card']['card_faces'][1]['name']],
      'colorIdentity': 'C' if len(current['card']['color_identity']) == 0 else ''.join(current['card']['color_identity']),
      'colors': ('C' if len(current['card']['card_faces']) == 0 else ''.join(current['card']['card_faces'][0]['colors'])) if len(current['card']['colors']) == 0 else ''.join(current['card']['colors']),
      'decklists': [current['deck']],
      'cmc': current['card']['cmc'],
      'prices': current['card']['prices'],
      'reserved': current['card']['reserved'],
      'multiplePrintings': bool(has_multiple_printings(current['card']['name'])),
      'lastPrint': get_last_set_for_card(current['card']['name']),
      'multiverse_ids': current['card']['multiverse_ids'] if 'multiverse_ids' in current['card'] else [0],
      'type': getType(current['card']['type']),
      'typeLine': current['card']['type_line'] if 'type_line' in current['card'] else '',
      'power': current['card']['power'] if 'power' in current['card'] else current['card']['card_faces'][0]['power'] if len(current['card']['card_faces']) > 0 and 'power' in current['card']['card_faces'][0] else '',
      'toughness': current['card']['toughness'] if 'toughness' in current['card'] else current['card']['card_faces'][0]['toughness'] if len(current['card']['card_faces']) > 0 and 'toughness' in current['card']['card_faces'][0] else '',
      "isCommander": isCommander(current['card'], current['deck']),
      "isIn99": not isCommander(current['card'], current['deck']),
    }

    saved_card_index = next((index for (index, d) in enumerate(accumulated) if d['cardName'] == current['card']['name']), -1)

    if saved_card_index > -1:
      hash['occurrences'] = accumulated[saved_card_index]['occurrences'] + 1
      hash['decklists'] = accumulated[saved_card_index]['decklists'] + [current['deck']]
      if saved_card_index > 0:
        hash['isCommander'] = accumulated[saved_card_index]['isCommander'] or isCommander(current['card'], current['deck'])
        hash['isIn99'] = accumulated[saved_card_index]['isIn99'] or not isCommander(current['card'], current['deck'])
      del accumulated[saved_card_index]

    return [*accumulated, hash]
  return reduce_deck

def build_reduce_all_decks(has_multiple_printings, get_last_set_for_card):
  def reduce_all_decks(accumulated, current):
    return reduce(build_reduce_deck(has_multiple_printings, get_last_set_for_card), list(map(lambda x: {**x, 'deck': current['deck']}, current['cards'])), accumulated)
  return reduce_all_decks

def sort_and_group_decks(decks):
  sorted_decks = sorted(decks, key=lambda x: x['name'])
  grouped_decks = {}
  for deck in sorted_decks:
    splitted_commanders = map(lambda y: y['name'].split(',')[0], deck['commanders'])
    joined_commanders = ' | '.join(sorted(splitted_commanders))
    grouped_decks.setdefault(joined_commanders, []).append(deck)
  unsorted_decks_by_commanders = []
  for key, value in grouped_decks.items():
    color_identity = list(reduce(lambda y, z: set(y + z), map(lambda x: x['color_identity'], value[0]['commanders']))) # type: ignore
    sorted_identity = sort_identity(color_identity)
    unsorted_decks_by_commanders.append({ 'commanders': key, 'decks': value, 'colorIdentity': sorted_identity })
  sorted_decks_by_commanders = sorted(unsorted_decks_by_commanders, key=lambda x: ''.join(x['colorIdentity']) + x['commanders'])
  sorted_by_identity_size_decks_by_commanders = sorted(sorted_decks_by_commanders, key=lambda x: len(x['colorIdentity']))
  return sorted_by_identity_size_decks_by_commanders

def possible_number_of_decks_by_identity(identity):
  if identity == 'C':
    return data.moxfield.VALID_DECKS
  total = 0
  for key in number_of_decks_by_identities:
    if identity_in_identity(identity, key):
      total = total + number_of_decks_by_identities[key]
  return total

def reduce_decks_to_cards(decklists_data, has_multiple_printings, get_last_set_for_card):
  return reduce(build_reduce_all_decks(has_multiple_printings, get_last_set_for_card), decklists_data, [])
