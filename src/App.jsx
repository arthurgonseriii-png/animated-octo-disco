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
import { APP_ID } from './constants';

const App = () => {
  const { isLoading, isAuthenticated, user, error, handleLogin, handleLogout, ...dataProps } = useAppLogic();
  const [page, setPage] = useState('Dashboard');

  const handleAnalysisComplete = async (analysisData) => {
    console.log("Saving analyzed photo data:", analysisData);
    if (dataProps.db && user) {
      try {
        const filesCollection = collection(dataProps.db, `artifacts/${APP_ID}/public/data/files`);
        await addDoc(filesCollection, {
          ...analysisData,
          createdByUid: user.uid,
          createdByName: user.name,
          created: serverTimestamp(),
        });
      } catch (e) {
        console.error("Error saving analyzed file to DB:", e);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-600">Connecting to BQC-Nav...</p>
      </div>
    );
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
  }[page] || Dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <Navigation setPage={setPage} user={user} handleLogout={handleLogout} currentPage={page} />
      <main className="max-w-screen-xl mx-auto py-8 sm:px-6 lg:px-8">
        <PageComponent
          user={user}
          {...dataProps}
          db={dataProps.db}
          setPage={setPage}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </main>
    </div>
  );
};

export default App;
