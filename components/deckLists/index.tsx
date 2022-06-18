import Loading from '../loading';
import styles from '../../styles/DeckLists.module.css';

type occurrencesForCard = { occurrences: number, persentaje: number };
type DeckList = { name: string, url: string };
type DeckListsProps = {
  occurrencesForCard: occurrencesForCard,
  isLoading?: boolean,
  decklists: DeckList[],
};

const DeckLists: React.FC<DeckListsProps> = ({ occurrencesForCard, isLoading = false, decklists }) => {
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
          (!!decklists && decklists?.length > 0) ? (
            <ul className={(!!decklists && decklists?.length > 0) ? styles['card-lists-page'] : styles['card-lists']}>
              {
                decklists.map(({ name, url }) => (
                  <a
                    key={`card-list-${url}`}
                    rel="author noopener noreferrer"
                    target="_blank"
                    href={url}
                  >
                    <li
                      key={`li-card-list-${url}`}
                      className={styles['card-list']}
                    >
                      {name}
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
