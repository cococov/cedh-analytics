"use client";

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
/* Vendor */
import { replace } from 'ramda';
import { Table } from '@components/vendor/nextUi';
/* Own */
import AppContext from '@contexts/appStore';

export default function LastSetTop10({
  last_set_top_10,
  urlBase,
  noLink,
}: {
  last_set_top_10: { occurrences: number, cardName: string }[],
  urlBase?: string,
  noLink?: boolean,
}) {
  const router = useRouter();
  const { toggleLoading } = useContext(AppContext);

  const handleClickTopRow = (link: string) => {
    toggleLoading(true);
    router.push(link);
  };

  return (
    <Table
      header={['Name', 'Occurrences']}
      data={last_set_top_10.map(e => Object.values(e).reverse())}
      handleRowClick={noLink ? undefined : (row) => (_e) => {
        handleClickTopRow(`${urlBase}/${replace(/\//g, '%2F', String(row[0]))}`);
      }}
    />
  );
};
