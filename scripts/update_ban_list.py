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

import utils.logs as logs
import data.scryfall as scryfall
import db.update as update_db
import utils.files as files

def update_ban_list():
  logs.simple_log('Beginning')
  logs.begin_log_block('Getting banned cards')
  banned_cards = scryfall.get_banned_cards_commander()
  logs.end_log_block('Banned cards retrieved!')
  update_db.update_ban_list(banned_cards)
  logs.begin_log_block('Updating banlist.json')
  files.create_file('.', 'banlist.json', banned_cards)
  logs.end_log_block('banlist.json updated!')

  print('\033[K\033[92mBan list updated!\033[0m')

if __name__ == '__main__':
  update_ban_list()