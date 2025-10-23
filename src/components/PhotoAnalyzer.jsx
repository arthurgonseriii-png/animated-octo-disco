import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import LoadingSpinner from './LoadingSpinner';
import { BrainCircuit, Check } from 'lucide-react';
import { APP_ID } from '../constants';

const PhotoAnalyzer = ({ onAnalysisComplete, setPage, db, user }) => {
    const [files, setFiles] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState([]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
            setAnalysisResults([]);
        } else {
            setFiles([]);
        }
    };

    const handleAnalyze = () => {
        if (files.length === 0) return;
        setIsAnalyzing(true);
        console.log(`Simulating AI Analysis of ${files.length} files...`);

        // Simulate AI analysis for each file
        const newResults = files.map((file, index) => {
            // Simulate a delay for each analysis
            return new Promise(resolve => {
                setTimeout(() => {
                    const mockAnalysis = {
                        id: `file_${Date.now()}_${index}`,
                        file,
                        lat: 31.81055 + (Math.random() - 0.5) * 0.0002,
                        lng: -94.46015 + (Math.random() - 0.5) * 0.0002,
                        tags: ['AI-Detected', 'FCV-' + Math.floor(100 + Math.random() * 10), 'Unit 1'],
                        name: `AI_Analysis_${file.name.split('.')[0]}.jpg`,
                        floor: ['Mezz', 'L4-C1', 'L9-H1'][Math.floor(Math.random() * 3)],
                        previewUrl: URL.createObjectURL(file)
                    };
                    resolve(mockAnalysis);
                }, 1000 * (index + 1)); // Stagger the "analysis"
            });
        });

        Promise.all(newResults).then(results => {
            setAnalysisResults(results);
            setIsAnalyzing(false);
            console.log("Simulated Analysis Complete:", results);
        });
    };

    const handleSaveAll = async () => {
        if (analysisResults.length === 0 || !db || !user) return;

        console.log("Batch saving analyzed files...");
        try {
            const filesCollection = collection(db, `artifacts/${APP_ID}/public/data/files`);
            for (const result of analysisResults) {
                const { file, previewUrl, ...fileData } = result; // Exclude local-only data
                await addDoc(filesCollection, {
                    ...fileData,
                    type: file.type,
                    // In a real app, 'url' would come from Firebase Storage upload
                    url: 'https://placehold.co/100x70/000/FFF?text=Uploaded',
                    createdByUid: user.uid,
                    createdByName: user.name,
                    created: serverTimestamp(),
                });
            }

            setFiles([]);
            setAnalysisResults([]);
            alert(`${analysisResults.length} files analyzed and saved with geo-tags!`);
            setPage('EquipmentMap');
        } catch(e) {
            console.error("Error saving analyzed files:", e);
            alert("Failed to save file data. Check console.");
        }
    };

    return (
        <Card title="AI Photo Upload & Analysis" titleIcon={BrainCircuit}>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Photo Folder/Batch</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple // Allow multiple file selection
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {files.length > 0 && !isAnalyzing && analysisResults.length === 0 && (
                    <Button onClick={handleAnalyze} className="w-full">
                       <><BrainCircuit size={18} className="mr-2"/> Analyze {files.length} Photo(s) with AI</>
                    </Button>
                )}

                {isAnalyzing && <LoadingSpinner text={`Analyzing ${files.length} images...`} />}

                {analysisResults.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Analysis Complete</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {analysisResults.map((result, index) => (
                                <div key={result.id} className="p-4 border rounded-lg bg-gray-50 flex items-start space-x-4">
                                    <img src={result.previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow-md" />
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            label={`File ${index + 1} Name`}
                                            value={result.name}
                                            onChange={(e) => {
                                                const newResults = [...analysisResults];
                                                newResults[index].name = e.target.value;
                                                setAnalysisResults(newResults);
                                            }}
                                        />
                                        <p className="text-xs text-gray-600">
                                            <strong>Geo-Tag:</strong> {result.lat.toFixed(4)}, {result.lng.toFixed(4)} |
                                            <strong> Floor:</strong> {result.floor} |
                                            <strong> Tags:</strong> {result.tags.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button onClick={() => { setFiles([]); setAnalysisResults([]); }} className="w-auto bg-gray-500">Cancel</Button>
                            <Button onClick={handleSaveAll} className="w-auto bg-green-600"><Check size={18} className="mr-1"/> Confirm & Save All</Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PhotoAnalyzer;
