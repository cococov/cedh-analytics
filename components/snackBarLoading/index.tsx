/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2022-present CoCoCov
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

/* Vendor */
import Snackbar from '@mui/material/Snackbar';
import { CircularProgress } from '@heroui/react';
/* Static */
import styles from '@/styles/SnackbarLoading.module.css';

export default function SnackBarLoading({
  isOpen
}: {
  isOpen: boolean,
}) {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
    >
      <span className={styles.snackBarLoadingBase}>
        <span className={styles.mtgLoadingContainer}>
          <CircularProgress size="sm" color="secondary" aria-label="Loading..." />
        </span>
        <span className={styles.snackBarLoadingText}>
          Loading...
        </span>
      </span>
    </Snackbar>
  );
};
