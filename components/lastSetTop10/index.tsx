"use client";

import { useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';

import { replace } from 'ramda';

import AppContext from '../../contexts/appStore';

import styles from '../../styles/Home.module.css';

type Props = {
  last_set: string;
  last_set_top_10: { occurrences: number, cardName: string }[];
};

const LastSetTop10: React.FC<Props> = ({ last_set, last_set_top_10 }) => {
  const { toggleLoading } = useContext(AppContext);
  const router = useRouter();

  const handleClickTopRow = useCallback<React.MouseEventHandler<HTMLTableRowElement>>((event) => {
    toggleLoading(true);
    const target = event.target as HTMLTableRowElement;
    const node = target.parentNode?.childNodes[0].childNodes[0] as HTMLTableCellElement;
    router.push(`/cards/${replace(/\//g, '%2F', node.textContent || '')}`);
  }, []);

  return (
    <>
      <section className={styles['homeStatTableTitle']}>
        <h2>Top 10 cards</h2>
        <h3>{last_set}</h3>
      </section>
      <table className={styles['homeStatTableTable']}>
        <thead className={styles[`homeStatTableHead`]}>
          <tr>
            <th className={styles['homeStatTableHeadName']}>Name</th>
            <th className={styles['homeStatTableHeadOccurrences']}>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {last_set_top_10.map((d, i) => (
            <tr key={`row-last_set_top_10-${i}`} className={styles[`homeStatTableBodyRow${i % 2}`]} onClick={handleClickTopRow}>
              <td key={`name-last_set_top_10-${i}`} className={styles['homeStatTableBodyName']}>{d.cardName}</td>
              <td key={`occurrences-last_set_top_10-${i}`} className={styles['homeStatTableBodyOccurrences']}>{d.occurrences}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default LastSetTop10;
