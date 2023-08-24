import typing

class EdhTop16DeckList(typing.TypedDict):
  name: str
  profile: str
  decklist: str
  wins: int
  winsSwiss: int
  winsBracket: int
  winRate: float
  winRateSwiss: float
  winRateBracket: typing.Optional[float]
  draws: int
  losses: int
  lossesSwiss: int
  lossesBracket: int
  standing: int
  colorID: str
  commander: str
  tournamentName: str
  dateCreated: str

class CondensedCommanderData(typing.TypedDict):
  identity: str
  commander: str
  appearances: int
  wins: int
  avgWinRate: float
  bestStanding: int
  worstStanding: int

class ProcessedDecklist(typing.TypedDict):
  url: str
  wins: int
  winRate: float
  standing: int
  tournamentName: str
  dateCreated: str
  hasCompanion: bool
  companions: list[str]
  hasStickers: bool
  stickers: list[str]
  tokens: list[str]
  colorPercentages: dict[str, float]
  colorIdentityPercentages: dict[str, float]
  cantBattles: int
  cantPlaneswalkers: int
  cantCreatures: int
  cantSorceries: int
  cantInstants: int
  cantArtifacts: int
  cantEnchantments: int
  cantLands: int

class StatsByCommander(typing.TypedDict):
  appearances: int
  wins: int
  avg_win_rate: float
  best_standing: int
  worst_standing: int
  processed_decklists: list[ProcessedDecklist]
  avgCantBattles: float
  avgCantPlaneswalkers: float
  avgCantCreatures: float
  avgCantSorceries: float
  avgCantInstants: float
  avgCantArtifacts: float
  avgCantEnchantments: float
  avgCantLands: float
  avgColorPercentages: dict[str, float]
  avgColorIdentityPercentages: dict[str, float]