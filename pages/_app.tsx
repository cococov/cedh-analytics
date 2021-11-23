import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    hotjar.initialize(2715865, 6);
  }, []);

  return <Component {...pageProps} />
}
export default MyApp
