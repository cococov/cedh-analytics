/* Own */
import CardsTable from '../cardsTable';

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
}: {
  title?: string,
  cardsURL: string,
  tagsByCardURL: string,
}) {
  const { cards, tagsByCard } = await getData(cardsURL, tagsByCardURL);
  return (
    <CardsTable
      title={title || "DB Cards"}
      cards={cards}
      tagsByCard={tagsByCard}
    />
  );
};
