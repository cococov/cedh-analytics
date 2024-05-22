/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2022-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

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
      cardName: print['name'],
      cardType: !!print['card_faces'] ? result['card_faces'][0]['type_line'] : print['type_line'],
      cmc: print['cmc'],
      colorIdentity: print['color_identity'],
      rarity: print['rarity'],
      cardText: print['oracle_text'] || `${print['card_faces'][0]['oracle_text']}--DIVIDE--${print['card_faces'][1]['oracle_text']}`,
      gathererId: print['multiverse_ids'][0] || null,
      averagePrice: !!print['prices']['usd'] ? print['prices']['usd'] : print['prices']['usd_foil'],
      isReservedList: print['reserved'],
      cardImage: !!print['image_uris'] ? print['image_uris']['normal'] : print['card_faces'][0]['image_uris']['normal'],
      cardFaces: print['card_faces'] || [],
      isDoubleFace: !!print['card_faces'],
    };
  } catch (err) {
    return {
      error: true,
      cardName: '',
      cardType: '',
      cmc: 0,
      colorIdentity: [],
      rarity: '',
      cardText: '',
      gathererId: 0,
      averagePrice: 0,
      isReservedList: false,
      cardImage: [],
      cardFaces: [],
      isDoubleFace: false,
    }
  }
};

export default fetchData;
