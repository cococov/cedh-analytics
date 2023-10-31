import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../../shared-metadata';
import MetagameResumePage from '../../../components/metagameResumePage';
import type { ResumeData } from '../../../components/metagameResumePage/types';
/* Static */
import { server } from '../../../config';

type ErrorData = { notFound: boolean };
type ResponseData = ResumeData & ErrorData | ErrorData;
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
      title: '${tournamentName}  | cEDH Analytics',
      images: [
        {
          url: '/images/spike.jpg',
          width: 626,
          height: 457,
          alt: 'Frantic Search',
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title: `${tournamentName}  | ${twitterMetadata.title}`,
      description: `${tournamentName} | ${twitterMetadata.description}`,
      images: {
        url: '/images/spike.jpg',
        alt: 'Frantic Search',
      },
    },
  }
};

async function fetchData({ id }: Params): Promise<ResponseData> {
  if (!id) return { notFound: true };

  try {
    const rawData = await fetch(`${server}/data/metagame/tournaments/${id}/metagame_resume.json`);
    const resume: ResumeData = await rawData.json();

    return {
      ...resume,
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
  const response = await fetchData({ id: decodeURI(String(params.id)) });

  if (response.notFound) notFound();

  return (
    <MetagameResumePage
      resume={response as ResumeData}
      commandersURL={`${server}/data/metagame/tournaments/${decodeURI(String(params.id))}/condensed_commanders_data.json`}
      lastSetTop10UrlBase="/metagame-cards"
      noCommanderPage
      fromTournament
    />
  );
};
