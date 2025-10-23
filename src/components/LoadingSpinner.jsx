import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-lg text-gray-600">{text}</p>
  </div>
);

export default LoadingSpinner;
