import React, { useState, useEffect } from 'react';
import { liferayService } from '../services/liferayService';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    console.log('🔗 Testing Liferay connection...');
    try {
      const connected = await liferayService.testConnection();
      console.log('🔗 Connection result:', connected);
      setIsConnected(connected);
    } catch (error) {
      console.error('🔗 Connection error:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'text-gray-400';
    return isConnected ? 'text-green-500' : 'text-red-500';
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Checking...';
    return isConnected ? 'Connected to Liferay' : 'Disconnected';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {isChecking ? (
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
        ) : isConnected ? (
          <Wifi className={`w-4 h-4 ${getStatusColor()}`} />
        ) : (
          <WifiOff className={`w-4 h-4 ${getStatusColor()}`} />
        )}
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      <button
        onClick={checkConnection}
        disabled={isChecking}
        className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
      >
        Test
      </button>
    </div>
  );
};