import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

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

export function ScrollableTabBar({ state, navigation }: TabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        bounces={false}
      >
        {state.routes.map((route, index) => {
          const cfg = TAB_CONFIG[route.name];
          const focused = state.index === index;
          const color = focused ? colors.primary : colors.mutedForeground;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[s.tab, focused && { borderTopColor: colors.primary }]}
            >
              <View
                style={[
                  s.iconWrap,
                  { backgroundColor: focused ? colors.accent : "transparent" },
                ]}
              >
                {cfg.family === "community" ? (
                  <MaterialCommunityIcons
                    name={cfg.icon as any}
                    size={20}
                    color={color}
                  />
                ) : (
                  <Feather name={cfg.icon as any} size={20} color={color} />
                )}
              </View>
              <Text
                style={[
                  s.label,
                  {
                    color,
                    fontFamily: focused ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
                numberOfLines={1}
              >
                {cfg.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
    minWidth: 68,
    borderTopWidth: 2,
    borderTopColor: "transparent",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    textAlign: "center",
  },
});
