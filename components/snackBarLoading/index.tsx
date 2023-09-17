"use client";

import { useState, useEffect, useContext } from 'react';
/* Vendor */
import Snackbar from '@mui/material/Snackbar';
/* Own */
import AppContext from '../../contexts/appStore';
/* Static */
import style from '../../styles/SnackbarLoading.module.css';

export default function SnackBarLoading({
  isOpen
}: {
  isOpen: boolean,
}) {
  const { isLoading } = useContext(AppContext);
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
      open={isLoading}
      autoHideDuration={6000}
    >
      <span className={style['snackBarLoadingBase']}>
        <span className={style['mtg-loading-container']}>
          <span className={style['mtg-loading']}>
            <span className={style['mtg-loading-first']} style={{ backgroundColor: colors['first'] }} />
            <span className={style['mtg-loading-second']} style={{ backgroundColor: colors['second'] }} />
            <span className={style['mtg-loading-third']} style={{ backgroundColor: colors['third'] }} />
            <span className={style['mtg-loading-fourth']} style={{ backgroundColor: colors['fourth'] }} />
            <span className={style['mtg-loading-fifth']} style={{ backgroundColor: colors['fifth'] }} />
          </span>
        </span>
        <span className={style['snackBarLoadingText']}>
          LOADING...
        </span>
      </span>
    </Snackbar>
  )
};
