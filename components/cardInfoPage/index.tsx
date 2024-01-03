import Image from 'next/image';
/* Vendor */
import { split } from 'ramda';
/* Own */
import ButtonLink from '@components/buttonLink';
import DeckLists from '@components/deckLists';
/* Static */
import styles from '@styles/CardPage.module.css';

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
