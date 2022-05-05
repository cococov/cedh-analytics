import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/About.module.css';
import { ButtonLink } from '../components';

const About = () => (
  <Layout title="About">
    <div className={styles.about}>
      <span className={styles.aboutImage}>
        <Image
          src="/images/careful-study.jpeg"
          alt="Careful Study"
          layout="intrinsic"
          width={600}
          height={447}
        />
      </span>
      <span className={styles.aboutText}>
        <h1>About</h1>
        <section className={styles.aboutSources}>
          <h2>Sources</h2>
          <p>
            <b>Lists DB: </b>
            <a
              href="https://cedh-decklist-database.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLinkSource}
            >
              cEDH Decklist Database
            </a>
          </p>
          <p>
            <b>Decklists Data: </b>
            <a
              href="https://www.moxfield.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLinkSource}
            >
              Moxfield
            </a>
          </p>
          <p>
            <b>Cards Images and Data: </b>
            <a
              href="https://scryfall.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLinkSource}
            >
              Scryfall
            </a>
          </p>
        </section>
        <section className={styles.aboutLegal}>
          <p className={styles.aboutLegalText}>
            Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2022 Wizards. All Rights Reserved.
          </p>
          <p className={styles.aboutLegalText}>
            cEDH Analytics is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. cEDH Analytics may use the trademarks and other intellectual property of Wizards of the Coast LLC, which is permitted under Wizards' Fan Site Policy. MAGIC: THE GATHERING® is a trademark of Wizards of the Coast. For more Datarmation about Wizards of the Coast or any of Wizards' trademarks or other intellectual property, please visit their website at {' '}
            <a
              href="https://company.wizards.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://company.wizards.com/
            </a>
            .
          </p>
        </section>
        <section className={styles.aboutCopyright}>
          <p>
            © 2022 cEDH Analytics
          </p>
        </section>
        <ButtonLink variant="contained" color="primary" href="/">
          ⬅ Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

export default About;