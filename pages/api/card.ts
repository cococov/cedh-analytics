import type { NextApiRequest, NextApiResponse } from 'next';
import DATA from '../../public/data/cards/competitiveCards.json';

type Data = {
  decklists: Array<{ name: string, url: string }> | any[],
}

const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const capitalizeEveryWord = (str: string): string => str.split(' ').map(capitalizeFirstLetter).join(' ');
const capitalizeURI = (uri: string): string => capitalizeEveryWord(decodeURI(uri));

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const card = DATA.find((current: any) => current['cardName'] === capitalizeURI(req.query.name as string));
  const decklists: Array<{ name: string, url: string }> | any[] = card?.decklists || [];

  res.status(200).json({
    decklists,
  });
}

export default handler;