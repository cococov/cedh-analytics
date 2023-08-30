
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 1 day
    domains: ['c1.scryfall.com', 'cards.scryfall.io'],
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
  },
});
