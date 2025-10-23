import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { Camera, ImageIcon, Download, AlertTriangle } from 'lucide-react';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('A photo of a newly terminated motor control cabinet, clean and organized');
    const [imageUrl, setImageUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const generateImage = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setImageUrl(null);
        setError(null);
        try {
            const apiKey = ""; // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
            const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };

            let response;
            let attempts = 0;
            const maxAttempts = 3;
            let delay = 1000;

            while (attempts < maxAttempts) {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) break;
                if (response.status !== 429 && response.status < 500) break;

                attempts++;
                if (attempts >= maxAttempts) break;

                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
                setImageUrl(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
            } else {
                 console.error("Image generation failed:", result);
                 setError("Image generation failed. Check console for details.");
            }
        } catch (error) {
            console.error("Error calling image generation API:", error);
            setError(`Error generating image: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card title="AI Image Generator for Documentation" titleIcon={Camera}>
            <p className="text-gray-600 mb-6">Generate visual examples for work procedures, safety standards, or documentation.</p>
            <div className="space-y-4">
                <Input
                    label="Describe the image you need:"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A perfectly dressed cable tray in Unit 1, showing proper spacing and labeling"
                />
                <Button onClick={generateImage} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Generating Image...
                        </>
                    ) : (
                        <><ImageIcon size={18} className="mr-2"/>Generate Image</>
                    )}
                </Button>
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2"><AlertTriangle size={18}/><span>{error}</span></div>}

                {imageUrl && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">Generated Image:</h3>
                        <img src={imageUrl} alt="AI Generated Documentation Example" className="rounded-lg shadow-md w-full border border-gray-200"/>
                         <Button onClick={() => navigator.clipboard.writeText(imageUrl)} className="w-auto mt-4 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-none">
                            <Download size={16} className="mr-2"/> Copy Image Data URL (Simulated Download)
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ImageGenerator;
