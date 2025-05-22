import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Heart, BarChart2, Settings, Activity, User, Menu, X } from 'lucide-react';
import { useSensorData } from '../context/SensorDataContext';
import StatusIndicator from './StatusIndicator';

const Layout = () => {
  const location = useLocation();
  const { currentData, isConnected } = useSensorData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-100 animate-pulse" />
            </div>
            <div className="font-semibold text-xl tracking-tight">HealthTrack Pro</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`flex items-center space-x-1 transition-colors hover:text-blue-200 ${isActive('/') ? 'text-blue-200' : 'text-white'}`}>
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/analytics" className={`flex items-center space-x-1 transition-colors hover:text-blue-200 ${isActive('/analytics') ? 'text-blue-200' : 'text-white'}`}>
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link to="/arduino-setup" className={`flex items-center space-x-1 transition-colors hover:text-blue-200 ${isActive('/arduino-setup') ? 'text-blue-200' : 'text-white'}`}>
              <Settings className="h-4 w-4" />
              <span>Arduino Setup</span>
            </Link>
            <Link to="/profile" className={`flex items-center space-x-1 transition-colors hover:text-blue-200 ${isActive('/profile') ? 'text-blue-200' : 'text-white'}`}>
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-blue-900/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/') ? 'bg-blue-800 text-white' : 'text-blue-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Activity className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/analytics" 
                className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/analytics') ? 'bg-blue-800 text-white' : 'text-blue-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart2 className="h-5 w-5" />
                <span>Analytics</span>
              </Link>
              <Link 
                to="/arduino-setup" 
                className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/arduino-setup') ? 'bg-blue-800 text-white' : 'text-blue-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Arduino Setup</span>
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/profile') ? 'bg-blue-800 text-white' : 'text-blue-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </div>
          </nav>
        )}

        {/* Status Bar */}
        {currentData && (
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white border-t border-blue-700">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span>{currentData.heartRate} BPM</span>
                  <StatusIndicator status={currentData.status.heartRate} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">◦</span>
                  <span>{currentData.temperature}°C</span>
                  <StatusIndicator status={currentData.status.temperature} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                <span className="text-blue-100">{isConnected ? 'Connected' : 'Simulated Data'}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-auto py-4">
        <div className="container mx-auto px-4 text-center text-blue-200 text-sm">
          <p>© 2025 HealthTrack Pro. All rights reserved.</p>
          <p className="mt-1">Real-time health monitoring for a better life.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;