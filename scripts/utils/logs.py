def simple_log(message):
  print(message)

def begin_log_block(message):
  print(f'{message}...', end='\r')

def end_log_block(message):
  print('\033[K', message, ' \033[92mDone!\033[0m', sep='')

def success_log(message):
  print('\033[K\033[92m', message, '\033[0m', sep='')

def error_log(message):
  print('\033[K\033[91m', message, '\033[0m', sep='')

def warning_log(message):
  print('\033[K\033[93m', message, '\033[0m', sep='')

def loading_log(message, current, total):
  print(f"\033[K{message} [{current}/{total}] {round((current/total)*100, 2)}%", end='\r')
