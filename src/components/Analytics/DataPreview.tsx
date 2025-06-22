import React, { useState } from 'react';
import { ExcelData } from '../../types';
import { Table, Eye, EyeOff, FileText } from 'lucide-react';

interface DataPreviewProps {
  data: ExcelData;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const totalRows = data.rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const currentRows = data.rows.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Table className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Data Preview</h3>
            <p className="text-sm text-gray-600">
              {data.sheetName} • {totalRows} rows • {data.headers.length} columns
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
        </button>
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Total Rows</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalRows.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Columns</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.headers.length}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Showing</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {startIndex + 1}-{endIndex}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-96'}`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {data.headers.map((header, index) => (
                  <th
                    key={index}
                    className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="p-4 text-gray-700 border-b border-gray-100"
                    >
                      {cell !== null && cell !== undefined ? String(cell) : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {totalRows} rows
          </p>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreview;