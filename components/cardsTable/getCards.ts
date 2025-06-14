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
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";

/* Vendor */
import { Pool } from 'pg';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { isNotNil, isEmpty, map, includes } from 'ramda';

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
  avg_win_rate: number; // Not used, just to avoid error for use dynamic tables
  avg_draw_rate: number; // Not used, just to avoid error for use dynamic tables
};

export interface TagsByCommander {
  card_name: string;
  tags: string;
};

export interface BanList {
  card_name: string;
};

type Columns = keyof CardsTable | keyof MetagameCardsTable | keyof TagsByCommander;

type Card = CardsTable & (MetagameCardsTable | TagsByCommander);

interface Database {
  cards: CardsTable;
  metagame_cards: MetagameCardsTable;
  db_cards: DBCardsTable;
  tags_by_card: TagsByCommander;
  ban_list: BanList;
};

function isNumeric(str: string) {
  return !isNaN(parseFloat(str))
};

export default async function getCards(
  t: 'metagame_cards' | 'db_cards',
  page: number,
  pageSize: number,
  orderBy?: Columns,
  orderDirection?: 'asc' | 'desc',
  search?: string,
  filters?: { column: Columns, operator: '=' | '>' | '<', value: string | string[] }[],
) {
  return await Sentry.withServerActionInstrumentation(
    "getCardsAction",
    {
      headers: await headers(),
      recordResponse: true,
    },
    async () => {
      // Validations and fixes
      const fixedFilters = isNotNil(filters) && !isEmpty(filters)
        ? map(filter => {
          if (isNumeric(`${filter.value}`) && Number.parseInt(`${filter.value}`) >= 2147483647) {
            return { ...filter, value: '2147483647' };
          }
          return filter;
        }, filters)
        : filters;

      const dialect = new PostgresDialect({
        pool: new Pool({
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          port: Number.parseInt(process.env.DB_PORT || '5432'),
          max: 10,
        })
      });

      const db = new Kysely<Database>({
        dialect,
      });

      const { table, ref } = db.dynamic;

      let cardsQuery = db
        .selectFrom(table(t).as('t'))
        .innerJoin('cards', 't.card_name', 'cards.card_name')
        .innerJoin('tags_by_card', 't.card_name', 'tags_by_card.card_name')
        .orderBy(ref(orderBy || 'occurrences'), orderDirection || 'desc')
        .limit(pageSize)
        .offset(page * pageSize);

      let totalCountQuery = db
        .selectFrom(table(t).as('t'))
        .innerJoin('cards', 't.card_name', 'cards.card_name')
        .innerJoin('tags_by_card', 't.card_name', 'tags_by_card.card_name')
        .select((eb) => eb.fn.countAll().as('total'));

      if (Boolean(search)) {
        cardsQuery = cardsQuery.where('t.card_name', 'ilike', `%${search}%`)
        totalCountQuery = totalCountQuery.where('t.card_name', 'ilike', `%${search}%`)
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
              if (filter.column === 'is_legal') { // metagame_cards is_legal column is DEPRECATED, use ban_list table instead
                if (value === 'true') {
                  return eb('t.card_name', 'not in', eb =>
                    eb.selectFrom('ban_list').select('card_name')
                  );
                } else {
                  return eb('t.card_name', 'in', eb =>
                    eb.selectFrom('ban_list').select('card_name')
                  );
                }
              } else if (value === 'true' || value === 'false') { // Selects with booleans
                return eb(ref<Columns>(filter.column), '=', value);
              } else {
                return eb(ref<Columns>(filter.column), 'like', `${value}`); // Selects with strings
              }
            })
          ))
          totalCountQuery = totalCountQuery.where(eb => eb.or(
            (filter.value as string[]).map(value => {
              if (filter.column === 'is_legal') { // metagame_cards is_legal column is DEPRECATED, use ban_list table instead
                if (value === 'true') {
                  return eb('t.card_name', 'not in', eb =>
                    eb.selectFrom('ban_list').select('card_name')
                  );
                } else {
                  return eb('t.card_name', 'in', eb =>
                    eb.selectFrom('ban_list').select('card_name')
                  );
                }
              } else if (value === 'true' || value === 'false') { // Selects with booleans
                return eb(ref<Columns>(filter.column), '=', value);
              } else {
                return eb(ref<Columns>(filter.column), 'like', `${value}`); // Selects with strings
              }
            })
          ))
        } else {
          cardsQuery = cardsQuery.where(ref<Columns>(filter.column), filter.operator || '=', filter.value);
          totalCountQuery = totalCountQuery.where(ref<Columns>(filter.column), filter.operator || '=', filter.value);
        }
      });

      if (t === 'metagame_cards') {
        cardsQuery = cardsQuery.select(['t.card_name', 'color_identity', 'colors', 'cmc', 'reserved', 'multiple_printings', 'last_print', 'type', 'power', 'toughness', 'is_commander', 'is_in_99', sql`coalesce(is_legal, true)`.as('is_legal'), 'percentage_of_use', 'percentage_of_use_by_identity', 'occurrences', 'avg_win_rate', 'avg_draw_rate', 'tags_by_card.tags']);
      }

      if (t === 'db_cards') {
        cardsQuery = cardsQuery.select(['t.card_name', 'color_identity', 'colors', 'cmc', 'reserved', 'multiple_printings', 'last_print', 'type', 'power', 'toughness', 'is_commander', 'is_in_99', sql`coalesce(is_legal, true)`.as('is_legal'), 'percentage_of_use', 'percentage_of_use_by_identity', 'occurrences', 'tags_by_card.tags']);
      }

      const cards = await cardsQuery.execute();

      // Get banned cards from database
      const bannedCardsResult = await db.selectFrom('ban_list').select('card_name').execute();
      const bannedCardsList = bannedCardsResult.map((card: { card_name: string }) => card.card_name);

      const cardsWithBans = (cards as Card[]).map(card => ({ ...card, is_legal: !includes(card['card_name'], bannedCardsList) }));
      const rawTotalCount = await totalCountQuery.execute();
      const totalCount = rawTotalCount[0].total;

      return { data: cardsWithBans, page: page, totalCount: parseInt(`${totalCount}`) };
    }
  );
};
