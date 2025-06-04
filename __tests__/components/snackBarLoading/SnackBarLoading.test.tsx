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
import SnackBarLoading from '@/components/snackBarLoading';

// Mock MUI Snackbar
jest.mock('@mui/material/Snackbar', () => {
  return {
    __esModule: true,
    default: ({ children, open, autoHideDuration }: { 
      children: React.ReactNode; 
      open: boolean; 
      autoHideDuration: number;
    }) => (
      <div 
        data-testid="mui-snackbar" 
        data-open={open} 
        data-auto-hide-duration={autoHideDuration}
      >
        {children}
      </div>
    )
  };
});

// Mock NextUI CircularProgress
jest.mock('@heroui/react', () => ({
  CircularProgress: ({ size, color, 'aria-label': ariaLabel }: { 
    size: string; 
    color: string; 
    'aria-label': string;
  }) => (
    <div 
      data-testid="nextui-circular-progress" 
      data-size={size} 
      data-color={color}
      aria-label={ariaLabel}
    >
      Loading Spinner
    </div>
  )
}));

// Mock CSS module
jest.mock('@/styles/SnackbarLoading.module.css', () => ({
  snackBarLoadingBase: 'snackbar-loading-base-class',
  mtgLoadingContainer: 'mtg-loading-container-class',
  snackBarLoadingText: 'snackbar-loading-text-class'
}));

describe('SnackBarLoading Component', () => {
  it('renders when isOpen is true', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'SnackBarLoading render test',
      },
      () => {
        render(<SnackBarLoading isOpen={true} />);
        
        const snackbar = screen.getByTestId('mui-snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveAttribute('data-open', 'true');
        expect(snackbar).toHaveAttribute('data-auto-hide-duration', '6000');
        
        const circularProgress = screen.getByTestId('nextui-circular-progress');
        expect(circularProgress).toBeInTheDocument();
        expect(circularProgress).toHaveAttribute('data-size', 'sm');
        expect(circularProgress).toHaveAttribute('data-color', 'secondary');
        expect(circularProgress).toHaveAttribute('aria-label', 'Loading...');
        
        const loadingText = screen.getByText('Loading...');
        expect(loadingText).toBeInTheDocument();
        // The text is inside a span with the snackbar-loading-text-class
        expect(loadingText).toHaveClass('snackbar-loading-text-class');
      }
    );
  });

  it('renders when isOpen is false', () => {
    render(<SnackBarLoading isOpen={false} />);
    
    const snackbar = screen.getByTestId('mui-snackbar');
    expect(snackbar).toBeInTheDocument();
    expect(snackbar).toHaveAttribute('data-open', 'false');
  });
});
