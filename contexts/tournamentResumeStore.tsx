/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2021-present CoCoCov
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

import { createContext, useState, useReducer, useEffect, useRef } from 'react';
/* Vendor */
import { replace } from 'ramda';
/* Own */
import fetchCards from '@/utils/fetch/cardData';

type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[];
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type occurrencesForCard = { occurrences: number, percentage: number };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };
type CardData = {
  cardImage: string;
  cardType: string;
  cardText: string;
  averagePrice: number;
  gathererId: number;
  cardFaces: { type_line: string }[];
  isReservedList: boolean;
  isDoubleFace: boolean;
};

/**
 * Default Values
 */
const DEFAULT_VALUES = {
  occurrencesForCard: { occurrences: 0, percentage: 0 },
  isLoadingDeckLists: false,
  isLoadingCard: false,
  decklists: [] as DeckListsByCommander[],
  selectedCard: '',
  cardData: {
    cardImage: '',
    cardType: '',
    cardText: '',
    averagePrice: 0,
    gathererId: 0,
    cardFaces: [] as { type_line: string }[],
    isReservedList: false,
    isDoubleFace: false,
  },
  setOccurrencesForCard: (_occurrencesForCard: occurrencesForCard) => { },
  setDecklists: (_decklists: DeckListsByCommander[]) => { },
  setSelectedCard: (_selectedCard: string) => { },
  setCardData: (_cardData: CardData) => { },
  handleChangeCard: (_cardName: string | undefined) => { },
};

/**
 * App Context.
 */
const TournamentResumeContext = createContext(DEFAULT_VALUES);

/**
 * tournamentResume Provider
 */
export function TournamentResumeProvider({
  cards,
  children,
}: {
  cards: any[],
  children: any,
}) {
  const selectedCardRef = useRef<string>('');
  const [isLoadingDeckLists, toggleLoadingDecklists] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isLoadingCard, toggleIsLoadingCard] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [occurrencesForCard, setOccurrencesForCard] = useState<occurrencesForCard>(DEFAULT_VALUES.occurrencesForCard);
  const [decklists, setDecklists] = useState<DeckListsByCommander[]>([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [cardData, setCardData] = useState<CardData>({
    cardImage: '',
    cardType: '',
    cardText: '',
    averagePrice: 0,
    gathererId: 0,
    cardFaces: [],
    isReservedList: false,
    isDoubleFace: false,
  });
  const toggleLoadingDecklistsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleChangeCard = async (cardName: string | undefined) => {
    if (selectedCardRef.current === cardName) return;
    toggleLoadingDecklists(true);
    toggleIsLoadingCard(true);
    toggleLoadingDecklistsTimeoutRef.current = setTimeout(() => { toggleLoadingDecklists(false) }, 300);
    setSelectedCard(cardName || '');
    selectedCardRef.current = cardName || '';
    const card = cards.find((current: any) => current['cardName'] === cardName);
    const decklists: DeckListsByCommander[] = card?.decklists || [];
    setOccurrencesForCard({ occurrences: card?.occurrences, percentage: card?.percentageOfUse });
    setDecklists(decklists);
  };

  useEffect(() => {
    const requestData = async () => {
      const cardName = replace(/\s/g, '%20', selectedCard);
      const result = await fetchCards(cardName);
      setCardData({
        cardImage: result['cardImage'],
        cardType: result['cardType'],
        cardText: result['cardText'],
        averagePrice: parseFloat(result['averagePrice']),
        gathererId: result['gathererId'],
        cardFaces: result['cardFaces'],
        isReservedList: result['isReservedList'],
        isDoubleFace: result['isDoubleFace'],
      });
      toggleIsLoadingCard(false);
      toggleLoadingDecklists(false);
      clearTimeout(toggleLoadingDecklistsTimeoutRef.current);
    };

    !!selectedCard && requestData();
  }, [selectedCard]);

  return (
    <TournamentResumeContext.Provider
      value={{
        occurrencesForCard,
        isLoadingDeckLists,
        isLoadingCard,
        decklists,
        selectedCard,
        cardData,
        setOccurrencesForCard,
        setDecklists,
        setSelectedCard,
        setCardData,
        handleChangeCard,
      }}
    >
      {children}
    </TournamentResumeContext.Provider>
  );
};

export default TournamentResumeContext;
