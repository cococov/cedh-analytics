import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../../../shared-metadata';
import { CardInfoPage } from '../../../../components';
import fetchCards from '../../../../utils/fetch/cardData';
/* Static */
import styles from '../../../../styles/CardsList.module.css';
import { server } from '../../../../config';

type occurrencesForCard = { occurrences: number, percentage: number };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };
type CardFace = {
  object: string,
  name: string,
  mana_cost: string,
  type_line: string,
  oracle_text: string,
  colors: string[],
  artist: string,
  artist_id: string,
  illustration_id: string,
  image_uris: { normal: string, large: string }
};

type PageData = {
  cmc: number,
  cardName: string,
  cardType: string,
  cardText: string,
  gathererId: number,
  averagePrice: number,
  isDoubleFace: boolean,
  isReservedList: boolean,
  rarity: string,
  cardImage: string,
  cardFaces: CardFace[],
  colorIdentity: ColorIdentity,
  occurrencesForCard: occurrencesForCard,
  decklists: DeckListsByCommander[],
};

type ErrorData = { notFound: boolean };
type ResponseData = PageData & ErrorData | ErrorData;
type Params = { cardName: string | string[] | undefined, id: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Params,
}): Promise<Metadata> {
  const cardName = decodeURI(String(params.cardName));
  const description = `${cardName} info and usage in cEDH decks from the cEDH database. | ${descriptionMetadata}`;
  const result = await fetchCards(cardName);
  const capitalizedCardName = cardName.split(' ').map((w, i) => {
    if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
    if (w === 'of' || w === 'the' || w === 'from') return w;
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');

  return {
    title: `${capitalizedCardName}`,
    description: description,
    openGraph: {
      ...openGraphMetadata,
      title: `${capitalizedCardName} | cEDH Analytics`,
      images: [
        {
          url: result.error ? '/' : result.cardImage,
          width: 788,
          height: 788,
          alt: `${capitalizedCardName} Image`,
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title: `${capitalizedCardName} | cEDH Analytics`,
      description: description,
      images: {
        url: result.error ? '/' : result.cardImage,
        alt: `${capitalizedCardName} Image`,
      },
    },
  }
};

async function fetchData({ cardName, id }: Params): Promise<ResponseData> {
  if (!cardName) return { notFound: true };

  try {
    const result = await fetchCards(decodeURI(String(cardName)));

    if (result.error) throw new Error('Fetch Error');

    const rawData = await fetch(`${server}/data/tournaments/${id}/cards/competitiveCards.json`);
    const data = await rawData.json();

    const card = (data as any[]).find((current: any) => current['cardName'].toLowerCase() === (cardName as string).toLowerCase());
    const decklists: DeckListsByCommander[] = card?.decklists || [];
    const occurrencesForCard = { occurrences: card?.occurrences || 0, percentage: card?.percentageOfUse || 0 };

    return {
      cardName: result.cardName,
      cardType: result.cardType,
      cmc: result.cmc,
      colorIdentity: result.colorIdentity,
      rarity: result.rarity,
      cardText: result.cardText,
      gathererId: result.gathererId,
      averagePrice: result.averagePrice,
      isDoubleFace: result.isDoubleFace,
      isReservedList: result.isReservedList,
      cardImage: result.cardImage,
      cardFaces: result.cardFaces,
      occurrencesForCard: occurrencesForCard,
      decklists: decklists,
      notFound: false,
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default async function Card({
  params
}: {
  params: Params
}) {
  const response = await fetchData({ cardName: decodeURI(String(params.cardName)), id: decodeURI(String(params.id)) });

  if (response.notFound) notFound();

  const { cardName, cardType, cardText, gathererId, averagePrice, isReservedList, isDoubleFace, cardImage, occurrencesForCard, decklists, cardFaces } = response as PageData;

  return (
    <main className={styles.main}>
      <CardInfoPage
        cardName={cardName}
        cardType={cardType}
        cardText={cardText}
        gathererId={gathererId}
        averagePrice={averagePrice}
        isReservedList={isReservedList}
        isDoubleFace={isDoubleFace}
        cardImage={cardImage}
        occurrencesForCard={occurrencesForCard}
        decklists={decklists}
        cardFaces={cardFaces}
      />
    </main>
  );
};
