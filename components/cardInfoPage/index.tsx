import Image from 'next/image';
import styles from '../../styles/CardPage.module.css';
import { split } from 'rambda';
import ButtonLink from '../buttonLink';


type CardProps = {
  cardName: string,
  cardType: string,
  cardText: string,
  gathererId: number,
  averagePrice: number,
  isReservedList: boolean,
  cardImage: string,
}

const CardInfoPage: React.FC<CardProps> = ({ cardName, cardType, cardText, gathererId, averagePrice, isReservedList, cardImage }: CardProps) => (
  <span className={styles['card-info-container']}>
    <span className={styles['home-button-container']}>
      <ButtonLink variant="contained" color="primary" href="/">
        Home
      </ButtonLink>
    </span>
    <h1 className={styles['card-name']}>{cardName || 'Card Name'}</h1>
    {isReservedList &&
      <h2 className={styles['card-reserved-list']}> Reserved List</h2>
    }
    <span className={styles['card-info']}>
      <span>
        <Image src={cardImage || '/mtg-back.jpg'} alt={`${cardName} image`} width={256} height={366} />
      </span>
      < span className={styles['card-text-container']}>
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
        <ButtonLink variant="contained" color="primary" href={`https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${gathererId}`}>
          Gatherer
        </ButtonLink>
      </span>
    </span>
  </span >
)

export default CardInfoPage;