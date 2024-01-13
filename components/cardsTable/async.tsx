/* Own */
import CardsTableWithProvider from './wrapperWithProvider';
import CardsTable from './index';
/* Static */
import styles from '@/styles/CardsList.module.css';

async function getData(cardsURL?: string, tagsByCardURL?: string, commander?: string, fromMetagame?: boolean) {
  if (!cardsURL || !tagsByCardURL) return { cards: [] };

  try {
    const rawCards = await fetch(cardsURL, { cache: 'no-store' });
    const cards = await rawCards.json();
    const rawTagsByCard = await fetch(tagsByCardURL);
    const tagsByCard = await rawTagsByCard.json();

    const mappedCards = (!!commander ? cards[commander] : cards).map((card: any) => {
      const obj = {
        card_name: card.cardName,
        occurrences: card.occurrences,
        type: card.type,
        color_identity: card.colorIdentity,
        colors: card.colors,
        cmc: card.cmc,
        power: card.power,
        toughness: card.toughness,
        last_print: card.lastPrint,
        multiple_printings: card.multiplePrintings,
        reserved: card.reserved,
        is_in_99: card.isIn99,
        is_commander: card.isCommander,
        percentage_of_use: card.percentageOfUse,
        percentage_of_use_by_identity: card.percentageOfUseByIdentity,
        tags: tagsByCard[card.cardName],
      };

      if (fromMetagame) {
        // @ts-ignore
        obj['avg_win_rate'] = card.avgWinRate;
        // @ts-ignore
        obj['avg_draw_rate'] = card.avgDrawRate;
      }

      return obj;
    });

    return {
      cards: mappedCards,
    };
  } catch (_err) {
    return { cards: [] };
  }
};

export default async function AsyncCardsTable({
  title,
  table,
  cardsURL,
  tagsByCardURL,
  context,
  commander,
  fromMetagame,
  noInfo,
  withUrlPArams,
}: {
  title?: string,
  table?: 'metagame_cards' | 'db_cards',
  cardsURL?: string,
  tagsByCardURL?: string,
  context?: any,
  commander?: string,
  fromMetagame?: boolean,
  noInfo?: boolean,
  withUrlPArams?: boolean,
}) {
  const { cards } = await getData(cardsURL, tagsByCardURL, commander, fromMetagame);

  return (
    <span className={styles.commandersContainer}>
      {
        context ? (
          <CardsTableWithProvider
            title={title || "DB Cards"}
            table={table}
            context={context}
            cardUrlBase="/metagame-cards"
            fromMetagame={fromMetagame}
            cards={cards}
            noInfo={noInfo}
            withUrlPArams={withUrlPArams}
          />
        ) : (
          <CardsTable
            title={title || "DB Cards"}
            table={table}
            cardUrlBase="/metagame-cards"
            fromMetagame={fromMetagame}
            cards={cards}
            noInfo={noInfo}
            withUrlPArams={withUrlPArams}
          />
        )
      }
    </span>
  );
};
