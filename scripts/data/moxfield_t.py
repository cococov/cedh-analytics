import typing

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

class Card(typing.TypedDict):
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
  prices: dict[str, str]
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

class DeckItem(typing.TypedDict):
  quantity: int
  boardType: str # maybeboard | sideboard | mainboard
  finish: str
  isFoil: bool
  isAlter: bool
  isProxy: bool
  card: Card
  useCmcOverride: bool
  useManaCostOverride: bool
  useColorIdentityOverride: bool
  excludedFromColor: bool

class User(typing.TypedDict):
  userName: str
  profileImageUrl: str
  badges: list[str]

class Decklist(typing.TypedDict):
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
  main: dict[str, DeckItem]
  sideboardCount: int
  sideboard: dict[str, DeckItem]
  maybeboardCount: int
  maybeboard: dict[str, DeckItem]
  commandersCount: int
  commanders: dict[str, DeckItem]
  companionsCount:int
  companions: dict[str, DeckItem]
  attractionsCount: int
  attractions: dict[str, DeckItem]
  stickersCount: int
  stickers: dict[str, DeckItem]
  signatureSpellsCount: int
  signatureSpells: dict[str, DeckItem]
  version: int
  tokens: list[Card]
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