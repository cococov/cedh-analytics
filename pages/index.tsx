import styles from '../styles/Home.module.css';
import { CardsTable, CardInfo, DeckLists, Layout } from '../components';
import { AppProvider, CardProvider } from '../contexts';

const Home = () => (
  <Layout title="cEDH Card List" description="All cEDH cards.">
    <AppProvider>
      <main className={styles.main}>
        <CardProvider>
          <span className={styles['left-span']}>
            <DeckLists />
          </span>
          <CardsTable />
          <CardInfo />
        </CardProvider>
      </main>
    </AppProvider>
  </Layout>
);

export default Home;
