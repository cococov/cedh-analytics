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

import { renderHook, act } from '@testing-library/react';
import useQueryParams from '@/hooks/useQueryParams';
import * as Sentry from '@sentry/nextjs';

// Define types for our test
interface TestQueryParams {
  page?: number;
  search?: string;
  filters?: {
    category?: string;
    price?: { v: number; o: string };
  };
  tags?: string[];
}

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};

const mockPathname = '/test-path';

// Mock URLSearchParams for consistent behavior
class MockURLSearchParams {
  private params: Map<string, string>;

  constructor(init?: string) {
    this.params = new Map();
    if (init) {
      init.split('&').forEach(pair => {
        if (!pair) return;
        const [key, value] = pair.split('=');
        this.params.set(key, value || '');
      });
    }
  }

  get(key: string): string | null {
    return this.params.get(key) || null;
  }

  set(key: string, value: string): void {
    this.params.set(key, value);
  }

  delete(key: string): void {
    this.params.delete(key);
  }

  toString(): string {
    const pairs: string[] = [];
    this.params.forEach((value, key) => {
      pairs.push(`${key}=${value}`);
    });
    return pairs.join('&');
  }
}

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
  usePathname: jest.fn(() => mockPathname),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key: string) => null),
    toString: jest.fn(() => ''),
  })),
}));

// Mock global URLSearchParams
global.URLSearchParams = MockURLSearchParams as any;

describe('useQueryParams hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty query params', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'useQueryParams initialization test',
      },
      () => {
        const { result } = renderHook(() => useQueryParams<TestQueryParams>());
        expect(result.current.queryParams).toBeDefined();
      }
    );
  });

  it('should set simple query parameters', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({ page: 2, search: 'test' });
    });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/test-path?page=2&search=test');
  });

  it('should remove parameters with null or empty values', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({ page: 2, search: '' });
    });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/test-path?page=2');
  });

  it('should handle array values', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({ tags: ['tag1', 'tag2'] });
    });
    
    // The actual implementation uses comma-separated values without URL encoding the comma
    expect(mockRouter.replace).toHaveBeenCalledWith('/test-path?tags=tag1,tag2');
  });

  it('should handle empty array values', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({ tags: [] });
    });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/test-path');
  });

  it('should handle complex object values', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({
        filters: {
          category: 'electronics',
          price: { v: 100, o: 'lt' }
        }
      });
    });
    
    expect(mockRouter.replace).toHaveBeenCalledWith(
      expect.stringContaining('/test-path?filters=')
    );
    expect(mockRouter.replace).toHaveBeenCalledWith(
      expect.stringContaining('category=electronics')
    );
    expect(mockRouter.replace).toHaveBeenCalledWith(
      expect.stringContaining('pricev=100')
    );
    expect(mockRouter.replace).toHaveBeenCalledWith(
      expect.stringContaining('priceo=lt')
    );
  });

  it('should filter out empty values in objects', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({
        filters: {
          category: '',
          price: { v: 100, o: 'lt' }
        }
      });
    });
    
    expect(mockRouter.replace).toHaveBeenCalledWith(
      expect.not.stringContaining('category=')
    );
    expect(mockRouter.replace).toHaveBeenCalledWith(
      expect.stringContaining('pricev=100')
    );
  });

  it('should handle objects with empty v property', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({
        filters: {
          price: { v: null as any, o: 'lt' }
        }
      });
    });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/test-path');
  });

  it('should remove empty objects', () => {
    const { result } = renderHook(() => useQueryParams<TestQueryParams>());
    
    act(() => {
      result.current.setQueryParams({
        filters: {}
      });
    });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/test-path');
  });
});
