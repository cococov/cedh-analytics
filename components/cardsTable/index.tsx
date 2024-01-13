"use client";

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ReadonlyURLSearchParams } from 'next/navigation';
/* Vendor */
import { replace, findIndex, includes, filter, isNotNil, not, equals, has, isNil } from 'ramda';
import { MaterialReadMoreIcon } from '@/components/vendor/materialIcon';
import { MaterialChip } from '@/components/vendor/materialUi';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CircularProgress } from "@nextui-org/react";
import { parse as qsParse } from 'qs';
/* Own */
import Table, { TextFilter, SelectFilter } from '@/components/table';
import AppContext from '@contexts/appStore';
import getCards from './getCards';
import useQueryParams from '@/hooks/useQueryParams';
/* Static */
import styles from '@styles/CardsList.module.css';
import B from '@public/images/B.png';
import G from '@public/images/G.png';
import R from '@public/images/R.png';
import U from '@public/images/U.png';
import W from '@public/images/W.png';
import C from '@public/images/C.png';

const IDENTITY_COLORS = { B: B, G: G, R: R, U: U, W: W, C: C };

type CardProps = any; // TODO: define type
type SortDirection = 'asc' | 'desc';

const COLUMNS_INDEXED = {
  0: 'card_name',
  1: 'occurrences',
  2: 'type',
  3: 'color_identity',
  4: 'colors',
  5: 'cmc',
  6: 'power',
  7: 'toughness',
  8: 'last_print',
  9: 'multiple_printings',
  10: 'reserved',
  11: 'is_in_99',
  12: 'is_commander',
  13: 'percentage_of_use',
  14: 'percentage_of_use_by_identity',
  15: 'tags',
  16: 'avg_win_rate',
  17: 'avg_draw_rate',
};

const DEFAULT_SORT: { column: number, sortDirection: SortDirection } = { column: 1, sortDirection: 'desc' };
const DEFAULT_COLUMN_SHOWN = [0, 1, 2, 3, 8];
const DEFAULT_COLUMN_SHOWN_SMALL = [0, 1];

function isSortedInUrl(
  queryParams: ReadonlyURLSearchParams,
  columnNumber: number,
  withUrlPArams: boolean,
  setQueryParams: (params: { so?: SortDirection; ob?: number; }) => void,
): SortDirection | undefined {
  if (!withUrlPArams) return columnNumber === DEFAULT_SORT.column ? DEFAULT_SORT.sortDirection : undefined;

  const sortOrder = queryParams.get('so') as SortDirection | undefined;
  const orderBy = queryParams.get('ob');

  if (
    isNil(orderBy)
    || isNaN(Number(orderBy))
    || (sortOrder !== 'asc' && sortOrder !== 'desc')
    || (Number(orderBy) < 0 || Number(orderBy) > Math.max(...Object.keys(COLUMNS_INDEXED).map(Number)))
  ) {
    setQueryParams({ so: DEFAULT_SORT.sortDirection, ob: DEFAULT_SORT.column });
    return columnNumber === DEFAULT_SORT.column ? DEFAULT_SORT.sortDirection : undefined;
  };

  return orderBy === columnNumber.toString() ? sortOrder : undefined;
};

function getPageSize(
  queryParams: ReadonlyURLSearchParams,
  withUrlPArams: boolean,
  isVerticalOrSmall: boolean,
  setQueryParams: (params: { ps?: number; }) => void,
): number {
  const defaultPageSize = isVerticalOrSmall ? 10 : 5;
  if (!withUrlPArams) return defaultPageSize;

  const pageSize = queryParams.get('ps');

  if (isNil(pageSize) || isNaN(Number(pageSize)) || Number(pageSize) < 0 || Number(pageSize) > 100) {
    setQueryParams({ ps: defaultPageSize });
    return defaultPageSize;
  }

  return Number(pageSize);
};

function isShowInUrl(
  queryParams: ReadonlyURLSearchParams,
  columnNumber: number,
  withUrlPArams: boolean,
  setQueryParams: (params: { cs?: number[]; }) => void,
  isSmallScreen?: boolean,
): boolean {
  const default_columns = isSmallScreen ? DEFAULT_COLUMN_SHOWN_SMALL : DEFAULT_COLUMN_SHOWN;
  if (!withUrlPArams) return includes(columnNumber, default_columns);

  const columnsShown = queryParams.get('cs')?.split(',').map(x => parseInt(x)) || [];

  if (isNil(columnsShown) || columnsShown.length === 0) {
    setQueryParams({ cs: default_columns });
    return includes(columnNumber, default_columns);
  }

  return includes(columnNumber, columnsShown);
};

function defaultFilterForColumn(
  queryParams: ReadonlyURLSearchParams,
  columnNumber: number,
  withUrlPArams: boolean,
): string | string[] | undefined {
  if (!withUrlPArams) return undefined;

  const filters = qsParse(queryParams.get('f') || '') as { [key: number]: string | string[] };

  return filters[columnNumber];
};

export default function CardsTable({
  title,
  handleChangeCard,
  cardUrlBase,
  fromMetagame,
  table,
  cards,
  noInfo,
  withUrlPArams,
}: {
  title?: string,
  handleChangeCard?: (cardName: string | undefined) => void,
  cardUrlBase: string,
  fromMetagame?: boolean,
  table?: 'metagame_cards' | 'db_cards',
  cards?: CardProps[],
  noInfo?: boolean,
  withUrlPArams?: boolean,
}) {
  const router = useRouter();
  const { toggleLoading } = useContext(AppContext);
  const [isLoaded, setLoaded] = useState(false);
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const texInputChangeRef = useRef<any>(null);
  const { queryParams, setQueryParams } = useQueryParams<{
    so?: SortDirection; // Sort Order [asc, desc]
    ob?: number; // Order By
    ps?: number; // Page Size
    cs?: number[]; // Columns shown
    f?: {
      [key: number]: {
        o: string; // Operator
        v: string | string[] | boolean | number;
      }
    }; // Filters
  }>();
  const [columns, setColumns] = useState([
    {
      title: 'Name',
      field: 'card_name',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 0, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 0, !!withUrlPArams),
      cellStyle: { minWidth: '13rem' },
      defaultSort: isSortedInUrl(queryParams, 0, !!withUrlPArams, setQueryParams),
    },
    {
      title: 'Occurrences',
      field: 'occurrences',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 1, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 1, !!withUrlPArams),
      searchable: false,
      defaultSort: isSortedInUrl(queryParams, 1, !!withUrlPArams, setQueryParams),
    },
    {
      title: 'Type',
      field: 'type',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 2, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 2, !!withUrlPArams),
      searchable: false,
      lookup: {
        'Artifact': 'Artifact',
        'Land': 'Land',
        'Instant': 'Instant',
        'Sorcery': 'Sorcery',
        'Enchantment': 'Enchantment',
        'Creature': 'Creature',
        'Planeswalker': 'Planeswalker',
        'Battle': 'Battle',
      },
      cellStyle: {
        minWidth: '8rem'
      },
      defaultSort: isSortedInUrl(queryParams, 2, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Identity',
      field: 'color_identity',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 3, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 3, !!withUrlPArams),
      searchable: false,
      lookup: {
        'C': 'C',
        'W': 'W',
        'U': 'U',
        'B': 'B',
        'R': 'R',
        'G': 'G',
        'WU': 'WU',
        'WB': 'WB',
        'WR': 'WR',
        'WG': 'WG',
        'UB': 'UB',
        'UR': 'UR',
        'UG': 'UG',
        'BR': 'BR',
        'BG': 'BG',
        'RG': 'RG',
        'WBG': 'WBG',
        'WUB': 'WUB',
        'WUG': 'WUG',
        'WUR': 'WUR',
        'WBR': 'WBR',
        'WRG': 'WRG',
        'UBG': 'UBG',
        'UBR': 'UBR',
        'URG': 'URG',
        'BRG': 'BRG',
        'WUBR': 'WUBR',
        'WUBG': 'WUBG',
        'WURG': 'WURG',
        'WBRG': 'WBRG',
        'UBRG': 'UBRG',
        'WUBRG': 'WUBRG',
      },
      cellStyle: {
        minWidth: '5rem'
      },
      render: function Identity(rowData: any) {
        const value = rowData.color_identity;
        return (
          <span>
            {
              value
                ?.split('')
                ?.map((icon: 'B' | 'G' | 'R' | 'U' | 'W' | 'C') => (<Image key={icon} src={IDENTITY_COLORS[icon]} alt={icon} width={18} height={18} priority />))
            }
          </span>
        );
      },
      defaultSort: isSortedInUrl(queryParams, 3, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Colors',
      field: 'colors',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 4, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 4, !!withUrlPArams),
      searchable: false,
      lookup: {
        'C': 'C',
        'W': 'W',
        'U': 'U',
        'B': 'B',
        'R': 'R',
        'G': 'G',
        'WU': 'WU',
        'WB': 'WB',
        'WR': 'WR',
        'WG': 'WG',
        'UB': 'UB',
        'UR': 'UR',
        'UG': 'UG',
        'BR': 'BR',
        'BG': 'BG',
        'RG': 'RG',
        'WBG': 'WBG',
        'WUB': 'WUB',
        'WUG': 'WUG',
        'WUR': 'WUR',
        'WBR': 'WBR',
        'WRG': 'WRG',
        'UBG': 'UBG',
        'UBR': 'UBR',
        'URG': 'URG',
        'BRG': 'BRG',
        'WUBR': 'WUBR',
        'WUBG': 'WUBG',
        'WURG': 'WURG',
        'WBRG': 'WBRG',
        'UBRG': 'UBRG',
        'WUBRG': 'WUBRG',
      },
      cellStyle: {
        minWidth: '5rem'
      },
      render: function Colors(rowData: any) {
        const value = rowData.colors;
        return (
          <span>
            {
              value
                .split('')
                .map((icon: 'B' | 'G' | 'R' | 'U' | 'W' | 'C') => (<Image key={icon} src={IDENTITY_COLORS[icon]} alt={icon} width={18} height={18} priority />))
            }
          </span>
        );
      },
      defaultSort: isSortedInUrl(queryParams, 4, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'CMC',
      field: 'cmc',
      align: 'center',
      type: 'numeric',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 5, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 5, !!withUrlPArams),
      searchable: false,
      hideFilterIcon: true,
      defaultSort: isSortedInUrl(queryParams, 5, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextFilter texInputChangeRef={texInputChangeRef} columnDef={columnDef} onFilterChanged={onFilterChanged} type="number" />
      ),
    },
    {
      title: 'Power',
      field: 'power',
      align: 'center',
      type: 'numeric',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 6, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 6, !!withUrlPArams),
      searchable: false,
      hideFilterIcon: true,
      emptyValue: '-',
      defaultSort: isSortedInUrl(queryParams, 6, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextFilter texInputChangeRef={texInputChangeRef} columnDef={columnDef} onFilterChanged={onFilterChanged} type="number" />
      ),
    },
    {
      title: 'Toughness',
      field: 'toughness',
      align: 'center',
      type: 'numeric',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 7, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 7, !!withUrlPArams),
      searchable: false,
      hideFilterIcon: true,
      emptyValue: '-',
      defaultSort: isSortedInUrl(queryParams, 7, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextFilter texInputChangeRef={texInputChangeRef} columnDef={columnDef} onFilterChanged={onFilterChanged} type="number" />
      ),
    },
    {
      title: 'Last Print',
      field: 'last_print',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 8, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 8, !!withUrlPArams),
      searchable: false,
      hideFilterIcon: true,
      cellStyle: {
        minWidth: '13rem'
      },
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextFilter texInputChangeRef={texInputChangeRef} columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
      defaultSort: isSortedInUrl(queryParams, 8, !!withUrlPArams, setQueryParams),
    },
    {
      title: 'Multiple Printings',
      field: 'multiple_printings',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 9, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 9, !!withUrlPArams),
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
      defaultSort: isSortedInUrl(queryParams, 9, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Reserved List',
      field: 'reserved',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 10, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 10, !!withUrlPArams),
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
      defaultSort: isSortedInUrl(queryParams, 10, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'in 99',
      field: 'is_in_99',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 11, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 11, !!withUrlPArams),
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
      defaultSort: isSortedInUrl(queryParams, 11, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Commander',
      field: 'is_commander',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 12, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 12, !!withUrlPArams),
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
      defaultSort: isSortedInUrl(queryParams, 12, !!withUrlPArams, setQueryParams),
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: '% of Use',
      field: 'percentage_of_use',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 13, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 13, !!withUrlPArams),
      searchable: false,
      render: function PercentageOfUse(rowData: any) {
        const value = rowData.percentage_of_use;
        return (<span>{value}%</span>);
      },
      defaultSort: isSortedInUrl(queryParams, 13, !!withUrlPArams, setQueryParams),
    },
    {
      title: '% of Use in identity',
      field: 'percentage_of_use_by_identity',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 14, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 14, !!withUrlPArams),
      searchable: false,
      render: function PercentageOfUseByIdentity(rowData: any) {
        const value = rowData.percentage_of_use_by_identity;
        return (<span>{value}%</span>);
      },
      defaultSort: isSortedInUrl(queryParams, 14, !!withUrlPArams, setQueryParams),
    },
    {
      title: 'Tags',
      field: 'tags',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: !isShowInUrl(queryParams, 15, !!withUrlPArams, setQueryParams),
      defaultFilter: defaultFilterForColumn(queryParams, 15, !!withUrlPArams),
      hideFilterIcon: true,
      searchable: false,
      cellStyle: {
        minWidth: '13rem'
      },
      render: function Tags(rowData: any) {
        const value = typeof rowData.tags === 'string' ? JSON.parse(rowData.tags) : rowData.tags;
        return (
          <span className={styles.cardTagsWrapper}>
            {
              value.map((tag: string, _index: number) => (<MaterialChip key={tag} label={tag} size="small" className={styles.cardTag} />))
            }
          </span>
        );
      },
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextFilter texInputChangeRef={texInputChangeRef} columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
      defaultSort: isSortedInUrl(queryParams, 15, !!withUrlPArams, setQueryParams),
    },
  ]);

  useEffect(() => {
    if (isSmallScreen) {
      setColumns((previous: any) => {
        return previous.map((current: any, index: number) => {
          return { ...current, hidden: !isShowInUrl(queryParams, index, !!withUrlPArams, setQueryParams, true) };
        });
      });
    } else {
      setColumns((previous: any) => {
        return previous.map((current: any, index: number) => {
          return { ...current, hidden: !isShowInUrl(queryParams, index, !!withUrlPArams, setQueryParams) };
        });
      });
    }
    setRenderKey(`render-${Math.random()}`);
  }, [isSmallScreen]);

  useEffect(() => {
    if (!fromMetagame) return;
    if (findIndex(x => x.field === 'avg_win_rate', columns) !== -1) return;

    setColumns((previous) => {
      if (findIndex(x => x.field === 'avg_win_rate', previous) !== -1) return previous;
      return [
        ...previous,
        {
          title: 'Avg. Winrate',
          field: 'avg_win_rate',
          align: 'center',
          grouping: false,
          filtering: false,
          editable: 'never',
          hidden: !isShowInUrl(queryParams, 16, !!withUrlPArams, setQueryParams),
          defaultFilter: defaultFilterForColumn(queryParams, 16, !!withUrlPArams),
          searchable: false,
          render: function PercentageOfUse(rowData: any) {
            const value = parseFloat(rowData.avg_win_rate);
            return (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>);
          },
          defaultSort: isSortedInUrl(queryParams, 16, !!withUrlPArams, setQueryParams),
        },
        {
          title: 'Avg. Drawrate',
          field: 'avg_draw_rate',
          align: 'center',
          grouping: false,
          filtering: false,
          editable: 'never',
          hidden: !isShowInUrl(queryParams, 17, !!withUrlPArams, setQueryParams),
          defaultFilter: defaultFilterForColumn(queryParams, 17, !!withUrlPArams),
          searchable: false,
          render: function PercentageOfUse(rowData: any) {
            const value = parseFloat(rowData.avg_draw_rate);
            return (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>);
          },
          defaultSort: isSortedInUrl(queryParams, 17, !!withUrlPArams, setQueryParams),
        },
      ]
    });
  }, [fromMetagame]);

  useEffect(() => {
    setRenderKey(`render-${Math.random()}`);
  }, [isLargeVerticalScreen]);

  useEffect(() => {
    if (!isLoaded) setLoaded(true);
  }, [isLoaded]);

  const handleClickRow = useCallback((_e: any, rowData: any = {}) => {
    if (isSmallScreen || isMediumScreen) {
      toggleLoading(true);
      router.push(`${cardUrlBase}/${replace(/\//g, '%2F', rowData['card_name'])}`);
    } else {
      if (handleChangeCard !== undefined) {
        handleChangeCard(rowData['card_name']);
      }
    }
  }, [isSmallScreen, isMediumScreen]);

  if (!isLoaded) return (
    <span className={styles.cardsTableLoading}>
      <CircularProgress size="lg" color="secondary" aria-label="Loading..." />
    </span>
  );

  return (
    <span className={styles.cardsTable}>
      <Table
        key={renderKey}
        columns={columns}
        // @ts-ignore
        data={
          Boolean(cards)
            ? cards
            : query => getCards(
              table || 'metagame_cards',
              query.page,
              query.pageSize,
              // @ts-ignore
              COLUMNS_INDEXED[filter(has('sortOrder'), query.orderByCollection || [])[0]?.orderBy] || 'occurrences', // Sólo permitimos ordenar por una columna
              filter(has('sortOrder'), query.orderByCollection || [])[0]?.orderDirection, // Sólo permitimos ordenar por una columna
              query.search,
              query?.filters?.map((q: any) => ({
                column: q.column.field,
                operator: q.operator,
                value: q.value,
              })) || [],
            )
        }
        defaultNumberOfRows={getPageSize(queryParams, !!withUrlPArams, (isLargeVerticalScreen || isSmallScreen), setQueryParams)}
        isLoading={false}
        isDraggable={false}
        canExportAllData={true}
        canFilter={true}
        canSearch={true}
        withGrouping={false}
        rowHeight="5rem"
        minBodyHeight={465}
        title={title || 'Cards Played'}
        onRowClick={(isSmallScreen || isMediumScreen || !Boolean(noInfo)) ? handleClickRow : undefined}
        actions={(isSmallScreen || isMediumScreen) ? [] : [
          {
            icon: function ReadMore() { return <MaterialReadMoreIcon /> },
            tooltip: 'Go to Card Page',
            onClick: (_event, rowData: any = {}) => {
              toggleLoading(true);
              router.push(`${cardUrlBase}/${replace(/\//g, '%2F', rowData['card_name'])}`);
            }
          }
        ]}
        onOrderCollectionChange={(
          orderByCollection: {
            orderBy: number,
            sortOrder: number,
            orderDirection: SortDirection,
          }[]) => {
          if (!withUrlPArams) return;
          const orderBy = orderByCollection[0]?.orderBy;
          const orderDirection = orderByCollection[0]?.orderDirection;
          setQueryParams({ so: orderDirection, ob: orderBy });
        }}
        onRowsPerPageChange={(pageSize: number) => {
          if (!withUrlPArams) return;
          setQueryParams({ ps: pageSize });
        }}
        onChangeColumnHidden={(column: any, hidden: boolean) => {
          if (!withUrlPArams) return;
          const columnNumber = column.tableData.id;
          const columnsShown = filter(x => isNotNil(x) && not(equals(NaN, x)), queryParams.get('cs')?.split(',').map(x => parseInt(x)) || []);
          const isSaved = includes(columnNumber, columnsShown);
          if (hidden && isSaved) {
            setQueryParams({ cs: columnsShown.filter((x: number) => x !== columnNumber) });
          } else if (!hidden && !isSaved) {
            setQueryParams({ cs: [...columnsShown, columnNumber] });
          }
        }}
        onFilterChange={(
          filters: {
            column: { field: string, tableData: { id: number } },
            operator: string, value: string | number | boolean
          }[]) => {
          if (!withUrlPArams) return;
          if (filters.length === 0) {
            setQueryParams({ f: undefined });
            return;
          }
          const filtersObject = filters.reduce((acc: any, current: any) => {
            const columnNumber = current.column.tableData.id;
            const operator = current.operator;
            const value = current.value;
            return {
              ...acc,
              [columnNumber]: {
                o: operator,
                v: value,
              }
            };
          }, {});
          setQueryParams({ f: filtersObject });
        }}
      />
    </span>
  );
};
