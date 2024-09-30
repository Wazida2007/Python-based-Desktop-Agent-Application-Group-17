// src/EmployeeStatusBox.jsx
import React from 'react';

// Define the SVG icons
const ActiveIcon = () => (
  <svg
    className="w-6 h-6 text-green-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const InactiveIcon = () => (
  <svg
    className="w-6 h-6 text-red-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EmployeeStatusBox = ({ isActive }) => {
  return (
    <div
      className={`flex items-center p-4 border rounded-lg ${
        isActive ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
      }`}
    >
      {isActive ? <ActiveIcon /> : <InactiveIcon />}
      <span
        className={`ml-3 text-lg font-semibold ${
          isActive ? 'text-green-800' : 'text-red-800'
        }`}
      >
        {isActive ? 'Active' : 'Not Active'}
      </span>
    </div>
  );
};

export default EmployeeStatusBox;
