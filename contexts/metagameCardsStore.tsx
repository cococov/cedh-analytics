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
const MetagameCardsContext = createContext(DEFAULT_VALUES);

/**
 * metagameCards Provider
 */
export function MetagameCardsProvider({
  cardsURL,
  children,
}: {
  cardsURL: string,
  children: React.ReactNode,
}) {
  const selectedCardRef = useRef<string>('');
  const [cards, setCards] = useState<any[]>([]); // TODO: define type
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

  useEffect(() => {
    const requestData = async (url: string) => {
      const raw_result = await fetch(url);
      const result = await raw_result.json();
      setCards(result);
    };

    requestData(cardsURL);
  }, [cardsURL]);

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
    <MetagameCardsContext.Provider
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
    </MetagameCardsContext.Provider>
  );
};

export default MetagameCardsContext;
