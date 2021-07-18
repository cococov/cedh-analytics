import { createContext, useState, useEffect } from 'react';
import { replace } from 'rambda';

/**
 * Default Values
 */
const DEFAULT_VALUES = {
  selectedCard: '',
  cardImage: '',
  cardType: '',
  cardText: '',
  averagePrice: 0,
  gathererId: 0,
  isLoading: false,
  isReservedList: false,
  handleChangeCard: (_cardName: string | undefined) => { }
};

/**
 * Card Context.
 */
const CardContext = createContext(DEFAULT_VALUES);

/**
 * Card Provider
 */
export const CardProvider: React.FC = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState(DEFAULT_VALUES['selectedCard']);
  const [cardImage, setCardImage] = useState(DEFAULT_VALUES['cardImage']);
  const [cardType, setCardType] = useState(DEFAULT_VALUES['cardType']);
  const [cardText, setCardText] = useState(DEFAULT_VALUES['cardText']);
  const [gathererId, setGathererId] = useState(DEFAULT_VALUES['gathererId']);
  const [averagePrice, setAveragePrice] = useState(DEFAULT_VALUES['averagePrice']);
  const [isReservedList, setIsReservedList] = useState(DEFAULT_VALUES['isReservedList']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const requestData = async () => {
      setIsLoading(true);
      setCardImage(DEFAULT_VALUES['cardImage']);
      setCardType(DEFAULT_VALUES['cardType']);
      setCardText(DEFAULT_VALUES['cardText']);
      setGathererId(DEFAULT_VALUES['gathererId']);
      setAveragePrice(DEFAULT_VALUES['averagePrice']);
      setIsReservedList(DEFAULT_VALUES['isReservedList']);

      const cardName = replace(/\s/g, '%20', selectedCard);
      const rawResult = await fetch(`/api/card?name=${cardName}`);
      const result = await rawResult.json();

      if (!!result['card_faces']) {
        setCardImage(result['card_faces'][0]['image_uris']['large']);
        setCardType(result['card_faces'][0]['type_line']);
        setCardText(result['card_faces'][0]['oracle_text']);
      } else {
        setCardImage(result['image_uris']['large']);
        setCardType(result['type']);
        setCardText(result['text']);
      }
      setGathererId(result['gathererId']);
      setAveragePrice(parseFloat(result['averagePrice']));
      setIsReservedList(result['isReservedList']);
      setIsLoading(false);
    };

    !!selectedCard && requestData();
  }, [selectedCard])

  const handleChangeCard = (cardName: string | undefined) => {
    setSelectedCard(cardName || '');
  };

  return (
    <CardContext.Provider
      value={{
        selectedCard,
        cardImage,
        cardType,
        cardText,
        gathererId,
        averagePrice,
        isReservedList,
        isLoading,
        handleChangeCard,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;