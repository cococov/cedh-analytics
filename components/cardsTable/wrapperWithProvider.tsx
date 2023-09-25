"use client";

import { useContext } from 'react';
/* Own */
import CardsTable from '../cardsTable';

interface Context {
  handleChangeCard: (_cardName: string | undefined) => {},
};

export default function CardsTableWithProvider({
  title,
  cards,
  tagsByCard,
  context,
  cardUrlBase,
  noInfo,
}: {
  title?: string,
  cards: any[],
  tagsByCard: { [key: string]: string[] },
  context: any,
  cardUrlBase: string,
  noInfo?: boolean,
}) {
  const { handleChangeCard } = useContext<Context>(context);
  return (
    <CardsTable
      title={title || "DB Cards"}
      cards={cards}
      tagsByCard={tagsByCard}
      handleChangeCard={handleChangeCard}
      cardUrlBase={cardUrlBase}
      noInfo={noInfo}
    />
  );
};
