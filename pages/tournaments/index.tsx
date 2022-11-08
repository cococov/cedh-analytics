import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, SnackBarLoading } from '../../components';
import styles from '../../styles/Tournaments.module.css';
import DATA from '../../public/data/tournaments/list.json';
import Link from 'next/link';
import Image from "next/image";

type Tournament = {
  name: string,
  showName: boolean,
  id: string,
  bookmark: string,
  imageName?: string | null,
  serie: string,
  number: number,
};
type TournamentsProps = { tournaments: Tournament[] };

const Tournaments: React.FC<TournamentsProps> = ({ tournaments }) => {
  const router = useRouter();
  const [isLoading, toggleLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

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
              <Link key={`${tournament.id}-link`} href={`/tournaments/${tournament.id}`}>
                <li key={tournament.id} className={styles.listElement} >
                  <Image
                    className={styles.listElementImage}
                    src={`/data/tournaments/${!!tournament.imageName ? `${tournament.id}/${tournament.imageName}` : 'default.jpg'}`}
                    alt={`${tournament.id} Image`}
                    layout="fill"
                    quality={100}
                    priority
                  />
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
      tournaments: DATA,
    },
  };
};

export default Tournaments;