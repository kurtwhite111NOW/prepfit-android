import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDemoMode } from "@/lib/demo";

const ORANGE = "#F26B1D";
const ORANGE_DARK = "#C9540F";
const BG = "#0D1117";
const CARD = "#161B22";
const BORDER = "rgba(255,255,255,0.08)";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.55)";
const TRIAL_KEY = "prepfit_trial_start";
const TRIAL_DAYS = 3;

const { width: SCREEN_W } = Dimensions.get("window");

const FEATURES = [
  { icon: "calendar", label: "Smart Meal Planning", desc: "Weekly plans tailored to your calorie goals" },
  { icon: "shopping-cart", label: "Smart Grocery Lists", desc: "Auto-generated with clean-brand suggestions" },
  { icon: "camera", label: "Photo Calorie Scanner", desc: "Snap a meal — get instant calorie breakdown" },
  { icon: "trending-up", label: "Weight & Progress Tracking", desc: "Charts, BMI calculator, progress photos" },
  { icon: "droplet", label: "Water & Streak Tracking", desc: "Hit daily goals and build lasting habits" },
];

function useTrialCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 0, mins: 0, secs: 0, started: false });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function init() {
      let startStr = await AsyncStorage.getItem(TRIAL_KEY);
      if (!startStr) {
        startStr = Date.now().toString();
        await AsyncStorage.setItem(TRIAL_KEY, startStr);
      }
      const start = parseInt(startStr, 10);
      const end = start + TRIAL_DAYS * 24 * 60 * 60 * 1000;

      function tick() {
        const now = Date.now();
        const diff = Math.max(0, end - now);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, mins, secs, started: true });
      }

      tick();
      interval = setInterval(tick, 1000);
    }

    init();
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={s.countUnit}>
      <View style={s.countBox}>
        <Text style={s.countNum}>{String(value).padStart(2, "0")}</Text>
      </View>
      <Text style={s.countLabel}>{label}</Text>
    </View>
  );
}

export default function HeroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { enterDemo } = useDemoMode();
  const trial = useTrialCountdown();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleDemo = async () => {
    await enterDemo();
    router.replace("/(tabs)" as never);
  };

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ── */}
        <Animated.View style={[s.heroHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={s.logo}
            resizeMode="contain"
          />
          <Text style={s.brand}>PrepFit</Text>
          <Text style={s.tagline}>Meal Prep · Gym & Fitness</Text>
          <Text style={s.heroDesc}>
            The all-in-one fitness companion for busy people who want to eat clean, track progress, and feel great.
          </Text>
        </Animated.View>

        {/* ── 3-Day Trial Countdown ── */}
        {trial.started && (
          <Animated.View style={[s.trialCard, { opacity: fadeAnim }]}>
            <View style={s.trialHeader}>
              <Feather name="clock" size={14} color={ORANGE} />
              <Text style={s.trialTitle}>Your 3-Day Free Trial</Text>
            </View>
            <View style={s.countdown}>
              <CountdownUnit value={trial.days} label="DAYS" />
              <Text style={s.countSep}>:</Text>
              <CountdownUnit value={trial.hours} label="HRS" />
              <Text style={s.countSep}>:</Text>
              <CountdownUnit value={trial.mins} label="MIN" />
              <Text style={s.countSep}>:</Text>
              <CountdownUnit value={trial.secs} label="SEC" />
            </View>
            <Text style={s.trialNote}>
              Full access to all features — no charge until your trial ends
            </Text>
          </Animated.View>
        )}

        {/* ── Feature Highlights ── */}
        <View style={s.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={f.icon} style={[s.featureRow, i < FEATURES.length - 1 && s.featureDivider]}>
              <View style={s.featureIconWrap}>
                <Feather name={f.icon as any} size={16} color={ORANGE} />
              </View>
              <View style={s.featureText}>
                <Text style={s.featureLabel}>{f.label}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
              </View>
              <Feather name="check-circle" size={15} color={ORANGE} />
            </View>
          ))}
        </View>

        {/* ── CTAs ── */}
        <View style={s.ctaGroup}>
          <Pressable
            style={({ pressed }) => [s.primaryBtn, { opacity: pressed ? 0.88 : 1 }]}
            onPress={() => router.push("/(auth)/sign-up" as never)}
          >
            <Feather name="zap" size={17} color={WHITE} style={{ marginRight: 8 }} />
            <Text style={s.primaryBtnText}>Start Free Trial — 3 Days Free</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.secondaryBtn, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => router.push("/(auth)/sign-in" as never)}
          >
            <Feather name="log-in" size={15} color={ORANGE} style={{ marginRight: 7 }} />
            <Text style={s.secondaryBtnText}>I already have an account</Text>
          </Pressable>

          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [s.demoBtn, { opacity: pressed ? 0.75 : 1 }]}
            onPress={handleDemo}
          >
            <Feather name="eye" size={15} color={MUTED} style={{ marginRight: 7 }} />
            <Text style={s.demoBtnText}>Explore without an account</Text>
          </Pressable>
        </View>

        {/* ── Fine print ── */}
        <Text style={s.finePrint}>
          After 3 days, $9.99/month. Cancel anytime. No commitment.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, alignItems: "center" },

  heroHeader: { alignItems: "center", marginBottom: 24 },
  logo: { width: 80, height: 80, borderRadius: 20, marginBottom: 14, borderWidth: 2, borderColor: ORANGE },
  brand: { fontSize: 36, fontFamily: "Inter_700Bold", color: WHITE, letterSpacing: -1 },
  tagline: { fontSize: 13, fontFamily: "Inter_500Medium", color: ORANGE, marginTop: 3, letterSpacing: 1 },
  heroDesc: {
    fontSize: 15, fontFamily: "Inter_400Regular", color: MUTED,
    textAlign: "center", lineHeight: 22, marginTop: 14, maxWidth: 320,
  },

  trialCard: {
    width: "100%", backgroundColor: "rgba(242,107,29,0.08)",
    borderWidth: 1, borderColor: "rgba(242,107,29,0.35)",
    borderRadius: 16, padding: 18, alignItems: "center", marginBottom: 16,
  },
  trialHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 },
  trialTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: ORANGE, letterSpacing: 0.5 },
  countdown: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  countUnit: { alignItems: "center", gap: 4 },
  countBox: {
    width: 52, height: 52, borderRadius: 10,
    backgroundColor: "rgba(242,107,29,0.18)", borderWidth: 1, borderColor: "rgba(242,107,29,0.4)",
    alignItems: "center", justifyContent: "center",
  },
  countNum: { fontSize: 22, fontFamily: "Inter_700Bold", color: WHITE },
  countLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", color: ORANGE, letterSpacing: 1 },
  countSep: { fontSize: 22, fontFamily: "Inter_700Bold", color: ORANGE, marginBottom: 14 },
  trialNote: { fontSize: 12, fontFamily: "Inter_400Regular", color: MUTED, textAlign: "center" },

  featuresCard: {
    width: "100%", backgroundColor: CARD,
    borderRadius: 16, borderWidth: 1, borderColor: BORDER,
    paddingVertical: 4, marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 13, gap: 12,
  },
  featureDivider: { borderBottomWidth: 1, borderBottomColor: BORDER },
  featureIconWrap: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: "rgba(242,107,29,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  featureText: { flex: 1 },
  featureLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: WHITE },
  featureDesc: { fontSize: 11, fontFamily: "Inter_400Regular", color: MUTED, marginTop: 1 },

  ctaGroup: { width: "100%", gap: 10, marginBottom: 16 },
  primaryBtn: {
    height: 54, borderRadius: 14, backgroundColor: ORANGE,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
  },
  primaryBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: WHITE },
  secondaryBtn: {
    height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: ORANGE,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(242,107,29,0.06)",
  },
  secondaryBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: ORANGE },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { fontSize: 12, fontFamily: "Inter_400Regular", color: MUTED },
  demoBtn: {
    height: 44, borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
  },
  demoBtnText: { fontSize: 14, fontFamily: "Inter_500Medium", color: MUTED },

  finePrint: {
    fontSize: 11, fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 16,
  },
});
