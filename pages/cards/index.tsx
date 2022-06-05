import { useReducer } from 'react';
import styles from '../../styles/CardsList.module.css';
import { CardsTable, CardInfo, DeckLists, Layout, SnackBarLoading } from '../../components';
import { CardProvider } from '../../contexts';

const Cards = () => {
  const [isLoading, toggle] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  return (
    <Layout title="cEDH Card List" description="All cEDH cards.">
      <SnackBarLoading isOpen={isLoading} />
      <main className={styles.main}>
        <CardProvider>
          <span className={styles['left-span']}>
            <DeckLists />
          </span>
          <CardsTable toggleLoading={toggle} />
          <CardInfo />
        </CardProvider>
      </main>
    </Layout>
  );
};
export default Cards;
