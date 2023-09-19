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
  const resume = RESUME as ResumeData;
  return {
    resume,
  };
};

export default async function Metagame() {
  const { resume } = await fetchData();
  return (
    <main className={styles.main}>
      <section className={styles.topResumeContainer}>
        <span className={styles.topResume}>
          <span className={styles.topResumeContent}>
            <table>
              <tr><td><b>No. of Commanders:</b></td><td>{resume.cantCommanders}</td></tr>
              <tr><td><b>No. of Decks:</b></td><td>{resume.cantLists}</td></tr>
              <tr><td><b>No. of Tournaments:</b></td><td>{resume.cantTournaments}</td></tr>
              <tr><td><b>Decks with stickers:</b></td><td>{resume.percentageDecksWithStickers * 100}%</td></tr>
              <tr><td><b>Decks with companions:</b></td><td>{resume.percentageDecksWithCompanions * 100}%</td></tr>
            </table>
          </span>
        </span>
        <span className={styles.topResume}>
          <span className={styles.topResumeContent}>
            <table>
              <tr><td><b>Avg. cmc with lands:</b></td><td>{Math.round((resume.avgCmcWithLands + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. cmc without lands:</b></td><td>{Math.round((resume.avgCmcWithoutLands + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Min. avg. cmc with lands:</b></td><td>{Math.round((resume.minAvgCmcWithLands + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Min. avg. cmc without lands:</b></td><td>{Math.round((resume.minAvgCmcWithoutLands + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Max. avg. cmc without lands:</b></td><td>{Math.round((resume.maxAvgCmcWithoutLands + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Max. avg. cmc without lands:</b></td><td>{Math.round((resume.maxAvgCmcWithoutLands + Number.EPSILON) * 100) / 100}</td></tr>
              <p>COLOR GRAPH</p>
            </table>
          </span>
        </span>
        <span className={styles.topResume}>
          <span className={styles.topResumeContent}>
            <table>
              <tr><td><b>Avg. creatures:</b></td><td>{Math.round((resume.avgCantCreatures + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. artifacts:</b></td><td>{Math.round((resume.avgCantArtifacts + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. enchantments:</b></td><td>{Math.round((resume.avgCantEnchantments + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. instants:</b></td><td>{Math.round((resume.avgCantInstants + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. sorceries:</b></td><td>{Math.round((resume.avgCantSorceries + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. lands:</b></td><td>{Math.round((resume.avgCantLands + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. planeswalkers:</b></td><td>{Math.round((resume.avgCantPlaneswalkers + Number.EPSILON) * 100) / 100}</td></tr>
              <tr><td><b>Avg. battles:</b></td><td>{Math.round((resume.avgCantBattles + Number.EPSILON) * 100) / 100}</td></tr>
            </table>
          </span>
        </span>
        <span className={styles.topResume}>
          <span className={styles.topResumeContent}>
            <table>
              <p>PIE GRAPH</p>
            </table>
          </span>
        </span>
      </section>
    </main>
  );
};
