import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import style from '../../styles/SnackbarLoading.module.css';

type SnackBarLoadingProps = {
  isOpen: boolean,
};

const SnackBarLoading: React.FC<SnackBarLoadingProps> = ({ isOpen }) => {
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

export default SnackBarLoading;