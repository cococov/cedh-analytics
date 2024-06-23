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

import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import CardsTableWithProvider from '@/components/cardsTable/wrapperWithProvider';
import CardInfoWithProvider from '@/components/cardInfo/wrapperWithProvider';
import DeckListsWithProvider from '@/components/deckLists/wrapperWithProvider';
import MetagameCardsContext, { MetagameCardsProvider } from '@/contexts/metagameCardsStore';
/* Static */
import styles from '@/styles/CardsList.module.css';

export const metadata: Metadata = {
  title: 'Metagame Cards',
  description: `Cards used in metagame decklists. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'Metagame Cards | cEDH Analytics',
    images: [
      {
        url: '/images/frantic_search_og.jpg',
        width: 788,
        height: 788,
        alt: 'Frantic Search',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `Metagame Cards | ${twitterMetadata.title}`,
    description: `Cards used in metagame decklists. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search_og.jpg',
      alt: 'Frantic Search',
    },
  },
};

export default async function MetagameCards() {
  return (
    <main className={styles.main}>
      <MetagameCardsProvider>
        <span className={styles.leftSpan}>
          <DeckListsWithProvider size="medium" context={MetagameCardsContext} />
        </span>
        <span className={styles.cardsContainerWithAsideElements}>
          <CardsTableWithProvider
            title="Metagame Cards"
            table="metagame_cards"
            context={MetagameCardsContext}
            cardUrlBase="/metagame-cards"
            fromMetagame
            withUrlPArams
          />
        </span>
        <CardInfoWithProvider context={MetagameCardsContext} />
      </MetagameCardsProvider>
    </main >
  );
};
