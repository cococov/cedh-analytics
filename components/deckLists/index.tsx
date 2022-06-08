import Loading from '../loading';
import styles from '../../styles/DeckLists.module.css';

type occurrencesForCard = { occurrences: number, persentaje: number };
type DeckList = { cardListName: string, cardListUrl: string };
type DeckListsProps = {
  occurrencesForCard: occurrencesForCard,
  isLoading?: boolean,
  deckLists: DeckList[],
};

const DeckLists: React.FC<DeckListsProps> = ({ occurrencesForCard, isLoading = false, deckLists }) => {
  return (
    <span className={styles['container']}>
      <span className={styles['title']}>
        <h3>Deck Lists</h3>
        {occurrencesForCard.occurrences > 0 && (
          <span className={styles['use']}>
            <span>{occurrencesForCard.occurrences} {occurrencesForCard.occurrences === 1 ? 'Deck' : 'Decks'}</span>
            <span>~</span>
            <span>{occurrencesForCard.persentaje} %</span>
          </span>
        )}
      </span>
      <span className={styles['content']}>
        {isLoading ? <Loading /> : (
          (!!deckLists && deckLists?.length > 0) ? (
            <ul className={(!!deckLists && deckLists?.length > 0) ? styles['card-lists-page'] : styles['card-lists']}>
              {
                deckLists.map(({ cardListName, cardListUrl }) => (
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
