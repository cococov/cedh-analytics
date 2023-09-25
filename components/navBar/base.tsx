import Link from 'next/link';
/* Static */
import styles from '../../styles/Home.module.css';

export default function BaseNavBar() {
  return (
    <div className={styles.navBar} >
      <Link href="/">
        Home
      </Link>
      <Link href="/db-cards">
        DB Cards
      </Link>
      <Link href="/metagame">
        Metagame
      </Link>
      <Link href="/metagame-cards">
        Metagame Cards
      </Link>
      <Link href="/tournaments">
        Tournaments
      </Link>
      <Link href="/glossary">
        Glossary
      </Link>
      <Link href="/about">
        About
      </Link>
    </div>
  )
};
