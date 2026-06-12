import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

type FeatherName = React.ComponentProps<typeof Feather>["name"];
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type Feature = {
  icon: FeatherName | MCIName;
  family: "feather" | "community";
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: "home",
    family: "feather",
    title: "Dashboard",
    desc: "Your daily overview — active meal plan stats, quick-action buttons, and a snapshot of your progress.",
  },
  {
    icon: "calendar",
    family: "feather",
    title: "Meal Planner",
    desc: "Set meals per day and a daily calorie goal, then let AI generate a full balanced weekly plan in seconds.",
  },
  {
    icon: "shopping-cart",
    family: "feather",
    title: "Grocery List",
    desc: "AI builds a categorised shopping list from your active meal plan with clean-brand suggestions (Bob's Red Mill, Siggi's, etc.). Tap items to check them off in store.",
  },
  {
    icon: "camera",
    family: "feather",
    title: "Scan Photo",
    desc: "Take or upload a photo of any meal. AI identifies the food, estimates calories, and lists ingredients. Save it to your journal.",
  },
  {
    icon: "book",
    family: "feather",
    title: "My Meals",
    desc: "Every photo-scanned meal saved in one place — image, calorie count, ingredients, date, and your personal notes.",
  },
  {
    icon: "trending-up",
    family: "feather",
    title: "Weight Tracker",
    desc: "Log your body weight in lbs or kg. See a line-chart trend over time, plus stats for current weight, total change, and last change.",
  },
  {
    icon: "water" as MCIName,
    family: "community",
    title: "Water Tracker",
    desc: "Set a daily hydration goal and tap to log each glass. The ring fills as you hit your target — staying hydrated is half the battle.",
  },
  {
    icon: "clipboard",
    family: "feather",
    title: "Saved Plans",
    desc: "All your generated meal plans in one library. Tap any plan to view its meals, or swipe to delete plans you no longer need.",
  },
];

const TIPS = [
  "Start with the Meal Planner to generate your first plan — the Grocery List and Dashboard fill in automatically.",
  "Scan a meal photo before eating for a quick calorie check. Tap Save to keep it in My Meals.",
  "Log your weight at the same time every day (e.g. morning) for the most accurate trend.",
  "Use the Water Tracker goal to match your body weight ÷ 2 in ounces as a starting point.",
  "Tap the ☀/🌙 button in the top bar to switch between Light and Dark mode anytime.",
];

export default function GuideScreen() {
  const colors = useColors();
  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.content}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>User Guide</Text>
        <Text style={s.headerSub}>Read Me First — everything you need to know</Text>
      </View>

      {/* Welcome card */}
      <View style={s.welcomeCard}>
        <Text style={s.welcomeTitle}>👋 Welcome to PrepFit!</Text>
        <Text style={s.welcomeText}>
          PrepFit is your all-in-one gym and nutrition companion. Use the
          scrollable tab bar at the bottom to jump between features. Here's
          what each one does:
        </Text>
      </View>

      {/* Features */}
      <Text style={s.sectionTitle}>Features</Text>
      {FEATURES.map((f) => (
        <View key={f.title} style={s.featureCard}>
          <View style={s.featureIcon}>
            {f.family === "community" ? (
              <MaterialCommunityIcons
                name={f.icon as MCIName}
                size={22}
                color={colors.primary}
              />
            ) : (
              <Feather name={f.icon as FeatherName} size={22} color={colors.primary} />
            )}
          </View>
          <View style={s.featureText}>
            <Text style={s.featureTitle}>{f.title}</Text>
            <Text style={s.featureDesc}>{f.desc}</Text>
          </View>
        </View>
      ))}

      {/* Tips */}
      <Text style={s.sectionTitle}>Tips &amp; Tricks</Text>
      <View style={s.tipsCard}>
        {TIPS.map((tip, i) => (
          <View key={i} style={s.tipRow}>
            <View style={s.tipBullet}>
              <Text style={s.tipNum}>{i + 1}</Text>
            </View>
            <Text style={s.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Support */}
      <Text style={s.sectionTitle}>Support</Text>
      <View style={s.supportCard}>
        <Text style={s.supportText}>
          Have a question or ran into an issue? We're here to help.
        </Text>
        <Pressable
          style={s.supportBtn}
          onPress={() => Linking.openURL("mailto:support@prepfit.fit")}
        >
          <Feather name="mail" size={16} color="#fff" />
          <Text style={s.supportBtnText}>Email Support</Text>
        </Pressable>
        <Pressable
          style={[s.supportBtn, s.supportBtnOutline]}
          onPress={() => Linking.openURL("https://prepfit.fit")}
        >
          <Feather name="globe" size={16} color={colors.primary} />
          <Text style={[s.supportBtnText, { color: colors.primary }]}>
            Visit prepfit.fit
          </Text>
        </Pressable>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function styles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1 },
    content: { paddingBottom: 24 },
    header: {
      backgroundColor: colors.sidebar,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 22,
    },
    headerTitle: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: "#fff",
      marginBottom: 4,
    },
    headerSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.6)",
    },
    welcomeCard: {
      margin: 16,
      marginBottom: 4,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    welcomeTitle: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 8,
    },
    welcomeText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 21,
    },
    sectionTitle: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 20,
      marginBottom: 8,
      marginHorizontal: 16,
    },
    featureCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginHorizontal: 16,
      marginBottom: 10,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    featureText: { flex: 1 },
    featureTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
    },
    featureDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    tipsCard: {
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 14,
    },
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    tipBullet: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginTop: 1,
    },
    tipNum: {
      fontSize: 12,
      fontFamily: "Inter_700Bold",
      color: "#fff",
    },
    tipText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    supportCard: {
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    supportText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    supportBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 12,
    },
    supportBtnOutline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    supportBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
  });
}
