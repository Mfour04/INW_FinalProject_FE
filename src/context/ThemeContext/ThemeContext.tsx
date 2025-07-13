import React, { createContext, useContext, useEffect, useState } from "react";
import { THEME_STORAGE_KEY, THEME_VALUES } from "./constants";

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

type ThemeProviderProps = {
  children: React.ReactElement;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem(THEME_STORAGE_KEY) === THEME_VALUES.DARK
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(THEME_VALUES.DARK);
      localStorage.setItem(THEME_STORAGE_KEY, THEME_VALUES.DARK);
    } else {
      document.documentElement.classList.remove(THEME_VALUES.DARK);
      localStorage.setItem(THEME_STORAGE_KEY, THEME_VALUES.LIGHT);
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a ThemeProvider");
  }
  return context;
};
