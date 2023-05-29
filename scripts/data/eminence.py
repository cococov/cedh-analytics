import json
import requests

def get_all_decklists(name: str):
  url = "https://edhtop16.com/api/req"
  headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
  data = {'tourney_filter': {'tournamentName': {'$regex': name}}}
  raw_lists = json.loads(requests.post(url, json=data, headers=headers).text)
  print(json.dumps(raw_lists, indent=4))