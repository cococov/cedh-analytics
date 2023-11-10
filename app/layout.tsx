import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import Script from 'next/script';
/* Vendor */
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Analytics } from '@vercel/analytics/react';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from './shared-metadata';
import { NavBar, Footer } from '../components';
import Providers from './providers';
/* Static */
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import styles from '../styles/Home.module.css';

config.autoAddCss = false;
library.add(fab);

export const viewport: Viewport = {
  themeColor: 'white',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cedh-analytics.com'),
  title: {
    template: '%s | cEDH Analytics',
    default: 'cEDH Analytics'
  },
  description: descriptionMetadata,
  openGraph: openGraphMetadata,
  twitter: twitterMetadata,
  keywords: [
    'cedh', 'cEDH', 'Magic', 'Gathering', 'metagame', 'cedh-decklist-database',
    'MagicTheGathering', 'magicthegathering', 'cedhdb',
    'magic', 'guide', 'stats', 'mtg', 'edh', 'database',
    'commander', 'magic', 'tier', 'list', 'tierlist',
    'decks', 'decklists', 'database',
    'competitive', 'cedhguide', 'cedhanalytics'
  ],
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: 'apple-icon.png' },
      { url: 'apple-icon-57x57.png', sizes: '57x57' },
      { url: 'apple-icon-60x60.png', sizes: '60x60' },
      { url: 'apple-icon-72x72.png', sizes: '72x72' },
      { url: 'apple-icon-76x76.png', sizes: '76x76' },
      { url: 'apple-icon-114x114.png', sizes: '114x114' },
      { url: 'apple-icon-120x120.png', sizes: '120x120' },
      { url: 'apple-icon-144x144.png', sizes: '144x144' },
      { url: 'apple-icon-120x120.png', sizes: '120x120' },
      { url: 'apple-icon-144x144.png', sizes: '144x144' },
      { url: 'apple-icon-152x152.png', sizes: '152x152' },
      { url: 'apple-icon-180x180.png', sizes: '180x180' },
    ]
  },
  manifest: '/manifest.json',
  authors: [{ name: 'CoCoCov', url: 'https://www.moxfield.com/users/cococov' }],
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--display-font',
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
        <Providers>
          <span className={styles.container}>
            <NavBar />
            {children}
            <Footer />
          </span >
        </Providers>
        <Analytics />
      </body>
    </html>
  );
};
