import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import useAppLogic from './hooks/useAppLogic';
import Navigation from './components/Navigation';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import DailyLog from './components/DailyLog';
import Equipment from './components/Equipment';
import Safety from './components/Safety';
import EquipmentMap from './components/EquipmentMap';
import TaskManagement from './components/TaskManagement';
import UserManagement from './components/UserManagement';
import Profile from './components/Profile';
import ImageGenerator from './components/ImageGenerator';
import PhotoAnalyzer from './components/PhotoAnalyzer';
import LOTO from './components/LOTO';
import LidarUpload from './components/LidarUpload';
import Verification from './components/Verification';
import EquipmentDetail from './components/EquipmentDetail';
import Reports from './components/Reports';
import WorkPackageParser from './components/WorkPackageParser'; // Import the new component
import { APP_ID } from './constants';

const App = () => {
  const { isLoading, isAuthenticated, user, error, handleLogin, handleLogout, ...dataProps } = useAppLogic();
  const [page, setPage] = useState('Dashboard');
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const handleAnalysisComplete = async (analysisData) => {
    // ... (existing code)
  };

  const viewEquipmentDetail = (equipment) => {
    setSelectedEquipment(equipment);
    setPage('EquipmentDetail');
  };

  const handleTasksGenerated = (tasks) => {
    // This is where you would typically save the new tasks to Firestore.
    // For now, we'll just navigate to the Task Management page to see them.
    console.log("Generated tasks:", tasks);
    // You would add logic here to merge these tasks into your main task state
    setPage('TaskManagement');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>;
  }

  if (!isAuthenticated || !user) {
    return <AuthPage handleLogin={handleLogin} error={error} />;
  }

  const PageComponent = {
    Dashboard,
    DailyLog,
    Equipment,
    Safety,
    EquipmentMap,
    TaskManagement,
    UserManagement,
    Profile,
    ImageGenerator,
    PhotoAnalyzer,
    LOTO,
    LidarUpload,
    Verification,
    EquipmentDetail,
    Reports,
    WorkPackageParser,
  }[page] || Dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <Navigation setPage={setPage} user={user} handleLogout={handleLogout} currentPage={page} />
      <main className="max-w-screen-xl mx-auto py-8 sm:px-6 lg:px-8">
        {page === 'EquipmentDetail' ? (
          <EquipmentDetail
            equipment={selectedEquipment}
            lotoPermits={dataProps.lotoPermits}
            safetyChecklists={dataProps.safetyChecklists}
            onBack={() => setPage('Equipment')}
          />
        ) : (
          <PageComponent
            user={user}
            {...dataProps}
            db={dataProps.db}
            setPage={setPage}
            onAnalysisComplete={handleAnalysisComplete}
            onViewEquipment={viewEquipmentDetail}
            onTasksGenerated={handleTasksGenerated}
          />
        )}
      </main>
    </div>
  );
};

export default App;
