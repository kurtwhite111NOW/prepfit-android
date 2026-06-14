import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const TRIAL_START_KEY = "prepfit_trial_start";
export const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

export interface LocalTrialState {
  isActive: boolean;
  daysLeft: number;
  hoursLeft: number;
  isLoaded: boolean;
}

/**
 * Reads the local 3-day trial window stored in AsyncStorage.
 * Sets the trial start on first call (first app open).
 * This is the single source of truth for trial gating in PremiumGate
 * and the TrialBanner (used until RevenueCat entitlement is confirmed).
 */
export function useLocalTrial(): LocalTrialState {
  const [state, setState] = useState<LocalTrialState>({
    isActive: false,
    daysLeft: 0,
    hoursLeft: 0,
    isLoaded: false,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let startStr = await AsyncStorage.getItem(TRIAL_START_KEY);
        if (!startStr) {
          startStr = Date.now().toString();
          await AsyncStorage.setItem(TRIAL_START_KEY, startStr);
        }
        const start = parseInt(startStr, 10);
        const end = start + TRIAL_DURATION_MS;
        const now = Date.now();
        const diff = Math.max(0, end - now);
        const isActive = diff > 0;
        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (!cancelled) setState({ isActive, daysLeft, hoursLeft, isLoaded: true });
      } catch {
        if (!cancelled) setState({ isActive: false, daysLeft: 0, hoursLeft: 0, isLoaded: true });
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
