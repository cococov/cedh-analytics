import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect } from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

const MyApp = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    library.add(fab);
  }, []);

  return (
    <>
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
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
