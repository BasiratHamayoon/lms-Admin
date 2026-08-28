import React from 'react';

const Separator = ({ className = '', orientation = 'horizontal', ...props }) => {
  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'} 
        bg-gray-200 dark:bg-gray-700
        ${className}
      `}
      {...props}
    />
  );
};

export { Separator };