import type { NextApiRequest, NextApiResponse } from 'next';

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
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const rawResult = await fetch(`https://api.scryfall.com/cards/named?exact=${req.query.name}`);
  const result = await rawResult.json();
  const rawAllPrints = await fetch(result['prints_search_uri']);
  const allPrints = await rawAllPrints.json();

  const print = allPrints['data'].reduce(
    (accumulator: any, current: any) => {
      if(!current['prices']['usd']) return accumulator;
      if(current['border_color'] === 'gold') return accumulator;
      const currentPrice = parseFloat(current['prices']['usd']);
      const accumulatedPrice = parseFloat(accumulator['prices']['usd']);
      if(currentPrice >= accumulatedPrice) return accumulator;
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
  });
}

export default handler;