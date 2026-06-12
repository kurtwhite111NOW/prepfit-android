import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const DEMO_KEY = "prepfit_demo_mode";

interface DemoContextValue {
  isDemoMode: boolean;
  isLoaded: boolean;
  enterDemo: () => Promise<void>;
  exitDemo: () => Promise<void>;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DEMO_KEY)
      .then((val) => setIsDemoMode(val === "1"))
      .finally(() => setIsLoaded(true));
  }, []);

  const enterDemo = useCallback(async () => {
    await AsyncStorage.setItem(DEMO_KEY, "1");
    setIsDemoMode(true);
  }, []);

  const exitDemo = useCallback(async () => {
    await AsyncStorage.removeItem(DEMO_KEY);
    setIsDemoMode(false);
  }, []);

  return (
    <DemoContext.Provider value={{ isDemoMode, isLoaded, enterDemo, exitDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoMode must be used within DemoProvider");
  return ctx;
}
