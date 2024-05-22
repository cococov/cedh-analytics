/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

"use client";

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
/* Vendor */
import { replace } from 'ramda';
import { Table } from '@/components/vendor/nextUi';
/* Own */
import AppContext from '@/contexts/appStore';

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
