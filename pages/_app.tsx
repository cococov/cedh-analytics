import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import '../styles/globals.css';

declare global {
  interface Window {
    gtag: any;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const handleRouteChange = (url: string) => {
    window.gtag('config', 'G-DQ9YFFQRG1', {
      page_path: url,
    });
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    hotjar.initialize(2715865, 6);
  }, []);

  return <Component {...pageProps} />
}
export default MyApp
