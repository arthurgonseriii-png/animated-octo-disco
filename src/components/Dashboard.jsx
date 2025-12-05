import React, { useState, useMemo } from 'react';
import Card from './Card';
import { HardHat, AlertTriangle, MapPin, Clock, Zap, Calendar, CheckSquare, Wrench, BrainCircuit, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import FilterModal from './FilterModal';

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

const Dashboard = ({ user, assignments = [], projects = [], files = [], dailyLogs = [], onSelectItem, equipment = [] }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const pendingAssignments = assignments.filter(a => a.assignedToUid === user.uid && a.status !== 'Complete');
    const recentLogs = dailyLogs.filter(log => log.createdByUid === user.uid).slice(0, 3);

    const searchPool = useMemo(() => [...equipment, ...files, ...assignments], [equipment, files, assignments]);

    const searchResults = useMemo(() => {
        if (!searchQuery && Object.keys(filters).length === 0) return [];

        return searchPool.filter(item => {
            const queryMatch = searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;

            const itemType = item.type || (item.taskName ? 'Task' : 'File');
            const filterTypeMatch = filters.itemType ? itemType === filters.itemType : true;
            const filterSystemMatch = filters.system ? item.system?.toLowerCase().includes(filters.system.toLowerCase()) : true;
            const filterStatusMatch = filters.status ? item.status === filters.status : true;

            return queryMatch && filterTypeMatch && filterSystemMatch && filterStatusMatch;
        });
    }, [searchQuery, filters, searchPool]);

    return (
        <div className="space-y-8">
            <div className="p-8 bg-blue-600 text-white rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700">
                <h1 className="text-4xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="opacity-80 mt-2 text-blue-100">Here is your operational summary for today.</p>
                <div className="mt-6">
                    <Search
                        onSearch={setSearchQuery}
                        onFilter={() => setIsFilterModalOpen(true)}
                        searchPool={searchPool}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={HardHat} title="Active Projects" value={projects.length} color="blue" />
                <StatCard icon={AlertTriangle} title="Pending Tasks" value={pendingAssignments.length} color="red" />
                <StatCard icon={MapPin} title="Geo-Tagged Files" value={files.filter(f => f.lat).length} color="green" />
                <StatCard icon={Clock} title="Your Recent Logs" value={recentLogs.length} color="purple" />
            </div>

            {(searchQuery || Object.keys(filters).length > 0) && (
                <Card title="Search Results" titleIcon={SearchIcon}>
                    {searchResults.length > 0 ? (
                         <ul className="space-y-3">
                            {searchResults.map(item => (
                                <li key={item.id} onClick={() => onSelectItem(item)} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                    <div>
                                        <div className="font-semibold">{item.name || item.taskName}</div>
                                        <div className="text-sm text-gray-500">{item.type || 'Task'}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic py-4 text-center">No results found.</p>
                    )}
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card title="High-Priority Tasks" titleIcon={AlertTriangle}>
                        <ul className="space-y-3">
                            {pendingAssignments.length > 0 ? (
                                pendingAssignments.slice(0, 5).map(a => {
                                    const project = projects.find(p => p.id === a.projectId);
                                    return (
                                        <li key={a.id} onClick={() => onSelectItem(a)} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                            <div>
                                                <div className="font-semibold">{a.taskName}</div>
                                                <div className="text-sm text-gray-500">{project?.name || 'N/A'}</div>
                                            </div>
                                            <div className="text-xs text-red-500 font-medium">Due: {a.dueDate ? new Date(a.dueDate).toLocaleString() : 'N/A'}</div>
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
                            <ActionButton icon={Calendar} label="New Daily Log" onClick={() => navigate('/daily-log')} />
                            <ActionButton icon={CheckSquare} label="New Safety Check" onClick={() => navigate('/safety')} />
                            <ActionButton icon={Wrench} label="Add Equipment" onClick={() => navigate('/equipment')} />
                            <ActionButton icon={BrainCircuit} label="AI Tools" onClick={() => navigate('/photo-analyzer')} />
                        </div>
                    </Card>
                </div>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={setFilters}
            />

            <p className="text-center text-gray-400 text-xs mt-8 opacity-50">Creator & Coder : ARTHUR GONSER III *NOT FOR DISTRIBUTION PURPOSES*</p>
        </div>
    );
};

export default Dashboard;
