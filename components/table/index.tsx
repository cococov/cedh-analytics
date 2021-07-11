import React from 'react';
import MaterialTable from 'material-table';
import esLocale from 'date-fns/locale/es';

const Table: React.FC = ({
  columns,
  data,
  title,
  defaultNumberOfRows,
  rowHeight,
  cellEditable,
  canExportAllData,
  canExport,
  canFilter,
  isDraggable,
  withGrouping,
  actions,
}: any) => {

  return (
    <MaterialTable
      columns={columns}
      data={data}
      title={<h1>{title}</h1>}
      actions={actions}
      options={{
        exportButton: canExport,
        pageSize: defaultNumberOfRows,
        draggable: isDraggable,
        grouping: withGrouping,
        exportAllData: canExportAllData,
        exportFileName: title,
        filtering: canFilter,
        actionsColumnIndex: -1,
        emptyRowsWhenPaging: false,
        rowStyle: {
          height: rowHeight,
        },
        headerStyle: {
          fontWeight: 700,
        },
      }}
      cellEditable={cellEditable}
      localization={{
        body: {
          emptyDataSourceMessage: 'No hay datos disponibles.',
          dateTimePickerLocalization: esLocale,
        },
        header: {
          actions: 'Acciones',
        },
        pagination: {
          labelDisplayedRows: '{from}-{to} de {count}',
          labelRowsSelect: 'Filas',
          labelRowsPerPage: 'Filas por página:',
          firstAriaLabel: 'Primera página',
          firstTooltip: 'Primera página',
          previousAriaLabel: 'Página anterior',
          previousTooltip: 'Página anterior',
          nextAriaLabel: 'Página siguiente',
          nextTooltip: 'Página siguiente',
          lastAriaLabel: 'Última página',
          lastTooltip: 'Última página',
        },
        toolbar: {
          addRemoveColumns: 'Agregar o eliminar columnas',
          nRowsSelected: '{0} registro(s) seleccionado(s)',
          showColumnsTitle: 'Mostrar columnas',
          showColumnsAriaLabel: 'Mostrar columnas',
          exportTitle: 'Exportar',
          exportAriaLabel: 'Exportar',
          exportCSVName: 'Exportar como CSV',
          exportPDFName: 'Exportar como PDF',
          searchTooltip: 'Buscar',
          searchPlaceholder: 'Buscar',
        },
        grouping: {
          placeholder: 'Arrastra cabeceras aquí, para agruparlas.',
          groupedBy: 'Agrupado por: ',
        },
      }}
    />
  );
};

Table.defaultProps = {
  title: '',
  defaultNumberOfRows: 5,
  cellEditable: undefined,
  rowHeight: '84px',
  canExport: false,
  canExportAllData: false,
  canFilter: false,
  filter: {},
  isDraggable: false,
  withGrouping: false,
  actions: [],
};



export default Table;