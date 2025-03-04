/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
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

"use server";
/* Vendor */
import { sql } from 'kysely';
import { createKysely } from "@vercel/postgres-kysely";
import { isNotNil, isEmpty, map, includes } from 'ramda';
/* Static */
import banlist from 'banlist.json';

export interface CardsTable {
  card_name: string;
  card_faces: any[];
  color_identity: string;
  colors: string;
  cmc: number;
  prices: any[];
  reserved: boolean;
  multiple_printings: boolean;
  last_print: string;
  multiverse_ids: number[];
  scrap_name: string;
  type: string;
  type_line: string;
  power: string;
  toughness: string;
  tags: string;
};

export interface MetagameCardsTable {
  occurrences: number;
  card_name: string;
  decklists: any[];
  is_commander: boolean;
  is_in_99: boolean;
  is_legal: boolean;
  percentage_of_use: number;
  percentage_of_use_by_identity: number;
  avg_win_rate: number;
  avg_draw_rate: number;
};

export interface DBCardsTable {
  occurrences: number;
  card_name: string;
  decklists: any[];
  is_commander: boolean;
  is_in_99: boolean;
  is_legal: boolean;
  percentage_of_use: number;
  percentage_of_use_by_identity: number;
};

export interface TagsByCommander {
  card_name: string;
  tags: string;
};

type Columns = keyof CardsTable | keyof MetagameCardsTable | keyof TagsByCommander;

type Card = CardsTable & (MetagameCardsTable | TagsByCommander);

interface Database {
  cards: CardsTable;
  metagame_cards: MetagameCardsTable;
  db_cards: DBCardsTable;
  tags_by_card: TagsByCommander;
};

function isNumeric(str: string) {
  return !isNaN(parseFloat(str))
};

export default async function getCards(
  table: 'metagame_cards' | 'db_cards',
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

  const db = createKysely<Database>();

  let cardsQuery = db
    .selectFrom(table)
    .innerJoin('cards', `${table}.card_name`, 'cards.card_name')
    .innerJoin('tags_by_card', `${table}.card_name`, 'tags_by_card.card_name')
    .orderBy(orderBy || 'occurrences', orderDirection || 'desc')
    .limit(pageSize)
    .offset(page * pageSize);

  if (table === 'metagame_cards') {
    cardsQuery = cardsQuery.select([`${table}.card_name`, 'color_identity', 'colors', 'cmc', 'reserved', 'multiple_printings', 'last_print', 'type', 'power', 'toughness', 'is_commander', 'is_in_99', 'is_legal', 'percentage_of_use', 'percentage_of_use_by_identity', 'occurrences', 'avg_win_rate', 'avg_draw_rate', 'tags_by_card.tags']);
  }

  if (table === 'db_cards') {
    cardsQuery = cardsQuery.select([`${table}.card_name`, 'color_identity', 'colors', 'cmc', 'reserved', 'multiple_printings', 'last_print', 'type', 'power', 'toughness', 'is_commander', 'is_in_99', sql`coalesce(is_legal, true)`.as('is_legal'), 'percentage_of_use', 'percentage_of_use_by_identity', 'occurrences', 'tags_by_card.tags']);
  }

  let totalCountQuery = db
    .selectFrom(table)
    .innerJoin('cards', `${table}.card_name`, 'cards.card_name')
    .innerJoin('tags_by_card', `${table}.card_name`, 'tags_by_card.card_name')
    .select((eb) => eb.fn.countAll().as('total'));

  if (Boolean(search)) {
    cardsQuery = cardsQuery.where(`${table}.card_name`, 'ilike', `%${search}%`)
    totalCountQuery = totalCountQuery.where(`${table}.card_name`, 'ilike', `%${search}%`)
  }

  fixedFilters?.forEach((filter) => {
    if (filter.column === 'last_print') {
      cardsQuery = cardsQuery.where(filter.column, 'ilike', `%${filter.value}%`);
      totalCountQuery = totalCountQuery.where(filter.column, 'ilike', `%${filter.value}%`);
    } else if (filter.column === 'tags') {
      cardsQuery = cardsQuery.where(`tags_by_card.${filter.column}`, 'ilike', `%${filter.value}%`);
      totalCountQuery = totalCountQuery.where(`tags_by_card.${filter.column}`, 'ilike', `%${filter.value}%`);
    } else if (Array.isArray(filter.value)) { // Selects
      if (filter.value.length === 0) return;
      cardsQuery = cardsQuery.where(eb => eb.or(
        (filter.value as string[]).map(value => {
          if (filter.column === 'is_legal') { // (May be some old registers without the legality)
            if (value === 'true') {
              return eb(`${table}.card_name`, 'not in', banlist);
            } else {
              return eb(`${table}.card_name`, 'in', banlist);
            }
          } else if (value === 'true' || value === 'false') { // Selects with booleans
            return eb(filter.column, '=', value);
          } else {
            return eb(filter.column, 'like', `${value}`); // Selects with strings
          }
        })
      ))
      totalCountQuery = totalCountQuery.where(eb => eb.or(
        (filter.value as string[]).map(value => {
          if (value === 'true' || value === 'false') { // Selects with booleans
            return eb(filter.column, '=', value);
          } else {
            return eb(filter.column, 'like', `${value}`); // Selects with strings
          }
        })
      ))
    } else {
      cardsQuery = cardsQuery.where(filter.column, filter.operator || '=', filter.value);
      totalCountQuery = totalCountQuery.where(filter.column, filter.operator || '=', filter.value);
    }
  });

  const cards = await cardsQuery.execute();
  const cardsWithBans = (cards as Card[]).map(card => ({...card, is_legal: !includes(card['card_name'], banlist)}));
  const totalCount = (await totalCountQuery.execute())[0].total;

  return { data: cardsWithBans, page: page, totalCount: parseInt(`${totalCount}`) };
};
