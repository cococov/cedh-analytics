"use client";

/* Vendor */
import MaterialTable, { Action } from '@material-table/core';
/* Own */
import { pdfExporter, csvExporter } from '../../utils/exporters';

interface RowData { [key: string]: any };

type RemoteRowData = (query: any) => Promise<{
  data: RowData[],
  page: number,
  totalCount: number,
}>;

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
  onRowClick,
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
  onRowClick?: (
    event?: React.MouseEvent,
    rowData?: RowData,
    toggleDetailPanel?: (panelIndex?: number) => void
  ) => void,
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
        searchDebounceDelay: 1000, // 1 second of delay before searching
      }}
      onRowClick={onRowClick}
    />
  );
};
