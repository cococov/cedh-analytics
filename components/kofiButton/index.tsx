import Link from 'next/link';
import Image from 'next/image';
/* Static */
import styles from './kofiButton.module.css'

export default function KofiButton() {
  return (
    <Link href="https://ko-fi.com/carrotcompost" target="_blank" className={styles.kofiButton}>
      <Image src="https://storage.ko-fi.com/cdn/nav-logo-stroke.png" alt="Ko-fi logo" width={32} height={22} />
      Support
    </Link>
  );
};
