import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState, useEffect, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { updateWaterStreak } from "@/hooks/useStreaks";

const DAILY_GOAL = 8;
const STORAGE_KEY = "prepfit_water_data";

interface WaterData {
  date: string;
  count: number;
}

function CircularProgress({
  count,
  goal,
  colors,
}: {
  count: number;
  goal: number;
  colors: ReturnType<typeof useColors>;
}) {
  const SIZE = 180;
  const STROKE = 14;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const progress = Math.min(count / goal, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#38BDF8" />
            <Stop offset="1" stopColor="#0EA5E9" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={colors.border}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="url(#waterGrad)"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={SIZE / 2}
          originY={SIZE / 2}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ fontSize: 40, fontFamily: "Inter_700Bold", color: "#38BDF8" }}>
          {count}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>
          of {goal} glasses
        </Text>
      </View>
    </View>
  );
}

export default function WaterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(0);

  const todayKey = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: WaterData = JSON.parse(raw);
        if (data.date === todayKey) {
          setCount(data.count);
        } else {
          setCount(0);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey, count: 0 }));
        }
      }
    } catch {}
  }, [todayKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveCount = async (newCount: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey, count: newCount }));
      if (newCount >= DAILY_GOAL) {
        await updateWaterStreak();
      }
    } catch {}
  };

  const addGlass = async () => {
    const newCount = Math.min(count + 1, 20);
    setCount(newCount);
    await saveCount(newCount);
    if (newCount === DAILY_GOAL) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const removeGlass = async () => {
    if (count === 0) return;
    const newCount = count - 1;
    setCount(newCount);
    await saveCount(newCount);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetDay = async () => {
    setCount(0);
    await saveCount(0);
  };

  const remaining = Math.max(DAILY_GOAL - count, 0);
  const pct = Math.round((count / DAILY_GOAL) * 100);
  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.header, { paddingTop: 16 }]}>
        <Text style={s.headerTitle}>Water Tracker</Text>
        <Text style={s.headerSub}>Stay hydrated · {DAILY_GOAL} glasses/day goal</Text>
      </View>

      <View style={s.progressSection}>
        <CircularProgress count={count} goal={DAILY_GOAL} colors={colors} />

        <Text style={s.statusText}>
          {count >= DAILY_GOAL
            ? "🎉 Daily goal reached!"
            : `${remaining} more to reach your goal`}
        </Text>

        <View style={s.controls}>
          <Pressable
            style={({ pressed }) => [s.minusBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={removeGlass}
            disabled={count === 0}
          >
            <MaterialCommunityIcons name="minus" size={24} color={count === 0 ? colors.mutedForeground : colors.foreground} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.addBtn, { opacity: pressed ? 0.8 : 1 }]}
            onPress={addGlass}
          >
            <MaterialCommunityIcons name="water-plus" size={28} color="#FFF" />
            <Text style={s.addBtnText}>Add Glass</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.minusBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={resetDay}
          >
            <MaterialCommunityIcons name="refresh" size={22} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <View style={s.glassGrid}>
        {Array.from({ length: DAILY_GOAL }).map((_, i) => (
          <Pressable key={i} style={s.glassItem} onPress={i < count ? removeGlass : addGlass}>
            <MaterialCommunityIcons
              name={i < count ? "cup-water" : "cup-outline"}
              size={32}
              color={i < count ? "#38BDF8" : colors.border}
            />
          </Pressable>
        ))}
      </View>

      <View style={s.statsCard}>
        <View style={s.statRow}>
          <Text style={s.statLabel}>Today's intake</Text>
          <Text style={s.statValue}>{count * 250}ml · {(count * 8.45).toFixed(0)}oz</Text>
        </View>
        <View style={s.statRow}>
          <Text style={s.statLabel}>Goal completion</Text>
          <Text style={[s.statValue, { color: count >= DAILY_GOAL ? "#22C55E" : colors.primary }]}>
            {pct}%
          </Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    header: {
      backgroundColor: colors.sidebar,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    headerSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.5)",
      marginTop: 4,
    },
    progressSection: {
      alignItems: "center",
      paddingVertical: 32,
      paddingHorizontal: 20,
    },
    statusText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      marginTop: 16,
      marginBottom: 24,
      textAlign: "center",
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    minusBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    addBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#0EA5E9",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 16,
    },
    addBtnText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#FFF",
    },
    glassGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 12,
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    glassItem: {
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    statsCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statLabel: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    statValue: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
  });
