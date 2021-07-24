import Image from 'next/image';
import styles from '../../styles/Home.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/cococov"
        target="_blank"
        rel="noopener noreferrer"
      >
        Made with ❤ by {' '}
        <span className={styles.logo}>
          <Image src="/images/carrot_compost.svg" alt="Carrot Compost logo" width={72} height={72} />
        </span>
      </a>
    </footer>
  )
}

export default Footer;