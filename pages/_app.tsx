import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    library.add(fab);
    hotjar.initialize(2999875, 6);
  }, []);

  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-DQ9YFFQRG1"
      />
      <Script strategy="lazyOnload">
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
    </>
  );
}
export default MyApp
