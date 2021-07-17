import MaterialTable, { Action } from 'material-table';

interface ITable<RowData extends object> {
  columns: object[];
  data: object[];
  title?: string;
  defaultNumberOfRows?: number;
  rowHeight?: string;
  canExportAllData?: boolean;
  canExport?: boolean;
  canFilter?: boolean;
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

const Table: React.FC<ITable<{}>> = ({
  columns,
  data,
  title,
  defaultNumberOfRows,
  rowHeight,
  canExportAllData,
  canExport,
  canFilter,
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
        exportButton: canExport,
        pageSize: defaultNumberOfRows,
        draggable: isDraggable,
        grouping: withGrouping,
        exportAllData: canExportAllData,
        exportFileName: title,
        filtering: canFilter,
        emptyRowsWhenPaging: false,
        rowStyle: {
          height: rowHeight,
        },
        headerStyle: {
          fontWeight: 700,
        },
      }}
      onRowClick={onRowClick}
    />
  );
};



export default Table;