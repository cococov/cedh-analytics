def cards_number(data):
  return len(data)

def staples_number(data, staple_def):
  return len(list(filter(lambda d: d['occurrences'] > staple_def, data)))

def pet_cards_number(data):
  return len(list(filter(lambda d: d['occurrences'] == 1, data)))

def last_set_top_10(data, last_set):
  return list(sorted(map(lambda x: {'occurrences': x['occurrences'], 'cardName': x['cardName']}, filter(lambda d: (not d['multiplePrintings']) and ((d['lastPrint'] == last_set[0]) or (d['lastPrint'] == last_set[1])), data)), key=lambda d: d['occurrences'], reverse=True))[0:10]
