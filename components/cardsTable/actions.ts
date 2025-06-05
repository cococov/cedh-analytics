'use server';

/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2025-present CoCoCov
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

// Server action to fetch and merge card data from different sources
export async function fetchCardData(cardsURL?: string, tagsByCardURL?: string, fromMetagame?: boolean) {
  if (!cardsURL || !tagsByCardURL) return { cards: [] };

  try {
    const rawCards = await fetch(cardsURL, { cache: 'no-store' });
    const cards = await rawCards.json();
    const rawTagsByCard = await fetch(tagsByCardURL);
    const tagsByCard = await rawTagsByCard.json();

    const mappedCards = cards.map((card: any) => {
      const obj = {
        card_name: card.cardName,
        occurrences: card.occurrences,
        type: card.type,
        color_identity: card.colorIdentity,
        colors: card.colors,
        cmc: card.cmc,
        power: card.power,
        toughness: card.toughness,
        last_print: card.lastPrint,
        multiple_printings: card.multiplePrintings,
        reserved: card.reserved,
        is_in_99: card.isIn99,
        is_legal: card.isLegal,
        is_commander: card.isCommander,
        percentage_of_use: card.percentageOfUse,
        percentage_of_use_by_identity: card.percentageOfUseByIdentity,
        tags: tagsByCard[card.cardName],
      };

      if (fromMetagame) {
        // @ts-ignore
        obj['avg_win_rate'] = card.avgWinRate;
        // @ts-ignore
        obj['avg_draw_rate'] = card.avgDrawRate;
      }

      return obj;
    });

    return {
      cards: mappedCards,
    };
  } catch (err) {
    console.error('Error fetching cards data:', err);
    return { cards: [] };
  }
}
