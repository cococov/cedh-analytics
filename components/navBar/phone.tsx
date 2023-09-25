import Link from 'next/link';
/* Vendor */
import { MenuOpenIcon, MenuClosedIcon } from '../vendor/materialIcon';
/* Static */
import styles from '../../styles/Home.module.css';

export default function PhoneNavBar({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean
  toggleOpen: () => void,
}) {
  return (
    <div className={styles.navBarPhone}>
      <a className={styles.navBarPhoneIcon} onClick={toggleOpen}>
        {isOpen ? <MenuOpenIcon /> : <MenuClosedIcon />}
      </a>
      {
        isOpen && (
          <>
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
          </>
        )
      }
    </div>
  )
};
