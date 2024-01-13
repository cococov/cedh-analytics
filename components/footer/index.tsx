import Image from 'next/image';
/* Own */
import KofiButton from '@/components/kofiButton';
/* Static */
import styles from '@styles/Home.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.madeWithLove}>
        Made with 💜 by {' '}
        <span className={styles.logo}>
          <Image src="/images/carrot_compost.svg" alt="Carrot Compost logo" width={72} height={72} />
        </span>
      </span>
      <span className={styles.donate}>
        <KofiButton />
      </span>
      <span className={styles.mailContainer}>
        <a className={styles.mail} href="mailto:suggestions@cedh-analytics.com">suggestions@cedh-analytics.com</a>
      </span>
    </footer>
  );
};
