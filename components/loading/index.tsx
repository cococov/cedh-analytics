"use client";

import { useState, useEffect } from 'react';
/* Static */
import styles from '../../styles/Loading.module.css';

export default function Loading() {
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
    <span className={styles.mtgLoadingContainer}>
      <span className={styles.mtgLoading}>
        <span className={styles.mtgLoadingFirst} style={{ backgroundColor: colors['first'] }} />
        <span className={styles.mtgLoadingSecond} style={{ backgroundColor: colors['second'] }} />
        <span className={styles.mtgLoadingThird} style={{ backgroundColor: colors['third'] }} />
        <span className={styles.mtgLoadingFourth} style={{ backgroundColor: colors['fourth'] }} />
        <span className={styles.mtgLoadingFifth} style={{ backgroundColor: colors['fifth'] }} />
      </span>
    </span>
  );
};
