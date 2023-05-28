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
