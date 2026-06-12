import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListWeightEntriesQueryKey,
  listWeightEntries,
  useCreateWeightEntry,
  useDeleteWeightEntry,
} from "@workspace/api-client-react";
import type { WeightEntry } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

function WeightChart({
  entries,
  colors,
}: {
  entries: WeightEntry[];
  colors: ReturnType<typeof useColors>;
}) {
  const sorted = [...entries]
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .slice(-10);

  if (sorted.length < 2) return null;

  const data = sorted.map((e, i) => ({ x: i + 1, y: e.weight }));
  const weights = sorted.map((e) => e.weight);
  const minY = Math.min(...weights) - 2;
  const maxY = Math.max(...weights) + 2;

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      height={160}
      padding={{ top: 16, bottom: 36, left: 44, right: 16 }}
      domain={{ y: [minY, maxY] }}
    >
      <VictoryAxis
        tickCount={Math.min(sorted.length, 5)}
        style={{
          axis: { stroke: colors.border },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: colors.mutedForeground, fontSize: 10 },
        }}
      />
      <VictoryAxis
        dependentAxis
        style={{
          axis: { stroke: colors.border },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: colors.mutedForeground, fontSize: 10 },
          grid: { stroke: colors.border, strokeDasharray: "4,4" },
        }}
      />
      <VictoryLine
        data={data}
        style={{ data: { stroke: colors.primary, strokeWidth: 2.5 } }}
        interpolation="monotoneX"
      />
      <VictoryScatter
        data={data}
        size={4}
        style={{ data: { fill: colors.primary } }}
      />
    </VictoryChart>
  );
}

export default function WeightScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [notes, setNotes] = useState("");

  const { data: entries, isLoading, refetch } = useQuery({
    queryKey: getListWeightEntriesQueryKey(),
    queryFn: () => listWeightEntries(),
  });

  const addMutation = useCreateWeightEntry({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListWeightEntriesQueryKey() });
        setWeight("");
        setNotes("");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert("Error", "Failed to save weight entry."),
    },
  });

  const deleteMutation = useDeleteWeightEntry({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListWeightEntriesQueryKey() }),
    },
  });

  const handleAdd = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      Alert.alert("Invalid", "Please enter a valid weight.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addMutation.mutate({ data: { weight: w, unit, notes: notes.trim() || undefined } });
  };

  const latest = entries?.[0];
  const prev = entries?.[1];
  const change =
    latest && prev ? (latest.weight - prev.weight).toFixed(1) : null;
  const totalChange =
    latest && entries && entries.length > 1
      ? (latest.weight - entries[entries.length - 1].weight).toFixed(1)
      : null;

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.header, { paddingTop: 16 }]}>
        <Text style={s.headerTitle}>Weight Tracker</Text>
        <Text style={s.headerSub}>Monitor your progress over time</Text>
      </View>

      {entries && entries.length >= 2 && (
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statVal}>{latest?.weight ?? "—"}</Text>
            <Text style={s.statLabel}>Current ({latest?.unit})</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statVal, { color: change && parseFloat(change) > 0 ? colors.destructive : "#22C55E" }]}>
              {change ? `${parseFloat(change) > 0 ? "+" : ""}${change}` : "—"}
            </Text>
            <Text style={s.statLabel}>Last change</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statVal}>
              {totalChange ? `${parseFloat(totalChange) > 0 ? "+" : ""}${totalChange}` : "—"}
            </Text>
            <Text style={s.statLabel}>Total change</Text>
          </View>
        </View>
      )}

      {entries && entries.length >= 2 && (
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Progress</Text>
          <WeightChart entries={entries} colors={colors} />
        </View>
      )}

      <View style={s.logCard}>
        <Text style={s.logTitle}>Log Weight</Text>
        <View style={s.unitRow}>
          {(["lbs", "kg"] as const).map((u) => (
            <Pressable
              key={u}
              style={[s.unitBtn, unit === u && { backgroundColor: colors.primary }]}
              onPress={() => setUnit(u)}
            >
              <Text style={[s.unitBtnText, unit === u && { color: "#FFF" }]}>{u}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={s.input}
          placeholder={`Weight in ${unit}`}
          placeholderTextColor={colors.mutedForeground}
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={[s.input, { height: 64 }]}
          placeholder="Notes (optional)"
          placeholderTextColor={colors.mutedForeground}
          multiline
          value={notes}
          onChangeText={setNotes}
        />
        <Pressable
          style={({ pressed }) => [s.addBtn, { opacity: pressed || addMutation.isPending ? 0.8 : 1 }]}
          onPress={handleAdd}
          disabled={addMutation.isPending}
        >
          <Feather name="plus" size={18} color="#FFF" />
          <Text style={s.addBtnText}>Log Entry</Text>
        </Pressable>
      </View>

      {entries && entries.length > 0 && (
        <View style={s.historySection}>
          <Text style={s.historyTitle}>History</Text>
          {entries.map((entry) => (
            <View key={entry.id} style={s.historyItem}>
              <View>
                <Text style={s.historyWeight}>{entry.weight} {entry.unit}</Text>
                <Text style={s.historyDate}>
                  {new Date(entry.recordedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                {entry.notes && <Text style={s.historyNotes}>{entry.notes}</Text>}
              </View>
              <Pressable
                onPress={() =>
                  Alert.alert("Delete", "Remove this weight entry?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteMutation.mutate({ id: entry.id }),
                    },
                  ])
                }
              >
                <Feather name="trash-2" size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
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
    statsRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    statVal: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    statLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
      textAlign: "center",
    },
    chartCard: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    chartTitle: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      alignSelf: "flex-start",
      marginBottom: 12,
    },
    logCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    logTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    unitRow: { flexDirection: "row", gap: 8 },
    unitBtn: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    input: {
      height: 48,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.background,
    },
    addBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      height: 48,
      borderRadius: 12,
    },
    addBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
    },
    historySection: { paddingHorizontal: 16, marginTop: 20 },
    historyTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 10,
    },
    historyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    historyWeight: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    historyDate: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    historyNotes: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
      fontStyle: "italic",
    },
  });
