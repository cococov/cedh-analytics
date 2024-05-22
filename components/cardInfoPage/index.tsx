/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2021-present CoCoCov
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

import Image from 'next/image';
/* Vendor */
import { split } from 'ramda';
/* Own */
import ButtonLink from '@/components/buttonLink';
import DeckLists from '@/components/deckLists';
/* Static */
import styles from '@/styles/CardPage.module.css';

type occurrencesForCard = { occurrences: number, percentage: number };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };

export default function CardInfoPage({
  cardName,
  cardType,
  cardText,
  gathererId,
  averagePrice,
  cardFaces,
  isReservedList,
  isDoubleFace,
  cardImage,
  occurrencesForCard,
  decklists
}: {
  cardName: string,
  cardType: string,
  cardText: string,
  gathererId: number,
  averagePrice: number,
  cardFaces: { type_line: string }[],
  isReservedList: boolean,
  isDoubleFace: boolean,
  cardImage: string,
  occurrencesForCard: occurrencesForCard,
  decklists: DeckListsByCommander[],
}) {
  return (
    <span className={styles.cardInfoContainer}>
      <h1 className={styles.cardName}>{cardName || 'Card Name'}</h1>
      {isReservedList &&
        <h2 className={styles.cardReservedList}> Reserved List</h2>
      }
      <span className={styles.cardInfo}>
        <section>
          <Image src={cardImage} alt={`${cardName} image`} placeholder="blur" blurDataURL="/images/mtg-back.jpg" width={256} height={366} priority />
        </section>
        <section className={styles.cardTextContainer}>
          <h3>{cardType || 'Type'}</h3>
          <p className={styles.cardText} >
            {split('--DIVIDE--', cardText)[0] || 'Oracle text.'}
          </p>
          {isDoubleFace && (
            <>
              <h3 className={styles.cardType}>{cardFaces[1]['type_line'] || 'Type'}</h3>
              <p className={styles.cardText} >
                {split('--DIVIDE--', cardText)[1] || 'Oracle text.'}
              </p>
            </>
          )}
          <p>
            <b>Average Price: </b>${averagePrice || 'NO_DATA'}
          </p>
          <ButtonLink variant="contained" color="primary" href={`https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${gathererId}`} disabled={!!!gathererId}>
            Gatherer
          </ButtonLink>
        </section>
        <DeckLists occurrencesForCard={occurrencesForCard} decklists={decklists} size="small" />
      </span>
    </span >
  );
};
