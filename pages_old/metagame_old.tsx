import { NextPage } from 'next';
import Layout from "../components/layout";
import styles from '../styles/MetagameOld.module.css';
import { MetagameOverviewTable, MetagameCategoriesTable } from '../components';
import DATA from '../public/data/metagame/metagame_deprecated.json';

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

const MetagameOld: NextPage<MetagameProps> = ({ data }) => {
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
  return { props: { data: DATA } };
};

export default MetagameOld;