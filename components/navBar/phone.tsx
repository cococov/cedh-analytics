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
            <Link href="/cards">
              Card List
            </Link>
            <Link href="/metagame_old">
              Metagame
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
