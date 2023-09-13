import type { Metadata } from 'next';
import Link from 'next/link';
import Image from "next/image";
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../shared-metadata';
/* Static */
import styles from '../../styles/Glossary.module.css';
import { server } from '../../config';

type Data = {
  last_set: string,
  last_set_top_10: { occurrences: number, cardName: string }[],
};

export const metadata: Metadata = {
  title: 'Top 10 Last Set',
  description: `List of most used cards of the last set. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'Top 10 Last Set | cEDH Analytics',
    images: [
      {
        url: '/images/frantic_search.jpg',
        width: 788,
        height: 788,
        alt: 'Frantic Search',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `About | ${twitterMetadata.title}`,
    description: `List of most used cards of the last set. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search.jpg',
      alt: 'Frantic Search',
    },
  },
};

const fetchData = async () => {
  const rawResult = await fetch(`${server}/data/home_overview.json`);
  const result = await rawResult.json();
  return { last_set: result['last_set'], last_set_top_10: result['last_set_top_10'] };
};

export default async function Top10LastSet() {
  const data = await fetchData();
  return (
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
  );
};
