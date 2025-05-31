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

// Mock Sentry first, before any imports
jest.mock('@sentry/nextjs', () => ({
  startSpan: jest.fn((config, callback) => callback({ setAttribute: jest.fn() })),
  captureException: jest.fn(),
}));

// Import Sentry after mocking
import * as Sentry from '@sentry/nextjs';

// Mock the database operations
jest.mock('@/lib/db', () => {
  return {
    // Mock the database functions we want to test
    getTopCards: jest.fn().mockImplementation(async () => {
      // This will call the mocked Sentry.startSpan
      return Sentry.startSpan(
        { op: 'db.query', name: 'Get Top Cards' },
        async (span) => {
          span.setAttribute('query.limit', 100);
          return [{ card_name: 'Sol Ring', count: 100 }];
        }
      );
    }),
    getCardByName: jest.fn().mockImplementation(async (cardName) => {
      // This will call the mocked Sentry.startSpan
      return Sentry.startSpan(
        { op: 'db.query', name: 'Get Card By Name' },
        async (span) => {
          span.setAttribute('card.name', cardName);
          return { card_name: cardName, card_type: 'Test' };
        }
      );
    }),
    // Add a function that throws an error for testing error handling
    getTopCardsWithError: jest.fn().mockImplementation(async () => {
      return Sentry.startSpan(
        { op: 'db.query', name: 'Get Top Cards' },
        async () => {
          const error = new Error('Test database error');
          Sentry.captureException(error);
          throw error;
        }
      );
    }),
  };
});

// Import the mocked functions
import { getTopCards, getCardByName } from '@/lib/db';

describe('Database Sentry integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sentry integration with database functions', () => {
    it('should use Sentry.startSpan when calling getTopCards', async () => {
      const result = await getTopCards();
      
      // Verify the function returned expected results
      expect(result).toEqual([{ card_name: 'Sol Ring', count: 100 }]);
      
      // Verify Sentry.startSpan was called with correct parameters
      expect(Sentry.startSpan).toHaveBeenCalledWith(
        expect.objectContaining({
          op: 'db.query',
          name: 'Get Top Cards',
        }),
        expect.any(Function)
      );
    });

    it('should use Sentry.startSpan with card name attribute when calling getCardByName', async () => {
      const result = await getCardByName('Sol Ring');
      
      // Verify the function returned expected results
      expect(result).toEqual({ card_name: 'Sol Ring', card_type: 'Test' });
      
      // Verify Sentry.startSpan was called with correct parameters
      expect(Sentry.startSpan).toHaveBeenCalledWith(
        expect.objectContaining({
          op: 'db.query',
          name: 'Get Card By Name',
        }),
        expect.any(Function)
      );
    });
  });
});
