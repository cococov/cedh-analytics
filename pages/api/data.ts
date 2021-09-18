import type { NextApiRequest, NextApiResponse } from 'next';
import {
  reduce,
  filter,
  includes,
  split,
  trim,
  map,
  flatten,
  mergeAll,
  pipe,
  isNil,
  __
} from 'ramda';

type DbCommander = {
  name: string,
  link: string,
};

type DbDiscord = {
  title: string,
  link: string,
};

type DbDecklist = {
  link: string,
  title: string,
  primer: boolean,
};

type DbEntry = {
  commander: Array<DbCommander>,
  ttl: any,
  discord: DbDiscord,
  updated: string,
  section: string,
  colors: string[],
  decklists: DbDecklist[],
  description: string,
  id: string,
  recommended: boolean,
  title: string,
};

type MoxfieldUser = {
  userName: string,
  profileImageUrl: string,
  badges: Array<any>
};

type MoxfieldCardPrices = {
  usd: number,
  usd_foil: number,
  eur: number,
  eur_foil: number,
  ck: number,
  ck_foil: number,
  lastUpdatedAtUtc: string
};

type MoxfieldCardInfo = {
  id: string,
  scryfall_id: string,
  set: string,
  set_name: string,
  name: string,
  cn: string,
  layout: string,
  cmc: number,
  type: string,
  type_line: string,
  oracle_text: string,
  mana_cost: string,
  colors: string[],
  color_indicator: any[],
  color_identity: string[],
  legalities: object,
  frame: string,
  reserved: boolean,
  foil: boolean,
  nonfoil: boolean,
  rarity: string,
  border_color: string,
  colorshifted: boolean,
  lang: string,
  latest: boolean,
  has_multiple_editions: boolean,
  has_arena_legal: boolean,
  prices: MoxfieldCardPrices,
  card_faces: any[],
  artist: string,
  promo_types: any[],
  cardHoarderUrl: string,
  cardKingdomUrl: string,
  cardMarketUrl: string,
  tcgPlayerUrl: string,
  isArenaLegal: boolean,
  isToken: boolean
};

type MoxfieldCard = {
  quantity: number,
  boardType: string,
  isFoil: boolean,
  isAlter: boolean,
  card: MoxfieldCardInfo,
  useCmcOverride: boolean,
  useManaCostOverride: boolean,
  useColorIdentityOverride: boolean
};

type MoxfieldCardEntry = {
  [key: string]: MoxfieldCard,
};

type MoxfieldData = {
  id: string,
  name: string,
  url: string,
  description: string,
  format: string,
  visibility: string,
  publicUrl: string,
  publicId: string,
  likeCount: number,
  viewCount: number,
  commentCount: number,
  areCommentsEnabled: boolean,
  createdByUser: MoxfieldUser,
  authors: MoxfieldUser[],
  main: object,
  mainboardCount: number,
  mainboard: MoxfieldCardEntry,
  sideboardCount: number,
  sideboard: MoxfieldCardEntry,
  maybeboardCount: number,
  maybeboard: MoxfieldCardEntry,
  commandersCount: number,
  commanders: MoxfieldCardEntry,
  companionsCount: number,
  companions: MoxfieldCardEntry,
  signatureSpellsCount: number,
  signatureSpells: MoxfieldCardEntry,
  tokens: object[],
  hubs: any[],
  createdAtUtc: string,
  lastUpdatedAtUtc: string,
  exportId: string,
  authorTags: object,
  viewSettings: object,
};

type CardData = {
  occurrences: number,
  cardName: string,
  colorIdentity: string,
  deckLinks: string[],
  deckNames: string[],
  manaCost: string,
  prices: MoxfieldCardPrices,
  reserved: boolean,
  scrapName: string,
  type: string,
  typeLine: string,
}

type cardDataHash = {
  [key: string]: CardData,
}

type Data = CardData[];

const getType = (type: string): string => {
  switch (type) {
    case '1':
      return 'Planeswalker';
    case '2':
      return 'Creature';
    case '3':
      return 'Sorcery';
    case '4':
      return 'Instant';
    case '5':
      return 'Artifact';
    case '6':
      return 'Enchantment';
    case '7':
      return 'Land';
    default:
      return 'Unknown';
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const rawLists = await fetch('https://raw.githubusercontent.com/AverageDragon/cEDH-Decklist-Database/master/_data/database.json');
    const lists: DbEntry[] = await rawLists.json();
    const allCompetitiveDecklists: string[] = reduce(
      (accumulated: string[], current: DbEntry) => {
        if (current.section !== 'COMPETITIVE') return accumulated;
        return [...accumulated, ...current.decklists.map((decklist: DbDecklist): string => trim(decklist.link))];
      }, [], lists
    );
    const filteredDecklists = filter((list: string) => includes('moxfield', list) && (split('/', list).length >= 5), allCompetitiveDecklists);
    const deckListHashes = map((list: string) => split('/', list)[4], filteredDecklists);
    const delcklistsData: MoxfieldData[] = await Promise.all(map(async (hash: string) => {
      const rawData = await fetch(`https://api.moxfield.com/v2/decks/all/${hash}`);
      const data: MoxfieldData = await rawData.json();
      return { ...data, url: `https://www.moxfield.com/decks/${hash}` };
    }, deckListHashes));
    const cards: CardData[] = pipe(
      map((data: MoxfieldData) => (
        {
          deck: { name: data.name, url: data.url },
          cards: flatten(Object.values(mergeAll([data.mainboard, data.companions, data.commanders])))
        })),
      reduce((accumulated: cardDataHash, current): cardDataHash => {
        const newValue: cardDataHash = reduce(
          (accumulated2: cardDataHash, current2): cardDataHash => {
            const hash: CardData = {
              occurrences: 0,
              cardName: current2.card.name,
              colorIdentity: current2.card.color_identity.join(''),
              deckLinks: [current.deck.url],
              deckNames: [current.deck.name],
              manaCost: current2.card.mana_cost,
              prices: current2.card.prices,
              reserved: current2.card.reserved,
              scrapName: current2.card.name,
              type: getType(current2.card.type),
              typeLine: current2.card.type_line,
            }
            if (isNil(accumulated2[current2.card.name])) return { ...accumulated2, [current2.card.name]: hash };
            return {
              ...accumulated2,
              [current2.card.name]: {
                ...hash,
                occurrences: ++accumulated2[current2.card.name].occurrences,
                deckLinks: [...accumulated2[current2.card.name].deckLinks, current.deck.url],
                deckNames: [...accumulated2[current2.card.name].deckNames, current.deck.name],
              }
            };
          }, accumulated, current.cards
        );
        return newValue;
      }, {}),
      Object.values,
    )(delcklistsData);

    res.status(200).json(cards);
  } catch (e: any) {
    res.status(500).json(e);
  }
}

export default handler;