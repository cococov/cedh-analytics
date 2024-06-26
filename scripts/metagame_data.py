"""
cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2022-present CoCoCov

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
import pandas as pd
from datetime import datetime
from utils.date import custom_strftime
from subprocess import DEVNULL, STDOUT, check_call

""" Metagame data script.
Get the metagame data from the google sheet and save it in a json file.
The result is saved in the file `public/data/metagame/metagame_deprecated.json`.
"""

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data/metagame'
FILE_PATH = FOLDER_PATH + r'/metagame_deprecated.json'
SHEET_ID = '1oO0Ckz_PSMNQXqN8ubtaUl8mqBuswIV_'
OVERVIEW_SHEET_NAME = 'Overview'
CATEGORIES_SHEET_NAME = 'Deck%20Categories'
overview_url = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={OVERVIEW_SHEET_NAME}'
categories_url = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={CATEGORIES_SHEET_NAME}'

print('Beginning')
print('Getting overview data...', end='\r')

overview_data = pd.read_csv(overview_url)

print('\033[KGetting overview data \033[92mDone!\033[0m')
print('Processing metagame data...', end='\r')

overview_data = overview_data.dropna(axis=1)
overview_data['Win Rate'] = overview_data['Win Rate'].str.replace('%', '').astype(float)

print('\033[KProcessing overview data \033[92mDone!\033[0m')
print('Getting categories data...', end='\r')

categories_data = pd.read_csv(categories_url)

print('\033[KGetting categories data \033[92mDone!\033[0m')
print('Processing categories data...', end='\r')

categories_data = categories_data.dropna(axis=1)
categories_data = categories_data.drop(['Total Seats'], axis=1)
categories_data['Win Rate'] = categories_data['Win Rate'].str.replace('%', '').astype(float)
categories_data['App. Rate'] = categories_data['App. Rate'].str.replace('%', '').astype(float)

print('\033[KProcessing categories data \033[92mDone!\033[0m')
print('Saving backup...', end='\r')

if os.path.exists(FILE_PATH):
  version_number = len(os.listdir(os.path.join(DIRNAME, FOLDER_PATH)))
  os.rename(os.path.join(DIRNAME, FILE_PATH), os.path.join(DIRNAME, FOLDER_PATH + r'/metagame_' + f"{version_number}.json"))

print('\033[KBackup saved \033[92mDone!\033[0m')
print('Saving new file...', end='\r')

overview = [{k: v for k, v in x.items() if pd.notnull(v)} for x in overview_data.to_dict('records')]
categories = [{k: v for k, v in x.items() if pd.notnull(v)} for x in categories_data.to_dict('records')]

with open(FILE_PATH, 'w+') as file:
    json.dump({ "overview": overview, "categories": categories}, file)

print('\033[KNew file saved \033[92mDone!\033[0m')
print('Updating date...', end='\r')

update_date = {}
update_date_path = os.path.join(DIRNAME, r'public/data/update_date.json')
with open(update_date_path, 'r+') as f:
  update_date = json.load(f) if os.stat(update_date_path).st_size > 0 else {}

update_date['metagame'] = custom_strftime('%B {S}, %Y', datetime.today())

with open(update_date_path, 'w', encoding='utf8') as f:
  json.dump(update_date, f, ensure_ascii=False)

print('\033[KDate updated \033[92mDone!\033[0m')
print('Uploading changes...', end='\r')

check_call(['git', 'add', '.'], stdout=DEVNULL, stderr=STDOUT)
check_call(['git', 'commit', '-m', '"chore: update metagame"'], stdout=DEVNULL, stderr=STDOUT)
check_call(['git', 'push'], stdout=DEVNULL, stderr=STDOUT)

print('\033[K\033[92mMetagame Updated!\033[0m')
