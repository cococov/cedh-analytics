import functools
import utils.files as files
import utils.logs as logs

""" Condense tags script.
Get a list of all the tags and save them in a json file.
"""

BASE_PATH = r'./public/data'
CARDS_PATH = rf'{BASE_PATH}/cards'

# Load json
logs.begin_log_block('Loading tags by card...')
tags: dict[str, list[str]] = files.read_json_file(CARDS_PATH, 'tags.json')
logs.end_log_block('Tags by card loaded!')

# Condense tags

all_tags = list(set(functools.reduce(lambda x, y: x + y, tags.values())))

# Save json
files.create_file_with_log(CARDS_PATH, 'listOfTags.json', all_tags, 'Saving tags...', 'Tags saved!')
