import time
import utils.logs as logs
from subprocess import DEVNULL, STDOUT, check_call

def add_all():
  check_call(['git', 'add', '.'], stdout=DEVNULL, stderr=STDOUT)

def commit(message):
  check_call(['git', 'commit', '-m', f'"{message}"'], stdout=DEVNULL, stderr=STDOUT)

def push():
  check_call(['git', 'push'], stdout=DEVNULL, stderr=STDOUT)

def update(msg):
  logs.begin_log_block('Uploading changes')
  add_all()
  commit(msg)
  push()
  time.sleep(1)
  logs.success_log('Updated!')