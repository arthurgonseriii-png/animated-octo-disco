import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import Modal from './Modal'; // Import Modal
import { CheckCircle, XCircle, AlertTriangle, Edit } from 'lucide-react';
import { APP_ID } from '../constants';

const CorrectionForm = ({ file, equipment, onSave, onCancel }) => {
    const [correctTag, setCorrectTag] = useState('');

    const handleSubmit = () => {
        onSave(file, correctTag);
    };

    return (
        <div className="space-y-4">
            <p>The AI suggested the tag was <strong>{file.aiTags[0]}</strong>. Please select the correct equipment tag from the list below.</p>
            <select value={correctTag} onChange={(e) => setCorrectTag(e.target.value)} className="w-full p-2 border rounded">
                <option value="">Select correct equipment</option>
                {equipment.map(e => <option key={e.id} value={e.tagNumber}>{e.tagNumber} - {e.name}</option>)}
            </select>
            <div className="flex justify-end space-x-2">
                <Button onClick={onCancel} className="bg-gray-500">Cancel</Button>
                <Button onClick={handleSubmit} disabled={!correctTag}>Save Correction</Button>
            </div>
        </div>
    );
};


const Verification = ({ user, db, equipment }) => {
    const [unverifiedFiles, setUnverifiedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCorrecting, setIsCorrecting] = useState(false);

    // ... (useEffect to fetch data)

    const handleVerification = async (file, isCorrect) => {
        // ... (existing verification logic)
    };

    const handleCorrection = async (file, correctTag) => {
        if (!db) return;

        try {
            const batch = writeBatch(db);
            const fileRef = doc(db, `artifacts/${APP_ID}/public/data/files`, file.id);

            // 1. Update file status and tags
            batch.update(fileRef, {
                status: 'verified',
                tags: [correctTag, ...file.tags.slice(1)], // Replace AI tag with correct one
                aiTags: file.aiTags, // Keep original AI tags for records
                correctedByUser: true,
            });

            // 2. Update the correct equipment's location
            const equipmentItem = equipment.find(e => e.tagNumber === correctTag);
            if (equipmentItem && file.lat && file.lng) {
                const equipRef = doc(db, `artifacts/${APP_ID}/public/data/equipment`, equipmentItem.id);
                batch.update(equipRef, { lat: file.lat, lng: file.lng, floor: file.floor });
            }

            await batch.commit();
            alert(`Correction saved! Equipment data for ${correctTag} has been updated.`);

            setIsCorrecting(false);
            moveToNextFile(file.id);

        } catch (error) {
            console.error("Error saving correction:", error);
        }
    };

    const moveToNextFile = (currentId) => {
        const nextIndex = unverifiedFiles.findIndex(f => f.id === currentId) + 1;
        setSelectedFile(unverifiedFiles[nextIndex] || null);
        setUnverifiedFiles(unverifiedFiles.filter(f => f.id !== currentId));
    };


    if (isLoading) {
        // ...
    }

    return (
        <Card title={`AI Verification Hub (${unverifiedFiles.length} items remaining)`} titleIcon={CheckCircle}>
            {/* ... (existing empty state) */}

            {selectedFile && !isCorrecting && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* ... (existing sighting details) */}

                    <div className="mt-6 flex justify-center space-x-4">
                        <Button onClick={() => handleVerification(selectedFile, false)} className="bg-red-600 w-1/3">
                            <XCircle size={18} className="mr-2"/> Incorrect
                        </Button>
                        <Button onClick={() => setIsCorrecting(true)} className="bg-yellow-500 w-1/3">
                            <Edit size={18} className="mr-2"/> Correct
                        </Button>
                        <Button onClick={() => handleVerification(selectedFile, true)} className="bg-green-600 w-1/3">
                            <CheckCircle size={18} className="mr-2"/> Correct
                        </Button>
                    </div>
                </div>
            )}

            {isCorrecting && selectedFile && (
                <Modal isOpen={isCorrecting} onClose={() => setIsCorrecting(false)} title="Correct AI Suggestion">
                    <CorrectionForm
                        file={selectedFile}
                        equipment={equipment}
                        onSave={handleCorrection}
                        onCancel={() => setIsCorrecting(false)}
                    />
                </Modal>
            )}
        </Card>
    );
};

export default Verification;
