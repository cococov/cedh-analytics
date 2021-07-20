import styles from '../styles/Home.module.css';
import { CardsTable, CardInfo, Layout } from '../components';
import { AppProvider, CardProvider } from '../contexts';

const Home = () => {
  return (
    <Layout title="cEDH Card List" description="All cEDH cards.">
      <AppProvider>
        <main className={styles.main}>
          <CardProvider>
            <span className={styles['left-span']} />
            <CardsTable />
            <CardInfo />
          </CardProvider>
        </main>
      </AppProvider>
    </Layout>
  )
}

export default Home;
