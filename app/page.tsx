import type { Metadata } from 'next';
import Image from "next/image";
import Link from 'next/link';
/* Vendor */
import { ArrowRightIcon } from '../components/vendor/materialIcon';
/* Own */
import { LastSetTop10 } from '../components';
/* Static */
import styles from '../styles/Home.module.css';
import SylvanLibrary from '../public/images/sylvan_library.jpg';
import DATA from '../public/data/home_overview.json';

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
            <h3>Total Decks</h3>
            <p>{data.decks}</p>
          </span>
          <span className={styles.homeStatHidden}>
            <h3>Total Cards</h3>
            <p>{data.cards}</p>
          </span>
          <span className={styles.homeStatHidden}>
            <h3>Total Staples</h3>
            <span className={styles.homeStatDisclaimer}>(More than 10 occurrences)</span>
            <p>{data.staples}</p>
          </span>
          <Link href="/top-10-last-set">
            <span className={styles.hiddenButtonTop10Tablet}>
              <span className={styles.hiddenButtonTop10TabletLeft}>
                <h3>Top 10 cards</h3>
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
            <span>Top 10 cards of the last set</span>
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
            This page automatically and periodically obtains the list of decks exposed by {' '}
            <a
              href="https://cedh-decklist-database.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              The cEDH Database
            </a>
            , obtains the data of each deck in {' '}
            <a
              href="https://www.moxfield.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              Moxfield
            </a>
            {' '}
            and finally obtains specific information of each card from {' '}
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
            .

            For the above, the following criteria were taken:
          </p>
          <ul>
            <li>
              Only the decks exposed in the &quot;Competitive Decks&quot; section of the database are considered. (In the future it&apos;s thought to make it optional to consider the &quot;Brewer&apos;s Corner&quot; data)
            </li>
            <li>
              Only the data of the lists that are in moxfield are processed.
            </li>
            <li>
              Deck lists with broken links are left out.
            </li>
          </ul>
          <p>
            In the
            {' '}
            <Link href="/metagame" className={styles.homeLink}>
              Metagame
            </Link>
            {' '}
            section, we gathered data from
            {' '}
            <a
              href="https://edhtop16.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.homeLink}
            >
              EDH Top 16
            </a>
            {' and '}
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
            {' and '}
            finally obtains specific information of each card from {' '}
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
            {' to '}
            obtain the statistics and information that you can see in
            {' '}
            <Link href="/metagame" className={styles.homeLink}>
              Metagame
            </Link>
            {' and '}
            <Link href="/metagame-cards" className={styles.homeLink}>
              Metagame Cards
            </Link>
            .
            <p>
              Metagame criteria:
            </p>
            <ul>
              <li>
                1 year of data is considered. (now - 1 year)
              </li>
              <li>
                Only tournaments with 64 or more players are considered.
              </li>
              <li>
                Only top 32 decks are considered.
              </li>
            </ul>
          </p>
        </article>

        <article className={styles.homeLegal}>
          <p className={styles.homeLegalText}>
            Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2023 Wizards. All Rights Reserved.
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
          <h2>Total Decks</h2>
          <p>{data.decks}</p>
        </span>
        <span className={styles.homeStat}>
          <h2>Total Cards</h2>
          <p>{data.cards}</p>
        </span>
        <span className={styles.homeStat}>
          <h2>Total Staples</h2>
          <span className={styles.homeStatDisclaimer}>(More than 10 occurrences)</span>
          <p>{data.staples}</p>
        </span>
        <span className={styles.homeStat}>
          <h2>Total Niche Cards</h2>
          <span className={styles.homeStatDisclaimer}>(1 occurrence)</span>
          <p>{data.pet}</p>
        </span>
        <span className={styles.homeStatTable}>
          <section className={styles.homeStatTableTitle}>
            <h2>Top 10 cards</h2>
            <h3>{data.last_set}</h3>
          </section>
          <LastSetTop10 last_set_top_10={data.last_set_top_10} urlBase='/db-cards' />
        </span>
      </section>
    </main>
  );
};
