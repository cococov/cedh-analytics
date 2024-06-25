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

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function NextUITable({
  header,
  data,
  handleRowClick,
}: {
  header: string[],
  data: (string | number)[][]
  handleRowClick?: (row: (string | number)[]) => (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void,
}) {
  return (
    <Table isStriped aria-label="Table">
      <TableHeader className="bg-carrotPurple">
        {
          header.map((column, index) => (
            <TableColumn key={index} className="bg-carrotPurple text-carrotGray text-sm">{column}</TableColumn>
          ))
        }
      </TableHeader>
      <TableBody emptyContent={"No data to display."}>
        {
          data.map((row, index) => (
            <TableRow key={index} onClick={handleRowClick && handleRowClick(row)} style={handleRowClick && { cursor: 'pointer' }}>
              {
                row.map((cell, index) => (
                  <TableCell key={index}>{cell}</TableCell>
                ))
              }
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
