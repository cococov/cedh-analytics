import { includes } from 'ramda';

const fetchData = async (cardName: string) => {
  try {
    const rawResult = await fetch(`https://api.scryfall.com/cards/named?exact=${cardName}`);
    if (rawResult.status === 404) throw new Error("Card Not found");
    const result = await rawResult.json();
    const rawAllPrints = await fetch(result['prints_search_uri']);
    const allPrints = await rawAllPrints.json();
    const GARBAGE_EDITIONS = ['Intl. Collectors’ Edition', 'Collectors’ Edition', 'Legacy Championship', 'Summer Magic / Edgar'];

    const print = allPrints['data'].reduce(
      (accumulator: any, current: any) => {
        const multiverse_ids = current['multiverse_ids'].length === 0 ? accumulator['multiverse_ids'] : current['multiverse_ids'];
        if (current['digital']) return accumulator; // Ignore digital cards
        if (current['oversized']) return accumulator; // Ignore oversized cards
        if (current['border_color'] === 'gold') return accumulator; // Ignore gold border cards
        if (includes(current['set_name'], GARBAGE_EDITIONS)) return accumulator; // Ignore garbage editions
        if (!current['prices']['usd'] && !current['prices']['usd_foil']) return accumulator; // Ignore cards without price
        const currentPrice = !!current['prices']['usd'] ? parseFloat(current['prices']['usd']) : parseFloat(current['prices']['usd_foil']);
        const accumulatedPrice = !!accumulator['prices']['usd'] ? parseFloat(accumulator['prices']['usd']) : parseFloat(accumulator['prices']['usd_foil']);
        if (currentPrice >= accumulatedPrice) return { ...accumulator, multiverse_ids: multiverse_ids };
        return { ...current, multiverse_ids: multiverse_ids }
      },
      result
    );

    return {
      error: false,
      cardType: print['type_line'],
      cmc: print['cmc'],
      colorIdentity: print['color_identity'],
      rarity: print['rarity'],
      cardText: print['oracle_text'] || null,
      gathererId: print['multiverse_ids'][0] || null,
      averagePrice: !!print['prices']['usd'] ? print['prices']['usd'] : print['prices']['usd_foil'],
      isReservedList: print['reserved'],
      cardImage: !!print['image_uris'] ? print['image_uris']['large'] : null,
      cardFaces: print['card_faces'] || null,
    };
  } catch (err) {
    return {
      error: true,
      cardType: '',
      cmc: 0,
      colorIdentity: [],
      rarity: '',
      cardText: '',
      gathererId: 0,
      averagePrice: 0,
      isReservedList: false,
      cardImage: [],
      cardFaces: null,
    }
  }
};

export default fetchData;