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
import psycopg2
import utils.logs as logs
import utils.files as files
from dotenv import load_dotenv
from db.update_t import CardTuple, MetagameCardTuple, DbCardTuple, TagsByCardTuple

def open_connection():
  load_dotenv()

  return psycopg2.connect (
    host = os.getenv('POSTGRES_HOST'),
    dbname = os.getenv('POSTGRES_DATABASE'),
    user = os.getenv('POSTGRES_USER'),
    password = os.getenv('POSTGRES_PASSWORD'),
    port = 5432,
  )

def close_connection(connection):
  connection.close()

def update_metagame_cards():
  logs.begin_log_block('Updating metagame cards')
  connection = open_connection()
  metagame_cards = files.read_json_file(r'./public/data/metagame', 'metagame_cards.json')

  card_tuples: list[CardTuple] = []
  metagame_card_tuples: list[MetagameCardTuple] = []

  for card in metagame_cards:
    card_tuple: CardTuple = {
      'card_name': card['cardName'],
      'card_faces': json.dumps(card['card_faces']),
      'color_identity': card['colorIdentity'],
      'colors': card['colors'],
      'cmc': card['cmc'],
      'prices': json.dumps(card['prices']),
      'reserved': card['reserved'],
      'multiple_printings': card['multiplePrintings'],
      'last_print': card['lastPrint'],
      'multiverse_ids': json.dumps(card['multiverse_ids']),
      'type': card['type'],
      'type_line': card['typeLine'],
      'power': None if len(card['power']) == 0 else (card['power'] if card['power'].isdigit() else 0),
      'toughness': None if len(card['toughness']) == 0 else (card['toughness'] if card['toughness'].isdigit() else 0),
    }
    metagame_card_tuple: MetagameCardTuple = {
      'occurrences': card['occurrences'],
      'card_name': card['cardName'],
      'decklists': json.dumps(card['decklists']),
      'is_commander': card['isCommander'],
      'is_in_99': card['isIn99'],
      'is_legal': card['isLegal'],
      'percentage_of_use': card['percentageOfUse'],
      'percentage_of_use_by_identity': card['percentageOfUseByIdentity'],
      'avg_win_rate': card['avgWinRate'],
      'avg_draw_rate': card['avgDrawRate'],
    } # type: ignore
    card_tuples.append(card_tuple)
    metagame_card_tuples.append(metagame_card_tuple)

  cursor = connection.cursor()
  cursor.execute('BEGIN')
  cursor.execute('DELETE FROM metagame_cards')
  cursor.executemany('INSERT INTO cards VALUES (%(card_name)s, %(card_faces)s, %(color_identity)s, %(colors)s, %(cmc)s, %(prices)s, %(reserved)s, %(multiple_printings)s, %(last_print)s, %(multiverse_ids)s, %(type)s, %(type_line)s, %(power)s, %(toughness)s) ON CONFLICT (card_name) DO UPDATE SET last_print = %(last_print)s, prices = %(prices)s, multiverse_ids = %(multiverse_ids)s', card_tuples)
  cursor.executemany('INSERT INTO metagame_cards VALUES (%(occurrences)s, %(card_name)s, %(decklists)s, %(is_commander)s, %(is_in_99)s, %(percentage_of_use)s, %(percentage_of_use_by_identity)s, %(avg_win_rate)s, %(avg_draw_rate)s, %(is_legal)s)', metagame_card_tuples)
  cursor.execute('COMMIT')
  cursor.close()
  close_connection(connection)
  logs.end_log_block('Metagame cards updated!')

def update_db_cards():
  logs.begin_log_block('Updating db cards')
  connection = open_connection()
  db_cards = files.read_json_file(r'./public/data/cards', 'competitiveCards.json')

  card_tuples: list[CardTuple] = []
  db_card_tuples: list[DbCardTuple] = []

  for card in db_cards:
    card_tuple: CardTuple = {
      'card_name': card['cardName'],
      'card_faces': json.dumps(card['card_faces']),
      'color_identity': card['colorIdentity'],
      'colors': card['colors'],
      'cmc': card['cmc'],
      'prices': json.dumps(card['prices']),
      'reserved': card['reserved'],
      'multiple_printings': card['multiplePrintings'],
      'last_print': card['lastPrint'],
      'multiverse_ids': json.dumps(card['multiverse_ids']),
      'type': card['type'],
      'type_line': card['typeLine'],
      'power': None if len(card['power']) == 0 else (card['power'] if card['power'].isdigit() else 0),
      'toughness': None if len(card['toughness']) == 0 else (card['toughness'] if card['toughness'].isdigit() else 0),
    }
    db_card_tuple: DbCardTuple = {
      'occurrences': card['occurrences'],
      'card_name': card['cardName'],
      'decklists': json.dumps(card['decklists']),
      'is_commander': card['isCommander'],
      'is_in_99': card['isIn99'],
      'is_legal': card['isLegal'],
      'percentage_of_use': card['percentageOfUse'],
      'percentage_of_use_by_identity': card['percentageOfUseByIdentity'],
    } # type: ignore
    card_tuples.append(card_tuple)
    db_card_tuples.append(db_card_tuple)

  cursor = connection.cursor()
  cursor.execute('BEGIN')
  cursor.execute('DELETE FROM db_cards')
  cursor.executemany('INSERT INTO cards VALUES (%(card_name)s, %(card_faces)s, %(color_identity)s, %(colors)s, %(cmc)s, %(prices)s, %(reserved)s, %(multiple_printings)s, %(last_print)s, %(multiverse_ids)s, %(type)s, %(type_line)s, %(power)s, %(toughness)s) ON CONFLICT (card_name) DO UPDATE SET last_print = %(last_print)s, prices = %(prices)s, multiverse_ids = %(multiverse_ids)s', card_tuples)
  cursor.executemany('INSERT INTO db_cards VALUES (%(occurrences)s, %(card_name)s, %(decklists)s, %(is_commander)s, %(is_in_99)s, %(percentage_of_use)s, %(percentage_of_use_by_identity)s, %(is_legal)s)', db_card_tuples)
  cursor.execute('COMMIT')
  cursor.close()
  close_connection(connection)
  logs.end_log_block('Db cards updated!')

def update_tags_by_card(tags_by_card_to_update: dict[str, list[str]], force=False):
  logs.begin_log_block('Updating tags by card')
  connection = open_connection()
  tags_by_card: dict[str, list[str]] = files.read_json_file(r'./public/data/cards', 'tags.json') if force else tags_by_card_to_update

  tags_by_card_tuples: list[TagsByCardTuple] = []

  for card_name in tags_by_card.keys():
    tags_by_card_tuple: TagsByCardTuple = {
      'card_name': card_name,
      'tags': json.dumps(tags_by_card[card_name]),
    }
    tags_by_card_tuples.append(tags_by_card_tuple)

  cursor = connection.cursor()
  cursor.execute('BEGIN')
  cursor.executemany('INSERT INTO tags_by_card VALUES (%(card_name)s, %(tags)s) ON CONFLICT (card_name) DO NOTHING', tags_by_card_tuples)
  cursor.execute('COMMIT')
  cursor.close()
  close_connection(connection)
  logs.end_log_block('Tags by card updated!')

def update_ban_list(card_list: list[str]):
  logs.begin_log_block('Updating ban list')
  card_list_tuples: list[dict[str, str]] = list(map(lambda x: {'card_name': x}, card_list))
  connection = open_connection()
  cursor = connection.cursor()
  cursor.execute('BEGIN')
  cursor.execute('DELETE FROM ban_list')
  cursor.executemany('INSERT INTO ban_list VALUES (%(card_name)s)', card_list_tuples)
  cursor.execute('COMMIT')
  cursor.close()
  close_connection(connection)
  logs.end_log_block('Ban list updated!')
