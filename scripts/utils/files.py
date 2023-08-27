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

def create_file_with_log(dirname, file_path, data, msg_begin, msg_end):
  logs.begin_log_block(msg_begin)
  create_file(dirname, file_path, data)
  logs.end_log_block(msg_end)

def create_new_file(dirname, folder_path, file_name, data):
  logs.begin_log_block('Saving new file')
  file_path = os.path.join(folder_path, file_name)
  create_dir(folder_path)
  create_file(dirname, file_path, data)
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

  update_date[kind] = custom_strftime('%B {S}, %Y', datetime.today())

  with open(update_date_path, 'w', encoding='utf8') as f:
    json.dump(update_date, f, ensure_ascii=False)

def update_db_date(DIRNAME):
  logs.begin_log_block('Updating date')
  update_date(DIRNAME, 'database')
  logs.end_log_block('Date updated')

def read_json_file(dirname, file_name):
  try:
    with open(os.path.join(dirname, file_name), 'r') as f:
      return json.load(f)
  except:
    return {}

def folder_names_in_directory(dirname):
  return list(filter(lambda x: os.path.isdir(os.path.join(dirname, x)), os.listdir(dirname)))
