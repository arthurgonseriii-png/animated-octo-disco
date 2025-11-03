import React, { useState } from 'react';
import { Lock, Plus, Edit, Trash2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import Input from './Input';

// This is a placeholder component. In a real application, you would manage state and DB interactions.
const LOTO = ({ user, equipment = [] }) => {
    const [permits, setPermits] = useState([
        { id: 'LOTO-001', equipmentTag: 'FCV-101A', status: 'Active', authorizedBy: 'Arthur Gonser III', date: '2024-10-28' },
        { id: 'LOTO-002', equipmentTag: 'P-202B', status: 'Active', authorizedBy: 'Jane Smith', date: '2024-10-29' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <Card title="Lockout-Tagout (LOTO) Permits" titleIcon={Lock}>
                <div className="flex justify-end mb-4">
                    <Button onClick={handleOpenModal}><Plus size={18} className="mr-2"/> Create New LOTO Permit</Button>
                </div>
                <div className="space-y-3">
                    {permits.map(permit => (
                        <div key={permit.id} className="p-4 border rounded-lg flex justify-between items-center bg-yellow-50 border-yellow-200">
                            <div>
                                <p className="font-bold text-yellow-800">{permit.id} - {permit.equipmentTag}</p>
                                <p className="text-sm text-yellow-700">Status: {permit.status} | Authorized By: {permit.authorizedBy} on {permit.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button className="bg-yellow-500 hover:bg-yellow-600 p-2 h-8 w-8 shadow-none text-white"><Edit size={16} /></Button>
                                <Button className="bg-red-600 hover:bg-red-700 p-2 h-8 w-8 shadow-none text-white"><Trash2 size={16} /></Button>
                            </div>
                        </div>
                    ))}
                    {permits.length === 0 && <p className="text-center text-gray-500 py-8">No active LOTO permits.</p>}
                </div>
            </Card>

            <Modal show={isModalOpen} onClose={handleCloseModal} title="Create New LOTO Permit">
                <form className="space-y-4">
                    <Input label="Equipment Tag Number" name="equipmentTag" placeholder="Select equipment..." required />
                    <Input label="Reason for LOTO" name="reason" placeholder="e.g., Motor replacement" required />
                    <Input label="Authorized By" name="authorizedBy" value={user.name} disabled />
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
                        <Button type="submit">Issue Permit</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};