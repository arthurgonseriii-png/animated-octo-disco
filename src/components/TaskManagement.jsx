import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import { ListTodo, Plus, User } from 'lucide-react';
import { APP_ID } from '../constants';

const TaskForm = ({ onSave, onCancel, projects, allUsers, taskTemplates }) => {
    const [formData, setFormData] = useState({
        taskTemplateId: '',
        projectId: '',
        assignedToUid: '',
        dueDate: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskName = taskTemplates.find(t => t.id === formData.taskTemplateId)?.name || 'Unnamed Task';
        onSave({ ...formData, taskName, status: 'To Do' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label>Task Type</label>
                <select name="taskTemplateId" value={formData.taskTemplateId} onChange={handleChange} required className="w-full mt-1 p-2 border rounded">
                    <option value="">Select a task template</option>
                    {taskTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
            <div>
                <label>Project</label>
                <select name="projectId" value={formData.projectId} onChange={handleChange} required className="w-full mt-1 p-2 border rounded">
                    <option value="">Select a project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div>
                <label>Assign To</label>
                <select name="assignedToUid" value={formData.assignedToUid} onChange={handleChange} required className="w-full mt-1 p-2 border rounded">
                    <option value="">Select a user</option>
                    {allUsers.map(u => <option key={u.uid} value={u.uid}>{u.name}</option>)}
                </select>
            </div>
            <Input name="dueDate" label="Due Date" type="date" value={formData.dueDate} onChange={handleChange} />
            <Input name="notes" label="Notes" type="textarea" value={formData.notes} onChange={handleChange} />
            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onCancel} className="bg-gray-500">Cancel</Button>
                <Button type="submit">Create Assignment</Button>
            </div>
        </form>
    );
};

const TaskCard = ({ task, project, user, onDragStart }) => (
    <div draggable onDragStart={(e) => onDragStart(e, task.id)} className="p-4 bg-white border rounded-lg shadow-sm cursor-grab active:cursor-grabbing">
        <h4 className="font-bold">{task.taskName}</h4>
        <p className="text-sm text-gray-600">{project?.name}</p>
        <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
            <User size={14} />
            <span>{user?.name || 'Unassigned'}</span>
        </div>
    </div>
);

const TaskColumn = ({ title, tasks, onDrop, onDragOver, children }) => (
    <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="bg-gray-100 p-4 rounded-lg w-full md:w-1/3"
    >
        <h3 className="font-bold text-lg mb-4 border-b pb-2">{title} ({tasks.length})</h3>
        <div className="space-y-3 min-h-[300px]">
            {children}
        </div>
    </div>
);


const TaskManagement = ({ user, assignments, projects, allUsers, taskTemplates, db }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSave = async (formData) => {
        if (!db) return;
        try {
            const assignmentsCollection = collection(db, `artifacts/${APP_ID}/public/data/assignments`);
            await addDoc(assignmentsCollection, { ...formData, created: serverTimestamp() });
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error creating assignment:", error);
        }
    };

    const onDragStart = (e, id) => {
        e.dataTransfer.setData("id", id);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = async (e, newStatus) => {
        const id = e.dataTransfer.getData("id");
        const task = assignments.find(a => a.id === id);
        if (task && task.status !== newStatus) {
            try {
                const taskRef = doc(db, `artifacts/${APP_ID}/public/data/assignments`, id);
                await updateDoc(taskRef, { status: newStatus });
            } catch (error) {
                console.error("Error updating task status:", error);
            }
        }
    };

    const tasksByStatus = {
        "To Do": assignments.filter(a => a.status === 'To Do'),
        "In Progress": assignments.filter(a => a.status === 'In Progress'),
        "Completed": assignments.filter(a => a.status === 'Completed'),
    };

    return (
        <Card title="Task Management Board" titleIcon={ListTodo}>
             <div className="mb-4">
                <Button onClick={() => setIsFormOpen(true)} className="flex items-center">
                    <Plus size={18} className="mr-2"/> New Task Assignment
                </Button>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {["To Do", "In Progress", "Completed"].map(status => (
                    <TaskColumn
                        key={status}
                        title={status}
                        tasks={tasksByStatus[status]}
                        onDrop={(e) => onDrop(e, status)}
                        onDragOver={onDragOver}
                    >
                        {tasksByStatus[status].map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                project={projects.find(p => p.id === task.projectId)}
                                user={allUsers.find(u => u.uid === task.assignedToUid)}
                                onDragStart={onDragStart}
                            />
                        ))}
                    </TaskColumn>
                ))}
            </div>

            {isFormOpen && (
                <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create New Task Assignment">
                    <TaskForm
                        onSave={handleSave}
                        onCancel={() => setIsFormOpen(false)}
                        projects={projects}
                        allUsers={allUsers}
                        taskTemplates={taskTemplates}
                    />
                </Modal>
            )}
        </Card>
    );
};

export default TaskManagement;
