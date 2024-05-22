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

import { CsvBuilder } from "filefy";

// TODO: type @columns and @data
export default function ExportCsv(columns: any[], data: any[] = [], filename = "data", delimiter = ",") {
  try {
    let finalData = data; // Grab first item for data array, make sure it is also an array.
    // If it is an object, 'flatten' it into an array of strings.

    if (data.length && !Array.isArray(data[0])) {
      if (typeof data[0] === "object") {
        // Turn data into an array of string arrays, without the `tableData` prop
        finalData = data.map(row => columns.map(col => col.exportTransformer ? col.exportTransformer(row) : row[col.field]));
      }
    }

    const builder = new CsvBuilder(filename + ".csv");
    builder.setDelimeter(delimiter).setColumns(columns.map(col => col.title)).addRows(Array.from(finalData)).exportFile();
  } catch (err) {
    console.error(`error in ExportCsv : ${err}`);
  }
};
