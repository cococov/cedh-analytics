import styles from '../../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import Table from '../table';

const CardsTable: React.FC = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const columns = [
    {
      title: 'Name',
      field: 'Card Name',
      grouping: false,
      filtering: true,
      editable: 'never',
    },
    {
      title: 'Occurences',
      field: 'Occurences',
      grouping: false,
      filtering: false,
      editable: 'never',
    },
  ];

  useEffect(() => {
    const fetchCards = async () => {
      const result = await fetch('/competitiveCards.json');
      setCards(await result.json());
      setIsLoading(false);
    }

    fetchCards();
  }, [])

  return (
    <span className={styles['cards-table']}>
      <Table
        columns={columns}
        data={cards}
        defaultNumberOfRows={5}
        isLoading={isLoading}
        canExport={true}
        canExportAllData={true}
        canFilter={false}
        rowHeight="5rem"
        title="cEDH Cards"
      />
    </span>
  )
}

export default CardsTable;