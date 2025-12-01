import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { FileText, Printer } from 'lucide-react';

const JSAGenerator = ({ user, assignments = [], equipment = [] }) => {
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [generatedJSA, setGeneratedJSA] = useState(null);

    const userAssignments = assignments.filter(a => a.assignedToUid === user.uid && a.status === 'To Do');

    const handleTaskToggle = (taskId) => {
        setSelectedTasks(prev =>
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const generateJSA = () => {
        const tasks = userAssignments.filter(a => selectedTasks.includes(a.id));
        const jsa = {
            date: new Date().toLocaleDateString(),
            technician: user.name,
            tasks: tasks.map(task => ({
                name: task.taskName,
                equipment: equipment.find(e => e.id === task.equipmentId)?.name || 'N/A',
                location: equipment.find(e => e.id === task.equipmentId)?.floor || 'N/A',
                hazards: ['Electrical Shock', 'Slips, Trips, & Falls'], // This would be more dynamic in a real app
            })),
        };
        setGeneratedJSA(jsa);
    };

    if (generatedJSA) {
        return (
            <Card title="Generated Job Safety Analysis" titleIcon={FileText}>
                <div className="prose">
                    <h2>Job Safety Analysis</h2>
                    <p><strong>Date:</strong> {generatedJSA.date}</p>
                    <p><strong>Technician:</strong> {generatedJSA.technician}</p>
                    <h3>Tasks Covered:</h3>
                    <ul>
                        {generatedJSA.tasks.map((task, i) => (
                            <li key={i}>
                                <strong>{task.name}</strong> at {task.location} ({task.equipment})
                                <br />
                                <em>Potential Hazards: {task.hazards.join(', ')}</em>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <Button onClick={() => setGeneratedJSA(null)}>Back</Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2" />Print JSA</Button>
                </div>
            </Card>
        );
    }

    return (
        <Card title="JSA Generator" titleIcon={FileText}>
            <div className="space-y-4">
                <p className="text-gray-600">Select the tasks you will be performing today. The system will automatically generate a JSA for you.</p>
                <div className="space-y-2">
                    {userAssignments.map(task => (
                        <div key={task.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`task-${task.id}`}
                                checked={selectedTasks.includes(task.id)}
                                onChange={() => handleTaskToggle(task.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`task-${task.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                                {task.taskName}
                            </label>
                        </div>
                    ))}
                </div>
                <Button onClick={generateJSA} disabled={selectedTasks.length === 0}>
                    Generate JSA
                </Button>
            </div>
        </Card>
    );
};

export default JSAGenerator;
