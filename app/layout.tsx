import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Script from 'next/script';

import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Analytics } from '@vercel/analytics/react';

import { AppProvider } from '../contexts/appStore';
import { NavBar, Footer } from '../components';

import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import styles from '../styles/Home.module.css';

config.autoAddCss = false;
library.add(fab);

export const metadata: Metadata = {
  title: {
    template: '%s | cEDH Analytics',
    default: 'cEDH Analytics'
  },
  description: 'cEDH Analytics is a website that analyzes and cross-references several EDH community\'s resources to give insights on the competitive metagame.',
  openGraph: {
    title: 'cEDH Analytics',
    description: 'cEDH Analytics is a website that analyzes and cross-references several EDH community\'s resources to give insights on the competitive metagame.',
    url: '/',
    siteName: 'cEDH Analytics',
    images: [
      {
        url: '/images/carrot_compost_white.png',
        width: 788,
        height: 788,
      },
      {
        url: '/images/carrot_compost_playmat.jpeg',
        width: 1800,
        height: 1600,
        alt: 'Carrot Compost\'s Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'cEDH Analytics',
    description: 'cEDH Analytics is a website that analyzes and cross-references several EDH community\'s resources to give insights on the competitive metagame.',
    siteId: '@CoCoCov',
    creator: '@CoCoCov',
    creatorId: '@CoCoCov',
    images: {
      url: '/images/carrot_compost_white.png',
      alt: 'Carrot Compost\'s Logo',
    },
  },
  themeColor: 'white',
  keywords: [
    'cedh', 'cEDH', 'Magic', 'Gathering', 'metagame', 'cedh-decklist-database',
    'MagicTheGathering', 'magicthegathering', 'cedhdb',
    'magic', 'guide', 'stats', 'mtg', 'edh', 'database',
    'commander', 'magic', 'tier', 'list', 'tierlist',
    'decks', 'decklists', 'database',
    'competitive', 'cedhguide', 'cedhanalytics'
  ],
  icons: {
    icon: '/favicon-96x96.png',
  },
  authors: [{ name: 'CoCoCov', url: 'https://www.moxfield.com/users/cococov' }],
};

/* <WIP>
  <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
  <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
  <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
  <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
  <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
  <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
  <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
  <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/manifest.json" />

  https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
*/

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Script
          id="gtag-init"
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-DQ9YFFQRG1"
        />
        <Script
          id="gtag-data"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DQ9YFFQRG1', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <AppProvider>
          <span className={styles.container}>
            <NavBar />
            {children}
            <Footer />
          </span >
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
};
