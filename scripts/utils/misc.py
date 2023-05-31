import json
import utils.files as files
import utils.logs as logs

def pp_json(j):
  print(json.dumps(j, indent=2))

def error_and_close(message):
  logs.error_log(message)
  files.clear_csv_directory()
  exit(1)