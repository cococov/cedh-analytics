/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
/* Vendor */
import { replace, pipe } from 'ramda';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import CardInfoPage from '@/components/cardInfoPage';
import fetchCards from '@/utils/fetch/cardData';
import getDecklistsForCardByContext from '@/utils/fetch/getDecklistsForCardByContext';
/* Static */
import styles from '@/styles/CardsList.module.css';

type occurrencesForCard = { occurrences: number, percentage: number };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[];
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };
type CardFace = {
  object: string;
  name: string;
  mana_cost: string;
  type_line: string;
  oracle_text: string;
  colors: string[];
  artist: string;
  artist_id: string;
  illustration_id: string;
  image_uris: { normal: string, large: string };
};

type ErrorData = { notFound: boolean };

type PageData = {
  cmc: number;
  cardName: string;
  cardType: string;
  cardText: string;
  gathererId: number;
  averagePrice: number;
  isDoubleFace: boolean;
  isReservedList: boolean;
  rarity: string;
  cardImage: string;
  cardFaces: CardFace[];
  colorIdentity: ColorIdentity;
  occurrencesForCard: occurrencesForCard;
  decklists: DeckListsByCommander[];
};

type ResponseData = PageData & ErrorData | ErrorData;
type Params = { cardName: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>,
}): Promise<Metadata> {
  const { cardName } = await params;
  const decodedCardName = replace(/%2C/, ',', decodeURI(String(cardName)));
  const description = `${decodedCardName} info and usage in cEDH decks from the cEDH database. | ${descriptionMetadata}`;
  const result = await fetchCards(decodedCardName);
  const capitalizedCardName = decodedCardName.split(' ').map((w, i) => {
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
      description: description,
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

async function fetchData({ cardName }: Params): Promise<ResponseData> {
  if (!cardName) return { notFound: true };

  try {
    const result = await fetchCards(String(cardName));

    if (result.error) throw new Error('Fetch Error');

    const decodedCardName = pipe(
      String,
      decodeURI,
      replace(/%2F/g, '/'),
      replace(/%2C/, ','),
    )(cardName);

    const { occurrences, percentage, decklists } = await getDecklistsForCardByContext(decodedCardName, 'db_cards');

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
      occurrencesForCard: { occurrences, percentage },
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
  params: Promise<Params>
}) {
  const { cardName } = await params;
  const response = await fetchData({ cardName: replace(/%2C/, ',', decodeURI(String(cardName))) });
  if (response.notFound) notFound();

  const data = response as PageData;

  return (
    <main className={styles.main}>
      <CardInfoPage
        cardName={data.cardName}
        cardType={data.cardType}
        cardText={data.cardText}
        gathererId={data.gathererId}
        averagePrice={data.averagePrice}
        isDoubleFace={data.isDoubleFace}
        isReservedList={data.isReservedList}
        cardImage={data.cardImage}
        occurrencesForCard={data.occurrencesForCard}
        decklists={data.decklists}
        cardFaces={data.cardFaces}
      />
    </main>
  );
};
