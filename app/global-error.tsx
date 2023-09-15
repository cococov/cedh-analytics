"use client";

import type { Metadata } from 'next';
import Image from "next/image";
/* Vendor */
import { Button } from '../components/vendor/materialUi';
/* Static */
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '3.5rem',
          overflowX: 'hidden',
          backgroundColor: 'white',
          width: '100%',
        }}>
          <span style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            margin: '2rem -0.5rem',
          }}>
            <Image
              src={MuddleTheMixture}
              style={{ height: 'auto' }}
              alt="lost"
              width={600}
              height={447}
              placeholder="blur"
              priority
            />
          </span>
          <span style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            textAlign: 'center',
          }}>
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
