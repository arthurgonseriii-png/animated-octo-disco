import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder = '', className = '', name, required }) => (
    <div className="space-y-1.5">
        {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>}
        <input 
            type={type} 
            id={name}
            name={name}
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            required={required}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow ${className}`} 
        />
    </div>
);

export default Input;