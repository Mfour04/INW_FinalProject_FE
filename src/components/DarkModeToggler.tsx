import React from "react";
import { useDarkMode } from "../context/ThemeContext/ThemeContext";

type Props = {
  className?: string;
};

export const DarkModeToggler: React.FC<Props> = ({ className = "" }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const toggle = () => setDarkMode(!darkMode);

  const outerGradient = darkMode
    ? "from-indigo-400 via-indigo-500 to-indigo-600" 
    : "from-yellow-400 via-orange-400 to-orange-500";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={darkMode}
      aria-label="Toggle dark mode"
      className={[
        "group relative inline-flex items-center h-10 w-20 rounded-full p-[2px]",
        `bg-gradient-to-r ${outerGradient}`,
        "transition-all duration-300",
        className
      ].join(" ")}
    >
      <span
        className={[
          "relative flex items-center justify-between w-full h-full rounded-full",
          "bg-white/90 dark:bg-[#0f0f11]/90 backdrop-blur",
          "px-1"
        ].join(" ")}
      >
        <span
          className={[
            "flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300",
            !darkMode ? "bg-yellow-400 text-white shadow" : "bg-transparent text-yellow-500"
          ].join(" ")}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM3 11h1a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2Zm17 0h1a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2ZM5.64 5.64a1 1 0 0 1 1.41 0l.7.7A1 1 0 0 1 6.34 8l-.7-.7a1 1 0 0 1 0-1.41Zm10.61 10.61a1 1 0 0 1 1.41 0l.7.7A1 1 0 0 1 17.06 18l-.7-.7a1 1 0 0 1 0-1.41ZM18.36 5.64a1 1 0 0 1 0 1.41l-.7.7A1 1 0 1 1 16.24 6l.7-.7a1 1 0 0 1 1.42 0ZM7.05 16.95a1 1 0 0 1 0 1.41l-.7.7A1 1 0 1 1 5 17.76l.7-.7a1 1 0 0 1 1.41 0Z"/>
          </svg>
        </span>

        <span
          className={[
            "flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300",
            darkMode ? "bg-indigo-500 text-white shadow" : "bg-transparent text-indigo-400"
          ].join(" ")}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z"/>
          </svg>
        </span>
      </span>
    </button>
  );
};

export default DarkModeToggler;
