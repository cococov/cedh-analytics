/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

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
  size?: number;
};
