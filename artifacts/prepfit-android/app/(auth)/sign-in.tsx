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
import { Feather } from "@expo/vector-icons";

const ORANGE = "#F26B1D";
const BG = "#0D1117";
const CARD = "#161B22";
const BORDER = "rgba(255,255,255,0.08)";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.45)";
const INPUT_BG = "#0D1117";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [needsSecondFactor, setNeedsSecondFactor] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const clerkErr = (err: any): string =>
    err?.errors?.[0]?.longMessage ||
    err?.errors?.[0]?.message ||
    err?.message ||
    JSON.stringify(err?.errors ?? err) ||
    "Something went wrong. Please try again.";

  const handleSignIn = async () => {
    if (!isLoaded) {
      Alert.alert("Not ready", "Authentication is still loading.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn!.create({ identifier: email.trim(), password });
      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        router.replace("/(tabs)" as never);
      } else if (result.status === "needs_second_factor") {
        await signIn!.prepareSecondFactor({ strategy: "email_code" });
        setNeedsSecondFactor(true);
      } else {
        Alert.alert("Sign In Error", `Unexpected status: ${result.status}`);
      }
    } catch (err: any) {
      Alert.alert("Sign In Error", clerkErr(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isLoaded || !otpCode.trim()) {
      Alert.alert("Missing code", "Please enter the verification code.");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn!.attemptSecondFactor({
        strategy: "email_code",
        code: otpCode.trim(),
      });
      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        router.replace("/(tabs)" as never);
      } else {
        Alert.alert("Verification Error", `Unexpected status: ${result.status}`);
      }
    } catch (err: any) {
      Alert.alert("Verification Error", clerkErr(err));
    } finally {
      setLoading(false);
    }
  };

  if (needsSecondFactor) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[s.root, { backgroundColor: BG }]}
      >
        <ScrollView
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={s.backBtn} onPress={() => setNeedsSecondFactor(false)}>
            <Feather name="arrow-left" size={20} color={WHITE} />
          </Pressable>

          <View style={s.headingWrap}>
            <Text style={s.heading}>Check your email</Text>
            <Text style={s.subheading}>
              We sent a verification code to{"\n"}{email}
            </Text>
          </View>

          <View style={s.card}>
            <View style={s.field}>
              <Text style={s.label}>Verification code</Text>
              <View style={s.inputWrap}>
                <Feather name="shield" size={15} color={MUTED} style={s.inputIcon} />
                <TextInput
                  style={[s.input, { letterSpacing: 8, fontSize: 20 }]}
                  placeholder="123456"
                  placeholderTextColor={MUTED}
                  keyboardType="number-pad"
                  value={otpCode}
                  onChangeText={setOtpCode}
                  maxLength={6}
                  autoFocus
                  returnKeyType="go"
                  onSubmitEditing={handleVerifyOtp}
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.82 : 1 }]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <>
                  <Feather name="check-circle" size={16} color={WHITE} style={{ marginRight: 8 }} />
                  <Text style={s.btnText}>Verify & Sign In</Text>
                </>
              )}
            </Pressable>

            <Text style={s.hint}>
              This is a one-time security check for new devices.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[s.root, { backgroundColor: BG }]}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={WHITE} />
        </Pressable>

        <View style={s.headingWrap}>
          <Text style={s.heading}>Welcome back</Text>
          <Text style={s.subheading}>Sign in to your PrepFit account</Text>
        </View>

        <View style={s.card}>
          <View style={s.field}>
            <Text style={s.label}>Email address</Text>
            <View style={s.inputWrap}>
              <Feather name="mail" size={15} color={MUTED} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="you@example.com"
                placeholderTextColor={MUTED}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Password</Text>
            <View style={s.inputWrap}>
              <Feather name="lock" size={15} color={MUTED} style={s.inputIcon} />
              <TextInput
                style={[s.input, { flex: 1 }]}
                placeholder="Your password"
                placeholderTextColor={MUTED}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleSignIn}
                returnKeyType="go"
              />
              <Pressable onPress={() => setShowPass(!showPass)} style={s.eyeBtn}>
                <Feather name={showPass ? "eye-off" : "eye"} size={15} color={MUTED} />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.82 : 1 }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={WHITE} />
            ) : (
              <>
                <Feather name="log-in" size={16} color={WHITE} style={{ marginRight: 8 }} />
                <Text style={s.btnText}>Sign In</Text>
              </>
            )}
          </Pressable>

          <Link href="/(auth)/forgot-password" asChild>
            <Pressable style={s.forgotBtn}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </Pressable>
          </Link>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account?</Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text style={s.link}> Sign Up Free</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },

  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 28,
  },

  headingWrap: { marginBottom: 28 },
  heading: { fontSize: 28, fontFamily: "Inter_700Bold", color: WHITE, letterSpacing: -0.5 },
  subheading: { fontSize: 14, fontFamily: "Inter_400Regular", color: MUTED, marginTop: 4, lineHeight: 20 },

  card: {
    backgroundColor: CARD, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER,
    padding: 20, gap: 16, marginBottom: 24,
  },

  field: { gap: 6 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.65)", letterSpacing: 0.3 },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    height: 50, borderRadius: 12,
    borderWidth: 1, borderColor: BORDER,
    backgroundColor: INPUT_BG, paddingHorizontal: 14, gap: 10,
  },
  inputIcon: {},
  input: {
    flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: WHITE,
  },
  eyeBtn: { padding: 4 },

  btn: {
    height: 52, borderRadius: 14, backgroundColor: ORANGE,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginTop: 4,
  },
  btnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: WHITE },

  forgotBtn: { alignItems: "center", paddingVertical: 4 },
  forgotText: { fontSize: 13, fontFamily: "Inter_400Regular", color: ORANGE },

  hint: {
    fontSize: 12, fontFamily: "Inter_400Regular",
    color: MUTED, textAlign: "center", lineHeight: 17,
  },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { fontSize: 14, fontFamily: "Inter_400Regular", color: MUTED },
  link: { fontSize: 14, fontFamily: "Inter_700Bold", color: ORANGE },
});
