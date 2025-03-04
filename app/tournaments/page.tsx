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
import TournamentsTable from '@/components/tournamentsTable';
import VerticalAdUnit from '@/components/googleAds/verticalAdUnit';
/* Static */
import styles from '@/styles/Tournaments.module.css';
import TOURNAMENTS from '@/public/data/metagame/tournaments.json';

type Tournament = {
  TID: string;
  name: string;
  date: string;
  size: number;
  validLists: number;
  processed: boolean;
};

export const metadata: Metadata = {
  title: 'Tournaments',
  description: `cEDH tournaments list | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'Tournaments | cEDH Analytics',
    images: [
      {
        url: '/carrot_compost_playmat.jpeg',
        width: 1280,
        height: 720,
        alt: 'Carrot Compost Playmat',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `Tournaments | ${twitterMetadata.title}`,
    description: `cEDH tournaments list. | ${twitterMetadata.description}`,
    images: {
      url: '/carrot_compost_playmat.jpeg',
      alt: 'Carrot Compost Playmat',
    },
  },
};

const fetchData = async () => {
  const tournaments = TOURNAMENTS as Tournament[];
  return tournaments;
};

export default async function Tournaments() {
  const tournaments = await fetchData();

  return (
    <main className={styles.main}>
      <span className="hidden 4xl:block mr-4">
        <VerticalAdUnit slot={8456090696} />
      </span>
      <TournamentsTable tournaments={tournaments} />
      <span className="hidden 3xl:block ml-4">
        <VerticalAdUnit slot={9766638091} />
      </span>
    </main>
  );
};
