import React from 'react';

export function ProgressCircle({ value, max, color, size = 80 }) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r="35"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        className="text-gray-200 dark:text-gray-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r="35"
        stroke={color}
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
}
