import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 md:bottom-6 right-4 md:right-6 w-[50px] h-[50px] md:w-[50px] md:h-[50px] flex items-center justify-center p-0 z-[9999] rounded-full shadow-lg transition-all duration-300 
                 bg-canvas/80 dark:bg-canvas-night/80 backdrop-blur-md 
                 border border-hairline dark:border-hairline-strong 
                 text-ink dark:text-on-dark 
                 hover:shadow-xl hover:border-hairline-strong dark:hover:border-on-dark
                 focus:outline-none focus:ring-2 focus:ring-primary/50"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ y: 20, rotate: -90, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: -20, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Sun className="w-6 h-6 text-amber-500 fill-amber-500/20" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 20, rotate: -90, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: -20, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Moon className="w-6 h-6 text-violet-600 fill-violet-600/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

export default ThemeToggle;

