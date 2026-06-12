import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDemoMode } from "@/lib/demo";
import { useColors } from "@/hooks/useColors";

interface AuthGateProps {
  children: React.ReactNode;
}

/**
 * Wraps screen content that requires a signed-in account.
 * When the user is unauthenticated and not in demo mode, shows a
 * "Sign in to continue" wall with Sign In + Create Account CTAs.
 * Demo-mode users are treated as authenticated for viewing purposes.
 */
export function AuthGate({ children }: AuthGateProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { isDemoMode } = useDemoMode();
  const colors = useColors();
  const router = useRouter();

  // While Clerk initialises, let children render (AuthGuard handles global redirect)
  if (!isLoaded) return <>{children}</>;

  // Signed-in real users and demo-mode users can see the screen
  if (isSignedIn || isDemoMode) return <>{children}</>;

  const s = styles(colors);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={s.card}>
        <View style={s.iconWrap}>
          <Text style={s.iconText}>👍</Text>
        </View>

        <Text style={s.headline}>Sign in to continue</Text>
        <Text style={s.description}>
          Create a free account to access all PrepFit features, save your meal plans, and track your progress.
        </Text>

        <Pressable
          style={({ pressed }) => [s.signInBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.push("/(auth)/sign-in" as never)}
        >
          <Text style={s.signInBtnText}>Sign In</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.createBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.push("/(auth)/sign-up" as never)}
        >
          <Text style={s.createBtnText}>Create Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    card: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 28,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },
    iconText: {
      fontSize: 34,
    },
    headline: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 8,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 21,
      marginBottom: 24,
    },
    signInBtn: {
      width: "100%",
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    signInBtnText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    createBtn: {
      width: "100%",
      height: 50,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    createBtnText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
  });
