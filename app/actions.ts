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

'use server';

import * as Sentry from '@sentry/nextjs';
import { getTopCards, getCardByName, getCommandersByColor, getTournaments } from '@/lib/db';

/**
 * Fetches the top cards from the database
 * @param limit Optional limit of results to return
 * @param offset Optional offset for pagination
 * @returns Array of top cards with their counts
 */
export async function fetchTopCards(limit?: number, offset?: number) {
  return Sentry.startSpan(
    {
      op: 'db.query',
      name: 'Fetch Top Cards',
    },
    async () => {
      try {
        return await getTopCards(limit, offset);
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}

/**
 * Fetches card details by name
 * @param cardName The name of the card to fetch
 * @returns Card details or null if not found
 */
export async function fetchCardDetails(cardName: string) {
  return Sentry.startSpan(
    {
      op: 'db.query',
      name: 'Fetch Card Details',
    },
    async (span) => {
      try {
        span.setAttribute('card.name', cardName);
        return await getCardByName(cardName);
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}

/**
 * Fetches commanders by color identity
 * @param colors Array of color identities to filter by
 * @returns Array of commanders matching the color identity
 */
export async function fetchCommandersByColorIdentity(colors: string[]) {
  return Sentry.withServerActionInstrumentation(
    {
      name: 'fetchCommandersByColorIdentity',
      op: 'server.action',
    },
    async () => {
      try {
        return await getCommandersByColor(colors);
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}

/**
 * Fetches tournament data
 * @returns Array of tournament data
 */
export async function fetchTournamentData() {
  return Sentry.withServerActionInstrumentation(
    {
      name: 'fetchTournamentData',
      op: 'server.action',
    },
    async () => {
      try {
        return await getTournaments();
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
}
