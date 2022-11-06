import { Layout } from '../../components';
import styles from '../../styles/Tournaments.module.css';
import DATA from '../../public/data/tournaments/list.json';
import Link from 'next/link';
import Image from "next/image";

type Tournament = {
  name: string,
  id: string,
  bookmark: string,
  imageName?: string | null,
  serie: string,
  number: number,
};
type TournamentsProps = { tournaments: Tournament[] };

const Tournaments: React.FC<TournamentsProps> = ({ tournaments }) => (
  <Layout title="Tournaments" description="cEDH tournaments list">
    <main className={styles.main}>
      <ul className={styles.list}>
        {
          tournaments?.map(tournament => (
            <Link key={`${tournament.id}-link`} href={`/tournaments/${tournament.id}`}>
              <li key={tournament.id} className={styles.listElement} >
                <Image
                  className={styles.listElementImage}
                  src={`/data/tournaments/${tournament.id}/${tournament.imageName}`}
                  alt="Careful Study"
                  layout="fill"
                />
                <h2>
                  {tournament.name}
                </h2>
              </li>
            </Link>
          ))
        }
      </ul>
    </main>
  </Layout>
);

export const getStaticProps = async () => {
  return {
    props: {
      tournaments: DATA,
    },
  };
};

export default Tournaments;