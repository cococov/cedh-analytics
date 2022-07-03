import { useReducer, useState, useEffect } from 'react';
import { replace } from 'ramda';
import { CardsTable, CardInfo, DeckLists, Layout, SnackBarLoading } from '../../components';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from '../../styles/CardsList.module.css';
import fetchCards from '../../utils/fetch/cardData';
import DATA from '../../public/data/cards/competitiveCards.json';

type CardProps = any; // TODO: define type
type CardsProps = { cards: CardProps[] };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };
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
  const [decklists, setDecklists] = useState<DeckListsByCommander[]>([]);
  const [cardData, setCardData] = useState<CardData>({
    cardImage: '',
    cardType: '',
    cardText: '',
    averagePrice: 0,
    gathererId: 0,
    isReservedList: false,
  });
  const [isLoading, toggleLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isLoadingDeckLists, toggleLoadingDecklists] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

  const handleChangeCard = async (cardName: string | undefined) => {
    toggleLoadingDecklists(true);
    setTimeout(() => { toggleLoadingDecklists(false) }, 300);
    toggleLoading(true);
    setSelectedCard(cardName || '');
    const card = cards.find((current: any) => current['cardName'] === cardName);
    const decklists: DeckListsByCommander[] = card?.decklists || [];
    setOccurrencesForCard({ occurrences: card?.occurrences, persentaje: card?.percentageOfUse });
    setDecklists(decklists);
  };

  useEffect(() => {
    const requestData = async () => {
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

      if (!!result['cardFaces'] && !!result['cardFaces'][0]['image_uris']) {
        newCardData['cardImage'] = result['cardFaces'][0]['image_uris']['large'];
        newCardData['cardType'] = result['cardFaces'][0]['type_line'];
        newCardData['cardText'] = `\
        ${result['cardFaces'][0]['oracle_text']}
        --DIVIDE--
        ${result['cardFaces'][1]['oracle_text']}
        `;
      } else if (!!result['cardFaces'] && !!!result['cardFaces'][0]['image_uris']) {
        newCardData['cardImage'] = result['cardImage'];
        newCardData['cardType'] = result['cardFaces'][0]['type_line'];
        newCardData['cardText'] = `\
        ${result['cardFaces'][0]['oracle_text']}
        --DIVIDE--
        ${result['cardFaces'][1]['oracle_text']}
        `;
      } else {
        newCardData['cardImage'] = result['cardImage'];
        newCardData['cardType'] = result['cardType'];
        newCardData['cardText'] = result['cardText'];
      }
      newCardData['averagePrice'] = parseFloat(result['averagePrice']);
      newCardData['gathererId'] = result['gathererId'];
      newCardData['isReservedList'] = result['isReservedList'];
      setCardData(newCardData);
      toggleLoading(false);
    };

    !!selectedCard && requestData();
  }, [selectedCard]);

  return (
    <Layout title="Card List" description="List of all cEDH cards">
      <SnackBarLoading isOpen={isLoading && (isMediumScreen || isSmallScreen)} />
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
          cards={cards}
          toggleLoading={toggleLoading}
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

export const getStaticProps = async () => {
  return {
    props: {
      cards: DATA,
    },
  };
};

export default Cards;
