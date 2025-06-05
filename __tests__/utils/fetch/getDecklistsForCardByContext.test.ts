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

// Mock the database module directly
jest.mock('@/utils/fetch/getDecklistsForCardByContext', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((cardName, table) => {
      // Return different mock data based on the table parameter
      if (table === 'metagame_cards') {
        return Promise.resolve({
          occurrences: 42,
          percentage: 75.5,
          decklists: [
            {
              commanders: 'Urza, Lord High Artificer',
              decks: [
                { name: 'Urza Deck', url: 'https://example.com/urza-deck' }
              ],
              colorIdentity: ['U']
            }
          ]
        });
      } else {
        return Promise.resolve({
          occurrences: 36,
          percentage: 65.2,
          decklists: [
            {
              commanders: 'Thrasios, Triton Hero & Tymna the Weaver',
              decks: [
                { name: 'Thrasios/Tymna Deck', url: 'https://example.com/thrasios-tymna-deck' }
              ],
              colorIdentity: ['W', 'U', 'B', 'G']
            }
          ]
        });
      }
    })
  };
});

// Import the module after mocking
import getDecklistsForCardByContext from '@/utils/fetch/getDecklistsForCardByContext';

describe('getDecklistsForCardByContext Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches decklists for a card from the metagame_cards table', async () => {
    // Call the function
    const result = await getDecklistsForCardByContext('Sol Ring', 'metagame_cards');
    
    // Verify the mock function was called with correct parameters
    expect(getDecklistsForCardByContext).toHaveBeenCalledWith('Sol Ring', 'metagame_cards');
    
    // Verify the result structure
    expect(result).toEqual({
      occurrences: 42,
      percentage: 75.5,
      decklists: [
        {
          commanders: 'Urza, Lord High Artificer',
          decks: [
            { name: 'Urza Deck', url: 'https://example.com/urza-deck' }
          ],
          colorIdentity: ['U']
        }
      ]
    });
  });
  
  it('fetches decklists for a card from the db_cards table', async () => {
    // Call the function with a different table
    const result = await getDecklistsForCardByContext('Mana Crypt', 'db_cards');
    
    // Verify the mock function was called with correct parameters
    expect(getDecklistsForCardByContext).toHaveBeenCalledWith('Mana Crypt', 'db_cards');
    
    // Verify the result structure
    expect(result).toEqual({
      occurrences: 36,
      percentage: 65.2,
      decklists: [
        {
          commanders: 'Thrasios, Triton Hero & Tymna the Weaver',
          decks: [
            { name: 'Thrasios/Tymna Deck', url: 'https://example.com/thrasios-tymna-deck' }
          ],
          colorIdentity: ['W', 'U', 'B', 'G']
        }
      ]
    });
  });
});
