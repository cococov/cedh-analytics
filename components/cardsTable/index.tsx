import styles from '../../styles/Home.module.css';
import React, { useState, useEffect, useContext } from 'react';
import Table from '../table';
import { CardContext } from '../../contexts';

const CardsTable: React.FC = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleChangeCard } = useContext(CardContext);
  const columns = [
    {
      title: 'Name',
      field: 'Card Name',
      grouping: false,
      filtering: true,
      editable: 'never',
    },
    {
      title: 'Occurrences',
      field: 'Occurrences',
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
        onRowClick={(_e, rowData = {}) => handleChangeCard(rowData['Card Name'])}
      />
    </span>
  )
}

export default CardsTable;