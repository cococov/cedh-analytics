from data import edhtop16
from utils.misc import pp_json

raw_lists = edhtop16.get_metagame_top_decklists()
commanders = edhtop16.get_commanders_from_data(raw_lists)
decklist_hashes_by_commander = edhtop16.get_decklist_hashes_by_commander(raw_lists)
condensed_commanders_data = edhtop16.get_condensed_commanders_data(commanders, raw_lists)
metagame_resume = edhtop16.get_metagame_resume(raw_lists)

pp_json(condensed_commanders_data)


"""""""""
  {
    "name": "Sam Lyman",
    "profile": "fnWofTAbwDfhtCNmEqTKsqWqvB53",
    "decklist": "https://www.moxfield.com/decks/fRPipprNpkq2Em2-GIZjtw",
    "wins": 1,
    "winsSwiss": 1,
    "winsBracket": 0,
    "winRate": 0.2,
    "winRateSwiss": 0.2,
    "winRateBracket": null,
    "draws": 3,
    "losses": 1,
    "lossesSwiss": 1,
    "lossesBracket": 0,
    "standing": 32,
    "colorID": "WUR",
    "commander": "Elsha of the Infinite",
    "tournamentName": "Mox Masters August 23",
    "dateCreated": 1691848800
  }
"""""""""