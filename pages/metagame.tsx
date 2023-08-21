import { NextPage } from 'next';
import { server } from '../config';
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

type MetagameProps = {
  data: Data,
}

const Metagame: NextPage<MetagameProps> = ({ data }) => {
  return (
    <Layout title="Metagame" description="cEDH metagame analysis">
      <div className={styles.metagame}>
        <section className={styles.overview}>
          <MetagameOverviewTable data={data['overview']} />
        </section>
        <section className={styles.categories}>
          <MetagameCategoriesTable data={data['categories']} />
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const rawResult = await fetch(`${server}/data/metagame/metagame_deprecated.json`);
  const result = await rawResult.json();
  return { props: { data: result } };
};

export default Metagame;