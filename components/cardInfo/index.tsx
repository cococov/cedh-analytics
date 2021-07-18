import { useContext } from 'react';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import { CardContext } from '../../contexts';
import Loading from '../loading';


const CardInfo: React.FC = () => {
  const { selectedCard, cardImage, cardType, cardText, averagePrice, gathererId, isLoading } = useContext(CardContext);
  return (
    <span className={styles['card-info-container']}>
      <span className={styles['card-info']}>
        <span className={styles['card-image']}>
          <Image src={cardImage || '/mtg-back.jpg'} alt={`${selectedCard} image`} width={256} height={366} />
        </span>
        {
          isLoading ? <Loading /> : (
            !!selectedCard ? (
              < span className={styles['card-text-container']}>
                <h2 className={styles['card-name']}>{selectedCard || 'Card Name'}</h2>
                <h3 className={styles['card-type']}>{cardType || 'Type'}</h3>
                <p className={styles['card-text']} >
                  {cardText || 'Oracle text.'}
                </p>
                <p><b>Average Price: </b>${averagePrice}</p>
                <a
                  className={styles['card-gatherer']}
                  rel="author noopener noreferrer"
                  target="_blank"
                  href={`https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${gathererId}`}
                >
                  Gatherer
                </a>
              </span>
            ) : <h2 className={styles['no-card-selected']} >NO CARD SELECTED</h2>
          )
        }
      </span>
    </span >
  )
}

export default CardInfo;