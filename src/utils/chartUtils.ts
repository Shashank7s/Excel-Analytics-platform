import { ChartConfig, ExcelData } from '../types';

export const generateChartData = (data: ExcelData, config: ChartConfig) => {
  const { headers, rows } = data;
  const { xAxis, yAxis, type } = config;
  
  const xIndex = headers.indexOf(xAxis);
  const yIndex = headers.indexOf(yAxis);
  
  if (xIndex === -1 || yIndex === -1) {
    throw new Error('Selected columns not found in data');
  }
  
  const labels = rows.map(row => String(row[xIndex] || ''));
  const values = rows.map(row => {
    const value = row[yIndex];
    return typeof value === 'number' ? value : parseFloat(value) || 0;
  });
  
  const colors = generateColors(values.length);
  
  switch (type) {
    case 'bar':
      return {
        labels,
        datasets: [{
          label: yAxis,
          data: values,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
        }],
      };
      
    case 'line':
      return {
        labels,
        datasets: [{
          label: yAxis,
          data: values,
          fill: false,
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F6',
          tension: 0.1,
        }],
      };
      
    case 'pie':
      return {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 2,
        }],
      };
      
    case 'scatter':
      return {
        datasets: [{
          label: `${xAxis} vs ${yAxis}`,
          data: rows.map(row => ({
            x: typeof row[xIndex] === 'number' ? row[xIndex] : parseFloat(row[xIndex]) || 0,
            y: typeof row[yIndex] === 'number' ? row[yIndex] : parseFloat(row[yIndex]) || 0,
          })),
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8',
        }],
      };
      
    default:
      throw new Error('Unsupported chart type');
  }
};

const generateColors = (count: number) => {
  const baseColors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  ];
  
  const background = [];
  const border = [];
  
  for (let i = 0; i < count; i++) {
    const baseColor = baseColors[i % baseColors.length];
    background.push(baseColor + '80'); // 50% opacity
    border.push(baseColor);
  }
  
  return { background, border };
};

export const getChartOptions = (config: ChartConfig) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!config.title,
        text: config.title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };
  
  if (config.type === 'scatter') {
    return {
      ...baseOptions,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: config.xAxis,
          },
        },
        y: {
          title: {
            display: true,
            text: config.yAxis,
          },
        },
      },
    };
  }
  
  if (config.type === 'pie') {
    return {
      ...baseOptions,
      scales: undefined,
    };
  }
  
  return {
    ...baseOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: config.xAxis,
        },
      },
      y: {
        title: {
          display: true,
          text: config.yAxis,
        },
      },
    },
  };
};