import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useSubscription } from "@/lib/revenuecat";

const EMERALD = "#22c55e";
const EMERALD_DIM = "rgba(34,197,94,0.12)";
const EMERALD_BORDER = "rgba(34,197,94,0.25)";
const BG = "#0f1117";
const CARD_BG = "rgba(255,255,255,0.05)";
const CARD_BORDER = "rgba(255,255,255,0.10)";
const WHITE = "#ffffff";
const WHITE_70 = "rgba(255,255,255,0.70)";
const WHITE_60 = "rgba(255,255,255,0.60)";
const WHITE_45 = "rgba(255,255,255,0.45)";
const AMBER = "#f59e0b";
const AMBER_BG = "rgba(245,158,11,0.15)";
const AMBER_BORDER = "rgba(245,158,11,0.25)";
const RED_BG = "rgba(239,68,68,0.10)";
const RED_BORDER = "rgba(239,68,68,0.30)";
const RED = "#f87171";

const FEATURES = [
  { icon: "cpu" as const,          label: "Meal Plan Generation",      desc: "Personalised weekly plans in seconds" },
  { icon: "shopping-cart" as const, label: "Smart Grocery Lists",       desc: "Clean-brand picks, organised by aisle" },
  { icon: "camera" as const,       label: "Photo Calorie Scanner",     desc: "Identifies food and estimates calories" },
  { icon: "trending-up" as const,  label: "Weight Tracker",            desc: "Trend chart and progress insights" },
  { icon: "book-open" as const,    label: "My Meals Journal",          desc: "Save and review all analysed meals" },
  { icon: "droplet" as const,      label: "Daily Water Tracking",      desc: "Hit your hydration goals every day" },
];

interface PaywallModalProps {
  visible: boolean;
  onDismiss: () => void;
  feature?: string;
}

type ConfirmState = { pkg: any; price: string } | null;

export function PaywallModal({ visible, onDismiss, feature }: PaywallModalProps) {
  const insets = useSafeAreaInsets();
  const { offerings, purchase, restore, isPurchasing, isRestoring, isLoading } = useSubscription();
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [error, setError] = useState<string | null>(null);

  const current = offerings?.current;
  const annualPkg = current?.availablePackages.find(
    (p) => p.identifier === "$rc_annual",
  );
  const offeringsReady = !isLoading && !!offerings;

  // Pricing display
  const annualTotal = annualPkg?.product.priceString ?? "$168.00";
  const annualAmount = annualPkg?.product.price ?? 168;
  const perMonth = Math.round(annualAmount / 12);
  const currency = annualPkg?.product.currencyCode === "USD" ? "$" : "";

  const handleSubscribe = () => {
    if (!annualPkg) return;
    setError(null);
    if (__DEV__) {
      setConfirm({ pkg: annualPkg, price: annualTotal });
    } else {
      doPurchase(annualPkg);
    }
  };

  const doPurchase = async (pkg: any) => {
    try {
      setConfirm(null);
      await purchase(pkg);
      onDismiss();
    } catch (e: any) {
      if (e?.code !== "1") {
        setError(e?.message ?? "Purchase failed. Please try again.");
      }
    }
  };

  const handleRestore = async () => {
    try {
      setError(null);
      await restore();
      onDismiss();
    } catch {
      setError("Restore failed. Please try again.");
    }
  };

  const s = styles(insets);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onDismiss}
      >
        <View style={s.root}>
          {/* Glow blobs */}
          <View style={s.glowTop} pointerEvents="none" />
          <View style={s.glowBottom} pointerEvents="none" />

          {/* Close button */}
          <Pressable style={s.closeBtn} onPress={onDismiss}>
            <Feather name="x" size={18} color={WHITE_45} />
          </Pressable>

          <ScrollView
            contentContainerStyle={s.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Brand header ── */}
            <View style={s.header}>
              <View style={s.iconWrap}>
                <Text style={s.iconEmoji}>💪</Text>
              </View>
              <Text style={s.brandName}>PrepFit</Text>
              <Text style={s.brandSub}>Simple Meal Prep · Gym &amp; Fitness</Text>
            </View>

            {/* ── Badge + heading ── */}
            <View style={s.headingBlock}>
              <View style={s.badge}>
                <Feather name="zap" size={11} color={AMBER} />
                <Text style={s.badgeText}>
                  {feature ? `Unlock ${feature}` : "Free Trial Ended"}
                </Text>
              </View>
              <Text style={s.heading}>Continue with Pro</Text>
              <Text style={s.subheading}>
                {feature
                  ? `Upgrade to access ${feature} and all premium features.`
                  : "Your free trial has ended. Upgrade to keep using meal planning, calorie scanning, and all premium features."}
              </Text>
            </View>

            {/* ── Feature list ── */}
            <View style={s.featureCard}>
              {FEATURES.map(({ icon, label, desc }) => (
                <View key={label} style={s.featureRow}>
                  <View style={s.checkCircle}>
                    <Feather name="check" size={12} color={EMERALD} strokeWidth={3} />
                  </View>
                  <View style={s.featureText}>
                    <Text style={s.featureLabel}>{label}</Text>
                    <Text style={s.featureDesc}>{desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ── Pricing card ── */}
            <View style={s.priceCard}>
              <View style={s.bestValueBadge}>
                <Text style={s.bestValueText}>Best Value</Text>
              </View>
              <View style={s.priceRow}>
                <Text style={s.priceBig}>{currency}{perMonth}</Text>
                <Text style={s.priceUnit}>/month</Text>
              </View>
              <Text style={s.priceNote}>Billed annually — {annualTotal} / year</Text>
              <Text style={s.priceSub}>Cancel anytime · No hidden fees</Text>
            </View>

            {error && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            {/* ── CTA — three states: loading / no-offerings / ready ── */}
            {!offeringsReady ? (
              /* Still loading offerings from RevenueCat */
              <View style={[s.cta, s.ctaDisabled]}>
                <ActivityIndicator color={WHITE} />
              </View>
            ) : !annualPkg ? (
              /* Loaded but no annual package found — show a clear error */
              <View style={s.offeringsErrorBox}>
                <Feather name="wifi-off" size={20} color={WHITE_45} style={{ marginBottom: 8 }} />
                <Text style={s.offeringsErrorTitle}>Pricing unavailable</Text>
                <Text style={s.offeringsErrorBody}>
                  Could not load subscription options. Please check your connection and try reopening this screen.
                </Text>
              </View>
            ) : (
              /* Ready — show normal subscribe button */
              <Pressable
                style={[s.cta, isPurchasing && s.ctaDisabled]}
                onPress={handleSubscribe}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <Text style={s.ctaText}>
                    Start Pro Plan — {currency}{perMonth} / month
                  </Text>
                )}
              </Pressable>
            )}

            {/* ── Restore ── always visible so users with existing subs can recover ── */}
            <Pressable style={s.restoreBtn} onPress={handleRestore} disabled={isRestoring}>
              <Text style={s.restoreText}>
                {isRestoring ? "Restoring…" : "Restore Purchases"}
              </Text>
            </Pressable>

            <Text style={s.legal}>
              Subscription auto-renews annually at {annualTotal} unless cancelled
              at least 24 hours before the renewal date. Managed via Google Play.
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Dev-mode confirm dialog */}
      <Modal
        visible={!!confirm}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirm(null)}
      >
        <View style={s.confirmOverlay}>
          <View style={s.confirmCard}>
            <Text style={s.confirmTitle}>Confirm Test Purchase</Text>
            <Text style={s.confirmBody}>
              Development mode.{"\n\n"}
              Purchase <Text style={{ fontWeight: "700", color: WHITE }}>Annual Plan</Text> for{" "}
              <Text style={{ fontWeight: "700", color: WHITE }}>{confirm?.price}</Text>?
            </Text>
            <View style={s.confirmBtns}>
              <Pressable
                style={[s.confirmBtn, s.confirmBtnCancel]}
                onPress={() => setConfirm(null)}
              >
                <Text style={s.confirmBtnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[s.confirmBtn, s.confirmBtnConfirm]}
                onPress={() => confirm && doPurchase(confirm.pkg)}
              >
                <Text style={s.confirmBtnConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: BG,
    },
    glowTop: {
      position: "absolute",
      top: -100,
      left: "50%",
      marginLeft: -200,
      width: 400,
      height: 400,
      borderRadius: 200,
      backgroundColor: "rgba(34,197,94,0.06)",
    },
    glowBottom: {
      position: "absolute",
      bottom: -80,
      right: -60,
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: "rgba(34,197,94,0.04)",
    },
    closeBtn: {
      position: "absolute",
      top: insets.top + 14,
      right: 18,
      zIndex: 10,
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: "rgba(255,255,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: {
      paddingTop: insets.top + 28,
      paddingBottom: insets.bottom + 36,
      paddingHorizontal: 24,
      alignItems: "center",
    },
    // Brand header
    header: {
      alignItems: "center",
      marginBottom: 20,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: EMERALD,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      shadowColor: EMERALD,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 12,
    },
    iconEmoji: {
      fontSize: 28,
    },
    brandName: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: WHITE,
      letterSpacing: 0.2,
    },
    brandSub: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      color: EMERALD,
      marginTop: 2,
      letterSpacing: 0.3,
    },
    // Badge + heading
    headingBlock: {
      alignItems: "center",
      marginBottom: 20,
      gap: 6,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: AMBER_BG,
      borderWidth: 1,
      borderColor: AMBER_BORDER,
    },
    badgeText: {
      color: AMBER,
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    heading: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: WHITE,
      marginTop: 4,
    },
    subheading: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: WHITE_70,
      textAlign: "center",
      lineHeight: 21,
      maxWidth: 320,
    },
    // Feature list
    featureCard: {
      width: "100%",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: EMERALD_BORDER,
      backgroundColor: EMERALD_DIM,
      padding: 18,
      gap: 14,
      marginBottom: 14,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(34,197,94,0.20)",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 1,
      flexShrink: 0,
    },
    featureText: {
      flex: 1,
    },
    featureLabel: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: WHITE,
      marginBottom: 1,
    },
    featureDesc: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: WHITE_60,
      lineHeight: 17,
    },
    // Pricing card
    priceCard: {
      width: "100%",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: CARD_BORDER,
      backgroundColor: CARD_BG,
      padding: 20,
      alignItems: "center",
      marginBottom: 18,
    },
    bestValueBadge: {
      backgroundColor: AMBER,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 3,
      marginBottom: 12,
    },
    bestValueText: {
      color: WHITE,
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 4,
    },
    priceBig: {
      fontSize: 52,
      fontFamily: "Inter_700Bold",
      color: WHITE,
      lineHeight: 56,
    },
    priceUnit: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: WHITE_60,
      paddingBottom: 8,
    },
    priceNote: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: WHITE_60,
      marginTop: 4,
    },
    priceSub: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: EMERALD,
      marginTop: 3,
    },
    // Error
    errorBox: {
      width: "100%",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: RED_BORDER,
      backgroundColor: RED_BG,
      padding: 12,
      marginBottom: 12,
    },
    errorText: {
      color: RED,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    // Offerings unavailable fallback
    offeringsErrorBox: {
      width: "100%",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: CARD_BORDER,
      backgroundColor: CARD_BG,
      padding: 20,
      alignItems: "center",
      marginBottom: 12,
    },
    offeringsErrorTitle: {
      color: WHITE,
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 6,
    },
    offeringsErrorBody: {
      color: WHITE_60,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      lineHeight: 19,
    },
    // CTA
    cta: {
      width: "100%",
      backgroundColor: EMERALD,
      paddingVertical: 17,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: EMERALD,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.40,
      shadowRadius: 16,
      elevation: 10,
      marginBottom: 12,
    },
    ctaDisabled: {
      opacity: 0.55,
    },
    ctaText: {
      color: WHITE,
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      letterSpacing: 0.3,
    },
    // Restore
    restoreBtn: {
      paddingVertical: 10,
      marginBottom: 8,
    },
    restoreText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: EMERALD,
    },
    legal: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: WHITE_45,
      textAlign: "center",
      lineHeight: 16,
      maxWidth: 320,
    },
    // Dev confirm
    confirmOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.65)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    confirmCard: {
      backgroundColor: "#1a1f2e",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: CARD_BORDER,
      padding: 24,
      width: "100%",
      maxWidth: 360,
    },
    confirmTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: WHITE,
      marginBottom: 12,
    },
    confirmBody: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: WHITE_60,
      lineHeight: 22,
      marginBottom: 24,
    },
    confirmBtns: {
      flexDirection: "row",
      gap: 12,
    },
    confirmBtn: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      alignItems: "center",
    },
    confirmBtnCancel: {
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    confirmBtnCancelText: {
      color: WHITE_70,
      fontFamily: "Inter_600SemiBold",
      fontSize: 15,
    },
    confirmBtnConfirm: {
      backgroundColor: EMERALD,
    },
    confirmBtnConfirmText: {
      color: WHITE,
      fontFamily: "Inter_600SemiBold",
      fontSize: 15,
    },
  });
