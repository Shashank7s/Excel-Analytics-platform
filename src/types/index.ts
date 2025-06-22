export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface ExcelData {
  headers: string[];
  rows: any[][];
  sheetName: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  data: ExcelData;
  userId: string;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  xAxis: string;
  yAxis: string;
  title: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface AnalyticsData {
  id: string;
  fileId: string;
  chartConfig: ChartConfig;
  createdAt: Date;
  chartData: any;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface FileUploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}