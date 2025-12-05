import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const JSAForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        date: new Date().toISOString().slice(0, 10),
        supervisor: '',
        department: 'I&C',
        ppeRequired: '',
        tasks: [{ name: '', hazards: '', controls: '' }],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTaskChange = (index, e) => {
        const { name, value } = e.target;
        const newTasks = [...formData.tasks];
        newTasks[index][name] = value;
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const addTask = () => {
        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, { name: '', hazards: '', controls: '' }],
        }));
    };

    const removeTask = (index) => {
        const newTasks = formData.tasks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleSave = () => {
        // Add validation here if needed
        onSave(formData);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Job Safety Analysis (JSA)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Job/Task Title" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
                <Input label="Date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
                <Input label="Supervisor" name="supervisor" value={formData.supervisor} onChange={handleInputChange} />
                <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Personal Protective Equipment (PPE) Required</label>
                <textarea
                    name="ppeRequired"
                    value={formData.ppeRequired}
                    onChange={handleInputChange}
                    rows="2"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., Hard Hat, Safety Glasses, Steel Toe Boots"
                ></textarea>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Task Steps, Hazards, and Controls</h3>
                {formData.tasks.map((task, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <textarea name="name" value={task.name} onChange={(e) => handleTaskChange(index, e)} placeholder="Task Step" rows="2" className="w-full p-1 border rounded"></textarea>
                            <textarea name="hazards" value={task.hazards} onChange={(e) => handleTaskChange(index, e)} placeholder="Potential Hazards" rows="2" className="w-full p-1 border rounded"></textarea>
                            <textarea name="controls" value={task.controls} onChange={(e) => handleTaskChange(index, e)} placeholder="Controls/Mitigations" rows="2" className="w-full p-1 border rounded"></textarea>
                        </div>
                        <button onClick={() => removeTask(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                    </div>
                ))}
                <Button onClick={addTask} className="bg-gray-200 text-sm">Add Task Step</Button>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button onClick={onCancel} className="bg-gray-300">Cancel</Button>
                <Button onClick={handleSave}>Save JSA</Button>
            </div>
        </div>
    );
};

export default JSAForm;
