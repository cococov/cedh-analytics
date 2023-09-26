import { Suspense } from 'react';
import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../shared-metadata';
import { RadarChart, PieChart, BarChart } from '../../components/charts';
import { HeadlessTable } from '../../components/vendor/nextUi';
import { LastSetTop10, AsyncCommandersTable, Loading } from '../../components';
/* Static */
import styles from '../../styles/Metagame.module.css';
import RESUME from '../../public/data/metagame/metagame_resume.json';
import { server } from '../../config';

type ResumeData = {
  cantCommanders: number;
  cantLists: number;
  cantTournaments: number;
  avgColorPercentages: { white: number; blue: number; black: number; red: number; green: number; };
  avgColorIdentityPercentages: { white: number; blue: number; black: number; red: number; green: number; };
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
  lastSetTop10: { occurrences: number; cardName: string; }[];
  avgCmcWithLands: number;
  avgCmcWithoutLands: number;
  minAvgCmcWithLands: number;
  minAvgCmcWithoutLands: number;
  maxAvgCmcWithLands: number;
  maxAvgCmcWithoutLands: number;
};

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
            <h3 className={styles.topResumeTitle}>Stats</h3>
            <HeadlessTable data={{
              'No. of Commanders': resume.cantCommanders,
              'No. of Decks': resume.cantLists,
              'No. of Tournaments': resume.cantTournaments,
              'Decks with partners': 0,
              'Decks with stickers': `${resume.percentageDecksWithStickers * 100}%`,
              'Decks with companions': `${resume.percentageDecksWithCompanions * 100}%`,
              'Min no. of lands': Math.round((0)),
              'Avg no. of lands': Math.round((resume.avgCantLands)),
              'Max no. of lands': Math.round((0)),
            }} />
          </span>
        </span>
        <span className={styles.topResume}>
          <h3 className={styles.topResumeTitle}>Top 10 cards</h3>
          <b>{resume.lastSet}</b>
          <span className={styles.topResumeContent}>
            <LastSetTop10 last_set_top_10={resume.lastSetTop10} urlBase='/metagame-cards' />
          </span>
        </span>
        <span className={[styles.topResume, styles.topResumeChart].join(' ')}>
          <h3 className={styles.topResumeTitle}>Avg uses of card types</h3>
          <span className={styles.topResumeContent}>
            <RadarChart options={{
              title: 'Avg uses of card types',
              indicators: [
                { name: 'creatures', max: 30 },
                { name: 'artifacts', max: 30 },
                { name: 'enchantments', max: 30 },
                { name: 'instants', max: 30 },
                { name: 'sorceries', max: 30 },
                { name: 'lands', max: 30 },
                { name: 'planeswalkers', max: 30 },
                { name: 'battles', max: 30 },
              ],
              values: [
                Math.round((resume.avgCantCreatures + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantArtifacts + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantEnchantments + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantInstants + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantSorceries + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantLands + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantPlaneswalkers + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantBattles + Number.EPSILON) * 100) / 100,
              ],
            }} />
          </span>
        </span>
        <span className={[styles.topResume, styles.topResumeChart].join(' ')}>
          <h3 className={styles.topResumeTitle}>Avg deck&apos;s CMC</h3>
          <span className={styles.topResumeContent}>
            <BarChart options={{
              categories: ['Min', 'Avg', 'Max'],
              subCategories: ['With lands', 'Without lands'],
              colors: ['#029e5b', '#422273'],
              data: [
                { "With lands": resume.minAvgCmcWithLands, "Without lands": resume.minAvgCmcWithoutLands },
                { "With lands": resume.avgCmcWithLands, "Without lands": resume.avgCmcWithoutLands },
                { "With lands": resume.maxAvgCmcWithLands, "Without lands": resume.maxAvgCmcWithoutLands },
              ],
            }} />
          </span>
        </span>
        <span className={[styles.topResume, styles.topResumeChart].join(' ')}>
          <h3 className={styles.topResumeTitle}>Avg. use of colors</h3>
          <span className={styles.topResumeContent}>
            <BarChart options={{
              categories: ['White', 'Blue', 'Black', 'Red', 'Green'],
              yAxisLabelFormat: '{value}%',
              data: [
                { value: Math.round((resume.avgColorPercentages['white'] + Number.EPSILON) * 10000) / 100, itemStyle: { color: '#fbd969' } },
                { value: Math.round((resume.avgColorPercentages['blue'] + Number.EPSILON) * 10000) / 100, itemStyle: { color: '#5470c6' } },
                { value: Math.round((resume.avgColorPercentages['black'] + Number.EPSILON) * 10000) / 100, itemStyle: { color: '#333333' } },
                { value: Math.round((resume.avgColorPercentages['red'] + Number.EPSILON) * 10000) / 100, itemStyle: { color: '#ee6666' } },
                { value: Math.round((resume.avgColorPercentages['green'] + Number.EPSILON) * 10000) / 100, itemStyle: { color: '#91cc75' } },
              ],
            }} />
          </span>
        </span>
      </section>
      <section className={styles.commandersContainer}>
        <Suspense fallback={<Loading />}>
          <AsyncCommandersTable
            title="Metagame Commanders"
            commandersURL={`${server}/data/metagame/condensed_commanders_data.json`}
          />
        </Suspense>
      </section>
    </main>
  );
};
