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

import * as Sentry from '@sentry/nextjs';

/* Mock the database module */
jest.mock('@/lib/db', () => ({
  getTopCards: jest.fn(),
  getCardByName: jest.fn(),
  getCommandersByColor: jest.fn(),
  getTournaments: jest.fn(),
}));

/* Import the mocked modules */
import { getTopCards, getCardByName, getCommandersByColor, getTournaments } from '@/lib/db';

/* Import the server actions */
import {
  fetchTopCards,
  fetchCardDetails,
  fetchCommandersByColorIdentity,
  fetchTournamentData
} from '@/app/actions';

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTopCards', () => {
    it('should fetch top cards with default parameters', async () => {
      const mockCards = [
        { card_name: 'Sol Ring', count: 100 },
        { card_name: 'Command Tower', count: 90 },
      ];

      (getTopCards as jest.Mock).mockResolvedValue(mockCards);

      const result = await Sentry.startSpan(
        {
          op: 'test.server.action',
          name: 'Test fetchTopCards',
        },
        async () => {
          return await fetchTopCards();
        }
      );

      expect(getTopCards).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
    });

    it('should handle errors properly', async () => {
      const mockError = new Error('Database error');
      (getTopCards as jest.Mock).mockRejectedValue(mockError);

      await expect(fetchTopCards()).rejects.toThrow('Database error');

      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });

  describe('fetchCardDetails', () => {
    it('should fetch card details by name', async () => {
      const mockCard = {
        card_name: 'Sol Ring',
        card_type: 'Artifact',
        cmc: 1,
        color_identity: '[]',
      };

      (getCardByName as jest.Mock).mockResolvedValue(mockCard);

      const result = await fetchCardDetails('Sol Ring');

      expect(getCardByName).toHaveBeenCalledWith('Sol Ring');
      expect(result).toEqual(mockCard);
    });

    it('should return null when card is not found', async () => {
      (getCardByName as jest.Mock).mockResolvedValue(null);

      const result = await fetchCardDetails('Nonexistent Card');

      expect(getCardByName).toHaveBeenCalledWith('Nonexistent Card');
      expect(result).toBeNull();
    });
  });

  describe('fetchCommandersByColorIdentity', () => {
    it('should fetch commanders by color identity', async () => {
      const mockCommanders = [
        { card_name: 'Tymna the Weaver', color_identity: '[W,B]' },
        { card_name: 'Thrasios, Triton Hero', color_identity: '[U,G]' },
      ];

      (getCommandersByColor as jest.Mock).mockResolvedValue(mockCommanders);

      const result = await fetchCommandersByColorIdentity(['W', 'U', 'B', 'G']);

      expect(getCommandersByColor).toHaveBeenCalledWith(['W', 'U', 'B', 'G']);
      expect(result).toEqual(mockCommanders);
    });
  });

  describe('fetchTournamentData', () => {
    it('should fetch tournament data', async () => {
      const mockTournaments = [
        { id: 1, name: 'Tournament 1', date: '2023-01-01' },
        { id: 2, name: 'Tournament 2', date: '2023-02-01' },
      ];

      (getTournaments as jest.Mock).mockResolvedValue(mockTournaments);

      const result = await Sentry.withServerActionInstrumentation(
        {
          name: 'fetchTournamentData',
          op: 'server.action',
        },
        async () => {
          return await fetchTournamentData();
        }
      );

      expect(getTournaments).toHaveBeenCalled();
      expect(result).toEqual(mockTournaments);
    });
  });
});
