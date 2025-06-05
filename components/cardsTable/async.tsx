"use client";

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

import { useState, useEffect } from 'react';
import { CircularProgress } from '@heroui/react';
/* Own */
import CardsTableWithProvider from './wrapperWithProvider';
import CardsTable from './index';
import { fetchCardData } from './actions';
/* Static */
import styles from '@/styles/CardsList.module.css';

export default function AsyncCardsTable({
  title,
  table,
  cardsURL,
  tagsByCardURL,
  context,
  fromMetagame,
  noInfo,
  withUrlPArams,
}: {
  title?: string,
  table?: 'metagame_cards' | 'db_cards',
  cardsURL?: string,
  tagsByCardURL?: string,
  context?: any,
  fromMetagame?: boolean,
  noInfo?: boolean,
  withUrlPArams?: boolean,
}) {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchCardData(cardsURL, tagsByCardURL, fromMetagame);
        setCards(result.cards);
      } catch (error) {
        console.error('Error loading card data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [cardsURL, tagsByCardURL, fromMetagame]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress size="lg" color="secondary" aria-label="Loading..." />
      </div>
    );
  }

  return (
    <span className={styles.cardsContainer}>
      {
        context ? (
          <CardsTableWithProvider
            title={title || "DB Cards"}
            table={table}
            context={context}
            cardUrlBase="/metagame-cards"
            fromMetagame={fromMetagame}
            cards={cards}
            noInfo={noInfo}
            withUrlPArams={withUrlPArams}
          />
        ) : (
          <CardsTable
            title={title || "DB Cards"}
            table={table}
            cardUrlBase="/metagame-cards"
            fromMetagame={fromMetagame}
            cards={cards}
            noInfo={noInfo}
            withUrlPArams={withUrlPArams}
          />
        )
      }
    </span>
  );
}
