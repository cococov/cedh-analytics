import { useState, useEffect } from 'react';
import Image from 'next/image';
import { groupBy, join, map, sort, sortBy, reduce, union, prop, equals, split } from 'ramda';
import Loading from '../loading';
import styles from '../../styles/DeckLists.module.css';
import B from '../../public/images/B.png';
import G from '../../public/images/G.png';
import R from '../../public/images/R.png';
import U from '../../public/images/U.png';
import W from '../../public/images/W.png';
import C from '../../public/images/C.png';

const IDENTITY_COLORS = { B: B, G: G, R: R, U: U, W: W, C: C };

type occurrencesForCard = { occurrences: number, persentaje: number };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommanderArrItem = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };
type DeckListsByCommanderArr = DeckListsByCommanderArrItem[];
type DeckListsProps = {
  occurrencesForCard: occurrencesForCard,
  isLoading?: boolean,
  decklists: DeckList[],
  size: 'small' | 'medium' | 'large',
};

const DeckLists: React.FC<DeckListsProps> = ({ occurrencesForCard, isLoading = false, decklists, size }) => {
  const [deckListsByCommander, setDeckListsByCommander] = useState<DeckListsByCommanderArr>([]);

  useEffect(() => {
    const groupedDecklists = groupBy(decklist => join(' | ', map(c => split(',', c.name)[0], decklist.commanders)), decklists);
    const groupeddeckListsByCommander = map(o => {
      const decks = groupedDecklists[o];
      const colorIdentity = reduce<ColorIdentity, ColorIdentity>(union, [], map((c: Commander) => c.color_identity, decks[0].commanders));
      return { commanders: o, decks, colorIdentity }
    }, Object.keys(groupedDecklists));
    const alfabeticalSorted = sortBy(prop('commanders'), groupeddeckListsByCommander);
    const sortedByIdentity = sort((a: DeckListsByCommanderArrItem, b: DeckListsByCommanderArrItem) => {
      if (equals(a.colorIdentity, b.colorIdentity)) {
        return 0;
      }
      return a.colorIdentity.length > b.colorIdentity.length ? 1 : -1;
    }, alfabeticalSorted);

    setDeckListsByCommander(sortedByIdentity);
  }, [decklists]);

  const getIdentityImages = (colorIdentity: ColorIdentity) => {
    return (
      <span className={styles['identityGroup']}>
        {
          colorIdentity.map(color => (
            <Image src={IDENTITY_COLORS[color]} alt={color} width={18} height={18} priority />
          ))
        }
      </span>
    );
  };

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
      <span className={`${styles['content']} ${styles[`content-${size}`]}`}>
        {isLoading ? <Loading /> : (
          (!!decklists && decklists?.length > 0) ? (
            deckListsByCommander.map(({ commanders, decks, colorIdentity }) => (
              <details>
                <summary className={styles['commander']}>
                  {getIdentityImages(colorIdentity)}
                  <span>{commanders}</span>
                  </summary>
                <ul className={styles['card-lists']}>
                  {
                    decks.map(({ name, url }) => (
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
              </details>
            ))
          ) :
            < h2 className={styles['no-card-selected']} >NO CARD SELECTED</h2>
        )}
      </span>
    </span >
  )
}

export default DeckLists
