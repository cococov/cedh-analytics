"""
cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2024-present CoCoCov

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

import base64
import utils.files as files
import utils.logs as logs

logs.begin_log_block('Loading file')
cards_by_commander = files.read_json_file('public/data/metagame', 'metagame_cards_by_commander.json', {})
commanders = list(cards_by_commander.keys())
logs.end_log_block('File loaded')

for commander in commanders:
  logs.begin_log_block(f'Writing file for {commander}')
  cards = cards_by_commander[commander]
  file_name = f"{base64.b64encode(commander.encode('utf-8')).decode('utf-8')}.json"
  files.create_new_file('', f'public/data/metagame/commanders_cards', file_name, cards, with_log=False)
  logs.end_log_block(f'File written for {commander}')
