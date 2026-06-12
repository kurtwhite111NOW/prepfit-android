import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getListMealPlansQueryKey,
  listMealPlans,
  useGenerateMealPlan,
  useCreateMealPlan,
} from "@workspace/api-client-react";
import type { GeneratedMealPlan, GeneratedMeal } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

function PlannerScreenContent() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedMealPlan | null>(null);

  const generateMutation = useGenerateMealPlan({
    mutation: {
      onSuccess: (data) => {
        setGeneratedPlan(data);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert("Error", "Failed to generate plan. Please try again."),
    },
  });

  const saveMutation = useCreateMealPlan({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
        setGeneratedPlan(null);
        Alert.alert("Saved!", "Your meal plan has been saved.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert("Error", "Failed to save plan."),
    },
  });

  const handleGenerate = () => {
    if (mealsPerDay < 2 || mealsPerDay > 5) {
      Alert.alert("Invalid", "Meals per day must be between 2 and 5.");
      return;
    }
    if (dailyCalories < 500 || dailyCalories > 5000) {
      Alert.alert("Invalid", "Daily calories must be between 500 and 5000.");
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
        })),
      },
    });
  };

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.header, { paddingTop: 16 }]}>
        <Text style={s.headerTitle}>Meal Planner</Text>
        <Text style={s.headerSub}>Smart plans in seconds</Text>
      </View>

      <View style={s.configCard}>
        <Text style={s.configTitle}>Configure Your Plan</Text>

        <View style={s.row}>
          <Text style={s.configLabel}>Meals per day</Text>
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
          <Text style={s.configLabel}>Daily calories</Text>
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
              <Text style={s.generateBtnText}>Generate Meal Plan</Text>
            </>
          )}
        </Pressable>
      </View>

      {generatedPlan && (
        <View style={s.resultSection}>
          <View style={s.resultHeader}>
            <View>
              <Text style={s.resultTitle}>{generatedPlan.name}</Text>
              <Text style={s.resultSub}>{generatedPlan.meals.length} meals generated</Text>
            </View>
            <Pressable
              style={({ pressed }) => [s.saveBtn, { opacity: pressed || saveMutation.isPending ? 0.8 : 1 }]}
              onPress={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Text style={s.saveBtnText}>Save Plan</Text>
              )}
            </Pressable>
          </View>

          {generatedPlan.meals.map((meal) => (
            <MealCard key={meal.mealNumber} meal={meal} colors={colors} />
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function MealCard({ meal, colors }: { meal: GeneratedMeal; colors: ReturnType<typeof useColors> }) {
  const [expanded, setExpanded] = useState(false);
  const s = mealCardStyles(colors);

  return (
    <Pressable style={s.card} onPress={() => setExpanded(!expanded)}>
      <View style={s.cardHeader}>
        <View style={s.mealNumBadge}>
          <Text style={s.mealNum}>{meal.mealNumber}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.mealName}>{meal.name}</Text>
          <Text style={s.mealDesc} numberOfLines={expanded ? undefined : 1}>
            {meal.description}
          </Text>
        </View>
        <View style={s.calsBadge}>
          <Text style={s.cals}>{meal.calories}</Text>
          <Text style={s.calsLabel}>kcal</Text>
        </View>
      </View>

      {expanded && (
        <View style={s.macros}>
          <MacroBadge label="Protein" value={meal.protein} unit="g" colors={colors} />
          <MacroBadge label="Carbs" value={meal.carbs} unit="g" colors={colors} />
          <MacroBadge label="Fat" value={meal.fat} unit="g" colors={colors} />
          <View style={s.ingredients}>
            <Text style={s.ingredientsLabel}>Ingredients</Text>
            <Text style={s.ingredientsText}>{meal.ingredients}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

function MacroBadge({
  label,
  value,
  unit,
  colors,
}: {
  label: string;
  value?: number;
  unit: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 16, fontFamily: "Inter_700Bold", color: colors.primary }}>
        {value ?? "—"}{unit}
      </Text>
      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>
        {label}
      </Text>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    header: {
      backgroundColor: colors.sidebar,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    headerSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.5)",
      marginTop: 4,
    },
    configCard: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    configTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    configLabel: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    counter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    counterBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    counterVal: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      minWidth: 28,
      textAlign: "center",
    },
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
    generateBtnText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    resultSection: { paddingHorizontal: 16 },
    resultHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    resultTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    resultSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    saveBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    saveBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
  });

const mealCardStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    mealNumBadge: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    mealNum: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
      color: "#FFF",
    },
    mealName: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    mealDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    calsBadge: {
      alignItems: "center",
    },
    cals: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    calsLabel: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    macros: {
      marginTop: 12,
    },
    macrosRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 12,
    },
    ingredients: {
      marginTop: 8,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    ingredientsLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    ingredientsText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 20,
    },
  });

export default function PlannerScreen() {
  return (
    <PremiumGate feature="Meal Planner">
      <PlannerScreenContent />
    </PremiumGate>
  );
}
