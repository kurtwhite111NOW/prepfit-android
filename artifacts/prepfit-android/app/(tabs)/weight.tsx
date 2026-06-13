import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListWeightEntriesQueryKey,
  listWeightEntries,
  useCreateWeightEntry,
  useDeleteWeightEntry,
} from "@workspace/api-client-react";
import type { WeightEntry } from "@workspace/api-client-react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Image,
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

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProgressPhoto {
  id: string;
  date: string;
  base64: string;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const PROGRESS_PHOTOS_KEY = "prepfit_progress_photos";
const MAX_PHOTOS = 12;

async function loadPhotos(): Promise<ProgressPhoto[]> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_PHOTOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function savePhotos(photos: ProgressPhoto[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_PHOTOS_KEY, JSON.stringify(photos));
  } catch {}
}

// ─── BMI helpers ─────────────────────────────────────────────────────────────

function calcBMI(weightLbs: number, totalInches: number): number {
  if (totalInches === 0) return 0;
  return (weightLbs / (totalInches * totalInches)) * 703;
}

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#38BDF8" };
  if (bmi < 25) return { label: "Healthy Weight", color: "#22C55E" };
  if (bmi < 30) return { label: "Overweight", color: "#F59E0B" };
  return { label: "Obese", color: "#EF4444" };
}

function idealWeightRange(totalInches: number): string {
  const low = ((18.5 * totalInches * totalInches) / 703).toFixed(0);
  const high = ((24.9 * totalInches * totalInches) / 703).toFixed(0);
  return `${low}–${high} lbs`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function WeightScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [notes, setNotes] = useState("");

  // BMI state
  const [bmiOpen, setBmiOpen] = useState(false);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(7);
  const [heightUnit, setHeightUnit] = useState<"imperial" | "metric">("imperial");
  const [heightCm, setHeightCm] = useState("170");

  // Progress photos state
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

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

  useEffect(() => {
    loadPhotos().then(setPhotos);
  }, []);

  const handleAdd = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      Alert.alert("Invalid", "Please enter a valid weight.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addMutation.mutate({ data: { weight: w, unit, notes: notes.trim() || undefined } });
  };

  const handleAddPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert("Limit reached", `You can store up to ${MAX_PHOTOS} progress photos. Delete some to add more.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo access to add progress photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.25,
      base64: true,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (result.canceled || !result.assets[0]?.base64) return;

    const newPhoto: ProgressPhoto = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      base64: result.assets[0].base64,
    };
    const updated = [newPhoto, ...photos].slice(0, MAX_PHOTOS);
    setPhotos(updated);
    await savePhotos(updated);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeletePhoto = (id: string) => {
    Alert.alert("Delete Photo", "Remove this progress photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = photos.filter((p) => p.id !== id);
          setPhotos(updated);
          await savePhotos(updated);
        },
      },
    ]);
  };

  // BMI computation
  const latest = entries?.[0];
  const prev = entries?.[1];
  const change = latest && prev ? (latest.weight - prev.weight).toFixed(1) : null;
  const totalChange =
    latest && entries && entries.length > 1
      ? (latest.weight - entries[entries.length - 1].weight).toFixed(1)
      : null;

  const bmiWeightLbs =
    latest?.unit === "kg" ? (latest?.weight ?? 0) * 2.20462 : (latest?.weight ?? 0);
  const totalInches =
    heightUnit === "imperial"
      ? heightFt * 12 + heightIn
      : Math.round((parseFloat(heightCm) || 170) / 2.54);
  const bmi = calcBMI(bmiWeightLbs, totalInches);
  const bmiCat = bmiCategory(bmi);
  const idealRange = idealWeightRange(totalInches);

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

      {/* ── BMI Calculator ─────────────────────────────────────────────────── */}
      <View style={s.bmiCard}>
        <Pressable
          style={s.bmiHeader}
          onPress={() => setBmiOpen((o) => !o)}
        >
          <View style={s.bmiHeaderLeft}>
            <View style={s.bmiIconWrap}>
              <Feather name="activity" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={s.bmiTitle}>BMI Calculator</Text>
              {latest && !bmiOpen && (
                <Text style={s.bmiSubtitle}>
                  {bmi > 0 ? `BMI ${bmi.toFixed(1)} · ${bmiCat.label}` : "Tap to calculate"}
                </Text>
              )}
            </View>
          </View>
          <Feather name={bmiOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
        </Pressable>

        {bmiOpen && (
          <View style={s.bmiBody}>
            <View style={s.bmiUnitRow}>
              {(["imperial", "metric"] as const).map((u) => (
                <Pressable
                  key={u}
                  style={[s.unitBtn, heightUnit === u && { backgroundColor: colors.primary }]}
                  onPress={() => setHeightUnit(u)}
                >
                  <Text style={[s.unitBtnText, heightUnit === u && { color: "#FFF" }]}>
                    {u === "imperial" ? "ft / in" : "cm"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {heightUnit === "imperial" ? (
              <View style={s.ftInRow}>
                <View style={s.ftInField}>
                  <Text style={s.ftInLabel}>Feet</Text>
                  <View style={s.ftInControls}>
                    <Pressable style={s.ftBtn} onPress={() => setHeightFt((v) => Math.max(3, v - 1))}>
                      <Feather name="minus" size={14} color={colors.foreground} />
                    </Pressable>
                    <Text style={s.ftInValue}>{heightFt}</Text>
                    <Pressable style={s.ftBtn} onPress={() => setHeightFt((v) => Math.min(8, v + 1))}>
                      <Feather name="plus" size={14} color={colors.foreground} />
                    </Pressable>
                  </View>
                </View>
                <View style={s.ftInField}>
                  <Text style={s.ftInLabel}>Inches</Text>
                  <View style={s.ftInControls}>
                    <Pressable style={s.ftBtn} onPress={() => setHeightIn((v) => Math.max(0, v - 1))}>
                      <Feather name="minus" size={14} color={colors.foreground} />
                    </Pressable>
                    <Text style={s.ftInValue}>{heightIn}</Text>
                    <Pressable style={s.ftBtn} onPress={() => setHeightIn((v) => Math.min(11, v + 1))}>
                      <Feather name="plus" size={14} color={colors.foreground} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <TextInput
                style={s.input}
                placeholder="Height in cm"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="decimal-pad"
                value={heightCm}
                onChangeText={setHeightCm}
              />
            )}

            {latest && bmi > 0 ? (
              <View style={s.bmiResult}>
                <View style={s.bmiResultRow}>
                  <Text style={s.bmiNumber}>{bmi.toFixed(1)}</Text>
                  <View style={[s.bmiCatBadge, { backgroundColor: bmiCat.color + "22" }]}>
                    <Text style={[s.bmiCatText, { color: bmiCat.color }]}>{bmiCat.label}</Text>
                  </View>
                </View>
                <Text style={s.bmiDetail}>
                  Using {latest.weight} {latest.unit} · {heightUnit === "imperial" ? `${heightFt}'${heightIn}"` : `${heightCm}cm`}
                </Text>
                <View style={s.bmiRangeRow}>
                  <Feather name="target" size={13} color={colors.mutedForeground} />
                  <Text style={s.bmiRange}>Ideal weight for your height: {idealRange}</Text>
                </View>
                <View style={s.bmiScale}>
                  {[
                    { label: "Under", range: "<18.5", color: "#38BDF8" },
                    { label: "Healthy", range: "18.5–25", color: "#22C55E" },
                    { label: "Over", range: "25–30", color: "#F59E0B" },
                    { label: "Obese", range: "30+", color: "#EF4444" },
                  ].map((seg) => (
                    <View key={seg.label} style={s.bmiScaleSeg}>
                      <View style={[s.bmiScaleBar, { backgroundColor: seg.color }]} />
                      <Text style={s.bmiScaleLabel}>{seg.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={s.bmiNote}>
                {latest ? "Enter your height above to calculate BMI." : "Log a weight entry first, then calculate your BMI here."}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* ── Progress Photos ────────────────────────────────────────────────── */}
      <View style={s.photosSection}>
        <View style={s.photosSectionHeader}>
          <Text style={s.photosSectionTitle}>PROGRESS PHOTOS</Text>
          <Pressable
            style={({ pressed }) => [s.addPhotoBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={handleAddPhoto}
          >
            <Feather name="camera" size={13} color={colors.primary} />
            <Text style={s.addPhotoBtnText}>Add Photo</Text>
          </Pressable>
        </View>

        {photos.length === 0 ? (
          <Pressable style={s.photosEmpty} onPress={handleAddPhoto}>
            <Feather name="camera" size={36} color={colors.mutedForeground} />
            <Text style={s.photosEmptyTitle}>No progress photos yet</Text>
            <Text style={s.photosEmptySub}>Take weekly photos to visually track your transformation</Text>
          </Pressable>
        ) : (
          <View style={s.photosGrid}>
            {photos.map((photo) => (
              <Pressable
                key={photo.id}
                style={s.photoItem}
                onLongPress={() => handleDeletePhoto(photo.id)}
                delayLongPress={400}
              >
                <Image
                  source={{ uri: `data:image/jpeg;base64,${photo.base64}` }}
                  style={s.photoImg}
                  resizeMode="cover"
                />
                <View style={s.photoDateBadge}>
                  <Text style={s.photoDate}>
                    {new Date(photo.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
        <Text style={s.photosHint}>Long press a photo to delete · Max {MAX_PHOTOS} photos</Text>
      </View>

      {/* ── History ──────────────────────────────────────────────────────────── */}
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

    // BMI
    bmiCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    bmiHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    bmiHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    bmiIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: "rgba(242,107,29,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    bmiTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    bmiSubtitle: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    bmiBody: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    bmiUnitRow: { flexDirection: "row", gap: 8 },
    ftInRow: { flexDirection: "row", gap: 12 },
    ftInField: { flex: 1 },
    ftInLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginBottom: 6,
    },
    ftInControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    ftBtn: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    ftInValue: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    bmiResult: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 14,
      gap: 6,
    },
    bmiResultRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    bmiNumber: {
      fontSize: 36,
      fontFamily: "Inter_800ExtraBold" as any,
      color: colors.foreground,
    },
    bmiCatBadge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
    },
    bmiCatText: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
    },
    bmiDetail: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    bmiRangeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    bmiRange: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    bmiScale: {
      flexDirection: "row",
      gap: 4,
      marginTop: 4,
    },
    bmiScaleSeg: { flex: 1, alignItems: "center", gap: 3 },
    bmiScaleBar: { height: 5, width: "100%", borderRadius: 3 },
    bmiScaleLabel: {
      fontSize: 9,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    bmiNote: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingVertical: 8,
    },

    // Progress Photos
    photosSection: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    photosSectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    photosSectionTitle: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
      letterSpacing: 0.9,
    },
    addPhotoBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(242,107,29,0.12)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    addPhotoBtnText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    photosEmpty: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 32,
      alignItems: "center",
      gap: 8,
    },
    photosEmptyTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginTop: 4,
    },
    photosEmptySub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 18,
    },
    photosGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    photoItem: {
      width: "48.5%",
      aspectRatio: 3 / 4,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.muted,
    },
    photoImg: {
      width: "100%",
      height: "100%",
    },
    photoDateBadge: {
      position: "absolute",
      bottom: 8,
      left: 8,
      backgroundColor: "rgba(0,0,0,0.55)",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    photoDate: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    photosHint: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 8,
    },

    // History
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
