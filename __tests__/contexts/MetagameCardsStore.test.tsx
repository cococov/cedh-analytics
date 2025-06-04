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

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import MetagameCardsContext, { MetagameCardsProvider } from '@/contexts/metagameCardsStore';
import * as Sentry from '@sentry/nextjs';

// Mock the fetch functions
jest.mock('@/utils/fetch/cardData', () => {
  return jest.fn().mockResolvedValue({
    cardImage: 'https://example.com/card.jpg',
    cardType: 'Creature',
    cardText: 'Test card text',
    averagePrice: '10.50',
    gathererId: 12345,
    cardFaces: [{ type_line: 'Creature' }],
    isReservedList: false,
    isDoubleFace: false
  });
});

jest.mock('@/utils/fetch/getDecklistsForCardByContext', () => {
  return jest.fn().mockResolvedValue({
    occurrences: 42,
    percentage: 75.5,
    decklists: [
      {
        commanders: 'Test Commander',
        decks: [
          { name: 'Test Deck', url: 'https://example.com/deck', commanders: [{ name: 'Test Commander', color_identity: ['R', 'G'] }] }
        ],
        colorIdentity: ['R', 'G']
      }
    ]
  });
});

describe('MetagameCardsContext and MetagameCardsProvider', () => {
  const TestComponent = () => {
    const {
      occurrencesForCard,
      isLoadingDeckLists,
      isLoadingCard,
      decklists,
      selectedCard,
      cardData,
      handleChangeCard
    } = React.useContext(MetagameCardsContext);
    
    return (
      <div>
        <div data-testid="occurrences">{occurrencesForCard.occurrences}</div>
        <div data-testid="percentage">{occurrencesForCard.percentage}</div>
        <div data-testid="loading-decklists">{isLoadingDeckLists.toString()}</div>
        <div data-testid="loading-card">{isLoadingCard.toString()}</div>
        <div data-testid="decklists-length">{decklists.length}</div>
        <div data-testid="selected-card">{selectedCard}</div>
        <div data-testid="card-image">{cardData.cardImage}</div>
        <div data-testid="card-type">{cardData.cardType}</div>
        <button 
          data-testid="change-card-button" 
          onClick={() => handleChangeCard('Sol Ring')}
        >
          Change Card
        </button>
        <button 
          data-testid="change-card-undefined-button" 
          onClick={() => handleChangeCard(undefined)}
        >
          Change Card to Undefined
        </button>
        <button 
          data-testid="change-card-same-button" 
          onClick={() => handleChangeCard('Sol Ring')}
        >
          Change to Same Card
        </button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides default values', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'MetagameCardsContext default values test',
      },
      () => {
        render(
          <MetagameCardsProvider>
            <TestComponent />
          </MetagameCardsProvider>
        );

        expect(screen.getByTestId('occurrences')).toHaveTextContent('0');
        expect(screen.getByTestId('percentage')).toHaveTextContent('0');
        expect(screen.getByTestId('loading-decklists')).toHaveTextContent('false');
        expect(screen.getByTestId('loading-card')).toHaveTextContent('false');
        expect(screen.getByTestId('decklists-length')).toHaveTextContent('0');
        expect(screen.getByTestId('selected-card')).toHaveTextContent('');
        expect(screen.getByTestId('card-image')).toHaveTextContent('');
        expect(screen.getByTestId('card-type')).toHaveTextContent('');
      }
    );
  });

  it('updates state when handleChangeCard is called', async () => {
    const getDecklistsMock = require('@/utils/fetch/getDecklistsForCardByContext');
    const fetchCardsMock = require('@/utils/fetch/cardData');

    render(
      <MetagameCardsProvider>
        <TestComponent />
      </MetagameCardsProvider>
    );

    // Initial state
    expect(screen.getByTestId('loading-decklists')).toHaveTextContent('false');
    expect(screen.getByTestId('loading-card')).toHaveTextContent('false');
    expect(screen.getByTestId('selected-card')).toHaveTextContent('');

    // Change card
    act(() => {
      screen.getByTestId('change-card-button').click();
    });

    // Loading state should be true immediately after click
    expect(screen.getByTestId('loading-decklists')).toHaveTextContent('true');
    expect(screen.getByTestId('loading-card')).toHaveTextContent('true');
    expect(screen.getByTestId('selected-card')).toHaveTextContent('Sol Ring');

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('loading-decklists')).toHaveTextContent('false');
      expect(screen.getByTestId('loading-card')).toHaveTextContent('false');
    });

    // Check that data was loaded correctly
    expect(screen.getByTestId('occurrences')).toHaveTextContent('42');
    expect(screen.getByTestId('percentage')).toHaveTextContent('75.5');
    expect(screen.getByTestId('decklists-length')).toHaveTextContent('1');
    expect(screen.getByTestId('card-image')).toHaveTextContent('https://example.com/card.jpg');
    expect(screen.getByTestId('card-type')).toHaveTextContent('Creature');

    // Verify that the fetch functions were called with correct parameters
    expect(getDecklistsMock).toHaveBeenCalledWith('Sol Ring', 'metagame_cards');
    expect(fetchCardsMock).toHaveBeenCalledWith('Sol%20Ring');
  });

  it('handles undefined card name', async () => {
    render(
      <MetagameCardsProvider>
        <TestComponent />
      </MetagameCardsProvider>
    );

    // Change card to undefined
    act(() => {
      screen.getByTestId('change-card-undefined-button').click();
    });

    expect(screen.getByTestId('selected-card')).toHaveTextContent('');
    expect(screen.getByTestId('loading-decklists')).toHaveTextContent('true');
    expect(screen.getByTestId('loading-card')).toHaveTextContent('true');
  });

  it('does not fetch data if the selected card is the same', async () => {
    const getDecklistsMock = require('@/utils/fetch/getDecklistsForCardByContext');
    const fetchCardsMock = require('@/utils/fetch/cardData');

    render(
      <MetagameCardsProvider>
        <TestComponent />
      </MetagameCardsProvider>
    );

    // Change card first time
    act(() => {
      screen.getByTestId('change-card-button').click();
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('loading-decklists')).toHaveTextContent('false');
    });

    // Reset mocks to check if they're called again
    getDecklistsMock.mockClear();
    fetchCardsMock.mockClear();

    // Change to the same card again
    act(() => {
      screen.getByTestId('change-card-same-button').click();
    });

    // Should not trigger loading or fetch calls
    expect(getDecklistsMock).not.toHaveBeenCalled();
    expect(fetchCardsMock).not.toHaveBeenCalled();
  });

  it('properly formats card name for API request', async () => {
    const fetchCardsMock = require('@/utils/fetch/cardData');
    
    // Create a component that directly calls handleChangeCard with a specific card name
    const TestCardNameComponent = () => {
      const { handleChangeCard } = React.useContext(MetagameCardsContext);
      
      // Use useEffect to call handleChangeCard once the component is mounted
      React.useEffect(() => {
        handleChangeCard('Thassa\'s Oracle');
      }, [handleChangeCard]);
      
      return <div>Testing card name formatting</div>;
    };
    
    render(
      <MetagameCardsProvider>
        <TestCardNameComponent />
      </MetagameCardsProvider>
    );

    // Wait for data to load
    await waitFor(() => {
      // Verify that the fetch function was called with properly encoded card name
      expect(fetchCardsMock).toHaveBeenCalledWith('Thassa\'s%20Oracle');
    });
  });
});
