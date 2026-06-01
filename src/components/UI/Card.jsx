import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', onClick }) => {
  const baseClasses = `bg-canvas dark:bg-canvas-night text-ink dark:text-on-dark rounded-lg border border-hairline dark:border-border-color p-6 shadow-sm ${
    onClick ? 'cursor-pointer' : ''
  } ${className}`;

  if (onClick) {
    return (
      <motion.div
        whileHover={{ y: -4, shadow: '0 8px 24px rgba(0,0,0,0.06)' }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default Card;
export { Card };

