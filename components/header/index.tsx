import Head from 'next/head';

const Header: React.FC<{
  title: string | string[] | undefined,
  description: string | undefined
}> = ({ title, description }) => {
  return (
    <Head>
      <title>{!!title ? `${title} | ` : ''} cEDH Analytics</title>
      <meta name="description" content={`${!!description ? `${description} | ` : ''} cEDH Analytics is a website that analyzes and cross-references several EDH community's resources to give insights on the competitive metagame.`} />
      <meta property="og:image" content="https://www.cedh-analytics.com/images/carrot_compost_white.png" />
      <meta property="og:image:secure_url" content="https://www.cedh-analytics.com/images/carrot_compost_white.png" />
      <meta property="og:site_name" content="cEDH Analytics" />
      <meta property="og:title" content={`${!!title ? `${title} | ` : ''} cEDH Analytics`} />
      <meta property="og:url" content="https://cedh-analytics.com/" />
      <meta property="og:description" content={`${!!description ? `${description} | ` : ''} cEDH Analytics is a website that analyzes and cross-references several EDH community's resources to give insights on the competitive metagame.`} />
      <meta property="og:type" content="website" />
      <meta property="og:image:width" content="788" />
      <meta property="og:image:height" content="788" />
      <meta property="og:updated_time" content="2022-06-13" />
      <meta itemProp="name" content={`${!!title ? `${title} | ` : ''} cEDH Analytics`} />
      <meta itemProp="url" content="https://cedh-analytics.com/" />
      <meta itemProp="description" content={`${!!description ? `${description} | ` : ''} cEDH Analytics is a website that analyzes and cross-references several EDH community's resources to give insights on the competitive metagame.`} />
      <meta itemProp="image" content="https://www.cedh-analytics.com/images/carrot_compost_white.png" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@CoCoCov" />
      <meta name="twitter:creator" content="@CoCoCov" />
      <meta name="twitter:title" content={`${!!title ? `${title} | ` : ''} cEDH Analytics`} />
      <meta name="twitter:description" content={`${!!description ? `${description} | ` : ''} cEDH Analytics is a website that analyzes and cross-references several EDH community's resources to give insights on the competitive metagame.`} />
      <meta name="twitter:image" content="https://www.cedh-analytics.com/images/carrot_compost_white.png" />
      <meta name="twitter:image:alt" content="Carrot Compost Logo" />
      <meta name="twitter:url" content="https://cedh-analytics.com/" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="keywords" content="cedh, cEDH, Magic, Gathering, MagicTheGathering, magicthegathering, magic, guide, stats, mtg, edh, commander, magic, tier, list, tierlist, decks, decklists, database, competitive, cedhguide, cedhanalytics" />
      <meta name="author" content="CoCoCov"></meta>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300&display=swap" rel="stylesheet" />
    </Head>
  )
}

export default Header;
