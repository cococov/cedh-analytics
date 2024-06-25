/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2021-present CoCoCov
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

import Image from 'next/image';
/* Own */
import KofiButton from '@/components/kofiButton';
import PatreonButton from '@/components/patreonButton';
/* Static */
import styles from '@/styles/Home.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.madeWithLove}>
        Made with 💜 by {' '}
        <span className={styles.logo}>
          <Image src="/images/carrot_compost.svg" alt="Carrot Compost logo" width={72} height={72} />
        </span>
      </span>
      <span className={styles.donate}>
        <PatreonButton />
        <KofiButton />
      </span>
      <span className={styles.mailContainer}>
        <a className={styles.mail} href="mailto:suggestions@cedh-analytics.com">suggestions@cedh-analytics.com</a>
      </span>
    </footer>
  );
};
