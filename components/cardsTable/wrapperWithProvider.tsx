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
  tournamentId,
}: {
  title?: string,
  cards: any[],
  tagsByCard: { [key: string]: string[] },
  context: any,
  tournamentId?: string,
}) {
  const { handleChangeCard } = useContext<Context>(context);
  return (
    <CardsTable
      title={title || "DB Cards"}
      cards={cards}
      tagsByCard={tagsByCard}
      tournamentId={tournamentId}
      handleChangeCard={handleChangeCard}
    />
  );
};
