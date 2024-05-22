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

import re
import functools
import utils.files as files
import pandas as pd
import data.edhtop16_t as edhtop16_t
import data.moxfield_t as moxfield_t

def cards_number(data):
  return len(data)

def staples_number(data, staple_def):
  return len(list(filter(lambda d: d['occurrences'] > staple_def, data)))

def pet_cards_number(data):
  return len(list(filter(lambda d: d['occurrences'] == 1, data)))

def last_set_top_10(data, last_set):
  return list(sorted(map(lambda x: {'occurrences': x['occurrences'], 'cardName': x['cardName']}, filter(lambda d: (not d['multiplePrintings']) and ((d['lastPrint'] == last_set[0]) or (d['lastPrint'] == last_set[1]) or (len(d) == 3 and d['lastPrint'] == last_set[2])), data)), key=lambda d: d['occurrences'], reverse=True))[0:10] # type: ignore

def get_cards_winrate(cards, raw_lists):
  result = []
  for card in cards:
    occurrences = card['occurrences']
    decklists_url = [url for urls in map(lambda x: map(lambda y: y['url'], x['decks']), card['decklists']) for url in urls] # Ugly python flatten
    avg_wins = round(functools.reduce(lambda x, y: x + y, map(lambda x: x['wins'] if x['decklist'] in decklists_url else 0, raw_lists)) / occurrences, 3)
    avg_draws = round(functools.reduce(lambda x, y: x + y, map(lambda x: x['draws'] if x['decklist'] in decklists_url else 0, raw_lists)) / occurrences, 3)
    avg_losses = round(functools.reduce(lambda x, y: x + y, map(lambda x: x['losses'] if x['decklist'] in decklists_url else 0, raw_lists)) / occurrences, 3)
    avg_drawrate = round(avg_draws / (avg_wins + avg_draws + avg_losses) if (avg_wins + avg_draws + avg_losses) > 0 else 0, 3)
    avg_winrate = round(functools.reduce(lambda x, y: x + y, map(lambda x: x['winRate'] if x['decklist'] in decklists_url else 0, raw_lists)) / occurrences, 3)
    result.append({**card, 'avgWinRate': avg_winrate, 'avgDrawRate': avg_drawrate})
  return result

def get_uses_by_card_types(decklists) -> edhtop16_t.UseOfCards:
  tags: dict[str, list[str]] = files.read_json_file(rf'./public/data/cards', 'tags.json')
  DRAW_ENGINE = 'draw' # exact
  TUTOR = 'tutor' # regex
  NOT_TUTOR = ['fetchland', 'hate-tutor', 'hate-nonbasic-land'] # exact
  COUNTER = 'counterspell' # regex
  NOT_COUNTER = ['hate-counterspell'] # exact
  REMOVAL = ['removal', 'sweeper'] # regex
  MANA_ROCK = 'mana rock' # exact
  MANA_DORK = 'mana dork' # exact
  STAX = ['rule of law', 'hatebear', 'prison', 'cost increaser'] # exact
  STAX_RX = 'hate' # regex
  NOT_STAX = ['hate-ramp', 'hate-blocker', 'hate-counterspell', 'alliteration', 'removal-land-destroy', 'hate-target', 'hate-planeswalker', 'hate-tribal-human', 'tutor-card', 'graveyard fuel-creature', 'hate-black', 'untapper-creature', 'hate-blue', 'hate-white', 'draw', 'catch up', 'removal-nonland-destroy', 'synergy-colorless', 'hate-green', 'hate-red', 'eldrazi titan', 'graveyard fuel', 'ramp', 'gives protection', 'graveyard fuel-permanent', 'hand size matters', 'removal-creature-toughness', 'hate-theft', 'mill-any', 'cycle-khm-m-god']
  NOT_STAX_EXCEPTIONS = ['Notion Thief']

  draw_totals = []
  tutor_totals = []
  counter_totals = []
  removal_totals = []
  mana_rock_totals = []
  mana_dork_totals = []
  stax_totals = []

  for decklist in decklists:
    cards = (decklist['boards']['mainboard']['cards'] | decklist['boards']['companions']['cards'] | decklist['boards']['commanders']['cards']).values()
    draw_total, tutor_total, counter_total, removal_total, mana_rock_total, mana_dork_total, stax_total = (0,)*7
    for card in cards:
      card_name = card['card']['name']
      card_tags = tags[card_name] if card_name in tags else []
      added_as_tutor = False
      added_as_counter = False
      added_as_removal = False
      added_as_stax = False

      if DRAW_ENGINE in card_tags:
        draw_total += 1
      if MANA_DORK in card_tags:
        mana_dork_total += 1
      if MANA_ROCK in card_tags:
        mana_rock_total += 1
      for not_tutor in NOT_TUTOR:
        if not_tutor in card_tags:
          added_as_tutor = True
          break
      if card_name != "Dovin's Veto":
        for not_counter in NOT_COUNTER:
          if not_counter in card_tags:
            added_as_counter = True
            break
      for not_stax in NOT_STAX:
        if not_stax in card_tags:
          added_as_stax = True
          break
      if (moxfield_t.CardType(card['card']['type']) is moxfield_t.CardType.INSTANT) or (moxfield_t.CardType(card['card']['type']) is moxfield_t.CardType.SORCERY):
        added_as_stax = True
      if card_name in NOT_STAX_EXCEPTIONS:
        stax_total += 1
        added_as_stax = True
      if not added_as_stax:
        for stax in STAX:
          if stax in card_tags:
            stax_total += 1
            added_as_stax = True
            break

      for tag in card_tags:
        if re.search(TUTOR, tag) and not added_as_tutor:
          tutor_total += 1
          added_as_tutor = True
        if re.search(COUNTER, tag) and not added_as_counter:
          counter_total += 1
          added_as_counter = True
        for removal in REMOVAL:
          if re.search(removal, tag) and not added_as_removal:
            removal_total += 1
            added_as_removal = True
            break
        if re.search(STAX_RX, tag) and not added_as_stax:
          stax_total += 1
          added_as_stax = True

    draw_totals.append(draw_total)
    tutor_totals.append(tutor_total)
    counter_totals.append(counter_total)
    removal_totals.append(removal_total)
    mana_rock_totals.append(mana_rock_total)
    mana_dork_totals.append(mana_dork_total)
    stax_totals.append(stax_total)

  use_of_draw = pd.DataFrame(sorted(draw_totals))
  use_of_tutor = pd.DataFrame(sorted(tutor_totals))
  use_of_counter = pd.DataFrame(sorted(counter_totals))
  use_of_removal = pd.DataFrame(sorted(removal_totals))
  use_of_mana_rock = pd.DataFrame(sorted(mana_rock_totals))
  use_of_mana_dork = pd.DataFrame(sorted(mana_dork_totals))
  use_of_stax = pd.DataFrame(sorted(stax_totals))

  return {
    'minCantDraw': use_of_draw.min().to_dict()[0],
    'q1CantDraw': use_of_draw.quantile([.25]).to_dict()[0][0.25],
    'medianCantDraw': use_of_draw.quantile([.5]).to_dict()[0][0.5],
    'q3CantDraw': use_of_draw.quantile([.75]).to_dict()[0][0.75],
    'maxCantDraw': use_of_draw.max().to_dict()[0],
    'minCantTutor': use_of_tutor.min().to_dict()[0],
    'q1CantTutor': use_of_tutor.quantile([.25]).to_dict()[0][0.25],
    'medianCantTutor': use_of_tutor.quantile([.5]).to_dict()[0][0.5],
    'q3CantTutor': use_of_tutor.quantile([.75]).to_dict()[0][0.75],
    'maxCantTutor': use_of_tutor.max().to_dict()[0],
    'minCantCounter': use_of_counter.min().to_dict()[0],
    'q1CantCounter': use_of_counter.quantile([.25]).to_dict()[0][0.25],
    'medianCantCounter': use_of_counter.quantile([.5]).to_dict()[0][0.5],
    'q3CantCounter': use_of_counter.quantile([.75]).to_dict()[0][0.75],
    'maxCantCounter': use_of_counter.max().to_dict()[0],
    'minCantRemoval': use_of_removal.min().to_dict()[0],
    'q1CantRemoval': use_of_removal.quantile([.25]).to_dict()[0][0.25],
    'medianCantRemoval': use_of_removal.quantile([.5]).to_dict()[0][0.5],
    'q3CantRemoval': use_of_removal.quantile([.75]).to_dict()[0][0.75],
    'maxCantRemoval': use_of_removal.max().to_dict()[0],
    'minCantManaRock': use_of_mana_rock.min().to_dict()[0],
    'q1CantManaRock': use_of_mana_rock.quantile([.25]).to_dict()[0][0.25],
    'medianCantManaRock': use_of_mana_rock.quantile([.5]).to_dict()[0][0.5],
    'q3CantManaRock': use_of_mana_rock.quantile([.75]).to_dict()[0][0.75],
    'maxCantManaRock': use_of_mana_rock.max().to_dict()[0],
    'minCantManaDork': use_of_mana_dork.min().to_dict()[0],
    'q1CantManaDork': use_of_mana_dork.quantile([.25]).to_dict()[0][0.25],
    'medianCantManaDork': use_of_mana_dork.quantile([.5]).to_dict()[0][0.5],
    'q3CantManaDork': use_of_mana_dork.quantile([.75]).to_dict()[0][0.75],
    'maxCantManaDork': use_of_mana_dork.max().to_dict()[0],
    'minCantStax': use_of_stax.min().to_dict()[0],
    'q1CantStax': use_of_stax.quantile([.25]).to_dict()[0][0.25],
    'medianCantStax': use_of_stax.quantile([.5]).to_dict()[0][0.5],
    'q3CantStax': use_of_stax.quantile([.75]).to_dict()[0][0.75],
    'maxCantStax': use_of_stax.max().to_dict()[0],
  }
