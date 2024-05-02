import base64
import utils.files as files
import utils.logs as logs

logs.begin_log_block('Loading file')
cards_by_commander = files.read_json_file('public/data/metagame', 'metagame_cards_by_commander.json', {})
commanders = list(cards_by_commander.keys())
logs.end_log_block('File loaded')

for commander in commanders:
  logs.begin_log_block(f'Writing file for {commander}')
  cards = cards_by_commander[commander]
  file_name = f'{base64.b64encode(commander.encode('utf-8')).decode("utf-8")}.json'
  files.create_new_file('', f'public/data/metagame/commanders_cards', file_name, cards, with_log=False)
  logs.end_log_block(f'File written for {commander}')
