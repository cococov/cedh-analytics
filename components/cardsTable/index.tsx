import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image';
import styles from '../../styles/CardsList.module.css';
import Table from '../table';
import { CardContext } from '../../contexts';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import B from '../../public/images/B.png';
import G from '../../public/images/G.png';
import R from '../../public/images/R.png';
import U from '../../public/images/U.png';
import W from '../../public/images/W.png';
import C from '../../public/images/C.png';

const IDENTITY_COLORS = {
  B: B,
  G: G,
  R: R,
  U: U,
  W: W,
  C: C
}

type CardsTableProps = {
  toggleLoading: (state: boolean) => void,
};

const CardsTable: React.FC<CardsTableProps> = ({ toggleLoading }) => {
  const [isLoaded, setLoaded] = useState(false);
  const router = useRouter()
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleChangeCard } = useContext(CardContext);
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const [columns, setColumns] = useState([
    {
      title: 'Name',
      field: 'cardName',
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
      },
      cellStyle: {
        minWidth: '8rem'
      },
    },
    {
      title: 'Identity',
      field: 'colorIdentity',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
      searchable: false,
      lookup: {
        'C': 'C',
        'B': 'B',
        'G': 'G',
        'R': 'R',
        'U': 'U',
        'W': 'W',
        'BG': 'BG',
        'BR': 'BR',
        'BU': 'BU',
        'BW': 'BW',
        'GR': 'GR',
        'GU': 'GU',
        'GW': 'GW',
        'RU': 'RU',
        'RW': 'RW',
        'UW': 'UW',
        'BGR': 'BGR',
        'BGU': 'BGU',
        'BGW': 'BGW',
        'BRU': 'BRU',
        'BRW': 'BRW',
        'BUW': 'BUW',
        'GRU': 'GRU',
        'GRW': 'GRW',
        'GUW': 'GUW',
        'RUW': 'RUW',
        'BGRU': 'BGRU',
        'BRUW': 'BRUW',
        'GRUW': 'GRUW',
        'BGRUW': 'BGRUW',
      },
      cellStyle: {
        minWidth: '5rem'
      },
      render: (rowData: any, type: any) => {
        const value = type === 'row' ? rowData.colorIdentity : rowData;
        return type === 'row' ? (
          <span>
            {
              value
                .split('')
                .map((icon: 'B' | 'G' | 'R' | 'U' | 'W' | 'C') => (<Image src={IDENTITY_COLORS[icon]} alt={icon} width={18} height={18} priority />))
            }
          </span>
        ) : value;
      },
    },
    {
      title: 'Print',
      field: 'uniquePrint',
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
    },
    {
      title: 'Multiple Printings',
      field: 'multiplePrintings',
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
  ]);

  useEffect(() => {
    if (isSmallScreen) {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (current.field !== 'cardName' && current.field !== 'occurrences') {
            return { ...current, hidden: true };
          }
          return current;
        });
      });
    } else {
      setColumns((previous: any) => {
        return previous.map((current: any) => {
          if (
            current.field === 'cardName' ||
            current.field === 'occurrences' ||
            current.field === 'type' ||
            current.field === 'colorIdentity' ||
            current.field === 'uniquePrint'
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
    const fetchCards = async () => {
      const rawResult = await fetch('/data/cards/competitiveCards.json');
      const result = await rawResult.json();
      setCards(result.map((data: any) => {
        const newColorIdentity = data['colorIdentity'];
        return { ...data, colorIdentity: newColorIdentity === '' ? 'C' : newColorIdentity }
      }));
      setIsLoading(false);
    }

    fetchCards();
  }, []);

  useEffect(() => {
    setRenderKey(`render-${Math.random()}`);
  }, [isLargeVerticalScreen]);

  useEffect(() => {
    if (!isLoaded) setLoaded(true);
  }, [isLoaded]);

  const handleClickRow = useCallback((_e, rowData = {}) => {
    if (isSmallScreen || isMediumScreen) {
      toggleLoading(true);
      router.push(`/cards/${rowData['cardName']}`);
    } else {
      handleChangeCard(rowData['cardName']);
    }
  }, [isSmallScreen, isMediumScreen]);

  if (!isLoaded) return null;

  return (
    <span className={styles['cards-table']}>
      <Table
        key={renderKey}
        columns={columns}
        data={cards}
        defaultNumberOfRows={(isLargeVerticalScreen || isSmallScreen) ? 10 : 5}
        isLoading={isLoading}
        isDraggable={false}
        canExportAllData={true}
        canFilter={true}
        canSearch={true}
        withGrouping={false}
        rowHeight="5rem"
        title="Cards Played"
        onRowClick={handleClickRow}
      />
    </span>
  )
}

export default CardsTable;