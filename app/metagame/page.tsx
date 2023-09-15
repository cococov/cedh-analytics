import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../shared-metadata';
/* Static */
import styles from '../../styles/Metagame.module.css';
import RESUME from '../../public/data/metagame/metagame_resume.json';
import COMMANDERS from '../../public/data/metagame/condensed_commanders_data.json';
import CARDS from '../../public/data/metagame/metagame_cards.json';

type ResumeData = {
  cantCommanders: number;
  cantLists: number;
  cantTournaments: number;
  avgColorPercentages: { [key: string]: number };
  avgColorIdentityPercentages: { [key: string]: number };
  avgCantBattles: number;
  avgCantPlaneswalkers: number;
  avgCantCreatures: number;
  avgCantSorceries: number;
  avgCantInstants: number;
  avgCantArtifacts: number;
  avgCantEnchantments: number;
  avgCantLands: number;
  cantDecksWithStickers: number;
  cantDecksWithCompanions: number;
  percentageDecksWithStickers: number;
  percentageDecksWithCompanions: number;
  allTokens: string[];
  lastSet: string;
  lastSetTop10: { [key: string]: number | string }[];
  avgCmcWithLands: number;
  avgCmcWithoutLands: number;
  minAvgCmcWithLands: number;
  minAvgCmcWithoutLands: number;
  maxAvgCmcWithLands: number;
  maxAvgCmcWithoutLands: number;
};

type CommandersData = {
  identity: string;
  commander: string;
  appearances: number;
  wins: number;
  avgWinRate: number;
  bestStanding: number;
  worstStanding: number;
};

type CardsData = any;

type MetagameProps = {
  resume_data: ResumeData,
  commanders_data: CommandersData,
  cards_data: CardsData,
}

export const metadata: Metadata = {
  title: 'cEDH Metagame',
  description: `Metagame. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'cEDH Metagame | cEDH Analytics',
    images: [
      {
        url: '/images/frantic_search.jpg',
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
      url: '/images/frantic_search.jpg',
      alt: 'Frantic Search',
    },
  },
};

const fetchData = async () => {
  return {

  };
};

export default async function Cards() {
  const {  } = await fetchData();
  return (
    <main className={styles.main}>
      <h1>WIP</h1>
    </main>
  );
};
