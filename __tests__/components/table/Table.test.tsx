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
import Table from '@/components/table';
import * as Sentry from '@sentry/nextjs';

// Mock the exporters
jest.mock('@/utils/exporters', () => ({
  pdfExporter: jest.fn(),
  csvExporter: jest.fn(),
}));

// Mock MaterialTable
jest.mock('@material-table/core', () => {
  return {
    __esModule: true,
    default: ({ 
      columns, 
      data, 
      title, 
      options, 
      onRowClick, 
      onOrderCollectionChange,
      onRowsPerPageChange,
      onChangeColumnHidden,
      onFilterChange,
      actions = [],
      isLoading = false
    }: {
      columns: Array<{field: string; title: string; hidden?: boolean}>,
      data: Array<Record<string, any>> | ((query: any) => Promise<{data: Array<any>; page: number; totalCount: number}>),
      title?: string,
      options?: Record<string, any>,
      onRowClick?: (event?: React.MouseEvent<HTMLElement>, rowData?: any, toggleDetailPanel?: (panelIndex?: number) => void) => void,
      onOrderCollectionChange?: (orderCollection: Array<{orderBy: number, sortOrder: number, orderDirection: 'asc' | 'desc'}>) => void,
      onRowsPerPageChange?: (pageSize: number) => void,
      onChangeColumnHidden?: (column: any, hidden: boolean) => void,
      onFilterChange?: (filterValues: any) => void,
      actions?: Array<any>,
      isLoading?: boolean
    }) => (
      <div data-testid="material-table-mock">
        <div data-testid="title">{title}</div>
        <div data-testid="columns">{JSON.stringify(columns)}</div>
        <div data-testid="data">{typeof data === 'function' ? 'function' : JSON.stringify(data)}</div>
        <div data-testid="options">{JSON.stringify(options)}</div>
        <div data-testid="is-loading">{isLoading.toString()}</div>
        <div data-testid="actions-length">{actions.length}</div>
        <button 
          data-testid="row-click-button" 
          onClick={() => onRowClick && onRowClick(
            { 
              preventDefault: () => {}, 
              stopPropagation: () => {},
              altKey: false,
              button: 0,
              buttons: 0,
              clientX: 0,
              clientY: 0,
              ctrlKey: false,
              metaKey: false,
              movementX: 0,
              movementY: 0,
              pageX: 0,
              pageY: 0,
              screenX: 0,
              screenY: 0,
              shiftKey: false,
              target: null,
              currentTarget: null,
              bubbles: false,
              cancelable: false,
              defaultPrevented: false,
              eventPhase: 0,
              isTrusted: false,
              nativeEvent: {} as any,
              persist: () => {},
              isDefaultPrevented: () => false,
              isPropagationStopped: () => false,
              timeStamp: 0,
              type: 'click'
            } as unknown as React.MouseEvent<HTMLElement>, 
            { id: 1, name: 'Test' }, 
            undefined
          )}
        >
          Test Row Click
        </button>
        <button 
          data-testid="order-change-button" 
          onClick={() => onOrderCollectionChange && onOrderCollectionChange([{ orderBy: 0, sortOrder: 0, orderDirection: 'asc' }])}
        >
          Test Order Change
        </button>
        <button 
          data-testid="rows-per-page-button" 
          onClick={() => onRowsPerPageChange && onRowsPerPageChange(20)}
        >
          Test Rows Per Page Change
        </button>
        <button 
          data-testid="column-hidden-button" 
          onClick={() => onChangeColumnHidden && onChangeColumnHidden({ field: 'name' }, true)}
        >
          Test Column Hidden
        </button>
        <button 
          data-testid="filter-change-button" 
          onClick={() => onFilterChange && onFilterChange([{ 
            column: { field: 'name', tableData: { id: 0 } },
            operator: '=',
            value: 'test'
          }])}
        >
          Test Filter Change
        </button>
      </div>
    )
  };
});

describe('Table component', () => {
  const mockColumns = [
    { title: 'Name', field: 'name' },
    { title: 'Value', field: 'value' }
  ];
  
  const mockData = [
    { name: 'Item 1', value: 100 },
    { name: 'Item 2', value: 200 }
  ];

  it('renders with required props', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'Table render test',
      },
      () => {
        render(
          <Table
            columns={mockColumns}
            data={mockData}
            title="Test Table"
            isLoading={false}
          />
        );

        expect(screen.getByTestId('material-table-mock')).toBeInTheDocument();
        expect(screen.getByTestId('title')).toBeInTheDocument();
        expect(screen.getByTestId('title').textContent).toBe('Test Table');
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      }
    );
  });

  it('passes data as function when provided', () => {
    const mockDataFunction = jest.fn().mockResolvedValue({
      data: mockData,
      page: 0,
      totalCount: 2,
    });

    render(
      <Table
        columns={mockColumns}
        data={mockDataFunction}
        title="Test Table"
        isLoading={false}
      />
    );

    expect(screen.getByTestId('data').textContent).toBe('function');
  });

  it('sets options correctly', () => {
    render(
      <Table
        columns={mockColumns}
        data={mockData}
        title="Test Table"
        isLoading={false}
        defaultNumberOfRows={10}
        rowHeight="50px"
        canExportAllData={true}
        canFilter={true}
        canSearch={true}
        isDraggable={true}
        withGrouping={true}
        minBodyHeight={400}
      />
    );

    const optionsElement = screen.getByTestId('options');
    const options = JSON.parse(optionsElement.textContent || '{}');
    
    expect(options.pageSize).toBe(10);
    expect(options.exportAllData).toBe(true);
    expect(options.filtering).toBe(true);
    expect(options.search).toBe(true);
    expect(options.draggable).toBe(true);
    expect(options.grouping).toBe(true);
    expect(options.minBodyHeight).toBe(400);
    expect(options.rowStyle.height).toBe('50px');
  });

  it('handles actions prop correctly', () => {
    const mockActions = [
      { icon: 'add', tooltip: 'Add', onClick: jest.fn() },
      { icon: 'edit', tooltip: 'Edit', onClick: jest.fn() }
    ];

    render(
      <Table
        columns={mockColumns}
        data={mockData}
        title="Test Table"
        isLoading={false}
        actions={mockActions}
      />
    );

    expect(screen.getByTestId('actions-length').textContent).toBe('2');
  });

  it('handles callback functions correctly', () => {
    const onRowClickMock = jest.fn();
    const onOrderCollectionChangeMock = jest.fn();
    const onRowsPerPageChangeMock = jest.fn();
    const onChangeColumnHiddenMock = jest.fn();
    const onFilterChangeMock = jest.fn();

    render(
      <Table
        columns={mockColumns}
        data={mockData}
        title="Test Table"
        isLoading={false}
        onRowClick={onRowClickMock}
        onOrderCollectionChange={onOrderCollectionChangeMock}
        onRowsPerPageChange={onRowsPerPageChangeMock}
        onChangeColumnHidden={onChangeColumnHiddenMock}
        onFilterChange={onFilterChangeMock}
      />
    );

    // Test row click
    fireEvent.click(screen.getByTestId('row-click-button'));
    // Just verify it was called with any arguments
    expect(onRowClickMock).toHaveBeenCalled();
    // And verify the second argument is the row data we expect
    expect(onRowClickMock.mock.calls[0][1]).toEqual({ id: 1, name: 'Test' });

    // Test order change
    fireEvent.click(screen.getByTestId('order-change-button'));
    expect(onOrderCollectionChangeMock).toHaveBeenCalledWith([{ orderBy: 0, sortOrder: 0, orderDirection: 'asc' }]);

    // Test rows per page change
    fireEvent.click(screen.getByTestId('rows-per-page-button'));
    expect(onRowsPerPageChangeMock).toHaveBeenCalledWith(20);

    // Test column hidden change
    fireEvent.click(screen.getByTestId('column-hidden-button'));
    expect(onChangeColumnHiddenMock).toHaveBeenCalledWith({ field: 'name' }, true);

    // Test filter change
    fireEvent.click(screen.getByTestId('filter-change-button'));
    expect(onFilterChangeMock).toHaveBeenCalledWith([{ 
      column: { field: 'name', tableData: { id: 0 } },
      operator: '=',
      value: 'test'
    }]);
  });

  it('handles loading state correctly', () => {
    render(
      <Table
        columns={mockColumns}
        data={mockData}
        title="Test Table"
        isLoading={true}
      />
    );

    expect(screen.getByTestId('is-loading').textContent).toBe('true');
  });
});
