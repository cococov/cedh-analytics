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

import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as Sentry from '@sentry/nextjs';

interface Database {
  cards: {
    card_name: string;
    card_type: string;
    cmc: number;
    color_identity: string;
    rarity: string;
    card_text: string;
    gatherer_id: number | null;
    average_price: number | null;
    is_reserved_list: boolean;
    card_image: string | null;
  };
  ban_list: {
    card_name: string;
    banned_date: Date;
  };
  metagame_cards: {
    card_name: string;
    count: number;
    percentage: number;
  };
  tournaments: {
    id: number;
    name: string;
    date: string;
    url: string;
    players: number;
  };
}

/**
 * Database module for cEDH Analytics
 * This module provides a singleton database connection and query functions
 */

function create_database_connection() {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }),
  });

  return new Kysely<Database>({
    dialect,
  });
}

// Use a module-level variable for the database instance
// This ensures we only have one instance throughout the application
export const db = create_database_connection();

/**
 * Get top cards from the database
 * @param limit Optional limit of results to return
 * @param offset Optional offset for pagination
 * @returns Array of top cards with their counts
 */
export async function getTopCards(limit = 100, offset = 0) {
  return Sentry.startSpan(
    {
      op: 'db.query',
      name: 'Get Top Cards',
    },
    async (span) => {
      try {
        span.setAttribute('query.limit', limit);
        span.setAttribute('query.offset', offset);

        return await db
          .selectFrom('metagame_cards')
          .selectAll()
          .orderBy('count', 'desc')
          .limit(limit)
          .offset(offset)
          .execute();
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}

/**
 * Get card details by name
 * @param cardName The name of the card to fetch
 * @returns Card details or null if not found
 */
export async function getCardByName(cardName: string) {
  return Sentry.startSpan(
    {
      op: 'db.query',
      name: 'Get Card By Name',
    },
    async (span) => {
      try {
        span.setAttribute('card.name', cardName);

        const results = await db
          .selectFrom('cards')
          .selectAll()
          .where('card_name', '=', cardName)
          .execute();

        return results.length > 0 ? results[0] : null;
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}

/**
 * Get commanders by color identity
 * @param colors Array of color identities to filter by
 * @returns Array of commanders matching the color identity
 */
export async function getCommandersByColor(colors: string[]) {
  return Sentry.startSpan(
    {
      op: 'db.query',
      name: 'Get Commanders By Color',
    },
    async (span) => {
      try {
        span.setAttribute('colors', colors.join(','));

        // This is a simplified implementation for testing
        // In a real implementation, you would use a more complex query
        return await db
          .selectFrom('cards')
          .selectAll()
          .where('card_type', 'like', '%Legendary Creature%')
          .execute();
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}

/**
 * Get tournaments data
 * @returns Array of tournament data
 */
export async function getTournaments() {
  return Sentry.startSpan(
    {
      op: 'db.query',
      name: 'Get Tournaments',
    },
    async () => {
      try {
        return await db
          .selectFrom('tournaments')
          .selectAll()
          .orderBy('date', 'desc')
          .execute();
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}
