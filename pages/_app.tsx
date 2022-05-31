import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    hotjar.initialize(2715865, 6);
  }, []);

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DQ9YFFQRG1"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DQ9YFFQRG1');
          `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
export default MyApp
