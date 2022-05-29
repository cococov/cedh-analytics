import { useState, useEffect } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Table from '../table';

type Row = {
  "Category": string,
  "Decks": number,
  "App.": number,
  "Wins": number,
  "Win Rate": number,
  "App. Rate": number,
}

type Data = Row[];

type MetagameTableProps = {
  isLoading: boolean,
  data: Data,
}

const MetagameCategoriesTable: React.FC<MetagameTableProps> = ({ isLoading, data }) => {
  const [isLoaded, setLoaded] = useState(false);
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const [columns, setColumns] = useState([
    {
      title: 'Category',
      field: 'Category',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      cellStyle: {
        minWidth: '10rem'
      },
    },
    {
      title: 'Decks',
      field: 'Decks',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      cellStyle: {
        maxWidth: '1rem'
      },
    },
    {
      title: 'Appearances',
      field: 'App.',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultSort: 'desc',
      cellStyle: {
        maxWidth: '1rem'
      },
    },
    {
      title: 'Wins',
      field: 'Wins',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      cellStyle: {
        maxWidth: '1rem'
      },
    },
    {
      title: 'Win Rate',
      field: 'Win Rate',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      cellStyle: {
        minWidth: '7.5rem'
      },
      render: (rowData: any, type: any) => {
        const value = type === 'row' ? rowData['Win Rate'] : rowData;
        return type === 'row' ? <span>{`${value}%`}</span> : value;
      },
    },
    {
      title: 'App. Rate',
      field: 'App. Rate',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      cellStyle: {
        minWidth: '8rem'
      },
      render: (rowData: any, type: any) => {
        const value = type === 'row' ? rowData['Win Rate'] : rowData;
        return type === 'row' ? <span>{`${value}%`}</span> : value;
      },
    },
  ]);

  useEffect(() => {
    if (isSmallScreen) {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (current.field === 'Category') return { ...current, cellStyle: { minWidth: '5rem' } };
          if (current.field !== 'Category' && current.field !== 'App.' && current.field !== 'Win Rate') {
            return { ...current, hidden: true };
          }
          return current;
        });
      });
    } else {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          return { ...current, hidden: false };
        });
      });
    }
    setRenderKey(`render-${Math.random()}`);
  }, [isSmallScreen]);

  useEffect(() => {
    if (!isLoaded) setLoaded(true);
  }, [isLoaded]);


  if (!isLoaded) return null;

  return (
    <span>
      <Table
        key={renderKey}
        columns={columns}
        data={data as any}
        defaultNumberOfRows={(isLargeVerticalScreen || isSmallScreen) ? 10 : 5}
        isLoading={isLoading}
        isDraggable={false}
        canExportAllData={true}
        canFilter={false}
        canSearch={!isSmallScreen}
        withGrouping={false}
        rowHeight="5rem"
        title="Categories"
      />
    </span>
  )
}

export default MetagameCategoriesTable;