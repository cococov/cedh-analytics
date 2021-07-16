import styles from '../styles/Home.module.css';
import { CardsTable, Header, Footer } from '../components';

const Home = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <CardsTable />
      </main>
      <Footer />
    </div>
  )
}

export default Home;
