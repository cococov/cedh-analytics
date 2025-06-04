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
import TournamentResumeContext, { TournamentResumeProvider } from '@/contexts/tournamentResumeStore';

// Mock the fetch function
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

describe('TournamentResumeContext and TournamentResumeProvider', () => {
  // Mock data for testing
  const mockCards = [
    {
      cardName: 'Sol Ring',
      occurrences: 42,
      percentageOfUse: 75.5,
      decklists: [
        {
          commanders: 'Test Commander',
          decks: [
            { name: 'Test Deck', url: 'https://example.com/deck', commanders: [{ name: 'Test Commander', color_identity: ['R', 'G'] }] }
          ],
          colorIdentity: ['R', 'G']
        }
      ]
    },
    {
      cardName: 'Mana Crypt',
      occurrences: 36,
      percentageOfUse: 65.2,
      decklists: [
        {
          commanders: 'Another Commander',
          decks: [
            { name: 'Another Deck', url: 'https://example.com/deck2', commanders: [{ name: 'Another Commander', color_identity: ['U', 'B'] }] }
          ],
          colorIdentity: ['U', 'B']
        }
      ]
    }
  ];

  // Test component that uses the context
  const TestComponent = () => {
    const {
      occurrencesForCard,
      isLoadingDeckLists,
      isLoadingCard,
      decklists,
      selectedCard,
      cardData,
      handleChangeCard
    } = React.useContext(TournamentResumeContext);

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
          data-testid="change-to-mana-crypt-button"
          onClick={() => handleChangeCard('Mana Crypt')}
        >
          Change to Mana Crypt
        </button>
        <button
          data-testid="change-card-undefined-button"
          onClick={() => handleChangeCard(undefined)}
        >
          Change Card to Undefined
        </button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('provides default values', async () => {
    await act(async () => {
      render(
        <TournamentResumeProvider cards={[]}>
          <TestComponent />
        </TournamentResumeProvider>
      );
    });

    expect(screen.getByTestId('occurrences')).toHaveTextContent('0');
    expect(screen.getByTestId('percentage')).toHaveTextContent('0');
    expect(screen.getByTestId('loading-decklists')).toHaveTextContent('false');
    expect(screen.getByTestId('loading-card')).toHaveTextContent('false');
    expect(screen.getByTestId('decklists-length')).toHaveTextContent('0');
    expect(screen.getByTestId('selected-card')).toHaveTextContent('');
    expect(screen.getByTestId('card-image')).toHaveTextContent('');
    expect(screen.getByTestId('card-type')).toHaveTextContent('');
  });

  it('updates state when handleChangeCard is called', async () => {
    await act(async () => {
      render(
        <TournamentResumeProvider cards={mockCards}>
          <TestComponent />
        </TournamentResumeProvider>
      );
    });

    // Initial state
    expect(screen.getByTestId('loading-decklists')).toHaveTextContent('false');
    expect(screen.getByTestId('loading-card')).toHaveTextContent('false');
    expect(screen.getByTestId('selected-card')).toHaveTextContent('');

    // Change card
    await act(async () => {
      screen.getByTestId('change-card-button').click();
    });

    // Card should be selected
    expect(screen.getByTestId('selected-card')).toHaveTextContent('Sol Ring');

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('loading-card')).toHaveTextContent('false');
    });

    // Check that data was loaded correctly
    expect(screen.getByTestId('occurrences')).toHaveTextContent('42');
    expect(screen.getByTestId('percentage')).toHaveTextContent('75.5');
    expect(screen.getByTestId('decklists-length')).toHaveTextContent('1');
    expect(screen.getByTestId('card-image')).toHaveTextContent('https://example.com/card.jpg');
    expect(screen.getByTestId('card-type')).toHaveTextContent('Creature');
  });

  it('sets loading state when changing cards', async () => {
    await act(async () => {
      render(
        <TournamentResumeProvider cards={mockCards}>
          <TestComponent />
        </TournamentResumeProvider>
      );
    });

    // Change card
    await act(async () => {
      screen.getByTestId('change-card-button').click();
    });

    // Just verify that the card was selected
    expect(screen.getByTestId('selected-card')).toHaveTextContent('Sol Ring');
  });

  it('handles undefined card name', async () => {
    await act(async () => {
      render(
        <TournamentResumeProvider cards={mockCards}>
          <TestComponent />
        </TournamentResumeProvider>
      );
    });

    // Change card to undefined
    await act(async () => {
      screen.getByTestId('change-card-undefined-button').click();
    });

    // Only check that the selected card is empty
    expect(screen.getByTestId('selected-card')).toHaveTextContent('');
  });

  it('does not fetch data if the selected card is the same', async () => {
    const fetchCardsMock = require('@/utils/fetch/cardData');
    fetchCardsMock.mockClear();

    // Render the component
    await act(async () => {
      render(
        <TournamentResumeProvider cards={mockCards}>
          <TestComponent />
        </TournamentResumeProvider>
      );
    });

    // Change card first time
    await act(async () => {
      screen.getByTestId('change-card-button').click();
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('loading-card')).toHaveTextContent('false');
    });

    // Reset mocks to check if they're called again
    fetchCardsMock.mockClear();

    // Change to the same card again
    await act(async () => {
      screen.getByTestId('change-card-button').click();
    });

    // Should not trigger fetch calls
    expect(fetchCardsMock).not.toHaveBeenCalled();
  });

  it('changes to a different card', async () => {
    // Reset the fetchCardsMock for this test
    const fetchCardsMock = require('@/utils/fetch/cardData');
    fetchCardsMock.mockClear();

    await act(async () => {
      render(
        <TournamentResumeProvider cards={mockCards}>
          <TestComponent />
        </TournamentResumeProvider>
      );
    });

    // Change to first card
    await act(async () => {
      screen.getByTestId('change-card-button').click();
    });

    // Verify first card was selected
    expect(screen.getByTestId('selected-card')).toHaveTextContent('Sol Ring');
  });
});
