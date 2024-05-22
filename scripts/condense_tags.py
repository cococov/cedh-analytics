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

import functools
import utils.files as files
import utils.logs as logs

""" Condense tags script.
Get a list of all the tags and save them in a json file.
"""

BASE_PATH = r'./public/data'
CARDS_PATH = rf'{BASE_PATH}/cards'

# Load json
logs.begin_log_block('Loading tags by card...')
tags: dict[str, list[str]] = files.read_json_file(CARDS_PATH, 'tags.json')
logs.end_log_block('Tags by card loaded!')

# Condense tags

all_tags = list(set(functools.reduce(lambda x, y: x + y, tags.values())))

# Save json
files.create_file_with_log(CARDS_PATH, 'listOfTags.json', all_tags, 'Saving tags...', 'Tags saved!')
