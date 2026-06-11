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
}

type PurchaseConfirmState = {
  visible: boolean;
  pkg: any;
  label: string;
  price: string;
} | null;

export function PaywallModal({ visible, onDismiss }: PaywallModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { offerings, purchase, restore, isPurchasing, isRestoring } =
    useSubscription();
  const [confirmState, setConfirmState] = useState<PurchaseConfirmState>(null);
  const [error, setError] = useState<string | null>(null);

  const current = offerings?.current;
  const monthlyPkg = current?.availablePackages.find(
    (p) => p.packageType === "MONTHLY",
  );
  const annualPkg = current?.availablePackages.find(
    (p) => p.packageType === "ANNUAL",
  );

  const monthlyPrice = monthlyPkg?.product.priceString ?? "$14.00";
  const annualPrice = annualPkg?.product.priceString ?? "$168.00";

  const handlePurchase = (pkg: any, label: string, price: string) => {
    setError(null);
    if (__DEV__) {
      setConfirmState({ visible: true, pkg, label, price });
    } else {
      doPurchase(pkg);
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
    } catch (e: any) {
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
                Unlock AI meal planning, photo scanning, and smart grocery lists
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

            {error && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            {/* Plans */}
            <View style={s.plans}>
              {/* Annual (highlighted) */}
              {annualPkg && (
                <Pressable
                  style={[s.planCard, s.planCardHighlight]}
                  onPress={() =>
                    handlePurchase(annualPkg, "Annual Plan", annualPrice)
                  }
                  disabled={isPurchasing}
                >
                  <View style={s.badgeRow}>
                    <View style={s.badge}>
                      <Text style={s.badgeText}>BEST VALUE</Text>
                    </View>
                  </View>
                  <Text style={s.planTitle}>Annual Plan</Text>
                  <Text style={s.planPrice}>{annualPrice}</Text>
                  <Text style={s.planNote}>per year · cancel anytime</Text>
                </Pressable>
              )}

              {/* Monthly */}
              {monthlyPkg && (
                <Pressable
                  style={s.planCard}
                  onPress={() =>
                    handlePurchase(monthlyPkg, "Monthly Plan", monthlyPrice)
                  }
                  disabled={isPurchasing}
                >
                  <Text style={s.planTitle}>Monthly Plan</Text>
                  <Text style={s.planPrice}>{monthlyPrice}</Text>
                  <Text style={s.planNote}>per month · cancel anytime</Text>
                </Pressable>
              )}

              {!monthlyPkg && !annualPkg && (
                <View style={s.loadingBox}>
                  <ActivityIndicator color={colors.primary} />
                  <Text style={s.loadingText}>Loading plans…</Text>
                </View>
              )}
            </View>

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
              end.
            </Text>
          </ScrollView>

          {isPurchasing && (
            <View style={s.processingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={s.processingText}>Processing…</Text>
            </View>
          )}
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

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
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
      marginBottom: 32,
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
    plans: {
      gap: 12,
      marginBottom: 20,
    },
    planCard: {
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: 20,
      backgroundColor: colors.card,
    },
    planCardHighlight: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "08",
    },
    badgeRow: {
      marginBottom: 8,
    },
    badge: {
      alignSelf: "flex-start",
      backgroundColor: colors.primary,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    badgeText: {
      color: "#fff",
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      letterSpacing: 0.8,
    },
    planTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginBottom: 4,
    },
    planPrice: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      marginBottom: 2,
    },
    planNote: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    loadingBox: {
      alignItems: "center",
      padding: 32,
      gap: 12,
    },
    loadingText: {
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    restoreBtn: {
      alignItems: "center",
      paddingVertical: 12,
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
    processingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    processingText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Inter_500Medium",
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
