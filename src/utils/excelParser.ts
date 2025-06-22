import * as XLSX from 'xlsx';
import { ExcelData } from '../types';

export const parseExcelFile = (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          throw new Error('Empty spreadsheet');
        }
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        // Filter out empty rows
        const filteredRows = rows.filter(row => 
          row.some(cell => cell !== null && cell !== undefined && cell !== '')
        );
        
        resolve({
          headers: headers.map(header => String(header || 'Column')),
          rows: filteredRows,
          sheetName,
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/x-excel',
    'application/x-msexcel',
  ];
  
  if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
    return {
      isValid: false,
      error: 'Please upload a valid Excel file (.xlsx or .xls)',
    };
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return {
      isValid: false,
      error: 'File size must be less than 10MB',
    };
  }
  
  return { isValid: true };
};