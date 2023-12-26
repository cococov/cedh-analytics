"use client";

import { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
/* Vendor */
import { MaterialReadMoreIcon } from '../vendor/materialIcon';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { replace } from 'ramda';
/* Own */
import Table, { SelectFilter } from '../table';
import Loading from '../loading';
import AppContext from '../../contexts/appStore';
/* Static */
import styles from '../../styles/CardsList.module.css';
import B from '../../public/images/B.png';
import G from '../../public/images/G.png';
import R from '../../public/images/R.png';
import U from '../../public/images/U.png';
import W from '../../public/images/W.png';
import C from '../../public/images/C.png';

const IDENTITY_COLORS = { B: B, G: G, R: R, U: U, W: W, C: C };

type CommandersData = {
  identity: string;
  commander: string;
  appearances: number;
  wins: number;
  avgWinRate: number;
  avgDrawRate: number;
  bestStanding: number;
  worstStanding: number;
};

export default function CommandersTable({
  title,
  commanders,
  noCommanderPage,
}: {
  title?: string,
  commanders: CommandersData[],
  noCommanderPage?: boolean,
}) {
  const router = useRouter();
  const { toggleLoading } = useContext(AppContext);
  const [isLoaded, setLoaded] = useState(false);
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const [columns, setColumns] = useState([
    {
      title: 'Commander/s',
      field: 'commander',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      cellStyle: {
        minWidth: '10rem'
      },
    },
    {
      title: 'Identity',
      field: 'identity',
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
      render: function Identity(rowData: any) {
        const value = rowData.identity;
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
      // @ts-ignore
      filterComponent: ({ columnDef, onFilterChanged }) => (
        <SelectFilter columnDef={columnDef} onFilterChanged={onFilterChanged} />
      ),
    },
    {
      title: 'Appearances',
      field: 'appearances',
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
      title: 'Wins',
      field: 'wins',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Avg Winrate',
      field: 'avgWinRate',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      render: function PercentageOfUse(rowData: any) {
        const value = rowData.avgWinRate;
        return (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>);
      },
    },
    {
      title: 'Avg Drawrate',
      field: 'avgDrawRate',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
      render: function PercentageOfUse(rowData: any) {
        const value = rowData.avgDrawRate;
        return (<span>{Math.round((value + Number.EPSILON) * 10000) / 100}%</span>);
      },
    },
    {
      title: 'Best Standing',
      field: 'bestStanding',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
    {
      title: 'Worst Standing',
      field: 'worstStanding',
      type: 'numeric',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: false,
      searchable: false,
    },
  ]);

  useEffect(() => {
    if (isSmallScreen) {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (current.field !== 'commander' && current.field !== 'appearances') {
            return { ...current, hidden: true };
          }
          return current;
        });
      });
    } else {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (
            current.field === 'commander' ||
            current.field === 'appearances' ||
            current.field === 'identity' ||
            current.field === 'wins' ||
            current.field === 'avgWinRate' ||
            current.field === 'avgDrawRate' ||
            current.field === 'bestStanding' ||
            current.field === 'worstStanding'
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
      toggleLoading(true);
      router.push(`/metagame/${replace(/\//g, '%2F', rowData.commander)}`);
    }
  }, [isSmallScreen, isMediumScreen]);

  if (!isLoaded) return <Loading />;

  return (
    <span className={styles.cardsTable}>
      <Table
        key={renderKey}
        columns={columns}
        data={commanders}
        defaultNumberOfRows={(isLargeVerticalScreen || isSmallScreen) ? 10 : 5}
        isLoading={false}
        isDraggable={false}
        canExportAllData={true}
        canFilter={true}
        canSearch={true}
        withGrouping={false}
        rowHeight="5rem"
        title={title || 'Commanders'}
        onRowClick={(isSmallScreen || isMediumScreen) && !noCommanderPage ? handleClickRow : undefined}
        actions={(isSmallScreen || isMediumScreen) || noCommanderPage ? [] : [
          {
            icon: function ReadMore() { return <MaterialReadMoreIcon /> },
            tooltip: 'Go to Commander page',
            onClick: (_event, rowData: any = {}) => {
              toggleLoading(true);
              router.push(`/metagame/${replace(/\//g, '%2F', rowData.commander)}`);
            }
          }
        ]}
      />
    </span>
  )
};
