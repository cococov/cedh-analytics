import type { NextApiRequest, NextApiResponse } from 'next';
import DATA from '../../public/data/cards/competitiveCards.json';

type Data = {
  deckLists: Array<{ cardListName: string, cardListUrl: string }> | any[],
}

const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const capitalizeEveryWord = (str: string): string => str.split(' ').map(capitalizeFirstLetter).join(' ');
const capitalizeURI = (uri: string): string => capitalizeEveryWord(decodeURI(uri));

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const card = DATA.find((current: any) => current['cardName'] === capitalizeURI(req.query.name as string));
  const deckLists: Array<{ cardListName: string, cardListUrl: string }> | any[] = card
    ?.deckLinks
    ?.map((current: string, index: number) => (
      { cardListName: card?.deckNames[index], cardListUrl: current }
    )) || [];

  res.status(200).json({
    deckLists,
  });
}

export default handler;