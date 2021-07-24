import { useContext } from 'react';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import Tooltip from '@material-ui/core/Tooltip';
import { CardContext } from '../../contexts';
import Loading from '../loading';
import { split } from 'rambda';


const CardInfo: React.FC = () => {
  const {
    selectedCard,
    cardImage,
    cardType,
    cardText,
    averagePrice,
    gathererId,
    isReservedList,
    isLoading
  } = useContext(CardContext);
  return (
    <span className={styles['card-info-container']}>
      <span className={styles['card-info']}>
        <span className={styles['card-image']}>
          <Image src={cardImage || '/images/mtg-back.jpg'} alt={`${selectedCard} image`} width={256} height={366} />
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
                <a
                  className={styles['card-gatherer']}
                  rel="author noopener noreferrer"
                  target="_blank"
                  href={`https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${gathererId}`}
                >
                  Gatherer
                </a>
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