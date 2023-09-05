"use client";

import type { Metadata } from 'next';
import Image from "next/image";

import { Button } from '../components/vendor/materialUi';

import styles from '../styles/Error.module.css';
import MuddleTheMixture from '../public/images/muddle-the-mixture.jpg';

export const metadata: Metadata = { title: 'Error!' };

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className={styles.error}>
          <span className={styles.errorImageContainer}>
            <Image
              src={MuddleTheMixture}
              className={styles.errorImage}
              alt="lost"
              width={600}
              height={447}
              placeholder="blur"
              priority
            />
          </span>
          <span className={styles.errorText}>
            <h1>Something went wrong!</h1>
            <p>{error?.digest}</p>
            <Button variant="contained" color="primary" onClick={reset}>
              Try Again
            </Button>
          </span>
        </div>
      </body>
    </html>
  );
};
