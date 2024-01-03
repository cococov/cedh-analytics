"use client";

import { useState, useEffect } from 'react';
/* Vendor */
import MaterialTable, { Action } from '@material-table/core';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
/* Own */
import { pdfExporter, csvExporter } from '@utils/exporters';

interface RowData { [key: string]: any };

type RemoteRowData = (query: any) => Promise<{
  data: RowData[],
  page: number,
  totalCount: number,
}>;

export function TextFilter({
  texInputChangeRef,
  onFilterChanged,
  columnDef,
  type = 'text',
}: {
  texInputChangeRef: any,
  onFilterChanged: any,
  columnDef: any,
  type?: string,
}) {
  const [selectedFilter, setSelectedFilter] = useState(
    columnDef.tableData.filterValue || undefined
  );

  useEffect(() => {
    if (Boolean(texInputChangeRef.current)) {
      clearTimeout(texInputChangeRef.current);
    }
    texInputChangeRef.current = setTimeout(() => {
      onFilterChanged(columnDef.tableData.id, selectedFilter, '=');
    }, 500); // 500ms delay before filtering
  }, [selectedFilter]);

  return (
    <TextField
      variant="standard"
      type={type}
      value={selectedFilter}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFilter(e.target.value);
      }}
    />
  );
};

export function SelectFilter({
  columnDef,
  onFilterChanged,
}: {
  columnDef: any,
  onFilterChanged: any,
}) {
  const [selectedFilter, setSelectedFilter] = useState(
    columnDef.tableData.filterValue || []
  );

  useEffect(() => {
    setSelectedFilter(columnDef.tableData.filterValue || []);
  }, [columnDef.tableData.filterValue]);

  return (
    <FormControl variant="standard" style={{ width: '100%' }}>
      <InputLabel
        htmlFor={'select-multiple-checkbox' + columnDef.tableData.id}
        style={{ marginTop: -16 }}
      >
        {columnDef.filterPlaceholder}
      </InputLabel>
      <Select
        multiple
        value={selectedFilter}
        onClose={() => {
          if (columnDef.filterOnItemSelect !== true) {
            onFilterChanged(columnDef.tableData.id, selectedFilter, '=');
          }
        }}
        onChange={(event) => {
          setSelectedFilter(event.target.value);
          if (columnDef.filterOnItemSelect === true) {
            onFilterChanged(columnDef.tableData.id, event.target.value, '=');
          }
        }}
        labelId={'select-multiple-checkbox' + columnDef.tableData.id}
        renderValue={(selectedArr) =>
          selectedArr.map((selected: string) => columnDef.lookup[selected]).join(', ')
        }
        MenuProps={{
          PaperProps: {
            style: {
              width: '12rem',
              maxHeight: '20rem',
            }
          },
          variant: 'menu'
        }}
        style={{ marginTop: 0 }}
      >
        {Object.keys(columnDef.lookup).map((key) => (
          <MenuItem key={key} value={key}>
            <Checkbox checked={selectedFilter.indexOf(key.toString()) > -1} />
            <ListItemText primary={columnDef.lookup[key]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default function Table({
  columns,
  data,
  title,
  defaultNumberOfRows,
  rowHeight,
  canExportAllData,
  canFilter,
  canSearch,
  isDraggable,
  withGrouping,
  actions,
  isLoading,
  minBodyHeight,
  onRowClick,
  onOrderCollectionChange,
  onRowsPerPageChange,
  onChangeColumnHidden,
  onFilterChange,
}: {
  columns: object[],
  data: RowData[] | RemoteRowData,
  title: string,
  defaultNumberOfRows?: number,
  rowHeight?: string,
  canExportAllData?: boolean,
  canFilter?: boolean,
  canSearch?: boolean,
  isDraggable?: boolean,
  withGrouping?: boolean,
  actions?: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[],
  isLoading: boolean,
  minBodyHeight?: string | number,
  onRowClick?: (
    event?: React.MouseEvent,
    rowData?: RowData,
    toggleDetailPanel?: (panelIndex?: number) => void
  ) => void,
  onOrderCollectionChange?: (orderByCollection: {
    orderBy: number,
    sortOrder: number,
    orderDirection: 'asc' | 'desc'
  }[]) => void,
  onRowsPerPageChange?: (pageSize: number) => void,
  onChangeColumnHidden?: (column: any, hidden: boolean) => void,
  onFilterChange?: (filters: { column: { field: string, tableData: { id: number } }, operator: string, value: string | number | boolean }[]) => void,
}) {
  return (
    <MaterialTable
      columns={columns}
      data={data as any}
      title={<h1>{title}</h1>}
      actions={actions}
      isLoading={isLoading}
      options={{
        exportMenu: [{
          label: 'Export PDF',
          exportFunc: (cols, datas) => pdfExporter(cols, datas, title)
        }, {
          label: 'Export CSV',
          exportFunc: (cols, datas) => csvExporter(cols, datas, title)
        }],
        pageSize: defaultNumberOfRows,
        pageSizeOptions: [5, 10, 20, 50, 100],
        draggable: isDraggable,
        grouping: withGrouping,
        exportAllData: canExportAllData,
        filtering: canFilter,
        search: canSearch,
        actionsColumnIndex: -1,
        emptyRowsWhenPaging: false,
        rowStyle: {
          height: rowHeight,
        },
        headerStyle: {
          fontWeight: 700,
        },
        columnsButton: true,
        minBodyHeight: minBodyHeight,
        thirdSortClick: false,
        searchDebounceDelay: 1000, // 1 second of delay before searching
      }}
      onRowClick={onRowClick as any}
      // @ts-ignore
      onOrderCollectionChange={onOrderCollectionChange as any}
      onRowsPerPageChange={onRowsPerPageChange}
      onChangeColumnHidden={onChangeColumnHidden}
      onFilterChange={onFilterChange as any}
    />
  );
};
