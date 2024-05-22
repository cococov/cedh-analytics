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
import MetagameResumePage from '@/components/metagameResumePage';
import type { ResumeData } from '@/components/metagameResumePage/types';
/* Static */
import RESUME from '@/public/data/metagame/metagame_resume.json';
import UPDATE_DATES from '@/public/data/update_date.json';
import { server } from '@config';

type UpdateDates = { metagame: string; database: string; };

const fromTo = ((updateDates: UpdateDates) => {
  const to = updateDates.metagame;
  const from = [to.split(', ')[0], (parseInt(to.split(', ')[1]) - 1)].join(', ');
  return `from ${from} to ${to}`;
})(UPDATE_DATES);

export const metadata: Metadata = {
  title: 'cEDH Metagame',
  description: `Metagame ${fromTo}. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'cEDH Metagame | cEDH Analytics',
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
    title: `Metagame | ${twitterMetadata.title}`,
    description: `Metagame ${fromTo}. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search_og.jpg',
      alt: 'Frantic Search',
    },
  },
};

const fetchData = async () => {
  const resume = RESUME as ResumeData;
  const to = (UPDATE_DATES as UpdateDates).metagame;
  const from = [to.split(', ')[0], (parseInt(to.split(', ')[1]) - 1)].join(', ');

  return {
    resume,
    from,
    to,
  };
};

export default async function Metagame() {
  const { resume, from, to } = await fetchData();
  return (
    <MetagameResumePage
      resume={resume}
      commandersURL={`${server}/data/metagame/condensed_commanders_data.json`}
      lastSetTop10UrlBase="/metagame-cards"
      fromDate={from}
      toDate={to}
    />
  );
};
