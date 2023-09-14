import Link from 'next/link';
/* Vendor */
import { replace } from 'ramda';
/* Static */
import styles from '../../styles/Top10LastSet.module.css';

type Props = {
  last_set: string;
  last_set_top_10: { occurrences: number, cardName: string }[];
};

const LastSetTop10: React.FC<Props> = ({ last_set, last_set_top_10 }) => {
  return (
    <table className={styles['statTableTable']}>
      <thead className={styles[`statTableHead`]}>
        <tr>
          <th className={styles['statTableHeadName']}>Name</th>
          <th className={styles['statTableHeadOccurrences']}>Occurrences</th>
        </tr>
      </thead>
      <tbody>
        {last_set_top_10.map((d, i) => (
          <tr key={`row-last_set_top_10-${i}`} className={styles[`statTableBodyRow${i % 2}`]}>
            <td key={`name-last_set_top_10-${i}`} className={styles['statTableBodyName']}>
              <Link href={`/cards/${replace(/\//g, '%2F', d.cardName)}`}>
                <span className={styles['dummyTd']}>{d.cardName}</span>
              </Link>
            </td>
            <td key={`occurrences-last_set_top_10-${i}`} className={styles['statTableBodyOccurrences']}>
              <Link href={`/cards/${replace(/\//g, '%2F', d.cardName)}`}>
                <span className={styles['dummyTd']}>{d.occurrences}</span>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LastSetTop10;
