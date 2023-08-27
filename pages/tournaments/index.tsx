import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { reject } from 'ramda';
import Link from 'next/link';
import Image from "next/image";

import { Layout, SnackBarLoading } from '../../components';
import styles from '../../styles/Tournaments.module.css';

import DATA from '../../public/data/tournaments/list.json';

type Tournament = {
  name: string;
  showName: boolean;
  id: string;
  bookmark: string;
  imageName?: string | null;
  serie: string;
  number: number;
  hidden: boolean;
};
type TournamentsProps = { tournaments: Tournament[] };

const Tournaments: React.FC<TournamentsProps> = ({ tournaments }) => {
  const router = useRouter();
  const [isLoading, toggleLoading] = useReducer((_state: boolean, route: string) => route !== '/tournaments', false);

  useEffect(() => {
    // Set loading when detects a route change (Link clicked)
    router.events.on('routeChangeStart', toggleLoading);
  }, []);

  return (
    <Layout title="Tournaments" description="cEDH tournaments list">
      <SnackBarLoading isOpen={isLoading} />
      <main className={styles.main}>
        <ul className={styles.list}>
          {
            tournaments?.map(tournament => (
              <Link key={`${tournament.id}-link`} href={`/tournaments/${tournament.id}`} className={styles.tournamentLink}>
                <li key={tournament.id} className={styles.listElement} >
                  <span className={styles.listElementImageContainer}>
                    <Image
                      className={styles.listElementImage}
                      src={`/data/tournaments/${!!tournament.imageName ? `${tournament.id}/${tournament.imageName}` : 'default.jpg'}`}
                      alt={`${tournament.id} Image`}
                      height={1200}
                      width={760}
                      quality={100}
                      priority
                    />
                  </span>
                  {tournament.showName && <h2>{tournament.name}</h2>}
                </li>
              </Link>
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
      tournaments: reject((x: Tournament) => x.hidden, DATA),
    },
  };
};

export default Tournaments;
