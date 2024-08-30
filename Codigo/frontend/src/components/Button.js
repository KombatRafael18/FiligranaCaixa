import React from 'react';

const sizeClasses = {
  big: 'text-[40px] px-12 py-3',
  default: 'text-[15px] px-4 py-2',
  small: 'text-[13px] px-2 py-1',
};


const Button = ({ children, size = 'default', className = '', fullWidth = false, ...props }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.default;
  const fullWidthClass = fullWidth ? ' w-[calc(100%-32px)]' : '';

  return (
    <button
      className={`bg-[#9b5c6f] hover:bg-[#8a4f61] text-white font-bold rounded-lg ${sizeClass} ${fullWidthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
