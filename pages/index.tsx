"use client";

import { useCallback, useReducer } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from "next/image";
import Link from 'next/link';
import { replace } from 'ramda';
import { server } from '../config';
import styles from '../styles/Home.module.css';
import Icon from '@material-ui/core/Icon';
import { Layout, SnackBarLoading } from '../components';
import SylvanLibrary from '../public/images/sylvan_library.jpg';

type Data = {
  decks: number;
  cards: number;
  staples: number;
  pet: number;
  last_set: string;
  last_set_top_10: { occurrences: number, cardName: string }[];
};

type HomeProps = {
  data: Data;
};

const Home: NextPage<HomeProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, toggle] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

  const handleClickTopRow = useCallback<React.MouseEventHandler<HTMLTableRowElement>>((event) => {
    toggle(true);
    const target = event.target as HTMLTableRowElement;
    const node = target.parentNode?.childNodes[0].childNodes[0] as HTMLTableCellElement;
    router.push(`/cards/${replace(/\//g, '%2F', node.textContent || '')}`);
  }, []);

  return (
    <Layout title="Home">
      <SnackBarLoading isOpen={isLoading} />
      <main className={styles['homeMain']} >
        <span className={styles['homeImageHiddenContainer']}>
          <Image
            src={SylvanLibrary}
            alt="SylvanLibrary"
            className={styles['homeImageHidden']}
            placeholder="blur"
            width={600}
            height={447}
            priority
          />
        </span>
        <section className={styles['homeStatsHiddenSection']}>
          <span className={styles['homeStatsHiddenSectionTop']}>
            <span className={styles['homeStatHidden']}>
              <h3>Total Decks</h3>
              <p>{data.decks}</p>
            </span>
            <span className={styles['homeStatHidden']}>
              <h3>Total Cards</h3>
              <p>{data.cards}</p>
            </span>
            <span className={styles['homeStatHidden']}>
              <h3>Total Staples</h3>
              <span className={styles['homeStatDisclaimer']}>(More than 10 occurrences)</span>
              <p>{data.staples}</p>
            </span>
            <Link href="/top10LastSet">
              <span className={styles['hiddenButtonTop10Tablet']}>
                <span className={styles['hiddenButtonTop10TabletLeft']}>
                  <h3>Top 10 cards</h3>
                  <span>{data.last_set}</span>
                </span>
                <span className={styles['hiddenButtonTop10TabletRight']}>
                  <Icon fontSize="large">arrow_right_alt</Icon>
                </span>
              </span>
            </Link>
          </span>
          <Link href="/top10LastSet" className={styles['hiddenButtonTop10']}>
            <>
              <span>Top 10 cards of the last set</span>
              <Icon fontSize="medium">arrow_right_alt</Icon>
            </>
          </Link>
        </section>
        <section className={styles['homeTextSection']}>
          <span className={styles['homeImageContainer']}>
            <Image
              src={SylvanLibrary}
              className={styles['homeImage']}
              alt="SylvanLibrary"
              placeholder="blur"
              priority
            />
          </span>
          <h1>cEDH Analytics</h1>
          <p className={styles['homeResume']}>
            cEDH Analytics is a website that analyzes and cross-references several EDH community&apos;s resources to give insights on the competitive metagame.
          </p>
          <article className={styles['homeArticle']}>
            <h2>Credits</h2>
            <p>
              This website was created thanks to the
              {' '}
              <a
                href="https://cedh-decklist-database.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                The cEDH Database
              </a>
              {', '}
              <a
                href="https://www.moxfield.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                Moxfield
              </a>
              {', '}
              <a
                href="https://scryfall.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                Scryfall
              </a>
              {', '}
              <a
                href="https://mtgjson.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                MTGJSON
              </a>
              {', '}
              <a
                href="https://edhtop16.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                EDH Top 16
              </a>
              {' and '}
              <a
                href="https://drive.google.com/drive/folders/1jU-slPNt9XNzl2grGUarZTXh5afTsNvy"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                The Metagame Project
              </a>
              {' data.'}
            </p>
          </article>

          <article className={styles['homeArticle']}>
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

          <article className={styles['homeArticle']}>
            <h2>The data</h2>
            <p>
              This page automatically and periodically obtains the list of decks exposed by {' '}
              <a
                href="https://cedh-decklist-database.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                The cEDH Database
              </a>
              , obtains the data of each deck in {' '}
              <a
                href="https://www.moxfield.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                Moxfield
              </a>
              {' '}
              and finally obtains specific information of each card from {' '}
              <a
                href="https://scryfall.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                Scryfall
              </a>
              {' '}
              and
              {' '}
              <a
                href="https://mtgjson.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
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
              For the metagame section, the information collected by the Metagame Project was obtained. You can see their data
              {' '}
              <a
                href="https://drive.google.com/drive/folders/1jU-slPNt9XNzl2grGUarZTXh5afTsNvy"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                here
              </a>
              {' '}
              and upload your game data
              {' '}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScZzUaMJRl50KjeCO1KqJgaHXnrZY88Tv9NZeqZUAFXhpw0vQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['homeLink']}
              >
                here
              </a>.
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
                className={styles['homeLink']}
              >
                https://company.wizards.com
              </a>
              .
            </p>
          </article>
        </section>
        <section className={styles['homeStatsSection']}>
          <span className={styles['homeStat']}>
            <h2>Total Decks</h2>
            <p>{data.decks}</p>
          </span>
          <span className={styles['homeStat']}>
            <h2>Total Cards</h2>
            <p>{data.cards}</p>
          </span>
          <span className={styles['homeStat']}>
            <h2>Total Staples</h2>
            <span className={styles['homeStatDisclaimer']}>(More than 10 occurrences)</span>
            <p>{data.staples}</p>
          </span>
          <span className={styles['homeStat']}>
            <h2>Total Niche Cards</h2>
            <span className={styles['homeStatDisclaimer']}>(1 occurrence)</span>
            <p>{data.pet}</p>
          </span>
          <span className={styles['homeStatTable']}>
            <section className={styles['homeStatTableTitle']}>
              <h2>Top 10 cards</h2>
              <h3>{data.last_set}</h3>
            </section>
            <table className={styles['homeStatTableTable']}>
              <thead className={styles[`homeStatTableHead`]}>
                <tr>
                  <th className={styles['homeStatTableHeadName']}>Name</th>
                  <th className={styles['homeStatTableHeadOccurrences']}>Occurrences</th>
                </tr>
              </thead>
              <tbody>
                {data.last_set_top_10.map((d, i) => (
                  <tr key={`row-last_set_top_10-${i}`} className={styles[`homeStatTableBodyRow${i % 2}`]} onClick={handleClickTopRow}>
                    <td key={`name-last_set_top_10-${i}`} className={styles['homeStatTableBodyName']}>{d.cardName}</td>
                    <td key={`occurrences-last_set_top_10-${i}`} className={styles['homeStatTableBodyOccurrences']}>{d.occurrences}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </span>
        </section>
      </main>
    </Layout >
  )
};

export const getServerSideProps = async () => {
  const rawResult = await fetch(`${server}/data/home_overview.json`);
  const result = await rawResult.json();
  return { props: { data: result } };
}

export default Home;
