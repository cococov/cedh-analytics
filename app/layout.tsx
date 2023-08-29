import Script from 'next/script';
import { useEffect } from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {

  useEffect(() => {
    library.add(fab);
  }, []);

  return (
    <html lang="en">
      <body>
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
        {children}
        <Analytics />
      </body>
    </html>
  );
};
