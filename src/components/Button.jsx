import React from 'react';

const Button = ({ children, onClick, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
    } ${className}`}
  >
    {children}
  </button>
);

export default Button;
