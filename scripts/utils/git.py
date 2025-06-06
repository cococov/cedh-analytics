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
import time
import subprocess
from datetime import datetime
from utils import logs, date
from subprocess import DEVNULL, STDOUT

ENV = os.environ.copy()

def add_all():
  subprocess.check_call(['git', 'add', '.'], stdout=DEVNULL, stderr=STDOUT, env=ENV)

def commit(message):
  try:
    status_output = subprocess.check_output(['git', 'status', '--porcelain'], env=ENV).decode('utf-8').strip()
    if not status_output:
      logs.warning_log("No changes to commit. Skipping commit operation.")
      return

    process = subprocess.Popen(['git', 'commit', '-m', message], stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=ENV)
    _, stderr = process.communicate()

    if process.returncode != 0:
      error_msg = stderr.decode('utf-8').strip() if stderr else "Unknown error"
      logs.warning_log(f"Git commit initial attempt failed: {error_msg}")
      logs.info_log("Attempting commit with --allow-empty flag")
      subprocess.check_call(['git', 'commit', '--allow-empty', '-m', message], env=ENV)
  except Exception as e:
    logs.error_log(f"Exception during git commit: {str(e)}")
    raise

def push():
  subprocess.check_call(['git', 'push'], stdout=DEVNULL, stderr=STDOUT, env=ENV)

def push_set_upstream(origin: str) -> None:
  subprocess.check_call(['git', 'push', '--set-upstream', 'origin', origin], stdout=DEVNULL, stderr=STDOUT, env=ENV)

def add_and_commit_tournament(tournament):
  logs.begin_log_block('Commit changes')
  add_all()
  commit(f'chore: update tournament {tournament}')
  time.sleep(1)
  logs.success_log(f'{tournament} updated!')

def push_with_log():
  logs.begin_log_block('Uploading changes')
  push()
  time.sleep(1)
  logs.success_log('Updated!')

def update(msg):
  logs.begin_log_block('Uploading changes')
  add_all()
  commit(msg)
  push()
  time.sleep(1)
  logs.success_log('Updated!')

def update_to_new_branch(msg: str, branch_name: str) -> None:
  logs.begin_log_block('Uploading changes')
  date_str = date.custom_strftime('%B_{S}_%Y', datetime.today())
  branch_name_with_date = f'{branch_name.lower()}_{date_str}'
  subprocess.check_call(['git', 'checkout', '-b', branch_name_with_date], stdout=DEVNULL, stderr=STDOUT, env=ENV)
  add_all()
  commit(msg)
  push_set_upstream(branch_name_with_date)
  time.sleep(1)
  logs.success_log('Updated!')
