import type { Metadata } from 'next';
import Link from 'next/link';
import Image from "next/image";
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../shared-metadata';
/* Static */
import styles from '../../styles/Tournaments.module.css';
import DATA from '../../public/data/tournaments/list.json';

type Tournament = {
  name: string;
  showName: boolean;
  id: string;
  bookmark: string;
  imageName?: string | null;
  serie: string;
  number: number;
  hidden: boolean;
};

export const metadata: Metadata = {
  title: 'Tournaments',
  description: `cEDH tournaments list. | ${descriptionMetadata}`,
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

export default async function Tournaments() {
  const tournaments: Tournament[] = DATA;
  return (
    <main className={styles.main}>
      <ul className={styles.list}>
        {
          tournaments?.map(tournament => (
            <Link key={`${tournament.id}-link`} href={`/tournaments/${tournament.id}`} className={styles.tournamentLink}>
              <li key={tournament.id} className={styles.listElement} >
                <span className={styles.listElementImageContainer}>
                  <Image
                    className={styles.listElementImage}
                    src={`/data/tournaments/${!!tournament.imageName ? `${tournament.id}/${tournament.imageName}` : 'default.jpg'}`}
                    alt={`${tournament.id} Image`}
                    height={1200}
                    width={760}
                    quality={100}
                    priority
                  />
                </span>
                {tournament.showName && <h2>{tournament.name}</h2>}
              </li>
            </Link>
          ))
        }
      </ul>
    </main>
  );
};
