
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 1 day
    domains: ['c1.scryfall.com'],
  },
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
}
