import functools

def cards_number(data):
  return len(data)

def staples_number(data, staple_def):
  return len(list(filter(lambda d: d['occurrences'] > staple_def, data)))

def pet_cards_number(data):
  return len(list(filter(lambda d: d['occurrences'] == 1, data)))

def last_set_top_10(data, last_set):
  return list(sorted(map(lambda x: {'occurrences': x['occurrences'], 'cardName': x['cardName']}, filter(lambda d: (not d['multiplePrintings']) and ((d['lastPrint'] == last_set[0]) or (d['lastPrint'] == last_set[1])), data)), key=lambda d: d['occurrences'], reverse=True))[0:10]

def get_cards_winrate(cards, raw_lists):
  result = []
  for card in cards:
    occurrences = card['occurrences']
    decklists_url = [url for urls in map(lambda x: map(lambda y: y['url'], x['decks']), card['decklists']) for url in urls] # Ugly python flatten
    avg_winrate = round(functools.reduce(lambda x, y: x + y, map(lambda x: x['winRate'] if x['decklist'] in decklists_url else 0, raw_lists)) / occurrences, 3)
    result.append({**card, 'avgWinRate': avg_winrate})
  return result
