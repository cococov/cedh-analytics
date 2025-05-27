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
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

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

interface Database {
  metagame_cards: MetagameCardsTable;
  db_cards: DBCardsTable;
};

export default async function getDecklistsForCardByContext(
  selectedCard: string,
  table: 'metagame_cards' | 'db_cards',
) {
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

  let cardData = (await db
    .selectFrom(table)
    .where('card_name', '=', selectedCard)
    .select(['occurrences', 'decklists', 'percentage_of_use'])
    .execute())[0]

  return { occurrences: cardData.occurrences, percentage: cardData.percentage_of_use, decklists: cardData.decklists };
};
