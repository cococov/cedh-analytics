/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
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

"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
/* Vendor */
import { MaterialOpenInNewIcon } from '@/components/vendor/materialIcon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { find, filter, has } from 'ramda';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import Table, { TextFilter, SelectFilter, DateRangeFilter, NumberFilterWithOperator } from '@/components/table';
import getLocalDecklists from './getLocalDecklists';
/* Static */
import styles from '@/styles/CardsList.module.css';

type DecklistsData = {
  url: string
  name: string
  wins: number
  winRate: number
  standing: number
  hasPartners: boolean
  tournamentName: string
  dateCreated: string
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

const COLUMNS_INDEXED = {
  0: 'name',
  1: 'wins',
  2: 'draws',
  3: 'losses',
  4: 'winRate',
  5: 'drawRate',
  6: 'standing',
  7: 'tournamentName',
  8: 'avgCmcWithLands',
  9: 'avgCmcWithoutLands',
  10: 'hasCompanion',
  11: 'hasStickers',
  12: 'cantLands',
  13: 'cantCreatures',
  14: 'cantPlaneswalkers',
  15: 'cantSorceries',
  16: 'cantInstants',
  17: 'cantArtifacts',
  18: 'cantEnchantments',
  19: 'dateCreated',
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
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultSort: 'desc',
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Draws',
      field: 'draws',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultSort: 'desc',
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Losses',
      field: 'losses',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      defaultSort: 'desc',
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Winrate',
      field: 'winRate',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
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
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
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
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
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
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Avg CMC Wo/L',
      field: 'avgCmcWithoutLands',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
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
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Creatures',
      field: 'cantCreatures',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Planeswalkers',
      field: 'cantPlaneswalkers',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Sorceries',
      field: 'cantSorceries',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Instants',
      field: 'cantInstants',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Artifacts',
      field: 'cantArtifacts',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Enchantments',
      field: 'cantEnchantments',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      defaultFilter: undefined,
      defaultFilterOperator: '=',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <NumberFilterWithOperator
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
          texInputChangeRef={texInputChangeRef}
        />
      ),
    },
    {
      title: 'Date',
      field: 'dateCreated',
      type: 'date',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      defaultSort: 'desc',
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <DateRangeFilter
          columnDef={columnDef}
          onFilterChanged={onFilterChanged}
        />
      ),
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
    <span className={styles.decklistsContainer}>
      <span className={styles.cardsTable}>
        <Table
          key={renderKey}
          columns={columns}
          data={query => getLocalDecklists(
            decklists,
            query.page,
            query.pageSize,
            // @ts-ignore
            COLUMNS_INDEXED[filter(has('sortOrder'), query.orderByCollection || [])[0]?.orderBy] || 'wins',
            filter(has('sortOrder'), query.orderByCollection || [])[0]?.orderDirection,
            query.search,
            query?.filters?.map((q: any) => ({
              column: q.column.field,
              operator: q.operator,
              value: q.value,
            })) || [],
          )}
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
