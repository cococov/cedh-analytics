/* Own */
import CardsTableWithProvider from '../cardsTable/wrapperWithProvider';
import CardsTable from '../cardsTable';
/* Static */
import styles from '../../styles/CardsList.module.css';

async function getData(cardsURL: string, tagsByCardURL: string, commander?: string) {
  const rawCards = await fetch(cardsURL, { cache: 'no-store' });
  const cards = await rawCards.json();
  const rawTagsByCard = await fetch(tagsByCardURL);
  const tagsByCard = await rawTagsByCard.json();

  return {
    cards: !!commander ? cards[commander] : cards,
    tagsByCard,
  };
}

export default async function AsyncCardsTable({
  title,
  cardsURL,
  tagsByCardURL,
  context,
  commander,
  fromMetagame,
  noInfo,
}: {
  title?: string,
  cardsURL: string,
  tagsByCardURL: string,
  context?: any,
  commander?: string,
  fromMetagame?: boolean,
  noInfo?: boolean,
}) {
  const { cards, tagsByCard } = await getData(cardsURL, tagsByCardURL, commander);

  return (
    <span className={styles.commandersContainer}>
      {
        context ? (
          <CardsTableWithProvider
            title={title || "DB Cards"}
            cards={cards}
            tagsByCard={tagsByCard}
            context={context}
            cardUrlBase="/metagame-cards"
            fromMetagame={fromMetagame}
            noInfo={noInfo}
          />
        ) : (
          <CardsTable
            title={title || "DB Cards"}
            cards={cards}
            tagsByCard={tagsByCard}
            cardUrlBase="/metagame-cards"
            fromMetagame={fromMetagame}
            noInfo={noInfo}
          />
        )
      }
    </span>
  );
};
