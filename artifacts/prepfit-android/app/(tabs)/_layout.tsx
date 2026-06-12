import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DemoBanner } from "@/components/DemoBanner";
import { ScrollableTabBar } from "@/components/ScrollableTabBar";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/lib/theme";

const ORANGE = "#F26B1D";

function AppBar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.appbar, { paddingTop: insets.top }]}>
      <View style={s.appbarInner}>
        <View>
          <Text style={s.brand}>PrepFit</Text>
          <Text style={s.brandSub}>Gym &amp; Fitness</Text>
        </View>
        <Pressable onPress={toggleTheme} hitSlop={14} style={s.toggleBtn}>
          <Feather
            name={resolvedTheme === "dark" ? "sun" : "moon"}
            size={20}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={ORANGE} style="light" translucent />
      <DemoBanner />
      <AppBar />
      <Tabs
        tabBar={(props: any) => <ScrollableTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index"   options={{ title: "Home" }} />
        <Tabs.Screen name="planner" options={{ title: "Meal Plan" }} />
        <Tabs.Screen name="grocery" options={{ title: "Grocery" }} />
        <Tabs.Screen name="meals"   options={{ title: "My Meals" }} />
        <Tabs.Screen name="scan"    options={{ title: "Scan Photo" }} />
        <Tabs.Screen name="weight"  options={{ title: "Weight" }} />
        <Tabs.Screen name="water"   options={{ title: "Water" }} />
        <Tabs.Screen name="plans"   options={{ title: "Saved Plans" }} />
        <Tabs.Screen name="guide"   options={{ title: "User Guide" }} />
      </Tabs>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  appbar: {
    backgroundColor: ORANGE,
  },
  appbarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brand: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.4,
  },
  brandSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.82)",
    marginTop: 1,
  },
  toggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
});
