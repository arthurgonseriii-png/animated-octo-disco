import React, { useState, useMemo } from 'react';
import Card from './Card';
import { FileText } from 'lucide-react';
import { GeoMapIcon, EquipmentIcon } from './Icon';
import Button from './Button'; // Import Button

const EquipmentMap = ({ projects = [], files = [], equipment = [], onViewEquipment }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentFloor, setCurrentFloor] = useState('L1-GROUND');

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    // ... (existing getCoords function)

    return (
        <Card title="Interactive Geo-Map - Vistra Unit 1" titleIcon={GeoMapIcon}>
            {/* ... (existing map and SVG code) */}

            <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Details for {currentFloor}</h3>
                {selectedItem ? (
                    <div className="p-4 border rounded-lg bg-white shadow-lg space-y-3">
                        {selectedItem.tagNumber ? ( // It's an Equipment
                            <>
                                <div className="flex items-center space-x-3">
                                    <EquipmentIcon className="text-amber-500" />
                                    <h4 className="font-bold text-lg">{selectedItem.tagNumber}</h4>
                                </div>
                                <p className="text-gray-700">{selectedItem.name}</p>
                                <p><span className="font-semibold">Status:</span> {selectedItem.status}</p>
                                <Button onClick={() => onViewEquipment(selectedItem)} className="w-full mt-2">
                                    View Full Details
                                </Button>
                            </>
                        ) : ( // It's a File
                            <>
                                <div className="flex items-center space-x-3">
                                    <FileText className="text-emerald-500" />
                                    <h4 className="font-bold text-lg">{selectedItem.name}</h4>
                                </div>
                                <p><span className="font-semibold">Type:</span> {selectedItem.type}</p>
                                <p><span className="font-semibold">Tags:</span> {selectedItem.tags.join(', ')}</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-4 border rounded-lg bg-gray-50 text-center">
                        <p className="text-gray-500">Click on an item on the map to see its details here.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default EquipmentMap;
