import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, fullWidth = true }) => {
  return (
    <div className={`mb-4 ${fullWidth ? 'w-[calc(100%-32px)]' : ''}`}>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-[#9f5f6e] font-bold"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-[#9f5f6e] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f5f6e] focus:border-transparent"
      />
    </div>
  );
};

export default Input;
