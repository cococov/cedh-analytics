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
import LastSetTop10 from '@/components/lastSetTop10';
/* Static */
import styles from '@/styles/Top10LastSet.module.css';
import { server } from '@config';

type Data = {
  last_set: string,
  last_set_top_10: { occurrences: number, cardName: string }[],
};

export const metadata: Metadata = {
  title: 'Top 10 Last Set',
  description: `List of most used cards of the last set. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'Top 10 Last Set | cEDH Analytics',
    images: [
      {
        url: '/images/last_set_image.jpg',
        width: 1280,
        height: 720,
        alt: 'Last Set Image',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `About | ${twitterMetadata.title}`,
    description: `List of most used cards of the last set. | ${twitterMetadata.description}`,
    images: {
      url: '/images/last_set_image.jpg',
      alt: 'Last Set Image',
    },
  },
};

const fetchData = async () => {
  const rawResult = await fetch(`${server}/data/home_overview.json`);
  const result: Data = await rawResult.json();
  return { last_set: result['last_set'], last_set_top_10: result['last_set_top_10'] };
};

export default async function Top10LastSet() {
  const data = await fetchData();
  return (
    <main className={styles.main} >
      <span className={styles.statTable}>
        <section className={styles.statTableTitle}>
          <h1>Top 10 cards</h1>
          <h2>{data.last_set}</h2>
        </section>
        <section className={styles.statTableContent}>
          <LastSetTop10 last_set_top_10={data.last_set_top_10} urlBase='/db-cards' />
        </section>
      </span>
    </main>
  );
};
