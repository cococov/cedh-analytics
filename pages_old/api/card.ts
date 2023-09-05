import type { NextApiRequest, NextApiResponse } from 'next';
import DATA from '../../public/data/cards/competitiveCards.json';

type Commander = { name: string, color_identity: ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[] };
type DeckList = { name: string, url: string, commanders: Commander[] };
type Data = {
  decklists: DeckList[],
}

const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const capitalizeEveryWord = (str: string): string => str.split(' ').map(capitalizeFirstLetter).join(' ');
const capitalizeURI = (uri: string): string => capitalizeEveryWord(decodeURI(uri));

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const card = (DATA as any[]).find((current: any) => current['cardName'] === capitalizeURI(req.query.name as string));
  const decklists: DeckList[] = card?.decklists || [];

  res.status(200).json({
    decklists,
  });
}

export default handler;