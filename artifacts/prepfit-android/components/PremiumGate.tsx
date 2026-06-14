import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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
 * This ensures new sign-ups can use the app during the advertised free trial
 * even before RevenueCat reflects an entitlement.
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

  return (
    <PaywallModal
      visible={paywallVisible}
      onDismiss={() => setPaywallVisible(false)}
      feature={feature}
    />
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
  });
