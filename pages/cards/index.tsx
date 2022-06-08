import { useReducer, useState, useEffect } from 'react';
import { replace } from 'ramda';
import { CardsTable, CardInfo, DeckLists, Layout, SnackBarLoading } from '../../components';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from '../../styles/CardsList.module.css';
import fetchCards from '../../utils/fetch/cardData';
import DATA from '../../public/data/cards/competitiveCards.json';

type CardProps = any; // TODO: define type
type CardsProps = { cards: CardProps[] };
type DeckList = { cardListName: string, cardListUrl: string };
type DeckLists = DeckList[];
type occurrencesForCard = { occurrences: number, persentaje: number };

type CardData = {
  cardImage: string,
  cardType: string,
  cardText: string,
  averagePrice: number,
  gathererId: number,
  isReservedList: boolean,
};

const Cards: React.FC<CardsProps> = ({ cards }) => {
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [occurrencesForCard, setOccurrencesForCard] = useState<occurrencesForCard>({ occurrences: 0, persentaje: 0 });
  const [cardLists, setCardLists] = useState<DeckLists>([]);
  const [cardData, setCardData] = useState<CardData>({
    cardImage: '',
    cardType: '',
    cardText: '',
    averagePrice: 0,
    gathererId: 0,
    isReservedList: false,
  });
  const [isLoading, toggle] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

  const handleChangeCard = async (cardName: string | undefined) => {
    setSelectedCard(cardName || '');
    const card = cards.find((current: any) => current['cardName'] === cardName);
    const cardLists: Array<{ cardListName: string, cardListUrl: string }> | any[] = card
      ?.deckLinks
      ?.map((current: string, index: number) => (
        { cardListName: card?.deckNames[index], cardListUrl: current }
      )) || [];
    setOccurrencesForCard({ occurrences: card?.occurrences, persentaje: card?.percentageOfUse });
    setCardLists(cardLists);
  };

  useEffect(() => {
    const requestData = async () => {
      toggle(true);

      const cardName = replace(/\s/g, '%20', selectedCard);
      const result = await fetchCards(cardName);

      const newCardData: CardData = {
        cardImage: '',
        cardType: '',
        cardText: '',
        averagePrice: 0,
        gathererId: 0,
        isReservedList: false,
      };

      if (!!result['card_faces'] && !!result['card_faces'][0]['image_uris']) {
        newCardData['cardImage'] = result['card_faces'][0]['image_uris']['large'];
        newCardData['cardType'] = result['card_faces'][0]['type_line'];
        newCardData['cardText'] = result['card_faces'][0]['oracle_text'];
      } else if (!!result['card_faces'] && !result['card_faces'][0]['image_uris']) {
        newCardData['cardImage'] = result['image_uris']['large'];
        newCardData['cardType'] = result['card_faces'][0]['type_line'];
        newCardData['cardText'] = `\
        ${result['card_faces'][0]['oracle_text']}
        --DIVIDE--
        ${result['card_faces'][1]['oracle_text']}
        `;
      } else {
        newCardData['cardImage'] = result['image_uris']['large']
        newCardData['cardType'] = result['type'];
        newCardData['cardText'] = result['text'];
      }
      newCardData['averagePrice'] = parseFloat(result['averagePrice']);
      newCardData['gathererId'] = result['gathererId'];
      newCardData['isReservedList'] = result['isReservedList'];
      setCardData(newCardData);
      toggle(false);
    };

    !!selectedCard && requestData();
  }, [selectedCard]);

  return (
    <Layout title="cEDH Card List" description="All cEDH cards.">
      <SnackBarLoading isOpen={isLoading && (isMediumScreen || isSmallScreen)} />
      <main className={styles.main}>
        <span className={styles['left-span']}>
          <DeckLists
            occurrencesForCard={occurrencesForCard}
            isLoading={isLoading}
            deckLists={cardLists}
          />
        </span>
        <CardsTable
          cards={cards}
          toggleLoading={toggle}
          handleChangeCard={handleChangeCard}
        />
        <CardInfo
          selectedCard={selectedCard}
          isLoading={isLoading}
          cardData={cardData}
        />
      </main>
    </Layout>
  );
};

type Params = {
  res: {
    setHeader: (name: string, value: string) => void
  }
}

export const getServerSideProps = async ({ res }: Params) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1000, stale-while-revalidate=59'
  )

  try {
    const cards = DATA.map((data: CardProps) => {
      const newColorIdentity = data['colorIdentity'];
      return { ...data, colorIdentity: newColorIdentity === '' ? 'C' : newColorIdentity }
    });

    return {
      props: {
        cards,
      },
    }
  } catch (err) {
    return {
      notFound: true,
      props: {
        data: [],
      }
    };
  }
};

export default Cards;
