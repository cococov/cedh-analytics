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

export type ResumeData = {
  cantCommanders: number;
  cantLists: number;
  cantTournaments: number;
  avgColorPercentages: { white: number; blue: number; black: number; red: number; green: number; };
  avgColorIdentityPercentages: { white: number; blue: number; black: number; red: number; green: number; };
  avgCantBattles: number;
  avgCantPlaneswalkers: number;
  avgCantCreatures: number;
  avgCantSorceries: number;
  avgCantInstants: number;
  avgCantArtifacts: number;
  avgCantEnchantments: number;
  avgCantLands: number;
  useOfCards: UseOfCards
  cantDecksWithStickers: number;
  cantDecksWithCompanions: number;
  percentageDecksWithPartners: number;
  percentageDecksWithStickers: number;
  percentageDecksWithCompanions: number;
  allTokens: string[];
  lastSet: string;
  lastSetTop10: { occurrences: number; cardName: string; }[];
  avgCmcWithLands: number;
  avgCmcWithoutLands: number;
  minAvgCmcWithLands: number;
  minAvgCmcWithoutLands: number;
  maxAvgCmcWithLands: number;
  maxAvgCmcWithoutLands: number;
  size: number;
};