import React from 'react';
import Card from './Card';
import { EquipmentIcon } from './Icon';
import { ArrowLeft, ShieldCheck, ListChecks } from 'lucide-react';
import Button from './Button';

const EquipmentDetail = ({ equipment, lotoPermits, safetyChecklists, onBack }) => {
    if (!equipment) {
        // ... (existing not found code)
    }

    const relevantLotos = lotoPermits.filter(l => l.equipmentTag === equipment.tagNumber);
    const relevantChecklists = safetyChecklists.filter(c => c.equipmentTag === equipment.tagNumber);

    return (
        <div className="space-y-6">
            {/* ... (existing header and details) */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="LOTO History" titleIcon={ShieldCheck}>
                    {relevantLotos.length > 0 ? (
                        <ul className="space-y-3">
                            {relevantLotos.map(loto => (
                                <li key={loto.id} className="p-3 border rounded-lg bg-gray-50">
                                    <p className="font-semibold">{loto.description}</p>
                                    <p className="text-xs text-gray-500">
                                        Status: {loto.status} | By: {loto.createdBy} on {loto.created?.toDate().toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 italic p-8">No LOTO permit history for this equipment.</p>
                    )}
                </Card>
                 <Card title="Safety Checklist History" titleIcon={ListChecks}>
                    {relevantChecklists.length > 0 ? (
                         <ul className="space-y-3">
                            {relevantChecklists.map(chk => (
                                <li key={chk.id} className="p-3 border rounded-lg bg-gray-50">
                                    <p className="font-semibold">{chk.templateName}</p>
                                    <p className="text-xs text-gray-500">
                                        By: {chk.completedBy} on {chk.completedAt?.toDate().toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 italic p-8">No completed safety checklists for this equipment.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EquipmentDetail;
