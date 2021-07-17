import Image from 'next/image';
import styles from '../../styles/Home.module.css';

const CardInfo: React.FC = () => {
  return (
    <span className={styles['card-info-container']}>
      <span className={styles['card-info']}>
        <span className={styles['card-image']}>
          <Image src="/mtg-back.jpg" alt="Carrot Compost logo" width={256} height={366} />
        </span>
        <span className={styles['card-text']}>
          <h1>Card Name</h1>
          <h3>Type</h3>
          <p>
            Oracle text.
          </p>
        </span>
      </span>
    </span>
  )
}

export default CardInfo;