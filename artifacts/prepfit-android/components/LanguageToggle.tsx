import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Pressable
      onPress={toggleLanguage}
      hitSlop={12}
      style={({ pressed }) => [s.btn, { opacity: pressed ? 0.75 : 1 }]}
    >
      <Text style={s.text}>{language === "en" ? "ES" : "EN"}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    minWidth: 36,
  },
  text: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
});
