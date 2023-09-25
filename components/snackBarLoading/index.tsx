"use client";

import { useState, useEffect } from 'react';
/* Vendor */
import Snackbar from '@mui/material/Snackbar';
/* Static */
import styles from '../../styles/SnackbarLoading.module.css';

export default function SnackBarLoading({
  isOpen
}: {
  isOpen: boolean,
}) {
  const [colors, setColors] = useState({
    first: 'yellow',
    second: 'blue',
    third: 'black',
    fourth: 'red',
    fifth: 'green',
  });

  useEffect(() => {
    const ref = setInterval(() => {
      setColors((previous) => {
        return {
          first: previous['fifth'],
          second: previous['first'],
          third: previous['second'],
          fourth: previous['third'],
          fifth: previous['fourth'],
        }
      });
    }, 200);

    return () => {
      clearInterval(ref);
    }
  }, []);

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
    >
      <span className={styles.snackBarLoadingBase}>
        <span className={styles.mtgLoadingContainer}>
          <span className={styles.mtgLoading}>
            <span className={styles.mtgLoadingFirst} style={{ backgroundColor: colors['first'] }} />
            <span className={styles.mtgLoadingSecond} style={{ backgroundColor: colors['second'] }} />
            <span className={styles.mtgLoadingThird} style={{ backgroundColor: colors['third'] }} />
            <span className={styles.mtgLoadingFourth} style={{ backgroundColor: colors['fourth'] }} />
            <span className={styles.mtgLoadingFifth} style={{ backgroundColor: colors['fifth'] }} />
          </span>
        </span>
        <span className={styles.snackBarLoadingText}>
          LOADING...
        </span>
      </span>
    </Snackbar>
  );
};
