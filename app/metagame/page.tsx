import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import MetagameResumePage from '@components/metagameResumePage';
import type { ResumeData } from '@components/metagameResumePage/types';
/* Static */
import RESUME from '@public/data/metagame/metagame_resume.json';
import { server } from '@config';

export const metadata: Metadata = {
  title: 'cEDH Metagame',
  description: `Metagame. | ${descriptionMetadata}`,
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
    description: `Metagame. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search_og.jpg',
      alt: 'Frantic Search',
    },
  },
};

const fetchData = async () => {
  const resume = RESUME as ResumeData;
  return {
    resume,
  };
};

export default async function Metagame() {
  const { resume } = await fetchData();
  return (
    <MetagameResumePage
      resume={resume}
      commandersURL={`${server}/data/metagame/condensed_commanders_data.json`}
      lastSetTop10UrlBase="/metagame-cards"
    />
  );
};
