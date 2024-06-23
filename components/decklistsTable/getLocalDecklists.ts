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
import {
  sort,
  filter,
  includes,
  isNotNil,
  isEmpty,
  reduce,
  map,
  is,
  isNil,
  not,
} from 'ramda';

type Decklist = {
  name: string
  wins: number
  winRate: number
  standing: number
  hasPartners: boolean
  tournamentName: string
  dateCreated: string
  hasCompanion: boolean
  companions: string[]
  hasStickers: boolean
  cantBattles: number
  cantPlaneswalkers: number
  cantCreatures: number
  cantSorceries: number
  cantInstants: number
  cantArtifacts: number
  cantEnchantments: number
  cantLands: number
  avgCmcWithLands: number
  avgCmcWithoutLands: number
};

type Columns = keyof Decklist;

function isNumeric(str: string) {
  return !isNaN(parseFloat(str))
};

export default async function getLocalDecklists(
  decklists: Decklist[],
  page: number,
  pageSize: number,
  orderBy?: Columns,
  orderDirection?: 'asc' | 'desc',
  search?: string,
  filters?: { column: Columns, operator: '=' | '>' | '<' | '<->', value: string | string[] }[],
) {
  // Validations and fixes
  const fixedFilters = isNotNil(filters) && !isEmpty(filters)
    ? map(filter => {
      if (isNumeric(`${filter.value}`) && Number.parseInt(`${filter.value}`) >= 2147483647) {
        return { ...filter, value: '2147483647' };
      }
      return filter;
    }, filters)
    : filters;

  // Filter
  const filteredDecklists = isNotNil(fixedFilters) && !isEmpty(fixedFilters)
    ? filter(decklist => reduce((acc, curr) => {
      if (!acc) return false;
      const { column, operator, value } = curr;

      if (includes(column, ['name'])) { // Strings
        return includes(
          (value as string).toLowerCase(),
          (decklist[column] as string).toLowerCase(),
        );
      } else if (is(Array, value) && operator !== '<->') { // Date range is an array but we don't want to filter it here
        if (value.length === 0) return true;
        return includes(`${decklist[column]}`, value);
      } else {
        const columnNumber = (decklist[column] as number);
        const fixedNumber = columnNumber < 1 ? Math.round((columnNumber + Number.EPSILON) * 10000) / 100 : columnNumber;
        switch (operator) {
          case '=':
            return fixedNumber === Number.parseFloat(`${value}`);
          case '>':
            return fixedNumber > Number.parseFloat(`${value}`);
          case '<':
            return fixedNumber < Number.parseFloat(`${value}`);
          case '<->': // Date Range
            if (!is(Array, value)) return true; // We ensure that the value is an array
            const [min, max] = value as string[];
            if (isNil(min) && isNil(max)) return true; // don't filter if both are null
            const minDate = new Date(min);
            const maxDate = new Date(max);
            const valueDate = new Date(decklist[column] as string);
            if (valueDate.toString() === 'Invalid Date') return false; // don't consider current value if it's not a valid date
            if (minDate.toString() !== 'Invalid Date') minDate.setUTCHours(0, 0, 0, 0);
            if (maxDate.toString() !== 'Invalid Date') maxDate.setUTCHours(0, 0, 0, 0);
            valueDate.setUTCHours(0, 0, 0, 0);
            if (isNil(min)) return valueDate <= maxDate;
            if (isNil(max)) return valueDate >= minDate;
            return valueDate >= minDate && valueDate <= maxDate;
          default:
            return false;
        }
      }
    }, true, fixedFilters), decklists)
    : decklists;

  // Search
  const searchedDecklists = isNotNil(search)
    ? filter(tournament => includes(
      search.toLowerCase(),
      tournament.name.toLowerCase(),
    ), filteredDecklists)
    : filteredDecklists;

  // Sort
  const sortedDecklists = isNotNil(orderBy)
    ? sort((a, b) => {
      switch (typeof a[orderBy]) {
        case 'string':
          const aString = a[orderBy] as string;
          const bString = b[orderBy] as string;
          return orderDirection === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
        case 'number':
          const aNumber = a[orderBy] as number;
          const bNumber = b[orderBy] as number;
          return orderDirection === 'asc'
            ? aNumber - bNumber
            : bNumber - aNumber;
        default:
          return 0;
      }
    }, searchedDecklists)
    : searchedDecklists;

  // Get current page
  const decklistsPage = sortedDecklists.slice(page * pageSize, (page + 1) * pageSize);

  return { data: decklistsPage, page: page, totalCount: parseInt(`${sortedDecklists.length}`) };
};
