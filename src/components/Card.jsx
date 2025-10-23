import React from 'react';

const Card = ({ title, children, className = '', titleIcon: TitleIcon }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 ${className}`}>
    {title && (
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3 flex items-center">
        {TitleIcon && <TitleIcon className="mr-3 text-blue-600" size={24} />}
        {title}
      </h2>
    )}
    {children}
  </div>
);

export default Card;
