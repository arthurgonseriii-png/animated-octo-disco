import React, { useState } from 'react';
import Card from './Card';
import { MapPin, FileText } from 'lucide-react';

const EquipmentMap = ({ projects = [], files = [] }) => {
    const [activeZone, setActiveZone] = useState(null);
    const [nearbyFiles, setNearbyFiles] = useState([]);
    const [currentFloor, setCurrentFloor] = useState('L4-C1');

    // Floor data from your photo
    const floors = ['L1-GROUND', 'L3-B1', 'L4-C1', 'L5-D1', 'Mezz', 'L7-E3', 'L8-G1', 'L9-H1'];

    // Simplified zone coordinates for demonstration
    const zones = {
        'L1-GROUND': { 'GROUND_FLOOR_ACCESS': { x: 50, y: 50, w: 700, h: 350 } },
        'Mezz': { 'CONTROL_ROOM': { x: 400, y: 50, w: 150, h: 100 }, 'DCS_CABINETS': { x: 400, y: 180, w: 150, h: 220 } },
        'L4-C1': { 'TURBINE_HALL': { x: 50, y: 50, w: 300, h: 350 } },
        'L9-H1': { 'SWITCHYARD_ACCESS': { x: 600, y: 50, w: 150, h: 350 } }
    };

    // Filter zones based on the selected floor
    const currentZones = zones[currentFloor] || {};

    const handleZoneClick = (zoneId) => {
        setActiveZone(zoneId);
        // Find files that match the *clicked floor*
        const filesInZone = files.filter(file => file.floor === currentFloor);
        setNearbyFiles(filesInZone);
    };

    return (
        <Card title="Interactive Geo-Map - Vistra Unit 1" titleIcon={MapPin}>
            <div className="flex items-center space-x-2 mb-4 bg-gray-100 p-2 rounded-lg">
                <label htmlFor="floor-select" className="text-sm font-medium text-gray-700">Select Floor:</label>
                <select
                    id="floor-select"
                    value={currentFloor}
                    onChange={(e) => { setCurrentFloor(e.target.value); setActiveZone(null); setNearbyFiles([]); }}
                    className="py-2 px-3 rounded-lg font-semibold text-white bg-blue-600 shadow-md border-0 focus:ring-2 focus:ring-blue-300"
                >
                    {floors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg p-2 border border-gray-600 relative shadow-inner">
                        <svg viewBox="0 0 800 450" className="w-full h-full bg-cover bg-center rounded" style={{backgroundImage: `url('https://i.imgur.com/8X1a2kZ.jpeg')`}}>
                            {Object.entries(currentZones).map(([id, {x, y, w, h}]) => (
                                <g key={id} className="cursor-pointer transition-all duration-300 group" onClick={() => handleZoneClick(id)}>
                                    <rect {...{x, y, width: w, height: h}} fill={activeZone === id ? "rgba(139, 92, 246, 0.6)" : "rgba(196, 181, 253, 0.4)"} stroke="#6d28d9" strokeWidth="3" />
                                    <text x={x + w/2} y={y + h/2} textAnchor="middle" fontWeight="bold" fill="#ffffff" className="pointer-events-none text-xl drop-shadow-lg group-hover:scale-105 transition-transform">{id.replace('_', ' ')}</text>
                                </g>
                            ))}
                        </svg>
                </div>
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Search Results for {currentFloor}</h3>
                    {activeZone ? <p className="text-sm text-gray-600 mb-4">Showing files in <strong>{activeZone.replace('_', ' ')}</strong>.</p> : <p className="text-sm text-gray-500 mb-4">Click a map zone.</p>}
                    <div className="space-y-2 max-h-[34rem] overflow-y-auto pr-2">
                        {nearbyFiles.length > 0 ? nearbyFiles.map(file => (
                            <div key={file.id} className="p-3 border rounded-lg bg-green-50 flex items-center space-x-3 hover:shadow-md hover:border-green-300 transition-all">
                                <FileText size={20} className="text-green-600"/>
                                <div>
                                    <div className="font-semibold text-sm">{file.name}</div>
                                    <div className="text-xs text-gray-500">Tags: {file.tags.join(', ')}</div>
                                </div>
                            </div>
                        )) : activeZone && <div className="text-center py-10"><MapPin size={32} className="mx-auto text-gray-400"/><p className="text-sm text-gray-500 italic mt-2">No files found.</p></div>}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default EquipmentMap;
