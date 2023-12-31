import typing

class CardTuple(typing.TypedDict):
  card_name: str
  card_faces: str
  color_identity: str
  colors: str
  cmc: int
  prices: str
  reserved: bool
  multiple_printings: bool
  last_print: str
  multiverse_ids: str
  type: str
  type_line: str
  power: typing.Optional[int]
  toughness: typing.Optional[int]

class MetagameCardTuple(CardTuple):
  occurrences: int
  card_name: str
  decklists: str
  is_commander: bool
  is_in_99: bool
  percentage_of_use: float
  percentage_of_use_by_identity: float
  avg_win_rate: float
  avg_draw_rate: float

class DbCardTuple(CardTuple):
  occurrences: int
  card_name: str
  decklists: str
  is_commander: bool
  is_in_99: bool
  percentage_of_use: float
  percentage_of_use_by_identity: float

class TagsByCardTuple(typing.TypedDict):
  card_name: str
  tags: str
