import React from "react";
import { useTheme } from "../../context/ThemeContext";

export function ProgressCircle({ value, max, size = 80 }) {
  const { theme } = useTheme(); // نجيب theme من Context
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (percentage / 100) * circumference;

  // تحديد لون الدائرة الأمامية حسب theme
  const strokeColor = theme === "dark" ? "#facc15" : "#3b82f6"; // أصفر في dark، أزرق في light

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r="35"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        className="text-gray-100 dark:text-gray-400"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r="35"
        stroke={strokeColor}
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

export default ProgressCircle;
