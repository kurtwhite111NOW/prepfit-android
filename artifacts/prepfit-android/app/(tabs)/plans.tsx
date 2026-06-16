import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListMealPlansQueryKey,
  getGetMealPlanQueryKey,
  listMealPlans,
  getMealPlan,
  deleteMealPlan,
} from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const MEAL_TYPE_EMOJI: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍎",
};

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const router = useRouter();

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [panelVisible, setPanelVisible] = useState(false);
  const [expandedMealId, setExpandedMealId] = useState<number | null>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const openPanel = (id: number) => {
    setSelectedPlanId(id);
    setPanelVisible(true);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 20 }),
      Animated.timing(backdropAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const closePanel = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 260, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => {
      setPanelVisible(false);
      setSelectedPlanId(null);
    });
  };

  const { data: plans, isLoading, refetch } = useQuery({
    queryKey: getListMealPlansQueryKey(),
    queryFn: () => listMealPlans(),
  });

  const { data: planDetail, isLoading: detailLoading } = useQuery({
    queryKey: getGetMealPlanQueryKey(selectedPlanId ?? 0),
    queryFn: () => getMealPlan(selectedPlanId!),
    enabled: !!selectedPlanId,
  });

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    if (next.size > 0) Haptics.selectionAsync();
  };

  const startSelecting = () => {
    setIsSelecting(true);
    setSelected(new Set());
  };

  const cancelSelecting = () => {
    setIsSelecting(false);
    setSelected(new Set());
  };

  const handleDeleteSelected = () => {
    const ids = Array.from(selected);
    Alert.alert(
      "Delete Plans",
      `Delete ${ids.length} plan${ids.length !== 1 ? "s" : ""}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const results = await Promise.allSettled(ids.map((id) => deleteMealPlan(id)));
            const failed = results.filter((r) => r.status === "rejected").length;
            qc.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
            if (failed > 0) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Partial Delete", `${ids.length - failed} removed, ${failed} failed. Please try again.`);
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            cancelSelecting();
          },
        },
      ]
    );
  };

  const s = styles(colors);
  const hasPlans = !!(plans && plans.length > 0);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: 16 }]}>
        <View>
          <Text style={s.headerTitle}>Saved Plans</Text>
          <Text style={s.headerSub}>{plans?.length ?? 0} meal plans saved</Text>
        </View>
        {hasPlans && (
          isSelecting ? (
            <Pressable onPress={cancelSelecting} style={s.selectBtn}>
              <Text style={s.selectBtnText}>Cancel</Text>
            </Pressable>
          ) : (
            <Pressable onPress={startSelecting} style={s.selectBtn}>
              <Feather name="check-square" size={14} color="#fff" />
              <Text style={s.selectBtnText}>Select</Text>
            </Pressable>
          )
        )}
      </View>

      <FlatList
        data={plans ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          s.list,
          (!plans || plans.length === 0) && { flex: 1 },
          isSelecting && { paddingBottom: 80 + insets.bottom },
        ]}
        refreshing={isLoading}
        onRefresh={refetch}
        scrollEnabled={hasPlans}
        ListEmptyComponent={
          isLoading ? (
            <View style={s.center}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View style={s.empty}>
              <Feather name="clipboard" size={52} color={colors.mutedForeground} />
              <Text style={s.emptyTitle}>No plans yet</Text>
              <Text style={s.emptySub}>Generate your first meal plan in the Planner tab</Text>
              <Pressable
                style={({ pressed }) => [s.goBtn, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => router.push("/(tabs)/planner" as never)}
              >
                <Text style={s.goBtnText}>Go to Planner</Text>
              </Pressable>
            </View>
          )
        }
        renderItem={({ item }) => {
          const checked = selected.has(item.id);
          return (
            <Pressable
              style={({ pressed }) => [
                s.card,
                checked && s.cardSelected,
                { opacity: pressed ? 0.93 : 1 },
              ]}
              onPress={() => {
                if (isSelecting) toggleSelect(item.id);
                else openPanel(item.id);
              }}
              onLongPress={() => {
                if (!isSelecting) startSelecting();
                toggleSelect(item.id);
              }}
            >
              {isSelecting ? (
                <View style={[s.checkbox, checked && s.checkboxChecked]}>
                  {checked && <Feather name="check" size={12} color="#fff" />}
                </View>
              ) : (
                <View style={s.planIcon}>
                  <Feather name="calendar" size={18} color={colors.primary} />
                </View>
              )}
              <View style={s.cardContent}>
                <Text style={s.planName} numberOfLines={1}>{item.name}</Text>
                <View style={s.planMeta}>
                  <Text style={s.planMetaText}>{item.mealsPerDay} meals/day</Text>
                  <View style={s.dot} />
                  <Text style={s.planMetaText}>{item.dailyCalories} kcal</Text>
                </View>
              </View>
              {!isSelecting && (
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              )}
            </Pressable>
          );
        }}
      />

      {isSelecting && (
        <View style={[s.deleteBar, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={s.deleteBarCount}>
            {selected.size} selected
          </Text>
          <Pressable
            style={({ pressed }) => [
              s.deleteBarBtn,
              selected.size === 0 && s.deleteBarBtnDisabled,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleDeleteSelected}
            disabled={selected.size === 0}
          >
            <Feather name="trash-2" size={16} color="#fff" />
            <Text style={s.deleteBarBtnText}>
              Delete{selected.size > 0 ? ` (${selected.size})` : ""}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Backdrop */}
      {panelVisible && (
        <Animated.View
          style={[s.backdrop, { opacity: backdropAnim }]}
          pointerEvents={panelVisible ? "auto" : "none"}
        >
          <Pressable style={{ flex: 1 }} onPress={closePanel} />
        </Animated.View>
      )}

      {/* Slide-up panel — stays inside tab screen so tab bar remains visible */}
      {panelVisible && (
        <Animated.View
          style={[
            s.panel,
            { backgroundColor: colors.background, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle */}
          <View style={s.panelHandle} />

          {/* Header */}
          <View style={s.modalHeader}>
            <Text style={s.modalTitle} numberOfLines={1}>
              {planDetail?.name ?? "Loading..."}
            </Text>
            <Pressable onPress={closePanel} style={s.closeBtn}>
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>
          </View>

          {detailLoading ? (
            <View style={s.center}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : planDetail ? (
            <ScrollView
              contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={s.planStats}>
                <View style={s.planStatItem}>
                  <Text style={s.planStatVal}>{planDetail.mealsPerDay}</Text>
                  <Text style={s.planStatLabel}>Meals/day</Text>
                </View>
                <View style={s.planStatItem}>
                  <Text style={s.planStatVal}>{planDetail.dailyCalories}</Text>
                  <Text style={s.planStatLabel}>kcal/day</Text>
                </View>
                <View style={s.planStatItem}>
                  <Text style={s.planStatVal}>{planDetail.meals.length}</Text>
                  <Text style={s.planStatLabel}>Meals total</Text>
                </View>
              </View>

              {planDetail.meals.map((meal) => {
                const isExpanded = expandedMealId === meal.id;
                const emoji = meal.mealType ? (MEAL_TYPE_EMOJI[meal.mealType] ?? "🍽️") : "🍽️";
                const ingredientList = meal.ingredients
                  ? meal.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
                  : [];
                return (
                  <Pressable
                    key={meal.id}
                    style={({ pressed }) => [s.mealCard, isExpanded && s.mealCardExpanded, { opacity: pressed ? 0.95 : 1 }]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setExpandedMealId(isExpanded ? null : meal.id);
                    }}
                  >
                    {/* Header row — always visible */}
                    <View style={s.mealCardHeader}>
                      <View style={s.mealEmojiWrap}>
                        <Text style={s.mealEmoji}>{emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.mealTypeLabel}>MEAL {meal.mealNumber}</Text>
                        <Text style={s.mealName}>{meal.name}</Text>
                      </View>
                      <View style={s.mealHeaderRight}>
                        <View style={s.calsBadge}>
                          <Text style={s.cals}>{meal.calories}</Text>
                          <Text style={s.calsUnit}>kcal</Text>
                        </View>
                        <Feather
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={16}
                          color={colors.mutedForeground}
                        />
                      </View>
                    </View>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <View style={s.mealDetail}>
                        {/* Description */}
                        <Text style={s.mealDesc}>{meal.description}</Text>

                        {/* Macros */}
                        {(meal.protein || meal.carbs || meal.fat) ? (
                          <View style={s.macrosRow}>
                            {meal.protein != null && (
                              <View style={[s.macroPill, s.macroPillProtein]}>
                                <Text style={s.macroPillText}>💪 {meal.protein}g protein</Text>
                              </View>
                            )}
                            {meal.carbs != null && (
                              <View style={[s.macroPill, s.macroPillCarbs]}>
                                <Text style={s.macroPillText}>🍚 {meal.carbs}g carbs</Text>
                              </View>
                            )}
                            {meal.fat != null && (
                              <View style={[s.macroPill, s.macroPillFat]}>
                                <Text style={s.macroPillText}>🥑 {meal.fat}g fat</Text>
                              </View>
                            )}
                          </View>
                        ) : null}

                        {/* Ingredients */}
                        {ingredientList.length > 0 && (
                          <View>
                            <Text style={s.sectionLabel}>INGREDIENTS</Text>
                            <View style={s.ingredientsWrap}>
                              {ingredientList.map((ing, idx) => (
                                <View key={idx} style={s.ingChip}>
                                  <Text style={s.ingChipText}>{ing}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* YouTube button */}
                        {meal.youtubeUrl ? (
                          <Pressable
                            style={({ pressed }) => [s.ytBtn, { opacity: pressed ? 0.8 : 1 }]}
                            onPress={() => {
                              if (meal.youtubeUrl) Linking.openURL(meal.youtubeUrl);
                            }}
                          >
                            <Feather name="youtube" size={16} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={s.ytBtnText}>Watch How to Make It</Text>
                          </Pressable>
                        ) : null}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </Animated.View>
      )}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    header: {
      backgroundColor: colors.sidebar,
      paddingHorizontal: 20,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
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
    selectBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 4,
    },
    selectBtnText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    list: { padding: 16, gap: 10 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      gap: 10,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginTop: 8,
    },
    emptySub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    goBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 8,
    },
    goBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardSelected: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      flexShrink: 0,
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    cardContent: {
      flex: 1,
    },
    planIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    planName: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    planMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 3,
      gap: 6,
    },
    planMetaText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.mutedForeground,
    },
    deleteBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 20,
      paddingTop: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8,
    },
    deleteBarCount: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    deleteBarBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.destructive,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
    },
    deleteBarBtnDisabled: {
      opacity: 0.4,
    },
    deleteBarBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    backdrop: {
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.55)",
      zIndex: 10,
    },
    panel: {
      position: "absolute",
      left: 0, right: 0, bottom: 0,
      height: "88%",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      zIndex: 11,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 24,
    },
    panelHandle: {
      width: 36, height: 4,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.18)",
      alignSelf: "center",
      marginTop: 10,
      marginBottom: 6,
    },
    closeBtn: {
      width: 32, height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      flex: 1,
      marginRight: 12,
    },
    planStats: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 16,
    },
    planStatItem: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    planStatVal: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    planStatLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    mealCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mealCardExpanded: {
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
    mealCardHeader: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    mealEmojiWrap: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    mealEmoji: { fontSize: 20 },
    mealTypeLabel: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      letterSpacing: 0.6,
      marginBottom: 1,
    },
    mealName: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    mealHeaderRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexShrink: 0,
    },
    calsBadge: { alignItems: "center" },
    cals: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    calsUnit: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },

    /* Expanded detail area */
    mealDetail: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
    mealDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    macrosRow: {
      flexDirection: "row",
      gap: 6,
      flexWrap: "wrap",
    },
    macroPill: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: colors.accent,
    },
    macroPillProtein: { backgroundColor: "rgba(249,115,22,0.12)" },
    macroPillCarbs: { backgroundColor: "rgba(245,158,11,0.12)" },
    macroPillFat: { backgroundColor: "rgba(59,130,246,0.12)" },
    macroPillText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    sectionLabel: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    ingredientsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    ingChip: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ingChipText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    ytBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FF0000",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 2,
    },
    ytBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
  });
