import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, writeBatch, increment } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
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

    useEffect(() => {
        const fetchUnverified = async () => {
            if (!db) return;
            const q = query(collection(db, `artifacts/${APP_ID}/public/data/files`), where('status', '==', 'unverified'));
            const snapshot = await getDocs(q);
            const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUnverifiedFiles(files);
            setSelectedFile(files[0] || null);
            setIsLoading(false);
        };
        fetchUnverified();
    }, [db]);

    const handleVerification = async (file, isCorrect) => {
        if (!db) return;
        const batch = writeBatch(db);
        const fileRef = doc(db, `artifacts/${APP_ID}/public/data/files`, file.id);
        const userRef = doc(db, 'users', user.uid);

        let newStatus = 'verified';
        if (isCorrect && (user.role === 'Admin' || user.role === 'MasterAdmin' || (file.verifiers && file.verifiers.length > 0))) {
            newStatus = 'confirmed';
        }

        batch.update(fileRef, {
            status: newStatus,
            verifiers: [...(file.verifiers || []), user.uid],
            lastVerifiedBy: user.name,
            lastVerifiedAt: serverTimestamp(),
        });

        if (isCorrect) {
            batch.update(userRef, { verificationPoints: increment(1) });
        }

        await batch.commit();
        moveToNextFile(file.id);
    };

    const handleCorrection = async (file, correctTag) => {
        if (!db) return;
        const batch = writeBatch(db);
        const fileRef = doc(db, `artifacts/${APP_ID}/public/data/files`, file.id);
        const userRef = doc(db, 'users', user.uid);

        batch.update(fileRef, {
            status: 'confirmed', // Corrections are automatically confirmed
            tags: [correctTag, ...file.tags.slice(1)],
            aiTags: file.aiTags,
            correctedByUser: true,
            verifiers: [...(file.verifiers || []), user.uid],
        });

        batch.update(userRef, { verificationPoints: increment(5) }); // More points for a correction

        await batch.commit();
        setIsCorrecting(false);
        moveToNextFile(file.id);
    };

    const moveToNextFile = (currentId) => {
        const nextIndex = unverifiedFiles.findIndex(f => f.id === currentId) + 1;
        setSelectedFile(unverifiedFiles[nextIndex] || null);
        setUnverifiedFiles(unverifiedFiles.filter(f => f.id !== currentId));
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card title={`AI Verification Hub (${unverifiedFiles.length} items remaining)`} titleIcon={CheckCircle}>
            {!selectedFile && (
                <div className="text-center p-8">
                    <CheckCircle size={48} className="mx-auto text-green-500" />
                    <h3 className="mt-2 text-xl font-semibold">All items verified!</h3>
                    <p className="text-gray-500">Check back later for new AI-generated sightings.</p>
                </div>
            )}

            {selectedFile && !isCorrecting && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <h3 className="font-bold text-lg mb-2">AI Sighting</h3>
                        <img src={selectedFile.url} alt="AI Sighting" className="rounded-lg shadow-lg" />
                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-800">
                            <h4 className="font-bold">Unverified Data</h4>
                            <p className="text-sm">This AI-generated data has not been confirmed by a human.</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">AI Analysis</h3>
                        <p><strong>Detected Tag:</strong> {selectedFile.aiTags[0]}</p>
                        <p><strong>Confidence:</strong> {selectedFile.aiConfidence}%</p>
                    </div>

                    <div className="md:col-span-2 mt-6 flex justify-center space-x-4">
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
