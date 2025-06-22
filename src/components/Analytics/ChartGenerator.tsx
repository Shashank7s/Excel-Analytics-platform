import React, { useState, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { Download, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { ExcelData, ChartConfig } from '../../types';
import { generateChartData, getChartOptions } from '../../utils/chartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartGeneratorProps {
  data: ExcelData;
  onConfigChange: (config: ChartConfig) => void;
}

const ChartGenerator: React.FC<ChartGeneratorProps> = ({ data, onConfigChange }) => {
  const chartRef = useRef<any>(null);
  
  // Initialize config with safe defaults based on available headers
  const [config, setConfig] = useState<ChartConfig>(() => {
    const hasHeaders = data.headers && data.headers.length > 0;
    return {
      type: 'bar',
      xAxis: hasHeaders ? data.headers[0] : '',
      yAxis: hasHeaders && data.headers.length > 1 ? data.headers[1] : (hasHeaders ? data.headers[0] : ''),
      title: 'Data Visualization',
    };
  });

  const handleConfigChange = (newConfig: Partial<ChartConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${config.title.replace(/\s+/g, '_')}_chart.png`;
      link.href = url;
      link.click();
    }
  };

  // Validate data and generate chart data with error handling
  const { chartData, chartOptions, error } = useMemo(() => {
    try {
      // Check if data has headers and rows
      if (!data.headers || data.headers.length === 0) {
        return {
          chartData: null,
          chartOptions: null,
          error: 'No data headers found. Please upload a valid Excel file with column headers.'
        };
      }

      if (!data.rows || data.rows.length === 0) {
        return {
          chartData: null,
          chartOptions: null,
          error: 'No data rows found. Please upload a file with data.'
        };
      }

      // Check if selected axes exist in headers
      if (!data.headers.includes(config.xAxis)) {
        return {
          chartData: null,
          chartOptions: null,
          error: `Selected X-axis column "${config.xAxis}" not found in data. Available columns: ${data.headers.join(', ')}`
        };
      }

      if (!data.headers.includes(config.yAxis)) {
        return {
          chartData: null,
          chartOptions: null,
          error: `Selected Y-axis column "${config.yAxis}" not found in data. Available columns: ${data.headers.join(', ')}`
        };
      }

      // Generate chart data and options
      const chartData = generateChartData(data, config);
      const chartOptions = getChartOptions(config);

      return {
        chartData,
        chartOptions,
        error: null
      };
    } catch (err) {
      return {
        chartData: null,
        chartOptions: null,
        error: err instanceof Error ? err.message : 'An error occurred while generating the chart'
      };
    }
  }, [data, config]);

  const renderChart = () => {
    if (error || !chartData || !chartOptions) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">Unable to generate chart</p>
            <p className="text-gray-600 text-sm max-w-md">{error}</p>
          </div>
        </div>
      );
    }

    const props = {
      ref: chartRef,
      data: chartData,
      options: chartOptions,
    };

    switch (config.type) {
      case 'bar':
        return <Bar {...props} />;
      case 'line':
        return <Line {...props} />;
      case 'pie':
        return <Pie {...props} />;
      case 'scatter':
        return <Scatter {...props} />;
      default:
        return <Bar {...props} />;
    }
  };

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', description: 'Compare categories' },
    { value: 'line', label: 'Line Chart', description: 'Show trends over time' },
    { value: 'pie', label: 'Pie Chart', description: 'Show proportions' },
    { value: 'scatter', label: 'Scatter Plot', description: 'Show relationships' },
  ];

  // Check if we have valid data to show controls
  const hasValidData = data.headers && data.headers.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* Controls */}
      <div className="mb-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Chart Configuration
          </h3>
          <button
            onClick={downloadChart}
            disabled={!!error || !chartData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>

        {hasValidData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Type
                </label>
                <select
                  value={config.type}
                  onChange={(e) => handleConfigChange({ type: e.target.value as ChartConfig['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {chartTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* X Axis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X Axis
                </label>
                <select
                  value={config.xAxis}
                  onChange={(e) => handleConfigChange({ xAxis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {data.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              {/* Y Axis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y Axis
                </label>
                <select
                  value={config.yAxis}
                  onChange={(e) => handleConfigChange({ yAxis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {data.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => handleConfigChange({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter chart title"
                />
              </div>
            </div>

            {/* Chart Type Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {chartTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    config.type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleConfigChange({ type: type.value as ChartConfig['type'] })}
                >
                  <p className="font-medium text-gray-900">{type.label}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Please upload a valid Excel file to configure charts</p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="h-96">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartGenerator;