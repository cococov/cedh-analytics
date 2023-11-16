"use client";

import { useContext } from 'react';
/* Own */
import CardsTable from '../cardsTable';

interface Context {
  handleChangeCard: (_cardName: string | undefined) => {},
};

export default function CardsTableWithProvider({
  title,
  table,
  context,
  cardUrlBase,
  fromMetagame,
  cards,
  noInfo,
}: {
  title?: string,
  table?: 'metagame_cards' | 'db_cards',
  context: any,
  cardUrlBase: string,
  fromMetagame?: boolean,
  cards?: any[],
  noInfo?: boolean,
}) {
  const { handleChangeCard } = useContext<Context>(context);

  return (
    <CardsTable
      title={title || "DB Cards"}
      table={table}
      handleChangeCard={handleChangeCard}
      cardUrlBase={cardUrlBase}
      fromMetagame={fromMetagame}
      cards={cards}
      noInfo={noInfo}
    />
  );
};
