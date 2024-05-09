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
