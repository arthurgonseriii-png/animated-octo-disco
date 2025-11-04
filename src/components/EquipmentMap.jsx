import React, { useState, useMemo } from 'react';
import Card from './Card';
import { FileText } from 'lucide-react';
import { GeoMapIcon, EquipmentIcon } from './Icon';

const EquipmentMap = ({ projects = [], files = [], equipment = [] }) => {
    const [activeZone, setActiveZone] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentFloor, setCurrentFloor] = useState('L4-C1');

    const floors = ['L1-GROUND', 'L3-B1', 'L4-C1', 'L5-D1', 'Mezz', 'L7-E3', 'L8-G1', 'L9-H1'];

    const zones = {
        'L1-GROUND': { 'GROUND_FLOOR_ACCESS': { x: 50, y: 50, w: 700, h: 350 } },
        'Mezz': { 'CONTROL_ROOM': { x: 400, y: 50, w: 150, h: 100 }, 'DCS_CABINETS': { x: 400, y: 180, w: 150, h: 220 } },
        'L4-C1': { 'TURBINE_HALL': { x: 50, y: 50, w: 300, h: 350 } },
        'L9-H1': { 'SWITCHYARD_ACCESS': { x: 600, y: 50, w: 150, h: 350 } }
    };

    const currentZones = zones[currentFloor] || {};

    const itemsOnCurrentFloor = useMemo(() => {
        const eq = equipment.filter(e => e.floor === currentFloor && e.lat && e.lng);
        const fl = files.filter(f => f.floor === currentFloor && f.lat && f.lng);
        return [...eq, ...fl];
    }, [equipment, files, currentFloor]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    // Very simplified lat/lng to SVG coordinate conversion
    const getCoords = (lat, lng) => {
        // These bounds are just for this specific map image and would need to be calibrated
        const latMin = 31.8105, latMax = 31.8115, lngMin = -94.4602, lngMax = -94.4580;
        const x = ((lng - lngMin) / (lngMax - lngMin)) * 800;
        const y = ((latMax - lat) / (latMax - latMin)) * 450;
        return { x, y };
    }

    return (
        <Card title="Interactive Geo-Map - Vistra Unit 1" titleIcon={GeoMapIcon}>
            <div className="flex items-center space-x-2 mb-4 bg-gray-100 p-2 rounded-lg">
                <label htmlFor="floor-select" className="text-sm font-medium text-gray-700">Select Floor:</label>
                <select
                    id="floor-select"
                    value={currentFloor}
                    onChange={(e) => { setCurrentFloor(e.target.value); setSelectedItem(null); }}
                    className="py-2 px-3 rounded-lg font-semibold text-white bg-blue-600 shadow-md border-0 focus:ring-2 focus:ring-blue-300"
                >
                    {floors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg p-2 border border-gray-600 relative shadow-inner">
                    <svg viewBox="0 0 800 450" className="w-full h-full bg-cover bg-center rounded" style={{backgroundImage: `url('https://i.imgur.com/8X1a2kZ.jpeg')`}}>
                        {/* Zone Rectangles */}
                        {Object.entries(currentZones).map(([id, {x, y, w, h}]) => (
                            <g key={id} className="cursor-pointer transition-all duration-300 group">
                                <rect {...{x, y, width: w, height: h}} fill="rgba(196, 181, 253, 0.2)" stroke="#6d28d9" strokeWidth="1" />
                                <text x={x + w/2} y={y + 20} textAnchor="middle" fontWeight="bold" fill="#ffffff" className="pointer-events-none text-lg drop-shadow-lg">{id.replace('_', ' ')}</text>
                            </g>
                        ))}

                        {/* Equipment and File Markers */}
                        {itemsOnCurrentFloor.map(item => {
                            const { x, y } = getCoords(item.lat, item.lng);
                            const isEquipment = !!item.tagNumber; // Duck typing to check if it's equipment
                            const color = isEquipment ? '#f59e0b' : '#10b981';

                            return (
                                <g key={item.id} transform={`translate(${x}, ${y})`} className="cursor-pointer group" onClick={() => handleItemClick(item)}>
                                    <circle cx="0" cy="0" r="12" fill={color} fillOpacity="0.3" />
                                    <circle cx="0" cy="0" r="6" fill={color} stroke="#ffffff" strokeWidth="2" />
                                    <title>{isEquipment ? `${item.tagNumber}: ${item.name}` : item.name}</title>
                                </g>
                            )
                        })}
                    </svg>
                </div>
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
                                    <p><span className="font-semibold">Location:</span> {selectedItem.location}</p>
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
                        <div className="text-center py-10"><GeoMapIcon size={32} className="mx-auto text-gray-400"/><p className="text-sm text-gray-500 italic mt-2">Click an item on the map for details.</p></div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default EquipmentMap;
