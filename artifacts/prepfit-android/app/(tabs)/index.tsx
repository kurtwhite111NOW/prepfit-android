import { useUser, useClerk } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import {
  getListMealPlansQueryKey,
  getListWeightEntriesQueryKey,
  listMealPlans,
  listWeightEntries,
} from "@workspace/api-client-react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const QUICK_ACTIONS = [
  { icon: "calendar",       label: "Build a Meal Plan",  route: "/(tabs)/planner", family: "feather",    emoji: "🍽" },
  { icon: "camera",         label: "Scan a Meal",        route: "/(tabs)/scan",    family: "feather",    emoji: "📷" },
  { icon: "shopping-cart",  label: "Grocery List",       route: "/(tabs)/grocery", family: "feather",    emoji: "🛒" },
  { icon: "water",          label: "Water Tracker",      route: "/(tabs)/water",   family: "community",  emoji: "💧" },
  { icon: "trending-up",    label: "Track Weight",       route: "/(tabs)/weight",  family: "feather",    emoji: "📈" },
  { icon: "clipboard",      label: "Saved Plans",        route: "/(tabs)/plans",   family: "feather",    emoji: "🔖" },
];

export default function DashboardScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const colors = useColors();
  const router = useRouter();

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: getListMealPlansQueryKey(),
    queryFn: () => listMealPlans(),
  });

  const { data: weightEntries } = useQuery({
    queryKey: getListWeightEntriesQueryKey(),
    queryFn: () => listWeightEntries(),
  });

  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const dateStr = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Athlete";
  const activePlan = plans?.[0] ?? null;
  const latestWeight = weightEntries?.[0];

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={s.hero}>
        <View style={s.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.greeting}>{greeting},</Text>
            <Text style={s.name}>{displayName} 💪</Text>
            <Text style={s.date}>{dayName}, {dateStr}</Text>
          </View>
          <Pressable
            onPress={() =>
              Alert.alert("Account", `Signed in as ${user?.emailAddresses?.[0]?.emailAddress}`, [
                { text: "Sign Out", style: "destructive", onPress: () => signOut() },
                { text: "Cancel", style: "cancel" },
              ])
            }
          >
            <View style={s.avatar}>
              <Text style={s.avatarText}>{displayName[0]?.toUpperCase()}</Text>
            </View>
          </Pressable>
        </View>

        {/* Quick stats strip */}
        <View style={s.statsRow}>
          <View style={s.statPill}>
            <Text style={s.statPillVal}>{plans?.length ?? 0}</Text>
            <Text style={s.statPillLabel}>Plans</Text>
          </View>
          <View style={s.statPill}>
            <Text style={s.statPillVal}>{activePlan?.dailyCalories ?? "—"}</Text>
            <Text style={s.statPillLabel}>kcal goal</Text>
          </View>
          <View style={s.statPill}>
            <Text style={s.statPillVal}>{latestWeight ? `${latestWeight.weight}` : "—"}</Text>
            <Text style={s.statPillLabel}>{latestWeight?.unit ?? "lbs"}</Text>
          </View>
        </View>
      </View>

      {/* What do you want to do */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>What do you want to do?</Text>
        <View style={s.grid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.label}
              style={({ pressed }) => [s.actionCard, { opacity: pressed ? 0.85 : 1 }]}
              onPress={() => router.push(action.route as never)}
            >
              <View style={s.actionIcon}>
                {action.family === "community" ? (
                  <MaterialCommunityIcons name={action.icon as any} size={22} color={colors.primary} />
                ) : (
                  <Feather name={action.icon as any} size={22} color={colors.primary} />
                )}
              </View>
              <Text style={s.actionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Your Current Plan */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Your Current Plan</Text>
        {plansLoading ? (
          <View style={[s.planCard, { justifyContent: "center", alignItems: "center", height: 100 }]}>
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
            <Feather name="plus-circle" size={28} color={colors.primary} />
            <Text style={s.emptyPlanText}>Build My First Plan</Text>
            <Text style={s.emptyPlanSub}>Smart meal plans in seconds</Text>
          </Pressable>
        )}
      </View>

      {/* Daily tip */}
      <View style={s.section}>
        <View style={s.tipCard}>
          <View style={s.tipIconWrap}>
            <Text style={{ fontSize: 18 }}>💡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.tipTitle}>Daily Tip</Text>
            <Text style={s.tipText}>
              Start with the Meal Planner to generate your first plan — your Grocery List fills in automatically.
            </Text>
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
    hero: {
      backgroundColor: colors.sidebar,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
    },
    heroRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    greeting: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.6)",
    },
    name: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      marginTop: 2,
    },
    date: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.5)",
      marginTop: 4,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: "#FFF",
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
    },
    statPill: {
      flex: 1,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
    statPillVal: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    statPillLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.6)",
      marginTop: 2,
    },
    section: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 12,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    actionCard: {
      width: "30.5%",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    actionLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      textAlign: "center",
    },
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
      gap: 10,
    },
    planIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.accent,
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
      padding: 28,
      alignItems: "center",
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.primary,
    },
    emptyPlanText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginTop: 10,
    },
    emptyPlanSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
      textAlign: "center",
    },
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
    tipIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    tipTitle: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    tipText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
  });
