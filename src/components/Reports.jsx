import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './Card';
import { AlertTriangle, BarChart as BarChartIcon } from 'lucide-react';

const Reports = ({ user, assignments = [], safetyChecklists = [], allUsers = [] }) => {
    if (user.role !== 'MasterAdmin' && user.role !== 'Admin') {
        return (
            <Card title="Access Denied" titleIcon={AlertTriangle}>
                <p className="text-red-500">You do not have permission to view this page.</p>
            </Card>
        );
    }

    const complianceData = useMemo(() => {
        // This is a simplified example; a real implementation would group by week/month
        return safetyChecklists.map((c, i) => ({
            name: `Chk #${i+1}`,
            'Completed': c.status === 'Complete' ? 1 : 0,
        })).slice(-10); // Last 10 checklists
    }, [safetyChecklists]);

    const taskStatusData = useMemo(() => {
        const statuses = assignments.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(statuses).map(key => ({ name: key, value: statuses[key] }));
    }, [assignments]);

    const workloadData = useMemo(() => {
        const workload = assignments.reduce((acc, task) => {
            const userName = allUsers.find(u => u.uid === task.assignedToUid)?.name || 'Unassigned';
            acc[userName] = (acc[userName] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(workload).map(key => ({ name: key, 'Tasks Assigned': workload[key] }));
    }, [assignments, allUsers]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Management Reporting Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Safety Compliance Over Time" titleIcon={BarChartIcon}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={complianceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Completed" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Task Status Breakdown" titleIcon={BarChartIcon}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {taskStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Team Workload Distribution" titleIcon={BarChartIcon} className="lg:col-span-2">
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={workloadData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Tasks Assigned" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
