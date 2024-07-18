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

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
/* Vendor */
import { find, pipe, replace, filter, has } from 'ramda';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import Table, { NumberFilterWithOperator, DateRangeFilter } from '@/components/table';
import AppContext from '@/contexts/appStore';
import getLocalTournaments from './getLocalTournaments';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ResponsiveHorizontalAdUnitMobile from '@/components/googleAds/responsiveHorizontalAdUnitMobile';
/* Static */
import styles from '@/styles/CardsList.module.css';

type Tournament = {
  TID: string;
  name: string;
  date: string;
  size: number;
  validLists: number;
  processed: boolean;
};

const COLUMNS_INDEXED = {
  0: 'name',
  1: 'size',
  2: 'validLists',
  3: 'date',
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
  const texInputChangeRef = useRef<any>(null);
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
      title: 'Valid decklists',
      field: 'validLists',
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
      title: 'Date',
      field: 'date',
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
    const encodedTournamentName = pipe(
      String,
      encodeURIComponent,
      replace(/!/g, '%21'),
      replace(/\(/g, '%28'),
      replace(/\)/g, '%29'),
    )(tournamentName);
    router.push(`/tournaments/${encodedTournamentName}`);
  }, []);

  if (!isLoaded) return (
    <span className={styles.cardsTableLoading}>
      <CircularProgress size="lg" color="secondary" aria-label="Loading..." />
    </span>
  );

  return (
    <span className={styles.commandersContainer}>
      <ResponsiveHorizontalAdUnitMobile slot={6099705880} />
      <span className={styles.cardsTable}>
        <Table
          key={renderKey}
          columns={columns}
          data={query => getLocalTournaments(
            tournaments,
            query.page,
            query.pageSize,
            // @ts-ignore
            COLUMNS_INDEXED[filter(has('sortOrder'), query.orderByCollection || [])[0]?.orderBy] || 'date',
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
          title="Tournaments"
          onRowClick={handleClickRow}
        />
      </span>
    </span>
  )
};
