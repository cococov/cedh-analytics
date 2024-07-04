/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2022-present CoCoCov-Aufban
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
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
/* Static */
import styles from '@/styles/About.module.css';
import CarrotCompostPlaymat from '@/public/images/carrot_compost_playmat.jpeg';
import B from '@/public/images/B.png';
import G from '@/public/images/G.png';
import R from '@/public/images/R.png';
import U from '@/public/images/U.png';
import W from '@/public/images/W.png';

export const metadata: Metadata = {
  title: 'About',
  description: `About cEDH Analytics and us | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'About | cEDH Analytics',
    images: [
      {
        url: '/images/carrot_compost_playmat.jpeg',
        width: 788,
        height: 443,
        alt: 'Carrot Compost Playmat',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `About | ${twitterMetadata.title}`,
    description: `About cEDH Analytics and us | ${twitterMetadata.description}`,
    images: {
      url: '/images/carrot_compost_playmat.jpeg',
      alt: 'Carrot Compost Playmat',
    },
  },
};

export default async function About() {
  return (
    <main className={styles.about}>
      <span className={styles.aboutImageContainer}>
        <Image
          src={CarrotCompostPlaymat}
          className={styles.aboutImage}
          alt="Carrot Compost Playmat"
          width={800}
          height={450}
          placeholder="blur"
          priority
        />
      </span>
      <span className={styles.aboutText}>
        <h1>cEDH Analytics</h1>
        <section>
          cEDH Analytics is a website that analyzes and cross-references several EDH community&apos;s resources to give insights on the competitive metagame. Using the DDB, Moxfield, Metagame information from the community and other resources to compile the “cEDH card pool” as well as several statistics regarding card choices, preferred commanders, strategies, and color combinations. As we grow in content, we hope to be another resource in the cEDH player toolkit to brew and develop new cEDH decks.
        </section>
        <h2>About Us</h2>
        <section>
          We are Carrot Compost! a small group of cEDH enthusiasts from La Serena, Chile. We&apos;ve been playing cEDH since 2019 aiming to craft the most competitive lists possible using our ideas and resources like the good old TappedOut. As we watched the online community grow as well as other sites such as the competitive EDH deck list database and moxfield, we started taking the meta changes and new cards into account. This site reflects our endeavors to craft the best competitive decks by compiling and analyzing the community&apos;s data.
        </section>
        <section className={styles.aboutTeam}>
          <h2>Carrot Compost</h2>
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
          <ul>
            <li>
              <a
                href="https://mtgjson.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                MTGJSON
              </a>
            </li>
            <li>
              <a
                href="https://www.moxfield.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                Moxfield
              </a>
            </li>
            <li>
              <a
                href="https://edhtop16.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                EDH Top 16
              </a>
            </li>
            <li>
              <a
                href="https://scryfall.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                Scryfall
              </a>
            </li>
            <li>
              <a
                href="https://cedh-decklist-database.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutLinkSource}
              >
                cEDH Decklist Database
              </a>
            </li>
          </ul>
        </section>
        <section className={styles.aboutLegal}>
          <p className={styles.aboutLegalText}>
            Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2024 Wizards. All Rights Reserved.
          </p>
          <p className={styles.aboutLegalText}>
            Carrot Compost is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. Carrot Compost may use the trademarks and other intellectual property of Wizards of the Coast LLC, which is permitted under Wizards&apos; Fan Site Policy. MAGIC: THE GATHERING® is a trademark of Wizards of the Coast. For more information about Wizards of the Coast or any of Wizards&apos; trademarks or other intellectual property, please visit their website at {' '}
            <a
              href="https://company.wizards.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLink}
            >
              https://company.wizards.com/
            </a>
            .
          </p>
        </section>
        <span className={styles.mailContainer}>
          <h2>Contact Us</h2>
          <a className={styles.mail} href="mailto:contact@cedh-analytics.com">contact@cedh-analytics.com</a>
        </span>
        <section className={styles.aboutCopyright}>
          <p>
            © 2024 Carrot Compost
          </p>
        </section>
      </span>
    </main>
  );
};
