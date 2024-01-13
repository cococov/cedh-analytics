import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import CardsTableWithProvider from '@/components/cardsTable/wrapperWithProvider';
import CardInfoWithProvider from '@/components/cardInfo/wrapperWithProvider';
import DeckListsWithProvider from '@/components/deckLists/wrapperWithProvider';
import DbCardsContext, { DbCardsProvider } from '@contexts/dbCardsStore';
/* Static */
import styles from '@styles/CardsList.module.css';

export const metadata: Metadata = {
  title: 'DB Cards',
  description: `Cards used in cEDH database's decklists. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'DB Cards | cEDH Analytics',
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
    title: `DB Cards | ${twitterMetadata.title}`,
    description: `Cards used in cEDH database's decklists. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search_og.jpg',
      alt: 'Frantic Search',
    },
  },
};

export default async function Cards() {
  return (
    <main className={styles.main}>
      <DbCardsProvider>
        <span className={styles.leftSpan}>
          <DeckListsWithProvider size="medium" context={DbCardsContext} />
        </span>
        <span className={styles.commandersContainer}>
          <CardsTableWithProvider
            title="DB Cards"
            table="db_cards"
            context={DbCardsContext}
            cardUrlBase="/db-cards"
            withUrlPArams
          />
        </span>
        <CardInfoWithProvider context={DbCardsContext} />
      </DbCardsProvider>
    </main>
  );
};
