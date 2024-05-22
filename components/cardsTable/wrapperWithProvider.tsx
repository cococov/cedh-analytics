/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
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

import { useContext } from 'react';
/* Own */
import CardsTable from './index';

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
  withUrlPArams,
}: {
  title?: string,
  table?: 'metagame_cards' | 'db_cards',
  context: any,
  cardUrlBase: string,
  fromMetagame?: boolean,
  cards?: any[],
  noInfo?: boolean,
  withUrlPArams?: boolean,
}) {
  const { handleChangeCard } = useContext<Context>(context);

  return (
    <CardsTable
      title={title || "DDB Cards"}
      table={table}
      handleChangeCard={handleChangeCard}
      cardUrlBase={cardUrlBase}
      fromMetagame={fromMetagame}
      cards={cards}
      noInfo={noInfo}
      withUrlPArams={withUrlPArams}
    />
  );
};
