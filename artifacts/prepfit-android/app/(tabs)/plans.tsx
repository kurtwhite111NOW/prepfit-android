import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListMealPlansQueryKey,
  getGetMealPlanQueryKey,
  listMealPlans,
  getMealPlan,
  useDeleteMealPlan,
} from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
import { Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const swipeableRefs = useRef<Map<number, Swipeable | null>>(new Map());

  const { data: plans, isLoading, refetch } = useQuery({
    queryKey: getListMealPlansQueryKey(),
    queryFn: () => listMealPlans(),
  });

  const { data: planDetail, isLoading: detailLoading } = useQuery({
    queryKey: getGetMealPlanQueryKey(selectedPlanId ?? 0),
    queryFn: () => getMealPlan(selectedPlanId!),
    enabled: !!selectedPlanId,
  });

  const deleteMutation = useDeleteMealPlan({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert("Error", "Failed to delete plan."),
    },
  });

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Delete Plan", `Delete "${name}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  };

  const s = styles(colors);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Text style={s.headerTitle}>Saved Plans</Text>
        <Text style={s.headerSub}>{plans?.length ?? 0} meal plans saved</Text>
      </View>

      <FlatList
        data={plans ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          s.list,
          (!plans || plans.length === 0) && { flex: 1 },
        ]}
        refreshing={isLoading}
        onRefresh={refetch}
        scrollEnabled={!!(plans && plans.length > 0)}
        ListEmptyComponent={
          isLoading ? (
            <View style={s.center}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View style={s.empty}>
              <Feather name="clipboard" size={52} color={colors.mutedForeground} />
              <Text style={s.emptyTitle}>No plans yet</Text>
              <Text style={s.emptySub}>Generate your first AI meal plan in the Planner tab</Text>
              <Pressable
                style={({ pressed }) => [s.goBtn, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => router.push("/(tabs)/planner" as never)}
              >
                <Text style={s.goBtnText}>Go to Planner</Text>
              </Pressable>
            </View>
          )
        }
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => { swipeableRefs.current.set(item.id, ref); }}
            onSwipeableWillOpen={() => {
              swipeableRefs.current.forEach((ref, id) => {
                if (id !== item.id) ref?.close();
              });
            }}
            renderRightActions={() => (
              <Pressable
                style={s.swipeDelete}
                onPress={() => {
                  swipeableRefs.current.get(item.id)?.close();
                  handleDelete(item.id, item.name);
                }}
              >
                <Feather name="trash-2" size={20} color="#FFF" />
                <Text style={s.swipeDeleteText}>Delete</Text>
              </Pressable>
            )}
          >
            <Pressable
              style={({ pressed }) => [s.card, { opacity: pressed ? 0.93 : 1 }]}
              onPress={() => setSelectedPlanId(item.id)}
            >
              <View style={s.cardLeft}>
                <View style={s.planIcon}>
                  <Feather name="calendar" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.planName} numberOfLines={1}>{item.name}</Text>
                  <View style={s.planMeta}>
                    <Text style={s.planMetaText}>{item.mealsPerDay} meals/day</Text>
                    <View style={s.dot} />
                    <Text style={s.planMetaText}>{item.dailyCalories} kcal</Text>
                  </View>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          </Swipeable>
        )}
      />

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
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    planIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
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
    swipeDelete: {
      backgroundColor: colors.destructive,
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      borderRadius: 12,
      marginLeft: 8,
      gap: 4,
    },
    swipeDeleteText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
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
