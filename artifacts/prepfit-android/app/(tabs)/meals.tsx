import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListSavedMealsQueryKey,
  listSavedMeals,
  deleteSavedMeal,
} from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useRouter } from "expo-router";

export default function MealsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const router = useRouter();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const { data: meals, isLoading, refetch } = useQuery({
    queryKey: getListSavedMealsQueryKey(),
    queryFn: () => listSavedMeals(),
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
      "Delete Meals",
      `Remove ${ids.length} meal${ids.length !== 1 ? "s" : ""} from your journal?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await Promise.all(ids.map((id) => deleteSavedMeal(id)));
            qc.invalidateQueries({ queryKey: getListSavedMealsQueryKey() });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            cancelSelecting();
          },
        },
      ]
    );
  };

  const s = styles(colors);
  const hasMeals = !!(meals && meals.length > 0);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: 16 }]}>
        <View>
          <Text style={s.headerTitle}>My Meals</Text>
          <Text style={s.headerSub}>{meals?.length ?? 0} meals scanned</Text>
        </View>
        {hasMeals && (
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
        data={meals ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          s.list,
          (!meals || meals.length === 0) && { flex: 1 },
          isSelecting && { paddingBottom: 80 + insets.bottom },
        ]}
        refreshing={isLoading}
        onRefresh={refetch}
        scrollEnabled={hasMeals}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={s.empty}>
              <Feather name="camera" size={52} color={colors.mutedForeground} />
              <Text style={s.emptyTitle}>No meals scanned yet</Text>
              <Text style={s.emptySub}>Take a photo of your meal to log calories</Text>
              <Pressable
                style={({ pressed }) => [s.scanBtn, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => router.push("/(tabs)/scan" as never)}
              >
                <Feather name="camera" size={16} color="#FFF" />
                <Text style={s.scanBtnText}>Scan a Meal</Text>
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
                { opacity: pressed ? 0.92 : 1 },
              ]}
              onPress={() => isSelecting ? toggleSelect(item.id) : undefined}
              onLongPress={() => { if (!isSelecting) startSelecting(); toggleSelect(item.id); }}
            >
              {isSelecting && (
                <View style={[s.checkbox, checked && s.checkboxChecked]}>
                  {checked && <Feather name="check" size={12} color="#fff" />}
                </View>
              )}
              {item.imageData ? (
                <Image
                  source={{ uri: item.imageData }}
                  style={s.mealImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[s.mealImage, s.mealImagePlaceholder]}>
                  <Feather name="camera" size={24} color={colors.mutedForeground} />
                </View>
              )}
              <View style={s.cardBody}>
                <Text style={s.mealName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.mealDesc} numberOfLines={2}>{item.description}</Text>
                <View style={s.cardFooter}>
                  <View style={s.calsBadge}>
                    <Feather name="zap" size={12} color={colors.primary} />
                    <Text style={s.cals}>{item.estimatedCalories} kcal</Text>
                  </View>
                  <Text style={s.date}>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
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
    list: {
      padding: 16,
      gap: 10,
    },
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
    scanBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 8,
    },
    scanBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
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
      marginLeft: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    mealImage: {
      width: 80,
      height: 80,
    },
    mealImagePlaceholder: {
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    cardBody: {
      flex: 1,
      padding: 10,
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
      lineHeight: 16,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
    },
    calsBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    cals: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    date: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
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
  });
