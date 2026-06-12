import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const colors = useColors();

  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={12}
      style={[s.btn, { backgroundColor: colors.accent }]}
    >
      <Feather
        name={resolvedTheme === "dark" ? "sun" : "moon"}
        size={20}
        color={colors.primary}
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
