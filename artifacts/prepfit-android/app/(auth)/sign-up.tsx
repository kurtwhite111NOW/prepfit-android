import { useSignUp } from "@clerk/expo/legacy";
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

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email.trim(), password, firstName: firstName.trim() || undefined });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage ?? err?.message ?? "Sign up failed.";
      Alert.alert("Sign Up Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    if (!code.trim()) {
      Alert.alert("Missing code", "Please enter the verification code.");
      return;
    }
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)" as never);
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage ?? err?.message ?? "Verification failed.";
      Alert.alert("Verification Error", message);
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
            <Text style={s.iconText}>👍</Text>
          </View>
          <Text style={s.brand}>PrepFit</Text>
          <Text style={s.tagline}>Start your fitness journey</Text>
        </View>

        <View style={s.card}>
          {!pendingVerification ? (
            <>
              <Text style={s.title}>Create account</Text>
              <Text style={s.subtitle}>Join PrepFit today — it's free</Text>

              <View style={s.field}>
                <Text style={s.label}>First name (optional)</Text>
                <TextInput
                  style={s.input}
                  placeholder="Alex"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="words"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

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
                  placeholder="Min. 8 characters"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="go"
                  onSubmitEditing={handleSignUp}
                />
              </View>

              <Pressable
                style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.8 : 1 }]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={s.btnText}>Create Account</Text>
                )}
              </Pressable>

              <View style={s.footer}>
                <Text style={s.footerText}>Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <Pressable>
                    <Text style={s.link}>Sign In</Text>
                  </Pressable>
                </Link>
              </View>
            </>
          ) : (
            <>
              <Text style={s.title}>Verify your email</Text>
              <Text style={s.subtitle}>We sent a code to {email}</Text>

              <View style={s.field}>
                <Text style={s.label}>Verification code</Text>
                <TextInput
                  style={s.input}
                  placeholder="123456"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  returnKeyType="go"
                  onSubmitEditing={handleVerify}
                />
              </View>

              <Pressable
                style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.8 : 1 }]}
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={s.btnText}>Verify & Continue</Text>
                )}
              </Pressable>
            </>
          )}
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
