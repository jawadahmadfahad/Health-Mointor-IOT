import React, { useState } from 'react';
import { Heart, Thermometer } from 'lucide-react';
import { useSensorData } from '../context/SensorDataContext';
import HealthMetricCard from '../components/HealthMetricCard';
import ChartComponent from '../components/ChartComponent';
import SystemStatusCard from '../components/SystemStatusCard';

const Dashboard = () => {
  const { currentData, thresholds } = useSensorData();
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | '1h' | '24h'>('5m');

  // If no data is available yet
  if (!currentData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-pulse mb-4">
            <Heart className="h-12 w-12 text-blue-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Initializing Sensors</h2>
          <p className="text-gray-500">Waiting for sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Health Dashboard</h1>
        
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          {(['1m', '5m', '15m', '1h', '24h'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <HealthMetricCard
          title="Heart Rate"
          value={currentData.heartRate}
          unit="BPM"
          icon={<Heart className="h-5 w-5 text-red-500" />}
          status={currentData.status.heartRate}
          min={40}
          max={120}
          gradient="bg-gradient-to-br from-red-50 to-white"
        />
        
        <HealthMetricCard
          title="Temperature"
          value={currentData.temperature}
          unit="°C"
          icon={<Thermometer className="h-5 w-5 text-green-500" />}
          status={currentData.status.temperature}
          min={15}
          max={40}
          gradient="bg-gradient-to-br from-green-50 to-white"
        />
        
        <SystemStatusCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <ChartComponent type="combined" timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;