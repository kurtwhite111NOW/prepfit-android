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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const colors = useColors();
  const insets = useSafeAreaInsets();
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

  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Athlete";
  const activePlan = plans?.[0] ?? null;
  const latestWeight = weightEntries?.[0];

  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  const quickActions = [
    { icon: "calendar", label: "Meal Plan", route: "/(tabs)/planner", family: "feather" },
    { icon: "camera", label: "Scan Meal", route: "/(tabs)/scan", family: "feather" },
    { icon: "shopping-cart", label: "Grocery", route: "/(tabs)/grocery", family: "feather" },
    { icon: "trending-up", label: "Weight", route: "/(tabs)/weight", family: "feather" },
    { icon: "water", label: "Water", route: "/(tabs)/water", family: "community" },
    { icon: "clipboard", label: "Plans", route: "/(tabs)/plans", family: "feather" },
  ];

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.hero, { paddingTop: 20 }]}>
        <View style={s.heroRow}>
          <View>
            <Text style={s.greeting}>{greeting},</Text>
            <Text style={s.name}>{displayName} 💪</Text>
            <Text style={s.date}>{dayName}, {dateStr}</Text>
          </View>
          <Pressable
            style={s.avatarBtn}
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

        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={s.statValue}>{plans?.length ?? 0}</Text>
            <Text style={s.statLabel}>Plans</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={s.statValue}>{activePlan?.dailyCalories ?? "—"}</Text>
            <Text style={s.statLabel}>Daily kcal</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={s.statValue}>{latestWeight ? `${latestWeight.weight}` : "—"}</Text>
            <Text style={s.statLabel}>{latestWeight?.unit ?? "lbs"}</Text>
          </View>
        </View>
      </View>

      <View style={s.section}>
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
              <Text style={s.planCardLabel}>Active Plan</Text>
            </View>
            <Text style={s.planName}>{activePlan.name}</Text>
            <View style={s.planMeta}>
              <Text style={s.planMetaText}>{activePlan.mealsPerDay} meals/day</Text>
              <View style={s.dot} />
              <Text style={s.planMetaText}>{activePlan.dailyCalories} kcal/day</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [s.emptyPlan, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push("/(tabs)/planner" as never)}
          >
            <Feather name="plus-circle" size={28} color={colors.primary} />
            <Text style={s.emptyPlanText}>Create your first meal plan</Text>
            <Text style={s.emptyPlanSub}>AI-powered plans in seconds</Text>
          </Pressable>
        )}
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.grid}>
          {quickActions.map((action) => (
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
    avatarBtn: {},
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
    statCard: {
      flex: 1,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
    },
    statValue: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    statLabel: {
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
      marginBottom: 10,
      gap: 8,
    },
    planIconWrap: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    planCardLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    planName: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    planMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      gap: 8,
    },
    planMetaText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.mutedForeground,
    },
    emptyPlan: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 24,
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
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      textAlign: "center",
    },
  });
