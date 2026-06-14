import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSubscription } from "@/lib/revenuecat";
import { useLocalTrial } from "@/hooks/useLocalTrial";
import { PaywallModal } from "@/components/PaywallModal";

const ORANGE = "#F26B1D";
const ORANGE_DARK = "#C9540F";
const AMBER_BG = "rgba(242,107,29,0.12)";
const AMBER_BORDER = "rgba(242,107,29,0.30)";
const WHITE = "#ffffff";

/**
 * Trial banner shown at the top of every tab screen.
 * Visible when:
 *   - RevenueCat reports periodType === "TRIAL" (paid trial via in-app purchase), OR
 *   - Local 3-day trial window is still active (new sign-ups before first purchase)
 * Hidden once the user has an active paid subscription.
 */
export function TrialBanner() {
  const { isInTrial, trialDaysLeft, isSubscribed } = useSubscription();
  const { isActive: isLocalTrialActive, daysLeft: localDaysLeft, isLoaded } = useLocalTrial();
  const [paywallVisible, setPaywallVisible] = useState(false);

  // Don't show if paid subscription is active (not in trial)
  if (isSubscribed && !isInTrial) return null;

  // Determine which trial source is active
  const showBanner = isInTrial || (isLoaded && isLocalTrialActive);
  if (!showBanner) return null;

  // Prefer RevenueCat days if in RC trial, otherwise use local countdown
  const days = isInTrial ? (trialDaysLeft ?? 0) : localDaysLeft;
  const label =
    days === 0
      ? "Trial ends today"
      : days === 1
      ? "1 day left in your free trial"
      : `${days} days left in your free trial`;

  return (
    <>
      <View style={s.bar}>
        <View style={s.pill}>
          <Feather name="clock" size={11} color={ORANGE} style={s.pillIcon} />
          <Text style={s.pillText}>{label}</Text>
          <Feather name="arrow-right" size={11} color={ORANGE} style={s.pillArrow} />
        </View>

        <Pressable
          style={({ pressed }) => [s.upgradeBtn, pressed && s.upgradeBtnPressed]}
          onPress={() => setPaywallVisible(true)}
        >
          <Text style={s.upgradeTxt}>UPGRADE</Text>
        </Pressable>
      </View>

      <PaywallModal
        visible={paywallVisible}
        onDismiss={() => setPaywallVisible(false)}
      />
    </>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0D1117",
    borderBottomWidth: 1,
    borderBottomColor: AMBER_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AMBER_BG,
    borderWidth: 1,
    borderColor: AMBER_BORDER,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  pillIcon: {},
  pillText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: ORANGE,
  },
  pillArrow: {},
  upgradeBtn: {
    backgroundColor: ORANGE,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  upgradeBtnPressed: {
    backgroundColor: ORANGE_DARK,
  },
  upgradeTxt: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: WHITE,
    letterSpacing: 0.8,
  },
});
