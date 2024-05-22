/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
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
/* Vendor */
import { MenuOpenIcon, MenuClosedIcon } from '@/components/vendor/materialIcon';
/* Static */
import styles from '@/styles/Home.module.css';

export default function PhoneNavBar({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean
  toggleOpen: () => void,
}) {
  return (
    <div className={styles.navBarPhone}>
      <a className={styles.navBarPhoneIcon} onClick={toggleOpen}>
        {isOpen ? <MenuOpenIcon /> : <MenuClosedIcon />}
      </a>
      {
        isOpen && (
          <>
            <Link href="/">
              Home
            </Link>
            <Link href="/metagame">
              Metagame
            </Link>
            <Link href="/metagame-cards">
              Metagame Cards
            </Link>
            <Link href="/tournaments">
              Tournaments
            </Link>
            <Link href="/db-cards">
              DDB Cards
            </Link>
            <Link href="/glossary">
              Glossary
            </Link>
            <Link href="/about">
              About
            </Link>
          </>
        )
      }
    </div>
  );
};
