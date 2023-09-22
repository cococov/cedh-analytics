"use client";

import MaterialTable, { Action } from '@material-table/core';
import { pdfExporter, csvExporter } from '../../utils/exporters';

interface RowData { [key: string]: any }
interface ITable {
  columns: object[];
  data: RowData[];
  title: string;
  defaultNumberOfRows?: number;
  rowHeight?: string;
  canExportAllData?: boolean;
  canFilter?: boolean;
  canSearch?: boolean;
  isDraggable?: boolean;
  withGrouping?: boolean;
  actions?: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[];
  isLoading: boolean;
  onRowClick?: (
    event?: React.MouseEvent,
    rowData?: RowData,
    toggleDetailPanel?: (panelIndex?: number) => void
  ) => void;
}

const Table: React.FC<ITable> = ({
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
  onRowClick,
}) => {

  return (
    <MaterialTable
      columns={columns}
      data={data}
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
      }}
      onRowClick={onRowClick}
    />
  );
};



export default Table;