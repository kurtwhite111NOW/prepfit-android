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
import { Feather } from "@expo/vector-icons";

const ORANGE = "#F26B1D";
const BG = "#0D1117";
const CARD = "#161B22";
const BORDER = "rgba(255,255,255,0.08)";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.45)";
const INPUT_BG = "#0D1117";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) {
      Alert.alert("Not ready", "Authentication is still loading. Please wait a moment and try again.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: firstName.trim() || undefined,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        JSON.stringify(err?.errors ?? err) ||
        "Sign up failed.";
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
        {/* Back */}
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={WHITE} />
        </Pressable>

        {!pendingVerification ? (
          <>
            {/* Heading */}
            <View style={s.headingWrap}>
              <Text style={s.heading}>Start free today</Text>
              <Text style={s.subheading}>3-day free trial — cancel anytime</Text>
            </View>

            {/* Trial badge */}
            <View style={s.trialBadge}>
              <Feather name="zap" size={13} color={ORANGE} />
              <Text style={s.trialBadgeText}>Full access to all features during your trial</Text>
            </View>

            {/* Card */}
            <View style={s.card}>
              {/* First name */}
              <View style={s.field}>
                <Text style={s.label}>First name <Text style={s.optional}>(optional)</Text></Text>
                <View style={s.inputWrap}>
                  <Feather name="user" size={15} color={MUTED} style={s.inputIcon} />
                  <TextInput
                    style={s.input}
                    placeholder="Alex"
                    placeholderTextColor={MUTED}
                    autoCapitalize="words"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>

              {/* Email */}
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

              {/* Password */}
              <View style={s.field}>
                <Text style={s.label}>Password</Text>
                <View style={s.inputWrap}>
                  <Feather name="lock" size={15} color={MUTED} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, { flex: 1 }]}
                    placeholder="Min. 8 characters"
                    placeholderTextColor={MUTED}
                    secureTextEntry={!showPass}
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="go"
                    onSubmitEditing={handleSignUp}
                  />
                  <Pressable onPress={() => setShowPass(!showPass)} style={s.eyeBtn}>
                    <Feather name={showPass ? "eye-off" : "eye"} size={15} color={MUTED} />
                  </Pressable>
                </View>
              </View>

              {/* Sign Up Button */}
              <Pressable
                style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.82 : 1 }]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <>
                    <Feather name="zap" size={16} color={WHITE} style={{ marginRight: 8 }} />
                    <Text style={s.btnText}>Create Free Account</Text>
                  </>
                )}
              </Pressable>

              <Text style={s.terms}>
                By signing up you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>

            {/* Footer */}
            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text style={s.link}> Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </>
        ) : (
          <>
            {/* Verify heading */}
            <View style={s.headingWrap}>
              <Text style={s.heading}>Check your email</Text>
              <Text style={s.subheading}>We sent a 6-digit code to</Text>
              <Text style={s.emailHighlight}>{email}</Text>
            </View>

            <View style={s.card}>
              <View style={s.field}>
                <Text style={s.label}>Verification code</Text>
                <View style={[s.inputWrap, s.codeInputWrap]}>
                  <Feather name="shield" size={15} color={MUTED} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, s.codeInput]}
                    placeholder="123456"
                    placeholderTextColor={MUTED}
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={setCode}
                    returnKeyType="go"
                    onSubmitEditing={handleVerify}
                    maxLength={6}
                  />
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.82 : 1 }]}
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <>
                    <Feather name="check-circle" size={16} color={WHITE} style={{ marginRight: 8 }} />
                    <Text style={s.btnText}>Verify & Start Trial</Text>
                  </>
                )}
              </Pressable>

              <Pressable onPress={() => setPendingVerification(false)} style={s.resendBtn}>
                <Text style={s.resendText}>← Use a different email</Text>
              </Pressable>
            </View>
          </>
        )}
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

  headingWrap: { marginBottom: 16 },
  heading: { fontSize: 28, fontFamily: "Inter_700Bold", color: WHITE, letterSpacing: -0.5 },
  subheading: { fontSize: 14, fontFamily: "Inter_400Regular", color: MUTED, marginTop: 4 },
  emailHighlight: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: ORANGE, marginTop: 2 },

  trialBadge: {
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: "rgba(242,107,29,0.1)",
    borderWidth: 1, borderColor: "rgba(242,107,29,0.3)",
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    marginBottom: 18, alignSelf: "flex-start",
  },
  trialBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: ORANGE },

  card: {
    backgroundColor: CARD, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER,
    padding: 20, gap: 16, marginBottom: 24,
  },

  field: { gap: 6 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.65)", letterSpacing: 0.3 },
  optional: { fontFamily: "Inter_400Regular", color: MUTED },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    height: 50, borderRadius: 12,
    borderWidth: 1, borderColor: BORDER,
    backgroundColor: INPUT_BG, paddingHorizontal: 14, gap: 10,
  },
  codeInputWrap: {},
  inputIcon: {},
  input: {
    flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: WHITE,
  },
  codeInput: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: 8 },
  eyeBtn: { padding: 4 },

  btn: {
    height: 52, borderRadius: 14, backgroundColor: ORANGE,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginTop: 4,
  },
  btnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: WHITE },

  terms: {
    fontSize: 11, fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 16,
    marginTop: -4,
  },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { fontSize: 14, fontFamily: "Inter_400Regular", color: MUTED },
  link: { fontSize: 14, fontFamily: "Inter_700Bold", color: ORANGE },

  resendBtn: { alignItems: "center", marginTop: -4 },
  resendText: { fontSize: 13, fontFamily: "Inter_500Medium", color: MUTED },
});
