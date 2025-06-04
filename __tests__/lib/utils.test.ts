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

import * as Sentry from '@sentry/nextjs';
import { cn } from '@/lib/utils';

// Mock the dependencies
jest.mock('clsx', () => ({
  clsx: jest.fn((...args) => {
    // Handle array of arguments properly
    if (args.length === 1 && Array.isArray(args[0])) {
      return args[0].filter(Boolean).join(' ');
    }
    return args.filter(Boolean).join(' ');
  }),
}));

jest.mock('tailwind-merge', () => ({
  twMerge: jest.fn((input) => `merged:${input}`),
}));

describe('Utils', () => {
  describe('cn function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('merges class names correctly', () => {
      Sentry.startSpan(
        {
          op: 'test',
          name: 'cn function test',
        },
        () => {
          const result = cn('class1', 'class2', 'class3');
          
          // Verify that clsx was called with the correct arguments
          expect(require('clsx').clsx).toHaveBeenCalledWith(['class1', 'class2', 'class3']);
          
          // Verify that twMerge was called with the result of clsx
          expect(require('tailwind-merge').twMerge).toHaveBeenCalledWith('class1 class2 class3');
          
          // Verify the final result
          expect(result).toBe('merged:class1 class2 class3');
        }
      );
    });

    it('handles conditional class names', () => {
      const condition = true;
      const result = cn(
        'base-class',
        condition && 'conditional-class',
        !condition && 'not-applied-class'
      );
      
      // Verify the result includes the conditional class
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('not-applied-class');
    });

    it('handles empty inputs', () => {
      const result = cn();
      
      expect(require('clsx').clsx).toHaveBeenCalledWith([]);
      expect(require('tailwind-merge').twMerge).toHaveBeenCalled();
    });

    it('handles null and undefined values', () => {
      const result = cn('class1', null, undefined, 'class2');
      
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });
});
