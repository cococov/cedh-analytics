import { useCallback, useReducer } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from "next/image";
import { server } from '../config';
import styles from '../styles/Home.module.css';
import { Layout, SnackBarLoading } from '../components';
import SylvanLibrary from '../public/images/sylvan_library.jpg';

type Data = {
  decks: number,
  cards: number,
  staples: number,
  last_set: string,
  last_set_top_10: { occurrences: number, cardName: string }[],
};

type HomeProps = {
  data: Data,
}

const Home: NextPage<HomeProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, toggle] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

  const handleClickTopRow = useCallback((event) => {
    toggle(true);
    router.push(`/cards/${event.target.childNodes[0].data}`);
  }, []);

  return (
    <Layout title="Home">
      <SnackBarLoading isOpen={isLoading} />
      <main className={styles['homeMain']} >
        <span className={styles['homeImageHiden']}>
          <Image
            src={SylvanLibrary}
            alt="SylvanLibrary"
            layout="intrinsic"
            placeholder="blur"
            width={600}
            height={447}
            priority
          />
        </span>
        <section className={styles['homeStatsHidenSection']}>
          <span className={styles['homeStatHiden']}>
            <h2>Total Decks</h2>
            <p>{data.decks}</p>
          </span>
          <span className={styles['homeStatHiden']}>
            <h2>Total Cards</h2>
            <p>{data.cards}</p>
          </span>
          <span className={styles['homeStatHiden']}>
            <h2>Total Staples</h2>
            <span className={styles['homeStatDisclaimer']}>(More than 10 occurrences)</span>
            <p>{data.staples}</p>
          </span>
        </section>
        <section className={styles['homeTextSection']}>
          <span className={styles['homeImage']}>
            <Image
              src={SylvanLibrary}
              alt="SylvanLibrary"
              layout='responsive'
              placeholder="blur"
              objectFit='contain'
              priority
            />
          </span>
          <h1>cEDH Analytics</h1>
          <p className={styles['homeResume']}>
            cEDH Analytics is a website that analyzes and cross-references several EDH community's resources to give insights on the competitive metagame.
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
              cEDH is a subcategory of EDH, defined by a single phrase, "Play to Win". Because of this one can define cEDH as a format where:
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
                Did the game end on turn 2? Let's shuffle and play again.
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
                Only the decks exposed in the "Competitive Decks" section of the database are considered. (In the future it's thought to make it optional to consider the "Brewer's Corner" data)
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
              Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2022 Wizards. All Rights Reserved.
            </p>
            <p className={styles.homeLegalText}>
              Carrot Compost is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. Carrot Compost may use the trademarks and other intellectual property of Wizards of the Coast LLC, which is permitted under Wizards' Fan Site Policy. MAGIC: THE GATHERING® is a trademark of Wizards of the Coast. For more Datarmation about Wizards of the Coast or any of Wizards' trademarks or other intellectual property, please visit their website at {' '}
              <a
                href="https://company.wizards.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://company.wizards.com/
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
          <span className={styles['homeStatTable']}>
            <section className={styles['homeStatTableTitle']}>
              <h2>Top 10 cards</h2>
              <h3>{data.last_set}</h3>
            </section>
            <table className={styles['homeStatTableTable']}>
              <thead className={styles[`homeStatTableHead`]}>
                <tr>
                  <th className={styles['homeStatTableHeadName']}>Name</th>
                  <th className={styles['homeStatTableHeadOcurrences']}>Occurrences</th>
                </tr>
              </thead>
              <tbody>
                {data.last_set_top_10.map((d, i) => (
                  <tr key={`row-last_set_top_10-${i}`} className={styles[`homeStatTableBodyRow${i % 2}`]} onClick={handleClickTopRow}>
                    <td key={`name-last_set_top_10-${i}`} className={styles['homeStatTableBodyName']}>{d.cardName}</td>
                    <td key={`occurrences-last_set_top_10-${i}`} className={styles['homeStatTableBodyOcurrences']}>{d.occurrences}</td>
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

export const getStaticProps = async () => {
  const rawResult = await fetch(`${server}/data/home_overview.json`);
  const result = await rawResult.json();
  return { props: { data: result } };
}

export default Home;
