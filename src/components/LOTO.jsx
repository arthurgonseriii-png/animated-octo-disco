import React, { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { SafetyIcon } from './Icon';
import { APP_ID } from '../constants';

const LOTOForm = ({ permit, onSave, onCancel, equipment }) => {
  const [formData, setFormData] = useState(
    permit || {
      equipmentTag: '',
      description: '',
      authorizedPersonnel: [],
      status: 'Active',
      lockNumbers: '',
      procedure: ''
    }
  );
  const [personnelInput, setPersonnelInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPersonnel = () => {
    if (personnelInput && !formData.authorizedPersonnel.includes(personnelInput)) {
      setFormData(prev => ({ ...prev, authorizedPersonnel: [...prev.authorizedPersonnel, personnelInput] }));
      setPersonnelInput('');
    }
  };

  const handleRemovePersonnel = (name) => {
    setFormData(prev => ({ ...prev, authorizedPersonnel: prev.authorizedPersonnel.filter(p => p !== name) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="equipmentTag" className="block text-sm font-medium text-gray-700">Equipment</label>
          <select name="equipmentTag" id="equipmentTag" value={formData.equipmentTag} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Select Equipment</option>
            {equipment.map(e => <option key={e.id} value={e.tagNumber}>{e.tagNumber} - {e.name}</option>)}
          </select>
        </div>
        <Input name="lockNumbers" label="Lock Numbers (comma-separated)" value={formData.lockNumbers} onChange={handleChange} required />
      </div>
      <Input name="description" label="Reason for LOTO" value={formData.description} onChange={handleChange} required />
      <Input name="procedure" label="LOTO Procedure" type="textarea" value={formData.procedure} onChange={handleChange} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Authorized Personnel</label>
        <div className="flex space-x-2">
          <Input value={personnelInput} onChange={(e) => setPersonnelInput(e.target.value)} placeholder="Enter name and press Add" />
          <Button type="button" onClick={handleAddPersonnel}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.authorizedPersonnel.map(p => (
            <span key={p} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
              {p}
              <button type="button" onClick={() => handleRemovePersonnel(p)} className="ml-2 text-blue-600 hover:text-blue-800">x</button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button type="button" onClick={onCancel} className="bg-gray-500">Cancel</Button>
        <Button type="submit">{permit ? 'Update' : 'Create'} Permit</Button>
      </div>
    </form>
  );
};


const LOTO = ({ user, equipment = [], lotoPermits = [], db }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleSave = async (formData) => {
    if (!db) return;
    try {
      const payload = {
        ...formData,
        updated: serverTimestamp(),
        updatedBy: user.name
      };
      if (editingItem) {
        const permitDocRef = doc(db, `artifacts/${APP_ID}/public/data/lotoPermits`, editingItem.id);
        await updateDoc(permitDocRef, payload);
      } else {
        const permitCollection = collection(db, `artifacts/${APP_ID}/public/data/lotoPermits`);
        await addDoc(permitCollection, { ...payload, created: serverTimestamp(), createdBy: user.name });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving LOTO permit:", error);
    }
  };

  const handleDelete = async () => {
    if (!db || !deletingItem) return;
    try {
      await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/lotoPermits`, deletingItem.id));
      setDeletingItem(null);
    } catch (error) {
      console.error("Error deleting LOTO permit:", error);
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <Card title="LOTO (Lockout-Tagout) Management" titleIcon={SafetyIcon}>
      <div className="mb-4">
        {!isFormOpen && (
          <Button onClick={() => openForm()} className="flex items-center">
            <Plus size={18} className="mr-2" /> Create New LOTO Permit
          </Button>
        )}
      </div>

      {isFormOpen && (
        <LOTOForm
          permit={editingItem}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
          equipment={equipment}
        />
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Equipment Tag</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Created By</th>
              <th scope="col" className="px-6 py-3">Created On</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lotoPermits && lotoPermits.map(item => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.equipmentTag}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{item.createdBy}</td>
                <td className="px-6 py-4">{item.created?.toDate().toLocaleDateString()}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => setViewingItem(item)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"><Eye size={16} /></button>
                  <button onClick={() => openForm(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit size={16} /></button>
                  <button onClick={() => setDeletingItem(item)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingItem && (
        <Modal isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} title="Confirm Deletion">
          <p>Are you sure you want to delete this LOTO permit? This action is critical and cannot be undone.</p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={() => setDeletingItem(null)} className="bg-gray-500">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600">Delete</Button>
          </div>
        </Modal>
      )}

      {viewingItem && (
        <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title={`LOTO Details: ${viewingItem.equipmentTag}`}>
            <div className="space-y-3">
                <p><strong>Status:</strong> {viewingItem.status}</p>
                <p><strong>Reason:</strong> {viewingItem.description}</p>
                <p><strong>Lock Numbers:</strong> {viewingItem.lockNumbers}</p>
                <p><strong>Procedure:</strong> {viewingItem.procedure}</p>
                <p><strong>Authorized Personnel:</strong> {viewingItem.authorizedPersonnel.join(', ')}</p>
                <p><strong>Created:</strong> {viewingItem.created?.toDate().toLocaleString()} by {viewingItem.createdBy}</p>
            </div>
        </Modal>
      )}
    </Card>
  );
};

export default LOTO;
