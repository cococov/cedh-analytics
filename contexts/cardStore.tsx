import { createContext, useState, useEffect } from 'react';
import { replace, includes } from 'ramda';
import DATA from '../public/data/competitiveCards_3.json';

/**
 * Requests
 */
const fetchData = async (cardName: string) => {
  try {
    const rawResult = await fetch(`https://api.scryfall.com/cards/named?exact=${cardName}`);
    const result = await rawResult.json();
    const rawAllPrints = await fetch(result['prints_search_uri']);
    const allPrints = await rawAllPrints.json();
    const GARBAGE_EDITIONS = ['Intl. Collectors’ Edition', 'Collectors’ Edition', 'Legacy Championship', 'Summer Magic / Edgar'];

    const print = allPrints['data'].reduce(
      (accumulator: any, current: any) => {
        if (current['digital']) return accumulator;
        if (current['oversized']) return accumulator;
        if (current['border_color'] === 'gold') return accumulator;
        if (includes(current['set_name'], GARBAGE_EDITIONS)) return accumulator;
        if (!current['prices']['usd'] && !current['prices']['usd_foil']) return accumulator;
        const currentPrice = !!current['prices']['usd'] ? parseFloat(current['prices']['usd']) : parseFloat(current['prices']['usd_foil']);
        const accumulatedPrice = !!accumulator['prices']['usd'] ? parseFloat(accumulator['prices']['usd']) : parseFloat(accumulator['prices']['usd_foil']);
        if (currentPrice >= accumulatedPrice) return accumulator;
        if (current['multiverse_ids'].length === 0) return { ...current, multiverse_ids: accumulator['multiverse_ids'] }
        return current;
      },
      result
    );

    return {
      type: print['type_line'],
      mana_cost: print['mana_cost'],
      cmc: print['cmc'],
      color_identity: print['color_identity'],
      rarity: print['rarity'],
      text: print['oracle_text'],
      gathererId: print['multiverse_ids'][0],
      averagePrice: !!print['prices']['usd'] ? print['prices']['usd'] : print['prices']['usd_foil'],
      isReservedList: print['reserved'],
      image_uris: print['image_uris'],
      card_faces: print['card_faces'],
    };
  } catch (err) {
    return {
      type: '',
      mana_cost: '',
      cmc: 0,
      color_identity: [],
      rarity: '',
      text: '',
      gathererId: 0,
      averagePrice: 0,
      isReservedList: false,
      image_uris: [],
      card_faces: undefined,
    }
  }
};


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
  cardLists: Array(),
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
  const [cardLists, setCardLists] = useState<Array<{ cardListName: string, cardListUrl: string }> | any[]>(DEFAULT_VALUES['cardLists']);
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
      const result = await fetchData(cardName);

      if (!!result['card_faces'] && !!result['card_faces'][0]['image_uris']) {
        setCardImage(result['card_faces'][0]['image_uris']['large']);
        setCardType(result['card_faces'][0]['type_line']);
        setCardText(result['card_faces'][0]['oracle_text']);
      } else if (!!result['card_faces'] && !result['card_faces'][0]['image_uris']) {
        setCardImage(result['image_uris']['large']);
        setCardType(result['card_faces'][0]['type_line']);
        setCardText(`\
        ${result['card_faces'][0]['oracle_text']}
        --DIVIDE--
        ${result['card_faces'][1]['oracle_text']}
        `);
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
  }, [selectedCard]);

  const handleChangeCard = async (cardName: string | undefined) => {
    setSelectedCard(cardName || '');
    const card = DATA.find((current: any) => current['cardName'] === cardName);
    const cardLists: Array<{ cardListName: string, cardListUrl: string }> | any[] = card
      ?.deckLinks
      ?.map((current: string, index: number) => (
        { cardListName: card?.deckNames[index], cardListUrl: current }
      )) || [];
    setCardLists(cardLists);
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
        cardLists,
        handleChangeCard,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;