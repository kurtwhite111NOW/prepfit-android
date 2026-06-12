import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  resolvedTheme: "light",
  toggleTheme: () => {},
});

const STORAGE_KEY = "prepfit_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme() ?? "light";
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === "light" || val === "dark") setMode(val);
    });
  }, []);

  const resolvedTheme: "light" | "dark" = mode === "system" ? system : mode;

  const toggleTheme = () => {
    const next: "light" | "dark" = resolvedTheme === "dark" ? "light" : "dark";
    setMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
