/* Own */
import CardsTableWithProvider from '../cardsTable/wrapperWithProvider';

async function getData(cardsURL: string, tagsByCardURL: string) {
  const rawCards = await fetch(cardsURL, { cache: 'no-store' });
  const cards = await rawCards.json();
  const rawTagsByCard = await fetch(tagsByCardURL);
  const tagsByCard = await rawTagsByCard.json();

  return {
    cards,
    tagsByCard,
  };
}

export default async function AsyncCardsTable({
  title,
  cardsURL,
  tagsByCardURL,
  context,
  noInfo,
}: {
  title?: string,
  cardsURL: string,
  tagsByCardURL: string,
  context: any,
  noInfo?: boolean,
}) {
  const { cards, tagsByCard } = await getData(cardsURL, tagsByCardURL);
  return (
    <CardsTableWithProvider
      title={title || "DB Cards"}
      cards={cards}
      tagsByCard={tagsByCard}
      context={context}
      cardUrlBase="/metagame-cards"
      noInfo={noInfo}
    />
  );
};
