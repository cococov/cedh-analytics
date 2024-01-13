import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import TournamentsTable from '@/components/tournamentsTable';
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
      <TournamentsTable tournaments={tournaments} />
    </main>
  );
};
