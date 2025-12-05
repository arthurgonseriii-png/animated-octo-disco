import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

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
import ItemDetailView from './components/ItemDetailView';
import { APP_ID } from './constants';

const App = () => {
  const { isLoading, isAuthenticated, user, error, handleLogin, handleLogout, ...dataProps } = useAppLogic();
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleAnalysisComplete = async (analysisData) => {
    // ... (omitted for brevity)
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    navigate(`/item/${item.id}`);
  };

  const handleBack = () => {
    setSelectedItem(null);
    navigate(-1);
  };

  const handleSaveItem = async (updatedItem) => {
    if (!dataProps.db || !updatedItem?.id) return;

    // Determine the collection dynamically. Default to 'tasks'.
    const getCollectionName = (item) => {
      if (item.taskName) return 'assignments';
      if (item.type?.includes('image') || item.type?.includes('pdf')) return 'files';
      if (item.serialNumber) return 'equipment';
      return 'tasks'; // Fallback
    };

    const collectionName = getCollectionName(updatedItem);
    const itemRef = doc(dataProps.db, `artifacts/${APP_ID}/public/data/${collectionName}`, updatedItem.id);

    try {
      await updateDoc(itemRef, updatedItem);
      setSelectedItem(updatedItem);
      console.log(`Item in collection '${collectionName}' updated successfully!`);
    } catch (e) {
      console.error("Error updating item:", e);
    }
  };

  if (isLoading) {
    // ... (omitted for brevity)
  }

  if (!isAuthenticated || !user) {
    return <AuthPage handleLogin={handleLogin} error={error} />;
  }

  const commonProps = {
    user,
    ...dataProps,
    db: dataProps.db,
    onAnalysisComplete: handleAnalysisComplete,
    onSelectItem: handleSelectItem,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <Navigation user={user} handleLogout={handleLogout} />
      <main className="max-w-screen-xl mx-auto py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard {...commonProps} />} />
          <Route path="/daily-log" element={<DailyLog {...commonProps} />} />
          <Route path="/equipment" element={<Equipment {...commonProps} />} />
          <Route path="/safety" element={<Safety {...commonProps} />} />
          <Route path="/geo-map" element={<EquipmentMap {...commonProps} />} />
          <Route path="/tasks" element={<TaskManagement {...commonProps} />} />
          <Route path="/team" element={<UserManagement {...commonProps} />} />
          <Route path="/profile" element={<Profile {...commonProps} />} />
          <Route path="/image-generator" element={<ImageGenerator {...commonProps} />} />
          <Route path="/photo-analyzer" element={<PhotoAnalyzer {...commonProps} />} />
          <Route
            path="/item/:id"
            element={<ItemDetailView
                        item={selectedItem}
                        onBack={handleBack}
                        onSave={handleSaveItem}
                        user={user}
                      />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
