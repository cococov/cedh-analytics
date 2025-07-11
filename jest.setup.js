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

import '@testing-library/jest-dom';

// Mock Sentry to prevent actual reporting during tests
jest.mock('@sentry/nextjs', () => {
  return {
    init: jest.fn(),
    captureException: jest.fn(),
    startSpan: jest.fn((config, callback) => {
      return callback({ setAttribute: jest.fn() });
    }),
    withServerActionInstrumentation: jest.fn((config, callback) => {
      return callback();
    }),
    consoleLoggingIntegration: jest.fn(),
    logger: {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Set up global fetch mock
global.fetch = jest.fn();

// Store original console methods
const originalConsoleError = console.error;

// List of error messages to ignore (won't fail tests)
const ignoredErrors = [
  // Add specific error messages to ignore here
];

// Override console.error to fail tests on React-specific warnings
console.error = (...args) => {
  // Still show the error in the console
  originalConsoleError(...args);

  // Check if this is an error that should be ignored
  const message = args.join(' ');
  const shouldIgnore = ignoredErrors.some(ignoredMsg => message.includes(ignoredMsg));

  if (!shouldIgnore) {
    // Fail the test for non-ignored errors
    throw new Error(`Test failed due to console error: ${message}`);
  }
};

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Restore original console methods after all tests
afterAll(() => {
  console.error = originalConsoleError;
});
