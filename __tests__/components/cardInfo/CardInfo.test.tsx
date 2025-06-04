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
import { render, screen } from '@testing-library/react';
import * as Sentry from '@sentry/nextjs';
import CardInfo from '@/components/cardInfo';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, placeholder, blurDataURL, priority, ...props }: any) => {
    // Using a div instead of img to avoid ESLint warnings
    return (
      <div
        data-testid="next-image-mock"
        style={{ width, height }}
        {...props}
      >
        <span data-testid="next-image-src">{src}</span>
        <span data-testid="next-image-alt">{alt}</span>
        <span data-testid="next-image-placeholder">{placeholder}</span>
        <span data-testid="next-image-blur-url">{blurDataURL}</span>
        <span data-testid="next-image-priority">{priority ? 'true' : 'false'}</span>
      </div>
    );
  }
}));

// Mock MaterialTooltip
jest.mock('@/components/vendor/materialUi', () => ({
  MaterialTooltip: ({ children, title, 'aria-label': ariaLabel }: any) => (
    <div data-testid="material-tooltip" data-title={title} aria-label={ariaLabel}>
      {children}
    </div>
  )
}));

// Mock CircularProgress
jest.mock('@heroui/react', () => ({
  CircularProgress: ({ size, color, 'aria-label': ariaLabel }: any) => (
    <div 
      data-testid="circular-progress"
      data-size={size}
      data-color={color}
      aria-label={ariaLabel}
    />
  )
}));

// Mock card back image
jest.mock('@/public/images/mtg-back.jpg', () => 'card-back-image-path');

// Mock CSS module
jest.mock('@/styles/CardsList.module.css', () => ({
  cardInfoContainer: 'mock-card-info-container',
  cardInfo: 'mock-card-info',
  cardImage: 'mock-card-image',
  cardTextContainerLoading: 'mock-card-text-container-loading',
  cardTextContainer: 'mock-card-text-container',
  cardName: 'mock-card-name',
  cardType: 'mock-card-type',
  cardText: 'mock-card-text',
  cardGatherer: 'mock-card-gatherer',
  cardGathererDisabled: 'mock-card-gatherer-disabled',
  cardReservedListContainer: 'mock-card-reserved-list-container',
  cardReservedList: 'mock-card-reserved-list',
  cardTextContainerNoCardSelected: 'mock-card-text-container-no-card-selected',
  noCardSelected: 'mock-no-card-selected'
}));

describe('CardInfo Component', () => {
  // Default mock card data
  const mockCardData = {
    cardImage: 'https://example.com/card.jpg',
    cardType: 'Artifact',
    cardText: 'This is a test card.',
    averagePrice: 10.99,
    gathererId: 123456,
    cardFaces: [],
    isDoubleFace: false,
    isReservedList: false
  };

  it('renders loading state correctly', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'CardInfo loading state test',
      },
      () => {
        render(
          <CardInfo 
            selectedCard="Sol Ring" 
            isLoading={true} 
            cardData={mockCardData} 
          />
        );
        
        // Should show card back image when loading
        const cardBackImageMock = screen.getByTestId('next-image-mock');
        expect(cardBackImageMock).toBeInTheDocument();
        
        const cardBackImageSrc = screen.getByTestId('next-image-src');
        expect(cardBackImageSrc).toHaveTextContent('card-back-image-path');
        
        const cardBackImageAlt = screen.getByTestId('next-image-alt');
        expect(cardBackImageAlt).toHaveTextContent('Card placeholder');
        
        // Should show loading spinner
        const loadingSpinner = screen.getByTestId('circular-progress');
        expect(loadingSpinner).toBeInTheDocument();
        expect(loadingSpinner).toHaveAttribute('data-size', 'lg');
        expect(loadingSpinner).toHaveAttribute('data-color', 'secondary');
      }
    );
  });

  it('renders card data correctly when not loading', () => {
    render(
      <CardInfo 
        selectedCard="Sol Ring" 
        isLoading={false} 
        cardData={mockCardData} 
      />
    );
    
    // Should show card image
    const cardImageMock = screen.getByTestId('next-image-mock');
    expect(cardImageMock).toBeInTheDocument();
    
    const cardImageSrc = screen.getByTestId('next-image-src');
    expect(cardImageSrc).toHaveTextContent('https://example.com/card.jpg');
    
    const cardImageAlt = screen.getByTestId('next-image-alt');
    expect(cardImageAlt).toHaveTextContent('Sol Ring image');
    
    // Should show card details
    expect(screen.getByText('Sol Ring')).toBeInTheDocument();
    expect(screen.getByText('Artifact')).toBeInTheDocument();
    expect(screen.getByText('This is a test card.')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    
    // Should show gatherer link
    const gathererLink = screen.getByText('Gatherer');
    expect(gathererLink).toBeInTheDocument();
    expect(gathererLink).toHaveAttribute('href', 'https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=123456');
  });

  it('renders no card selected state correctly', () => {
    render(
      <CardInfo 
        selectedCard="" 
        isLoading={false} 
        cardData={mockCardData} 
      />
    );
    
    // Should show card back image when no card selected
    const cardBackImageMock = screen.getByTestId('next-image-mock');
    expect(cardBackImageMock).toBeInTheDocument();
    
    const cardBackImageSrc = screen.getByTestId('next-image-src');
    expect(cardBackImageSrc).toHaveTextContent('card-back-image-path');
    
    const cardBackImageAlt = screen.getByTestId('next-image-alt');
    expect(cardBackImageAlt).toHaveTextContent('Card placeholder');
    
    // Should show no card selected message
    expect(screen.getByText('NO CARD SELECTED')).toBeInTheDocument();
  });

  it('renders double-faced cards correctly', () => {
    const doubleFacedCardData = {
      ...mockCardData,
      cardType: 'Creature — Human Wizard', // Override cardType to match first face
      cardText: 'Front face text.--DIVIDE--Back face text.',
      cardFaces: [
        { type_line: 'Creature — Human Wizard' },
        { type_line: 'Creature — Human Insect' }
      ],
      isDoubleFace: true
    };
    
    render(
      <CardInfo 
        selectedCard="Delver of Secrets" 
        isLoading={false} 
        cardData={doubleFacedCardData} 
      />
    );
    
    // Should show both card faces
    expect(screen.getByText('Front face text.')).toBeInTheDocument();
    expect(screen.getByText('Back face text.')).toBeInTheDocument();
    
    // Should show both card types
    const cardTypeWizard = screen.getByText('Creature — Human Wizard');
    expect(cardTypeWizard).toBeInTheDocument();
    
    const cardTypeInsect = screen.getByText('Creature — Human Insect');
    expect(cardTypeInsect).toBeInTheDocument();
  });

  it('renders reserved list indicator correctly', () => {
    const reservedListCardData = {
      ...mockCardData,
      isReservedList: true
    };
    
    render(
      <CardInfo 
        selectedCard="Black Lotus" 
        isLoading={false} 
        cardData={reservedListCardData} 
      />
    );
    
    // Should show reserved list indicator
    const reservedListIndicator = screen.getByText('💎');
    expect(reservedListIndicator).toBeInTheDocument();
    
    // Should be wrapped in a tooltip
    const tooltip = screen.getByTestId('material-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('data-title', 'Reserved List');
  });

  it('handles missing gatherer ID correctly', () => {
    const noGathererCardData = {
      ...mockCardData,
      gathererId: 0
    };
    
    render(
      <CardInfo 
        selectedCard="Custom Card" 
        isLoading={false} 
        cardData={noGathererCardData} 
      />
    );
    
    // Should show disabled gatherer link
    const disabledGatherer = screen.getByText('Gatherer');
    expect(disabledGatherer).toBeInTheDocument();
    expect(disabledGatherer).toHaveAttribute('title', 'Has no gatherer.');
  });
});
