"use client";

import { useContext } from 'react';
/* Own */
import CardsTable from '../cardsTable';

interface Context {
  toggleLoading: (_newValue: boolean) => {},
  handleChangeCard: (_cardName: string | undefined) => { },
  forceSnackBarLoading: (_newValue: boolean) => { },
};

export default function CardsTableWithProvider({
  title,
  cards,
  tagsByCard,
  context,
  tournamentId,
}: {
  title: string,
  cards: any[],
  tagsByCard: { [key: string]: string[] },
  context: any,
  tournamentId?: string,
}) {
  const { toggleLoading, handleChangeCard, forceSnackBarLoading } = useContext<Context>(context);
  return (
    <CardsTable
      title="DB Cards"
      cards={cards}
      tagsByCard={tagsByCard}
      tournamentId={tournamentId}
      toggleLoading={toggleLoading}
      handleChangeCard={handleChangeCard}
      forceSnackBarLoading={forceSnackBarLoading}
    />
  );
};
