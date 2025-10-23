import React from 'react';

const Input = ({ id, label, type = 'text', value, onChange, placeholder = '', className = '' }) => {
    const commonProps = {
        id,
        value,
        onChange,
        placeholder,
        className: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow ${className}`
    };

    return (
        <div className="space-y-1.5">
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
            {type === 'textarea' ? (
                <textarea {...commonProps} rows="3" />
            ) : (
                <input type={type} {...commonProps} />
            )}
        </div>
    );
};

export default Input;
