"""
Utility functions to get data from Moxfield.

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
import time
import requests
import data.moxfield_t as moxfield_t
import utils.logs as logs
from typing import Union
from dotenv import load_dotenv
import utils.misc as misc

load_dotenv()
VALID_DECKS = 0
HEADERS = {'User-Agent': os.getenv('MOXFIELD_USER_AGENT')}
decklists_data_obtained_number = 0

def get_decklists_from_bookmark(id: str) -> dict[str, Union[int, list[dict]]]:
  url = f"https://api2.moxfield.com/v1/bookmarks/{id}/decks?pageNumber=1&pageSize=1000"
  raw_lists = requests.get(url)
  return json.loads(raw_lists.text)

def get_decklist_hashes_from_bookmark(lists):
  return list(map(lambda x: x['deck']['publicId'], lists['data']))

def get_decklists_data(hash: str, version=3, no_log=False) -> moxfield_t.DecklistV3:
  try:
    global decklists_data_obtained_number, VALID_DECKS
    time.sleep(2)
    raw_data = requests.get(f"https://api.moxfield.com/v{version}/decks/all/{hash}", headers=HEADERS)
    if raw_data.status_code == 403: misc.error_and_close(f"[Version {version}] Error getting decklist data for {hash} (403)")
    time.sleep(2)
    data = json.loads(raw_data.text)
    data['url'] = f"https://www.moxfield.com/decks/{hash}"
    decklists_data_obtained_number += 1
    if not no_log:
      logs.loading_log("Getting decklists data", decklists_data_obtained_number, VALID_DECKS)
    return data
  except json.decoder.JSONDecodeError as e:
    logs.error_log(f"[Version {version}] Error getting decklist data for {hash} (JSONDecodeError)")
    raise json.decoder.JSONDecodeError(e.msg, e.doc, e.pos)
  except Exception as e:
    logs.error_log(f"[Version {version}] Unknown error getting decklist data for {hash} ({e.__class__.__name__})")
    raise Exception(e)

def get_decklists_data_from_hashes(hashes):
  logs.begin_log_block('Getting decklists data')
  decklists_data = list(filter(lambda x: 'name' in x.keys(), list(map(get_decklists_data, hashes)))) # filter out decks without name (without name means that the url returns a 404)
  logs.end_log_block('Getting decklists data')
  return decklists_data
