import { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  lightTheme: boolean;
  handleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeContext must be used within a ThemeProvider");
  return context;
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize theme from localStorage or default to true
  const [lightTheme, setLightTheme] = useState<boolean>(() => {
    const localTheme = localStorage.getItem("theme");
    return localTheme === "false" ? false : true; // Default to light theme
  });

  const handleTheme = () => {
    const newTheme = !lightTheme;
    setLightTheme(newTheme);
    localStorage.setItem("theme", newTheme.toString());
    document.documentElement.className = newTheme ? "light" : "dark";
  };

  // Sync the `document.documentElement.className` with the theme on mount
  useEffect(() => {
    document.documentElement.className = lightTheme ? "light" : "dark";
  }, [lightTheme]);

  return (
    <ThemeContext.Provider value={{ lightTheme, handleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
