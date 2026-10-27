import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/lib/theme";

type TabRoute = { key: string; name: string };
type TabBarProps = {
  state: { routes: TabRoute[]; index: number };
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

type TabConfig = {
  label: string;
  icon: string;
  family: "feather" | "community";
};

const TAB_CONFIG: Record<string, TabConfig> = {
  index:   { label: "Home",        icon: "home",          family: "feather"    },
  planner: { label: "Meal Plan",   icon: "calendar",      family: "feather"    },
  grocery: { label: "Grocery",     icon: "shopping-cart", family: "feather"    },
  meals:   { label: "My Meals",    icon: "book",          family: "feather"    },
  scan:    { label: "Scan Photo",  icon: "camera",        family: "feather"    },
  weight:  { label: "Weight",      icon: "trending-up",   family: "feather"    },
  water:   { label: "Water",       icon: "water",         family: "community"  },
  plans:   { label: "Saved Plans", icon: "clipboard",     family: "feather"    },
  guide:   { label: "User Guide",  icon: "help-circle",   family: "feather"    },
};

const VISIBLE_TABS = 5;
const ORANGE = "#F26B1D";
const SIDEBAR = "#12151A";
const SIDEBAR_BORDER = "#2A3040";

export function ScrollableTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const tabWidth = screenWidth / VISIBLE_TABS;
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll to center the active tab whenever navigation changes it —
  // covers card taps, programmatic navigation, and direct tab presses.
  useEffect(() => {
    const scrollTo = Math.max(0, (state.index - Math.floor(VISIBLE_TABS / 2)) * tabWidth);
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: scrollTo, animated: true });
    }, 80);
    return () => clearTimeout(t);
  }, [state.index, tabWidth]);

  const onPress = (route: TabRoute, index: number, focused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!focused && !event.defaultPrevented) {
      navigation.navigate(route.name);
      const scrollTo = Math.max(0, (index - Math.floor(VISIBLE_TABS / 2)) * tabWidth);
      scrollRef.current?.scrollTo({ x: scrollTo, animated: true });
    }
  };

  return (
    <View style={[s.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={tabWidth}
        snapToAlignment="start"
      >
        {state.routes.map((route, index) => {
          const cfg = TAB_CONFIG[route.name];
          const focused = state.index === index;
          const color = focused ? ORANGE : "rgba(232,234,240,0.55)";

          return (
            <Pressable
              key={route.key}
              onPress={() => onPress(route, index, focused)}
              style={[s.tab, { width: tabWidth }]}
            >
              {focused && <View style={s.activeBar} />}
              <View style={[s.iconWrap, { backgroundColor: focused ? "rgba(242,107,29,0.15)" : "transparent" }]}>
                {cfg.family === "community" ? (
                  <MaterialCommunityIcons name={cfg.icon as any} size={20} color={color} />
                ) : (
                  <Feather name={cfg.icon as any} size={20} color={color} />
                )}
              </View>
              <Text style={[s.label, { color, fontFamily: focused ? "Inter_600SemiBold" : "Inter_400Regular" }]} numberOfLines={1}>
                {cfg.label}
              </Text>
            </Pressable>
          );
        })}

        {/* Theme toggle — always visible at the end of the tab strip */}
        <Pressable onPress={toggleTheme} style={[s.tab, { width: tabWidth }]}>
          <View style={s.iconWrap}>
            <Feather
              name={resolvedTheme === "dark" ? "sun" : "moon"}
              size={20}
              color={ORANGE}
            />
          </View>
          <Text style={[s.label, { color: ORANGE, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
            {resolvedTheme === "dark" ? "Light" : "Dark"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: SIDEBAR,
    borderTopWidth: 1,
    borderTopColor: SIDEBAR_BORDER,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 6,
    position: "relative",
  },
  activeBar: {
    position: "absolute",
    top: 0,
    left: "20%",
    right: "20%",
    height: 2,
    borderRadius: 2,
    backgroundColor: ORANGE,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontSize: 9,
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
