import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, fullWidth = true, variant, readOnly = undefined, disabled=undefined }) => {
  return (
    <div className={`mb-4 ${fullWidth && variant !== 'custom' ? 'w-[calc(100%-32px)]' : ''}`}>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-[#9f5f6e]
          disabled:text-slate-500
        "
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
        readOnly={readOnly}
        disabled={disabled}
        className={`px-3 py-2 text-[#9f5f6e] bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f5f6e] focus:border-transparent
          ${variant === "custom" ? "border-[#9f5f6e]" : "border-gray-300"}
          ${fullWidth ? "w-full" : "w-[190px]"}
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        `}
      />
    </div>
  );
};

export default Input;
