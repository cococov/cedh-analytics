import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../shared-metadata';
import { CardsTableWithProvider, CardInfoWithProvider, DeckListsWithProvider } from '../../components';
import MetagameCardsContext, { MetagameCardsProvider } from '../../contexts/metagameCardsStore';
/* Static */
import styles from '../../styles/CardsList.module.css';

export const metadata: Metadata = {
  title: 'Metagame Cards',
  description: `Cards used in metagame decklists. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'Metagame Cards | cEDH Analytics',
    images: [
      {
        url: '/images/frantic_search_og.jpg',
        width: 788,
        height: 788,
        alt: 'Frantic Search',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `Metagame Cards | ${twitterMetadata.title}`,
    description: `Cards used in metagame decklists. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search_og.jpg',
      alt: 'Frantic Search',
    },
  },
};

export default async function MetagameCards() {
  return (
    <main className={styles.main}>
      <MetagameCardsProvider>
        <span className={styles.leftSpan}>
          <DeckListsWithProvider size="medium" context={MetagameCardsContext} />
        </span>
        <span className={styles.commandersContainer}>
          <CardsTableWithProvider
            title="Metagame Cards"
            table="metagame_cards"
            context={MetagameCardsContext}
            cardUrlBase="/metagame-cards"
            fromMetagame
            withUrlPArams
          />
        </span>
        <CardInfoWithProvider context={MetagameCardsContext} />
      </MetagameCardsProvider>
    </main >
  );
};
