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
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const router = useRouter();

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

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
            await Promise.all(ids.map((id) => deleteMealPlan(id)));
            qc.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
                else setSelectedPlanId(item.id);
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

      <Modal
        visible={!!selectedPlanId}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPlanId(null)}
      >
        <View style={[s.modal, { paddingTop: insets.top + 16 }]}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle} numberOfLines={1}>
              {planDetail?.name ?? "Loading..."}
            </Text>
            <Pressable onPress={() => setSelectedPlanId(null)}>
              <Feather name="x" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {detailLoading ? (
            <View style={s.center}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : planDetail ? (
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
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

              {planDetail.meals.map((meal) => (
                <View key={meal.id} style={s.mealCard}>
                  <View style={s.mealCardHeader}>
                    <View style={s.mealNumBadge}>
                      <Text style={s.mealNum}>{meal.mealNumber}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.mealName}>{meal.name}</Text>
                      <Text style={s.mealDesc} numberOfLines={2}>{meal.description}</Text>
                    </View>
                    <View style={s.calsBadge}>
                      <Text style={s.cals}>{meal.calories}</Text>
                      <Text style={s.calsUnit}>kcal</Text>
                    </View>
                  </View>
                  {(meal.protein || meal.carbs || meal.fat) ? (
                    <View style={s.macrosRow}>
                      {[
                        { label: "P", value: meal.protein },
                        { label: "C", value: meal.carbs },
                        { label: "F", value: meal.fat },
                      ].map(({ label, value }) => value !== undefined && value !== null ? (
                        <View key={label} style={s.macroPill}>
                          <Text style={s.macroPillText}>{label}: {value}g</Text>
                        </View>
                      ) : null)}
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </Modal>
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
    modal: {
      flex: 1,
      backgroundColor: colors.background,
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
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mealCardHeader: {
      flexDirection: "row",
      gap: 10,
      alignItems: "flex-start",
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
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    mealDesc: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    calsBadge: { alignItems: "center" },
    cals: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    calsUnit: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    macrosRow: {
      flexDirection: "row",
      gap: 6,
      marginTop: 10,
      flexWrap: "wrap",
    },
    macroPill: {
      backgroundColor: colors.accent,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    macroPillText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.accentForeground,
    },
  });
