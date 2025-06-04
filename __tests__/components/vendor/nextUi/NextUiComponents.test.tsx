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
import NextUITable from '@/components/vendor/nextUi/table';
import HeadlessTable from '@/components/vendor/nextUi/headlessTable';

// Mock the @heroui/react components
jest.mock('@heroui/react', () => {
  const Table = ({
    children,
    isStriped,
    'aria-label': ariaLabel
  }: {
    children: React.ReactNode;
    isStriped?: boolean;
    'aria-label'?: string;
  }) => (
    <table data-testid="nextui-table" data-striped={isStriped ? 'true' : 'false'} aria-label={ariaLabel}>
      {children}
    </table>
  );

  const TableHeader = ({
    children,
    className
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <thead data-testid="nextui-table-header" className={className}>
      <tr>{children}</tr>
    </thead>
  );

  const TableColumn = ({
    children,
    className,
    itemKey
  }: {
    children: React.ReactNode;
    className?: string;
    itemKey?: string | number;
  }) => (
    <th data-testid="nextui-table-column" className={className} key={itemKey}>
      {children}
    </th>
  );

  const TableBody = ({
    children,
    emptyContent
  }: {
    children: React.ReactNode;
    emptyContent?: string | React.ReactNode;
  }) => (
    <tbody data-testid="nextui-table-body" data-empty-content={emptyContent}>
      {children}
    </tbody>
  );

  const TableRow = ({
    children,
    itemKey,
    onClick,
    style
  }: {
    children: React.ReactNode;
    itemKey?: string | number;
    onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
    style?: React.CSSProperties;
  }) => (
    <tr data-testid="nextui-table-row" key={itemKey} onClick={onClick} style={style}>
      {children}
    </tr>
  );

  const TableCell = ({
    children,
    itemKey
  }: {
    children: React.ReactNode;
    itemKey?: string | number;
  }) => (
    <td data-testid="nextui-table-cell" key={itemKey}>
      {children}
    </td>
  );

  return {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
  };
});

describe('Next UI Components', () => {
  describe('NextUITable', () => {
    const mockHeader = ['Name', 'Age', 'Location'];
    const mockData = [
      ['John Doe', 30, 'New York'],
      ['Jane Smith', 25, 'Los Angeles'],
      ['Bob Johnson', 40, 'Chicago']
    ];

    it('renders with header and data', () => {
      Sentry.startSpan(
        {
          op: 'test',
          name: 'NextUITable render test',
        },
        () => {
          render(<NextUITable header={mockHeader} data={mockData} />);

          expect(screen.getByTestId('nextui-table')).toBeInTheDocument();
          expect(screen.getByTestId('nextui-table')).toHaveAttribute('data-striped', 'true');
          expect(screen.getByTestId('nextui-table')).toHaveAttribute('aria-label', 'Table');

          expect(screen.getByTestId('nextui-table-header')).toBeInTheDocument();
          expect(screen.getByTestId('nextui-table-header')).toHaveClass('bg-carrotPurple');

          const columns = screen.getAllByTestId('nextui-table-column');
          expect(columns).toHaveLength(3);
          expect(columns[0]).toHaveTextContent('Name');
          expect(columns[1]).toHaveTextContent('Age');
          expect(columns[2]).toHaveTextContent('Location');

          const rows = screen.getAllByTestId('nextui-table-row');
          expect(rows).toHaveLength(3);

          const cells = screen.getAllByTestId('nextui-table-cell');
          expect(cells).toHaveLength(9); // 3 rows x 3 columns
          expect(cells[0]).toHaveTextContent('John Doe');
          expect(cells[1]).toHaveTextContent('30');
          expect(cells[2]).toHaveTextContent('New York');
        }
      );
    });

    it('handles row click events', () => {
      const handleRowClick = jest.fn().mockImplementation(
        (row: (string | number)[]) => (e: React.MouseEvent<HTMLTableRowElement>) => {
          // Mock implementation for the row click handler
        }
      );

      render(<NextUITable header={mockHeader} data={mockData} handleRowClick={handleRowClick} />);

      const rows = screen.getAllByTestId('nextui-table-row');

      // Verify that handleRowClick was called for each row during render
      expect(handleRowClick).toHaveBeenCalledTimes(3);
      expect(handleRowClick).toHaveBeenNthCalledWith(1, mockData[0]);
      expect(handleRowClick).toHaveBeenNthCalledWith(2, mockData[1]);
      expect(handleRowClick).toHaveBeenNthCalledWith(3, mockData[2]);

      // Verify that rows have cursor:pointer style
      expect(rows[0]).toHaveStyle('cursor: pointer');
    });

    it('renders empty table correctly', () => {
      render(<NextUITable header={mockHeader} data={[]} />);

      expect(screen.getByTestId('nextui-table-body')).toHaveAttribute('data-empty-content', 'No data to display.');
      expect(screen.queryByTestId('nextui-table-row')).not.toBeInTheDocument();
    });
  });

  describe('HeadlessTable', () => {
    const mockData = {
      Name: 'John Doe',
      Age: 30,
      Location: 'New York'
    };

    it('renders with key-value data', () => {
      render(<HeadlessTable data={mockData} />);

      expect(screen.getByTestId('nextui-table')).toBeInTheDocument();
      expect(screen.getByTestId('nextui-table')).toHaveAttribute('data-striped', 'true');
      expect(screen.getByTestId('nextui-table')).toHaveAttribute('aria-label', 'Headless Table');

      // Header should be hidden
      expect(screen.getByTestId('nextui-table-header')).toBeInTheDocument();

      const rows = screen.getAllByTestId('nextui-table-row');
      expect(rows).toHaveLength(3); // One row for each key-value pair

      const cells = screen.getAllByTestId('nextui-table-cell');
      expect(cells).toHaveLength(6); // 3 rows x 2 columns (key, value)

      // Check key-value pairs
      expect(cells[0]).toHaveTextContent('Name');
      expect(cells[1]).toHaveTextContent('John Doe');
      expect(cells[2]).toHaveTextContent('Age');
      expect(cells[3]).toHaveTextContent('30');
      expect(cells[4]).toHaveTextContent('Location');
      expect(cells[5]).toHaveTextContent('New York');
    });

    it('renders empty table correctly', () => {
      render(<HeadlessTable data={{}} />);

      expect(screen.queryByTestId('nextui-table-row')).not.toBeInTheDocument();
    });
  });
});
