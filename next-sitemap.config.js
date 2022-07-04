/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.cedh-analytics.com',
  generateRobotsTxt: true,
  // ...other options
};