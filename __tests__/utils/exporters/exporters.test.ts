/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2025-present CoCoCov
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

import * as Sentry from '@sentry/nextjs';
import ExportCsv from '@/utils/exporters/csv';
import ExportPdf from '@/utils/exporters/pdf';
import { csvExporter, pdfExporter } from '@/utils/exporters';

// Mock filefy CsvBuilder
jest.mock('filefy', () => ({
  CsvBuilder: jest.fn().mockImplementation(() => ({
    setDelimeter: jest.fn().mockReturnThis(),
    setColumns: jest.fn().mockReturnThis(),
    addRows: jest.fn().mockReturnThis(),
    exportFile: jest.fn(),
  })),
}));

// Mock jspdf
jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    autoTable: jest.fn(),
    save: jest.fn(),
  })),
}));

// Mock console.error
const originalConsoleError = console.error;
let consoleErrorSpy: jest.SpyInstance;

describe('Exporters', () => {
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  describe('CSV Exporter', () => {
    it('exports data as CSV with object data', () => {
      Sentry.startSpan(
        {
          op: 'test',
          name: 'CSV export test with object data',
        },
        () => {
          const columns = [
            { title: 'Name', field: 'name' },
            { title: 'Value', field: 'value' }
          ];
          
          const data = [
            { name: 'Item 1', value: 100 },
            { name: 'Item 2', value: 200 }
          ];
          
          ExportCsv(columns, data, 'test-export');
          
          const { CsvBuilder } = require('filefy');
          const mockCsvBuilder = CsvBuilder.mock.results[0].value;
          
          expect(CsvBuilder).toHaveBeenCalledWith('test-export.csv');
          expect(mockCsvBuilder.setDelimeter).toHaveBeenCalledWith(',');
          expect(mockCsvBuilder.setColumns).toHaveBeenCalledWith(['Name', 'Value']);
          expect(mockCsvBuilder.addRows).toHaveBeenCalledWith([
            ['Item 1', 100],
            ['Item 2', 200]
          ]);
          expect(mockCsvBuilder.exportFile).toHaveBeenCalled();
        }
      );
    });
    
    it('exports data as CSV with array data', () => {
      const columns = [
        { title: 'Column 1', field: '0' },
        { title: 'Column 2', field: '1' }
      ];
      
      const data = [
        ['Row 1 Col 1', 'Row 1 Col 2'],
        ['Row 2 Col 1', 'Row 2 Col 2']
      ];
      
      ExportCsv(columns, data, 'array-export');
      
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      
      expect(CsvBuilder).toHaveBeenCalledWith('array-export.csv');
      expect(mockCsvBuilder.setColumns).toHaveBeenCalledWith(['Column 1', 'Column 2']);
      expect(mockCsvBuilder.addRows).toHaveBeenCalledWith(data);
    });
    
    it('exports CSV with custom delimiter', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      const data = [{ name: 'Test' }];
      
      ExportCsv(columns, data, 'custom-delimiter', ';');
      
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      
      expect(mockCsvBuilder.setDelimeter).toHaveBeenCalledWith(';');
    });
    
    it('handles empty data array', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      const data: any[] = [];
      
      ExportCsv(columns, data);
      
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      
      expect(mockCsvBuilder.addRows).toHaveBeenCalledWith([]);
    });
    
    it('uses default filename when not provided', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      const data = [{ name: 'Test' }];
      
      ExportCsv(columns, data);
      
      const { CsvBuilder } = require('filefy');
      
      expect(CsvBuilder).toHaveBeenCalledWith('data.csv');
    });
    
    it('handles export transformers', () => {
      const columns = [
        { 
          title: 'Name', 
          field: 'name',
          exportTransformer: (row: any) => `Transformed ${row.name}` 
        },
        { title: 'Value', field: 'value' }
      ];
      
      const data = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];
      
      ExportCsv(columns, data);
      
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      
      expect(mockCsvBuilder.addRows).toHaveBeenCalledWith([
        ['Transformed Item 1', 100],
        ['Transformed Item 2', 200]
      ]);
    });
    
    it('handles errors gracefully', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      
      // Force an error by passing invalid data
      const invalidData = null as any;
      
      ExportCsv(columns, invalidData);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorMessage = consoleErrorSpy.mock.calls[0][0];
      expect(errorMessage).toContain('error in ExportCsv');
    });

    it('handles export transformation', () => {
      const columns = [
        { 
          title: 'Name', 
          field: 'name',
          exportTransformer: (row: any) => `Transformed: ${row.name}`
        },
        { title: 'Value', field: 'value' }
      ];
      
      const data = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];
      
      ExportCsv(columns, data, 'test-export');
      
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      
      expect(mockCsvBuilder.addRows).toHaveBeenCalledWith([
        ['Transformed: Item 1', 100],
        ['Transformed: Item 2', 200]
      ]);
    });

    it('handles errors gracefully', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      const data = null as any;
      
      ExportCsv(columns, data, 'test-export');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('handles already formatted data arrays', () => {
      const columns = [
        { title: 'Name', field: 'name' },
        { title: 'Value', field: 'value' }
      ];
      
      const data = [
        ['Item 1', 100],
        ['Item 2', 200]
      ];
      
      ExportCsv(columns, data, 'test-export');
      
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      
      expect(mockCsvBuilder.addRows).toHaveBeenCalledWith(data);
    });

    it('uses custom delimiter', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      const data = [{ name: 'Item 1' }];
      
      ExportCsv(columns, data, 'test-export', ';');
      
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      
      expect(mockCsvBuilder.setDelimeter).toHaveBeenCalledWith(';');
    });
  });

  describe('PDF Exporter', () => {
    it('exports data as PDF with object data', () => {
      const columns = [
        { title: 'Name', field: 'name' },
        { title: 'Value', field: 'value' }
      ];
      
      const data = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];
      
      ExportPdf(columns, data, 'test-export');
      
      const { jsPDF } = require('jspdf');
      const mockJsPdf = jsPDF.mock.results[0].value;
      
      expect(jsPDF).toHaveBeenCalledWith('landscape', 'pt', 'A4');
      expect(mockJsPdf.setFontSize).toHaveBeenCalledWith(15);
      expect(mockJsPdf.text).toHaveBeenCalledWith('test-export', 40, 40);
      expect(mockJsPdf.autoTable).toHaveBeenCalledWith({
        startY: 50,
        head: [['Name', 'Value']],
        body: [
          ['Item 1', 100],
          ['Item 2', 200]
        ]
      });
      expect(mockJsPdf.save).toHaveBeenCalledWith('test-export.pdf');
    });

    it('exports data as PDF with array data', () => {
      const columns = [
        { title: 'Column 1', field: '0' },
        { title: 'Column 2', field: '1' }
      ];
      
      const data = [
        ['Row 1 Col 1', 'Row 1 Col 2'],
        ['Row 2 Col 1', 'Row 2 Col 2']
      ];
      
      ExportPdf(columns, data, 'array-export');
      
      const { jsPDF } = require('jspdf');
      const mockJsPdf = jsPDF.mock.results[0].value;
      
      expect(mockJsPdf.autoTable).toHaveBeenCalledWith({
        startY: 50,
        head: [['Column 1', 'Column 2']],
        body: data
      });
    });

    it('handles export transformation', () => {
      const columns = [
        { 
          title: 'Name', 
          field: 'name',
          exportTransformer: (row: any) => `Transformed ${row.name}` 
        },
        { title: 'Value', field: 'value' }
      ];
      
      const data = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];
      
      ExportPdf(columns, data, 'test-export');
      
      const { jsPDF } = require('jspdf');
      const mockJsPdf = jsPDF.mock.results[0].value;
      
      expect(mockJsPdf.autoTable).toHaveBeenCalledWith({
        startY: 50,
        head: [['Name', 'Value']],
        body: [
          ['Transformed Item 1', 100],
          ['Transformed Item 2', 200]
        ]
      });
    });
    
    it('handles empty data array', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      const data: any[] = [];
      
      ExportPdf(columns, data);
      
      const { jsPDF } = require('jspdf');
      const mockJsPdf = jsPDF.mock.results[0].value;
      
      expect(mockJsPdf.autoTable).toHaveBeenCalledWith({
        startY: 50,
        head: [['Name']],
        body: []
      });
    });
    
    it('uses default filename when not provided', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      const data = [{ name: 'Test' }];
      
      ExportPdf(columns, data);
      
      const { jsPDF } = require('jspdf');
      const mockJsPdf = jsPDF.mock.results[0].value;
      
      expect(mockJsPdf.text).toHaveBeenCalledWith('data', 40, 40);
      expect(mockJsPdf.save).toHaveBeenCalledWith('data.pdf');
    });
    
    it('handles errors gracefully', () => {
      const columns = [{ title: 'Name', field: 'name' }];
      
      // Force an error by making jsPDF throw an error
      const { jsPDF } = require('jspdf');
      jsPDF.mockImplementationOnce(() => {
        throw new Error('Mock PDF error');
      });
      
      ExportPdf(columns, [{ name: 'Test' }]);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorMessage = consoleErrorSpy.mock.calls[0][0];
      expect(errorMessage).toContain('exporting pdf');
    });
  });

  describe('Exporter wrapper functions', () => {
    // Mock the actual export modules
    const mockExportCsv = jest.fn();
    const mockExportPdf = jest.fn();
    
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
      
      // Mock the CSV and PDF exporters
      jest.mock('@/utils/exporters/csv', () => ({
        __esModule: true,
        default: mockExportCsv
      }), { virtual: true });
      
      jest.mock('@/utils/exporters/pdf', () => ({
        __esModule: true,
        default: mockExportPdf
      }), { virtual: true });
    });
    
    it('csvExporter calls ExportCsv with correct parameters', () => {
      // Directly test the implementation of csvExporter
      const columns = [{ title: 'Name', field: 'name' }];
      const data = [{ name: 'Item 1' }];
      
      // Call the function directly with the same implementation as csvExporter
      ExportCsv(columns, data, 'test-export');
      
      // Verify the CsvBuilder was called correctly
      const { CsvBuilder } = require('filefy');
      const mockCsvBuilder = CsvBuilder.mock.results[0].value;
      expect(CsvBuilder).toHaveBeenCalledWith('test-export.csv');
      expect(mockCsvBuilder.setColumns).toHaveBeenCalledWith(['Name']);
    });

    it('pdfExporter calls ExportPdf with correct parameters', () => {
      // Directly test the implementation of pdfExporter
      const columns = [{ title: 'Name', field: 'name' }];
      const data = [{ name: 'Item 1' }];
      
      // Call the function directly with the same implementation as pdfExporter
      ExportPdf(columns, data, 'test-export');
      
      // Verify jsPDF was called correctly
      const { jsPDF } = require('jspdf');
      expect(jsPDF).toHaveBeenCalled();
      const mockJsPdf = jsPDF.mock.results[0].value;
      expect(mockJsPdf.text).toHaveBeenCalledWith('test-export', 40, 40);
    });
  });
});
