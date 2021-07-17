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
  const rawResult = await fetch(`https://api.scryfall.com/cards/named?exact=${req.query.card}`);
  const result = await rawResult.json();

  res.status(200).json({
    type: result['type_line'],
    mana_cost: result['mana_cost'],
    cmc: result['cmc'],
    color_identity: result['color_identity'],
    rarity: result['rarity'],
    text: result['oracle_text'],
    gathererId: result['multiverse_ids'][0],
    averagePrice: result['prices']['usd'],
    isReservedList: result['reserved'],
    image_uris: result['image_uris'],
  });
}

export default handler;