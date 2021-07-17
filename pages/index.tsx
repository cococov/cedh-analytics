import styles from '../styles/Home.module.css';
import { CardsTable, CardInfo, Header, Footer } from '../components';
import { AppProvider, CardProvider } from '../contexts';

const Home = () => {
  return (
    <div className={styles.container}>
      <Header />
      <AppProvider>
        <main className={styles.main}>
          <CardProvider>
            <span className={styles['left-span']}/>
            <CardsTable />
            <CardInfo />
          </CardProvider>
        </main>
        <Footer />
      </AppProvider>
    </div>
  )
}

export default Home;
