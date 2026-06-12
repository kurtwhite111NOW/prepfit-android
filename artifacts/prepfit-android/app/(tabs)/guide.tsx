import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

type AccordionSection = {
  title: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  content: string;
};

const ACCORDION_SECTIONS: AccordionSection[] = [
  {
    title: "Getting Started",
    icon: "play-circle",
    content:
      "Sign in or create a free account to get started. Once in, head to the Meal Planner tab to generate your first meal plan. Everything else — the grocery list, saved plans, and dashboard — flows from there.",
  },
  {
    title: "Dashboard",
    icon: "home",
    content:
      "Your daily overview. See your active plan's calorie goal, latest weight, and quick-action shortcuts to every feature. The 'Your Current Plan' card shows your most recently saved plan.",
  },
  {
    title: "Meal Planner",
    icon: "calendar",
    content:
      "Set your meals per day (2–5) and daily calorie goal, then tap Generate Plan. It builds a full balanced plan in seconds with macros and ingredients for each meal. Tap Save Plan to store it.",
  },
  {
    title: "Grocery List",
    icon: "shopping-cart",
    content:
      "Automatically generated from your active meal plan. Organised by category (Produce, Protein, Pantry, etc.) with clean-brand suggestions like Bob's Red Mill, Siggi's, and Simple Truth. Tap items to check them off in-store.",
  },
  {
    title: "Scan Photo",
    icon: "camera",
    content:
      "Take a photo of any meal or upload from your gallery. It identifies the food, estimates calories, and lists ingredients with a confidence score. Tap Save to Journal to add it to My Meals.",
  },
  {
    title: "Weight",
    icon: "trending-up",
    content:
      "Log your body weight in lbs or kg. View a line chart of your last 10 entries, plus stats for current weight, last change, and total change. Add optional notes to each entry.",
  },
  {
    title: "Water",
    icon: "droplet",
    content:
      "Track your daily hydration against an 8-glass goal. The circular ring fills as you log glasses. Tap the glass icons or the Add Glass button. Progress resets automatically at midnight.",
  },
  {
    title: "Saved Plans",
    icon: "clipboard",
    content:
      "All your saved meal plans in one library. Tap any plan to see its full meal list with macros and ingredients. Swipe left to delete plans you no longer need.",
  },
];

function AccordionItem({ section }: { section: AccordionSection }) {
  const [open, setOpen] = useState(false);
  const colors = useColors();
  const s = accordionStyles(colors);

  return (
    <View style={s.item}>
      <Pressable style={s.header} onPress={() => setOpen((v) => !v)}>
        <View style={s.iconWrap}>
          <Feather name={section.icon} size={17} color={colors.primary} />
        </View>
        <Text style={s.title}>{section.title}</Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </Pressable>
      {open && <Text style={s.content}>{section.content}</Text>}
    </View>
  );
}

export default function GuideScreen() {
  const colors = useColors();
  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.content}
    >
      {/* Hero card */}
      <View style={s.heroCard}>
        <View style={s.heroTop}>
          <View style={s.heroIconWrap}>
            <Text style={{ fontSize: 32 }}>🥗</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.heroEyebrow}>Complete Guide</Text>
            <Text style={s.heroTitle}>PrepFit</Text>
            <Text style={s.heroSub}>User Guide</Text>
          </View>
        </View>
        <Text style={s.heroDesc}>
          Everything you need to know to get the most out of PrepFit — your meal prep and health tracking companion.
        </Text>
      </View>

      {/* Feature Guide accordion */}
      <Text style={s.sectionLabel}>Feature Guide</Text>
      <View style={s.accordion}>
        {ACCORDION_SECTIONS.map((section) => (
          <AccordionItem key={section.title} section={section} />
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const accordionStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 14,
      gap: 10,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    content: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
      paddingHorizontal: 14,
      paddingBottom: 14,
      paddingTop: 2,
    },
  });

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    content: { paddingBottom: 24 },

    heroCard: {
      backgroundColor: colors.sidebar,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: colors.radius,
      padding: 18,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginBottom: 12,
    },
    heroIconWrap: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.12)",
      alignItems: "center",
      justifyContent: "center",
    },
    heroEyebrow: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 2,
    },
    heroTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      lineHeight: 26,
    },
    heroSub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.6)",
    },
    heroDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
      lineHeight: 20,
    },

    sectionLabel: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 24,
      marginBottom: 10,
      marginHorizontal: 16,
    },

    accordion: {
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
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
