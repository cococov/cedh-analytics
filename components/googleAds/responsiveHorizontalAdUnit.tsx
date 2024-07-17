"use client";

import React, { useEffect } from 'react';
import { concat } from 'ramda';

const isDevEnv = process.env.NODE_ENV !== 'production';

const initAd = () => {
  try {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  } catch (error: any) {
    console.log(error.message);
  }
};

export default function HorizontalAdUnit() {

  useEffect(() => {
    initAd();
  });

  return (
    <span
      className={concat(
        'block md:hidden min-w-32 mb-2 self-center',
        isDevEnv ? ' bg-orange-300' : ''
      )}
    >
      <ins className="adsbygoogle"
        style={{ display: 'block', height: '90px', width: '728px' }}
        data-ad-client="ca-pub-1605287259025910"
        data-ad-slot="5519668683"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </span>
  );
}
