import React from 'react';

const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center ...';

  const variants = {
    primary: 'bg-emerald-500 ...',
    secondary: 'bg-gray-800 ...',
    outline: 'border-2 ...',
    ghost: 'hover:bg-gray-100 ...',
    danger: 'bg-red-500 ...',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
