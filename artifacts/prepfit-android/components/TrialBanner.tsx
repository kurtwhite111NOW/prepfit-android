import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSubscription } from "@/lib/revenuecat";
import { PaywallModal } from "@/components/PaywallModal";

const ORANGE = "#F26B1D";
const ORANGE_DARK = "#C9540F";
const AMBER_BG = "rgba(242,107,29,0.12)";
const AMBER_BORDER = "rgba(242,107,29,0.30)";
const WHITE = "#ffffff";
const WHITE_80 = "rgba(255,255,255,0.80)";

export function TrialBanner() {
  const { isInTrial, trialDaysLeft } = useSubscription();
  const [paywallVisible, setPaywallVisible] = useState(false);

  if (!isInTrial) return null;

  const days = trialDaysLeft ?? 0;
  const label =
    days === 0
      ? "Trial ends today"
      : days === 1
      ? "1 day left in your free trial"
      : `${days} days left in your free trial`;

  return (
    <>
      <View style={s.bar}>
        {/* Left pill */}
        <View style={s.pill}>
          <Feather name="clock" size={11} color={ORANGE} style={s.pillIcon} />
          <Text style={s.pillText}>{label}</Text>
          <Feather name="arrow-right" size={11} color={ORANGE} style={s.pillArrow} />
        </View>

        {/* Upgrade button */}
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
