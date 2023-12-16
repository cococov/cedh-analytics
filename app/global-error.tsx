"use client";

import type { Metadata } from 'next';
import Image from "next/image";
/* Static */
import MuddleTheMixture from '../public/images/muddle-the-mixture.jpg';

export const metadata: Metadata = { title: 'Error!' };

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <html>
      <body>
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '3.5rem',
          overflowX: 'hidden',
          backgroundColor: 'white',
          width: '100%',
          height: '100dvh',
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
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#422273',
                color: '#fff',
                padding: '0.5rem 0.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                marginTop: '0.5rem',
                maxWidth: '10rem',
                alignSelf: 'center',
              }}
              onClick={() => location.reload()}
            >
              Try again
            </button>
            <p>{error?.digest}</p>
            <a
              href="mailto:report@cedh-analytics.com"
              style={{
                color: '#422273',
                fontWeight: 600,
                paddingBottom: '2rem',
              }}
            >
              report@cedh-analytics.com
            </a>
          </span>
        </main>
      </body>
    </html>
  );
};
