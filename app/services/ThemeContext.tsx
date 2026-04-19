import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useColorScheme } from "react-native";
import { ThemeMode } from "../types";
import { StorageKeys, storageGet, storageSet } from "./storage";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(systemColorScheme || "light");
  const userHasToggled = useRef(false);

  useEffect(() => {
    storageGet<ThemeMode | null>(StorageKeys.THEME, null).then((saved) => {
      if (saved) {
        userHasToggled.current = true;
        setTheme(saved);
      }
    });
  }, []);

  useEffect(() => {
    if (!userHasToggled.current && systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    userHasToggled.current = true;
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      storageSet(StorageKeys.THEME, next);
      return next;
    });
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
