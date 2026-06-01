import React from 'react';
import { motion } from 'framer-motion';

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none';

  const variants = {
    primary:
      'bg-primary hover:bg-primary-deep text-ink active:bg-primary-deep border border-transparent shadow-sm',
    secondary:
      'bg-canvas dark:bg-canvas-night border border-hairline-strong dark:border-hairline-cool-3 text-ink dark:text-on-dark hover:border-ink dark:hover:border-on-dark shadow-sm',
    outline:
      'border border-primary text-primary hover:bg-primary/5 hover:border-primary-deep',
    ghost:
      'hover:bg-hairline-cool dark:hover:bg-canvas-night-soft text-ink-mute dark:text-ink-mute-2 hover:text-ink dark:hover:text-on-dark',
    link:
      'text-ink dark:text-on-dark hover:underline p-0 bg-transparent shadow-none',
    danger:
      'bg-accent-tomato hover:bg-red-700 text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;

