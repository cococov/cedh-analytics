import os
import glob
import zipfile
from subprocess import DEVNULL, STDOUT, check_call

def clear_csv_directory():
  files = glob.glob('./csv/*')
  for f in files:
    os.remove(f)

def download_file(url, folder):
  check_call(['wget', url, '-P', folder], stdout=DEVNULL, stderr=STDOUT)

def unzip_file(file, folder):
  with zipfile.ZipFile(file, 'r') as zip_ref:
    zip_ref.extractall(folder)
