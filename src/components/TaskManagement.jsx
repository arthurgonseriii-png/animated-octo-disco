import React from 'react';
import Card from './Card';
import { FileText, AlertTriangle } from 'lucide-react';

const TaskManagement = ({ user, taskTemplates = [] }) => {
    if (user.role !== 'MasterAdmin' && user.role !== 'Admin') {
        return (
            <Card title="Access Denied" titleIcon={AlertTriangle}>
                <p className="text-red-500">You do not have permission.</p>
            </Card>
        );
    }

    return (
        <Card title="Task Templates" titleIcon={FileText}>
            <div className="space-y-4">
                {taskTemplates.map(t => (
                    <div key={t.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="font-bold text-gray-800">{t.name}</div>
                        <div className="text-sm text-gray-600">{t.description}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TaskManagement;
