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
import MaterialButton from '@/components/vendor/materialUi/button';
import MaterialChip from '@/components/vendor/materialUi/chip';
import MaterialTooltip from '@/components/vendor/materialUi/tooltip';

// Mock MUI components
jest.mock('@mui/material/Button', () => {
  return {
    __esModule: true,
    default: ({ 
      children, 
      variant, 
      color, 
      size, 
      onClick, 
      disabled 
    }: {
      children: React.ReactNode;
      variant?: 'text' | 'outlined' | 'contained';
      color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
      size?: 'small' | 'medium' | 'large';
      onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
      disabled?: boolean;
    }) => (
      <button 
        data-testid="mui-button" 
        data-variant={variant} 
        data-color={color} 
        data-size={size}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  };
});

jest.mock('@mui/material/Chip', () => {
  return {
    __esModule: true,
    default: ({ 
      label, 
      variant, 
      color, 
      size, 
      onClick, 
      onDelete 
    }: {
      label: React.ReactNode;
      variant?: 'outlined' | 'filled';
      color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
      size?: 'small' | 'medium';
      onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
      onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }) => (
      <div 
        data-testid="mui-chip" 
        data-variant={variant} 
        data-color={color} 
        data-size={size}
        data-has-delete={!!onDelete}
        onClick={onClick}
      >
        {label}
      </div>
    )
  };
});

jest.mock('@mui/material/Tooltip', () => {
  return {
    __esModule: true,
    default: ({ 
      children, 
      title, 
      placement, 
      arrow 
    }: {
      children: React.ReactElement;
      title: React.ReactNode;
      placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 
                'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
      arrow?: boolean;
    }) => (
      <div 
        data-testid="mui-tooltip" 
        data-title={title as string} 
        data-placement={placement} 
        data-arrow={arrow ? 'true' : 'false'}
      >
        {children}
      </div>
    )
  };
});

describe('Material UI Vendor Components', () => {
  describe('MaterialButton', () => {
    it('renders with default props', () => {
      Sentry.startSpan(
        {
          op: 'test',
          name: 'MaterialButton render test',
        },
        () => {
          render(<MaterialButton>Test Button</MaterialButton>);
          
          const button = screen.getByTestId('mui-button');
          expect(button).toBeInTheDocument();
          expect(button).toHaveTextContent('Test Button');
        }
      );
    });

    it('passes props to MUI Button', () => {
      const handleClick = jest.fn();
      
      render(
        <MaterialButton 
          variant="contained" 
          color="primary" 
          size="large"
          disabled={true}
          onClick={handleClick}
        >
          Custom Button
        </MaterialButton>
      );
      
      const button = screen.getByTestId('mui-button');
      expect(button).toHaveAttribute('data-variant', 'contained');
      expect(button).toHaveAttribute('data-color', 'primary');
      expect(button).toHaveAttribute('data-size', 'large');
      expect(button).toBeDisabled();
    });
  });

  describe('MaterialChip', () => {
    it('renders with default props', () => {
      render(<MaterialChip label="Test Chip" />);
      
      const chip = screen.getByTestId('mui-chip');
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveTextContent('Test Chip');
    });

    it('passes props to MUI Chip', () => {
      const handleClick = jest.fn();
      const handleDelete = jest.fn();
      
      render(
        <MaterialChip 
          label="Custom Chip"
          variant="outlined" 
          color="secondary" 
          size="small"
          onClick={handleClick}
          onDelete={handleDelete}
        />
      );
      
      const chip = screen.getByTestId('mui-chip');
      expect(chip).toHaveAttribute('data-variant', 'outlined');
      expect(chip).toHaveAttribute('data-color', 'secondary');
      expect(chip).toHaveAttribute('data-size', 'small');
      expect(chip).toHaveAttribute('data-has-delete', 'true');
    });
  });

  describe('MaterialTooltip', () => {
    it('renders with default props', () => {
      render(
        <MaterialTooltip title="Test Tooltip">
          <span>Hover me</span>
        </MaterialTooltip>
      );
      
      const tooltip = screen.getByTestId('mui-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Hover me');
      expect(tooltip).toHaveAttribute('data-title', 'Test Tooltip');
    });

    it('passes props to MUI Tooltip', () => {
      render(
        <MaterialTooltip 
          title="Custom Tooltip"
          placement="bottom"
          arrow={true}
        >
          <span>Hover for tooltip</span>
        </MaterialTooltip>
      );
      
      const tooltip = screen.getByTestId('mui-tooltip');
      expect(tooltip).toHaveAttribute('data-title', 'Custom Tooltip');
      expect(tooltip).toHaveAttribute('data-placement', 'bottom');
      expect(tooltip).toHaveAttribute('data-arrow', 'true');
    });
  });
});
