import React from 'react';

const sizeClasses = {
  giant: 'w-[240px] h-[249px] flex items-center justify-center rounded-3xl',
  big: 'text-[40px] px-12 py-3 rounded-lg',
  default: 'text-[15px] px-4 py-2 rounded-lg',
  small: 'text-[13px] px-2 py-1 rounded-lg',
};

const Button = ({ children, size = 'default', className = '', fullWidth = false, image, ...props }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.default;
  const fullWidthClass = fullWidth ? ' w-[calc(100%-32px)]' : '';

  return (
    <button
      className={`bg-[#9b5c6f] hover:bg-[#8a4f61] text-white font-bold ${sizeClass} ${fullWidthClass} ${className}`}
      {...props}
    >
      {size === 'giant' && image ? (
        <div className="w-full h-full p-8">
          <img src={image} alt="Botão" className="w-full h-full object-contain" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
