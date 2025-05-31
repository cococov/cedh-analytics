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

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/scripts/',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!next.config.js',
    '!postcss.config.js',
    '!tailwind.config.js',
  ],
};

module.exports = createJestConfig(customJestConfig);
