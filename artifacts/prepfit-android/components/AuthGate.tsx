import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
 * Central auth wall for the tab group (placed in (tabs)/_layout.tsx).
 *
 * States:
 *  • Loading  — Clerk or demo-mode not yet hydrated → spinner (no content flash)
 *  • Authed   — signed-in real user OR demo mode → render children
 *  • Wall     — fully loaded, not authed → "Sign in to continue" UI with
 *               orange Sign In + outlined Create Account CTAs matching prepfit.fit
 *
 * The global AuthGuard in app/_layout.tsx handles navigation-level redirects.
 * AuthGate provides the defensive in-screen UI layer that prevents any content
 * flash and delivers the correct wall UX if a user somehow reaches (tabs) while
 * unauthenticated (e.g. race between AuthGuard's router.replace and render).
 */
export function AuthGate({ children }: AuthGateProps) {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { isDemoMode, isLoaded: demoLoaded } = useDemoMode();
  const colors = useColors();
  const router = useRouter();

  const isFullyLoaded = clerkLoaded && demoLoaded;
  const isAuthed = isSignedIn || isDemoMode;

  const s = styles(colors);

  // While either Clerk or demo-mode context is still hydrating, show a neutral
  // loading spinner rather than flashing children or the wall prematurely.
  if (!isFullyLoaded) {
    return (
      <View style={[s.root, s.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Signed-in users and demo-mode users get full access to tab content.
  if (isAuthed) return <>{children}</>;

  // Unauthenticated + fully loaded → show the "Sign in to continue" wall.
  return (
    <View style={[s.root, s.center, { backgroundColor: colors.background }]}>
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
          onPress={() => router.replace("/(auth)" as never)}
        >
          <Text style={s.signInBtnText}>Sign In</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.createBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.replace("/(auth)/sign-up" as never)}
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
    },
    center: {
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
