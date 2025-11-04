import React from 'react';
import { LogOut, Cube } from 'lucide-react';
import NavLink from './NavLink';
import { DashboardIcon, DailyLogIcon, EquipmentIcon, SafetyIcon, GeoMapIcon, TeamIcon } from './Icon';

const Navigation = ({ setPage, user, handleLogout, currentPage }) => (
  <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <DashboardIcon className="text-blue-600" size={28} />
        <span className="text-2xl font-extrabold text-gray-800">BQC-Nav</span>
      </div>
      <nav className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
        <NavLink icon={DashboardIcon} label="Dashboard" onClick={() => setPage('Dashboard')} active={currentPage === 'Dashboard'} />
        <NavLink icon={DailyLogIcon} label="Daily Log" onClick={() => setPage('DailyLog')} active={currentPage === 'DailyLog'} />
        <NavLink icon={EquipmentIcon} label="Equipment" onClick={() => setPage('Equipment')} active={currentPage === 'Equipment'} />
        <NavLink icon={SafetyIcon} label="Safety" onClick={() => setPage('Safety')} active={currentPage === 'Safety'} />
        <NavLink icon={SafetyIcon} label="LOTO" onClick={() => setPage('LOTO')} active={currentPage === 'LOTO'} />
        <NavLink icon={GeoMapIcon} label="Geo-Map" onClick={() => setPage('EquipmentMap')} active={currentPage === 'EquipmentMap'} />
        <NavLink icon={Cube} label="3D Scans" onClick={() => setPage('LidarUpload')} active={currentPage === 'LidarUpload'} />
        {(user?.role === 'MasterAdmin' || user?.role === 'Admin') && (
          <NavLink icon={TeamIcon} label="Team" onClick={() => setPage('UserManagement')} active={currentPage === 'UserManagement'} />
        )}
      </nav>
      <div className="flex items-.center space-x-4">
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

export default Navigation;
