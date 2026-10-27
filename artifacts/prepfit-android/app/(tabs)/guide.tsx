import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";

type GuideSection = Translations["guide"]["sections"][number];

function AccordionItem({ section }: { section: GuideSection }) {
  const [open, setOpen] = useState(false);
  const colors = useColors();
  const s = accordionStyles(colors);

  return (
    <View style={s.item}>
      <Pressable style={s.header} onPress={() => setOpen((v) => !v)}>
        <View style={s.iconWrap}>
          <Feather name={section.icon} size={17} color={colors.primary} />
        </View>
        <Text style={s.title}>{section.title}</Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </Pressable>
      {open && <Text style={s.content}>{section.content}</Text>}
    </View>
  );
}

export default function GuideScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.content}
    >
      <View style={s.heroCard}>
        <View style={s.heroTop}>
          <View style={s.heroIconWrap}>
            <Text style={{ fontSize: 32 }}>🥗</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.heroEyebrow}>{t.guide.eyebrow}</Text>
            <Text style={s.heroTitle}>{t.guide.title}</Text>
            <Text style={s.heroSub}>{t.guide.sub}</Text>
          </View>
        </View>
        <Text style={s.heroDesc}>{t.guide.desc}</Text>
      </View>

      <Text style={s.sectionLabel}>{t.guide.featureGuide}</Text>
      <View style={s.accordion}>
        {t.guide.sections.map((section) => (
          <AccordionItem key={section.title} section={section} />
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const accordionStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 14,
      gap: 10,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    content: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
      paddingHorizontal: 14,
      paddingBottom: 14,
      paddingTop: 2,
    },
  });

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    content: { paddingBottom: 24 },
    heroCard: {
      backgroundColor: colors.sidebar,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: colors.radius,
      padding: 18,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginBottom: 12,
    },
    heroIconWrap: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.12)",
      alignItems: "center",
      justifyContent: "center",
    },
    heroEyebrow: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 2,
    },
    heroTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      lineHeight: 26,
    },
    heroSub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.6)",
    },
    heroDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
      lineHeight: 20,
    },
    sectionLabel: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 24,
      marginBottom: 10,
      marginHorizontal: 16,
    },
    accordion: {
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
  });
