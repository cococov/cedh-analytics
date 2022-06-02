import { useContext } from 'react';
import { CardContext } from '../../contexts';
import Loading from '../loading';
import styles from '../../styles/DeckLists.module.css';

type DeckListsProps = {
  deckLists?: Array<{ cardListName: string, cardListUrl: string }> | any[],
}

const DeckLists: React.FC<DeckListsProps> = ({ deckLists }) => {
  const {
    cardLists,
    isLoading
  } = useContext(CardContext);
  return (
    <span className={styles['container']}>
      <span className={styles['title']}>
        <h3>Deck Lists</h3>
      </span>
      <span className={styles['content']}>
        {isLoading ? <Loading /> : (
          ((!!cardLists && cardLists.length > 0) || (!!deckLists && deckLists?.length > 0)) ? (
            <ul className={(!!deckLists && deckLists?.length > 0) ? styles['card-lists-page'] : styles['card-lists']}>
              {
                ((!!deckLists && deckLists?.length > 0) ? deckLists : cardLists).map(({ cardListName, cardListUrl }) => (
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
