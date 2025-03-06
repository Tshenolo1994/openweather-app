import React, { createContext, useContext, useState } from "react";

interface Theme {
  background: string;
  text: string;
  accent: string;
  cardBackground: string;
  border: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const lightTheme: Theme = {
  background: "bg-gradient-to-b from-blue-400 to-blue-100",
  text: "text-slate-800",
  accent: "text-blue-600",
  cardBackground: "bg-white/30 backdrop-blur-sm",
  border: "border-white/20",
};

const darkTheme: Theme = {
  background: "bg-gradient-to-b from-blue-900 to-indigo-900",
  text: "text-white",
  accent: "text-blue-300",
  cardBackground: "bg-slate-800/40 backdrop-blur-sm",
  border: "border-slate-700/30",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
