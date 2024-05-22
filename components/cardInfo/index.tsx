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
import { MaterialTooltip } from '@/components/vendor/materialUi';
import { CircularProgress } from '@nextui-org/react';
/* Static */
import styles from '@/styles/CardsList.module.css';
import CardBack from '@/public/images/mtg-back.jpg';


type CardData = {
  cardImage: string,
  cardType: string,
  cardText: string,
  averagePrice: number,
  gathererId: number,
  cardFaces: { type_line: string }[],
  isDoubleFace: boolean,
  isReservedList: boolean,
};

export default function CardInfo({
  selectedCard,
  isLoading,
  cardData: {
    cardImage,
    cardType,
    cardText,
    averagePrice,
    gathererId,
    cardFaces,
    isReservedList,
    isDoubleFace,
  }
}: {
  selectedCard: string,
  isLoading: boolean,
  cardData: CardData,
}) {
  return (
    <span className={styles.cardInfoContainer}>
      <span className={styles.cardInfo}>
        <span className={styles.cardImage}>
          {(!!!selectedCard || isLoading) ? (
            <Image src={CardBack} alt="Card placeholder" width={256} height={366} placeholder="blur" priority />
          ) : (
            <Image src={cardImage} alt={`${selectedCard} image`} width={256} height={366} placeholder="blur" blurDataURL="/images/mtg-back.jpg" priority />
          )}
        </span>
        {
          isLoading ? (
            <span className={styles.cardTextContainerLoading}>
              <CircularProgress size="lg" color="secondary" aria-label="Loading..." />
            </span>
          ) : (
            !!selectedCard ? (
              <span className={styles.cardTextContainer}>
                <h2 className={styles.cardName}>{selectedCard || 'Card Name'}</h2>
                <h3 className={styles.cardType}>{cardType || 'Type'}</h3>
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
                {!!gathererId ? (
                  <a
                    className={styles.cardGatherer}
                    rel="author noopener noreferrer"
                    target="_blank"
                    href={`https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${gathererId}`}
                  >
                    Gatherer
                  </a>) : (
                  <span className={styles.cardGathererDisabled} title="Has no gatherer.">
                    Gatherer
                  </span>
                )}
                <span className={styles.cardReservedListContainer}>
                  {isReservedList &&
                    <MaterialTooltip
                      title="Reserved List"
                      aria-label="Reserved List"
                    >
                      <span className={styles.cardReservedList}>💎</span>
                    </MaterialTooltip>
                  }
                </span>
              </span>
            ) : (<span className={styles.cardTextContainerNoCardSelected}><h2 className={styles.noCardSelected} >NO CARD SELECTED</h2></span>)
          )
        }
      </span>
    </span >
  );
};
