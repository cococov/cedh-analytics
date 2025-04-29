""" Scryfall.
Utility functions to get data from scryfall.

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

import json
import requests
import data.scryfall_t as scryfall_t
import db.update as update_db

API_URL = 'https://api.scryfall.com'
TAGS_URL = 'https://tagger.scryfall.com/graphql'

def get_tags_from_card(name: str) -> list[str]:
  """ Get tags from scryfall tagger for the given card name. """

  raw_card = json.loads(requests.get(f'{API_URL}/cards/named', params={'exact': name}).text)

  headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://tagger.scryfall.com',
    'X-Csrf-Token': 'cepmUnygTvN63NBHK4KTAPzhPXY0cYdKF0zwnEr6fiTZfqiQGrQNAuvvOz5bQhfi1awVuMT3KRR2sRUeUxJhCw',
    'Cookie': '_ga=GA1.2.358669891.1665763652; _ga_3P82LCZY01=GS1.1.1678978267.11.0.1678978270.0.0.0; _scryfall_tagger_session=J92dHYSC0KCeQfyDPKUZSB0fTvAEGcFaX3HkdkQtu3baDx3PJvO0ME7zEvVOZRihxSDLy8wSkvORcYiXqkbZMPdS3Lr7ZlJCgqnBk5hclE5205bMOSVSMvDZcpzOjXyw2QSieAE92m9wIUF3WYP7Dx9B6TVQB%2BlPLDh0GmLHrOu3vR7bFnqNwfxzNP4KJDhhZM5NYAEkYhYODhoOCDpo4uXvoKJdazVIHvZepWY%2FUKsF%2FDaEMXLZSWeIAM20E0jXzpH0m%2FUeYm9ZjbGTldIFUFIAsWMdwCzmIP4uOFKfIjI%3D--8P6bhrh4Ogk8VTYT--yP%2FrcXS9RJiSPYbvNMwfXA%3D%3D'
  }
  data = {
    'operationName': 'FetchCard',
    'query': 'query FetchCard($set:String! $number:String! $back:Boolean=false $moderatorView:Boolean=false){card:cardBySet(set:$set number:$number back:$back){...CardAttrs backside layout scryfallUrl sideNames twoSided rotatedLayout taggings(moderatorView:$moderatorView){...TaggingAttrs tag{...TagAttrs ancestorTags{...TagAttrs}}}relationships(moderatorView:$moderatorView){...RelationshipAttrs}}}fragment CardAttrs on Card{artImageUrl backside cardImageUrl collectorNumber id illustrationId name oracleId printingId set}fragment RelationshipAttrs on Relationship{classifier classifierInverse annotation subjectId subjectName createdAt creatorId foreignKey id name pendingRevisions relatedId relatedName status type}fragment TagAttrs on Tag{category createdAt creatorId id name namespace pendingRevisions slug status type}fragment TaggingAttrs on Tagging{annotation subjectId createdAt creatorId foreignKey id pendingRevisions type status weight}',
    'variables': {'set': raw_card['set'], 'number': raw_card['collector_number']}
  }

  raw_tags = json.loads(requests.post(TAGS_URL, json=data, headers=headers).text)
  tags = list(filter(lambda x: x['tag']['type'] == 'ORACLE_CARD_TAG', raw_tags['data']['card']['taggings']))
  return list(map(lambda x: x['tag']['name'], tags))

def get_banned_cards_commander() -> list[dict]:
  """ Get all cards banned in Commander format from Scryfall.

  Returns:
      list[dict]: A list of card objects that are banned in Commander format.
  """
  banned_cards: list[scryfall_t.Card] = []
  has_more = True
  url = f'{API_URL}/cards/search?q=banned:commander'

  while has_more:
    response = requests.get(url)
    data: scryfall_t.SearchResponse = json.loads(response.text)

    if 'data' in data:
      banned_cards.extend(data['data'])

    has_more = data.get('has_more', False)
    url = data.get('next_page', None)

    if not url:
      has_more = False

  name_list: list[str] = list(map(lambda x: x['name'], banned_cards))
  return name_list
