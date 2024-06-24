/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov-Aufban
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

import type { Metadata } from 'next';
import Image from "next/image";
import Link from 'next/link';
/* Vendor */
import { ArrowRightIcon } from '@/components/vendor/materialIcon';
/* Own */
import LastSetTop10 from '@/components/lastSetTop10';
/* Static */
import styles from '@/styles/Home.module.css';
import SylvanLibrary from '@/public/images/sylvan_library.jpg';
import DATA from '@/public/data/home_overview.json';
import METAGAME_DATA from '@/public/data/metagame/metagame_resume.json';
import UPDATE_DATE from '@/public/data/update_date.json';

export const metadata: Metadata = { title: 'cEDH Analytics' };

export default async function Home() {
  const data = DATA;

  return (
    <main className={styles.homeMain} >
      <span className={styles.homeImageHiddenContainer}>
        <Image
          src={SylvanLibrary}
          alt="SylvanLibrary"
          className={styles.homeImageHidden}
          placeholder="blur"
          width={600}
          height={447}
          priority
        />
      </span>
      <section className={styles.homeStatsHiddenSection}>
        <span className={styles.homeStatsHiddenSectionTop}>
          <span className={styles.homeStatHidden}>
            <h4>Commanders</h4>
            <p>{METAGAME_DATA.cantCommanders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          </span>
          <span className={styles.homeStatHidden}>
            <h4>Decklists</h4>
            <p>{METAGAME_DATA.cantLists.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          </span>
          <span className={styles.homeStatHidden}>
            <h4>Tournaments</h4>
            <p>{METAGAME_DATA.cantTournaments.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          </span>
          <Link href="/top-10-last-set">
            <span className={styles.hiddenButtonTop10Tablet}>
              <span className={styles.hiddenButtonTop10TabletLeft}>
                <h3>Top 10 cards (DB)</h3>
                <span>{data.last_set}</span>
              </span>
              <span className={styles.hiddenButtonTop10TabletRight}>
                <ArrowRightIcon fontSize="large" />
              </span>
            </span>
          </Link>
        </span>
        <Link href="/top-10-last-set" className={styles.hiddenButtonTop10}>
          <>
            <span>Top 10 cards of the last set (DB)</span>
            <ArrowRightIcon fontSize="medium" />
          </>
        </Link>
      </section>
      <section className={styles.homeTextSection}>
        <span className={styles.homeImageContainer}>
          <Image
            src={SylvanLibrary}
            className={styles.homeImage}
            alt="SylvanLibrary"
            placeholder="blur"
            priority
          />
        </span>
        <h1>cEDH Analytics</h1>
        <p className={styles.homeResume}>
          cEDH Analytics is a website that analyzes and cross-references several EDH community&apos;s resources to give insights on the competitive metagame.
        </p>
        <article className={styles.homeArticle}>
          <h2>Credits</h2>
          <p>
            This website was created thanks to the
            {' '}
            <a
              href="https://cedh-decklist-database.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              The cEDH Database
            </a>
            {', '}
            <a
              href="https://www.moxfield.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              Moxfield
            </a>
            {', '}
            <a
              href="https://scryfall.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              Scryfall
            </a>
            {', '}
            <a
              href="https://mtgjson.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              MTGJSON
            </a>
            {' and '}
            <a
              href="https://edhtop16.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              EDH Top 16
            </a>
            {' data.'}
          </p>
        </article>

        <article className={styles.homeArticle}>
          <h2>What is cEDH?</h2>
          <p>
            cEDH is a subcategory of EDH, defined by a single phrase, &quot;Play to Win&quot;. Because of this one can define cEDH as a format where:
          </p>
          <ul>
            <li>
              All decks and strategies are allowed.
            </li>
            <li>
              The use of pet cards is avoided.
            </li>
            <li>
              Decks impact the game in early turns.
            </li>
            <li>
              The budget is not a limit. In fact, most communities accept the use of proxies.
            </li>
            <li>
              Did the game end on turn 2? Let&apos;s shuffle and play again.
            </li>
          </ul>
        </article>

        <article className={styles.homeArticle}>
          <h2>The data</h2>
          <p>
            For the
            {' '}
            <Link href="/metagame" className={styles.homeLink}>
              Metagame
            </Link>
            {' '}
            section, we collected data from
            {' '}
            <a
              href="https://edhtop16.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              EDH Top 16
            </a>
            {', '}
            cross-referenced it with
            {' '}
            <a
              href="https://www.moxfield.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              Moxfield
            </a>
            {', and '}
            then extracted specific card information from {' '}
            <a
              href="https://scryfall.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              Scryfall
            </a>
            {' and '}
            <a
              href="https://mtgjson.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              MTGJSON
            </a>
            {'. '}
            This data was processed to provide an overview of the metagame from the past year, as you can see in
            {' '}
            <Link href="/metagame" className={styles.homeLink}>
              Metagame
            </Link>
            {', '}
            <Link href="/tournaments" className={styles.homeLink}>
              Tournaments
            </Link>
            {' and '}
            <Link href="/metagame-cards" className={styles.homeLink}>
              Metagame Cards
            </Link>
            {'. '}
            For the above, the following criteria were taken:
          </p>
          <ul>
            <li>
              <b>Timeframe:</b> 1 year of data, looking back from the present day.
            </li>
            <li>
              <b>Tournament Size:</b> Only tournaments with at least 48 players are included.
            </li>
            <li>
              <b>Decklist Source:</b> Decklist data is processed solely from Moxfield. Decklists with broken or missing links are excluded.
            </li>
          </ul>

          <p>
            We also process the decklists exposed by the {' '}
            <a
              href="https://cedh-decklist-database.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              cEDH Database
            </a>
            {' '}
            for the
            {' '}
            <Link href="/db-cards" className={styles.homeLink}>
              DDB Cards
            </Link>
            {' section, '}
            with the following criteria:
          </p>
          <ul>
            <li>
            <b>Timeframe:</b> Available data at the moment of update.
            </li>
            <li>
              <b>Decklist Considered:</b> Only the decks exposed in the &quot;Competitive Decks&quot; section of the database are considered.
            </li>
            <li>
              <b>Decklist Source:</b> Similarly to the tournament section, decklist data is processed solely from Moxfield. Decklists with broken or missing links are excluded.
            </li>
          </ul>
        </article>

        <article className={styles.homeArticle}>
          <h3>Last update</h3>
          <ul>
            <li><b>Tournaments:</b> {UPDATE_DATE.metagame}</li>
            <li><b>DDB:</b> {UPDATE_DATE.database}</li>
          </ul>
        </article>

        <section className={styles.homePatreon}>
          <PatreonBigButton />
        </section>

        <article className={styles.homeLegal}>
          <p className={styles.homeLegalText}>
            Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2024 Wizards. All Rights Reserved.
          </p>
          <p className={styles.homeLegalText}>
            Carrot Compost is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. Carrot Compost may use the trademarks and other intellectual property of Wizards of the Coast LLC, which is permitted under Wizards&apos; Fan Site Policy. MAGIC: THE GATHERING® is a trademark of Wizards of the Coast. For more information about Wizards of the Coast or any of Wizards&apos; trademarks or other intellectual property, please visit their website at {' '}
            <a
              href="https://company.wizards.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              https://company.wizards.com
            </a>
            .
          </p>
        </article>
      </section>
      <section className={styles.homeStatsSection}>
        <span className={styles.homeStat}>
          <h2>Commanders</h2>
          <p>{METAGAME_DATA.cantCommanders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </span>
        <span className={styles.homeStat}>
          <h2>Decklists</h2>
          <p>{METAGAME_DATA.cantLists.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </span>
        <span className={styles.homeStat}>
          <h2>Tournaments</h2>
          <p>{METAGAME_DATA.cantTournaments.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </span>
        <span className={styles.homeStatTable}>
          <section className={styles.homeStatTableTitle}>
            <h2>Top 10 cards tournaments</h2>
            <h3>{METAGAME_DATA.lastSet}</h3>
          </section>
          <LastSetTop10 last_set_top_10={METAGAME_DATA.lastSetTop10} urlBase='/metagame-cards' />
        </span>
        <span className={styles.homeStatTable}>
          <section className={styles.homeStatTableTitle}>
            <h2>Top 10 cards DDB</h2>
            <h3>{data.last_set}</h3>
          </section>
          <LastSetTop10 last_set_top_10={data.last_set_top_10} urlBase='/db-cards' />
        </span>
      </section>
    </main>
  );
};
