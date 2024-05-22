"""
Utility functions to get data from cEDH Decklist Database.

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

import json
import requests
import utils.logs as logs
from functools import reduce

def get_decklists_from_db():
  logs.begin_log_block('Getting decklists')
  url = 'https://raw.githubusercontent.com/AverageDragon/cEDH-Decklist-Database/master/_data/database.json'
  raw_lists = requests.get(url)
  logs.end_log_block('Getting decklists')
  return json.loads(raw_lists.text)

def reduce_competitive_lists_hashes(accumulated, current):
  if current['section'] != 'COMPETITIVE': return accumulated
  striped_lists = list(map(lambda dl: dl['link'].strip(), current['decklists']))
  filtered_lists = list(filter(lambda l: l.find('moxfield') != -1, striped_lists))
  hashes = list(map(lambda l: l.split('/')[-1], filtered_lists))
  hashes_without_blanks = list(filter(lambda h: h != '', hashes))
  return accumulated + hashes_without_blanks

def get_hashes(lists):
  return reduce(reduce_competitive_lists_hashes, lists, [])
