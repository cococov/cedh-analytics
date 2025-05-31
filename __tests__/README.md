# cEDH Analytics Testing Guide

This document provides guidelines for testing the cEDH Analytics project using Jest.

## Index

- [Getting Started](#getting-started)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Component Tests](#component-tests)
- [Utility Tests](#utility-tests)
- [Database Tests](#database-tests)
- [Sentry Integration Tests](#sentry-integration-tests)
- [Server Action Tests](#server-action-tests)
- [Python Tests](#python-tests)
- [Mocking](#mocking)
- [Best Practices](#best-practices)
- [Coverage](#coverage)

## Getting Started

The project uses Jest for testing JavaScript/TypeScript code and Python's unittest for Python scripts.

### Running JavaScript/TypeScript Tests

To run the JavaScript/TypeScript tests, use the following commands:

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Running Python Tests

To run the Python tests, use the following command:

```bash
# From the project root
python3 -m unittest discover -s __tests__/python
```

#### Python Test Requirements

The Python tests require proper module imports. The project uses absolute imports for Python modules:

```python
# Correct import style
from scripts.utils import logs
from scripts.db import database

# Avoid relative imports like this
# import utils.logs as logs  # This will cause import errors
```

A `conftest.py` file in the `__tests__/python` directory ensures the Python path includes the project root.

## Test Structure

The test files are organized in the following structure:

- `__tests__/` - Root directory for all tests
  - `components/` - Tests for React components
  - `utils/` - Tests for utility functions
  - `lib/` - Tests for library code (database, API, etc.)
  - `app/` - Tests for Next.js app directory code (pages, layouts, server actions)
  - `python/` - Tests for Python scripts

## Writing Tests

### Component Tests

Component tests use React Testing Library to render and interact with components. Example:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders a button with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Tests

Utility tests focus on testing pure JavaScript/TypeScript functions. Example:

```typescript
import fetchCardData from '@/utils/fetch/cardData';

// Mock the fetch function
global.fetch = jest.fn();

describe('fetchCardData utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch card data successfully', async () => {
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve(mockData)
    }));

    const result = await fetchCardData('Sol Ring');
    expect(result.error).toBe(false);
    expect(result.cardName).toBe('Sol Ring');
  });
});
```

### Database Tests

Database tests verify interactions with the PostgreSQL database. The tests use mocking to avoid actual database connections during testing. The project follows the pattern of using transactions for database operations and maintaining foreign key constraints (e.g., ban_list table requires cards to exist in the cards table).

Example of a database test:

```python
from unittest import TestCase
from unittest.mock import patch, MagicMock
from scripts.db import database

class TestDatabaseOperations(TestCase):
    @patch('scripts.db.database.connect_to_db')
    def test_insert_card(self, mock_connect_to_db):
        # Setup mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect_to_db.return_value = (mock_conn, mock_cursor)

        # Test data
        card_data = {
            'card_name': 'Test Card',
            'card_type': 'Creature',
            # Other card properties...
        }

        # Call the function
        database.insert_card(card_data)

        # Assertions
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
```

### Sentry Integration Tests

The project uses Sentry for error tracking and performance monitoring. Tests for components and functions that use Sentry should mock the Sentry functions to avoid actual reporting during tests. The Jest setup file (`jest.setup.js`) includes mocks for common Sentry functions.

#### Separating Sentry Tests from Functional Tests

It's important to separate Sentry integration tests from functional tests to maintain the single responsibility principle. For example, database tests should focus on database functionality, while Sentry integration tests should focus on verifying that Sentry functions are called correctly.

Example of a dedicated Sentry integration test file (`db.sentry.test.ts`):

```typescript
// Mock Sentry first, before any imports
jest.mock('@sentry/nextjs', () => ({
  startSpan: jest.fn((config, callback) => callback({ setAttribute: jest.fn() })),
  captureException: jest.fn(),
}));

// Import Sentry after mocking
import * as Sentry from '@sentry/nextjs';

// Mock the database operations
jest.mock('@/lib/db', () => ({
  getTopCards: jest.fn().mockImplementation(async () => {
    // This will call the mocked Sentry.startSpan
    return Sentry.startSpan(
      { op: 'db.query', name: 'Get Top Cards' },
      async (span) => {
        span.setAttribute('query.limit', 100);
        return [{ card_name: 'Sol Ring', count: 100 }];
      }
    );
  }),
}));

// Import the mocked functions
import { getTopCards } from '@/lib/db';

describe('Database Sentry integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sentry integration with database functions', () => {
    it('should use Sentry.startSpan when calling getTopCards', async () => {
      const result = await getTopCards();

      // Verify Sentry.startSpan was called with correct parameters
      expect(Sentry.startSpan).toHaveBeenCalledWith(
        expect.objectContaining({
          op: 'db.query',
          name: 'Get Top Cards',
        }),
        expect.any(Function)
      );
    });
  });
});

```typescript
```

### Database Tests in TypeScript

Database tests should focus solely on testing database functionality, without mixing in concerns like Sentry integration. Mock the database interactions to test database-related functions and mock any external dependencies like Sentry to isolate the database functionality.

Example of a focused database test:

```typescript
// Mock Sentry to isolate database tests
jest.mock('@sentry/nextjs', () => ({
  startSpan: jest.fn((_, callback) => callback({ setAttribute: jest.fn() })),
  captureException: jest.fn(),
}));

// Mock the kysely module
jest.mock('kysely', () => ({
  // Mock implementation
}));

import { db, getTopCards } from '@/lib/db';

describe('Database functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch top cards with default parameters', async () => {
    const mockCards = [{ card_name: 'Sol Ring', count: 100 }];

    // Setup the mock
    const mockExecute = jest.fn().mockResolvedValue(mockCards);
    (db.selectFrom as jest.Mock).mockReturnValue({
      selectAll: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      execute: mockExecute,
    });

    const result = await getTopCards();

    expect(mockExecute).toHaveBeenCalled();
    expect(result).toEqual(mockCards);
  });

  it('should handle errors properly', async () => {
    const mockError = new Error('Database error');

    // Mock the execute function to throw an error
    (db.selectFrom as jest.Mock).mockReturnValue({
      selectAll: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      execute: jest.fn().mockRejectedValue(mockError),
    });

    // Call the function and expect it to throw
    await expect(getTopCards()).rejects.toThrow('Database error');
  });
});
```

### Server Action Tests

Server action tests focus on testing Next.js server actions. Example:

```typescript
import * as Sentry from '@sentry/nextjs';
import { fetchTopCards } from '@/app/actions';
import { getTopCards } from '@/lib/db';

// Mock the database module
jest.mock('@/lib/db', () => ({
  getTopCards: jest.fn(),
}));

describe('Server Actions', () => {
  it('should fetch top cards with default parameters', async () => {
    // Mock data
    const mockCards = [{ card_name: 'Sol Ring', count: 100 }];

    // Setup the mock
    (getTopCards as jest.Mock).mockResolvedValue(mockCards);

    // Execute with Sentry tracing
    const result = await fetchTopCards();

    // Assertions
    expect(getTopCards).toHaveBeenCalled();
    expect(result).toEqual(mockCards);
  });
});
```

### Python Tests

Python tests use the unittest framework. Example:

```python
import unittest
from unittest.mock import patch, MagicMock
from scripts.utils import git

class TestGitModule(unittest.TestCase):
    @patch('subprocess.check_call')
    def test_add_all(self, mock_check_call):
        git.add_all()
        mock_check_call.assert_called_once_with(['git', 'add', '.'],
                                              stdout=git.DEVNULL,
                                              stderr=git.STDOUT,
                                              env=git.ENV)
```

## Mocking

### Mocking Fetch

```typescript
global.fetch = jest.fn();

// Mock a successful response
(global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
  status: 200,
  json: () => Promise.resolve({ data: 'mocked data' })
}));

// Mock an error response
(global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
  status: 404,
  json: () => Promise.resolve({ error: 'Not found' })
}));
```

### Mocking Sentry

Sentry is mocked in the jest.setup.js file:

```javascript
jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  startSpan: jest.fn((config, callback) => {
    return callback({ setAttribute: jest.fn() });
  }),
  withServerActionInstrumentation: jest.fn((config, callback) => {
    return callback();
  }),
}));
```

## Best Practices

1. **Test in isolation**: Each test should be independent of others
2. **Mock external dependencies**: Use jest.mock() to mock external dependencies
3. **Clear mocks between tests**: Use beforeEach(() => jest.clearAllMocks())
4. **Test edge cases**: Include tests for error conditions and edge cases
5. **Use descriptive test names**: Make test names clear and descriptive
6. **Follow AAA pattern**: Arrange, Act, Assert
7. **Keep tests simple**: Each test should test one thing
8. **Use setup and teardown**: Use beforeEach, afterEach, beforeAll, afterAll for setup/teardown

## Coverage

The project is configured to generate coverage reports when running:

```bash
pnpm test:coverage
```

The coverage report will be generated in the `coverage/` directory.
