import React from 'react';
import { HardHat, Calendar, Wrench, ShieldCheck, Map, Users, LogOut, ClipboardList } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import NavLink from './NavLink';

const Navigation = ({ user, handleLogout }) => {
  const location = useLocation();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <HardHat className="text-blue-600" size={28} />
          <span className="text-2xl font-extrabold text-gray-800">BQC-Nav</span>
        </div>
        <nav className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
          <NavLink icon={HardHat} label="Dashboard" to="/dashboard" />
          <NavLink icon={Calendar} label="Daily Log" to="/daily-log" />
          <NavLink icon={Wrench} label="Equipment" to="/equipment" />
          <NavLink icon={ShieldCheck} label="Safety" to="/safety" />
          <NavLink icon={Map} label="Geo-Map" to="/geo-map" />
          <NavLink icon={ClipboardList} label="Tasks" to="/tasks" />
          {(user?.role === 'MasterAdmin' || user?.role === 'Admin') && (
            <NavLink icon={Users} label="Team" to="/team" />
          )}
        </nav>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-gray-800">{user?.name}</div>
            <div className="text-xs text-gray-500 font-medium">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
