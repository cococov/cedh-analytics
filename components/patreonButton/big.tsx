/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2024-present CoCoCov
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

import Link from 'next/link';
import Image from 'next/image';
/* Static */
import patreonLogo from '@/public/images/PATREON_SYMBOL_1_WHITE_RGB.svg';
import patreonText from '@/public/images/PATREON_WORDMARK_1_WHITE_RGB.svg';
import styles from './patreonButton.module.css'

export default function PatreonButtonBig() {
  return (
    <Link href="https://patreon.com/cEDHAnalytics" target="_blank" className={styles.patreonButtonBig}>
      <div className={styles.logo}>
        <Image src={patreonLogo} alt="Patreon logo" width={82} height={90} />
      </div>
      <div className={styles.patreonName}>
        <Image src={patreonText} alt="Patreon text" width={150} />
      </div>
      <div className={styles.helpUs}>
        <p>Help us keep the site running for as little as $1 a month.</p>
      </div>
      <div className={styles.clickToSee}>
        <p>Click to see our tiers</p>
      </div>
    </Link>
  );
};
