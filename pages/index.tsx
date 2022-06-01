import styles from '../styles/Home.module.css';
import { CardsTable, CardInfo, DeckLists, Layout } from '../components';
import { CardProvider } from '../contexts';

const Home = () => (
  <Layout title="cEDH Card List" description="All cEDH cards.">
    <main className={styles.main}>
      <CardProvider>
        <span className={styles['left-span']}>
          <DeckLists />
        </span>
        <CardsTable />
        <CardInfo />
      </CardProvider>
    </main>
  </Layout>
);

export default Home;
