import { useContext } from 'react';
import { CardContext } from '../../contexts';
import Loading from '../loading';
import styles from '../../styles/DeckLists.module.css';

const DeckLists = () => {
  const {
    cardLists,
    isLoading
  } = useContext(CardContext);
  return (
    <span className={styles['container']}>
      <span className={styles['title']}>
        <h2>Deck Lists</h2>
      </span>
      <span className={styles['content']}>
        {isLoading ? <Loading /> : (
          (!!cardLists && cardLists.length > 0) ? (
            <ul className={styles['card-lists']}>
              {
                cardLists.map(({ cardListName, cardListUrl }) => (
                  <a
                    key={`card-list-${cardListUrl}`}
                    rel="author noopener noreferrer"
                    target="_blank"
                    href={cardListUrl}
                  >
                    <li
                      key={`li-card-list-${cardListUrl}`}
                      className={styles['card-list']}
                    >
                      {cardListName}
                    </li>
                  </a>
                ))
              }
            </ul>
          ) :
            < h2 className={styles['no-card-selected']} >NO CARD SELECTED</h2>
        )}
      </span>
    </span >
  )
}

export default DeckLists
