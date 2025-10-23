import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, serverTimestamp, query, where, onSnapshot, orderBy, doc } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import Input from './Input';
import { Calendar, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { APP_ID } from '../constants';

const DailyLog = ({ user, db }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLog, setCurrentLog] = useState(null); // Used for editing

    const initialState = {
        date: new Date().toISOString().split('T')[0],
        hoursWorked: 8,
        tasksCompleted: '',
        siteConditions: 'Normal',
        notes: '',
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (!db || !user) return;

        setIsLoading(true);
        const logsCollectionRef = collection(db, `artifacts/${APP_ID}/public/data/dailyLogs`);
        const q = query(
            logsCollectionRef,
            where('createdByUid', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedLogs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            fetchedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            setLogs(fetchedLogs);
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching daily logs:", err);
            setError("Failed to load daily logs.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [db, user]);

    const handleOpenModal = (log = null) => {
        setCurrentLog(log);
        setFormData(log ? {
            date: log.date,
            hoursWorked: log.hoursWorked,
            tasksCompleted: log.tasksCompleted,
            siteConditions: log.siteConditions,
            notes: log.notes,
        } : initialState);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLog(null);
        setFormData(initialState);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveLog = async () => {
        if (!formData.tasksCompleted || formData.hoursWorked <= 0) {
            alert("Please fill in the hours worked and tasks completed.");
            return;
        }

        const logsCollectionRef = collection(db, `artifacts/${APP_ID}/public/data/dailyLogs`);

        try {
            if (currentLog) {
                // Update existing log
                const logDocRef = doc(db, `artifacts/${APP_ID}/public/data/dailyLogs`, currentLog.id);
                await updateDoc(logDocRef, {
                    ...formData,
                    hoursWorked: Number(formData.hoursWorked),
                    updatedAt: serverTimestamp(),
                });
            } else {
                // Create new log
                await addDoc(logsCollectionRef, {
                    ...formData,
                    hoursWorked: Number(formData.hoursWorked),
                    createdByUid: user.uid,
                    createdByName: user.name,
                    created: serverTimestamp(),
                });
            }
            handleCloseModal();
        } catch (e)
        {
            console.error("Error saving log:", e);
            alert("Failed to save log entry. Check console for details.");
        }
    };

    const handleDeleteLog = async (logId) => {
        if (window.confirm("Are you sure you want to delete this log entry?")) {
            try {
                const logDocRef = doc(db, `artifacts/${APP_ID}/public/data/dailyLogs`, logId);
                await deleteDoc(logDocRef);
            } catch (e) {
                console.error("Error deleting log:", e);
                alert("Failed to delete log entry.");
            }
        }
    };


    return (
        <>
            <Card title="Daily Log" titleIcon={Calendar}>
                <div className="flex justify-end mb-4">
                    <Button onClick={() => handleOpenModal()}>
                        <Plus size={18} className="mr-2" /> New Log Entry
                    </Button>
                </div>

                {isLoading && <p>Loading logs...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="space-y-4">
                    {logs.map(log => (
                        <div key={log.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-blue-700">{new Date(log.date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-sm text-gray-500">Hours Worked: {log.hoursWorked}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button onClick={() => handleOpenModal(log)} className="bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs px-2 py-1 shadow-none"><Edit size={14}/></Button>
                                    <Button onClick={() => handleDeleteLog(log.id)} className="bg-red-100 text-red-700 hover:bg-red-200 text-xs px-2 py-1 shadow-none"><Trash2 size={14}/></Button>
                                </div>
                            </div>
                            <div className="mt-3 space-y-2 text-sm">
                                <p><strong>Tasks Completed:</strong> {log.tasksCompleted}</p>
                                <p><strong>Site Conditions:</strong> {log.siteConditions}</p>
                                {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                {logs.length === 0 && !isLoading && (
                    <div className="text-center py-10">
                        <Calendar size={48} className="mx-auto text-gray-300" />
                        <p className="mt-4 text-gray-500">No daily logs found. Click "New Log Entry" to get started.</p>
                    </div>
                )}
            </Card>

            <Modal show={isModalOpen} onClose={handleCloseModal} title={currentLog ? "Edit Log Entry" : "Create New Log Entry"}>
                <div className="space-y-4">
                    <Input id="date" label="Date" type="date" value={formData.date} onChange={handleInputChange} />
                    <Input id="hoursWorked" label="Hours Worked" type="number" value={formData.hoursWorked} onChange={handleInputChange} />
                    <Input id="tasksCompleted" label="Tasks Completed" type="textarea" value={formData.tasksCompleted} onChange={handleInputChange} placeholder="Describe the main tasks you accomplished today." />
                    <Input id="siteConditions" label="Site Conditions" value={formData.siteConditions} onChange={handleInputChange} placeholder="e.g., Sunny, Windy, Rain" />
                    <Input id="notes" label="Additional Notes" type="textarea" value={formData.notes} onChange={handleInputChange} placeholder="Any issues, safety concerns, or other notes." />
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button onClick={handleCloseModal} className="bg-gray-500">Cancel</Button>
                        <Button onClick={handleSaveLog} className="bg-green-600">{currentLog ? 'Update Entry' : 'Save Entry'}</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DailyLog;
