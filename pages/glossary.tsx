import { NextPage } from 'next';
import { Layout } from '../components';
import Image from "next/image";
import styles from '../styles/Glossary.module.css';

import CarefulStudy from '../public/images/frantic_search.jpg';

const Glossary: NextPage = () => {
  return (
    <Layout title="cEDH Glossary" description="List of the most used concepts in cEDH and their meaning.">
      <main className={styles.glossaryMain} >
        <span className={styles.glossaryImage}>
          <Image
            src={CarefulStudy}
            alt="Careful Study"
            layout="intrinsic"
            width={600}
            height={447}
            placeholder="blur"
            priority
          />
        </span>
        <span className={styles.glossaryText}>
          <h1>Glossary</h1>

          <section id='cEDH' className={styles.glossarySection}>
            <h2>cEDH</h2>
            <p>
              Competitive Elder Dragon Highlander, a format where the goal is to win as fast as possible with the most powerful cards available.
            </p>
          </section>

          <section id='Spite Play' className={styles.glossarySection}>
            <h2>Spite Play</h2>
            <p>
              Any play that doesn't benefit you, but hurts your opponents. For example, using <a className={styles.glossaryLink} href='/cards/sword%20to%20plowshares'>Sword to Plowshares</a> on a creature of one of your opponents before you die by drawing a card with an empty library.
            </p>
          </section>

          <section id='King Making' className={styles.glossarySection}>
            <h2>King Making</h2>
            <p>
              Do something that favors one of your opponents without this presenting a benefit to you. Sometimes causing one of your opponents to win the game. For example allowing your opponent to draw a lot of cards with his <a className={styles.glossaryLink} href='/cards/rhystic%20study'>Rhystic Study</a>.
            </p>
          </section>

          <section id='Combo' className={styles.glossarySection}>
            <h2>Combo</h2>
            <p>
              A sequence of cards that allows you to win the game.
            </p>
          </section>

          <section id='Stax' className={styles.glossarySection}>
            <h2>Stax</h2>
            <p>
              A strategy that aims to slow down the game by using cards that prevent your opponents from playing their cards.
            </p>
          </section>

          <section id='Ramp' className={styles.glossarySection}>
            <h2>Ramp</h2>
            <p>
              A strategy that aims to speed up the game by using cards that allow you to play more mana.
            </p>
          </section>

          <section id='Mana Rock' className={styles.glossarySection}>
            <h2>Mana Rock</h2>
            <p>
              A card that allows you to play more mana.
            </p>
          </section>
        </span>
      </main>
    </Layout >
  )
};

export default Glossary;
