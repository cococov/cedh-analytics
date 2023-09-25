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
      <TableHeader>
        {
          header.map((column, index) => (
            <TableColumn key={index}>{column}</TableColumn>
          ))
        }
      </TableHeader>
      <TableBody>
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
