import { useCallback, useReducer } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { replace } from 'ramda';
import { server } from '../config';
import styles from '../styles/Top10LastSet.module.css';
import { Layout, SnackBarLoading } from '../components';

type Data = {
  last_set: string,
  last_set_top_10: { occurrences: number, cardName: string }[],
};

type Top10LastSetProps = {
  data: Data,
}

const Top10LastSet: NextPage<Top10LastSetProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, toggle] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

  const handleClickTopRow = useCallback((event) => {
    toggle(true);
    router.push(`/cards/${replace(/\//g, '%2F', event.target.parentNode.childNodes[0].childNodes[0].data)}`);
  }, []);

  return (
    <Layout title="Top 10 Last Set">
      <SnackBarLoading isOpen={isLoading} />
      <main className={styles['main']} >
        <span className={styles['statTable']}>
          <section className={styles['statTableTitle']}>
            <h1>Top 10 cards</h1>
            <h2>{data.last_set}</h2>
          </section>
          <table className={styles['statTableTable']}>
            <thead className={styles[`statTableHead`]}>
              <tr>
                <th className={styles['statTableHeadName']}>Name</th>
                <th className={styles['statTableHeadOccurrences']}>Occurrences</th>
              </tr>
            </thead>
            <tbody>
              {data.last_set_top_10.map((d, i) => (
                <tr key={`row-last_set_top_10-${i}`} className={styles[`statTableBodyRow${i % 2}`]} onClick={handleClickTopRow}>
                  <td key={`name-last_set_top_10-${i}`} className={styles['statTableBodyName']}>{d.cardName}</td>
                  <td key={`occurrences-last_set_top_10-${i}`} className={styles['statTableBodyOccurrences']}>{d.occurrences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </span>
      </main>
    </Layout >
  )
};

export const getStaticProps = async () => {
  const rawResult = await fetch(`${server}/data/home_overview.json`);
  const result = await rawResult.json();
  return { props: { data: { last_set: result['last_set'], last_set_top_10: result['last_set_top_10'] } } };
}

export default Top10LastSet;
