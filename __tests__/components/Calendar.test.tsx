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
import { Calendar } from '@/components/ui/calendar';

/* Mock the cn utility function */
jest.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

/* Mock the CSS module */
jest.mock('@/styles/Shadcn.module.css', () => ({
  shadcnComponent: 'shadcn-component-class',
}));

/* Mock the button variants */
jest.mock('@/components/ui/button', () => ({
  buttonVariants: () => 'button-variant-class',
}));

describe('Calendar component', () => {
  it('renders a calendar with default props', () => {
    render(<Calendar />);
    
    // Check that the calendar container is rendered
    const calendar = document.querySelector('.shadcn-component-class');
    expect(calendar).toBeInTheDocument();
    
    // Check that navigation buttons are rendered
    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    
    // Check that the current month is displayed
    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear().toString();
    
    expect(screen.getByText(new RegExp(`${currentMonthName}.*${currentYear}`, 'i'))).toBeInTheDocument();
  });
  
  it('applies custom className', () => {
    render(<Calendar className="custom-calendar-class" />);
    
    const calendar = document.querySelector('.shadcn-component-class');
    expect(calendar).toHaveClass('custom-calendar-class');
  });
  
  it('renders with showOutsideDays set to false', () => {
    render(<Calendar showOutsideDays={false} />);
    
    const calendar = document.querySelector('.shadcn-component-class');
    expect(calendar).toBeInTheDocument();
  });
  
  it('renders with custom selected date', () => {
    const selectedDate = new Date(2025, 5, 15); // June 15, 2025
    render(<Calendar selected={selectedDate} />);
    
    // The selected date should have the day_selected class
    const selectedDay = screen.getByText('15');
    expect(selectedDay).toBeInTheDocument();
  });
  
  it('renders with custom month', () => {
    const customMonth = new Date(2025, 0, 1); // January 2025
    render(<Calendar month={customMonth} />);
    
    expect(screen.getByText(/January 2025/i)).toBeInTheDocument();
  });
});
