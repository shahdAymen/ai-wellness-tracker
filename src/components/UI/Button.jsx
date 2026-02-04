import React from 'react';

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800',
    secondary:
      'bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white dark:bg-slate-600 dark:hover:bg-slate-700 dark:active:bg-slate-800',
    outline:
      'border-2 border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950',
    ghost:
      'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    danger:
     'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800',
    
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;