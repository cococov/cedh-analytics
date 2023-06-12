import json
import requests

""" Scryfall.
Utility functions to get data from scryfall.
"""

API_URL = 'https://api.scryfall.com'
TAGS_URL = 'https://tagger.scryfall.com/graphql'

def get_tags_from_card(name: str) -> list[str]:
  """Get tags from scryfall tagger for the given card name."""

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