"use client";

import { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
/* Vendor */
import { replace, isNil } from 'ramda';
import { MaterialReadMoreIcon } from '../vendor/materialIcon';
import { MaterialChip } from '../vendor/materialUi';
import { useMediaQuery } from '../../hooks/useMediaQuery';
/* Own */
import Table from '../table';
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

type CardProps = any; // TODO: define type

export default function CardsTable({
  title,
  cards,
  tagsByCard,
  handleChangeCard,
  tournamentId,
}: {
  title?: string,
  cards: CardProps[],
  tagsByCard: { [key: string]: string[] },
  handleChangeCard: (cardName: string | undefined) => void,
  tournamentId?: string,
}) {
  const router = useRouter();
  const { toggleLoading } = useContext(AppContext);
  const [isLoaded, setLoaded] = useState(false);
  const isLargeVerticalScreen = useMediaQuery('(min-height: 1300px)');
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [renderKey, setRenderKey] = useState(`render-${Math.random()}`);
  const [cardsWithTags, setCardsWithTags] = useState<CardProps[]>([]);
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
        'Battle': 'Battle',
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
      render: function Identity(rowData: any, type: any) {
        const value = type === 'row' ? rowData.colorIdentity : rowData;
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
      field: 'lastPrint',
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
    {
      title: 'in 99',
      field: 'isIn99',
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
      field: 'isCommander',
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
      field: 'percentageOfUse',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
      render: function PercentageOfUse(rowData: any, type: any) {
        const value = type === 'row' ? rowData.percentageOfUse : rowData;
        return type === 'row' ? (<span>{value}%</span>) : value;
      },
    },
    {
      title: '% of Use in identity',
      field: 'percentageOfUseByIdentity',
      align: 'center',
      grouping: false,
      filtering: false,
      editable: 'never',
      hidden: true,
      searchable: false,
      render: function PercentageOfUseByIdentity(rowData: any, type: any) {
        const value = type === 'row' ? rowData.percentageOfUseByIdentity : rowData;
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
        const value = type === 'row' ? rowData.tags : rowData;
        return type === 'row' ? (
          <span className={styles.cardTagsWrapper}>
            {
              value.map((tag: string, _index: number) => (<MaterialChip key={tag} label={tag} size="small" className={styles.cardTag} />))
            }
          </span>
        ) : value;
      },
    },
  ]);

  useEffect(() => {
    setCardsWithTags(cards.map((card: any) => {
      return { ...card, tags: tagsByCard[card.cardName] || [] };
    }));
  }, []);

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
            current.field === 'lastPrint'
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
      router.push(
        isNil(tournamentId)
          ? `/cards/${replace(/\//g, '%2F', rowData['cardName'])}`
          : `/tournaments/${tournamentId}/${replace(/\//g, '%2F', rowData['cardName'])}`
      );
    } else {
      handleChangeCard(rowData['cardName']);
    }
  }, [isSmallScreen, isMediumScreen]);

  if (!isLoaded) return <Loading />;

  return (
    <span className={styles.cardsTable}>
      <Table
        key={renderKey}
        columns={columns}
        data={cardsWithTags}
        defaultNumberOfRows={(isLargeVerticalScreen || isSmallScreen) ? 10 : 5}
        isLoading={false}
        isDraggable={false}
        canExportAllData={true}
        canFilter={true}
        canSearch={true}
        withGrouping={false}
        rowHeight="5rem"
        title={title || 'Cards Played'}
        onRowClick={handleClickRow}
        actions={(isSmallScreen || isMediumScreen) ? [] : [
          {
            icon: function ReadMore() { return <MaterialReadMoreIcon /> },
            tooltip: 'Go to Card Page',
            onClick: (_event, rowData: any = {}) => {
              toggleLoading(true);
              router.push(
                isNil(tournamentId)
                  ? `/cards/${replace(/\//g, '%2F', rowData['cardName'])}`
                  : `/tournaments/${tournamentId}/${replace(/\//g, '%2F', rowData['cardName'])}`
              );
            }
          }
        ]}
      />
    </span>
  )
};
