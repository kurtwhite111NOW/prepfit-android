import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSubscription } from "@/lib/revenuecat";
import { useColors } from "@/hooks/useColors";
import { PaywallModal } from "./PaywallModal";

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
}

export function PremiumGate({ feature, children }: PremiumGateProps) {
  const { isSubscribed, isLoading } = useSubscription();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const colors = useColors();

  // Auto-present paywall as soon as we know the user is not subscribed
  useEffect(() => {
    if (!isLoading && !isSubscribed) {
      setPaywallVisible(true);
    }
  }, [isLoading, isSubscribed]);

  if (isLoading) {
    return (
      <View style={styles(colors).loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isSubscribed) {
    return <>{children}</>;
  }

  // Render paywall in place of screen content for non-subscribers
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
