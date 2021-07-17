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
  const [averagePrice, setAveragePrice] = useState(DEFAULT_VALUES['averagePrice']);
  const [gathererId, setGathererId] = useState(DEFAULT_VALUES['gathererId']);

  useEffect(() => {
    const requestData = async () => {
      const cardName = replace(/\s/g, '%20', selectedCard);
      const rawResult = await fetch(`/api/card?name=${cardName}`);
      const result = await rawResult.json();
      setCardImage(result['image_uris']['large']);
      setCardType(result['type']);
      setCardText(result['text']);
      setGathererId(result['gathererId']);
      setAveragePrice(parseFloat(result['averagePrice']));
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
        handleChangeCard,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;