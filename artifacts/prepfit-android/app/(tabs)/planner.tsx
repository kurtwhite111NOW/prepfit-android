import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getListMealPlansQueryKey,
  useGenerateMealPlan,
  useCreateMealPlan,
} from "@workspace/api-client-react";
import type { GeneratedMealPlan, GeneratedMeal } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PremiumGate } from "@/components/PremiumGate";
import { useLanguage } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";

const MEAL_EMOJI: Record<string, string> = {
  breakfast: "🍳",
  lunch: "🥗",
  dinner: "🍗",
  snack: "🥜",
};

function getNextSundayLabel(): string {
  const now = new Date();
  const daysUntil = now.getDay() === 0 ? 7 : 7 - now.getDay();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntil);
  return sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function extractMainIngredient(ingredients: string): string {
  return (ingredients.split(",")[0] ?? "").trim();
}

function buildChecklistItems(meals: GeneratedMeal[], t: Translations["planner"]): string[] {
  return [
    t.batchStepGather,
    ...meals.map((m) => t.batchStepCook(extractMainIngredient(m.ingredients), m.name)),
    t.batchStepPortion,
    t.batchStepLabel,
    t.batchStepRefrigerate,
  ];
}

function PlannerScreenContent() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const { t } = useLanguage();

  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedMealPlan | null>(null);

  const generateMutation = useGenerateMealPlan({
    mutation: {
      onSuccess: (data) => {
        setGeneratedPlan(data);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert(t.common.error, t.planner.alertError),
    },
  });

  const saveMutation = useCreateMealPlan({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
        setGeneratedPlan(null);
        Alert.alert(t.planner.alertSavedTitle, t.planner.alertSaved);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert(t.common.error, t.planner.alertSaveError),
    },
  });

  const handleGenerate = () => {
    if (mealsPerDay < 2 || mealsPerDay > 5) {
      Alert.alert(t.planner.alertInvalid, t.planner.alertInvalidMeals);
      return;
    }
    if (dailyCalories < 500 || dailyCalories > 5000) {
      Alert.alert(t.planner.alertInvalid, t.planner.alertInvalidCals);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    generateMutation.mutate({ data: { mealsPerDay, dailyCalories } });
  };

  const handleSave = () => {
    if (!generatedPlan) return;
    saveMutation.mutate({
      data: {
        name: generatedPlan.name,
        mealsPerDay,
        dailyCalories,
        meals: generatedPlan.meals.map((m) => ({
          name: m.name,
          description: m.description,
          calories: m.calories,
          mealNumber: m.mealNumber,
          ingredients: m.ingredients,
          protein: m.protein,
          carbs: m.carbs,
          fat: m.fat,
          mealType: m.mealType,
          youtubeUrl: m.youtubeUrl,
        })),
      },
    });
  };

  const totals = generatedPlan
    ? generatedPlan.meals.reduce(
        (acc, m) => ({
          protein: acc.protein + (m.protein ?? 0),
          carbs: acc.carbs + (m.carbs ?? 0),
          fat: acc.fat + (m.fat ?? 0),
        }),
        { protein: 0, carbs: 0, fat: 0 }
      )
    : null;

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.header, { paddingTop: 16 }]}>
        <Text style={s.headerTitle}>{t.planner.title}</Text>
        <Text style={s.headerSub}>{t.planner.sub}</Text>
      </View>

      <View style={s.configCard}>
        <Text style={s.configTitle}>{t.planner.configTitle}</Text>

        <View style={s.row}>
          <Text style={s.configLabel}>{t.planner.mealsPerDay}</Text>
          <View style={s.counter}>
            <Pressable
              style={s.counterBtn}
              onPress={() => setMealsPerDay((v) => Math.max(2, v - 1))}
            >
              <Feather name="minus" size={16} color={colors.foreground} />
            </Pressable>
            <Text style={s.counterVal}>{mealsPerDay}</Text>
            <Pressable
              style={s.counterBtn}
              onPress={() => setMealsPerDay((v) => Math.min(5, v + 1))}
            >
              <Feather name="plus" size={16} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={s.row}>
          <Text style={s.configLabel}>{t.planner.dailyCalories}</Text>
          <TextInput
            style={s.calorieInput}
            value={String(dailyCalories)}
            onChangeText={(v) => setDailyCalories(Number(v.replace(/[^0-9]/g, "")) || 0)}
            keyboardType="number-pad"
            selectTextOnFocus
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            s.generateBtn,
            { opacity: pressed || generateMutation.isPending ? 0.8 : 1 },
          ]}
          onPress={handleGenerate}
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Feather name="zap" size={18} color="#FFF" />
              <Text style={s.generateBtnText}>{t.planner.generate}</Text>
            </>
          )}
        </Pressable>
      </View>

      {generatedPlan && totals && (
        <View style={s.resultSection}>
          <View style={s.planHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.planName}>{generatedPlan.name}</Text>
              <Text style={s.planSub}>{t.planner.highProtein(generatedPlan.meals.length)}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [s.saveBtn, { opacity: pressed || saveMutation.isPending ? 0.8 : 1 }]}
              onPress={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Text style={s.saveBtnText}>{t.planner.savePlan}</Text>
              )}
            </Pressable>
          </View>

          <View style={s.macroTotalsRow}>
            <MacroTotal label="PROTEIN" value={totals.protein} color="#60a5fa" bg="rgba(96,165,250,0.12)" border="rgba(96,165,250,0.25)" />
            <MacroTotal label="CARBS" value={totals.carbs} color="#f59e0b" bg="rgba(245,158,11,0.12)" border="rgba(245,158,11,0.25)" />
            <MacroTotal label="FAT" value={totals.fat} color="#34d399" bg="rgba(52,211,153,0.12)" border="rgba(52,211,153,0.25)" />
          </View>

          {generatedPlan.meals.map((meal) => (
            <MealCard key={meal.mealNumber} meal={meal} colors={colors} t={t.planner} />
          ))}

          <BatchPrepChecklist meals={generatedPlan.meals} colors={colors} t={t.planner} />
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function MacroTotal({
  label, value, color, bg, border,
}: {
  label: string; value: number; color: string; bg: string; border: string;
}) {
  const colors = useColors();
  return (
    <View style={[macroTotalStyles.box, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[macroTotalStyles.value, { color }]}>{value}g</Text>
      <Text style={[macroTotalStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const macroTotalStyles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 3,
  },
  value: { fontSize: 20, fontFamily: "Inter_700Bold" },
  label: { fontSize: 10, fontFamily: "Inter_600SemiBold", marginTop: 2, letterSpacing: 0.8 },
});

function MealCard({
  meal, colors, t,
}: {
  meal: GeneratedMeal;
  colors: ReturnType<typeof useColors>;
  t: Translations["planner"];
}) {
  const [expanded, setExpanded] = useState(false);
  const s = mealCardStyles(colors);

  const emoji = MEAL_EMOJI[(meal.mealType ?? "").toLowerCase()] ?? "🍽️";
  const mealTypeLabel = (meal.mealType ?? "meal").toUpperCase();

  const handleYouTube = () => {
    if (meal.youtubeUrl) Linking.openURL(meal.youtubeUrl);
  };

  return (
    <View style={s.card}>
      <Pressable style={s.cardHeader} onPress={() => setExpanded(!expanded)}>
        <View style={s.emojiRing}>
          <Text style={s.emoji}>{emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.mealTypeLabel}>{mealTypeLabel}</Text>
          <Text style={s.mealName}>{meal.name}</Text>
          <Text style={s.mealDesc} numberOfLines={expanded ? undefined : 2}>
            {meal.description}
          </Text>
        </View>
        <View style={s.calsBadge}>
          <Feather name="zap" size={12} color={colors.primary} />
          <Text style={s.cals}>{meal.calories}</Text>
          <Text style={s.calsLabel}>cal</Text>
        </View>
      </Pressable>

      <View style={s.macroPillsRow}>
        <MacroPill value={meal.protein} label="protein" color="#60a5fa" bg="rgba(96,165,250,0.15)" />
        <MacroPill value={meal.carbs} label="carbs" color="#f59e0b" bg="rgba(245,158,11,0.15)" />
        <MacroPill value={meal.fat} label="fat" color="#34d399" bg="rgba(52,211,153,0.15)" />
        {meal.youtubeUrl && (
          <Pressable style={s.ytPill} onPress={handleYouTube}>
            <Feather name="youtube" size={13} color="#FF0000" />
            <Text style={s.ytPillTxt}>Watch</Text>
          </Pressable>
        )}
      </View>

      {expanded && (
        <View style={s.expandedSection}>
          <View style={s.ingredientsBox}>
            <Text style={s.ingredientsLabel}>{t.ingredients}</Text>
            <Text style={s.ingredientsText}>{meal.ingredients}</Text>
          </View>
        </View>
      )}

      <Pressable style={s.expandRow} onPress={() => setExpanded(!expanded)}>
        <Text style={s.expandTxt}>{expanded ? t.showLess : t.showIngredients}</Text>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={14} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}

function MacroPill({
  value, label, color, bg,
}: {
  value?: number; label: string; color: string; bg: string;
}) {
  const colors = useColors();
  return (
    <View style={[macroPillStyles.pill, { backgroundColor: bg }]}>
      <Text style={[macroPillStyles.value, { color }]}>{value ?? "—"}g</Text>
      <Text style={[macroPillStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const macroPillStyles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    marginRight: 6,
  },
  value: { fontSize: 12, fontFamily: "Inter_700Bold" },
  label: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

function BatchPrepChecklist({
  meals, colors, t,
}: {
  meals: GeneratedMeal[];
  colors: ReturnType<typeof useColors>;
  t: Translations["planner"];
}) {
  const items = buildChecklistItems(meals, t);
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const doneCount = checked.filter(Boolean).length;
  const sundayLabel = getNextSundayLabel();
  const s = batchStyles(colors);

  const toggle = (i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.titleRow}>
          <Feather name="check-square" size={16} color={colors.primary} />
          <Text style={s.title}>{t.batchTitle}</Text>
        </View>
        <View style={s.sundayBadge}>
          <Text style={s.sundayText}>{t.batchDoSunday(sundayLabel)}</Text>
        </View>
      </View>

      {items.map((item, i) => (
        <Pressable key={i} style={s.itemRow} onPress={() => toggle(i)}>
          <View style={[s.circle, checked[i] && s.circleChecked]}>
            {checked[i] && <Feather name="check" size={11} color="#fff" />}
          </View>
          <Text style={[s.itemText, checked[i] && s.itemTextDone]}>{item}</Text>
        </Pressable>
      ))}

      <View style={s.footer}>
        <Text style={s.progress}>{t.batchProgress(doneCount, items.length)}</Text>
      </View>
    </View>
  );
}

const batchStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 4,
      marginBottom: 8,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
    title: { fontSize: 14, fontFamily: "Inter_700Bold", color: colors.foreground },
    sundayBadge: {
      backgroundColor: "rgba(242,107,29,0.12)",
      borderRadius: 100,
      paddingHorizontal: 9,
      paddingVertical: 3,
    },
    sundayText: { fontSize: 10, fontFamily: "Inter_500Medium", color: colors.primary },
    itemRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 14,
      paddingVertical: 13,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    circle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 1,
      flexShrink: 0,
    },
    circleChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
    itemText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: colors.foreground, lineHeight: 20 },
    itemTextDone: { color: colors.mutedForeground, textDecorationLine: "line-through" },
    footer: { paddingHorizontal: 14, paddingVertical: 10 },
    progress: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
  });

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    header: {
      backgroundColor: colors.sidebar,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
    headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.5)", marginTop: 4 },
    configCard: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    configTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground, marginBottom: 16 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
    configLabel: { fontSize: 15, fontFamily: "Inter_500Medium", color: colors.foreground },
    counter: { flexDirection: "row", alignItems: "center", gap: 12 },
    counterBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    counterVal: { fontSize: 18, fontFamily: "Inter_700Bold", color: colors.foreground, minWidth: 28, textAlign: "center" },
    calorieInput: {
      width: 90,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      textAlign: "center",
      backgroundColor: colors.background,
    },
    generateBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 50,
      gap: 8,
      marginTop: 4,
    },
    generateBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
    resultSection: { paddingHorizontal: 16 },
    planHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14, gap: 12 },
    planName: { fontSize: 20, fontFamily: "Inter_700Bold", color: colors.foreground },
    planSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 3 },
    saveBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: colors.primary,
      marginTop: 2,
    },
    saveBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.primary },
    macroTotalsRow: { flexDirection: "row", marginBottom: 16, marginHorizontal: -3 },
  });

const mealCardStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      padding: 14,
      paddingBottom: 10,
    },
    emojiRing: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2.5,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(242,107,29,0.10)",
    },
    emoji: { fontSize: 22 },
    mealTypeLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: colors.primary, letterSpacing: 1, marginBottom: 2 },
    mealName: { fontSize: 15, fontFamily: "Inter_700Bold", color: colors.foreground },
    mealDesc: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2, lineHeight: 17 },
    calsBadge: { alignItems: "center", paddingTop: 2 },
    cals: { fontSize: 17, fontFamily: "Inter_700Bold", color: colors.primary },
    calsLabel: { fontSize: 10, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    macroPillsRow: { flexDirection: "row", paddingHorizontal: 14, paddingBottom: 10 },
    expandedSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 4,
      gap: 10,
    },
    ingredientsBox: { backgroundColor: colors.muted, borderRadius: 10, padding: 12 },
    ingredientsLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground, letterSpacing: 0.8, marginBottom: 6 },
    ingredientsText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.foreground, lineHeight: 20 },
    ytPill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 100,
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 4,
      backgroundColor: "rgba(255,0,0,0.12)",
      marginRight: 6,
    },
    ytPillTxt: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#FF0000" },
    expandRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 4,
    },
    expandTxt: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
  });

export default function PlannerScreen() {
  return (
    <PremiumGate feature="AI Meal Planner">
      <PlannerScreenContent />
    </PremiumGate>
  );
}
