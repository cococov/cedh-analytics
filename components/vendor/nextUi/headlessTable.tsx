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

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

export default function HeadlessTable({
  data
}: {
  data: { [key: string]: string | number }
}) {
  return (
    <Table hideHeader isStriped aria-label="Headless Table">
      <TableHeader>
        <TableColumn>Key</TableColumn>
        <TableColumn>Value</TableColumn>
      </TableHeader>
      <TableBody>
        {
          Object.keys(data).map((key, index) => (
            <TableRow key={index}>
              <TableCell>{key}</TableCell>
              <TableCell>{data[key]}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
