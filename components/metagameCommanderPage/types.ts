export type UseOfCards = {
  minCantLands: number;
  q1CantLands: number;
  medianCantLands: number;
  q3CantLands: number;
  maxCantLands: number;
  minCantDraw: number;
  q1CantDraw: number;
  medianCantDraw: number;
  q3CantDraw: number;
  maxCantDraw: number;
  minCantTutor: number;
  q1CantTutor: number;
  medianCantTutor: number;
  q3CantTutor: number;
  maxCantTutor: number;
  minCantCounter: number;
  q1CantCounter: number;
  medianCantCounter: number;
  q3CantCounter: number;
  maxCantCounter: number;
  minCantRemoval: number;
  q1CantRemoval: number;
  medianCantRemoval: number;
  q3CantRemoval: number;
  maxCantRemoval: number;
  minCantManaRock: number;
  q1CantManaRock: number;
  medianCantManaRock: number;
  q3CantManaRock: number;
  maxCantManaRock: number;
  minCantManaDork: number;
  q1CantManaDork: number;
  medianCantManaDork: number;
  q3CantManaDork: number;
  maxCantManaDork: number;
  minCantStax: number;
  q1CantStax: number;
  medianCantStax: number;
  q3CantStax: number;
  maxCantStax: number;
};

export type Decklist = {
  url: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  drawRate: number;
  standing: number;
  hasPartners: boolean;
  tournamentName: string;
  dateCreated: number;
  hasCompanion: boolean;
  companions: string[];
  hasStickers: boolean;
  stickers: string[];
  tokens: string[];
  colorPercentages: { [key: string]: number };
  colorIdentityPercentages: { [key: string]: number };
  cantBattles: number;
  cantPlaneswalkers: number;
  cantCreatures: number;
  cantSorceries: number;
  cantInstants: number;
  cantArtifacts: number;
  cantEnchantments: number;
  cantLands: number;
  avgCmcWithLands: number;
  avgCmcWithoutLands: number;
}

export type StatsByCommander = {
  [key: string]: {
    appearances: number;
    colorID: string;
    wins: number;
    hasPartners: boolean;
    sortedUseOfLands: number[];
    avgWinRate: number;
    avgDrawRate: number;
    lastSet: string;
    lastSetTop10: { occurrences: number, cardName: string }[];
    bestStanding: number;
    worstStanding: number;
    processed_decklists: Decklist[];
    avgCantBattles: number;
    avgCantPlaneswalkers: number;
    avgCantCreatures: number;
    avgCantSorceries: number;
    avgCantInstants: number;
    avgCantArtifacts: number;
    avgCantEnchantments: number;
    avgCantLands: number;
    avgColorPercentages: { [key: string]: number };
    avgColorIdentityPercentages: { [key: string]: number };
    cantDecksWithStickers: number;
    cantDecksWithCompanions: number;
    percentageDecksWithStickers: number;
    percentageDecksWithCompanions: number;
    allTokens: string[];
    minCantLands: number;
    maxCantLands: number;
    avgCmcWithLands: number;
    avgCmcWithoutLands: number;
    minAvgCmcWithLands: number;
    minAvgCmcWithoutLands: number;
    maxAvgCmcWithLands: number;
    maxAvgCmcWithoutLands: number;
    useOfCards: UseOfCards;
    avgCant?: {
      creatures: number;
      artifacts: number;
      lands: number;
      enchantments: number;
      instants: number;
      sorceries: number;
      battles: number;
      planeswalkers: number;
    }
  };
};

export type ErrorData = { notFound: boolean };

export type PageData = {
  rawCommanderNames: string;
  commanderNumber: number;
  commanderNames: string[];
  commandersIdentity: string[];
  cardImages: string[];
  metagameData: StatsByCommander[string];
};

export type ResponseData = PageData & ErrorData | ErrorData;
