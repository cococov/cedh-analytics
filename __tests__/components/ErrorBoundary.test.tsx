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
import ErrorBoundary from '@/components/errorBoundary';

// Mock Sentry.captureException and Sentry.startSpan
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  startSpan: jest.fn((_config, callback) => {
    callback({ setAttribute: jest.fn() });
    return null;
  }),
}));

const BuggyComponent = () => {
  throw new Error('Test error');
  return <div>This will not render</div>;
};

describe('ErrorBoundary component', () => {
  // Suppress console errors during tests
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders fallback UI when child component throws', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <BuggyComponent />
      </ErrorBoundary>
    );

    // Check that the fallback UI is rendered
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <div>Normal component</div>
      </ErrorBoundary>
    );

    // Check that the children are rendered
    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });
});
