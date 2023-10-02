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
  fromMetagame,
  noInfo,
}: {
  title?: string,
  cards: any[],
  tagsByCard: { [key: string]: string[] },
  context: any,
  cardUrlBase: string,
  fromMetagame?: boolean,
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
      fromMetagame={fromMetagame}
      noInfo={noInfo}
    />
  );
};
