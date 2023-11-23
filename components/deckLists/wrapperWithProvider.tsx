"use client";

import { useContext } from 'react';
/* Own */
import DeckLists from '../deckLists';

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
