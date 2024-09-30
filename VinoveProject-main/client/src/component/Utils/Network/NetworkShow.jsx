import React, { useState, useEffect } from 'react';
import NetworkConnectionBox from '../Network/NetworkConnectionBox';
import './App.css';

const NetworkShow = () => {
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    
    <div className="flex items-center justify-center  p-4">
      <div className="  justify-between w-full max-w-md p-4 rounded-xl bg-purple-950 text-white shadow-lg">
        <div className="text-lg font-semibold mr-4">
          Internet Connection
        </div>
        <NetworkConnectionBox isConnected={isConnected} />
      </div>
    </div>
  );
};

export default NetworkShow;
