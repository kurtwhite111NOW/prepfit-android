import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListSavedMealsQueryKey,
  listSavedMeals,
  useDeleteSavedMeal,
} from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
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

  const { data: meals, isLoading, refetch } = useQuery({
    queryKey: getListSavedMealsQueryKey(),
    queryFn: () => listSavedMeals(),
  });

  const deleteMutation = useDeleteSavedMeal({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListSavedMealsQueryKey() });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    },
  });

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Delete Meal", `Remove "${name}" from your journal?`, [
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
        <Text style={s.headerTitle}>My Meals</Text>
        <Text style={s.headerSub}>{meals?.length ?? 0} meals scanned</Text>
      </View>

      <FlatList
        data={meals ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          s.list,
          (!meals || meals.length === 0) && { flex: 1 },
        ]}
        refreshing={isLoading}
        onRefresh={refetch}
        scrollEnabled={!!(meals && meals.length > 0)}
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
        renderItem={({ item }) => (
          <View style={s.card}>
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
            <Pressable
              style={({ pressed }) => [s.deleteBtn, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => handleDelete(item.id, item.name)}
            >
              <Feather name="trash-2" size={16} color={colors.destructive} />
            </Pressable>
          </View>
        )}
      />
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
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
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
    deleteBtn: {
      width: 44,
      alignItems: "center",
      justifyContent: "center",
      paddingRight: 4,
    },
  });
