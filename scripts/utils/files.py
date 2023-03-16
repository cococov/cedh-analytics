import os
import json
import glob
import zipfile
from pathlib import Path
from datetime import datetime
from subprocess import DEVNULL, STDOUT, check_call
from utils.date import custom_strftime

def clear_csv_directory():
  files = glob.glob('./csv/*')
  for f in files:
    os.remove(f)

def download_file(url, folder):
  check_call(['wget', url, '-P', folder], stdout=DEVNULL, stderr=STDOUT)

def unzip_file(file, folder):
  with zipfile.ZipFile(file, 'r') as zip_ref:
    zip_ref.extractall(folder)

def backup_file(FILE_PATH, DIRNAME, FOLDER_PATH):
  if os.path.exists(FILE_PATH):
    versions_number = len(os.listdir(os.path.join(DIRNAME, FOLDER_PATH)))
    os.rename(os.path.join(DIRNAME, FILE_PATH), os.path.join(DIRNAME, FOLDER_PATH + r'/competitiveCards_' + f"{versions_number}.json"))

def create_dir(FOLDER_PATH):
  Path(FOLDER_PATH).mkdir(parents=True, exist_ok=True)

def create_file(DIRNAME, FILE_PATH, data):
  with open(os.path.join(DIRNAME, FILE_PATH), 'w+', encoding='utf8') as f:
    json.dump(data, f, ensure_ascii=False)

def update_date(DIRNAME, kind):
  update_date = {}
  update_date_path = os.path.join(DIRNAME, r'public/data/update_date.json')
  with open(update_date_path, 'r+') as f:
    update_date = json.load(f) if os.stat(update_date_path).st_size > 0 else {}

  update_date[kind] = custom_strftime('%B {S}, %Y', datetime.today())

  with open(update_date_path, 'w', encoding='utf8') as f:
    json.dump(update_date, f, ensure_ascii=False)

def update_db_date(DIRNAME):
  update_date(DIRNAME, 'database')