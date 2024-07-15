"use client";

import React, { useEffect } from 'react';

const initAd = () => {
  // @ts-ignore
  (window.adsbygoogle = window.adsbygoogle || []).push({});
};

export default function VerticalAdUnit() {

  useEffect(() => {
    initAd();
  });

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-1605287259025910"
      data-ad-slot="7191665390"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
}
