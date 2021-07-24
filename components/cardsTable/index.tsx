import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import Table from '../table';
import { CardContext } from '../../contexts';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const CardsTable: React.FC = () => {
  const router = useRouter()
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleChangeCard } = useContext(CardContext);
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`)
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
      field: 'Occurrences',
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
        minWidth: '9rem'
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
        minWidth: '8rem'
      },
      render: (rowData: any, type: any) => {
        const value = type === 'row' ? rowData.colorIdentity : rowData;
        return type === 'row' ? <span>{value.split('').map((icon: string) => <Image src={`/images/${icon}.png`} alt={icon} width={18} height={18} />)}</span> : value;
      },
    },
    {
      title: 'Reserved List',
      field: 'reserved',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      hidden: false,
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
          if (current.field !== 'cardName' && current.field !== 'Occurrences') {
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
    const fetchCards = async () => {
      const rawResult = await fetch('/data/competitiveCards.json');
      const result = await rawResult.json();
      setCards(result.map((data: any) => {
        const newColorIdentity = data['colorIdentity'];
        return { ...data, colorIdentity: newColorIdentity === '' ? 'C' : newColorIdentity }
      }));
      setIsLoading(false);
    }

    fetchCards();
  }, [])

  useEffect(() => {
    setRenderKey(`render-${Math.random()}`);
  }, [isLargeVerticalScreen]);

  const handleClickRow = useCallback((_e, rowData = {}) => {
    if (isSmallScreen) {
      router.push(`/cards/${rowData['cardName']}`);
    } else {
      handleChangeCard(rowData['cardName']);
    }
  }, [isSmallScreen])

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
        withGrouping={false}
        rowHeight="5rem"
        title="cEDH Cards"
        onRowClick={handleClickRow}
      />
    </span>
  )
}

export default CardsTable;