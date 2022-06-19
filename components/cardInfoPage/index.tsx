import Image from 'next/image';
import styles from '../../styles/CardPage.module.css';
import { split } from 'ramda';
import ButtonLink from '../buttonLink';
import DeckLists from '../deckLists';

type occurrencesForCard = { occurrences: number, persentaje: number };
type Commander = { name: string, color_identity: ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[] };
type DeckList = { name: string, url: string, commanders: Commander[] };
type CardProps = {
  cardName: string,
  cardType: string,
  cardText: string,
  gathererId: number,
  averagePrice: number,
  isReservedList: boolean,
  cardImage: string,
  occurrencesForCard: occurrencesForCard,
  decklists: DeckList[],
}

const CardInfoPage: React.FC<CardProps> = ({ cardName, cardType, cardText, gathererId, averagePrice, isReservedList, cardImage, occurrencesForCard, decklists }: CardProps) => (
  <span className={styles['card-info-container']}>
    <h1 className={styles['card-name']}>{cardName || 'Card Name'}</h1>
    {isReservedList &&
      <h2 className={styles['card-reserved-list']}> Reserved List</h2>
    }
    <span className={styles['card-info']}>
      <section>
        <Image src={cardImage} alt={`${cardName} image`} placeholder="blur" blurDataURL="/images/mtg-back.jpg" width={256} height={366} priority />
      </section>
      <section className={styles['card-text-container']}>
        <h3>{cardType || 'Type'}</h3>
        <p className={styles['card-text']} >
          {split('--DIVIDE--', cardText)[0] || 'Oracle text.'}
        </p>
        {split('--DIVIDE--', cardText).length > 1 && (
          <p className={styles['card-text']} >
            {split('--DIVIDE--', cardText)[1] || 'Oracle text.'}
          </p>
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

export default CardInfoPage;