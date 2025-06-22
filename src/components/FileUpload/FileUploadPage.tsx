import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadZone from './FileUploadZone';
import { ExcelData, UploadedFile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, TrendingUp, FileText, Users } from 'lucide-react';

const FileUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = (data: ExcelData, file: File) => {
    const uploadedFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      data,
      userId: user?.id || '',
    };

    // Store the file data temporarily (in a real app, this would go to a backend)
    localStorage.setItem('currentFile', JSON.stringify(uploadedFile));
    
    // Navigate to analytics page
    navigate('/analytics');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = [
    { name: 'Total Files', value: '9', icon: FileText, color: 'text-blue-600' },
    { name: 'Charts Created', value: '15', icon: BarChart3, color: 'text-purple-600' },
    { name: 'Data Points', value: '1k', icon: TrendingUp, color: 'text-emerald-600' },
    { name: 'Active Users', value: '1', icon: Users, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Excel Analytics Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your Excel files and transform them into beautiful, interactive charts and insights. 
            Get started by uploading your first spreadsheet.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Excel File</h2>
            <p className="text-gray-600">
              Drag and drop your Excel file or click to browse. We support both .xlsx and .xls formats.
            </p>
          </div>
          
          <FileUploadZone onFileUpload={handleFileUpload} />
        </div>

        {/* Recent Files */}
        {recentFiles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Files</h3>
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    View Analytics
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPage;