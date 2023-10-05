import Image from 'next/image';
/* Own */
import KofiButton from '../kofiButton';
/* Static */
import styles from '../../styles/Home.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.madeWithLove}>
        Made with ❤ by {' '}
        <span className={styles.logo}>
          <Image src="/images/carrot_compost.svg" alt="Carrot Compost logo" width={72} height={72} />
        </span>
      </span>
      <span className={styles.donate}>
        <KofiButton />
      </span>
    </footer>
  );
};
