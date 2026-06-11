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
import { useColors } from "@/hooks/useColors";

interface PaywallModalProps {
  visible: boolean;
  onDismiss: () => void;
  feature?: string;
}

type PurchaseConfirmState = {
  pkg: any;
  label: string;
  price: string;
} | null;

type Plan = "monthly" | "annual";

export function PaywallModal({ visible, onDismiss, feature }: PaywallModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { offerings, purchase, restore, isPurchasing, isRestoring } =
    useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const [confirmState, setConfirmState] = useState<PurchaseConfirmState>(null);
  const [error, setError] = useState<string | null>(null);

  const current = offerings?.current;
  const monthlyPkg = current?.availablePackages.find(
    (p) => p.packageType === "MONTHLY",
  );
  const annualPkg = current?.availablePackages.find(
    (p) => p.packageType === "ANNUAL",
  );

  const selectedPkg = selectedPlan === "annual" ? annualPkg : monthlyPkg;
  const monthlyPrice = monthlyPkg?.product.priceString ?? "$14.00";
  const annualPrice = annualPkg?.product.priceString ?? "$168.00";
  const selectedPrice = selectedPlan === "annual" ? annualPrice : monthlyPrice;

  const handleSubscribe = () => {
    if (!selectedPkg) return;
    setError(null);
    const label = selectedPlan === "annual" ? "Annual Plan" : "Monthly Plan";
    if (__DEV__) {
      setConfirmState({ pkg: selectedPkg, label, price: selectedPrice });
    } else {
      doPurchase(selectedPkg);
    }
  };

  const doPurchase = async (pkg: any) => {
    try {
      setConfirmState(null);
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

  const s = styles(colors, insets);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onDismiss}
      >
        <View style={s.container}>
          <Pressable style={s.closeBtn} onPress={onDismiss}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </Pressable>

          <ScrollView
            contentContainerStyle={s.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={s.header}>
              <View style={s.iconWrap}>
                <Feather name="zap" size={32} color="#fff" />
              </View>
              <Text style={s.title}>PrepFit Pro</Text>
              <Text style={s.subtitle}>
                {feature
                  ? `Unlock ${feature} and all Pro features`
                  : "Unlock AI meal planning, photo scanning, and smart grocery lists"}
              </Text>
            </View>

            {/* Features */}
            <View style={s.features}>
              {[
                { icon: "calendar", text: "AI-powered weekly meal planner" },
                { icon: "camera", text: "Photo calorie scanner (unlimited)" },
                { icon: "shopping-cart", text: "Smart grocery lists by category" },
                { icon: "trending-up", text: "Weight & progress tracking" },
                { icon: "droplet", text: "Daily water intake tracking" },
              ].map(({ icon, text }) => (
                <View key={text} style={s.featureRow}>
                  <View style={s.featureIcon}>
                    <Feather name={icon as any} size={16} color={colors.primary} />
                  </View>
                  <Text style={s.featureText}>{text}</Text>
                </View>
              ))}
            </View>

            {/* Plan toggle */}
            <View style={s.toggle}>
              <Pressable
                style={[s.toggleBtn, selectedPlan === "annual" && s.toggleBtnActive]}
                onPress={() => setSelectedPlan("annual")}
              >
                <View style={s.toggleBtnInner}>
                  <Text
                    style={[
                      s.toggleBtnTitle,
                      selectedPlan === "annual" && s.toggleBtnTitleActive,
                    ]}
                  >
                    Annual
                  </Text>
                  {annualPkg && (
                    <View style={s.saveBadge}>
                      <Text style={s.saveBadgeText}>SAVE 50%</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    s.toggleBtnPrice,
                    selectedPlan === "annual" && s.toggleBtnPriceActive,
                  ]}
                >
                  {annualPrice}
                  <Text style={s.toggleBtnPriceSub}>/yr</Text>
                </Text>
              </Pressable>

              <Pressable
                style={[s.toggleBtn, selectedPlan === "monthly" && s.toggleBtnActive]}
                onPress={() => setSelectedPlan("monthly")}
              >
                <Text
                  style={[
                    s.toggleBtnTitle,
                    selectedPlan === "monthly" && s.toggleBtnTitleActive,
                  ]}
                >
                  Monthly
                </Text>
                <Text
                  style={[
                    s.toggleBtnPrice,
                    selectedPlan === "monthly" && s.toggleBtnPriceActive,
                  ]}
                >
                  {monthlyPrice}
                  <Text style={s.toggleBtnPriceSub}>/mo</Text>
                </Text>
              </Pressable>
            </View>

            {error && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            {/* CTA */}
            <Pressable
              style={[s.cta, (!selectedPkg || isPurchasing) && s.ctaDisabled]}
              onPress={handleSubscribe}
              disabled={!selectedPkg || isPurchasing}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="zap" size={18} color="#fff" />
                  <Text style={s.ctaText}>
                    Start Free Trial — then {selectedPrice}
                    {selectedPlan === "annual" ? "/yr" : "/mo"}
                  </Text>
                </>
              )}
            </Pressable>

            {/* Restore */}
            <Pressable
              style={s.restoreBtn}
              onPress={handleRestore}
              disabled={isRestoring}
            >
              <Text style={s.restoreText}>
                {isRestoring ? "Restoring…" : "Restore Purchases"}
              </Text>
            </Pressable>

            <Text style={s.legal}>
              Payment charged to your Google Play account at confirmation.
              Subscription auto-renews unless cancelled 24 hours before period
              end. Cancel anytime.
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Dev-mode purchase confirmation */}
      <Modal
        visible={!!confirmState}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmState(null)}
      >
        <View style={s.confirmOverlay}>
          <View style={s.confirmCard}>
            <Text style={s.confirmTitle}>Confirm Test Purchase</Text>
            <Text style={s.confirmBody}>
              You are in development mode.{"\n\n"}Purchase{" "}
              <Text style={{ fontWeight: "700" }}>{confirmState?.label}</Text>{" "}
              for{" "}
              <Text style={{ fontWeight: "700" }}>{confirmState?.price}</Text>?
            </Text>
            <View style={s.confirmButtons}>
              <Pressable
                style={[s.confirmBtn, s.confirmBtnCancel]}
                onPress={() => setConfirmState(null)}
              >
                <Text style={s.confirmBtnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[s.confirmBtn, s.confirmBtnConfirm]}
                onPress={() => confirmState && doPurchase(confirmState.pkg)}
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

const styles = (
  colors: ReturnType<typeof useColors>,
  insets: ReturnType<typeof useSafeAreaInsets>,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    closeBtn: {
      position: "absolute",
      top: insets.top + 12,
      right: 20,
      zIndex: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: {
      paddingTop: insets.top + 24,
      paddingBottom: insets.bottom + 32,
      paddingHorizontal: 24,
    },
    header: {
      alignItems: "center",
      marginBottom: 28,
      marginTop: 16,
    },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
    features: {
      marginBottom: 24,
      gap: 12,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    featureIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primary + "18",
      alignItems: "center",
      justifyContent: "center",
    },
    featureText: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.text,
    },
    toggle: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    toggleBtn: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: 14,
      backgroundColor: colors.card,
    },
    toggleBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    toggleBtnInner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    toggleBtnTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
    },
    toggleBtnTitleActive: {
      color: colors.text,
    },
    saveBadge: {
      backgroundColor: colors.primary,
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    saveBadgeText: {
      color: "#fff",
      fontSize: 9,
      fontFamily: "Inter_700Bold",
      letterSpacing: 0.5,
    },
    toggleBtnPrice: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
    },
    toggleBtnPriceActive: {
      color: colors.primary,
    },
    toggleBtnPriceSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
    },
    errorBox: {
      backgroundColor: "#FF3B3018",
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
    },
    errorText: {
      color: "#FF3B30",
      fontSize: 13,
      fontFamily: "Inter_400Regular",
    },
    cta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 16,
      marginBottom: 12,
    },
    ctaDisabled: {
      opacity: 0.5,
    },
    ctaText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    restoreBtn: {
      alignItems: "center",
      paddingVertical: 10,
      marginBottom: 8,
    },
    restoreText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    legal: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 16,
    },
    confirmOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    confirmCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      width: "100%",
      maxWidth: 360,
    },
    confirmTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 12,
    },
    confirmBody: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 22,
      marginBottom: 24,
    },
    confirmButtons: {
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
      backgroundColor: colors.muted,
    },
    confirmBtnCancelText: {
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
      fontSize: 15,
    },
    confirmBtnConfirm: {
      backgroundColor: colors.primary,
    },
    confirmBtnConfirmText: {
      color: "#fff",
      fontFamily: "Inter_600SemiBold",
      fontSize: 15,
    },
  });
