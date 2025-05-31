"""
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

import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add the project root to the Python path to import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from scripts.db import database

class TestDatabaseOperations(unittest.TestCase):
    """Test cases for database operations."""

    @patch('psycopg2.connect')
    def test_connect_to_db(self, mock_connect):
        """Test the database connection function."""
        # Setup mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        # Call the function
        conn, cursor = database.connect_to_db()

        # Assertions
        mock_connect.assert_called_once()
        self.assertEqual(conn, mock_conn)
        self.assertEqual(cursor, mock_cursor)

    @patch('scripts.db.database.connect_to_db')
    @patch('scripts.utils.logs.begin_log_block')
    @patch('scripts.utils.logs.success_log')
    def test_insert_card(self, mock_success_log, mock_begin_log_block, mock_connect_to_db):
        """Test inserting a card into the database."""
        # Setup mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect_to_db.return_value = (mock_conn, mock_cursor)

        # Test data
        card_data = {
            'card_name': 'Test Card',
            'card_type': 'Creature',
            'cmc': 2,
            'color_identity': ['W', 'U'],
            'rarity': 'rare',
            'card_text': 'Test card text',
            'gatherer_id': 12345,
            'average_price': 10.99,
            'is_reserved_list': False,
            'card_image': 'https://example.com/test-card.jpg'
        }

        # Call the function
        database.insert_card(card_data)

        # Assertions
        mock_begin_log_block.assert_called_once()
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
        mock_success_log.assert_called_once()

        # Verify the SQL query contains the card name
        sql_query = mock_cursor.execute.call_args[0][0]
        self.assertIn('INSERT INTO cards', sql_query)

        # Verify parameters contain the card data
        params = mock_cursor.execute.call_args[0][1]
        self.assertEqual(params[0], 'Test Card')  # Assuming first param is card_name

    @patch('scripts.db.database.connect_to_db')
    @patch('scripts.utils.logs.error_log')
    def test_insert_card_error_handling(self, mock_error_log, mock_connect_to_db):
        """Test error handling when inserting a card fails."""
        # Setup mock connection and cursor with error
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.execute.side_effect = Exception("Database error")
        mock_connect_to_db.return_value = (mock_conn, mock_cursor)

        # Test data
        card_data = {
            'card_name': 'Test Card',
            'card_type': 'Creature',
            'cmc': 2,
            'color_identity': ['W', 'U'],
            'rarity': 'rare',
            'card_text': 'Test card text',
            'gatherer_id': 12345,
            'average_price': 10.99,
            'is_reserved_list': False,
            'card_image': 'https://example.com/test-card.jpg'
        }

        # Call the function and expect exception
        with self.assertRaises(Exception):
            database.insert_card(card_data)

        # Assertions
        mock_error_log.assert_called_once()
        mock_conn.rollback.assert_called_once()

    @patch('scripts.db.database.connect_to_db')
    def test_get_card_by_name(self, mock_connect_to_db):
        """Test retrieving a card by name."""
        # Setup mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()

        # Mock the fetchone result
        mock_cursor.fetchone.return_value = (
            'Test Card', 'Creature', 2, '["W","U"]', 'rare',
            'Test card text', 12345, 10.99, False, 'https://example.com/test-card.jpg'
        )

        mock_connect_to_db.return_value = (mock_conn, mock_cursor)

        # Call the function
        card = database.get_card_by_name('Test Card')

        # Assertions
        mock_cursor.execute.assert_called_once()
        self.assertEqual(card['card_name'], 'Test Card')
        self.assertEqual(card['cmc'], 2)

        # Verify the SQL query contains the card name
        sql_query = mock_cursor.execute.call_args[0][0]
        self.assertIn('SELECT * FROM cards', sql_query)
        self.assertIn('WHERE card_name = %s', sql_query)

        # Verify parameters
        params = mock_cursor.execute.call_args[0][1]
        self.assertEqual(params[0], 'Test Card')

    @patch('scripts.db.database.connect_to_db')
    def test_transaction_handling(self, mock_connect_to_db):
        """Test transaction handling in database operations."""
        # Setup mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect_to_db.return_value = (mock_conn, mock_cursor)

        # Simulate a transaction with multiple operations
        with database.transaction() as (conn, cursor):
            # Perform some operations
            cursor.execute("INSERT INTO cards VALUES (%s, %s)", ('Card 1', 'Type 1'))
            cursor.execute("INSERT INTO cards VALUES (%s, %s)", ('Card 2', 'Type 2'))

        # Assertions
        self.assertEqual(mock_cursor.execute.call_count, 2)
        mock_conn.commit.assert_called_once()

        # Test rollback on exception
        mock_cursor.reset_mock()
        mock_conn.reset_mock()

        try:
            with database.transaction() as (conn, cursor):
                cursor.execute("INSERT INTO cards VALUES (%s, %s)", ('Card 3', 'Type 3'))
                raise Exception("Test exception")
        except Exception:
            pass

        mock_conn.rollback.assert_called_once()

if __name__ == '__main__':
    unittest.main()
