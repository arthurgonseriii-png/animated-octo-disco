import React, { useState, useMemo } from 'react';
import { Search, File, HardHat } from 'lucide-react';

const UniversalSearch = ({ equipment = [], files = [], setPage, onViewEquipment }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];

        const lowerCaseTerm = searchTerm.toLowerCase();

        const equipmentResults = equipment
            .filter(e => e.name.toLowerCase().includes(lowerCaseTerm) || e.tagNumber.toLowerCase().includes(lowerCaseTerm))
            .map(e => ({ ...e, type: 'Equipment' }));

        const fileResults = files
            .filter(f => f.name.toLowerCase().includes(lowerCaseTerm) || (f.tags && f.tags.join(' ').toLowerCase().includes(lowerCaseTerm)))
            .map(f => ({ ...f, type: 'File' }));

        return [...equipmentResults, ...fileResults].slice(0, 10); // Limit to 10 results
    }, [searchTerm, equipment, files]);

    const handleResultClick = (result) => {
        if (result.type === 'Equipment') {
            onViewEquipment(result);
        }
        // Can be extended to handle file clicks, e.g., opening a file viewer
        setSearchTerm('');
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="flex items-center">
                <Search className="absolute left-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by tag, name, or document..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    <ul>
                        {searchResults.length > 0 ? (
                            searchResults.map(item => (
                                <li
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => handleResultClick(item)}
                                    className="p-3 flex items-center space-x-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                >
                                    {item.type === 'Equipment' ? <HardHat className="text-amber-500" /> : <File className="text-emerald-500" />}
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.type === 'Equipment' ? `Tag: ${item.tagNumber}` : `Type: ${item.type}`}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-3 text-center text-gray-500">No results found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UniversalSearch;
