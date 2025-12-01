import React, { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import Button from './Button';
import { SafetyIcon, Plus, Edit, Trash2, Eye } from 'lucide-react';

const LOTO = ({ user, equipment = [], lotoPermits = [], db }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);

    return (
        <Card title="LOTO (Lockout-Tagout) Management" titleIcon={SafetyIcon}>
            <div className="mb-4">
                <Button onClick={() => setIsFormOpen(true)}><Plus className="mr-2" />Add New LOTO</Button>
            </div>

            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">Equipment Tag</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lotoPermits.map(permit => (
                        <tr key={permit.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{permit.equipmentTag}</td>
                            <td className="px-6 py-4">{permit.status}</td>
                            <td className="px-6 py-4">{permit.description}</td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button onClick={() => setViewingItem(permit)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" title="View Details"><Eye size={16} /></button>
                                <button onClick={() => { setEditingItem(permit); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit"><Edit size={16} /></button>
                                <button onClick={() => setDeletingItem(permit)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Delete"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {viewingItem && (
                <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title={`LOTO Details: ${viewingItem.equipmentTag}`}>
                    <div className="space-y-3">
                        <p><strong>Equipment:</strong> {equipment.find(e => e.tagNumber === viewingItem.equipmentTag)?.name}</p>
                        <p><strong>Status:</strong> {viewingItem.status}</p>
                        <p><strong>Reason:</strong> {viewingItem.description}</p>
                    </div>
                </Modal>
            )}
        </Card>
    );
};

export default LOTO;
