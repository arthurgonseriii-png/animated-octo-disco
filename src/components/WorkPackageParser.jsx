import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { Upload, ArrowRight } from 'lucide-react';

const WorkPackageParser = ({ onTasksGenerated }) => {
    const [workList, setWorkList] = useState('');
    const [generatedTasks, setGeneratedTasks] = useState([]);

    const handleParse = () => {
        // Basic parsing logic (to be expanded with NLP)
        const tasks = workList.split('\n')
            .filter(line => line.trim() !== '')
            .map((line, index) => ({
                id: `T-${Date.now()}-${index}`,
                name: line.trim(),
                status: 'Not Started',
            }));
        setGeneratedTasks(tasks);
    };

    const handleConfirm = () => {
        onTasksGenerated(generatedTasks);
        setGeneratedTasks([]);
        setWorkList('');
    };

    return (
        <Card title="Work Package Parser" titleIcon={Upload}>
            <div className="space-y-4">
                <p className="text-gray-600">
                    Paste your list of work items (e.g., cable tags, equipment to be calibrated) below. Each item should be on a new line. The system will automatically generate a task for each item.
                </p>
                <textarea
                    className="w-full h-48 p-2 border border-gray-300 rounded-lg"
                    placeholder="Paste work list here..."
                    value={workList}
                    onChange={(e) => setWorkList(e.target.value)}
                />
                <Button onClick={handleParse} disabled={!workList.trim()}>
                    Parse Work List
                </Button>

                {generatedTasks.length > 0 && (
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold">Generated Tasks</h3>
                        <ul className="space-y-2 mt-2">
                            {generatedTasks.map(task => (
                                <li key={task.id} className="p-2 border rounded-lg bg-gray-50">
                                    {task.name}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleConfirm}>
                                Confirm and Add to Task List <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default WorkPackageParser;
