import { useReducer, useState, useEffect } from 'react';
import { CardsTable, CardInfo, DeckLists, Layout } from '../../components';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from '../../styles/CardsList.module.css';
import DATA from '../../public/data/tournaments/list.json';

type Tournament = {
  name: string,
  id: string,
  bookmark: string,
  serie: string,
  number: number,
};
type TournamentsProps = { tournaments: Tournament[] };

const Tournaments: React.FC<TournamentsProps> = ({ tournaments }) => {
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <Layout title="Tournaments" description="cEDH tournaments">
      <main className={styles.main}>
        <ul>
          {
            tournaments?.map(tournament => (
              <li key={tournament.id}>{tournament.name}</li>
            ))
          }
        </ul>
      </main>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      tournaments: DATA,
    },
  };
};

export default Tournaments;