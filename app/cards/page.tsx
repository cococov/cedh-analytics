import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../shared-metadata';
import { CardsTableWithProvider, CardInfoWithProvider, DeckListsWithProvider } from '../../components';
import DbCardsContext, { DbCardsProvider } from '../../contexts/dbCardsStore';
/* Static */
import styles from '../../styles/CardsList.module.css';
import DATA from '../../public/data/cards/competitiveCards.json';
import TAGS_BY_CARD from '../../public/data/cards/tags.json';

type CardProps = any; // TODO: define type

export const metadata: Metadata = {
  title: 'cEDH Glossary',
  description: `List of the most used concepts in cEDH and their meaning. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'cEDH Glossary | cEDH Analytics',
    images: [
      {
        url: '/images/frantic_search.jpg',
        width: 788,
        height: 788,
        alt: 'Frantic Search',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `About | ${twitterMetadata.title}`,
    description: `List of the most used concepts in cEDH and their meaning. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search.jpg',
      alt: 'Frantic Search',
    },
  },
};

const fetchData = async () => {
  return {
    cards: DATA as CardProps[],
    tagsByCard: TAGS_BY_CARD,
  };
};

export default async function Cards() {
  const { cards, tagsByCard } = await fetchData();
  return (
    <main className={styles.main}>
      <DbCardsProvider cards={cards}>
        <span className={styles['left-span']}>
          <DeckListsWithProvider size="medium" context={DbCardsContext} />
        </span>
        <CardsTableWithProvider
          title="DB Cards"
          cards={cards}
          tagsByCard={tagsByCard}
          context={DbCardsContext}
        />
        <CardInfoWithProvider context={DbCardsContext} />
      </DbCardsProvider>
    </main>
  );
};
