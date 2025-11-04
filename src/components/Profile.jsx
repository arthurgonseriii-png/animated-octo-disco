import React from 'react';
import Card from './Card';
import { User as UserIcon, Award, Star, TrendingUp, ShieldCheck } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`p-4 bg-white rounded-lg shadow-md border-l-4 border-${color}-500`}>
        <div className="flex items-center">
            <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600 mr-4`}><Icon size={22} /></div>
            <div>
                <div className="text-gray-500 text-sm font-medium">{title}</div>
                <div className="text-xl font-bold text-gray-800">{value}</div>
            </div>
        </div>
    </div>
);

const Badge = ({ icon: Icon, label, achieved }) => (
    <div className={`text-center p-4 rounded-lg transition-all ${achieved ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100 border-2 border-dashed'}`}>
        <Icon size={32} className={`mx-auto ${achieved ? 'text-green-600' : 'text-gray-400'}`} />
        <p className={`mt-2 text-sm font-semibold ${achieved ? 'text-green-800' : 'text-gray-500'}`}>{label}</p>
        {!achieved && <p className="text-xs text-gray-400">Locked</p>}
    </div>
);

const Profile = ({ user, assignments = [], safetyChecklists = [] }) => {
    const tasksCompleted = assignments.filter(a => a.assignedToUid === user.uid && a.status === 'Completed').length;
    const checklistsDone = safetyChecklists.filter(c => c.completedByUid === user.uid).length;

    // Placeholder for verification points
    const verificationPoints = user.verificationPoints || 0;

    const badges = {
        'Task Master': tasksCompleted >= 10,
        'Safety Champion': checklistsDone >= 5,
        'AI Contributor': verificationPoints >= 50,
    };

    return (
        <div className="space-y-8">
             <Card title="User Dashboard" titleIcon={UserIcon}>
                <div className="flex items-center space-x-6">
                    <div className="p-4 bg-blue-600 rounded-full text-white">
                        <UserIcon size={48} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-500">{user.role}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={TrendingUp} title="Tasks Completed" value={tasksCompleted} color="blue" />
                <StatCard icon={ShieldCheck} title="Safety Checklists Done" value={checklistsDone} color="red" />
                <StatCard icon={Star} title="Verification Points" value={verificationPoints} color="yellow" />
            </div>

            <Card title="Achievements & Badges" titleIcon={Award}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Badge icon={TrendingUp} label="Task Master" achieved={badges['Task Master']} />
                    <Badge icon={ShieldCheck} label="Safety Champion" achieved={badges['Safety Champion']} />
                    <Badge icon={Star} label="AI Contributor" achieved={badges['AI Contributor']} />
                    {/* Add more badges here */}
                </div>
            </Card>

             <Card title="User Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
