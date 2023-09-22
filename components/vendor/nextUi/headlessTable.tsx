"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default async function HeadlessTable({
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
