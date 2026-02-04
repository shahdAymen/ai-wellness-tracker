import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full transition-colors bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      {theme === "dark" ? (
        <Sun className="w-7 h-7 text-yellow-300" />
      ) : (
        <Moon className="w-7 h-7 text-blue-600" />
      )}
    </button>
  );
}

export default ThemeToggle;
