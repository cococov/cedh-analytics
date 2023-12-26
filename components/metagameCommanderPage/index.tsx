import { Suspense } from 'react';
import Image from 'next/image';
/* Vendor */
import { any, equals, reduce, max } from 'ramda';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import { RadarChart, BoxwhiskerChart, BarChart, PieChart } from '../../components/charts';
import { HeadlessTable } from '../vendor/nextUi';
import { LastSetTop10, AsyncCardsTable, DecklistsTable } from '../../components';
import ErrorBoundary from '../errorBoundary';
import ErrorButton from './errorButton';
import type { PageData } from './types';
/* Static */
import styles from '../../styles/CommanderMetagame.module.css';

export default async function MetagameCommanderPage({
  data,
  LastSetTop10UrlBase,
  cardsURL,
  tagsByCardURL,
}: {
  data: PageData;
  LastSetTop10UrlBase: string;
  cardsURL: string;
  tagsByCardURL: string;
}) {
  return (
    <main className={styles.main}>
      <span className={styles.container}>
        <section className={styles.title}>
          <h1>{data.commanderNames[0]}</h1>
          {
            data.commanderNumber === 2 &&
            <>
              <h1 className={styles.titleSeparator}>{'//'}</h1>
              <h1>{data.commanderNames[1]}</h1>
            </>
          }
        </section>
        <section className={styles.images}>
          <Image
            src={data.cardImages[0]}
            alt={`${data.cardImages[0]} image`}
            placeholder="blur"
            blurDataURL="/images/mtg-back.jpg"
            width={256}
            height={366}
            priority
          />
          {
            data.commanderNumber === 2 &&
            <Image
              src={data.cardImages[1]}
              alt={`${data.cardImages[1]} image`}
              placeholder="blur"
              blurDataURL="/images/mtg-back.jpg"
              width={256}
              height={366}
              priority
            />
          }
        </section>
        <section className={styles.topResumeContainer}>
          <span className={styles.topResume}>
            <h3 className={styles.topResumeTitle}>Stats</h3>
            <span className={[styles.topResumeContent, styles.topResumeContentWithSpace].join(' ')}>
              <HeadlessTable data={{
                'No. of Decks': data.metagameData.appearances,
                'Decks with stickers': `${Math.round(data.metagameData.percentageDecksWithStickers * 10000) / 100}%`,
                'Decks with companions': `${Math.round(data.metagameData.percentageDecksWithCompanions * 10000) / 100}%`,
                'Min no. of lands': Math.round(data.metagameData.minCantLands),
                'Avg no. of lands': Math.round(data.metagameData.avgCantLands),
                'Max no. of lands': Math.round(data.metagameData.maxCantLands),
                'Avg. Win Rate': `${Math.round((data.metagameData.avgWinRate + Number.EPSILON) * 10000) / 100}%`,
                'Avg. Draw Rate': `${Math.round((data.metagameData.avgDrawRate + Number.EPSILON) * 10000) / 100}%`,
                'Best Standing': data.metagameData.bestStanding,
                'Worst Standing': data.metagameData.worstStanding,
                'Wins': data.metagameData.wins,
              }} />
            </span>
          </span>
          <span className={styles.topResume}>
            <h3 className={styles.topResumeTitle}>Top 10 Cards</h3>
            <b>{data.metagameData.lastSet}</b>
            <span className={[styles.topResumeContent, styles.topResumeContentWithSpace].join(' ')}>
              <LastSetTop10 last_set_top_10={data.metagameData.lastSetTop10} urlBase={LastSetTop10UrlBase} />
            </span>
          </span>
          <span className={[styles.topResume, styles.topResumeChart].join(' ')}>
            <h3 className={styles.topResumeTitle}>Avg uses of card types</h3>
            <span className={styles.topResumeContent}>
              <RadarChart options={{
                title: 'Avg uses of card types',
                indicators: [
                  { name: 'creatures', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                  { name: 'artifacts', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                  { name: 'lands', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                  { name: 'enchantments', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                  { name: 'instants', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                  { name: 'sorceries', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                  { name: 'battles', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                  { name: 'planeswalkers', max: reduce(max, 0, Object.values(data.metagameData.avgCant || {})) as number },
                ],
                values: [
                  Math.round((data.metagameData.avgCantCreatures + Number.EPSILON) * 100) / 100,
                  Math.round((data.metagameData.avgCantArtifacts + Number.EPSILON) * 100) / 100,
                  Math.round((data.metagameData.avgCantLands + Number.EPSILON) * 100) / 100,
                  Math.round((data.metagameData.avgCantEnchantments + Number.EPSILON) * 100) / 100,
                  Math.round((data.metagameData.avgCantInstants + Number.EPSILON) * 100) / 100,
                  Math.round((data.metagameData.avgCantSorceries + Number.EPSILON) * 100) / 100,
                  Math.round((data.metagameData.avgCantBattles + Number.EPSILON) * 100) / 100,
                  Math.round((data.metagameData.avgCantPlaneswalkers + Number.EPSILON) * 100) / 100,
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
                  { "With lands": data.metagameData.minAvgCmcWithLands, "Without lands": data.metagameData.minAvgCmcWithoutLands },
                  { "With lands": data.metagameData.avgCmcWithLands, "Without lands": data.metagameData.avgCmcWithoutLands },
                  { "With lands": data.metagameData.maxAvgCmcWithLands, "Without lands": data.metagameData.maxAvgCmcWithoutLands },
                ],
              }} />
            </span>
          </span>
          <span className={[styles.topResume, styles.topResumeChart].join(' ')}>
            <h3 className={styles.topResumeTitle}>Colors</h3>
            <span className={styles.topResumeContent}>
              <PieChart options={{
                title: 'Colors',
                colors: [
                  ...(any(equals('W'), data.commandersIdentity) ? ['#fbd969'] : []),
                  ...(any(equals('U'), data.commandersIdentity) ? ['#5470c6'] : []),
                  ...(any(equals('B'), data.commandersIdentity) ? ['#333333'] : []),
                  ...(any(equals('R'), data.commandersIdentity) ? ['#ee6666'] : []),
                  ...(any(equals('G'), data.commandersIdentity) ? ['#91cc75'] : []),
                ],
                data: [
                  ...(any(equals('W'), data.commandersIdentity) ? [{ value: data.metagameData.avgColorPercentages.white, name: 'White' }] : []),
                  ...(any(equals('U'), data.commandersIdentity) ? [{ value: data.metagameData.avgColorPercentages.blue, name: 'Blue' }] : []),
                  ...(any(equals('B'), data.commandersIdentity) ? [{ value: data.metagameData.avgColorPercentages.black, name: 'Black' }] : []),
                  ...(any(equals('R'), data.commandersIdentity) ? [{ value: data.metagameData.avgColorPercentages.red, name: 'Red' }] : []),
                  ...(any(equals('G'), data.commandersIdentity) ? [{ value: data.metagameData.avgColorPercentages.green, name: 'Green' }] : []),
                ],
              }} />
            </span>
          </span>
        </section>
        <span className={styles.boxwhiskerChart}>
          <h3 className={styles.topResumeTitle}>Use of Cards</h3>
          <BoxwhiskerChart options={{
            title: 'Use of Cards',
            data: [
              [
                'Lands',
                data.metagameData.useOfCards.minCantLands,
                data.metagameData.useOfCards.q1CantLands,
                data.metagameData.useOfCards.medianCantLands,
                data.metagameData.useOfCards.q3CantLands,
                data.metagameData.useOfCards.maxCantLands,
              ],
              [
                'Draw Engines',
                data.metagameData.useOfCards.minCantDraw,
                data.metagameData.useOfCards.q1CantDraw,
                data.metagameData.useOfCards.medianCantDraw,
                data.metagameData.useOfCards.q3CantDraw,
                data.metagameData.useOfCards.maxCantDraw,
              ],
              [
                'Tutors',
                data.metagameData.useOfCards.minCantTutor,
                data.metagameData.useOfCards.q1CantTutor,
                data.metagameData.useOfCards.medianCantTutor,
                data.metagameData.useOfCards.q3CantTutor,
                data.metagameData.useOfCards.maxCantTutor,
              ],
              [
                'Counters',
                data.metagameData.useOfCards.minCantCounter,
                data.metagameData.useOfCards.q1CantCounter,
                data.metagameData.useOfCards.medianCantCounter,
                data.metagameData.useOfCards.q3CantCounter,
                data.metagameData.useOfCards.maxCantCounter,
              ],
              [
                'Removal',
                data.metagameData.useOfCards.minCantRemoval,
                data.metagameData.useOfCards.q1CantRemoval,
                data.metagameData.useOfCards.medianCantRemoval,
                data.metagameData.useOfCards.q3CantRemoval,
                data.metagameData.useOfCards.maxCantRemoval,
              ],
              [
                'Mana Rocks',
                data.metagameData.useOfCards.minCantManaRock,
                data.metagameData.useOfCards.q1CantManaRock,
                data.metagameData.useOfCards.medianCantManaRock,
                data.metagameData.useOfCards.q3CantManaRock,
                data.metagameData.useOfCards.maxCantManaRock,
              ],
              [
                'Mana Dorks',
                data.metagameData.useOfCards.minCantManaDork,
                data.metagameData.useOfCards.q1CantManaDork,
                data.metagameData.useOfCards.medianCantManaDork,
                data.metagameData.useOfCards.q3CantManaDork,
                data.metagameData.useOfCards.maxCantManaDork,
              ],
              [
                'Stax',
                data.metagameData.useOfCards.minCantStax,
                data.metagameData.useOfCards.q1CantStax,
                data.metagameData.useOfCards.medianCantStax,
                data.metagameData.useOfCards.q3CantStax,
                data.metagameData.useOfCards.maxCantStax,
              ],
            ]
          }} />
        </span>
        <section className={styles.decklistsContainer}>
          <DecklistsTable
            title='Decklists'
            decklists={data.metagameData.processed_decklists}
          />
        </section>
        <section className={styles.cardsContainer}>
          <ErrorBoundary
            fallback={
              <span className={styles.errorContainer}>
                <p>Error loading {data.commanderNames[0]} cards table.</p>
                <ErrorButton className={styles.errorButton} />
                <a href="mailto:report@cedh-analytics.com" className={styles.reportMail}>
                  report@cedh-analytics.com
                </a>
              </span>
            }
          >
            <Suspense fallback={<CircularProgress size="lg" color="secondary" aria-label="Loading..." />}>
              <AsyncCardsTable
                title="Cards"
                cardsURL={cardsURL}
                tagsByCardURL={tagsByCardURL}
                commander={data.rawCommanderNames}
                fromMetagame
                noInfo
              />
            </Suspense>
          </ErrorBoundary>
        </section>
      </span>
    </main>
  );
};
