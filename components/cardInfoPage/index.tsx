import { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../../styles/Home.module.css';
import { CardContext } from '../../contexts';
import { split } from 'rambda';
import Loading from '../loading';
import ButtonLink from '../buttonLink';


const CardInfoPage: React.FC<{ name: string }> = ({ name }) => {
  const router = useRouter();
  const isLoadingRef = useRef(false);
  const {
    selectedCard,
    cardImage,
    cardType,
    cardText,
    averagePrice,
    gathererId,
    isReservedList,
    isLoading,
    handleChangeCard,
  } = useContext(CardContext);

  useEffect(() => {
    handleChangeCard(name);
  })

  useEffect(() => {
    if (isLoadingRef.current) {
      if (!isLoading && !selectedCard) {
        router.push('/404');
      }
      isLoadingRef.current = isLoading;
    }
  }, [isLoading]);

  return (
    <span className={styles['card-info-container']}>
      <span className={styles['card-info']}>
        <span className={styles['card-image']}>
          <Image src={cardImage || '/mtg-back.jpg'} alt={`${selectedCard} image`} width={256} height={366} />
        </span>
        {
          isLoading ? <Loading /> : (
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
          )
        }
      </span>
      <ButtonLink variant="contained" color="primary" href="/">
        ⬅ Home
      </ButtonLink>
    </span >
  )
}

export default CardInfoPage;