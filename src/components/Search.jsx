import React, { useState } from 'react';
import { Search as SearchIcon, X as XIcon, Sliders } from 'lucide-react';

const Search = ({ onSearch, onFilter, searchPool = [] }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 1) {
            const filteredSuggestions = searchPool
                .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = () => {
        onSearch(query);
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name);
        onSearch(suggestion.name);
        setSuggestions([]);
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        onSearch('');
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for equipment, cables, files..."
                    className="w-full py-3 pl-5 pr-20 rounded-full focus:outline-none"
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                    {query && (
                        <button onClick={clearSearch} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                            <XIcon size={18} />
                        </button>
                    )}
                    <button onClick={onFilter} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                        <Sliders size={20} />
                    </button>
                    <button onClick={handleSearch} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md">
                        <SearchIcon size={20} />
                    </button>
                </div>
            </div>
            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
                    {suggestions.map(item => (
                        <li
                            key={item.id}
                            onClick={() => handleSuggestionClick(item)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
