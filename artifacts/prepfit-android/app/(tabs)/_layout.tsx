import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DemoBanner } from "@/components/DemoBanner";
import { TrialBanner } from "@/components/TrialBanner";
import { ScrollableTabBar } from "@/components/ScrollableTabBar";
import { AuthGate } from "@/components/AuthGate";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/lib/i18n";

const ORANGE = "#F26B1D";

function AppBar() {
  return (
    <View style={s.appbar}>
      <View style={s.appbarInner}>
        <View style={s.brandRow}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={s.brandLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={s.brand}>PrepFit</Text>
            <Text style={s.brandSub}>Simple Meal Prep · Gym & Fitness</Text>
          </View>
        </View>
        <LanguageToggle />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor="#0D1117" style="light" translucent />
      <View style={{ height: insets.top, backgroundColor: "#0D1117" }} />
      <DemoBanner />
      <TrialBanner />
      <AppBar />
      <AuthGate>
        <Tabs
          tabBar={(props: any) => <ScrollableTabBar {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Tabs.Screen name="index"   options={{ title: t.tabs.home }} />
          <Tabs.Screen name="planner" options={{ title: t.tabs.mealPlan }} />
          <Tabs.Screen name="grocery" options={{ title: t.tabs.grocery }} />
          <Tabs.Screen name="meals"   options={{ title: t.tabs.myMeals }} />
          <Tabs.Screen name="scan"    options={{ title: t.tabs.scan }} />
          <Tabs.Screen name="weight"  options={{ title: t.tabs.weight }} />
          <Tabs.Screen name="water"   options={{ title: t.tabs.water }} />
          <Tabs.Screen name="plans"   options={{ title: t.tabs.savedPlans }} />
          <Tabs.Screen name="guide"   options={{ title: t.tabs.guide }} />
        </Tabs>
      </AuthGate>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  appbar: {
    backgroundColor: ORANGE,
    paddingTop: 0,
  },
  appbarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  brand: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.4,
  },
  brandSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.82)",
    marginTop: 1,
  },
});
