"""
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

import typing
from enum import Enum

# Common

class User(typing.TypedDict):
  userName: str
  profileImageUrl: str
  badges: list[str]

class Legality(typing.TypedDict):
  # "legal" | "not_legal"
  standard: str
  future: str
  historic: str
  gladiator: str
  pioneer: str
  explorer: str
  modern: str
  legacy: str
  pauper: str
  vintage: str
  penny: str
  commander: str
  oathbreaker: str
  brawl: str
  historicbrawl: str
  alchemy: str
  paupercommander: str
  duel: str
  oldschool: str
  premodern: str
  predh: str

class ViewSettings(typing.TypedDict):
  groupBy: str
  sortBy: str
  useMana: bool
  usePrice: bool
  useSet: bool
  viewMode: str
  allowMultiplePrintings: bool

class Prices(typing.TypedDict):
  usd: float
  usd_foil: float
  eur: float
  eur_foil: float
  tix: float
  ck: float
  ck_foil: float
  lastUpdatedAtUtc: str
  ck_buy: float
  ck_buy_foil: float
  ct: float
  ct_foil: float

class CardFace(typing.TypedDict):
  id: str
  name: str
  mana_cost: str # "{2}{W}{U}"
  type_line:  str
  oracle_text: str
  colors: list[str] # ["U", "W"]
  color_indicator:  list
  image_seq: int

class CardType(Enum):
  BATTLE = '1'
  PLANESWALKER = '2'
  CREATURE = '3'
  SORCERY = '4'
  INSTANT = '5'
  ARTIFACT = '6'
  ENCHANTMENT = '7'
  LAND = '8'
  STICKER = '11'

# Version 2

class CardV2(typing.TypedDict):
  id: str
  uniqueCardId: str
  scryfall_id: str
  set: str
  set_name: str
  name: str
  cn: str
  layout: str
  cmc: float
  type: str # number
  type_line: str
  oracle_text: str
  loyalty: str # number
  mana_cost: str # "{2}{W}{U}"
  colors: list[str] # ["U", "W"]
  color_indicator: list[str] # []
  color_identity: list[str] # ["U", "W"]
  legalities: Legality
  frame: str # "2015"
  reserved: bool
  digital: bool
  foil: bool
  nonfoil: bool
  etched: bool
  glossy: bool
  rarity: str
  border_color: str
  colorshifted: bool
  lang: str
  latest: bool
  has_multiple_editions: bool
  has_arena_legal: bool
  prices: dict[str, float]
  card_faces: list
  artist: str
  promo_types: list[str]
  cardHoarderUrl: str
  cardKingdomUrl: str
  cardKingdomFoilUrl: str
  cardMarketUrl: str
  tcgPlayerUrl: str
  isArenaLegal: bool
  released_at: str
  edhrec_rank: int
  tcgplayer_id: int
  cardkingdom_id: int
  cardkingdom_foil_id: int
  arena_id: int
  reprint: bool
  set_type: str
  acorn: bool
  image_seq: int
  cardTraderUrl: str
  cardTraderFoilUrl: str
  isToken: bool
  defaultFinish: str

class DeckItemV2(typing.TypedDict):
  quantity: int
  boardType: str # maybeboard | sideboard | mainboard
  finish: str
  isFoil: bool
  isAlter: bool
  isProxy: bool
  card: CardV2
  useCmcOverride: bool
  useManaCostOverride: bool
  useColorIdentityOverride: bool
  excludedFromColor: bool

class DecklistV2(typing.TypedDict):
  id: str
  name: str
  description: str
  format: str
  visibility: str
  publicUrl: str
  publicId: str
  likeCount: int
  viewCount: int
  commentCount: int
  areCommentsEnabled: bool
  isShared: bool
  authorsCanEdit: bool
  createdByUser: User
  authors: list[User]
  requestedAuthors: list[User]
  main: dict[str, DeckItemV2]
  sideboardCount: int
  sideboard: dict[str, DeckItemV2]
  maybeboardCount: int
  maybeboard: dict[str, DeckItemV2]
  commandersCount: int
  commanders: dict[str, DeckItemV2]
  companionsCount:int
  companions: dict[str, DeckItemV2]
  attractionsCount: int
  attractions: dict[str, DeckItemV2]
  stickersCount: int
  stickers: dict[str, DeckItemV2]
  signatureSpellsCount: int
  signatureSpells: dict[str, DeckItemV2]
  version: int
  tokens: list[CardV2]
  hubs: list
  createdAtUtc: str
  lastUpdatedAtUtc: str
  exportId: str
  authorTags: dict
  originalDeck: dict
  isTooBeaucoup: bool
  affiliates: dict[str, str]
  mainCardIdIsBackFace: bool
  allowPrimerClone: bool
  enableMultiplePrintings: bool
  includeBasicLandsInPrice: bool
  includeCommandersInPrice: bool
  includeSignatureSpellsInPrice: bool
  media: list
  url: str

# Version 3

class CardV3(typing.TypedDict):
  id: str
  uniqueCardId: str
  scryfall_id: str
  set: str
  set_name: str
  name: str
  cn: str
  layout: str
  cmc: int
  type: str # number
  type_line: str
  oracle_text: str
  mana_cost: str # "{2}{W}{U}"
  power: str # number
  colors: list[str] # ["U", "W"]
  color_indicator: list[str] # []
  color_identity: list[str] # ["U", "W"]
  legalities: Legality
  frame: str # "2015"
  reserved: bool
  digital: bool
  foil: bool
  nonfoil: bool
  etched: bool
  glossy: bool
  rarity: str
  border_color: str
  colorshifted: bool
  lang: str
  latest: bool
  has_multiple_editions: bool
  has_arena_legal: bool
  prices: Prices
  card_faces: list[CardFace]
  artist: str
  promo_types: list[str]
  cardHoarderUrl: str
  cardKingdomUrl: str
  cardKingdomFoilUrl: str
  cardMarketUrl: str
  tcgPlayerUrl: str
  isArenaLegal: bool
  released_at: str
  edhrec_rank: int
  multiverse_ids: list[int]
  cardmarket_id: int
  mtgo_id: int
  arena_id: int
  tcgplayer_id: int
  cardkingdom_id: int
  cardkingdom_foil_id: int
  reprint: bool
  set_type: str
  coolStuffIncUrl: str
  coolStuffIncFoilUrl: str
  acorn: bool
  image_seq: int
  cardTraderUrl: str
  cardTraderFoilUrl: str
  isToken: bool
  defaultFinish: str

class DeckItemV3(typing.TypedDict):
  quantity: int
  boardType: str
  finish: str
  isFoil: bool
  isAlter: bool
  isProxy: bool
  card: CardV3
  useCmcOverride: bool
  useManaCostOverride: bool
  useColorIdentityOverride: bool
  excludedFromColor: bool

class BoardV3(typing.TypedDict):
  count: int
  cards: dict[str, DeckItemV3]

class DecklistV3(typing.TypedDict):
  id: str
  name: str
  description: str
  format: str
  visibility: str
  publicUrl: str
  publicId: str
  likeCount: int
  viewCount: int
  commentCount: int
  areCommentsEnabled: bool
  isShared: bool
  authorsCanEdit: bool
  createdByUser: User
  authors: list[User]
  requestedAuthors: list[User]
  main: CardV3
  boards: dict[str, BoardV3] # mainboard | sideboard | maybeboard | commanders | companions | signatureSpells | attractions | stickers | contraptions | planes
  version: int
  tokens: list[CardV2]
  hubs: list[dict[str, str]]
  createdAtUtc: str
  lastUpdatedAtUtc: str
  exportId: str
  authorTags: dict
  viewSettings: ViewSettings
  originalDeck: dict
  isTooBeaucoup: bool
  affiliates: dict[str, str]
  mainCardIdIsBackFace: bool
  allowPrimerClone: bool
  enableMultiplePrintings: bool
  includeBasicLandsInPrice: bool
  includeCommandersInPrice: bool
  includeSignatureSpellsInPrice: bool
  colors: list[str]
  colorPercentages: dict[str, float]
  colorIdentity: list[str]
  colorIdentityPercentages: dict[str, float]
  media: list
  url: str
  status: typing.Optional[int]
