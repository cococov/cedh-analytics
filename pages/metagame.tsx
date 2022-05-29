import { useEffect, useState } from 'react';
import Layout from "../components/layout";
import styles from '../styles/Metagame.module.css';
import { MetagameOverviewTable, MetagameCategoriesTable } from '../components';

type OverviewRow = {
  "Deck": string,
  "App.": number
  "Wins": number,
  "Win Rate": number,
};

type CategoriesRow = {
  "Category": string,
  "Decks": number,
  "App.": number,
  "Wins": number,
  "Win Rate": number,
  "App. Rate": number,
};

type Data = {
  overview: OverviewRow[],
  categories: CategoriesRow[],
};

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data>({ overview: [], categories: [] });

  useEffect(() => {
    const fetchData = async () => {
      const rawResult = await fetch('/data/metagame/metagame.json');
      const result = await rawResult.json();
      setData(result);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <Layout title="Metagame">
      <div className={styles.metagame}>
        <section className={styles.overview}>
          <MetagameOverviewTable isLoading={isLoading} data={data['overview']} />
        </section>
        <section className={styles.categories}>
          <MetagameCategoriesTable isLoading={isLoading} data={data['categories']} />
        </section>
      </div>
    </Layout>
  );
};

export default About;