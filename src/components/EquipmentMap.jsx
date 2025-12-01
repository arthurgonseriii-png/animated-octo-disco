import React, { useState, useMemo } from 'react';
import Card from './Card';
import { FileText } from 'lucide-react';
import { GeoMapIcon, EquipmentIcon } from './Icon';
import Button from './Button';
import { MAP_DATA, FLOORS } from '../constants';

const EquipmentMap = ({ equipment = [], onViewEquipment }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentFloor, setCurrentFloor] = useState('L1-GROUND');

    const floorEquipment = useMemo(() => {
        const positions = MAP_DATA[currentFloor] || [];
        return positions.map(pos => {
            const equip = equipment.find(e => e.id === pos.id);
            return { ...equip, ...pos };
        });
    }, [currentFloor, equipment]);

    return (
        <Card title="Interactive Geo-Map - Vistra Unit 1" titleIcon={GeoMapIcon}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="mb-4 flex space-x-2">
                        {FLOORS.map(floor => (
                            <Button
                                key={floor}
                                onClick={() => setCurrentFloor(floor)}
                                className={currentFloor === floor ? 'bg-blue-600 text-white' : ''}
                            >
                                {floor}
                            </Button>
                        ))}
                    </div>
                    <div className="relative border rounded-lg bg-gray-50 h-[600px] overflow-hidden">
                        {/* A simple SVG floor plan */}
                        <svg width="100%" height="100%" viewBox="0 0 800 600">
                            <rect width="800" height="600" fill="#f9fafb" />
                            <text x="10" y="20" className="font-bold text-gray-400">{currentFloor} Layout</text>

                            {/* Render equipment on the map */}
                            {floorEquipment.map(item => (
                                <g
                                    key={item.id}
                                    transform={`translate(${item.x}, ${item.y})`}
                                    onClick={() => setSelectedItem(item)}
                                    className="cursor-pointer"
                                >
                                    <circle r="12" fill={selectedItem?.id === item.id ? '#ef4444' : '#fb923c'} />
                                    <text y="25" textAnchor="middle" className="text-xs font-semibold fill-current text-gray-700">{item.tagNumber}</text>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Details for {currentFloor}</h3>
                    {selectedItem ? (
                        <div className="p-4 border rounded-lg bg-white shadow-lg space-y-3">
                            <div className="flex items-center space-x-3">
                                <EquipmentIcon className="text-amber-500" />
                                <h4 className="font-bold text-lg">{selectedItem.tagNumber}</h4>
                            </div>
                            <p className="text-gray-700">{selectedItem.name}</p>
                            <p><span className="font-semibold">Status:</span> {selectedItem.status}</p>
                            <Button onClick={() => onViewEquipment(selectedItem)} className="w-full mt-2">
                                View Full Details
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 border rounded-lg bg-gray-50 text-center">
                            <p className="text-gray-500">Click on an item on the map to see its details here.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default EquipmentMap;
