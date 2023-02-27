import os
import json
import pandas as pd
from datetime import datetime
from utils import custom_strftime
from subprocess import DEVNULL, STDOUT, check_call

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data/metagame'
FILE_PATH = FOLDER_PATH + r'/metagame.json'
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
