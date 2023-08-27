import { useReducer, useState, useEffect, useRef } from 'react';
import { replace } from 'ramda';
import { CardsTable, CardInfo, DeckLists, Layout, SnackBarLoading } from '../../components';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from '../../styles/CardsList.module.css';
import fetchCards from '../../utils/fetch/cardData';
import DATA from '../../public/data/cards/competitiveCards.json';
import TAGS_BY_CARD from '../../public/data/cards/tags.json';

type CardProps = any; // TODO: define type
type CardsProps = { cards: CardProps[], tagsByCard: { [key: string]: string[] } };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };
type occurrencesForCard = { occurrences: number, percentage: number };

type CardData = {
  cardImage: string,
  cardType: string,
  cardText: string,
  averagePrice: number,
  gathererId: number,
  cardFaces: { type_line: string }[],
  isReservedList: boolean,
  isDoubleFace: boolean,
};

const Cards: React.FC<CardsProps> = ({ cards, tagsByCard }) => {
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const selectedCardRef = useRef<string>('');
  const [occurrencesForCard, setOccurrencesForCard] = useState<occurrencesForCard>({ occurrences: 0, percentage: 0 });
  const [decklists, setDecklists] = useState<DeckListsByCommander[]>([]);
  const [cardData, setCardData] = useState<CardData>({
    cardImage: '',
    cardType: '',
    cardText: '',
    averagePrice: 0,
    gathererId: 0,
    cardFaces: [],
    isReservedList: false,
    isDoubleFace: false,
  });
  const [isLoading, toggleLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isForcedSnackBarLoading, forceSnackBarLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isLoadingDeckLists, toggleLoadingDecklists] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

  const handleChangeCard = async (cardName: string | undefined) => {
    if (selectedCardRef.current === cardName) return;
    toggleLoadingDecklists(true);
    setTimeout(() => { toggleLoadingDecklists(false) }, 300);
    toggleLoading(true);
    setSelectedCard(cardName || '');
    selectedCardRef.current = cardName || '';
    const card = cards.find((current: any) => current['cardName'] === cardName);
    const decklists: DeckListsByCommander[] = card?.decklists || [];
    setOccurrencesForCard({ occurrences: card?.occurrences, percentage: card?.percentageOfUse });
    setDecklists(decklists);
  };

  useEffect(() => {
    const requestData = async () => {
      const cardName = replace(/\s/g, '%20', selectedCard);
      const result = await fetchCards(cardName);
      setCardData({
        cardImage: result['cardImage'],
        cardType: result['cardType'],
        cardText: result['cardText'],
        averagePrice: parseFloat(result['averagePrice']),
        gathererId: result['gathererId'],
        cardFaces: result['cardFaces'],
        isReservedList: result['isReservedList'],
        isDoubleFace: result['isDoubleFace'],
      });
      toggleLoading(false);
    };

    !!selectedCard && requestData();
  }, [selectedCard]);

  return (
    <Layout title="Card List" description="List of all cEDH cards">
      <SnackBarLoading isOpen={(isLoading && (isMediumScreen || isSmallScreen)) || isForcedSnackBarLoading} />
      <main className={styles.main}>
        <span className={styles['left-span']}>
          <DeckLists
            occurrencesForCard={occurrencesForCard}
            isLoading={isLoadingDeckLists}
            decklists={decklists}
            size="medium"
          />
        </span>
        <CardsTable
          title="DB Cards"
          cards={cards}
          tagsByCard={tagsByCard}
          toggleLoading={toggleLoading}
          handleChangeCard={handleChangeCard}
          forceSnackBarLoading={forceSnackBarLoading}
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

export const getStaticProps = async () => {
  return {
    props: {
      cards: DATA,
      tagsByCard: TAGS_BY_CARD,
    },
  };
};

export default Cards;
