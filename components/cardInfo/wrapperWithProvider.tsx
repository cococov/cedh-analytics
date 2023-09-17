"use client";

import { useContext } from 'react';
/* Own */
import CardInfo from '../cardInfo';

interface Context {
  selectedCard: string;
  isLoadingCard: boolean;
  cardData: {
    cardImage: string;
    cardType: string;
    cardText: string;
    averagePrice: number;
    gathererId: number;
    cardFaces: { type_line: string }[];
    isReservedList: boolean;
    isDoubleFace: boolean;
  };
}

export default function CardInfoWithProvider({
  context,
}: {
  context: any,
}) {
  const { selectedCard, isLoadingCard, cardData } = useContext<Context>(context);
  return (
    <CardInfo
      selectedCard={selectedCard}
      isLoading={isLoadingCard}
      cardData={cardData}
    />
  );
};
