import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
export { Card };
