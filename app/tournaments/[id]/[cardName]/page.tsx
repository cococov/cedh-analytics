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
import { redirect } from 'next/navigation';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';

export const metadata: Metadata = {
  title: 'Carrot Compost',
  description: `Carrot Compost | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'Carrot Compost | cEDH Analytics',
    images: [
      {
        url: '/images/carrot_compost_white.png',
        width: 788,
        height: 788,
        alt: 'Carrot Compost',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `Carrot Compost | ${twitterMetadata.title}`,
    description: `Carrot Compost | ${twitterMetadata.description}`,
    images: {
      url: '/images/carrot_compost_white.png',
      alt: 'Carrot Compost',
    },
  },
};

export default async function TournamentCard() {
  redirect('/'); // Actualmente no se usa, pero entra en conflicto con la info de torneos, así que hacemos redirect a la home
};
