import type { NextApiRequest, NextApiResponse } from 'next';
import { includes } from 'rambda';

type ImageUris = {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

type Data = {
  type: string;
  mana_cost: string;
  cmc: number;
  color_identity: Array<string>;
  rarity: string;
  text: string;
  gathererId: number;
  averagePrice: string;
  isReservedList: boolean;
  image_uris: ImageUris;
  card_faces: [object];
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const rawResult = await fetch(`https://api.scryfall.com/cards/named?exact=${req.query.name}`);
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

    res.status(200).json({
      type: print['type_line'],
      mana_cost: print['mana_cost'],
      cmc: print['cmc'],
      color_identity: print['color_identity'],
      rarity: print['rarity'],
      text: print['oracle_text'],
      gathererId: print['multiverse_ids'][0],
      averagePrice: print['prices']['usd'],
      isReservedList: print['reserved'],
      image_uris: print['image_uris'],
      card_faces: print['card_faces'],
    });
  } catch (e: any) {
    res.status(500).json(e);
  }
}

export default handler;