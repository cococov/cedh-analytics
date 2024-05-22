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
import glob
import time
import zipfile
import utils.logs as logs
from pathlib import Path
from datetime import datetime
from subprocess import DEVNULL, STDOUT, check_call
from utils.date import custom_strftime

def clear_csv_directory():
  logs.begin_log_block('Cleaning csv directory')
  files = glob.glob('./csv/*')
  for f in files:
    os.remove(f)
  logs.end_log_block('Csv directory cleaned')
  time.sleep(1)

def delete_file(file_path):
  logs.begin_log_block(f'Deleting file {file_path}')
  if os.path.exists(file_path):
    os.remove(file_path)
  logs.end_log_block(f'File {file_path} deleted')
  time.sleep(1)

def download_file(url, folder):
  check_call(['wget', url, '-P', folder], stdout=DEVNULL, stderr=STDOUT)

def unzip_file(file, folder):
  logs.begin_log_block('Unzip all printing')
  with zipfile.ZipFile(file, 'r') as zip_ref:
    zip_ref.extractall(folder)
  logs.end_log_block('Unzip all printing')

def backup_file(FILE_PATH, DIRNAME, FOLDER_PATH):
  logs.begin_log_block('Saving backup')
  if os.path.exists(FILE_PATH):
    versions_number = len(os.listdir(os.path.join(DIRNAME, FOLDER_PATH)))
    os.rename(os.path.join(DIRNAME, FILE_PATH), os.path.join(DIRNAME, FOLDER_PATH + r'/competitiveCards_' + f"{versions_number}.json"))
  logs.end_log_block('Backup saved')

def create_dir(FOLDER_PATH):
  Path(FOLDER_PATH).mkdir(parents=True, exist_ok=True)

def create_file(dirname, file_path, data):
  with open(os.path.join(dirname, file_path), 'w+', encoding='utf8') as f:
    json.dump(data, f, ensure_ascii=False)
    f.close()

def create_file_with_log(dirname, file_path, data, msg_begin, msg_end):
  logs.begin_log_block(msg_begin)
  create_file(dirname, file_path, data)
  logs.end_log_block(msg_end)

def create_new_file(dirname, folder_path, file_name, data, with_log=True):
  if with_log:
    logs.begin_log_block('Saving new file')
  file_path = os.path.join(folder_path, file_name)
  create_dir(folder_path)
  create_file(dirname, file_path, data)
  if with_log:
    logs.end_log_block(f'{file_name} saved')

def create_data_file(dirname, file_path, data):
  create_file_with_log(dirname, file_path, data, 'Saving new file', 'New file saved')

def update_home_overview(dirname, file_path, data):
  create_file_with_log(dirname, file_path, data, 'Updating overview', 'Overview saved')

def update_date(DIRNAME, kind):
  update_date = {}
  update_date_path = os.path.join(DIRNAME, r'public/data/update_date.json')
  with open(update_date_path, 'r+') as f:
    update_date = json.load(f) if os.stat(update_date_path).st_size > 0 else {}
    f.close()

  update_date[kind] = custom_strftime('%B {S}, %Y', datetime.today())

  with open(update_date_path, 'w', encoding='utf8') as f:
    json.dump(update_date, f, ensure_ascii=False)
    f.close()

def update_db_date(DIRNAME):
  logs.begin_log_block('Updating date')
  update_date(DIRNAME, 'database')
  logs.end_log_block('Date updated')

def read_json_file(dirname, file_name, default={}):
  json_f = default
  try:
    with open(os.path.join(dirname, file_name), 'r') as f:
      json_f = json.load(f)
      f.close()
  except:
    return default
  return json_f

def folder_names_in_directory(dirname):
  return list(filter(lambda x: os.path.isdir(os.path.join(dirname, x)), os.listdir(dirname))) # type: ignore

def file_exists(dirname: str, file_name: str) -> bool:
  """Check if file exists in directory"""
  return os.path.isfile(os.path.join(dirname, file_name))