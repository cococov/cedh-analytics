from data import edhtop16
from utils.misc import pp_json

raw_lists = edhtop16.get_metagame_top_decklists()
commanders = edhtop16.get_commanders_from_data(raw_lists)
decklist_hashes_by_commander = edhtop16.get_decklist_hashes_by_commander(raw_lists)
condensed_commanders_data = edhtop16.get_condensed_commanders_data(commanders, raw_lists)

pp_json(condensed_commanders_data)
