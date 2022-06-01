import { NextPage } from 'next';
import Image from "next/image";
import { server } from '../config';
import styles from '../styles/Home.module.css';
import { Layout } from '../components';
import SylvanLibrary from '../public/images/sylvan_library.jpg';

type Data = {
  decks: number,
  cards: number,
  staples: number,
};

type HomeProps = {
  data: Data,
}

const Home: NextPage<HomeProps> = ({ data }) => (
  <Layout title="cEDH Card List" description="All cEDH cards.">
    <main className={styles['homeMain']} >
      <span className={styles['homeImageHiden']}>
        <Image
          src={SylvanLibrary}
          alt="SylvanLibrary"
          layout="intrinsic"
          width={600}
          height={447}
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
            objectFit='contain'
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
      </section>
    </main>
  </Layout >
);

Home.getInitialProps = async () => {
  const rawResult = await fetch(`${server}/data/home_overview.json`);
  const result = await rawResult.json();
  return { data: result }
}

export default Home;
