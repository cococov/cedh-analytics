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
import { sort, filter, includes, isNotNil, isEmpty, reduce, map, isNil } from 'ramda';

type Tournament = {
  TID: string;
  name: string;
  date: string;
  size: number;
  validLists: number;
  processed: boolean;
};

type Columns = keyof Tournament;

function isNumeric(str: string) {
  return !isNaN(parseFloat(str))
};

export default async function getLocalTournaments(
  tournaments: Tournament[],
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
  const filteredTournaments = isNotNil(fixedFilters) && !isEmpty(fixedFilters)
    ? filter(tournament => reduce((acc, curr) => {
      if (!acc) return false;
      const { column, operator, value } = curr;
      switch (operator) {
        case '=':
          return (tournament[column] as number) === Number.parseInt(`${value}`);
        case '>':
          return (tournament[column] as number) > Number.parseInt(`${value}`);
        case '<':
          return (tournament[column] as number) < Number.parseInt(`${value}`);
        case '<->': // Date Range
          const [min, max] = value as string[];
          if (isNil(min) && isNil(max)) return true; // don't filter if both are null
          const minDate = new Date(min);
          const maxDate = new Date(max);
          const valueDate = new Date(tournament[column] as string);
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
    }, true, fixedFilters), tournaments)
    : tournaments;

  // Search
  const searchedTournaments = isNotNil(search)
    ? filter(tournament => includes(
      search.toLowerCase(),
      tournament.name.toLowerCase(),
    ), filteredTournaments)
    : filteredTournaments;

  // Sort
  const sortedTournaments = isNotNil(orderBy)
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
    }, searchedTournaments)
    : searchedTournaments;

  // Get current page
  const tournamentsPage = sortedTournaments.slice(page * pageSize, (page + 1) * pageSize);

  return { data: tournamentsPage, page: page, totalCount: parseInt(`${sortedTournaments.length}`) };
};
