import type { Metadata } from 'next';
import Image from "next/image";
/* Vendor */
import { ArrowRightIcon } from '@components/vendor/materialIcon';
/* Own */
import ButtonLink from '@components/buttonLink';
/* Static */
import utilsStyles from '@styles/Utils.module.css';
import styles from '@styles/Error.module.css';
import Fblthp from '@public/images/fblthp.jpg';

export const metadata: Metadata = { title: 'Page Not Found | cEDH Analytics' };

export default function NotFound() {
  return (
    <div className={styles.error}>
      <span className={styles.errorImageContainer}>
        <Image
          src={Fblthp}
          className={styles.errorImage}
          alt="lost"
          width={600}
          height={447}
          placeholder="blur"
          priority
        />
      </span>
      <span className={styles.errorText}>
        <h1>404</h1>
        <h3>Page Not Found</h3>
        <a className={styles.mail} href="mailto:report@cedh-analytics.com">report@cedh-analytics.com</a>
        <ButtonLink variant="contained" color="primary" href="/">
          <span className={utilsStyles.leftArrow}>
            <ArrowRightIcon fontSize="small" />
          </span>
          Home
        </ButtonLink>
      </span>
    </div>
  );
};
