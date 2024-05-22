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

"use client";

import { useContext } from 'react';
/* Own */
import DeckLists from './index';

type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[];
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };

interface Context {
  occurrencesForCard: {
    occurrences: number;
    percentage: number;
  };
  isLoadingDeckLists: boolean;
  decklists: DeckListsByCommander[];
}

export default function DeckListsWithProvider({
  size,
  context,
}: {
  size: 'small' | 'medium' | 'large',
  context: any,
}) {
  const { occurrencesForCard, isLoadingDeckLists, decklists } = useContext<Context>(context);

  return (
    <DeckLists
      occurrencesForCard={occurrencesForCard}
      isLoading={isLoadingDeckLists}
      decklists={decklists}
      size={size}
    />
  );
};
