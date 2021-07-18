import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';

const Loading: React.FC = () => {
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
  }, [])

  return (
    <span className={styles['mtg-loading-container']}>
      <span className={styles['mtg-loading']}>
        <span className={styles['mtg-loading-first']} style={{ backgroundColor: colors['first'] }} />
        <span className={styles['mtg-loading-second']} style={{ backgroundColor: colors['second'] }} />
        <span className={styles['mtg-loading-third']} style={{ backgroundColor: colors['third'] }} />
        <span className={styles['mtg-loading-fourth']} style={{ backgroundColor: colors['fourth'] }} />
        <span className={styles['mtg-loading-fifth']} style={{ backgroundColor: colors['fifth'] }} />
      </span>
    </span>
  )
}

export default Loading;
