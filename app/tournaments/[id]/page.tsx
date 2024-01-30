import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
/* Vendor */
import { replace } from 'ramda';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import MetagameResumePage from '@/components/metagameResumePage';
import type { ResumeData } from '@/components/metagameResumePage/types';
import AsyncCardsTable from '@/components/cardsTable/async';
/* Static */
import UPDATE_DATES from '@/public/data/update_date.json';
import { server } from '@config';

type ErrorData = { notFound: boolean };
type UpdateDates = { metagame: string; database: string; };
type ResponseData = { resume: ResumeData; from: string; to: string; };
type ResponseDataWithError = ResponseData & ErrorData | ErrorData;
type Params = { id: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Params,
}): Promise<Metadata> {
  const tournamentName = decodeURI(String(params.id));

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
    const rawData = await fetch(`${server}/data/metagame/tournaments/${id}/metagame_resume.json`);
    const resume: ResumeData = await rawData.json();
    const to = (UPDATE_DATES as UpdateDates).metagame;
    const from = [to.split(', ')[0], (parseInt(to.split(', ')[1]) - 1)].join(', ');

    return {
      resume,
      from,
      to,
      notFound: false,
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default async function Metagame({
  params,
}: {
  params: Params,
}) {
  const tournamentName = replace('%40', '@', decodeURI(String(params.id)));
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
        fromDate={data.from}
        toDate={data.to}
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
