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
import MaterialArrowRightIcon from '@/components/vendor/materialIcon/arrowRightIcon';
import MaterialEmailIcon from '@/components/vendor/materialIcon/emailIcon';
import MaterialMenuClosedIcon from '@/components/vendor/materialIcon/menuClosedIcon';
import MaterialMenuOpenIcon from '@/components/vendor/materialIcon/menuOpenIcon';
import MaterialOpenInNewIcon from '@/components/vendor/materialIcon/openInNewIcon';
import MaterialReadMoreIcon from '@/components/vendor/materialIcon/readMoreIcon';
import MaterialWhatsAppIcon from '@/components/vendor/materialIcon/whatsAppIcon';

// Mock the MUI icons
jest.mock('@mui/icons-material/ArrowRightAlt', () => ({
  __esModule: true,
  default: ({ fontSize }: { fontSize?: 'small' | 'medium' | 'large' | 'inherit' }) => (
    <svg 
      data-testid="ArrowRightAltIcon" 
      data-font-size={fontSize !== 'medium' ? fontSize : undefined} 
      className={fontSize ? `MuiSvgIcon-fontSize${fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}` : ''}
    />
  )
}));

jest.mock('@mui/icons-material/Email', () => ({
  __esModule: true,
  default: ({ fontSize }: { fontSize?: 'small' | 'medium' | 'large' | 'inherit' }) => (
    <svg data-testid="EmailIcon" data-font-size={fontSize !== 'medium' ? fontSize : undefined} />
  )
}));

jest.mock('@mui/icons-material/Menu', () => ({
  __esModule: true,
  default: ({ fontSize }: { fontSize?: 'small' | 'medium' | 'large' | 'inherit' }) => (
    <div data-testid="menu-closed-icon" data-font-size={fontSize !== 'medium' ? fontSize : undefined}>Menu Icon</div>
  )
}));

jest.mock('@mui/icons-material/MenuOpen', () => ({
  __esModule: true,
  default: ({ fontSize }: { fontSize?: 'small' | 'medium' | 'large' | 'inherit' }) => (
    <div data-testid="menu-open-icon" data-font-size={fontSize !== 'medium' ? fontSize : undefined}>MenuOpen Icon</div>
  )
}));

jest.mock('@mui/icons-material/OpenInNew', () => ({
  __esModule: true,
  default: ({ fontSize }: { fontSize?: 'small' | 'medium' | 'large' | 'inherit' }) => (
    <div data-testid="open-in-new-icon" data-font-size={fontSize !== 'medium' ? fontSize : undefined}>OpenInNew Icon</div>
  )
}));

jest.mock('@mui/icons-material/ReadMore', () => ({
  __esModule: true,
  default: ({ fontSize }: { fontSize?: 'small' | 'medium' | 'large' | 'inherit' }) => (
    <div data-testid="read-more-icon" data-font-size={fontSize !== 'medium' ? fontSize : undefined}>ReadMore Icon</div>
  )
}));

jest.mock('@mui/icons-material/WhatsApp', () => ({
  __esModule: true,
  default: ({ fontSize }: { fontSize?: 'small' | 'medium' | 'large' | 'inherit' }) => (
    <div data-testid="whatsapp-icon" data-font-size={fontSize !== 'medium' ? fontSize : undefined}>WhatsApp Icon</div>
  )
}));

describe('Material Icon Components', () => {
  it('renders ArrowRightIcon with default props', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'ArrowRightIcon render test',
      },
      () => {
        render(<MaterialArrowRightIcon />);
        const icon = screen.getByTestId('ArrowRightAltIcon');
        expect(icon).toBeInTheDocument();
        expect(icon).not.toHaveAttribute('data-font-size');
      }
    );
  });

  it('renders ArrowRightIcon with custom fontSize', () => {
    render(<MaterialArrowRightIcon fontSize="large" />);
    const icon = screen.getByTestId('ArrowRightAltIcon');
    expect(icon).toBeInTheDocument();
    // Check if the SVG has the appropriate class for large font size
    expect(icon).toHaveClass('MuiSvgIcon-fontSizeLarge');
  });

  it('renders EmailIcon with default props', () => {
    render(<MaterialEmailIcon />);
    const icon = screen.getByTestId('EmailIcon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders EmailIcon with custom fontSize', () => {
    render(<MaterialEmailIcon fontSize="small" />);
    const icon = screen.getByTestId('EmailIcon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-font-size', 'small');
  });

  it('renders MenuClosedIcon with default props', () => {
    render(<MaterialMenuClosedIcon />);
    const icon = screen.getByTestId('menu-closed-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders MenuClosedIcon with custom fontSize', () => {
    render(<MaterialMenuClosedIcon fontSize="medium" />);
    const icon = screen.getByTestId('menu-closed-icon');
    expect(icon).toBeInTheDocument();
    // Medium is the default, so it's not added as an attribute
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders MenuOpenIcon with default props', () => {
    render(<MaterialMenuOpenIcon />);
    const icon = screen.getByTestId('menu-open-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders MenuOpenIcon with custom fontSize', () => {
    render(<MaterialMenuOpenIcon fontSize="large" />);
    const icon = screen.getByTestId('menu-open-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-font-size', 'large');
  });

  it('renders OpenInNewIcon with default props', () => {
    render(<MaterialOpenInNewIcon />);
    const icon = screen.getByTestId('open-in-new-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders OpenInNewIcon with custom fontSize', () => {
    render(<MaterialOpenInNewIcon fontSize="small" />);
    const icon = screen.getByTestId('open-in-new-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-font-size', 'small');
  });

  it('renders ReadMoreIcon with default props', () => {
    render(<MaterialReadMoreIcon />);
    const icon = screen.getByTestId('read-more-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders ReadMoreIcon with custom fontSize', () => {
    render(<MaterialReadMoreIcon fontSize="medium" />);
    const icon = screen.getByTestId('read-more-icon');
    expect(icon).toBeInTheDocument();
    // Medium is the default, so it's not added as an attribute
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders WhatsAppIcon with default props', () => {
    render(<MaterialWhatsAppIcon />);
    const icon = screen.getByTestId('whatsapp-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('data-font-size');
  });

  it('renders WhatsAppIcon with custom fontSize', () => {
    render(<MaterialWhatsAppIcon fontSize="large" />);
    const icon = screen.getByTestId('whatsapp-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-font-size', 'large');
  });
});
