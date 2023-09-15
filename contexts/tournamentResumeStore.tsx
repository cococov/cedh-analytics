"use client";

import { createContext, useState, useReducer, useEffect, useRef } from 'react';
/* Vendor */
import { replace } from 'ramda';
/* Own */
import fetchCards from '../utils/fetch/cardData';

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
  decklists: [] as DeckListsByCommander[],
  selectedCard: '',
  isLoading: false,
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
  toggleLoadingDecklists: (_state: boolean) => { },
  setDecklists: (_decklists: DeckListsByCommander[]) => { },
  setSelectedCard: (_selectedCard: string) => { },
  toggleLoading: (_newValue: boolean) => { },
  setCardData: (_cardData: CardData) => { },
  handleChangeCard: (_cardName: string | undefined) => { },
  forceSnackBarLoading: (_newValue: boolean) => { },
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
  const [isForcedSnackBarLoading, forceSnackBarLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isLoadingDeckLists, toggleLoadingDecklists] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isLoading, toggleLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
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

  const handleChangeCard = async (cardName: string | undefined) => {
    if (selectedCardRef.current === cardName) return;
    toggleLoadingDecklists(true);
    setTimeout(() => { toggleLoadingDecklists(false) }, 300);
    toggleLoading(true);
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
      toggleLoading(false);
    };

    !!selectedCard && requestData();
  }, [selectedCard]);

  return (
    <TournamentResumeContext.Provider
      value={{
        occurrencesForCard,
        isLoadingDeckLists,
        decklists,
        selectedCard,
        isLoading,
        cardData,
        setOccurrencesForCard,
        toggleLoadingDecklists,
        setDecklists,
        setSelectedCard,
        toggleLoading,
        setCardData,
        handleChangeCard,
        forceSnackBarLoading,
      }}
    >
      {children}
    </TournamentResumeContext.Provider>
  );
};

export default TournamentResumeContext;
