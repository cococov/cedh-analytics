/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

import { Suspense } from 'react';
/* Vendor */
import { CircularProgress } from '@heroui/react';
/* Own */
import { RadarChart, BoxwhiskerChart, BarChart } from '@/components/charts';
import { HeadlessTable } from '@/components/vendor/nextUi';
import LastSetTop10 from '@/components/lastSetTop10';
import AsyncCommandersTable from '@/components/commandersTable/async';
import type { ResumeData } from './types';
import ResponsiveHorizontalAdUnit from '@/components/googleAds/responsiveHorizontalAdUnit';
/* Static */
import styles from '@/styles/Metagame.module.css';

export default async function MetagameResumePage({
  title,
  resume,
  commandersURL,
  lastSetTop10UrlBase,
  noCommanderPage,
  fromTournament,
  fromDate,
  toDate,
}: {
  title?: string;
  resume: ResumeData;
  commandersURL: string;
  lastSetTop10UrlBase: string;
  noCommanderPage?: boolean;
  fromTournament?: boolean;
  fromDate?: string;
  toDate?: string;
}) {
  return (
    <main className={styles.main}>
      {fromTournament && (
        <span className={styles.Title}>
          <h1>{title}</h1>
        </span>
      )}
      <section className={styles.topResumeContainer}>
        <span className={styles.topResume}>
          <h3 className={styles.topResumeTitle}>Stats</h3>
          <span className={[styles.topResumeContent, styles.topResumeContentWithSpace].join(' ')}>
            <HeadlessTable data={{
              ...{
                'No. of Commanders': resume.cantCommanders,
              },
              ...(fromTournament ? {
                'No. of Players': resume.size,
                'No. of Valid Decks': resume.cantLists,
              } : {}),
              ...(!fromTournament ? {
                'No. of Decklists': resume.cantLists,
                'No. of Tournaments': resume.cantTournaments,
              } : {}),
              ...{
                'Decks with partners': `${Math.round((resume.percentageDecksWithPartners + Number.EPSILON) * 10000) / 100}%`,
                'Decks with stickers': `${Math.round((resume.percentageDecksWithStickers + Number.EPSILON) * 10000) / 100}%`,
                'Decks with companions': `${Math.round((resume.percentageDecksWithCompanions + Number.EPSILON) * 10000) / 100}%`,
                'Min no. of lands': Math.round(resume.useOfCards.minCantLands),
                'Avg no. of lands': Math.round(resume.avgCantLands),
                'Max no. of lands': Math.round(resume.useOfCards.maxCantLands),
              }
            }} />
            {(!!fromDate && !!toDate) ? <p className="text-center text-xs">From {fromDate} to {toDate}</p> : null}
          </span>
        </span>
        <span className={styles.topResume}>
          <h3 className={styles.topResumeTitle}>Top 10 cards</h3>
          <b>{resume.lastSet}</b>
          <span className={[styles.topResumeContent, styles.topResumeContentWithSpace].join(' ')}>
            <LastSetTop10 last_set_top_10={resume.lastSetTop10} urlBase={lastSetTop10UrlBase} />
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
                { name: 'lands', max: 30 },
                { name: 'enchantments', max: 30 },
                { name: 'instants', max: 30 },
                { name: 'sorceries', max: 30 },
                { name: 'battles', max: 30 },
                { name: 'planeswalkers', max: 30 },
              ],
              values: [
                Math.round((resume.avgCantCreatures + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantArtifacts + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantLands + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantEnchantments + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantInstants + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantSorceries + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantBattles + Number.EPSILON) * 100) / 100,
                Math.round((resume.avgCantPlaneswalkers + Number.EPSILON) * 100) / 100,
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
      <span className="flex items-center justify-center w-full mt-2 ml-0 md:ml-4 md:mt-0">
        <ResponsiveHorizontalAdUnit slot={9992533643} />
      </span>
      <span className={styles.boxwhiskerChart}>
        <h3 className={styles.topResumeTitle}>Use of Cards</h3>
        <BoxwhiskerChart options={{
          title: 'Use of Cards',
          data: [
            [
              'Lands',
              resume.useOfCards.minCantLands,
              resume.useOfCards.q1CantLands,
              resume.useOfCards.medianCantLands,
              resume.useOfCards.q3CantLands,
              resume.useOfCards.maxCantLands,
            ],
            [
              'Draw Engines',
              resume.useOfCards.minCantDraw,
              resume.useOfCards.q1CantDraw,
              resume.useOfCards.medianCantDraw,
              resume.useOfCards.q3CantDraw,
              resume.useOfCards.maxCantDraw,
            ],
            [
              'Tutors',
              resume.useOfCards.minCantTutor,
              resume.useOfCards.q1CantTutor,
              resume.useOfCards.medianCantTutor,
              resume.useOfCards.q3CantTutor,
              resume.useOfCards.maxCantTutor,
            ],
            [
              'Counterspell',
              resume.useOfCards.minCantCounter,
              resume.useOfCards.q1CantCounter,
              resume.useOfCards.medianCantCounter,
              resume.useOfCards.q3CantCounter,
              resume.useOfCards.maxCantCounter,
            ],
            [
              'Removal',
              resume.useOfCards.minCantRemoval,
              resume.useOfCards.q1CantRemoval,
              resume.useOfCards.medianCantRemoval,
              resume.useOfCards.q3CantRemoval,
              resume.useOfCards.maxCantRemoval,
            ],
            [
              'Mana Rocks',
              resume.useOfCards.minCantManaRock,
              resume.useOfCards.q1CantManaRock,
              resume.useOfCards.medianCantManaRock,
              resume.useOfCards.q3CantManaRock,
              resume.useOfCards.maxCantManaRock,
            ],
            [
              'Mana Dorks',
              resume.useOfCards.minCantManaDork,
              resume.useOfCards.q1CantManaDork,
              resume.useOfCards.medianCantManaDork,
              resume.useOfCards.q3CantManaDork,
              resume.useOfCards.maxCantManaDork,
            ],
            [
              'Stax',
              resume.useOfCards.minCantStax,
              resume.useOfCards.q1CantStax,
              resume.useOfCards.medianCantStax,
              resume.useOfCards.q3CantStax,
              resume.useOfCards.maxCantStax,
            ],
          ]
        }} />
      </span>
      <span>
        <section className={styles.commandersContainer}>
          <Suspense fallback={<CircularProgress size="lg" color="secondary" aria-label="Loading..." />}>
            <AsyncCommandersTable
              title="Metagame Commanders"
              commandersURL={commandersURL}
              noCommanderPage={noCommanderPage}
            />
          </Suspense>
        </section>
      </span>
    </main>
  );
};
