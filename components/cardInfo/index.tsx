import Image from 'next/image';
import styles from '../../styles/CardsList.module.css';
import Tooltip from '@material-ui/core/Tooltip';
import Loading from '../loading';
import { split } from 'ramda';
import CardBack from '../../public/images/mtg-back.jpg';


type CardData = {
  cardImage: string,
  cardType: string,
  cardText: string,
  averagePrice: number,
  gathererId: number,
  isReservedList: boolean,
};

type CardInfoProps = {
  selectedCard: string,
  isLoading: boolean,
  cardData: CardData,
};

const CardInfo: React.FC<CardInfoProps> = ({
  selectedCard,
  isLoading,
  cardData: {
    cardImage,
    cardType,
    cardText,
    averagePrice,
    gathererId,
    isReservedList,
  }
}) => {
  return (
    <span className={styles['card-info-container']}>
      <span className={styles['card-info']}>
        <span className={styles['card-image']}>
          {(!!!selectedCard || isLoading) ? (
            <Image src={CardBack} alt={`${selectedCard} image`} width={256} height={366} placeholder="blur" priority />
          ) : (
            <Image src={cardImage || CardBack} alt={`${selectedCard} image`} width={256} height={366} placeholder="blur" blurDataURL="/images/mtg-back.jpg" priority />
          )}
        </span>
        {
          isLoading ? <Loading /> : (
            !!selectedCard ? (
              < span className={styles['card-text-container']}>
                <h2 className={styles['card-name']}>{selectedCard || 'Card Name'}</h2>
                <h3 className={styles['card-type']}>{cardType || 'Type'}</h3>
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
                {!!gathererId ? (
                  <a
                    className={styles['card-gatherer']}
                    rel="author noopener noreferrer"
                    target="_blank"
                    href={`https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${gathererId}`}
                  >
                    Gatherer
                  </a>) : (
                  <span className={styles['card-gatherer-disabled']} title="Has no gatherer.">
                    Gatherer
                  </span>
                )}
                <span className={styles['card-reserved-list-container']}>
                  {isReservedList &&
                    <Tooltip
                      title="Reserved List"
                      aria-label="Reserved List"
                    >
                      <span className={styles['card-reserved-list']}>💎</span>
                    </Tooltip>
                  }
                </span>
              </span>
            ) : <h2 className={styles['no-card-selected']} >NO CARD SELECTED</h2>
          )
        }
      </span>
    </span >
  )
}

export default CardInfo;