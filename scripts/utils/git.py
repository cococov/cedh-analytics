import time
import utils.logs as logs
from subprocess import DEVNULL, STDOUT, check_call

def add_all():
  check_call(['git', 'add', '.'], stdout=DEVNULL, stderr=STDOUT)

def commit(message):
  check_call(['git', 'commit', '-m', f'"{message}"'], stdout=DEVNULL, stderr=STDOUT)

def push():
  check_call(['git', 'push'], stdout=DEVNULL, stderr=STDOUT)

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
