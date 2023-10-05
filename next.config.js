/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
});

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 1 day
    domains: ['c1.scryfall.com', 'cards.scryfall.io', 'storage.ko-fi.com'],
  }
});
