import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

const NavLink = ({ icon: Icon, label, to }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-2 transition-colors font-semibold text-sm px-4 py-2 rounded-full ${
        isActive ? 'text-white bg-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </RouterNavLink>
);

export default NavLink;
