"use client";

import { createContext, useState, useReducer, useEffect, useRef } from 'react';
/* Vendor */
import { replace } from 'ramda';
/* Own */
import fetchCards from '../utils/fetch/cardData';
import getDecklistsForCardByContext from '../utils/fetch/getDecklistsForCardByContext';

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
const DbCardsContext = createContext(DEFAULT_VALUES);

/**
 * dbCards Provider
 */
export function DbCardsProvider({
  children,
}: {
  children: React.ReactNode,
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

  const handleChangeCard = async (cardName: string | undefined) => {
    if (selectedCardRef.current === cardName) return;
    toggleLoadingDecklists(true);
    toggleIsLoadingCard(true);
    setSelectedCard(cardName || '');
    selectedCardRef.current = cardName || '';
  };

  useEffect(() => {
    const updateDecklists = async () => {
      const cardDataFetched = await getDecklistsForCardByContext(selectedCard, 'db_cards');
      setOccurrencesForCard({ occurrences: cardDataFetched?.occurrences, percentage: cardDataFetched?.percentage });
      setDecklists(cardDataFetched.decklists);
      toggleLoadingDecklists(false);
    };

    !!selectedCard && updateDecklists();
  }, [selectedCard]);

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
    };

    !!selectedCard && requestData();
  }, [selectedCard]);

  return (
    <DbCardsContext.Provider
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
    </DbCardsContext.Provider>
  );
};

export default DbCardsContext;
