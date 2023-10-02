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
      <TableHeader style={{ backgroundColor: '#422273' }}>
        {
          header.map((column, index) => (
            <TableColumn key={index} style={{ backgroundColor: '#422273', color: '#ececec', fontSize: '0.9rem' }}>{column}</TableColumn>
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
