import time
import utils.logs as logs
import utils.date as date
from datetime import datetime
from subprocess import DEVNULL, STDOUT, check_call

def add_all():
  check_call(['git', 'add', '.'], stdout=DEVNULL, stderr=STDOUT)

def commit(message):
  check_call(['git', 'commit', '-m', f'"{message}"'], stdout=DEVNULL, stderr=STDOUT)

def push():
  check_call(['git', 'push'], stdout=DEVNULL, stderr=STDOUT)

def push_set_upstream(origin: str) -> None:
  check_call(['git', 'push', '--set-upstream', 'origin', origin], stdout=DEVNULL, stderr=STDOUT)

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
  check_call(['git', 'checkout', '-b', branch_name_with_date], stdout=DEVNULL, stderr=STDOUT)
  add_all()
  commit(msg)
  push_set_upstream(branch_name_with_date)
  time.sleep(1)
  logs.success_log('Updated!')
