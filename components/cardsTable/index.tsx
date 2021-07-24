import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router'
import Image from 'next/image';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import Table from '../table';
import { CardContext } from '../../contexts';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const CardsTable: React.FC = () => {
  const router = useRouter()
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleChangeCard } = useContext(CardContext);
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`)
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [columns] = useState([
    {
      title: 'Name',
      field: 'cardName',
      grouping: false,
      filtering: false,
      editable: 'never',
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
      searchable: false,
      defaultSort: 'desc',
    },
    {
      title: 'Type',
      field: 'typeLine',
      grouping: false,
      filtering: true,
      editable: 'never',
      searchable: false,
      lookup: {
        'Artifact': 'Artifact',
        'Land': 'Land',
        'Instant': 'Instant',
        'Sorcery': 'Sorcery',
        'Enchantment': 'Enchantment',
        'Creature': 'Creature',
        'Planeswalker': 'Planeswalker',
        'Sorcery // Land': 'Sorcery // Land',
        'Instant // Land': 'Instant // Land',
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
      searchable: false,
      lookup: {
        'C': 'C',
        'U': 'U',
        'B': 'B',
        'R': 'R',
        'G': 'G',
        'W': 'W',
        'BU': 'BU',
        'RU': 'RU',
        'BR': 'BR',
        'GU': 'GU',
        'BG': 'BG',
        'UW': 'UW',
        'GW': 'GW',
        'BW': 'BW',
        'GR': 'GR',
        'GUW': 'GUW',
        'RW': 'RW',
        'BGR': 'BGR',
        'BGRUW': 'BGRUW',
        'BRU': 'BRU',
        'BGU': 'BGU',
        'BGW': 'BGW',
        'BUW': 'BUW',
        'BRW': 'BRW',
        'RUW': 'RUW',
        'GRW': 'GRW',
        'GRUW': 'GRUW',
        'GRU': 'GRU',
        'BRUW': 'BRUW',
        'BGRU': 'BGRU',
      },
      cellStyle: {
        minWidth: '8rem'
      },
      render: (rowData: any, type: any) => {
        const value = type === 'row' ? rowData.colorIdentity : rowData;
        return type === 'row' ? <span>{value.split('').map((icon: string) => <Image src={`/${icon}.png`} alt={icon} width={18} height={18} />)}</span> : value;
      },
    },
    {
      title: 'Reserved List',
      field: 'reserved',
      align: 'center',
      grouping: false,
      filtering: true,
      editable: 'never',
      searchable: false,
      lookup: {
        'true': 'Yes',
        'false': 'No',
      },
    },
  ]);

  useEffect(() => {
    const fetchCards = async () => {
      const rawResult = await fetch('/competitiveCards.json');
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
    if(isSmallScreen){
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
        canExport={true}
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