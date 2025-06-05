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
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePickerWithRange } from '@/components/ui/dateRangePicker';
import { DateRange } from 'react-day-picker';
import * as Sentry from '@sentry/nextjs';

/* Mock the cn utility function */
jest.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

/* Mock the CSS module */
jest.mock('@/styles/Shadcn.module.css', () => ({
  shadcnComponent: 'shadcn-component-class',
}));

/* Mock the Calendar component */
jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect, selected }: { 
    onSelect: (date: DateRange) => void; 
    selected: DateRange | undefined;
  }) => (
    <div data-testid="calendar-mock">
      <button 
        data-testid="select-date-button" 
        onClick={() => onSelect({ from: new Date(2025, 5, 15), to: new Date(2025, 5, 20) })}
      >
        Select Date Range
      </button>
      <div data-testid="selected-date">{JSON.stringify(selected)}</div>
    </div>
  ),
}));

/* Mock the Popover components */
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="popover-root">{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="popover-trigger">{children}</div>,
  PopoverContent: ({ 
    children, 
    className 
  }: { 
    children: React.ReactNode; 
    className?: string;
  }) => (
    <div data-testid="popover-content" className={className}>
      {children}
    </div>
  ),
}));

/* Mock the Button component */
jest.mock('@/components/ui/button', () => ({
  Button: ({ 
    children, 
    className, 
    variant 
  }: { 
    children: React.ReactNode; 
    className?: string; 
    variant?: string;
  }) => (
    <button data-testid="button-mock" className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe('DatePickerWithRange component', () => {
  it('renders with no date selected', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'DatePickerWithRange render test',
      },
      () => {
        const setDateMock = jest.fn();
        render(<DatePickerWithRange date={undefined} setDate={setDateMock} />);

        expect(screen.getByTestId('popover-root')).toBeInTheDocument();
        expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
        expect(screen.getByTestId('button-mock')).toBeInTheDocument();
        expect(screen.getByText('Pick a date range')).toBeInTheDocument();
      }
    );
  });

  it('renders with only from date selected', () => {
    const mockDate: DateRange = {
      from: new Date(2025, 5, 15), // June 15, 2025
      to: undefined
    };
    const setDateMock = jest.fn();
    
    render(<DatePickerWithRange date={mockDate} setDate={setDateMock} />);
    
    expect(screen.getByText('Jun 15, 2025')).toBeInTheDocument();
  });

  it('renders with both from and to dates selected', () => {
    const mockDate: DateRange = {
      from: new Date(2025, 5, 15), // June 15, 2025
      to: new Date(2025, 5, 20) // June 20, 2025
    };
    const setDateMock = jest.fn();
    
    render(<DatePickerWithRange date={mockDate} setDate={setDateMock} />);
    
    expect(screen.getByText('Jun 15, 2025 - Jun 20, 2025')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const setDateMock = jest.fn();
    render(
      <DatePickerWithRange 
        date={undefined} 
        setDate={setDateMock} 
        className="custom-date-picker-class" 
      />
    );
    
    const container = document.querySelector('.shadcn-component-class');
    expect(container).toHaveClass('custom-date-picker-class');
  });

  it('calls setDate when a date range is selected', () => {
    const setDateMock = jest.fn();
    render(
      <DatePickerWithRange 
        date={undefined} 
        setDate={setDateMock} 
      />
    );
    
    // Simulate opening the popover
    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent).toBeInTheDocument();
    
    // Find and click the button to select a date range
    const selectDateButton = screen.getByTestId('select-date-button');
    fireEvent.click(selectDateButton);
    
    // Check that setDate was called with the expected date range
    expect(setDateMock).toHaveBeenCalledWith({
      from: expect.any(Date),
      to: expect.any(Date)
    });
  });
});
