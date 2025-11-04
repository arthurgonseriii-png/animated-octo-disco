import React, { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { EquipmentIcon } from './Icon';
import { APP_ID, FLOORS } from '../constants';

const EquipmentForm = ({ equipmentItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    equipmentItem || {
      tagNumber: '',
      name: '',
      location: '',
      floor: '',
      status: 'Commissioning',
      notes: '',
      lat: '',
      lng: ''
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="tagNumber" label="Tag Number" value={formData.tagNumber} onChange={handleChange} required />
        <Input name="name" label="Equipment Name" value={formData.name} onChange={handleChange} required />
        <Input name="location" label="Location Description" value={formData.location} onChange={handleChange} />
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Floor</label>
          <select name="floor" id="floor" value={formData.floor} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Select Floor</option>
            {FLOORS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <Input name="lat" label="Latitude" type="number" step="any" value={formData.lat} onChange={handleChange} />
        <Input name="lng" label="Longitude" type="number" step="any" value={formData.lng} onChange={handleChange} />
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Commissioning</option>
            <option>Operational</option>
            <option>Decommissioned</option>
            <option>Maintenance</option>
          </select>
        </div>
      </div>
      <Input name="notes" label="Notes" type="textarea" value={formData.notes} onChange={handleChange} />
      <div className="flex justify-end space-x-3">
        <Button type="button" onClick={onCancel} className="bg-gray-500">Cancel</Button>
        <Button type="submit">{equipmentItem ? 'Update' : 'Create'} Equipment</Button>
      </div>
    </form>
  );
};

const Equipment = ({ user, equipment, db }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const handleSave = async (formData) => {
    if (!db) return;
    try {
      if (editingItem) {
        // Update
        const equipDocRef = doc(db, `artifacts/${APP_ID}/public/data/equipment`, editingItem.id);
        await updateDoc(equipDocRef, { ...formData, updated: serverTimestamp(), updatedBy: user.name });
      } else {
        // Create
        const equipmentCollection = collection(db, `artifacts/${APP_ID}/public/data/equipment`);
        await addDoc(equipmentCollection, { ...formData, created: serverTimestamp(), createdBy: user.name });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving equipment:", error);
    }
  };

  const handleDelete = async () => {
    if (!db || !deletingItem) return;
    try {
      const equipDocRef = doc(db, `artifacts/${APP_ID}/public/data/equipment`, deletingItem.id);
      await deleteDoc(equipDocRef);
      setDeletingItem(null);
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <Card title="Equipment Management" titleIcon={EquipmentIcon}>
      <div className="mb-4">
        {!isFormOpen && (
          <Button onClick={() => openForm()} className="flex items-center">
            <Plus size={18} className="mr-2" /> Add New Equipment
          </Button>
        )}
      </div>

      {isFormOpen && (
        <EquipmentForm
          equipmentItem={editingItem}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
        />
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Tag #</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment && equipment.map(item => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.tagNumber}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Operational' ? 'bg-green-100 text-green-800' :
                    item.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{item.location} ({item.floor})</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => openForm(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit size={16} /></button>
                  <button onClick={() => setDeletingItem(item)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingItem && (
        <Modal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          title="Confirm Deletion"
          titleIcon={AlertTriangle}
        >
          <p>Are you sure you want to delete the equipment "{deletingItem.tagNumber} - {deletingItem.name}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={() => setDeletingItem(null)} className="bg-gray-500">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600">Delete</Button>
          </div>
        </Modal>
      )}
    </Card>
  );
};

export default Equipment;
