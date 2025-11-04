import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { Check, UploadCloud, AlertTriangle } from 'lucide-react';
import { AiAnalyzerIcon } from './Icon';

const PhotoAnalyzer = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);
    const imageRef = useRef(null);

    const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setAnalysisResult(null);
            setError(null);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const base64Image = await getBase64(file);
            const requestBody = {
                requests: [
                    {
                        image: { content: base64Image },
                        features: [
                            { type: 'TEXT_DETECTION' },
                            { type: 'LABEL_DETECTION', maxResults: 10 },
                            { type: 'OBJECT_LOCALIZATION', maxResults: 5 }
                        ],
                    },
                ],
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'API request failed');
            }

            const data = await response.json();
            const result = data.responses[0];
            setAnalysisResult(result);

        } catch (err) {
            setError(`Analysis Failed: ${err.message}. Ensure the Google Cloud Vision API key is correct and the API is enabled.`);
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderOverlays = () => {
        if (!analysisResult || !imageRef.current) return null;
        const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imageRef.current;
        const widthScale = clientWidth / naturalWidth;
        const heightScale = clientHeight / naturalHeight;

        const objectBoxes = analysisResult.localizedObjectAnnotations?.map((obj, i) => {
            const vertices = obj.boundingPoly.normalizedVertices;
            const x1 = vertices[0].x * clientWidth;
            const y1 = vertices[0].y * clientHeight;
            const width = (vertices[1].x - vertices[0].x) * clientWidth;
            const height = (vertices[2].y - vertices[0].y) * clientHeight;

            return (
                <div key={`obj-${i}`} style={{ position: 'absolute', border: '2px solid #f59e0b', left: x1, top: y1, width, height }}>
                    <span className="bg-amber-500 text-white text-xs font-bold p-1 absolute -top-5 left-0">{obj.name} ({Math.round(obj.score * 100)}%)</span>
                </div>
            )
        }) || [];

        const textBlocks = analysisResult.textAnnotations?.slice(1).map((text, i) => { // slice(1) to skip the full text block
            const vertices = text.boundingPoly.vertices;
            const x = vertices[0].x * widthScale;
            const y = vertices[0].y * heightScale;
            const width = (vertices[1].x - vertices[0].x) * widthScale;
            const height = (vertices[2].y - vertices[0].y) * heightScale;

             return (
                <div key={`text-${i}`} style={{ position: 'absolute', border: '1px dotted #10b981', left: x, top: y, width, height, cursor: 'pointer' }} title={text.description}></div>
            )
        }) || [];

        return [...objectBoxes, ...textBlocks];
    }

    return (
        <Card title="AI Photo Analyzer" titleIcon={AiAnalyzerIcon}>
            <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                        <UploadCloud className="mx-auto text-gray-400" size={40} />
                        <p className="mt-2 text-sm text-gray-600">{file ? `Selected: ${file.name}` : 'Click to upload a photo'}</p>
                    </label>
                </div>

                {previewUrl && (
                    <div className="relative w-full max-w-2xl mx-auto">
                        <img ref={imageRef} src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                        {renderOverlays()}
                    </div>
                )}

                {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2"><AlertTriangle size={18} /><span>{error}</span></div>}

                {isAnalyzing && <LoadingSpinner text="Analyzing image with Google Cloud Vision..." />}

                {file && !isAnalyzing && (
                    <Button onClick={handleAnalyze} className="w-full">
                        <AiAnalyzerIcon size={18} className="mr-2"/> Analyze Photo with AI
                    </Button>
                )}

                {analysisResult && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-xl font-bold">AI Analysis Results</h3>
                        <div><strong>Detected Text:</strong><p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">{analysisResult.textAnnotations?.[0]?.description || 'None'}</p></div>
                        <div><strong>Detected Labels:</strong><p className="flex flex-wrap gap-2">{analysisResult.labelAnnotations?.map(label => <span key={label.mid} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{label.description}</span>) || 'None'}</p></div>
                        <Button onClick={() => onAnalysisComplete(analysisResult)} className="w-full bg-green-600"><Check size={18} className="mr-2"/> Use This AI Data</Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PhotoAnalyzer;
