"use client";

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
/* Vendor */
import { replace, findIndex, set } from 'ramda';
import { MaterialReadMoreIcon } from '../vendor/materialIcon';
import { MaterialChip } from '../vendor/materialUi';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import TextField from '@mui/material/TextField';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import Table from '../table';
import AppContext from '../../contexts/appStore';
import getCards from './getCards';
/* Static */
import styles from '../../styles/CardsList.module.css';
import B from '../../public/images/B.png';
import G from '../../public/images/G.png';
import R from '../../public/images/R.png';
import U from '../../public/images/U.png';
import W from '../../public/images/W.png';
import C from '../../public/images/C.png';

const IDENTITY_COLORS = { B: B, G: G, R: R, U: U, W: W, C: C };

type CardProps = any; // TODO: define type

export default function CardsTable({
  title,
  handleChangeCard,
  cardUrlBase,
  fromMetagame,
  table,
  cards,
  noInfo,
}: {
  title?: string,
  handleChangeCard?: (cardName: string | undefined) => void,
  cardUrlBase: string,
  fromMetagame?: boolean,
  table?: 'metagame_cards' | 'db_cards',
  cards?: CardProps[],
  noInfo?: boolean,
}) {
  const router = useRouter();
  const { toggleLoading } = useContext(AppContext);
  const [isLoaded, setLoaded] = useState(false);
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const texInputChangeRef = useRef<any>(null);
  const [columns, setColumns] = useState([
    {
      title: 'Name',
      field: 'card_name',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      cellStyle: {
        minWidth: '13rem'
      },
    },
    {
      title: 'Occurrences',
      field: 'occurrences',
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
      title: 'Type',
      field: 'type',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
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
    },
    {
      title: 'Identity',
      field: 'color_identity',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
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
      render: function Identity(rowData: any, type: any) {
        const value = type === 'row' ? rowData.color_identity : rowData;
        return type === 'row' ? (
          <span>
            {
              value
                ?.split('')
                ?.map((icon: 'B' | 'G' | 'R' | 'U' | 'W' | 'C') => (<Image key={icon} src={IDENTITY_COLORS[icon]} alt={icon} width={18} height={18} priority />))
            }
          </span>
        ) : value;
      },
    },
    {
      title: 'Colors',
      field: 'colors',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
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
      render: function Colors(rowData: any, type: any) {
        const value = type === 'row' ? rowData.colors : rowData;
        return type === 'row' ? (
          <span>
            {
              value
                .split('')
                .map((icon: 'B' | 'G' | 'R' | 'U' | 'W' | 'C') => (<Image key={icon} src={IDENTITY_COLORS[icon]} alt={icon} width={18} height={18} priority />))
            }
          </span>
        ) : value;
      },
    },
    {
      title: 'CMC',
      field: 'cmc',
      align: 'center',
      type: 'numeric',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      hideFilterIcon: true,
    },
    {
      title: 'Power',
      field: 'power',
      align: 'center',
      type: 'numeric',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      hideFilterIcon: true,
    },
    {
      title: 'Toughness',
      field: 'toughness',
      align: 'center',
      type: 'numeric',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      hideFilterIcon: true,
    },
    {
      title: 'Last Print',
      field: 'last_print',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      hideFilterIcon: true,
      cellStyle: {
        minWidth: '13rem'
      },
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextField
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (Boolean(texInputChangeRef.current)) {
              clearTimeout(texInputChangeRef.current);
            }
            texInputChangeRef.current = setTimeout(() => {
              onFilterChanged(columnDef.tableData.id, e.target.value);
            }, 500); // 500ms delay before filtering
          }}
        />
      ),
    },
    {
      title: 'Multiple Printings',
      field: 'multiple_printings',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
    },
    {
      title: 'Reserved List',
      field: 'reserved',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
    },
    {
      title: 'in 99',
      field: 'is_in_99',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
    },
    {
      title: 'Commander',
      field: 'is_commander',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
    },
    {
      title: '% of Use',
      field: 'percentage_of_use',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
      render: function PercentageOfUse(rowData: any, type: any) {
        const value = type === 'row' ? rowData.percentage_of_use : rowData;
        return type === 'row' ? (<span>{value}%</span>) : value;
      },
    },
    {
      title: '% of Use in identity',
      field: 'percentage_of_use_by_identity',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
      render: function PercentageOfUseByIdentity(rowData: any, type: any) {
        const value = type === 'row' ? rowData.percentage_of_use_by_identity : rowData;
        return type === 'row' ? (<span>{value}%</span>) : value;
      },
    },
    {
      title: 'Tags',
      field: 'tags',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: true,
      hideFilterIcon: true,
      searchable: false,
      cellStyle: {
        minWidth: '13rem'
      },
      render: function Tags(rowData: any, type: any) {
        const value = type === 'row'
          ? typeof rowData.tags === 'string'
            ? JSON.parse(rowData.tags)
            : rowData.tags
          : rowData;
        return type === 'row' ? (
          <span className={styles.cardTagsWrapper}>
            {
              value.map((tag: string, _index: number) => (<MaterialChip key={tag} label={tag} size="small" className={styles.cardTag} />))
            }
          </span>
        ) : value;
      },
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <TextField
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (Boolean(texInputChangeRef.current)) {
              clearTimeout(texInputChangeRef.current);
            }
            texInputChangeRef.current = setTimeout(() => {
              onFilterChanged(columnDef.tableData.id, e.target.value);
            }, 500); // 500ms delay before filtering
          }}
        />
      ),
    },
  ]);

  useEffect(() => {
    if (isSmallScreen) {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (current.field !== 'card_name' && current.field !== 'occurrences') {
            return { ...current, hidden: true };
          }
          return current;
        });
      });
    } else {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (
            current.field === 'card_name' ||
            current.field === 'occurrences' ||
            current.field === 'type' ||
            current.field === 'color_identity' ||
            current.field === 'last_print'
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
          hidden: true,
          searchable: false,
          render: function PercentageOfUse(rowData: any, type: any) {
            const value = type === 'row' ? parseFloat(rowData.avg_win_rate) : rowData;
            return type === 'row' ? (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>) : value;
          },
        },
        {
          title: 'Avg. Drawrate',
          field: 'avg_draw_rate',
          align: 'center',
          grouping: false,
          filtering: false,
          editable: 'never',
          hidden: true,
          searchable: false,
          render: function PercentageOfUse(rowData: any, type: any) {
            const value = type === 'row' ? parseFloat(rowData.avg_draw_rate) : rowData;
            return type === 'row' ? (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>) : value;
          },
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
    <span className={styles.cardsTable}>
      <CircularProgress size="lg" color="secondary" aria-label="Loading..." label="Loading..." />
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
              query.orderBy,
              query.orderDirection,
              query.search,
              query?.filters?.map((q: any) => ({
                column: q.column.field,
                operator: q.operator,
                value: q.value,
              })) || [],
            )
        }
        defaultNumberOfRows={(isLargeVerticalScreen || isSmallScreen) ? 10 : 5}
        isLoading={false}
        isDraggable={false}
        canExportAllData={true}
        canFilter={true}
        canSearch={true}
        withGrouping={false}
        rowHeight="5rem"
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
      />
    </span>
  );
};
