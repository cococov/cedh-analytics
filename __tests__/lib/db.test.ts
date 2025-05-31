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

// Mock Sentry to isolate database tests
jest.mock('@sentry/nextjs', () => ({
  startSpan: jest.fn((_, callback) => callback({ setAttribute: jest.fn() })),
  captureException: jest.fn(),
}));

// Mock the kysely module
jest.mock('kysely', () => {
  const mockSelectFrom = jest.fn();
  const mockWhere = jest.fn();
  const mockExecute = jest.fn();
  const mockLimit = jest.fn();
  const mockOffset = jest.fn();
  const mockOrderBy = jest.fn();
  const mockSelectAll = jest.fn();

  return {
    PostgresDialect: jest.fn(),
    Kysely: jest.fn().mockImplementation(() => ({
      selectFrom: mockSelectFrom.mockReturnThis(),
      where: mockWhere.mockReturnThis(),
      execute: mockExecute,
      limit: mockLimit.mockReturnThis(),
      offset: mockOffset.mockReturnThis(),
      orderBy: mockOrderBy.mockReturnThis(),
      selectAll: mockSelectAll.mockReturnThis(),
    })),
    sql: {
      raw: jest.fn((str) => str),
    },
  };
});

// Mock the pg module
jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue({
        query: jest.fn(),
        release: jest.fn(),
      }),
      end: jest.fn(),
    })),
  };
});

// Import after mocking
import { db, getTopCards, getCardByName } from '@/lib/db';

describe('Database functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopCards', () => {
    it('should fetch top cards with default parameters', async () => {
      const mockCards = [
        { card_name: 'Sol Ring', count: 100 },
        { card_name: 'Command Tower', count: 90 },
      ];

      // Mock the execute function
      const mockExecute = jest.fn().mockResolvedValue(mockCards);
      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        execute: mockExecute,
      });

      const result = await getTopCards();

      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
    });

    it('should handle errors properly', async () => {
      const mockError = new Error('Database error');

      // Mock the execute function to throw an error
      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(mockError),
      });

      // Call the function and expect it to throw
      await expect(getTopCards()).rejects.toThrow('Database error');
    });
  });

  describe('getCardByName', () => {
    it('should fetch a card by name', async () => {
      const mockCard = {
        card_name: 'Sol Ring',
        card_type: 'Artifact',
        cmc: 1,
        color_identity: '[]',
      };

      // Mock the execute function
      const mockExecute = jest.fn().mockResolvedValue([mockCard]);
      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: mockExecute,
      });

      const result = await getCardByName('Sol Ring');

      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockCard);
    });

    it('should return null when card is not found', async () => {
      // Mock empty result
      const mockExecute = jest.fn().mockResolvedValue([]);
      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: mockExecute,
      });

      const result = await getCardByName('Nonexistent Card');

      expect(mockExecute).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
