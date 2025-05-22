import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { useSensorData } from '../context/SensorDataContext';

interface ChartComponentProps {
  type: 'heartRate' | 'temperature' | 'combined';
  timeRange: '1m' | '5m' | '15m' | '1h' | '24h';
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type, timeRange }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { historicalData } = useSensorData();
  
  // Convert timeRange to milliseconds
  const getTimeRangeInMs = (): number => {
    switch (timeRange) {
      case '1m': return 60 * 1000;
      case '5m': return 5 * 60 * 1000;
      case '15m': return 15 * 60 * 1000;
      case '1h': return 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      default: return 5 * 60 * 1000;
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      // Filter data based on time range
      const timeRangeMs = getTimeRangeInMs();
      const currentTime = new Date().getTime();
      const filteredData = historicalData.filter(data => 
        (currentTime - data.timestamp.getTime()) <= timeRangeMs
      );

      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      // Format data based on chart type
      let datasets = [];
      
      if (type === 'heartRate' || type === 'combined') {
        datasets.push({
          label: 'Heart Rate (BPM)',
          data: filteredData.map(data => ({
            x: data.timestamp,
            y: data.heartRate
          })),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        });
      }
      
      if (type === 'temperature' || type === 'combined') {
        datasets.push({
          label: 'Temperature (°C)',
          data: filteredData.map(data => ({
            x: data.timestamp,
            y: data.temperature
          })),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: type === 'combined' ? 'y1' : 'y'
        });
      }

      // Configure chart scales
      const scales: any = {
        x: {
          type: 'time',
          time: {
            unit: timeRange === '24h' ? 'hour' : 'minute',
            displayFormats: {
              minute: 'HH:mm:ss',
              hour: 'HH:mm'
            }
          },
          title: {
            display: true,
            text: 'Time'
          },
          grid: {
            display: false
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: type === 'temperature' ? 'Temperature (°C)' : 'Heart Rate (BPM)'
          },
          suggestedMin: type === 'temperature' ? 15 : 40,
          suggestedMax: type === 'temperature' ? 40 : 120,
          grid: {
            color: 'rgba(200, 200, 200, 0.15)'
          }
        }
      };

      // Add second y-axis for combined chart
      if (type === 'combined') {
        scales.y1 = {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Temperature (°C)'
          },
          suggestedMin: 15,
          suggestedMax: 40,
          grid: {
            drawOnChartArea: false
          }
        };
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                titleColor: '#1e293b',
                bodyColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y.toFixed(context.dataset.label?.includes('Temperature') ? 1 : 0);
                    return `${label}: ${value}`;
                  }
                }
              },
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  boxWidth: 6,
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              }
            },
            scales,
            animations: {
              y: {
                easing: 'easeOutQuad',
                duration: 500
              }
            }
          }
        });
      }
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [historicalData, type, timeRange]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {type === 'heartRate' && 'Heart Rate Monitor'}
        {type === 'temperature' && 'Temperature Monitor'}
        {type === 'combined' && 'Health Metrics Dashboard'}
      </h3>
      <div className="h-[300px] md:h-[400px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;