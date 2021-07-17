import { createContext, useState} from 'react';

/**
 * Default Values
 */
const DEFAULT_VALUES = {
  selectedCard: undefined,
  cardImage: undefined,
  cardType: undefined,
  cardText: undefined,
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

  return (
  <CardContext.Provider
    value={{
      selectedCard,
      cardImage,
      cardType,
      cardText
    }}
  >
    {children}
  </CardContext.Provider>
  );
};

  export default CardContext;