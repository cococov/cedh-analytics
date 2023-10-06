import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
/* Vendor */
import { replace, split, pipe, any, pluck, equals, flatten, reduce, max } from 'ramda';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../../shared-metadata';
import { RadarChart, BoxwhiskerChart, BarChart, PieChart } from '../../../components/charts';
import { HeadlessTable } from '../../../components/vendor/nextUi';
import { LastSetTop10, AsyncCardsTable, DecklistsTable, Loading } from '../../../components';
import fetchCards from '../../../utils/fetch/cardData';
/* Static */
import styles from '../../../styles/CommanderMetagame.module.css';
import STATS_BY_COMMANDER from '../../../public/data/metagame/stats_by_commander.json';
import { server } from '../../../config';

type UseOfCards = {
  minCantLands: number;
  q1CantLands: number;
  medianCantLands: number;
  q3CantLands: number;
  maxCantLands: number;
  minCantDraw: number;
  q1CantDraw: number;
  medianCantDraw: number;
  q3CantDraw: number;
  maxCantDraw: number;
  minCantTutor: number;
  q1CantTutor: number;
  medianCantTutor: number;
  q3CantTutor: number;
  maxCantTutor: number;
  minCantCounter: number;
  q1CantCounter: number;
  medianCantCounter: number;
  q3CantCounter: number;
  maxCantCounter: number;
  minCantRemoval: number;
  q1CantRemoval: number;
  medianCantRemoval: number;
  q3CantRemoval: number;
  maxCantRemoval: number;
  minCantManaRock: number;
  q1CantManaRock: number;
  medianCantManaRock: number;
  q3CantManaRock: number;
  maxCantManaRock: number;
  minCantManaDork: number;
  q1CantManaDork: number;
  medianCantManaDork: number;
  q3CantManaDork: number;
  maxCantManaDork: number;
  minCantStax: number;
  q1CantStax: number;
  medianCantStax: number;
  q3CantStax: number;
  maxCantStax: number;
};

type Decklist = {
  url: string;
  name: string;
  wins: number;
  winRate: number;
  standing: number;
  hasPartners: boolean;
  tournamentName: string;
  dateCreated: number;
  hasCompanion: boolean;
  companions: string[];
  hasStickers: boolean;
  stickers: string[];
  tokens: string[];
  colorPercentages: { [key: string]: number };
  colorIdentityPercentages: { [key: string]: number };
  cantBattles: number;
  cantPlaneswalkers: number;
  cantCreatures: number;
  cantSorceries: number;
  cantInstants: number;
  cantArtifacts: number;
  cantEnchantments: number;
  cantLands: number;
  avgCmcWithLands: number;
  avgCmcWithoutLands: number;
}

type StatsByCommander = {
  [key: string]: {
    appearances: number;
    colorID: string;
    wins: number;
    hasPartners: boolean;
    sortedUseOfLands: number[];
    avgWinRate: number;
    lastSet: string;
    lastSetTop10: { occurrences: number, cardName: string }[];
    bestStanding: number;
    worstStanding: number;
    processed_decklists: Decklist[];
    avgCantBattles: number;
    avgCantPlaneswalkers: number;
    avgCantCreatures: number;
    avgCantSorceries: number;
    avgCantInstants: number;
    avgCantArtifacts: number;
    avgCantEnchantments: number;
    avgCantLands: number;
    avgColorPercentages: { [key: string]: number };
    avgColorIdentityPercentages: { [key: string]: number };
    cantDecksWithStickers: number;
    cantDecksWithCompanions: number;
    percentageDecksWithStickers: number;
    percentageDecksWithCompanions: number;
    allTokens: string[];
    minCantLands: number;
    maxCantLands: number;
    avgCmcWithLands: number;
    avgCmcWithoutLands: number;
    minAvgCmcWithLands: number;
    minAvgCmcWithoutLands: number;
    maxAvgCmcWithLands: number;
    maxAvgCmcWithoutLands: number;
    useOfCards: UseOfCards;
    avgCant?: {
      creatures: number;
      artifacts: number;
      lands: number;
      enchantments: number;
      instants: number;
      sorceries: number;
      battles: number;
      planeswalkers: number;
    }
  };
};

type ErrorData = { notFound: boolean };

type PageData = {
  rawCommanderNames: string;
  commanderNumber: number;
  commanderNames: string[];
  commandersIdentity: string[];
  cardImages: string[];
  metagameData: StatsByCommander[string];
};

type ResponseData = PageData & ErrorData | ErrorData;
type Params = { commanderName: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Params,
}): Promise<Metadata> {
  const decodedCommanderName = pipe(
    replace(/%2C/g, ','),
    replace(/%2F/g, '/'),
  )(decodeURI(String(params.commanderName)));

  const commanders = split(' / ', decodedCommanderName);
    const commanderNumber = commanders.length;
    const commandersData = await Promise.all(commanders.map(commander => fetchCards(String(commander))));
    const capitalizedCommanderNames = commanders.map(c => c.split(' ').map((w, i) => {
      if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
      if (w === 'of' || w === 'the' || w === 'from') return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ')).join(' / ');
    const description = `Metagame data for ${capitalizedCommanderNames} commander${commanderNumber > 1 ? 's' : ''}. | ${descriptionMetadata}`;

  return {
    title: `${capitalizedCommanderNames}`,
    description: description,
    openGraph: {
      ...openGraphMetadata,
      title: `${capitalizedCommanderNames} | cEDH Analytics`,
      description: description,
      images: [
        {
          url: commandersData[0].error ? '/' : commandersData[0].cardImage,
          width: 788,
          height: 788,
          alt: `${capitalizedCommanderNames} Image`,
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title: `${capitalizedCommanderNames} | cEDH Analytics`,
      description: description,
      images: {
        url: commandersData[0].error ? '/' : commandersData[0].cardImage,
        alt: `${capitalizedCommanderNames} Image`,
      },
    },
  };
};

async function fetchData({ commanderName }: Params): Promise<ResponseData> {
  if (!commanderName) return { notFound: true };
  const decodedCommanderName = pipe(
    replace(/%2C/g, ','),
    replace(/%2F/g, '/'),
  )(String(commanderName));

  try {
    const commanders = split(' / ', decodedCommanderName);
    const commanderNumber = commanders.length;
    const commandersData = await Promise.all(commanders.map(commander => fetchCards(String(commander))));
    const capitalizedCommanderNames = commanders.map(c => c.split(' ').map((w, i) => {
      if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
      if (w === 'of' || w === 'the' || w === 'from') return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' '));

    if (any(x => x.error, commandersData)) throw new Error('Fetch Error');

    const commandersMetagameData = (STATS_BY_COMMANDER as StatsByCommander)[decodedCommanderName];

    return {
      commanderNumber,
      rawCommanderNames: decodedCommanderName,
      commandersIdentity: flatten(pluck('colorIdentity', commandersData)),
      commanderNames: capitalizedCommanderNames,
      cardImages: pluck('cardImage', commandersData),
      metagameData: {
        ...commandersMetagameData,
        avgCant: {
          creatures: commandersMetagameData.avgCantCreatures,
          artifacts: commandersMetagameData.avgCantArtifacts,
          lands: commandersMetagameData.avgCantLands,
          enchantments: commandersMetagameData.avgCantEnchantments,
          instants: commandersMetagameData.avgCantInstants,
          sorceries: commandersMetagameData.avgCantSorceries,
          battles: commandersMetagameData.avgCantBattles,
          planeswalkers: commandersMetagameData.avgCantPlaneswalkers,
        }
      },
      notFound: false,
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default async function MetagameCard({
  params
}: {
  params: { commanderName: string }
}) {
  const response = await fetchData({ commanderName: decodeURI(String(params.commanderName)) });

  if (response.notFound) notFound();

  const data = response as PageData;

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
                'Best Standing': data.metagameData.bestStanding,
              }} />
            </span>
          </span>
          <span className={styles.topResume}>
            <h3 className={styles.topResumeTitle}>Top 10 Cards</h3>
            <b>{data.metagameData.lastSet}</b>
            <span className={[styles.topResumeContent, styles.topResumeContentWithSpace].join(' ')}>
              <LastSetTop10 last_set_top_10={data.metagameData.lastSetTop10} urlBase='/metagame-cards' />
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
          <Suspense fallback={<Loading />}>
            <AsyncCardsTable
              title="Cards"
              cardsURL={`${server}/data/metagame/metagame_cards_by_commander.json`}
              tagsByCardURL={`${server}/data/cards/tags.json`}
              commander={data.rawCommanderNames}
              fromMetagame
              noInfo
            />
          </Suspense>
        </section>
      </span>
    </main>
  );
};
