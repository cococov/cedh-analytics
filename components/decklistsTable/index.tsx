"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
/* Vendor */
import { MaterialOpenInNewIcon } from '@/components/vendor/materialIcon';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { find } from 'ramda';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import Table, { TextFilter, SelectFilter } from '@/components/table';
/* Static */
import styles from '@styles/CardsList.module.css';

type DecklistsData = {
  url: string
  name: string
  wins: number
  winRate: number
  standing: number
  hasPartners: boolean
  tournamentName: string
  dateCreated: number
  hasCompanion: boolean
  companions: string[]
  hasStickers: boolean
  stickers: string[]
  tokens: string[]
  colorPercentages: { [key: string]: number }
  colorIdentityPercentages: { [key: string]: number }
  cantBattles: number
  cantPlaneswalkers: number
  cantCreatures: number
  cantSorceries: number
  cantInstants: number
  cantArtifacts: number
  cantEnchantments: number
  cantLands: number
  avgCmcWithLands: number
  avgCmcWithoutLands: number
};

export default function DecklistsTable({
  title,
  decklists,
}: {
  title?: string,
  decklists: DecklistsData[],
}) {
  const [isLoaded, setLoaded] = useState(false);
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const texInputChangeRef = useRef<any>(null);
  const [columns, setColumns] = useState([
    {
      title: 'Decklist',
      field: 'name',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      cellStyle: {
        minWidth: '10rem'
      },
    },
    {
      title: 'Wins',
      field: 'wins',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultSort: 'desc',
    },
    {
      title: 'Draws',
      field: 'draws',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultSort: 'desc',
    },
    {
      title: 'Losses',
      field: 'losses',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
      defaultSort: 'desc',
    },
    {
      title: 'Winrate',
      field: 'winRate',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      render: function PercentageOfUse(rowData: any) {
        const value = rowData.winRate;
        return (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>);
      },
    },
    {
      title: 'DrawRate',
      field: 'drawRate',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      render: function PercentageOfUse(rowData: any) {
        const value = rowData.drawRate;
        return (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>);
      },
    },
    {
      title: 'Standing',
      field: 'standing',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Tournament',
      field: 'tournamentName',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      hideFilterIcon: true,
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextFilter texInputChangeRef={texInputChangeRef} columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Avg CMC W/L',
      field: 'avgCmcWithLands',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Avg CMC Wo/L',
      field: 'avgCmcWithoutLands',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Has Companion',
      field: 'hasCompanion',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Has Stickers',
      field: 'hasStickers',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Lands',
      field: 'cantLands',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Creatures',
      field: 'cantCreatures',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Planeswalkers',
      field: 'cantPlaneswalkers',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Sorceries',
      field: 'cantSorceries',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
    },
    {
      title: 'Instants',
      field: 'cantInstants',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
    },
    {
      title: 'Artifacts',
      field: 'cantArtifacts',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
    },
    {
      title: 'Enchantments',
      field: 'cantEnchantments',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
    },
  ]);

  useEffect(() => {
    if (isSmallScreen) {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (current.field !== 'name' && current.field !== 'winRate') {
            return { ...current, hidden: true };
          }
          return current;
        });
      });
    } else {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (
            current.field === 'name' ||
            current.field === 'wins' ||
            current.field === 'draws' ||
            current.field === 'winRate' ||
            current.field === 'drawRate' ||
            current.field === 'standing' ||
            current.field === 'tournamentName' ||
            current.field === 'avgCmcWithLands' ||
            current.field === 'cantLands'
          ) {
            return { ...current, hidden: false };
          }
          return { ...current, hidden: true };
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
    if (isSmallScreen || isMediumScreen) {
      const decklist = find(d => d.name === rowData.name, decklists);
      window.open(decklist?.url, '_ blank');
    }
  }, [isSmallScreen, isMediumScreen]);

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
          data={decklists}
          defaultNumberOfRows={(isLargeVerticalScreen || isSmallScreen) ? 10 : 5}
          isLoading={false}
          isDraggable={false}
          canExportAllData={true}
          canFilter={true}
          canSearch={true}
          withGrouping={false}
          rowHeight="5rem"
          title={title || 'Decklists'}
          onRowClick={(isSmallScreen || isMediumScreen) ? handleClickRow : undefined}
          actions={(isSmallScreen || isMediumScreen) ? [] : [
            {
              icon: function ReadMore() { return <MaterialOpenInNewIcon /> },
              tooltip: 'Go to decklist',
              onClick: (_event, rowData: any = {}) => {
                const decklist = find(d => d.name === rowData.name, decklists);
                window.open(decklist?.url, '_ blank');
              }
            }
          ]}
        />
      </span>
    </span>
  )
};
