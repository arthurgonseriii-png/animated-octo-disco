import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import TeamManagement from './TeamManagement';

const UserForm = ({ user, onSave, onCancel }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [role, setRole] = useState(user?.role || 'Technician');

    const handleSave = () => {
        onSave({ ...user, name, email, role });
    };

    return (
        <div className="space-y-4">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
                <option value="Technician">Technician</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
            </select>
            <div className="flex justify-end space-x-2">
                <Button onClick={onCancel} className="bg-gray-300">Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    );
};

const UserManagement = ({ allUsers = [], db }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!db) return;
            try {
                setError(null);
                const teamsCollection = collection(db, 'teams');
                const teamSnapshot = await getDocs(teamsCollection);
                setTeams(teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Error fetching teams:", err);
                setError("Could not fetch teams. Please check permissions.");
            }
        };
        fetchTeams();
    }, [db]);

    const handleSaveUser = async (user) => {
        if (!db) return;
        try {
            setError(null);
            if (user.id) {
                await updateDoc(doc(db, 'users', user.id), user);
            } else {
                await addDoc(collection(db, 'users'), { ...user, created: serverTimestamp() });
            }
            setIsFormOpen(false);
            setEditingUser(null);
        } catch (err) {
            console.error("Error saving user:", err);
            setError("Could not save user. Please check permissions.");
        }
    };

    const handleDeleteUser = async () => {
        if (!db || !deletingUser) return;
        try {
            setError(null);
            await deleteDoc(doc(db, 'users', deletingUser.id));
            setDeletingUser(null);
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Could not delete user. Please check permissions.");
        }
    };

    const handleUpdateTeams = async (updatedTeams) => {
        setTeams(updatedTeams);
        if (!db) return;
        try {
            setError(null);
            for (const team of updatedTeams) {
                if (team.id.startsWith('T-')) {
                    await addDoc(collection(db, 'teams'), team);
                } else {
                    await updateDoc(doc(db, 'teams', team.id), team);
                }
            }
        } catch (err) {
            console.error("Error updating teams:", err);
            setError("Could not update teams. Please check permissions.");
        }
    };

    return (
        <Card title="Team Management" titleIcon={Users}>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
            <div className="mb-4">
                <Button onClick={() => { setEditingUser(null); setIsFormOpen(true); }}><Plus className="mr-2" />Add New User</Button>
            </div>

            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.map(user => (
                        <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button onClick={() => { setEditingUser(user); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit"><Edit size={16} /></button>
                                <button onClick={() => setDeletingUser(user)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Delete"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <TeamManagement teams={teams} users={allUsers} onUpdateTeams={handleUpdateTeams} />

            {isFormOpen && (
                <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
                    <UserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setIsFormOpen(false)} />
                </Modal>
            )}

            {deletingUser && (
                <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title="Delete User">
                    <p>Are you sure you want to delete {deletingUser.name}?</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button onClick={() => setDeletingUser(null)} className="bg-gray-300">Cancel</Button>
                        <Button onClick={handleDeleteUser} className="bg-red-600">Delete</Button>
                    </div>
                </Modal>
            )}
        </Card>
    );
};

export default UserManagement;
