import React from 'react';
import { useSensorData } from '../context/SensorDataContext';

interface HealthMetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  status: 'normal' | 'low' | 'high';
  min: number;
  max: number;
  gradient: string;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  status,
  min,
  max,
  gradient
}) => {
  let statusColor = '';
  let statusText = '';

  switch (status) {
    case 'normal':
      statusColor = 'text-green-500';
      statusText = 'Normal';
      break;
    case 'low':
      statusColor = 'text-blue-500';
      statusText = 'Low';
      break;
    case 'high':
      statusColor = 'text-red-500';
      statusText = 'High';
      break;
  }

  // Calculate percentage for progress bar
  const percentage = Math.round(((value - min) / (max - min)) * 100);
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${gradient}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="rounded-full p-2 bg-white/30 backdrop-blur-sm">
            {icon}
          </div>
        </div>
        
        <div className="flex items-end mb-2">
          <span className="text-4xl font-bold text-gray-800">{value}</span>
          <span className="ml-1 text-gray-500 mb-1">{unit}</span>
        </div>
        
        <div className="mt-4">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                status === 'normal' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                status === 'low' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                'bg-gradient-to-r from-red-400 to-red-500'
              }`} 
              style={{ width: `${clampedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
        
        <p className={`mt-2 text-sm font-medium ${statusColor}`}>{statusText}</p>
      </div>
    </div>
  );
};

export default HealthMetricCard;