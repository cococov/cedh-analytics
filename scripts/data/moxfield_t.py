import typing

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
  card_faces: list[CardFace] # Cambiar
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
  count: str
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
  main: dict[str, DeckItemV3] # Cambiar
  boards: object # Cambiar
  version: int
  tokens: list[CardV2]
  hubs: list
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
