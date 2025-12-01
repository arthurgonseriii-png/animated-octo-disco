import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import { ShieldCheck, Plus, ListChecks, ArrowLeft, CheckSquare } from 'lucide-react';
import { APP_ID, SAFETY_TEMPLATES } from '../constants'; // Import SAFETY_TEMPLATES
import { EquipmentIcon } from './Icon'; // Import EquipmentIcon

const LiveChecklist = ({ template, onComplete, onBack, equipment }) => {
    // ... (existing live checklist code)
}


const Safety = ({ user, safetyChecklists = [], db, equipment }) => {
    const [activeChecklist, setActiveChecklist] = useState(null);

    const handleSaveChecklist = async (completedChecklist) => {
        // ... (existing save logic)
    };

    const recentCompleted = safetyChecklists.slice().sort((a,b) => b.completedAt - a.completedAt).slice(0, 5);

    if (activeChecklist) {
        return (
            <Card title="Live Safety Checklist" titleIcon={ListChecks}>
                <LiveChecklist
                    template={activeChecklist}
                    onComplete={handleSaveChecklist}
                    onBack={() => setActiveChecklist(null)}
                    equipment={equipment}
                />
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card title="Start a New Safety Checklist" titleIcon={Plus}>
                    <div className="space-y-4">
                        {SAFETY_TEMPLATES.map(template => (
                            <div key={template.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-lg">{template.name}</h4>
                                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                <Button onClick={() => setActiveChecklist(template)}>Start This Checklist</Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div>
                <Card title="Recently Completed Checklists" titleIcon={ShieldCheck}>
                    <ul className="space-y-3">
                        {recentCompleted.map(chk => (
                            <li key={chk.id} className="p-3 border rounded-lg bg-gray-50">
                                <p className="font-semibold">{chk.templateName}</p>
                                <p className="text-xs text-gray-500">Completed by {chk.completedBy} on {chk.completedAt?.toDate().toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Safety;
