from subprocess import DEVNULL, STDOUT, check_call

def add_all():
  check_call(['git', 'add', '.'], stdout=DEVNULL, stderr=STDOUT)

def commit(message):
  check_call(['git', 'commit', '-m', f'"{message}"'], stdout=DEVNULL, stderr=STDOUT)

def push():
  check_call(['git', 'push'], stdout=DEVNULL, stderr=STDOUT)
