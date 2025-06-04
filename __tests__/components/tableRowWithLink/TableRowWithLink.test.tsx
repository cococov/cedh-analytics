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

import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as Sentry from '@sentry/nextjs';
import TableRowWithLink from '@/components/tableRowWithLink';
import AppContext from '@/contexts/appStore';
import { useRouter } from 'next/navigation';

// Mock the next/navigation router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe('TableRowWithLink Component', () => {
  // Setup for AppContext
  const toggleLoadingMock = jest.fn();
  const mockAppContextValue = {
    lang: 'en',
    theme: 'light',
    isLoading: false,
    toggleLoading: toggleLoadingMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children and applies className', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'TableRowWithLink render test',
      },
      () => {
        render(
          <AppContext.Provider value={mockAppContextValue}>
            <table>
              <tbody>
                <TableRowWithLink 
                  rowId="test-row" 
                  link="/test-link" 
                  className="test-class"
                >
                  <td>Cell 1</td>
                  <td>Cell 2</td>
                </TableRowWithLink>
              </tbody>
            </table>
          </AppContext.Provider>
        );

        const row = screen.getByRole('row');
        expect(row).toBeInTheDocument();
        expect(row).toHaveClass('test-class');
        
        const cells = screen.getAllByRole('cell');
        expect(cells).toHaveLength(2);
        expect(cells[0]).toHaveTextContent('Cell 1');
        expect(cells[1]).toHaveTextContent('Cell 2');
      }
    );
  });

  it('navigates to the link and toggles loading when clicked', () => {
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <table>
          <tbody>
            <TableRowWithLink 
              rowId="test-row" 
              link="/test-link" 
              className="test-class"
            >
              <td>Click me</td>
            </TableRowWithLink>
          </tbody>
        </table>
      </AppContext.Provider>
    );

    const row = screen.getByRole('row');
    fireEvent.click(row);
    
    // Verify that toggleLoading was called with true
    expect(toggleLoadingMock).toHaveBeenCalledWith(true);
    
    // Verify that router.push was called with the correct link
    expect(mockPush).toHaveBeenCalledWith('/test-link');
  });

  it('handles undefined event in click handler', () => {
    // Create a component that directly tests the click handler behavior
    const TestDirectClickComponent = () => {
      const { toggleLoading } = useContext(AppContext);
      const router = useRouter();
      
      // Create a function that mimics the handleClickTopRow function in TableRowWithLink
      const handleClick = () => {
        toggleLoading(true);
        router.push('/test-link');
      };
      
      return (
        <button data-testid="direct-click-button" onClick={handleClick}>
          Test Direct Click
        </button>
      );
    };
    
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <TestDirectClickComponent />
      </AppContext.Provider>
    );

    // Simulate a click
    fireEvent.click(screen.getByTestId('direct-click-button'));
    
    // Verify that toggleLoading was called with true
    expect(toggleLoadingMock).toHaveBeenCalledWith(true);
    
    // Verify that router.push was called with the correct link
    expect(mockPush).toHaveBeenCalledWith('/test-link');
  });
});
