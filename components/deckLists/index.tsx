import Image from 'next/image';
/* Vendor */
import { CircularProgress } from '@nextui-org/react';
/* Static */
import styles from '@/styles/DeckLists.module.css';
import B from '@/public/images/B.png';
import G from '@/public/images/G.png';
import R from '@/public/images/R.png';
import U from '@/public/images/U.png';
import W from '@/public/images/W.png';
import C from '@/public/images/C.png';

const IDENTITY_COLORS = { B: B, G: G, R: R, U: U, W: W, C: C };

type occurrencesForCard = { occurrences: number, percentage: number };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };

export default function DeckLists({
  occurrencesForCard,
  isLoading = false,
  decklists,
  size
}: {
  occurrencesForCard: occurrencesForCard,
  isLoading?: boolean,
  decklists: DeckListsByCommander[],
  size: 'small' | 'medium' | 'large',
}) {
  const getIdentityImages = (colorIdentity: ColorIdentity) => {
    return (
      <span className={styles.identityGroup}>
        {
          colorIdentity.map(color => (
            <Image src={IDENTITY_COLORS[color]} alt={color} width={18} height={18} priority key={color} />
          ))
        }
      </span>
    );
  };

  return (
    <span className={styles.container}>
      <span className={styles.title}>
        <h3>Deck Lists</h3>
        {occurrencesForCard.occurrences > 0 && (
          <span className={styles.use}>
            <span>{occurrencesForCard.occurrences} {occurrencesForCard.occurrences === 1 ? 'Deck' : 'Decks'}</span>
            <span>~</span>
            <span>{occurrencesForCard.percentage} %</span>
          </span>
        )}
      </span>
      <span className={`${styles.content} ${styles[`content${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
        {isLoading ? (
          <span className={styles.cardTextContainerLoading}>
            <CircularProgress size="lg" color="secondary" aria-label="Loading..." />
          </span>
        ) : (
          (!!decklists && decklists?.length > 0) ? (
            decklists.map(({ commanders, decks, colorIdentity }) => (
              <details key={`${commanders}-details`}>
                <summary className={styles.commander} key={`${commanders}-summary`}>
                  {getIdentityImages(colorIdentity)}
                  <span key={`${commanders}-name`}>{commanders}</span>
                </summary>
                <ul className={styles.cardLists} key={`${commanders}-decklists`}>
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
                          className={styles.cardList}
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
            <h2 className={styles.noCardSelected}>NO CARD SELECTED</h2>
        )}
      </span>
    </span>
  );
};
