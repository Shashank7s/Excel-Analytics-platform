import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User } from 'lucide-react';
import { UploadedFile, ChartConfig } from '../../types';
import ChartGenerator from './ChartGenerator';
import DataPreview from './DataPreview';
import { format } from 'date-fns';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);

  useEffect(() => {
    const fileData = localStorage.getItem('currentFile');
    if (fileData) {
      try {
        const file = JSON.parse(fileData);
        // Convert date strings back to Date objects
        file.uploadedAt = new Date(file.uploadedAt);
        setCurrentFile(file);
      } catch (error) {
        console.error('Error loading file data:', error);
        navigate('/upload');
      }
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  const handleConfigChange = (config: ChartConfig) => {
    setChartConfig(config);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!currentFile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Upload</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentFile.name}</h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Uploaded {format(currentFile.uploadedAt, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{formatFileSize(currentFile.size)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{currentFile.data.rows.length} rows</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600">Sheet Name</p>
                <p className="font-medium text-gray-900">{currentFile.data.sheetName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Chart Generator */}
          <ChartGenerator
            data={currentFile.data}
            onConfigChange={handleConfigChange}
          />
          
          {/* Data Preview */}
          <DataPreview data={currentFile.data} />
          
          {/* Chart Summary */}
          {chartConfig && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chart Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Chart Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{chartConfig.type}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">X-Axis</p>
                  <p className="text-lg font-semibold text-gray-900">{chartConfig.xAxis}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Y-Axis</p>
                  <p className="text-lg font-semibold text-gray-900">{chartConfig.yAxis}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Title</p>
                  <p className="text-lg font-semibold text-gray-900">{chartConfig.title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;