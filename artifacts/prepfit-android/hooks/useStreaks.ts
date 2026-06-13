import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export const WATER_STREAK_KEY = "prepfit_water_streak";

export interface StreakData {
  streak: number;
  lastDate: string;
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = [...new Set(dates)].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  })();
  if (unique[0] !== today && unique[0] !== yesterday) return 0;
  let streak = 0;
  let cursor = unique[0] === today ? today : yesterday;
  for (const d of unique) {
    if (d === cursor) {
      streak++;
      const dt = new Date(cursor + "T12:00:00Z");
      dt.setUTCDate(dt.getUTCDate() - 1);
      cursor = dt.toISOString().split("T")[0];
    } else if (d < cursor) {
      break;
    }
  }
  return streak;
}

export function useStreaks(savedMealDates: string[], weightEntryDates: string[]) {
  const [waterStreak, setWaterStreak] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(WATER_STREAK_KEY)
      .then((raw) => {
        if (!raw) return;
        const data: StreakData = JSON.parse(raw);
        const today = new Date().toISOString().split("T")[0];
        const yesterday = (() => {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          return d.toISOString().split("T")[0];
        })();
        if (data.lastDate === today || data.lastDate === yesterday) {
          setWaterStreak(data.streak);
        }
      })
      .catch(() => {});
  }, []);

  return {
    mealStreak: computeStreak(savedMealDates),
    weightStreak: computeStreak(weightEntryDates),
    waterStreak,
  };
}

export async function updateWaterStreak(): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const raw = await AsyncStorage.getItem(WATER_STREAK_KEY);
    if (raw) {
      const data: StreakData = JSON.parse(raw);
      if (data.lastDate === today) return;
      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split("T")[0];
      })();
      const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;
      await AsyncStorage.setItem(
        WATER_STREAK_KEY,
        JSON.stringify({ streak: newStreak, lastDate: today })
      );
    } else {
      await AsyncStorage.setItem(
        WATER_STREAK_KEY,
        JSON.stringify({ streak: 1, lastDate: today })
      );
    }
  } catch {}
}
