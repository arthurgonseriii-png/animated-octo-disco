import React from 'react';

const NavLink = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 transition-colors font-semibold text-sm px-4 py-2 rounded-full ${
      active ? 'text-white bg-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export default NavLink;
