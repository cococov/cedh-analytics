import utils.files as files
import data.moxfield as moxfield
import utils.logs as logs
import data.moxfield_t as moxfield_t
from data import edhtop16
from utils.misc import pp_json

BASE_PATH = r'./public/data'
METAGAME_PATH = rf'{BASE_PATH}/metagame'
FORCE_UPDATE = True

logs.begin_log_block('Getting decklists from EDH Top 16')
raw_lists = edhtop16.get_metagame_top_decklists()
logs.end_log_block('Decklists from EDH Top 16 got!')

logs.begin_log_block('Preprocessing EDH Top 16 data')
commanders = edhtop16.get_commanders_from_data(raw_lists)
decklist_hashes_by_commander = edhtop16.get_decklist_hashes_by_commander(raw_lists)
decklist_hashes_by_tournament = edhtop16.get_decklist_hashes_by_tournament(raw_lists)
condensed_commanders_data = edhtop16.get_condensed_commanders_data(commanders, raw_lists)
logs.end_log_block('EDH Top 16 data preprocessed!')

# load saved decklists
logs.begin_log_block('Loading saved decklists')
decklists_by_hash: dict[str, moxfield_t.DecklistV3] = files.read_json_file(METAGAME_PATH, 'decklists.json') if not FORCE_UPDATE else {}
logs.end_log_block('Saved decklists loaded!')

# get decklists from hashes (not saved)
logs.begin_log_block('Getting decklists from hashes...')
decklists_by_commander: dict[str, list[moxfield_t.DecklistV3]] = {}
total_lists = len(raw_lists)
cant_hashes_requested = 0
no_new_data = True
for commander in commanders:
  decklists_by_commander[commander] = []
  for hash in decklist_hashes_by_commander[commander]:
    logs.loading_log("Getting decklists from hashes", cant_hashes_requested, total_lists)
    if hash in decklists_by_hash.keys():
      if 'status' in list(decklists_by_hash[hash].keys()):
        continue
      decklists_by_commander[commander].append(decklists_by_hash[hash])
    else:
      decklist = moxfield.get_decklists_data(hash, version=3)
      if 'status' in list(decklist.keys()):
        continue
      decklists_by_commander[commander].append(decklist)
      decklists_by_hash[hash] = decklist
      no_new_data = False
    cant_hashes_requested += 1
logs.end_log_block('Decklists from hashes got!')

# save decklists
if not no_new_data:
  files.create_file_with_log(METAGAME_PATH, 'decklists.json', decklists_by_hash, 'Saving decklists', 'Decklists saved!')

commander_stats = edhtop16.get_commander_stats_by_commander(commanders, raw_lists, decklists_by_commander)

metagame_resume = edhtop16.get_metagame_resume(commanders, raw_lists, decklists_by_commander)

pp_json(commander_stats)
