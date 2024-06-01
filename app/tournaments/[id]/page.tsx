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
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
/* Vendor */
import { replace, pipe } from 'ramda';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import MetagameResumePage from '@/components/metagameResumePage';
import type { ResumeData } from '@/components/metagameResumePage/types';
import AsyncCardsTable from '@/components/cardsTable/async';
/* Static */
import { server } from '@config';

type ErrorData = { notFound: boolean };
type ResponseData = { resume: ResumeData };
type ResponseDataWithError = ResponseData & ErrorData | ErrorData;
type Params = { id: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Params,
}): Promise<Metadata> {
  const tournamentName = pipe(
    String,
    decodeURI,
    replace(/%40/g, '@'),
    replace(/%2B/g, '+'),
    replace(/%2F/g, '/'),
    replace(/%3A/g, ':'),
    replace(/%23/g, '#'),
    replace(/%3F/g, '?'),
    replace(/%3D/g, '='),
    replace(/%24/g, '$'),
    replace(/%21/g, '!'),
    replace(/%2C/g, ','),
    replace(/%28/g, '('),
    replace(/%29/g, ')'),
    replace(/%26/g, '&'),
  )(params.id);

  return {
    title: tournamentName,
    description: `${tournamentName} | ${descriptionMetadata}`,
    openGraph: {
      ...openGraphMetadata,
      title: `${tournamentName}  | cEDH Analytics`,
      images: [
        {
          url: '/images/spike.jpg',
          width: 626,
          height: 457,
          alt: 'Spike, Tournament Grinder',
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title: `${tournamentName}  | ${twitterMetadata.title}`,
      description: `${tournamentName} | ${twitterMetadata.description}`,
      images: {
        url: '/images/spike.jpg',
        alt: 'Spike, Tournament Grinder',
      },
    },
  }
};

async function fetchData({ id }: Params): Promise<ResponseDataWithError> {
  if (!id) return { notFound: true };

  try {
    const path = `${process.cwd()}/public/data/metagame/tournaments/${id}/metagame_resume.json`;
    const file = await fs.readFile(path, 'utf8');
    const resume: ResumeData = JSON.parse(file);

    return {
      resume,
      notFound: false,
    };
  } catch (err) {
    console.warn(err);
    return { notFound: true };
  }
};

export default async function Metagame({
  params,
}: {
  params: Params,
}) {
  const tournamentName = pipe(
    String,
    decodeURI,
    replace(/%40/g, '@'),
    replace(/%2B/g, '+'),
    replace(/%2F/g, '/'),
    replace(/%3A/g, ':'),
    replace(/%23/g, '#'),
    replace(/%3F/g, '?'),
    replace(/%3D/g, '='),
    replace(/%24/g, '$'),
    replace(/%21/g, '!'),
    replace(/%2C/g, ','),
    replace(/%28/g, '('),
    replace(/%29/g, ')'),
    replace(/%26/g, '&'),
  )(params.id);
  const response = await fetchData({ id: tournamentName });

  if (response.notFound) notFound();

  const data = response as ResponseData;

  return (
    <>
      <MetagameResumePage
        title={tournamentName}
        resume={data.resume}
        commandersURL={`${server}/data/metagame/tournaments/${decodeURI(String(params.id))}/condensed_commanders_data.json`}
        lastSetTop10UrlBase="/metagame-cards"
        noCommanderPage
        fromTournament
      />
      <span className="mb-3">
        <Suspense fallback={<CircularProgress size="lg" color="secondary" aria-label="Loading..." />}>
          <AsyncCardsTable
            title="Cards"
            cardsURL={`${server}/data/metagame/tournaments/${params.id}/competitiveCards.json`}
            tagsByCardURL={`${server}/data/cards/tags.json`}
            fromMetagame
          />
        </Suspense>
      </span>
    </>
  );
};
