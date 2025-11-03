import React, { useState, useMemo } from 'react';
import { ListChecks, AlertTriangle, Check, X, ChevronRight } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';

import Card from './Card';
import Button from './Button';
import { FLOORS, APP_ID } from '../constants';

const Verification = ({ files = [], user, db, setPage }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [updatedFloor, setUpdatedFloor] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const unverifiedFiles = useMemo(() => files.filter(f => f.status === 'unverified'), [files]);

    const handleSelectFile = (file) => {
        setSelectedFile(file);
        setUpdatedFloor(file.floor || 'Unknown');
    };

    const handleVerification = async () => {
        if (!selectedFile || !updatedFloor) return;
        setIsSaving(true);
        try {
            const fileRef = doc(db, `artifacts/${APP_ID}/public/data/files`, selectedFile.id);
            const userProfileRef = doc(db, `artifacts/${APP_ID}/users/${user.uid}/user_data/profile`);

            await updateDoc(fileRef, {
                status: 'verified',
                floor: updatedFloor,
                verifiedByUid: user.uid,
                verifiedByName: user.name,
            });

            await updateDoc(userProfileRef, {
                verificationPoints: increment(1)
            });

            setSelectedFile(null);
            setUpdatedFloor('');

        } catch (error) {
            console.error("Error during verification:", error);
            alert("Failed to save verification.");
        }
        setIsSaving(false);
    };

    if (user.role !== 'MasterAdmin' && user.role !== 'Admin') {
        return <Card title="Access Denied" titleIcon={AlertTriangle}><p className="text-red-500">You do not have permission to access this page.</p></Card>;
    }

    return (
        <Card title="AI Analysis Verification Hub" titleIcon={ListChecks}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="font-semibold mb-2">Files to Verify ({unverifiedFiles.length})</h3>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto border rounded-lg p-2 bg-gray-50">
                        {unverifiedFiles.map(file => (
                            <div
                                key={file.id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedFile?.id === file.id ? 'bg-blue-200 shadow' : 'hover:bg-blue-50'}`}
                                onClick={() => handleSelectFile(file)}
                            >
                                <p className="font-semibold text-sm">{file.name}</p>
                                <p className="text-xs text-gray-500">{new Date(file.created?.toDate()).toLocaleString()}</p>
                            </div>
                        ))}
                         {unverifiedFiles.length === 0 && <p className="text-center text-gray-500 italic py-4">No files are pending verification.</p>}
                    </div>
                </div>
                <div className="md:col-span-2">
                    {selectedFile ? (
                        <div className="space-y-4">
                             <div className="relative">
                                <img src={selectedFile.previewUrl || selectedFile.url} alt="Analysis subject" className="rounded-lg shadow-md w-full" />
                                {/* Overlay for detected objects - simplified */}
                                {selectedFile.detectedObjects?.map((obj, i) => (
                                    <div key={i} className="absolute border-2 border-green-400" style={{
                                        left: `${obj.boundingPoly.normalizedVertices[0].x * 100}%`,
                                        top: `${obj.boundingPoly.normalizedVertices[0].y * 100}%`,
                                        width: `${(obj.boundingPoly.normalizedVertices[1].x - obj.boundingPoly.normalizedVertices[0].x) * 100}%`,
                                        height: `${(obj.boundingPoly.normalizedVertices[2].y - obj.boundingPoly.normalizedVertices[0].y) * 100}%`
                                    }}>
                                        <span className="bg-green-400 text-white text-xs p-1">{obj.name}</span>
                                    </div>
                                ))}
                            </div>

                            <Card title="AI Detected Information">
                                <p><strong>Object Guess:</strong> {selectedFile.detectedObjects?.[0]?.name || 'N/A'}</p>
                                <p><strong>AI Tags:</strong> {selectedFile.tags?.join(', ')}</p>
                                <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-2 max-h-32 overflow-y-auto"><strong>Detected Text:</strong> {selectedFile.detectedText}</p>
                            </Card>

                            <Card title="Human Verification">
                                <div className="space-y-3">
                                    <label htmlFor="floor-select" className="block text-sm font-medium text-gray-700">Confirm or Correct Floor Level:</label>
                                    <select
                                        id="floor-select"
                                        value={updatedFloor}
                                        onChange={(e) => setUpdatedFloor(e.target.value)}
                                        className="w-full py-2 px-3 rounded-lg font-semibold text-white bg-blue-600 shadow-md border-0 focus:ring-2 focus:ring-blue-300"
                                    >
                                        {FLOORS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <div className="flex justify-end pt-4 space-x-3">
                                        <Button onClick={() => setSelectedFile(null)} className="bg-gray-200 text-gray-700 hover:bg-gray-300"><X size={18} className="mr-1"/> Skip</Button>
                                        <Button onClick={handleVerification} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                                            {isSaving ? 'Saving...' : <><Check size={18} className="mr-1"/> Confirm & Award Point</>}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                            <div className="text-center text-gray-500">
                                <ChevronRight size={48} className="mx-auto" />
                                <p className="mt-2 font-semibold">Select a file from the left to begin verification.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
