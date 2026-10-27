import { useSignIn } from "@clerk/expo/legacy";
import { useRouter } from "expo-router";
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
const GREEN = "#22C55E";

export default function ForgotPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRequestCode = async () => {
    if (!isLoaded) return;
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setStep("code");
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        JSON.stringify(err?.errors ?? err) ||
        "Could not send reset email. Please check the address and try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded) return;
    if (!code.trim() || !newPassword.trim()) {
      Alert.alert("Missing fields", "Please enter the code and your new password.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password: newPassword,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setDone(true);
        setTimeout(() => router.replace("/(tabs)" as never), 1500);
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ??
        err?.message ??
        "Reset failed. Please check the code and try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={[s.root, { backgroundColor: BG, alignItems: "center", justifyContent: "center" }]}>
        <View style={s.successWrap}>
          <Feather name="check-circle" size={56} color={GREEN} />
          <Text style={s.successTitle}>Password reset!</Text>
          <Text style={s.successSub}>Signing you in…</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[s.root, { backgroundColor: BG }]}
    >
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={WHITE} />
        </Pressable>

        {/* Heading */}
        <View style={s.headingWrap}>
          <Text style={s.heading}>
            {step === "email" ? "Reset password" : "Check your email"}
          </Text>
          <Text style={s.subheading}>
            {step === "email"
              ? "Enter your email and we'll send you a reset code."
              : `We sent a 6-digit code to ${email}. Enter it below with your new password.`}
          </Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          {step === "email" ? (
            <>
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
                    onSubmitEditing={handleRequestCode}
                    returnKeyType="send"
                  />
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.82 : 1 }]}
                onPress={handleRequestCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <>
                    <Feather name="send" size={16} color={WHITE} style={{ marginRight: 8 }} />
                    <Text style={s.btnText}>Send Reset Code</Text>
                  </>
                )}
              </Pressable>
            </>
          ) : (
            <>
              {/* Code */}
              <View style={s.field}>
                <Text style={s.label}>Reset code</Text>
                <View style={s.inputWrap}>
                  <Feather name="hash" size={15} color={MUTED} style={s.inputIcon} />
                  <TextInput
                    style={s.input}
                    placeholder="6-digit code"
                    placeholderTextColor={MUTED}
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={setCode}
                    maxLength={6}
                  />
                </View>
              </View>

              {/* New Password */}
              <View style={s.field}>
                <Text style={s.label}>New password</Text>
                <View style={s.inputWrap}>
                  <Feather name="lock" size={15} color={MUTED} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, { flex: 1 }]}
                    placeholder="At least 8 characters"
                    placeholderTextColor={MUTED}
                    secureTextEntry={!showPass}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    onSubmitEditing={handleResetPassword}
                    returnKeyType="done"
                  />
                  <Pressable onPress={() => setShowPass(!showPass)} style={s.eyeBtn}>
                    <Feather name={showPass ? "eye-off" : "eye"} size={15} color={MUTED} />
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [s.btn, { opacity: pressed || loading ? 0.82 : 1 }]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <>
                    <Feather name="check" size={16} color={WHITE} style={{ marginRight: 8 }} />
                    <Text style={s.btnText}>Reset Password</Text>
                  </>
                )}
              </Pressable>

              {/* Resend */}
              <Pressable
                style={s.resendBtn}
                onPress={() => setStep("email")}
              >
                <Text style={s.resendText}>Didn't get it? Try a different email</Text>
              </Pressable>
            </>
          )}
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
  subheading: { fontSize: 14, fontFamily: "Inter_400Regular", color: MUTED, marginTop: 6, lineHeight: 20 },

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
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: WHITE },
  eyeBtn: { padding: 4 },

  btn: {
    height: 52, borderRadius: 14, backgroundColor: ORANGE,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginTop: 4,
  },
  btnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: WHITE },

  resendBtn: { alignItems: "center", paddingVertical: 4 },
  resendText: { fontSize: 13, fontFamily: "Inter_400Regular", color: ORANGE },

  successWrap: { alignItems: "center", gap: 16 },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: WHITE },
  successSub: { fontSize: 15, fontFamily: "Inter_400Regular", color: MUTED },
});
