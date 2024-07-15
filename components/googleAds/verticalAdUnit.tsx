"use client";

import React, { useEffect } from 'react';

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
    <span className="hidden md:block min-w-64 mt-2 mb-2">
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1605287259025910"
        data-ad-slot="4002395278"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </span>
  );
}
