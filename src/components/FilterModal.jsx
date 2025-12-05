import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
    const [filters, setFilters] = useState({
        itemType: '',
        system: '',
        status: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filter Options">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Item Type</label>
                    <select
                        name="itemType"
                        value={filters.itemType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">All</option>
                        <option value="Cable">Cable</option>
                        <option value="Device">Device</option>
                        <option value="Document">Document</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">System</label>
                    <input
                        type="text"
                        name="system"
                        value={filters.system}
                        onChange={handleInputChange}
                        placeholder="e.g., Fire Alarm, Control System"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Needs Maintenance">Needs Maintenance</option>
                    </select>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <Button onClick={onClose} className="bg-gray-300">Cancel</Button>
                <Button onClick={handleApply}>Apply Filters</Button>
            </div>
        </Modal>
    );
};

export default FilterModal;
