import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import JSAForm from './JSAForm';
import { ShieldCheck, Plus } from 'lucide-react';
import { APP_ID } from '../constants';

const Safety = ({ user, safetyChecklists = [], db }) => {
  const [isJsaFormOpen, setIsJsaFormOpen] = useState(false);

  const handleSaveJSA = async (jsaData) => {
    if (!db || !user) {
      console.error("Database connection or user not found.");
      return;
    }
    try {
      const jsaCollection = collection(db, `artifacts/${APP_ID}/jsas`);
      await addDoc(jsaCollection, {
        ...jsaData,
        status: 'Active',
        createdByUid: user.uid,
        createdByName: user.name,
        created: serverTimestamp(),
      });
      console.log("JSA saved successfully!");
      setIsJsaFormOpen(false);
    } catch (e) {
      console.error("Error saving JSA to DB:", e);
    }
  };

  return (
    <div>
      <Card title="Safety Hub" titleIcon={ShieldCheck}>
        <div className="flex justify-between items-center mb-4">
          <p>Create, manage, and review safety documents like Job Safety Analyses (JSAs).</p>
          <Button onClick={() => setIsJsaFormOpen(true)}>
            <Plus className="mr-2" /> Create New JSA
          </Button>
        </div>

        {/* Placeholder for listing existing JSAs */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold">Existing JSAs</h3>
          {safetyChecklists.length > 0 ? (
            <ul>
              {safetyChecklists.map(jsa => (
                <li key={jsa.id} className="p-2 border-b">{jsa.jobTitle}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic mt-2">No JSAs have been created yet.</p>
          )}
        </div>
      </Card>

      <Modal isOpen={isJsaFormOpen} onClose={() => setIsJsaFormOpen(false)} title="Create Job Safety Analysis">
        <JSAForm
          onSave={handleSaveJSA}
          onCancel={() => setIsJsaFormOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Safety;
