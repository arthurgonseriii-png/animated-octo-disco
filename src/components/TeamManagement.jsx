import React, { useState } from 'react';

const TeamManagement = ({ teams = [], users = [], onUpdateTeams }) => {
    const [teamName, setTeamName] = useState('');

    const handleCreateTeam = () => {
        if (!teamName.trim()) return;
        const newTeam = { id: `T-${Date.now()}`, name: teamName, members: [] };
        onUpdateTeams([...teams, newTeam]);
        setTeamName('');
    };

    const handleDrop = (e, teamId) => {
        const userId = e.dataTransfer.getData('userId');
        const updatedTeams = teams.map(team => {
            if (team.id === teamId) {
                return { ...team, members: [...team.members, userId] };
            }
            return { ...team, members: team.members.filter(id => id !== userId) };
        });
        onUpdateTeams(updatedTeams);
    };

    const handleDragStart = (e, userId) => {
        e.dataTransfer.setData('userId', userId);
    };

    const unassignedUsers = users.filter(user => !teams.some(team => team.members.includes(user.id)));

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teams.map(team => (
                    <div key={team.id} className="p-4 border rounded-lg" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, team.id)}>
                        <h4 className="font-bold">{team.name}</h4>
                        <ul className="mt-2 space-y-2">
                            {team.members.map(userId => {
                                const user = users.find(u => u.id === userId);
                                return <li key={userId} className="p-2 bg-gray-100 rounded">{user?.name}</li>;
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex space-x-2">
                <input type="text" placeholder="New Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="p-2 border rounded" />
                <button onClick={handleCreateTeam} className="p-2 bg-blue-600 text-white rounded">Create Team</button>
            </div>
            <div className="mt-8">
                <h4 className="font-bold">Unassigned Users</h4>
                <ul className="mt-2 space-y-2">
                    {unassignedUsers.map(user => (
                        <li key={user.id} draggable onDragStart={(e) => handleDragStart(e, user.id)} className="p-2 bg-gray-100 rounded cursor-move">
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TeamManagement;
