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

import fetchCardData from '@/utils/fetch/cardData';
import * as Sentry from '@sentry/nextjs';

// Mock the fetch function
global.fetch = jest.fn();

describe('fetchCardData utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch card data successfully', async () => {
    // Mock successful API responses
    const mockCardData = {
      name: 'Sol Ring',
      card_faces: null,
      type_line: 'Artifact',
      cmc: 1,
      color_identity: [],
      rarity: 'common',
      oracle_text: '{T}: Add {C}{C}.',
      multiverse_ids: [123456],
      prices: { usd: '30.00', usd_foil: '60.00' },
      reserved: false,
      image_uris: { normal: 'https://example.com/sol-ring.jpg' },
      prints_search_uri: 'https://api.scryfall.com/cards/search?prints=sol-ring'
    };

    const mockPrintsData = {
      data: [
        {
          multiverse_ids: [123456],
          digital: false,
          oversized: false,
          border_color: 'black',
          set_name: 'Commander',
          prices: { usd: '30.00', usd_foil: '60.00' }
        }
      ]
    };

    // Setup the mock fetch responses
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockCardData)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockPrintsData)
      }));

    const result = await fetchCardData('Sol Ring');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith('https://api.scryfall.com/cards/named?exact=Sol Ring');
    expect(result).toEqual({
      error: false,
      cardName: 'Sol Ring',
      cardType: 'Artifact',
      cmc: 1,
      colorIdentity: [],
      rarity: 'common',
      cardText: '{T}: Add {C}{C}.',
      gathererId: 123456,
      averagePrice: '30.00',
      isReservedList: false,
      cardImage: 'https://example.com/sol-ring.jpg',
      cardFaces: [],
      isDoubleFace: false
    });
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('should handle double-faced cards correctly', async () => {
    // Mock double-faced card response
    const mockCardData = {
      name: 'Delver of Secrets',
      card_faces: [
        {
          oracle_text: 'At the beginning of your upkeep, look at the top card of your library. You may reveal that card. If an instant or sorcery card is revealed this way, transform Delver of Secrets.',
          type_line: 'Creature — Human Wizard',
          image_uris: { normal: 'https://example.com/delver-front.jpg' }
        },
        {
          oracle_text: 'Flying',
          type_line: 'Creature — Human Insect',
          image_uris: { normal: 'https://example.com/delver-back.jpg' }
        }
      ],
      cmc: 1,
      color_identity: ['U'],
      rarity: 'uncommon',
      multiverse_ids: [226749],
      prices: { usd: '5.00', usd_foil: '15.00' },
      reserved: false,
      prints_search_uri: 'https://api.scryfall.com/cards/search?prints=delver-of-secrets'
    };

    const mockPrintsData = {
      data: [
        {
          multiverse_ids: [226749],
          digital: false,
          oversized: false,
          border_color: 'black',
          set_name: 'Innistrad',
          prices: { usd: '5.00', usd_foil: '15.00' }
        }
      ]
    };

    // Setup the mock fetch responses
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockCardData)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockPrintsData)
      }));

    const result = await fetchCardData('Delver of Secrets');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result.isDoubleFace).toBe(true);
    expect(result.cardText).toBe('At the beginning of your upkeep, look at the top card of your library. You may reveal that card. If an instant or sorcery card is revealed this way, transform Delver of Secrets.--DIVIDE--Flying');
    expect(result.cardImage).toBe('https://example.com/delver-front.jpg');
  });

  it('should handle errors and return default object', async () => {
    // Mock a failed API response
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      status: 404,
      json: () => Promise.resolve({ error: 'Card not found' })
    }));

    const result = await fetchCardData('NonexistentCard');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: true,
      cardName: '',
      cardType: '',
      cmc: 0,
      colorIdentity: [],
      rarity: '',
      cardText: '',
      gathererId: 0,
      averagePrice: 0,
      isReservedList: false,
      cardImage: [],
      cardFaces: [],
      isDoubleFace: false
    });
  });
});
