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
  dateCreated: int

class CondensedCommanderData(typing.TypedDict):
  identity: str
  commander: str
  appearances: int
  wins: int
  avgWinRate: float
  avgDrawRate: float
  bestStanding: int
  worstStanding: int

class ProcessedDecklist(typing.TypedDict):
  url: str
  name: str
  wins: int
  losses: int
  draws: int
  winRate: float
  drawRate: float
  standing: int
  hasPartners: bool
  tournamentName: str
  dateCreated: int
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
  avgCmcWithLands: float
  avgCmcWithoutLands: float

class UseOfCards(typing.TypedDict, total=False):
  minCantLands: int
  q1CantLands: float
  medianCantLands: int
  q3CantLands: float
  maxCantLands: int
  minCantDraw: int
  q1CantDraw: float
  medianCantDraw: int
  q3CantDraw: float
  maxCantDraw: int
  minCantTutor: int
  q1CantTutor: float
  medianCantTutor: int
  q3CantTutor: float
  maxCantTutor: int
  minCantCounter: int
  q1CantCounter: float
  medianCantCounter: int
  q3CantCounter: float
  maxCantCounter: int
  minCantRemoval: int
  q1CantRemoval: float
  medianCantRemoval: int
  q3CantRemoval: float
  maxCantRemoval: int
  minCantManaRock: int
  q1CantManaRock: float
  medianCantManaRock: int
  q3CantManaRock: float
  maxCantManaRock: int
  minCantManaDork: int
  q1CantManaDork: float
  medianCantManaDork: int
  q3CantManaDork: float
  maxCantManaDork: int
  minCantStax: int
  q1CantStax: float
  medianCantStax: int
  q3CantStax: float
  maxCantStax: int

class StatsByCommander(typing.TypedDict):
  appearances: int
  colorID: str
  wins: int
  draws: int
  losses: int
  lastSet: str
  lastSetTop10: list[dict[str, str | int]]
  hasPartners: bool
  sortedUseOfLands: list[int]
  avgWinRate: float
  avgDrawRate: float
  bestStanding: int
  worstStanding: int
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
  cantDecksWithStickers: int
  cantDecksWithCompanions: int
  percentageDecksWithStickers: float
  percentageDecksWithCompanions: float
  allTokens: list[str]
  minCantLands: int
  maxCantLands: int
  avgCmcWithLands: float
  avgCmcWithoutLands: float
  minAvgCmcWithLands: float
  minAvgCmcWithoutLands: float
  maxAvgCmcWithLands: float
  maxAvgCmcWithoutLands: float
  useOfCards: UseOfCards
  isValid: bool

class MetagameResume(typing.TypedDict):
  cantCommanders: int
  cantLists: int
  cantTournaments: int
  avgColorPercentages: dict[str, float]
  avgColorIdentityPercentages: dict[str, float]
  avgCantBattles: float
  avgCantPlaneswalkers: float
  avgCantCreatures: float
  avgCantSorceries: float
  avgCantInstants: float
  avgCantArtifacts: float
  avgCantEnchantments: float
  avgCantLands: float
  useOfCards: UseOfCards
  cantDecksWithStickers: int
  cantDecksWithCompanions: int
  percentageDecksWithPartners: float
  percentageDecksWithStickers: float
  percentageDecksWithCompanions: float
  allTokens: list[str]
  lastSet: str
  lastSetTop10: list[dict[str, str | int]]
  avgCmcWithLands: float
  avgCmcWithoutLands: float
  minAvgCmcWithLands: float
  minAvgCmcWithoutLands: float
  maxAvgCmcWithLands: float
  maxAvgCmcWithoutLands: float
  size: typing.Optional[int]

class Tournament(typing.TypedDict):
  TID: str
  name: str
  date: str
  size: int
  validLists: int
  processed: bool
