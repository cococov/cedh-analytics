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

export default function VerticalAdUnit() {

  useEffect(() => {
    initAd();
  });

  return (
    <span
      className={concat(
        'hidden md:block min-w-64 mt-2 mb-2',
        isDevEnv ? ' bg-orange-300' : ''
      )}
    >
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1605287259025910"
        data-ad-slot="4002395278"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </span>
  );
}
