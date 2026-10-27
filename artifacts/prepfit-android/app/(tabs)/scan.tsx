import { useQueryClient } from "@tanstack/react-query";
import {
  getListSavedMealsQueryKey,
  useAnalyzeMealPhoto,
  useCreateSavedMeal,
} from "@workspace/api-client-react";
import type { MealPhotoAnalysis } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PremiumGate } from "@/components/PremiumGate";
import { useLanguage } from "@/lib/i18n";

function ScanScreenContent() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const { t } = useLanguage();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MealPhotoAnalysis | null>(null);

  const analyzeMutation = useAnalyzeMealPhoto({
    mutation: {
      onSuccess: (data) => {
        setAnalysis(data);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert(t.common.error, t.scan.alertError),
    },
  });

  const saveMutation = useCreateSavedMeal({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListSavedMealsQueryKey() });
        Alert.alert(t.scan.alertSavedTitle, t.scan.alertSaved);
        setImageUri(null);
        setImageBase64(null);
        setAnalysis(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert(t.common.error, t.scan.alertSaveError),
    },
  });

  const pickImage = async (source: "camera" | "gallery") => {
    let result: ImagePicker.ImagePickerResult;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t.scan.alertPermTitle, t.scan.alertPermCamera);
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        base64: true,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t.scan.alertPermTitle, t.scan.alertPermGallery);
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        base64: true,
      });
    }

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 ?? null);
      setAnalysis(null);
    }
  };

  const handleAnalyze = () => {
    if (!imageBase64) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    analyzeMutation.mutate({ data: { imageBase64 } });
  };

  const handleSave = () => {
    if (!analysis || !imageUri) return;
    const imageData = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : imageUri;
    saveMutation.mutate({
      data: {
        name: analysis.name,
        description: analysis.description,
        estimatedCalories: analysis.estimatedCalories,
        ingredients: analysis.ingredients,
        imageData,
      },
    });
  };

  const handleReset = () => {
    setImageUri(null);
    setImageBase64(null);
    setAnalysis(null);
  };

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.header, { paddingTop: 16 }]}>
        <Text style={s.headerTitle}>{t.scan.title}</Text>
        <Text style={s.headerSub}>{t.scan.sub}</Text>
      </View>

      <View style={s.content}>
        {!imageUri ? (
          <View style={s.pickContainer}>
            <View style={s.iconRing}>
              <Feather name="camera" size={40} color={colors.primary} />
            </View>
            <Text style={s.pickTitle}>{t.scan.pickTitle}</Text>
            <Text style={s.pickSub}>{t.scan.pickSub}</Text>

            <View style={s.btnRow}>
              <Pressable
                style={({ pressed }) => [s.pickBtn, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => pickImage("camera")}
              >
                <Feather name="camera" size={20} color="#FFF" />
                <Text style={s.pickBtnText}>{t.scan.camera}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [s.pickBtnOutline, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => pickImage("gallery")}
              >
                <Feather name="image" size={20} color={colors.primary} />
                <Text style={s.pickBtnOutlineText}>{t.scan.gallery}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={s.imageContainer}>
              <Image source={{ uri: imageUri }} style={s.image} resizeMode="cover" />
              <Pressable style={s.resetBtn} onPress={handleReset}>
                <Feather name="x" size={16} color="#FFF" />
              </Pressable>
            </View>

            {!analysis && !analyzeMutation.isPending && (
              <Pressable
                style={({ pressed }) => [s.analyzeBtn, { opacity: pressed ? 0.8 : 1 }]}
                onPress={handleAnalyze}
              >
                <Feather name="zap" size={18} color="#FFF" />
                <Text style={s.analyzeBtnText}>{t.scan.analyze}</Text>
              </Pressable>
            )}

            {analyzeMutation.isPending && (
              <View style={s.analyzingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
                <Text style={s.analyzingText}>{t.scan.analyzing}</Text>
              </View>
            )}

            {analysis && (
              <View style={s.resultCard}>
                <View style={s.resultHeader}>
                  <View>
                    <Text style={s.resultName}>{analysis.name}</Text>
                    <Text style={s.resultConfidence}>{t.scan.confidence} {analysis.confidence}</Text>
                  </View>
                  <View style={s.calsBig}>
                    <Text style={s.calsBigNum}>{analysis.estimatedCalories}</Text>
                    <Text style={s.calsBigLabel}>kcal</Text>
                  </View>
                </View>

                <Text style={s.resultDesc}>{analysis.description}</Text>

                <View style={s.ingredientSection}>
                  <Text style={s.ingredientLabel}>{t.scan.ingredientsLabel}</Text>
                  <Text style={s.ingredientText}>{analysis.ingredients}</Text>
                </View>

                <View style={s.resultBtns}>
                  <Pressable
                    style={({ pressed }) => [s.saveBtn, { opacity: pressed || saveMutation.isPending ? 0.8 : 1 }]}
                    onPress={handleSave}
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <>
                        <Feather name="check" size={16} color="#FFF" />
                        <Text style={s.saveBtnText}>{t.scan.saveToJournal}</Text>
                      </>
                    )}
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [s.discardBtn, { opacity: pressed ? 0.8 : 1 }]}
                    onPress={handleReset}
                  >
                    <Text style={s.discardBtnText}>{t.scan.discard}</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </>
        )}
      </View>

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
    content: { padding: 16 },
    pickContainer: {
      alignItems: "center",
      paddingVertical: 40,
      gap: 10,
    },
    iconRing: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    pickTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    pickSub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    btnRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    pickBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 13,
      borderRadius: 12,
    },
    pickBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
    },
    pickBtnOutline: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderWidth: 1.5,
      borderColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 13,
      borderRadius: 12,
    },
    pickBtnOutlineText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    imageContainer: {
      position: "relative",
      borderRadius: colors.radius,
      overflow: "hidden",
      marginBottom: 16,
    },
    image: {
      width: "100%",
      height: 240,
      borderRadius: colors.radius,
    },
    resetBtn: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    analyzeBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 12,
      marginBottom: 16,
    },
    analyzeBtnText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#FFF",
    },
    analyzingContainer: {
      alignItems: "center",
      paddingVertical: 24,
      gap: 12,
    },
    analyzingText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    resultHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    resultName: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      maxWidth: "70%",
    },
    resultConfidence: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    calsBig: { alignItems: "center" },
    calsBigNum: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    calsBigLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    resultDesc: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
      marginBottom: 12,
    },
    ingredientSection: {
      backgroundColor: colors.muted,
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
    },
    ingredientLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    ingredientText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 20,
    },
    resultBtns: { flexDirection: "row", gap: 10 },
    saveBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.primary,
      height: 46,
      borderRadius: 10,
    },
    saveBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFF",
    },
    discardBtn: {
      paddingHorizontal: 16,
      height: 46,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    discardBtnText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
  });

export default function ScanScreen() {
  return (
    <PremiumGate feature="Photo Calorie Scanner">
      <ScanScreenContent />
    </PremiumGate>
  );
}
