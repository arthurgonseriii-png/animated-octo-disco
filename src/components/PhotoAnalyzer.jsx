import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// ... (other imports)

const PhotoAnalyzer = ({ onAnalysisComplete, db, user }) => {
    // ... (existing state and functions)

    const createMaintenanceTask = async (analysis, equipmentTag) => {
        if (!db) return;
        try {
            const assignmentsCollection = collection(db, `artifacts/${APP_ID}/public/data/assignments`);
            await addDoc(assignmentsCollection, {
                taskName: `Inspect ${equipmentTag} for ${analysis.conditionReport.notes.join(', ')}`,
                taskTemplateId: 'INSPECTION', // A generic inspection template ID
                projectId: '', // Or try to infer from context
                assignedToUid: user.uid, // Assign to the current user for review
                status: 'To Do',
                notes: `AI detected potential maintenance issue from photo analysis. Keywords: ${analysis.conditionReport.notes.join(', ')}.`,
                created: serverTimestamp(),
            });
            alert('A new maintenance task has been automatically created in the "To Do" list.');
        } catch (error) {
            console.error("Error creating maintenance task:", error);
        }
    };

    const handleUseData = (analysisResult) => {
        // Try to find an equipment tag from the detected text
        const detectedTag = analysisResult.textAnnotations?.[0]?.description.match(/[A-Z]+-\d+/);

        if (analysisResult.conditionReport.condition === 'Maintenance Required' && detectedTag) {
            createMaintenanceTask(analysisResult, detectedTag[0]);
        }
        onAnalysisComplete(analysisResult);
    };

    // ... (existing analysis logic and UI)

    return (
        <Card title="AI Photo Analyzer" titleIcon={AiAnalyzerIcon}>
            {/* ... (existing UI) */}

            {analysisResult && (
                <div className="space-y-4 pt-4 border-t">
                    {/* ... (existing results) */}
                    <Button onClick={() => handleUseData(analysisResult)} className="w-full bg-green-600">
                        <Check size={18} className="mr-2"/> Use This AI Data
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default PhotoAnalyzer;
