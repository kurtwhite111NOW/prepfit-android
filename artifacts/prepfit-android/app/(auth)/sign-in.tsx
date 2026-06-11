import { useSignIn } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded) return;
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)" as never);
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage ?? err?.message ?? "Sign in failed. Please try again.";
      Alert.alert("Sign In Error", message);
    } finally {
      setLoading(false);
    }
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[s.root, { backgroundColor: colors.sidebar }]}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.iconWrap}>
            <Text style={s.iconText}>💪</Text>
          </View>
          <Text style={s.brand}>PrepFit</Text>
          <Text style={s.tagline}>Your AI Fitness Meal Planner</Text>
        </View>

        <View style={s.card}>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>Sign in to continue</Text>

          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Password</Text>
            <TextInput
              style={s.input}
              placeholder="Your password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleSignIn}
              returnKeyType="go"
            />
          </View>

          <Pressable
            style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.8 : 1 }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={s.btnText}>Sign In</Text>
            )}
          </Pressable>

          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text style={s.link}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: 24, justifyContent: "center" },
    header: { alignItems: "center", marginBottom: 32 },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    iconText: { fontSize: 36 },
    brand: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      letterSpacing: -0.5,
    },
    tagline: {
      fontSize: 14,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
      marginTop: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 24,
    },
    title: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 24,
    },
    field: { marginBottom: 16 },
    label: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 6,
    },
    input: {
      height: 48,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.background,
    },
    btn: {
      height: 50,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    btnText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    footerText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    link: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
  });
