import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { validateExcelFile, parseExcelFile } from '../../utils/excelParser';
import { ExcelData, FileUploadProgress } from '../../types';

interface FileUploadZoneProps {
  onFileUpload: (data: ExcelData, file: File) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress>({
    progress: 0,
    status: 'idle',
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validation = validateExcelFile(file);
    if (!validation.isValid) {
      setUploadProgress({
        progress: 0,
        status: 'error',
        error: validation.error,
      });
      return;
    }

    try {
      setUploadProgress({ progress: 30, status: 'uploading' });
      
      // Simulate upload progress
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress({ progress: 60, status: 'processing' });
      
      const data = await parseExcelFile(file);
      setUploadProgress({ progress: 100, status: 'complete' });
      
      onFileUpload(data, file);
      
      // Reset after success
      setTimeout(() => {
        setUploadProgress({ progress: 0, status: 'idle' });
      }, 2000);
      
    } catch (error) {
      setUploadProgress({
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const getStatusColor = () => {
    switch (uploadProgress.status) {
      case 'error':
        return 'text-red-600';
      case 'complete':
        return 'text-green-600';
      case 'uploading':
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (uploadProgress.status) {
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (uploadProgress.status) {
      case 'uploading':
        return 'Uploading file...';
      case 'processing':
        return 'Processing Excel data...';
      case 'complete':
        return 'Upload successful!';
      case 'error':
        return uploadProgress.error || 'Upload failed';
      default:
        return 'Drop your Excel file here or click to browse';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : uploadProgress.status === 'error'
            ? 'border-red-300 bg-red-50'
            : uploadProgress.status === 'complete'
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${getStatusColor()}`}>
            {uploadProgress.status === 'idle' || uploadProgress.status === 'error' ? (
              getStatusIcon()
            ) : uploadProgress.status === 'complete' ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <FileSpreadsheet className="w-8 h-8" />
            )}
          </div>
          
          <div>
            <p className={`text-lg font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports .xlsx and .xls files up to 10MB
            </p>
          </div>
          
          {uploadProgress.status !== 'idle' && uploadProgress.status !== 'complete' && (
            <div className="w-full max-w-xs mx-auto">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress.progress}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;