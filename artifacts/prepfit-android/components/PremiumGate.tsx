import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
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
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return null;
  }

  if (isSubscribed) {
    return <>{children}</>;
  }

  return (
    <>
      <View style={styles(colors, insets).container}>
        <View style={styles(colors, insets).iconWrap}>
          <Feather name="lock" size={40} color={colors.primary} />
        </View>
        <Text style={styles(colors, insets).title}>Pro Feature</Text>
        <Text style={styles(colors, insets).subtitle}>
          {feature} is available with PrepFit Pro. Upgrade to unlock unlimited access.
        </Text>
        <Pressable
          style={styles(colors, insets).btn}
          onPress={() => setPaywallVisible(true)}
        >
          <Feather name="zap" size={16} color="#fff" />
          <Text style={styles(colors, insets).btnText}>Upgrade to Pro</Text>
        </Pressable>
      </View>

      <PaywallModal
        visible={paywallVisible}
        onDismiss={() => setPaywallVisible(false)}
      />
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
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      paddingBottom: insets.bottom + 32,
      backgroundColor: colors.background,
    },
    iconWrap: {
      width: 88,
      height: 88,
      borderRadius: 24,
      backgroundColor: colors.primary + "18",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 32,
    },
    btn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 14,
    },
    btnText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
