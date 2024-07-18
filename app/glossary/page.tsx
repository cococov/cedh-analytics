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
import Link from 'next/link';
import Image from "next/image";
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import VerticalAdUnit from '@/components/googleAds/verticalAdUnit';
/* Static */
import styles from '@/styles/Glossary.module.css';
import FranticSearch from '@/public/images/frantic_search.jpg';

export const metadata: Metadata = {
  title: 'cEDH Glossary',
  description: `List of the most used concepts in cEDH and their meaning. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'cEDH Glossary | cEDH Analytics',
    images: [
      {
        url: '/images/frantic_search.jpg',
        width: 788,
        height: 788,
        alt: 'Frantic Search',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `cEDH Glossary | ${twitterMetadata.title}`,
    description: `List of the most used concepts in cEDH and their meaning. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search.jpg',
      alt: 'Frantic Search',
    },
  },
};

export default async function Glossary() {
  return (
    <span className={styles.mainWrapper}>
      <span className="d-flex flex-col">
        <VerticalAdUnit slot={5534382060} />
        <VerticalAdUnit slot={4705883102} />
        <VerticalAdUnit slot={7795930931} />
      </span>
      <main className={styles.glossaryMain} >
        <span className={styles.glossaryImageContainer}>
          <Image
            src={FranticSearch}
            className={styles.glossaryImage}
            alt="Frantic Search"
            width={800}
            height={588}
            placeholder="blur"
            priority
          />
        </span>
        <span className={styles.glossaryText}>
          <h1>Glossary</h1>

          <section id='cEDH' className={styles.glossarySection}>
            <h2>cEDH</h2>
            <p>
              Competitive Elder Dragon Highlander, a format where the goal is to win as fast as possible with the most powerful cards available.
            </p>
          </section>

          <section id='Spite Play' className={styles.glossarySection}>
            <h2>Spite Play</h2>
            <p>
              Any play that doesn&apos;t benefit you, but hurts your opponents. For example, using <Link className={styles.glossaryLink} href='/db-cards/Swords%20to%20Plowshares'>Sword to Plowshares</Link> on a creature of one of your opponents before you die by drawing a card with an empty library.
            </p>
          </section>

          <section id='King Making' className={styles.glossarySection}>
            <h2>King Making</h2>
            <p>
              Do something that favors one of your opponents without this presenting a benefit to you. Sometimes causing one of your opponents to win the game. For example allowing your opponent to draw a lot of cards with his <Link className={styles.glossaryLink} href='/db-cards/rhystic%20study'>Rhystic Study</Link>.
            </p>
          </section>

          <section id='Combo' className={styles.glossarySection}>
            <h2>Combo</h2>
            <p>
              A sequence of cards that allows you to win the game, directly or indirectly.
            </p>
          </section>

          <section id='Stax' className={styles.glossarySection}>
            <h2>Stax</h2>
            <p>
              A strategy that aims to slow down the game by using cards that prevent your opponents from playing their cards.
            </p>
          </section>

          <section id='Ramp' className={styles.glossarySection}>
            <h2>Ramp</h2>
            <p>
              A strategy that aims to speed up the game by using cards that allow you to play more mana.
            </p>
          </section>

          <section id='Mana Rock' className={styles.glossarySection}>
            <h2>Mana Rock</h2>
            <p>
              An artifact that has the ability to produce mana.
            </p>
          </section>
        </span>
      </main>
      <span className="d-flex flex-col">
        <VerticalAdUnit slot={7861194326} />
        <VerticalAdUnit slot={7075243188} />
        <VerticalAdUnit slot={6548112657} />
      </span>
    </span>
  );
};
