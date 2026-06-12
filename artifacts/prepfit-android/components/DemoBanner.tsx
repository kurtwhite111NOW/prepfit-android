import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useDemoMode } from "@/lib/demo";

export function DemoBanner() {
  const { isDemoMode, exitDemo } = useDemoMode();
  const router = useRouter();

  if (!isDemoMode) return null;

  const handleSignUp = async () => {
    await exitDemo();
    router.replace("/(auth)/sign-up" as never);
  };

  return (
    <View style={s.banner}>
      <Feather name="eye" size={13} color="#fff" />
      <Text style={s.text}>Demo Mode — data is not saved</Text>
      <Pressable style={s.signUpBtn} onPress={handleSignUp}>
        <Text style={s.signUpText}>Sign Up Free</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#fff",
  },
  signUpBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  signUpText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});
