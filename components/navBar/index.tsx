import { useReducer } from 'react';
import Link from 'next/link'
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Menu, MenuOpen } from '@material-ui/icons';
import styles from '../../styles/Home.module.css';

const NavBar: React.FC = () => {
  const [isOpen, toggle] = useReducer((state: boolean) => !state, false);
  const isSmallScreen: boolean = useMediaQuery('(max-width: 600px)');
  return (
    <>
      {
        isSmallScreen ? (
          <div className={styles.navBarPhone}>
            <a className={styles.navBarPhoneIcon} onClick={toggle}>
              {isOpen ? <MenuOpen /> : <Menu />}
            </a>
            {
              isOpen && (
                <>
                  <Link href="/" passHref>
                    Home
                  </Link>
                  <Link href="/cards_analysis" passHref>
                    Cards Analysis
                  </Link>
                  <Link href="/decks_analysis" passHref>
                    Decks Analysis
                  </Link>
                  <Link href="/metagame" passHref>
                    Metagame
                  </Link>
                  <Link href="/about" passHref>
                    About
                  </Link>
                </>
              )
            }
          </div>
        ) : (
          <div className={styles.navBar} >
            <Link href="/" passHref>
              Home
            </Link>
            <Link href="/cards_analysis" passHref>
              Cards Analysis
            </Link>
            <Link href="/decks_analysis" passHref>
              Decks Analysis
            </Link>
            <Link href="/metagame" passHref>
              Metagame
            </Link>
            <Link href="/about" passHref>
              About
            </Link>
          </div>
        )
      }
    </>
  )
}

export default NavBar;