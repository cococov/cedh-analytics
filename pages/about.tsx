import { NextPage } from 'next';
import { server } from '../config';
import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/About.module.css';
import utilsStyles from '../styles/Utils.module.css';
import Icon from '@material-ui/core/Icon';
import { ButtonLink } from '../components';
import B from '../public/images/B.png';
import G from '../public/images/G.png';
import R from '../public/images/R.png';
import U from '../public/images/U.png';
import W from '../public/images/W.png';

type UpdateDates = {
  metagame: `${number}-${number}-${number}`,
  database: `${number}-${number}-${number}`,
}

type MetagameProps = {
  update_dates: UpdateDates,
}

const About: NextPage<MetagameProps> = ({ update_dates }) => (
  <Layout title="About"  description="About cEDH Analytics and us.">
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
        <section>
          cEDH Analytics is a website that analyzes and cross-references several EDH community's resources to give insights on the competitive metagame. Using the DDB, Moxfield, Metagame information from the community and other resources to compile the “cEDH card pool” as well as several statistics regarding card choices, preferred commanders, strategies, and color combinations. As we grow in content, we hope to be another resource in the cEDH player toolkit to brew and develop new cEDH decks.
        </section>
        <h2>About Us</h2>
        <section>
          We are Carrot Compost! a small group of cEDH enthusiasts from La Serena, Chile. We've been playing cEDH since 2019 aiming to craft the most competitive lists possible using our ideas and resources like the good old TappedOut. As we watched the online community grow as well as other sites such as the competitive EDH deck list database and moxfield, we started taking the meta changes and new cards into account. This site reflects our endeavors to craft the best competitive decks by compiling and analyzing the community's data.
        </section>
        <section className={styles.aboutTeam}>
          <h2>The Team</h2>
          <ul>
            <li>
              <Image src={G} alt={'green'} width={16} height={16} />
              {' '}
              <a
                href="https://www.moxfield.com/users/cococov"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                CoCoCov
              </a>
            </li>
            <li>
              <Image src={W} alt={'white'} width={16} height={16} />
              {' '}
              <a
                href="https://www.moxfield.com/users/javierfreg"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                Javierfreg
              </a>
            </li>
            <li>
              <Image src={B} alt={'black'} width={16} height={16} />
              {' '}
              <a
                href="https://www.moxfield.com/users/svartas"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                Svartas
              </a>
            </li>
            <li>
              <Image src={U} alt={'blue'} width={16} height={16} />
              {' '}
              <a
                href="https://www.moxfield.com/users/Aufban"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                Aufban
              </a>
            </li>
            <li>
              <Image src={R} alt={'red'} width={16} height={16} />
              {' '}
              <a
                href="https://www.moxfield.com/users/Haldarr"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                Haldarr
              </a>
            </li>
          </ul>
        </section>
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
          <p>
            <b>Metagame Data: </b>
            <a
              href="https://drive.google.com/drive/folders/1jU-slPNt9XNzl2grGUarZTXh5afTsNvy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLinkSource}
            >
              Metagame Project
            </a>
          </p>
        </section>
        <section className={styles.aboutLegal}>
          <p className={styles.aboutLegalText}>
            Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2022 Wizards. All Rights Reserved.
          </p>
          <p className={styles.aboutLegalText}>
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
        </section>
        <section className={styles.aboutUpdateDates}>
          <p>
            <b>Last DB update: </b>
            <span className={styles.aboutUpdateDate}>
              {update_dates.database}
            </span>
          </p>
          <p>
            <b>Last metagame update: </b>
            <span className={styles.aboutUpdateDate}>
              {update_dates.metagame}
            </span>
          </p>
        </section>
        <section className={styles.aboutCopyright}>
          <p>
            © 2022 Carrot Compost
          </p>
        </section>
        <ButtonLink variant="contained" color="primary" href="/">
          <span className={utilsStyles.leftArrow}>
            <Icon fontSize="small">arrow_right_alt</Icon>
          </span>
          Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

About.getInitialProps = async () => {
  const rawResult = await fetch(`${server}/data/update_date.json`);
  const result = await rawResult.json();
  return { update_dates: result }
};

export default About;