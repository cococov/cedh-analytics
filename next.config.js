/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const isDockerBuild = process.env.DOCKER_BUILD === 'true';
const withPWA = !isDockerBuild ? require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
}) : config => config;

module.exports = withPWA({
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 1 day
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'c1.scryfall.com',
      },
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
      },
      {
        protocol: 'https',
        hostname: 'storage.ko-fi.com',
      },
    ]
  }
});
