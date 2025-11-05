import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { UploadCloud, Box } from 'lucide-react';

const LidarUpload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setIsUploading(true);
        // Simulate upload process
        setTimeout(() => {
            setIsUploading(false);
            alert(`File "${file.name}" uploaded successfully! 3D processing will begin shortly.`);
            setFile(null);
        }, 2000);
    };

    return (
        <Card title="Lidar 3D Scan Upload & Processing" titleIcon={Box}>
            <div className="space-y-6">
                <p className="text-gray-600">
                    This module is for uploading 3D scan data from Lidar-equipped devices. Once uploaded, the data will be processed to create a high-fidelity, interactive 3D model of the plant.
                </p>

                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <input type="file" accept=".las, .laz, .e57, .obj" onChange={handleFileChange} className="hidden" id="lidar-upload" />
                    <label htmlFor="lidar-upload" className="cursor-pointer">
                        <UploadCloud className="mx-auto text-gray-400" size={48} />
                        <p className="mt-2 text-lg text-gray-700 font-semibold">
                            {file ? `Selected: ${file.name}` : 'Click to select Lidar scan file'}
                        </p>
                        <p className="text-xs text-gray-500">Supported formats: .LAS, .LAZ, .E57, .OBJ</p>
                    </label>
                </div>

                {file && (
                    <div className="flex justify-center">
                        <Button onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? 'Uploading...' : `Upload ${file.name}`}
                        </Button>
                    </div>
                )}

                <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800">
                    <h4 className="font-bold">Feature Under Development</h4>
                    <p className="text-sm">
                        The 3D model viewer and interactive toolset are coming soon. Uploaded scans will be queued for processing once the feature is fully released.
                    </p>
                </div>

                <div className="flex items-center justify-center text-center text-gray-400 bg-gray-100 p-8 rounded-lg h-64">
                    <div>
                        <Box size={40} className="mx-auto" />
                        <p className="mt-2 font-semibold">3D Model Viewer Placeholder</p>
                        <p className="text-sm">Interactive model will be displayed here.</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LidarUpload;
