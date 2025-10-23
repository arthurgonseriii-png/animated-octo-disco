import React from 'react';
import Card from './Card';
import { Users, AlertTriangle } from 'lucide-react';

const UserManagement = ({ user, allUsers, db }) => {
    if (user.role !== 'MasterAdmin' && user.role !== 'Admin') {
        return (
            <Card title="Access Denied" titleIcon={AlertTriangle}>
                <p className="text-red-500">You do not have permission to manage team members.</p>
            </Card>
        );
    }

    return (
        <Card title="Team Management" titleIcon={Users}>
            <div className="space-y-3">
                {allUsers.map(u => (
                    <div key={u.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${u.role === 'MasterAdmin' ? 'from-red-500 to-red-700' : u.role === 'Admin' ? 'from-blue-500 to-blue-700' : 'from-green-500 to-green-700'}`}>
                                {u.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">{u.name} ({u.username})</div>
                                <div className={`text-sm font-medium ${u.role === 'MasterAdmin' ? 'text-red-600' : u.role === 'Admin' ? 'text-blue-600' : 'text-green-600'}`}>{u.role}</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">UID: {u.uid}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default UserManagement;
