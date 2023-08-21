""" Miscellaneous functions. """

import json
import utils.files as files
import utils.logs as logs
from typing import Union, Any

def pp_json(j: Union[dict, list, Any]):
  """ Pretty print json. """
  print(json.dumps(j, indent=2))

def error_and_close(message: str):
  """ Log an error and close the program. """
  logs.error_log(message)
  files.clear_csv_directory()
  exit(1)
