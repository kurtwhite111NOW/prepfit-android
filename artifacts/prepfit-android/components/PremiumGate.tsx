import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSubscription } from "@/lib/revenuecat";
import { useLocalTrial } from "@/hooks/useLocalTrial";
import { useColors } from "@/hooks/useColors";
import { PaywallModal } from "./PaywallModal";

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
}

/**
 * Blocks access to premium features.
 * Access is granted when ANY of the following is true:
 *   1. RevenueCat shows an active subscription/entitlement (paid user)
 *   2. RevenueCat shows the user is in a trial period (periodType === "TRIAL")
 *   3. The local 3-day trial window has not yet expired (AsyncStorage key)
 *
 * When the paywall is dismissed without subscribing, shows a locked-screen
 * fallback with a button to re-open the paywall — never a blank screen.
 */
export function PremiumGate({ feature, children }: PremiumGateProps) {
  const { isSubscribed, isLoading: rcLoading } = useSubscription();
  const { isActive: isLocalTrialActive, isLoaded: trialLoaded } = useLocalTrial();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const colors = useColors();

  const isFullyLoaded = !rcLoading && trialLoaded;
  const hasAccess = isSubscribed || isLocalTrialActive;

  useEffect(() => {
    if (isFullyLoaded && !hasAccess) {
      setPaywallVisible(true);
    }
  }, [isFullyLoaded, hasAccess]);

  if (!isFullyLoaded) {
    return (
      <View style={styles(colors).loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (hasAccess) return <>{children}</>;

  const s = styles(colors);

  return (
    <>
      <PaywallModal
        visible={paywallVisible}
        onDismiss={() => setPaywallVisible(false)}
        feature={feature}
      />

      {/* Fallback shown when paywall is dismissed without subscribing */}
      {!paywallVisible && (
        <View style={s.locked}>
          <View style={s.iconWrap}>
            <Feather name="lock" size={32} color={colors.primary} />
          </View>
          <Text style={s.lockedTitle}>Pro Feature</Text>
          <Text style={s.lockedDesc}>
            {feature} requires a PrepFit Pro subscription.
          </Text>
          <Pressable
            style={({ pressed }) => [s.upgradeBtn, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => setPaywallVisible(true)}
          >
            <Feather name="zap" size={16} color="#FFF" />
            <Text style={s.upgradeBtnText}>Upgrade to Pro</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    loader: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    locked: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      backgroundColor: colors.background,
      gap: 10,
    },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: "rgba(242,107,29,0.12)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    lockedTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    lockedDesc: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 21,
    },
    upgradeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 14,
      marginTop: 8,
    },
    upgradeBtnText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#FFF",
    },
  });
