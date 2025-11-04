import React from 'react';
import Card from './Card';
import { HardHat, AlertTriangle, MapPin, Clock, Zap, Calendar, CheckSquare, Wrench, BrainCircuit } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white p-5 rounded-xl shadow-lg border-l-4 border-${color}-500 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transform transition-all duration-300`}>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}><Icon size={24} /></div>
        <div>
            <div className="text-gray-500 text-sm font-medium">{title}</div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="p-4 bg-gray-50 border rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <Icon size={28} className="text-gray-600" />
        <span className="text-sm font-medium text-center text-gray-700">{label}</span>
    </button>
);

const Dashboard = ({ user, assignments = [], projects = [], files = [], dailyLogs = [], setPage }) => {
    const pendingAssignments = assignments.filter(a => a.assignedToUid === user.uid && a.status !== 'Complete');
    const recentLogs = dailyLogs.filter(log => log.createdByUid === user.uid).slice(0, 3);

    return (
        <div className="space-y-8">
            <div className="p-8 bg-blue-600 text-white rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700">
                <h1 className="text-4xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="opacity-80 mt-2 text-blue-100">Here is your operational summary for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={HardHat} title="Active Projects" value={projects.length} color="blue" />
                <StatCard icon={AlertTriangle} title="Pending Tasks" value={pendingAssignments.length} color="red" />
                <StatCard icon={MapPin} title="Geo-Tagged Files" value={files.filter(f => f.lat).length} color="green" />
                <StatCard icon={Clock} title="Your Recent Logs" value={recentLogs.length} color="purple" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card title="High-Priority Tasks" titleIcon={AlertTriangle}>
                        <ul className="space-y-3">
                            {pendingAssignments.length > 0 ? (
                                pendingAssignments.slice(0, 5).map(a => {
                                    const project = projects.find(p => p.id === a.projectId);
                                    return (
                                        <li key={a.id} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                                            <div>
                                                <div className="font-semibold">{a.taskName}</div>
                                                <div className="text-sm text-gray-500">{project?.name || 'N/A'}</div>
                                            </div>
                                            <div className="text-xs text-red-500 font-medium">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</div>
                                        </li>
                                    );
                                })
                            ) : <p className="text-gray-500 italic py-4 text-center">No pending tasks. Well done.</p>}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Quick Actions" titleIcon={Zap}>
                        <div className="grid grid-cols-2 gap-4">
                            <ActionButton icon={Calendar} label="New Daily Log" onClick={() => setPage('DailyLog')} />
                            <ActionButton icon={CheckSquare} label="New Safety Check" onClick={() => setPage('Safety')} />
                            <ActionButton icon={Wrench} label="Add Equipment" onClick={() => setPage('Equipment')} />
                            <ActionButton icon={BrainCircuit} label="AI Tools" onClick={() => setPage('PhotoAnalyzer')} />
                        </div>
                    </Card>
                </div>
            </div>
            <p className="text-center text-gray-400 text-xs mt-8 opacity-50">Creator & Coder : ARTHUR GONSER III *NOT FOR DISTRIBUTION PURPOSES*</p>
        </div>
    );
};

export default Dashboard;
