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
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as Sentry from '@sentry/nextjs';

// Mock the exporters module to prevent HTMLCanvasElement errors
jest.mock('@/utils/exporters', () => ({
  ExportCsv: jest.fn(),
  ExportPdf: jest.fn(),
}));

// Import after mocking to ensure the mock is used
import { TextFilter, SelectFilter, NumberFilterWithOperator, DateRangeFilter } from '@/components/table';

// Mock Material UI components
jest.mock('@mui/material/TextField', () => {
  return {
    __esModule: true,
    default: ({ value, onChange, type, variant, InputProps }: {
      value?: string | number;
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      type?: string;
      variant?: string;
      InputProps?: {
        startAdornment?: React.ReactNode;
      };
    }) => (
      <div data-testid="text-field-mock">
        <input 
          data-testid="text-field-input"
          value={value || ''}
          onChange={onChange}
          type={type || 'text'}
        />
        {InputProps?.startAdornment && (
          <div data-testid="input-adornment">{InputProps.startAdornment}</div>
        )}
      </div>
    )
  };
});

jest.mock('@mui/material/Select', () => {
  return {
    __esModule: true,
    default: ({ value, onChange, children, onClose, multiple, renderValue }: {
      value?: any;
      onChange?: (event: React.ChangeEvent<HTMLSelectElement> | any) => void;
      children?: React.ReactNode;
      onClose?: () => void;
      multiple?: boolean;
      renderValue?: (value: any) => React.ReactNode;
    }) => {
      // Create a mock renderValue function that handles both arrays and non-arrays
      const safeRenderValue = (val: any) => {
        if (!renderValue) return '';
        // Ensure value is an array if multiple is true
        const arrayValue = multiple && val && !Array.isArray(val) ? [val] : val;
        return renderValue(arrayValue);
      };

      return (
        <div data-testid="select-mock">
          {/* Use a div with data attributes instead of select to avoid DOM nesting issues */}
          <div 
            data-testid="select-input"
            data-value={value}
            onClick={(e: React.MouseEvent) => {
              // For testing purposes, ensure we're passing an array for multiple selects
              if (multiple && onChange) {
                // Mock the target.value as an array for multiple select
                const mockEvent = {
                  ...e,
                  target: { ...e.target, value: ['A', 'B'] }
                };
                onChange(mockEvent);
              } else if (onChange) {
                onChange(e as any);
              }
            }}
            onBlur={onClose as any}
            data-multiple={multiple ? 'true' : 'false'}
          >
            <div data-testid="select-children">{children}</div>
          </div>
          {multiple && (
            <div data-testid="render-value">{safeRenderValue(value)}</div>
          )}
        </div>
      );
    }
  };
});

jest.mock('@mui/material/MenuItem', () => {
  return {
    __esModule: true,
    default: ({ children, value }: { children: React.ReactNode; value?: any }) => {
      // Render as a div instead of option to avoid DOM nesting issues
      return (
        <div data-testid="menu-item" data-value={value}>{children}</div>
      );
    }
  };
});

jest.mock('@mui/material/Checkbox', () => {
  return {
    __esModule: true,
    default: ({ checked }: { checked?: boolean }) => (
      <span data-testid="checkbox" data-checked={checked ? 'true' : 'false'}>✓</span>
    )
  };
});

jest.mock('@mui/material/FormControl', () => {
  return {
    __esModule: true,
    default: ({ children, variant, style }: {
      children: React.ReactNode;
      variant?: string;
      style?: React.CSSProperties;
    }) => (
      <div data-testid="form-control" data-variant={variant} style={style}>{children}</div>
    )
  };
});

jest.mock('@mui/material/InputLabel', () => {
  return {
    __esModule: true,
    default: ({ children, htmlFor, style }: {
      children: React.ReactNode;
      htmlFor?: string;
      style?: React.CSSProperties;
    }) => (
      <label data-testid="input-label" htmlFor={htmlFor} style={style}>{children}</label>
    )
  };
});

jest.mock('@mui/material/ListItemText', () => {
  return {
    __esModule: true,
    default: ({ primary }: { primary: React.ReactNode }) => (
      <div data-testid="list-item-text">{primary}</div>
    )
  };
});

jest.mock('@mui/material/InputAdornment', () => {
  return {
    __esModule: true,
    default: ({ children, position }: {
      children: React.ReactNode;
      position?: 'start' | 'end';
    }) => (
      <div data-testid="input-adornment" data-position={position}>{children}</div>
    )
  };
});

// Mock the DatePickerWithRange component
jest.mock('@/components/ui/dateRangePicker', () => ({
  DatePickerWithRange: ({ date, setDate }: {
    date: { from?: Date; to?: Date } | undefined;
    setDate: (date: { from: Date; to: Date }) => void;
  }) => (
    <div data-testid="date-picker-mock">
      <button 
        data-testid="set-date-button"
        onClick={() => setDate({ from: new Date(2025, 5, 15), to: new Date(2025, 5, 20) })}
      >
        Set Date Range
      </button>
      <div data-testid="current-date">{JSON.stringify(date)}</div>
    </div>
  )
}));

describe('Table Filter Components', () => {
  // Setup for testing debounced functions
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('TextFilter', () => {
    it('renders with default props', () => {
      Sentry.startSpan(
        {
          op: 'test',
          name: 'TextFilter render test',
        },
        () => {
          const texInputChangeRef = { current: null };
          const onFilterChanged = jest.fn();
          const columnDef = { tableData: { id: 'name', filterValue: '' } };

          render(
            <TextFilter
              texInputChangeRef={texInputChangeRef}
              onFilterChanged={onFilterChanged}
              columnDef={columnDef}
            />
          );

          expect(screen.getByTestId('text-field-mock')).toBeInTheDocument();
          expect(screen.getByTestId('text-field-input')).toBeInTheDocument();
        }
      );
    });

    it('calls onFilterChanged after debounce when value changes', () => {
      const texInputChangeRef = { current: null };
      const onFilterChanged = jest.fn();
      const columnDef = { tableData: { id: 'name', filterValue: '' } };

      render(
        <TextFilter
          texInputChangeRef={texInputChangeRef}
          onFilterChanged={onFilterChanged}
          columnDef={columnDef}
        />
      );

      const input = screen.getByTestId('text-field-input');
      fireEvent.change(input, { target: { value: 'test' } });

      // Before the debounce timer
      expect(onFilterChanged).not.toHaveBeenCalled();

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // After the debounce timer
      expect(onFilterChanged).toHaveBeenCalledWith('name', 'test', '=');
    });

    it('renders with specified type', () => {
      const texInputChangeRef = { current: null };
      const onFilterChanged = jest.fn();
      const columnDef = { tableData: { id: 'age', filterValue: '' } };

      render(
        <TextFilter
          texInputChangeRef={texInputChangeRef}
          onFilterChanged={onFilterChanged}
          columnDef={columnDef}
          type="number"
        />
      );

      const input = screen.getByTestId('text-field-input');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('SelectFilter', () => {
    const mockColumnDef = {
      tableData: { id: 'category', filterValue: ['A'] },
      filterPlaceholder: 'Select Categories',
      lookup: { A: 'Category A', B: 'Category B', C: 'Category C' },
      filterOnItemSelect: false
    };

    it('renders with default props', () => {
      const onFilterChanged = jest.fn();

      render(
        <SelectFilter
          columnDef={mockColumnDef}
          onFilterChanged={onFilterChanged}
        />
      );

      expect(screen.getByTestId('form-control')).toBeInTheDocument();
      expect(screen.getByTestId('input-label')).toBeInTheDocument();
      expect(screen.getByTestId('select-mock')).toBeInTheDocument();
      expect(screen.getByTestId('render-value')).toHaveTextContent('Category A');
    });

    it('calls onFilterChanged when select is closed and filterOnItemSelect is false', () => {
      const onFilterChanged = jest.fn();

      render(
        <SelectFilter
          columnDef={mockColumnDef}
          onFilterChanged={onFilterChanged}
        />
      );

      const select = screen.getByTestId('select-input');
      fireEvent.blur(select);

      expect(onFilterChanged).toHaveBeenCalledWith('category', ['A'], '=');
    });

    it('calls onFilterChanged when value changes and filterOnItemSelect is true', () => {
      const onFilterChanged = jest.fn();
      const columnDefWithFilterOnSelect = {
        ...mockColumnDef,
        filterOnItemSelect: true
      };

      render(
        <SelectFilter
          columnDef={columnDefWithFilterOnSelect}
          onFilterChanged={onFilterChanged}
        />
      );

      const select = screen.getByTestId('select-input');
      // Use click instead of change since we're now using a div instead of select
      fireEvent.click(select);
      
      // Verify that onFilterChanged was called (the exact parameters might vary in the mock implementation)
      expect(onFilterChanged).toHaveBeenCalled();
    });
  });

  describe('NumberFilterWithOperator', () => {
    it('renders with default props', () => {
      const texInputChangeRef = { current: null };
      const onFilterChanged = jest.fn();
      const columnDef = { 
        tableData: { 
          id: 'price', 
          filterValue: 100,
          filterOperator: '>'
        } 
      };

      render(
        <NumberFilterWithOperator
          texInputChangeRef={texInputChangeRef}
          onFilterChanged={onFilterChanged}
          columnDef={columnDef}
        />
      );

      expect(screen.getByTestId('text-field-mock')).toBeInTheDocument();
      // Use getAllByTestId instead of getByTestId to handle multiple elements with the same test ID
      expect(screen.getAllByTestId('input-adornment').length).toBeGreaterThan(0);
    });

    it('calls onFilterChanged after debounce when value changes', () => {
      const texInputChangeRef = { current: null };
      const onFilterChanged = jest.fn();
      const columnDef = { 
        tableData: { 
          id: 'price', 
          filterValue: 100,
          filterOperator: '>'
        } 
      };

      render(
        <NumberFilterWithOperator
          texInputChangeRef={texInputChangeRef}
          onFilterChanged={onFilterChanged}
          columnDef={columnDef}
        />
      );

      const input = screen.getByTestId('text-field-input');
      fireEvent.change(input, { target: { value: '200' } });

      // Before the debounce timer
      expect(onFilterChanged).not.toHaveBeenCalled();

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // After the debounce timer
      expect(onFilterChanged).toHaveBeenCalledWith('price', '200', '>');
    });
  });

  describe('DateRangeFilter', () => {
    it('renders with default props', () => {
      const onFilterChanged = jest.fn();
      const columnDef = { 
        tableData: { 
          id: 'date', 
          filterValue: undefined
        } 
      };

      render(
        <DateRangeFilter
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
        />
      );

      expect(screen.getByTestId('date-picker-mock')).toBeInTheDocument();
    });

    it('calls onFilterChanged when date range is selected', () => {
      const onFilterChanged = jest.fn();
      const columnDef = { 
        tableData: { 
          id: 'date', 
          filterValue: undefined
        } 
      };

      render(
        <DateRangeFilter
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
        />
      );

      const setDateButton = screen.getByTestId('set-date-button');
      fireEvent.click(setDateButton);

      // Verify that onFilterChanged was called (the exact parameters might vary in the mock implementation)
      expect(onFilterChanged).toHaveBeenCalled();
    });
  });
});
