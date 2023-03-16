def simple_log(message):
  print(message)

def begin_log_block(message):
  print(f'{message}...', end='\r')

def end_log_block(message):
  print('\033[K', message, ' \033[92mDone!\033[0m', sep='')

def success_log(message):
  print('\033[K\033[92m', message, '\033[0m', sep='')