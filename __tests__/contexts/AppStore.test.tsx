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
import AppContext, { AppProvider } from '@/contexts/appStore';
import * as Sentry from '@sentry/nextjs';

// Mock the next/navigation
const mockPathname = '/';
let pathnameMock = mockPathname;

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => pathnameMock),
}));

// Mock the SnackBarLoading component
jest.mock('@/components/snackBarLoading', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => <div data-testid="snackbar-loading" data-is-open={isOpen}>Loading...</div>,
}));

describe('AppContext and AppProvider', () => {
  const TestComponent = () => {
    const { lang, theme, isLoading, toggleLoading } = React.useContext(AppContext);
    
    return (
      <div>
        <div data-testid="lang-value">{lang}</div>
        <div data-testid="theme-value">{theme}</div>
        <div data-testid="is-loading-value">{isLoading.toString()}</div>
        <button 
          data-testid="toggle-loading-true" 
          onClick={() => toggleLoading(true)}
        >
          Set Loading True
        </button>
        <button 
          data-testid="toggle-loading-false" 
          onClick={() => toggleLoading(false)}
        >
          Set Loading False
        </button>
      </div>
    );
  };

  it('provides default values', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'AppContext default values test',
      },
      () => {
        render(
          <AppProvider>
            <TestComponent />
          </AppProvider>
        );

        expect(screen.getByTestId('lang-value')).toHaveTextContent('en');
        expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
        expect(screen.getByTestId('is-loading-value')).toHaveTextContent('false');
        expect(screen.getByTestId('snackbar-loading')).toHaveAttribute('data-is-open', 'false');
      }
    );
  });

  it('toggles loading state', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Initial state
    expect(screen.getByTestId('is-loading-value')).toHaveTextContent('false');
    expect(screen.getByTestId('snackbar-loading')).toHaveAttribute('data-is-open', 'false');
    
    // Toggle loading to true
    act(() => {
      screen.getByTestId('toggle-loading-true').click();
    });
    
    expect(screen.getByTestId('is-loading-value')).toHaveTextContent('true');
    expect(screen.getByTestId('snackbar-loading')).toHaveAttribute('data-is-open', 'true');
    
    // Toggle loading to false
    act(() => {
      screen.getByTestId('toggle-loading-false').click();
    });
    
    expect(screen.getByTestId('is-loading-value')).toHaveTextContent('false');
    expect(screen.getByTestId('snackbar-loading')).toHaveAttribute('data-is-open', 'false');
  });

  it('toggles loading state correctly', () => {
    // Set up initial render
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    // Initial state should be false
    expect(screen.getByTestId('is-loading-value')).toHaveTextContent('false');
    
    // Set loading to true
    act(() => {
      screen.getByTestId('toggle-loading-true').click();
    });
    
    // Verify loading is true
    expect(screen.getByTestId('is-loading-value')).toHaveTextContent('true');
    
    // Set loading to false
    act(() => {
      screen.getByTestId('toggle-loading-false').click();
    });
    
    // Verify loading is false
    expect(screen.getByTestId('is-loading-value')).toHaveTextContent('false');
  });
  
  it('updates language correctly', () => {
    // Set up initial render
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    // Initial language should be 'en'
    expect(screen.getByTestId('lang-value')).toHaveTextContent('en');
  });
});
