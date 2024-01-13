"use client";

import { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
/* Vendor */
import { find } from 'ramda';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import Table from '@/components/table';
import AppContext from '@contexts/appStore';
import { useMediaQuery } from '@hooks/useMediaQuery';
/* Static */
import styles from '@styles/CardsList.module.css';

type Tournament = {
  TID: string;
  name: string;
  date: string;
  size: number;
  validLists: number;
  processed: boolean;
};

export default function TournamentsTable({
  tournaments,
}: {
  tournaments: Tournament[],
}) {
  const router = useRouter();
  const { toggleLoading } = useContext(AppContext);
  const [isLoaded, setLoaded] = useState(false);
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const [columns, setColumns] = useState([
    {
      title: 'Name',
      field: 'name',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      cellStyle: {
        minWidth: '25rem'
      },
    },
    {
      title: 'Size',
      field: 'size',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Valid decklists',
      field: 'validLists',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Date',
      field: 'date',
      type: 'date',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultSort: 'desc',
    },
  ]);

  useEffect(() => {
    if (isSmallScreen) {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (current.field === 'validLists') return { ...current, hidden: true };
          if (current.field === 'name') return { ...current, cellStyle: { minWidth: '10rem' } };
          return current;
        });
      });
    } else {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (current.field === 'validLists') return { ...current, hidden: false };
          if (current.field === 'name') return { ...current, cellStyle: { minWidth: '25rem' } };
          return current;
        });
      });
    }
    setRenderKey(`render-${Math.random()}`);
  }, [isSmallScreen]);

  useEffect(() => {
    setRenderKey(`render-${Math.random()}`);
  }, [isLargeVerticalScreen]);

  useEffect(() => {
    if (!isLoaded) setLoaded(true);
  }, [isLoaded]);

  const handleClickRow = useCallback((_e: any, rowData: any = {}) => {
    toggleLoading(true);
    const tournamentName = find(d => d.name === rowData.name, tournaments)?.name;
    router.push(`/tournaments/${tournamentName}`);
  }, []);

  if (!isLoaded) return (
    <span className={styles.cardsTableLoading}>
      <CircularProgress size="lg" color="secondary" aria-label="Loading..." />
    </span>
  );

  return (
    <span className={styles.commandersContainer}>
      <span className={styles.cardsTable}>
        <Table
          key={renderKey}
          columns={columns}
          data={tournaments}
          defaultNumberOfRows={(isLargeVerticalScreen || isSmallScreen) ? 10 : 5}
          isLoading={false}
          isDraggable={false}
          canExportAllData={true}
          canFilter={false}
          canSearch={true}
          withGrouping={false}
          rowHeight="5rem"
          title="Tournaments"
          onRowClick={handleClickRow}
        />
      </span>
    </span>
  )
};
