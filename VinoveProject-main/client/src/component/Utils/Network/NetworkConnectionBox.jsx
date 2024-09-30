import React from 'react';

// NetworkConnectionBox component
const NetworkConnectionBox = ({ isConnected }) => {
  return (
    <div
      className={`flex items-center justify-center p-4 rounded-lg shadow-lg text-white ${
        isConnected ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className="flex items-center">
        <div className="mr-3">
          <svg
            className={`w-8 h-8 ${
              isConnected ? 'text-green-300' : 'text-red-300'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isConnected ? 'M5 13l4 4L19 7' : 'M19 13l-4-4-4 4'}
            />
          </svg>
        </div>
        <p className="text-xl font-bold">
          {isConnected ? 'Connected' : 'Connection Failed'}
        </p>
      </div>
    </div>
  );
};

export default NetworkConnectionBox;
