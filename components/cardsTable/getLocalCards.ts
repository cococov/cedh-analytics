/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2024-present CoCoCov
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

"use client";

/* Vendor */
import { sort, filter, includes, isNotNil, isEmpty, reduce, is, map, isNil } from 'ramda';

type Card = {
  'card_name': string;
  'card_faces': any[];
  'color_identity': string;
  'occurrences': number;
  'percentage_of_use': number;
  'percentage_of_use_by_identity': number;
  'avg_win_rate': number;
  'avg_draw_rate': number;
  'is_commander': boolean;
  'is_in_99': boolean;
  'is_legal': boolean;
  'tags': string[];
  'decklists': any[];
  'cmc': number;
  'type_line': string;
  'power': number;
  'toughness': number;
  'prices': any[];
  'reserved': boolean;
  'multiple_printings': boolean;
  'last_print': string;
  'multiverse_ids': number[];
  'scrap_name': string;
  'colors': string;
  'type': string;
};

type Columns = keyof Card;

function isNumeric(str: string) {
  return !isNaN(parseFloat(str))
};

export default async function getLocalCards(
  cards: Card[],
  page: number,
  pageSize: number,
  orderBy?: Columns,
  orderDirection?: 'asc' | 'desc',
  search?: string,
  filters?: { column: Columns, operator: '=' | '>' | '<', value: string | string[] }[],
) {
  // Fix filters
  const fixedFilters = isNotNil(filters) && !isEmpty(filters)
    ? map(filter => {
      if (isNumeric(`${filter.value}`) && Number.parseInt(`${filter.value}`) >= 2147483647) {
        return { ...filter, value: '2147483647' };
      }
      return filter;
    }, filters)
    : filters;

  // Fix values (May be some old registers without the legality)
  const fixedCards = map(card => ({...card, 'is_legal': isNil(card['is_legal'] ? true : card['is_legal'])}), cards);

  // Filter
  const filteredCards = isNotNil(fixedFilters) && !isEmpty(fixedFilters)
    ? filter(card => reduce((acc, curr) => {
      if (!acc) return false;
      const { column, operator, value } = curr;
      if (includes(column, ['last_print'])) { // Strings
        return includes(
          (value as string).toLowerCase(),
          (card[column] as string).toLowerCase(),
        );
      } else if (includes(column, ['tags'])) { // String Arrays
        return includes(
          (value as string).toLowerCase(),
          `${card[column]}`.toLowerCase(),
        );
      } else if (is(Array, value)) { // Selects
        if (value.length === 0) return true;
        return includes(`${card[column]}`, value);
      } else { // Numbers
        switch (operator) {
          case '=':
            return (card[column] as number) === Number.parseInt(value);
          case '>':
            return (card[column] as number) > Number.parseInt(value);
          case '<':
            return (card[column] as number) < Number.parseInt(value);
          default:
            return false;
        }
      }
    }, true, fixedFilters), fixedCards)
    : fixedCards;

  // Search
  const searchedCards = isNotNil(search)
    ? filter(card => includes(
      search.toLowerCase(),
      card.card_name.toLowerCase(),
    ), filteredCards)
    : filteredCards;

  // Sort
  const sortedCards = isNotNil(orderBy)
    ? sort((a, b) => {
      switch (typeof a[orderBy]) {
        case 'string':
          const aString = a[orderBy] as string;
          const bString = b[orderBy] as string;
          return orderDirection === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
        case 'number':
        case 'boolean':
          const aNumber = a[orderBy] as number;
          const bNumber = b[orderBy] as number;
          return orderDirection === 'asc'
            ? aNumber - bNumber
            : bNumber - aNumber;
        default:
          return 0;
      }
    }, searchedCards)
    : searchedCards;

  // Get current page
  const cardsPage = sortedCards.slice(page * pageSize, (page + 1) * pageSize);

  return { data: cardsPage, page: page, totalCount: parseInt(`${sortedCards.length}`) };
};
