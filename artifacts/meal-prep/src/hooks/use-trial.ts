import { useState, useEffect } from "react";

const TRIAL_KEY = "nutriplan_trial_start";
const TRIAL_DAYS = 3;

export type TrialState = {
  loading: boolean;
  expired: boolean;
  daysLeft: number;
  hoursLeft: number;
  trialStart: Date | null;
  trialEnd: Date | null;
};

export function useTrial(): TrialState {
  const [trialStart, setTrialStart] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stored = localStorage.getItem(TRIAL_KEY);
    if (!stored) {
      const now = new Date().toISOString();
      localStorage.setItem(TRIAL_KEY, now);
      stored = now;
    }
    setTrialStart(new Date(stored));
    setLoading(false);
  }, []);

  if (loading || !trialStart) {
    return { loading: true, expired: false, daysLeft: TRIAL_DAYS, hoursLeft: TRIAL_DAYS * 24, trialStart: null, trialEnd: null };
  }

  const trialEnd = new Date(trialStart.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const now = new Date();
  const msRemaining = trialEnd.getTime() - now.getTime();
  const expired = msRemaining <= 0;
  const hoursLeft = expired ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60));
  const daysLeft = expired ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  return { loading: false, expired, daysLeft, hoursLeft, trialStart, trialEnd };
}
