"use client";

import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';

import { MenuOpenIcon, MenuClosedIcon } from '../vendor/materialIcon';
import { useMediaQuery } from '../../hooks/useMediaQuery';

import styles from '../../styles/Home.module.css';

const NavBar: React.FC = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [isOpen, toggle] = useReducer((state: boolean) => !state, false);
  const isSmallScreen: boolean = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <>
      {
        isSmallScreen ? (
          <div className={styles.navBarPhone}>
            <a className={styles.navBarPhoneIcon} onClick={toggle}>
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
        ) : (
          <div className={styles.navBar} >
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
          </div>
        )
      }
    </>
  )
}

export default NavBar;