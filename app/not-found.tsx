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

import type { Metadata } from 'next';
import Image from "next/image";
/* Vendor */
import { ArrowRightIcon } from '@/components/vendor/materialIcon';
/* Own */
import ButtonLink from '@/components/buttonLink';
/* Static */
import utilsStyles from '@/styles/Utils.module.css';
import styles from '@/styles/Error.module.css';
import Fblthp from '@/public/images/fblthp.jpg';

export const metadata: Metadata = { title: 'Page Not Found | cEDH Analytics' };

export default function NotFound() {
  return (
    <div className={styles.error}>
      <span className={styles.errorImageContainer}>
        <Image
          src={Fblthp}
          className={styles.errorImage}
          alt="lost"
          width={600}
          height={447}
          placeholder="blur"
          priority
        />
      </span>
      <span className={styles.errorText}>
        <h1>404</h1>
        <h3>Page Not Found</h3>
        <a className={styles.mail} href="mailto:report@cedh-analytics.com">report@cedh-analytics.com</a>
        <ButtonLink variant="contained" color="primary" href="/">
          <span className={utilsStyles.leftArrow}>
            <ArrowRightIcon fontSize="small" />
          </span>
          Home
        </ButtonLink>
      </span>
    </div>
  );
};
