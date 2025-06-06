"""
Database operations for cEDH Analytics.

cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2025-present CoCoCov

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
from contextlib import contextmanager
from utils import logs

DB_PARAMS = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}

def connect_to_db():
    """
    Connect to the PostgreSQL database

    Returns:
        tuple: (connection, cursor)
    """
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        return conn, cursor
    except Exception as e:
        logs.error_log(f"Database connection error: {e}")
        raise

@contextmanager
def transaction():
    """
    Context manager for database transactions

    Yields:
        tuple: (connection, cursor)
    """
    conn = None
    try:
        conn, cursor = connect_to_db()
        yield conn, cursor
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        logs.error_log(f"Transaction error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def insert_card(card_data):
    """
    Insert a card into the database

    Args:
        card_data (dict): Card data to insert
    """
    logs.begin_log_block(f"Inserting card: {card_data['card_name']}")

    try:
        with transaction() as (conn, cursor):
            cursor.execute(
                """
                INSERT INTO cards (
                    card_name, card_type, cmc, color_identity, rarity,
                    card_text, gatherer_id, average_price, is_reserved_list, card_image
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    card_data['card_name'],
                    card_data['card_type'],
                    card_data['cmc'],
                    json.dumps(card_data['color_identity']),
                    card_data['rarity'],
                    card_data['card_text'],
                    card_data['gatherer_id'],
                    card_data['average_price'],
                    card_data['is_reserved_list'],
                    card_data['card_image']
                )
            )
        logs.success_log(f"Card {card_data['card_name']} inserted successfully")
    except Exception:
        # Don't log the error here since it's already logged in the transaction context manager
        raise

def get_card_by_name(card_name):
    """
    Get a card from the database by name

    Args:
        card_name (str): Name of the card to retrieve

    Returns:
        dict: Card data or None if not found
    """
    try:
        conn, cursor = connect_to_db()
        cursor.execute("SELECT * FROM cards WHERE card_name = %s", (card_name,))
        result = cursor.fetchone()
        conn.close()

        if result:
            return {
                'card_name': result[0],
                'card_type': result[1],
                'cmc': result[2],
                'color_identity': json.loads(result[3]),
                'rarity': result[4],
                'card_text': result[5],
                'gatherer_id': result[6],
                'average_price': result[7],
                'is_reserved_list': result[8],
                'card_image': result[9]
            }
        return None
    except Exception as e:
        logs.error_log(f"Error retrieving card {card_name}: {e}")
        raise
