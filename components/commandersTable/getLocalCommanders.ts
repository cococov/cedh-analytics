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
import { sort, filter, includes, isNotNil, isEmpty, reduce, map, is } from 'ramda';

type Commander = {
  commander: string;
  identity: string;
  appearances: number;
  wins: number;
  avgWinRate: number;
  avgDrawRate: number;
  bestStanding: number;
  worstStanding: number;
};

type Columns = keyof Commander;

function isNumeric(str: string) {
  return !isNaN(parseFloat(str))
};

export default async function getLocalCommanders(
  commanders: Commander[],
  page: number,
  pageSize: number,
  orderBy?: Columns,
  orderDirection?: 'asc' | 'desc',
  search?: string,
  filters?: { column: Columns, operator: '=' | '>' | '<', value: string | string[] }[],
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
  const filteredCommanders = isNotNil(fixedFilters) && !isEmpty(fixedFilters)
    ? filter(commander => reduce((acc, curr) => {
      if (!acc) return false;
      const { column, operator, value } = curr;

      if (includes(column, ['commander'])) { // Strings
        return includes(
          (value as string).toLowerCase(),
          (commander[column] as string).toLowerCase(),
        );
      } else if (is(Array, value)) { // Selects
        if (value.length === 0) return true;
        return includes(`${commander[column]}`, value);
      } else {
        const columnNumber = (commander[column] as number);
        const fixedNumber = columnNumber < 1 ? Math.round((columnNumber + Number.EPSILON) * 10000) / 100 : columnNumber;
        switch (operator) {
          case '=':
            return fixedNumber === Number.parseInt(`${value}`);
          case '>':
            return fixedNumber > Number.parseInt(`${value}`);
          case '<':
            return fixedNumber < Number.parseInt(`${value}`);
          default:
            return false;
        }
      }
    }, true, fixedFilters), commanders)
    : commanders;

  // Search
  const searchedCommanders = isNotNil(search)
    ? filter(tournament => includes(
      search.toLowerCase(),
      tournament.commander.toLowerCase(),
    ), filteredCommanders)
    : filteredCommanders;

  // Sort
  const sortedCommanders = isNotNil(orderBy)
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
    }, searchedCommanders)
    : searchedCommanders;

  // Get current page
  const commandersPage = sortedCommanders.slice(page * pageSize, (page + 1) * pageSize);

  return { data: commandersPage, page: page, totalCount: parseInt(`${sortedCommanders.length}`) };
};
