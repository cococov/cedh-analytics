"""
Logging utilities for the scripts.

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

def simple_log(message: str):
  """ Print a simple log message. With no formatting. """
  print(message)

def ephemeral_log(message: str):
  """ Print a log message that will be overwritten in the next call. """
  print('\033[K', message, end='\r')

def begin_log_block(message: str):
  """ Print a log message for the beginning of a block.\n
  The message is followed by a '...' and is overwritten by the `end_log_block` message.
  """
  print(f'{message}...', end='\r')

def end_log_block(message: str):
  """ Print a log message for the end of a block, with a green 'Done!' at the end."""
  print('\033[K', message, ' \033[92mDone!\033[0m', sep='')

def success_log(message: str):
  """ Print a log message for a successful operation. (Green)"""
  print('\033[K\033[92m', message, '\033[0m', sep='')

def error_log(message: str):
  """ Print a log message for an error. (Red)"""
  print('\033[K\033[91m', message, '\033[0m', sep='')

def warning_log(message: str):
  """ Print a log message for a warning. (Yellow)"""
  print('\033[K\033[93m', message, '\033[0m', sep='')

def loading_log(message: str, current: int, total: int, end= '\r'):
  """ Print a log message for a loading status.\n
  The message is followed by [current/total] and the percentage.\n
  The line is overwritten in each call. Also is overwritten calling `success_log`, `warning_log` or `error_log`.
  """
  fixed_total = total if total > 0 else 1
  print(f"\033[K{message} [{current}/{total}] {round((current/fixed_total)*100, 2)}%", end=end)
