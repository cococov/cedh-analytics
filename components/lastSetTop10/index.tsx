/* Vendor */
import { replace } from 'ramda';
/* Own */
import TableRowWithLink from '../tableRowWithLink';
/* Static */
import styles from '../../styles/Top10LastSet.module.css';

export default function LastSetTop10({
  last_set_top_10,
  noLink,
}: {
  last_set_top_10: { occurrences: number, cardName: string }[],
  noLink?: boolean,
}) {
  return (
    <table className={styles.statTableTable}>
      <thead className={styles.statTableHead}>
        <tr>
          <th className={styles.statTableHeadName}>Name</th>
          <th className={styles.statTableHeadOccurrences}>Occurrences</th>
        </tr>
      </thead>
      <tbody>
        {last_set_top_10.map((d, i) => (
          noLink ? (
            <tr key={`row-last_set_top_10-${i}`} className={styles[`statTableBodyRow${i % 2}NoLink`]}>
              <td key={`name-last_set_top_10-${i}`} className={styles.statTableBodyName}>
                <span className={styles.dummyTd}>{d.cardName}</span>
              </td>
              <td key={`occurrences-last_set_top_10-${i}`} className={styles.statTableBodyOccurrences}>
                <span className={styles.dummyTd}>{d.occurrences}</span>
              </td>
            </tr>
          ) : (
            <TableRowWithLink key={`row-last_set_top_10-${i}`} className={styles[`statTableBodyRow${i % 2}`]} link={`/db-cards/${replace(/\//g, '%2F', d.cardName)}`}>
              <td key={`name-last_set_top_10-${i}`} className={styles.statTableBodyName}>
                <span className={styles.dummyTd}>{d.cardName}</span>
              </td>
              <td key={`occurrences-last_set_top_10-${i}`} className={styles.statTableBodyOccurrences}>
                <span className={styles.dummyTd}>{d.occurrences}</span>
              </td>
            </TableRowWithLink>
          )
        ))}
      </tbody>
    </table>
  );
};
