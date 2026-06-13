import { useUser, useClerk } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import {
  getListMealPlansQueryKey,
  getListSavedMealsQueryKey,
  getListWeightEntriesQueryKey,
  getGetMealPlanQueryKey,
  listMealPlans,
  listSavedMeals,
  listWeightEntries,
  getMealPlan,
} from "@workspace/api-client-react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/lib/theme";
import { useStreaks } from "@/hooks/useStreaks";

// ─── Constants ───────────────────────────────────────────────────────────────

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WATER_KEY = "prepfit_water_data";
const DAILY_GOAL = 8;

const GYM_TIPS = [
  "Aim for 0.7–1g of protein per pound of bodyweight daily. That's about 140–200g for a 200 lb athlete.",
  "Stay hydrated — aim for 8+ glasses of water daily. Dehydration tanks gym performance more than most people realize.",
  "Meal prep on Sundays cuts decision fatigue all week. Fewer decisions = more consistent eating.",
  "Eating protein within 30–60 min after a workout helps muscle repair and growth.",
  "Compound lifts (squat, deadlift, bench, row) build more muscle than isolation exercises — prioritise them.",
  "Sleep 7–9 hours. Growth hormone is released during deep sleep — it's when you actually get stronger.",
  "Track your calories for just 2 weeks. Most people are shocked at how much they under- or over-eat.",
  "Progressive overload is the #1 driver of strength gains. Add weight, reps, or sets each week.",
  "Frozen veggies are just as nutritious as fresh and way cheaper. Use them freely.",
  "If you miss a meal, don't compensate by over-eating the next one. Just continue as normal.",
  "Creatine monohydrate is the most studied, most effective legal supplement for strength and muscle.",
  "Your metabolism doesn't slow until you're in a very deep calorie deficit. Most 'slow metabolism' is under-tracked eating.",
  "Canned tuna, eggs, and Greek yoghurt are the three cheapest high-protein foods. Keep them stocked.",
  "Rest between sets matters: 2–3 min for strength lifts, 60–90 sec for hypertrophy work.",
  "Consistency over 6 months beats intensity over 2 weeks every single time.",
];

const QUICK_ACTIONS = [
  {
    label: "Build a Meal Plan",
    desc: "Smart plans in seconds",
    route: "/(tabs)/planner",
    icon: "calendar" as const,
    family: "feather" as const,
    color: "#F26B1D",
    bg: "rgba(242,107,29,0.15)",
  },
  {
    label: "Scan a Meal",
    desc: "Snap a photo — get instant calories",
    route: "/(tabs)/scan",
    icon: "camera" as const,
    family: "feather" as const,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
  },
  {
    label: "Grocery List",
    desc: "What to buy for your plan",
    route: "/(tabs)/grocery",
    icon: "shopping-cart" as const,
    family: "feather" as const,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.15)",
  },
  {
    label: "Water Tracker",
    desc: null,
    route: "/(tabs)/water",
    icon: "water" as const,
    family: "community" as const,
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.15)",
  },
  {
    label: "Track Weight",
    desc: "Log your progress",
    route: "/(tabs)/weight",
    icon: "trending-up" as const,
    family: "feather" as const,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.15)",
  },
  {
    label: "Saved Plans",
    desc: "All your meal plan history",
    route: "/(tabs)/plans",
    icon: "bookmark" as const,
    family: "feather" as const,
    color: "#A855F7",
    bg: "rgba(168,85,247,0.15)",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useWaterCount() {
  const [count, setCount] = useState(0);
  const todayKey = new Date().toISOString().split("T")[0];
  useEffect(() => {
    AsyncStorage.getItem(WATER_KEY).then((raw) => {
      if (raw) {
        const data = JSON.parse(raw);
        if (data.date === todayKey) setCount(data.count);
      }
    }).catch(() => {});
  }, [todayKey]);
  return count;
}

function getDailyTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return GYM_TIPS[dayOfYear % GYM_TIPS.length];
}

function MacroBar({
  label, grams, kcalPerG, totalKcal, color, colors,
}: {
  label: string; grams: number; kcalPerG: number; totalKcal: number;
  color: string; colors: ReturnType<typeof useColors>;
}) {
  const pct = totalKcal > 0 ? Math.min((grams * kcalPerG) / totalKcal, 1) : 0;
  const s = StyleSheet.create({
    row: { gap: 6 },
    top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    val: { fontSize: 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    track: { height: 6, backgroundColor: colors.muted, borderRadius: 3, overflow: "hidden" },
    fill: { height: 6, backgroundColor: color, borderRadius: 3, width: `${pct * 100}%` },
  });
  return (
    <View style={s.row}>
      <View style={s.top}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.val}>{grams}g · {Math.round(grams * kcalPerG)} kcal</Text>
      </View>
      <View style={s.track}>
        <View style={s.fill} />
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const colors = useColors();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const waterCount = useWaterCount();

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: getListMealPlansQueryKey(),
    queryFn: () => listMealPlans(),
  });

  const { data: weightEntries } = useQuery({
    queryKey: getListWeightEntriesQueryKey(),
    queryFn: () => listWeightEntries(),
  });

  const { data: savedMeals } = useQuery({
    queryKey: getListSavedMealsQueryKey(),
    queryFn: () => listSavedMeals(),
  });

  const activePlan = plans?.[0] ?? null;
  const latestWeight = weightEntries?.[0];

  const { data: planDetail } = useQuery({
    queryKey: getGetMealPlanQueryKey(activePlan?.id ?? 0),
    queryFn: () => getMealPlan(activePlan!.id),
    enabled: !!activePlan?.id,
  });

  // ── Derived data ────────────────────────────────────────────────────────────

  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const dateStr = `${dayName.toUpperCase()}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const hour = now.getHours();

  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Athlete";

  // Today calories
  const todayStr = now.toISOString().split("T")[0];
  const todayMeals = savedMeals?.filter((m) => m.createdAt.startsWith(todayStr)) ?? [];
  const todayCalories = todayMeals.reduce((s, m) => s + (m.estimatedCalories ?? 0), 0);

  // Budget vs actual
  const budget = activePlan?.dailyCalories ?? 0;
  const budgetProgress = budget > 0 ? Math.min(todayCalories / budget, 1) : 0;
  const overBudget = budget > 0 && todayCalories > budget;
  const remaining = Math.max(budget - todayCalories, 0);
  const showBudget = activePlan && budget > 0;

  // Macros from active plan
  const totalProtein = planDetail?.meals.reduce((s, m) => s + (m.protein ?? 0), 0) ?? 0;
  const totalCarbs = planDetail?.meals.reduce((s, m) => s + (m.carbs ?? 0), 0) ?? 0;
  const totalFat = planDetail?.meals.reduce((s, m) => s + (m.fat ?? 0), 0) ?? 0;
  const planTotalKcal = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;
  const hasMacros = totalProtein > 0 || totalCarbs > 0 || totalFat > 0;

  // Streaks
  const mealDates = savedMeals?.map((m) => m.createdAt.split("T")[0]) ?? [];
  const weightDates = weightEntries?.map((e) => new Date(e.recordedAt).toISOString().split("T")[0]) ?? [];
  const { mealStreak, weightStreak, waterStreak } = useStreaks(mealDates, weightDates);

  // Weekly summary (last 7 days)
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];
  const weekMeals = savedMeals?.filter((m) => m.createdAt.split("T")[0] >= weekAgoStr) ?? [];
  const weekDaysActive = new Set(weekMeals.map((m) => m.createdAt.split("T")[0])).size;
  const weekTotalKcal = weekMeals.reduce((s, m) => s + (m.estimatedCalories ?? 0), 0);
  const weekAvgKcal = weekDaysActive > 0 ? Math.round(weekTotalKcal / weekDaysActive) : 0;
  const weekWeightEntries = weightEntries?.filter((e) => {
    const d = new Date(e.recordedAt).toISOString().split("T")[0];
    return d >= weekAgoStr;
  }) ?? [];
  const weekWeightDelta =
    weekWeightEntries.length >= 2
      ? (weekWeightEntries[0].weight - weekWeightEntries[weekWeightEntries.length - 1].weight).toFixed(1)
      : null;
  const showWeekly = weekMeals.length > 0 || weekWeightEntries.length > 0;

  const tip = getDailyTip();
  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <View style={[s.hero, { backgroundColor: resolvedTheme === "dark" ? colors.card : "#12151A" }]}>
        <View style={s.heroTopRow}>
          <Text style={s.heroDate}>{dateStr}</Text>
          <Pressable
            onPress={() =>
              Alert.alert("Account", `Signed in as ${user?.emailAddresses?.[0]?.emailAddress}`, [
                { text: "Sign Out", style: "destructive", onPress: () => signOut() },
                { text: "Cancel", style: "cancel" },
              ])
            }
          >
            <Text style={s.heroVersion}>version 2.0.0</Text>
          </Pressable>
        </View>

        <Text style={s.heroTitle}>💪 Let's crush today!</Text>

        {activePlan ? (
          <View style={s.heroPlanRow}>
            <Feather name="zap" size={13} color={colors.primary} />
            <Text style={s.heroPlanText}>
              Active: <Text style={{ color: colors.primary }}>{activePlan.name}</Text>
            </Text>
          </View>
        ) : (
          <Pressable style={s.heroPlanRow} onPress={() => router.push("/(tabs)/planner" as never)}>
            <Feather name="zap" size={13} color={colors.primary} />
            <Text style={s.heroPlanText}>
              No plan yet — <Text style={{ color: colors.primary }}>Build your first plan</Text>
            </Text>
          </Pressable>
        )}

        {todayCalories > 0 && (
          <Pressable style={s.caloriePill} onPress={() => router.push("/(tabs)/meals" as never)}>
            <Text style={s.calorieEmoji}>🔥</Text>
            <Text style={s.calorieText}>{todayCalories} kcal scanned today</Text>
            <Feather name="chevron-right" size={12} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {/* ── Budget vs Actual ─────────────────────────────────────────────────── */}
      {showBudget && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>TODAY'S CALORIES</Text>
          <View style={s.budgetCard}>
            <View style={s.budgetRow}>
              <View>
                <Text style={s.budgetActual}>{todayCalories.toLocaleString()}</Text>
                <Text style={s.budgetLabel}>kcal logged</Text>
              </View>
              <View style={s.budgetDivider} />
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.budgetGoal}>{budget.toLocaleString()}</Text>
                <Text style={s.budgetLabel}>kcal budget</Text>
              </View>
            </View>
            <View style={s.budgetTrack}>
              <View
                style={[
                  s.budgetFill,
                  {
                    width: `${budgetProgress * 100}%`,
                    backgroundColor: overBudget ? colors.destructive : colors.primary,
                  },
                ]}
              />
            </View>
            <View style={s.budgetFooter}>
              {overBudget ? (
                <Text style={[s.budgetRemaining, { color: colors.destructive }]}>
                  {(todayCalories - budget).toLocaleString()} kcal over budget
                </Text>
              ) : (
                <Text style={s.budgetRemaining}>
                  {remaining.toLocaleString()} kcal remaining · {Math.round(budgetProgress * 100)}% of goal
                </Text>
              )}
              <Pressable onPress={() => router.push("/(tabs)/scan" as never)}>
                <Text style={s.budgetScanLink}>+ Log meal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ── Streaks ──────────────────────────────────────────────────────────── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>YOUR STREAKS</Text>
        <View style={s.streakRow}>
          {[
            { emoji: "🔥", count: mealStreak, label: "Meal Scan", color: "#F59E0B" },
            { emoji: "💧", count: waterStreak, label: "Water Goal", color: "#38BDF8" },
            { emoji: "⚖️", count: weightStreak, label: "Weight Log", color: "#22C55E" },
          ].map((item) => (
            <View key={item.label} style={s.streakCard}>
              <Text style={s.streakEmoji}>{item.emoji}</Text>
              <Text style={[s.streakCount, { color: item.count > 0 ? item.color : colors.mutedForeground }]}>
                {item.count}
              </Text>
              <Text style={s.streakDays}>{item.count === 1 ? "day" : "days"}</Text>
              <Text style={s.streakLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Quick Actions ─────────────────────────────────────────────────────── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>WHAT DO YOU WANT TO DO?</Text>
        <View style={s.grid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.label}
              style={({ pressed }) => [s.actionCard, { opacity: pressed ? 0.85 : 1 }]}
              onPress={() => router.push(action.route as never)}
            >
              <View style={[s.actionIcon, { backgroundColor: action.bg }]}>
                {action.family === "community" ? (
                  <MaterialCommunityIcons name={action.icon as any} size={24} color={action.color} />
                ) : (
                  <Feather name={action.icon as any} size={24} color={action.color} />
                )}
              </View>
              <Text style={s.actionLabel}>{action.label}</Text>
              <Text style={s.actionDesc} numberOfLines={1}>
                {action.label === "Water Tracker"
                  ? `${waterCount}/${DAILY_GOAL} glasses today`
                  : action.label === "Scan a Meal" && todayCalories > 0
                  ? `${todayCalories} kcal scanned today`
                  : action.desc}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── This Week ─────────────────────────────────────────────────────────── */}
      {showWeekly && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>THIS WEEK</Text>
          <View style={s.weekCard}>
            <View style={s.weekGrid}>
              <View style={s.weekStat}>
                <Text style={s.weekStatVal}>{weekMeals.length}</Text>
                <Text style={s.weekStatLabel}>Meals logged</Text>
              </View>
              <View style={s.weekStatDivider} />
              <View style={s.weekStat}>
                <Text style={s.weekStatVal}>{weekAvgKcal > 0 ? weekAvgKcal.toLocaleString() : "—"}</Text>
                <Text style={s.weekStatLabel}>Avg kcal/day</Text>
              </View>
              <View style={s.weekStatDivider} />
              <View style={s.weekStat}>
                <Text style={s.weekStatVal}>{weekDaysActive}/7</Text>
                <Text style={s.weekStatLabel}>Active days</Text>
              </View>
              {weekWeightDelta !== null && (
                <>
                  <View style={s.weekStatDivider} />
                  <View style={s.weekStat}>
                    <Text style={[
                      s.weekStatVal,
                      { color: parseFloat(weekWeightDelta) < 0 ? "#22C55E" : parseFloat(weekWeightDelta) > 0 ? colors.destructive : colors.foreground }
                    ]}>
                      {parseFloat(weekWeightDelta) > 0 ? "+" : ""}{weekWeightDelta}
                    </Text>
                    <Text style={s.weekStatLabel}>Weight (lbs)</Text>
                  </View>
                </>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [s.weekViewBtn, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => router.push("/(tabs)/meals" as never)}
            >
              <Text style={s.weekViewBtnText}>View My Meals →</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Macro Targets ─────────────────────────────────────────────────────── */}
      {hasMacros && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>DAILY MACRO TARGETS</Text>
          <View style={s.macroCard}>
            <Text style={s.macroSource}>From: {activePlan?.name}</Text>
            <MacroBar label="Protein" grams={totalProtein} kcalPerG={4} totalKcal={planTotalKcal} color="#F26B1D" colors={colors} />
            <MacroBar label="Carbs" grams={totalCarbs} kcalPerG={4} totalKcal={planTotalKcal} color="#38BDF8" colors={colors} />
            <MacroBar label="Fat" grams={totalFat} kcalPerG={9} totalKcal={planTotalKcal} color="#A855F7" colors={colors} />
            <View style={s.macroTotal}>
              <Feather name="zap" size={13} color={colors.primary} />
              <Text style={s.macroTotalText}>{planTotalKcal} kcal total · P{totalProtein}g C{totalCarbs}g F{totalFat}g</Text>
            </View>
          </View>
        </View>
      )}

      {/* ── Current Plan ──────────────────────────────────────────────────────── */}
      <View style={s.section}>
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>YOUR CURRENT PLAN</Text>
          {plans && plans.length > 0 && (
            <Pressable onPress={() => router.push("/(tabs)/plans" as never)}>
              <Text style={s.sectionLink}>All plans →</Text>
            </Pressable>
          )}
        </View>

        {plansLoading ? (
          <View style={[s.planCard, { justifyContent: "center", alignItems: "center", minHeight: 100 }]}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : activePlan ? (
          <Pressable
            style={({ pressed }) => [s.planCard, { opacity: pressed ? 0.9 : 1 }]}
            onPress={() => router.push("/(tabs)/planner" as never)}
          >
            <View style={s.planCardHeader}>
              <View style={s.planIconWrap}>
                <Feather name="zap" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.planName}>{activePlan.name}</Text>
                <View style={s.planMeta}>
                  <Text style={s.planMetaText}>{activePlan.mealsPerDay} meals/day</Text>
                  <View style={s.dot} />
                  <Text style={s.planMetaText}>{activePlan.dailyCalories} kcal/day</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </View>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [s.emptyPlan, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push("/(tabs)/planner" as never)}
          >
            <View style={s.emptyPlanIcon}>
              <Feather name="plus" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={s.emptyPlanTitle}>No plan yet</Text>
            <Text style={s.emptyPlanSub}>
              Build your first meal plan in seconds — set your calorie goal and we'll handle the rest.
            </Text>
            <View style={s.emptyPlanBtn}>
              <Feather name="plus" size={14} color="#FFF" />
              <Text style={s.emptyPlanBtnText}>Build My First Plan</Text>
            </View>
          </Pressable>
        )}
      </View>

      {/* ── Daily tip ──────────────────────────────────────────────────────────── */}
      <View style={s.section}>
        <View style={s.tipCard}>
          <Text style={s.tipEmoji}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.tipLabel}>GYM &amp; MEAL PREP TIP</Text>
            <Text style={s.tipText}>{tip}</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },

    // Hero
    hero: {
      backgroundColor: "#12151A",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
    },
    heroTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    heroDate: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      letterSpacing: 0.8,
    },
    heroVersion: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    heroTitle: {
      fontSize: 30,
      fontFamily: "Inter_800ExtraBold" as any,
      color: "#FFFFFF",
      marginBottom: 10,
      lineHeight: 36,
    },
    heroPlanRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    heroPlanText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.60)",
    },
    caloriePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 8,
      backgroundColor: "rgba(242,107,29,0.15)",
      borderRadius: 100,
      paddingHorizontal: 12,
      paddingVertical: 5,
      alignSelf: "flex-start",
    },
    calorieEmoji: { fontSize: 13 },
    calorieText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },

    // Sections
    section: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
      letterSpacing: 0.9,
      marginBottom: 12,
    },
    sectionLink: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      marginBottom: 12,
    },

    // Budget vs Actual
    budgetCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    budgetRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    budgetActual: {
      fontSize: 26,
      fontFamily: "Inter_800ExtraBold" as any,
      color: colors.primary,
    },
    budgetGoal: {
      fontSize: 26,
      fontFamily: "Inter_800ExtraBold" as any,
      color: colors.foreground,
    },
    budgetLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    budgetDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
    },
    budgetTrack: {
      height: 8,
      backgroundColor: colors.muted,
      borderRadius: 4,
      overflow: "hidden",
    },
    budgetFill: {
      height: 8,
      borderRadius: 4,
    },
    budgetFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    budgetRemaining: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    budgetScanLink: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },

    // Streaks
    streakRow: {
      flexDirection: "row",
      gap: 10,
    },
    streakCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      gap: 2,
    },
    streakEmoji: { fontSize: 22, marginBottom: 2 },
    streakCount: {
      fontSize: 24,
      fontFamily: "Inter_800ExtraBold" as any,
    },
    streakDays: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    streakLabel: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 2,
    },

    // Quick actions
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    actionCard: {
      width: "30.5%",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    actionLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 2,
    },
    actionDesc: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 13,
    },

    // Weekly summary
    weekCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    weekGrid: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    },
    weekStat: {
      alignItems: "center",
      minWidth: 64,
      flex: 1,
    },
    weekStatVal: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    weekStatLabel: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
      textAlign: "center",
    },
    weekStatDivider: {
      width: 1,
      height: 32,
      backgroundColor: colors.border,
    },
    weekViewBtn: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
      alignItems: "center",
    },
    weekViewBtnText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },

    // Macros
    macroCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    macroSource: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: -4,
    },
    macroTotal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingTop: 4,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    macroTotalText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },

    // Current plan
    planCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    planCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    planIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "rgba(242,107,29,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    planName: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    planMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 3,
      gap: 6,
    },
    planMetaText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.mutedForeground,
    },
    emptyPlan: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    emptyPlanIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    emptyPlanTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    emptyPlanSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 19,
      paddingHorizontal: 10,
    },
    emptyPlanBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 11,
      borderRadius: 12,
      marginTop: 4,
    },
    emptyPlanBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
    },

    // Tip
    tipCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-start",
    },
    tipEmoji: { fontSize: 22, marginTop: 2 },
    tipLabel: {
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      letterSpacing: 0.8,
      marginBottom: 5,
    },
    tipText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
  });
