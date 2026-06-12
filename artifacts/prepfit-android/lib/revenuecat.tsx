import React, { createContext, useContext, useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import Purchases from "react-native-purchases";
import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { useDemoMode } from "@/lib/demo";

const REVENUECAT_TEST_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const REVENUECAT_ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

export const REVENUECAT_ENTITLEMENT_IDENTIFIER = "pro";

function getRevenueCatApiKey() {
  if (!REVENUECAT_TEST_API_KEY || !REVENUECAT_IOS_API_KEY || !REVENUECAT_ANDROID_API_KEY) {
    throw new Error("RevenueCat Public API Keys not found");
  }

  if (!REVENUECAT_ENTITLEMENT_IDENTIFIER) {
    throw new Error("RevenueCat Entitlement Identifier not provided");
  }

  if (__DEV__ || Platform.OS === "web" || Constants.executionEnvironment === "storeClient") {
    return REVENUECAT_TEST_API_KEY;
  }

  if (Platform.OS === "ios") {
    return REVENUECAT_IOS_API_KEY;
  }

  if (Platform.OS === "android") {
    return REVENUECAT_ANDROID_API_KEY;
  }

  return REVENUECAT_TEST_API_KEY;
}

export function initializeRevenueCat() {
  const apiKey = getRevenueCatApiKey();
  if (!apiKey) throw new Error("RevenueCat Public API Key not found");

  Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey });

  console.log("Configured RevenueCat");
}

function useSubscriptionContext() {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const { isDemoMode } = useDemoMode();
  const queryClient = useQueryClient();
  const appState = useRef(AppState.currentState);

  // ── Bind RevenueCat identity to Clerk user ID ──────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && userId) {
      Purchases.logIn(userId).catch((err) =>
        console.warn("RevenueCat logIn failed:", err),
      );
    } else {
      Purchases.logOut().catch((err) =>
        console.warn("RevenueCat logOut failed:", err),
      );
    }
    // Invalidate customer info whenever auth state changes
    queryClient.invalidateQueries({ queryKey: ["revenuecat", "customer-info"] });
  }, [isSignedIn, userId, isLoaded]);

  // ── Refresh on foreground resume ───────────────────────────────────────
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          queryClient.invalidateQueries({ queryKey: ["revenuecat", "customer-info"] });
          queryClient.invalidateQueries({ queryKey: ["revenuecat", "offerings"] });
        }
        appState.current = nextState;
      },
    );
    return () => subscription.remove();
  }, [queryClient]);

  // ── Queries ────────────────────────────────────────────────────────────
  const customerInfoQuery = useQuery({
    queryKey: ["revenuecat", "customer-info"],
    queryFn: async () => {
      const info = await Purchases.getCustomerInfo();
      return info;
    },
    staleTime: 60 * 1000,
    enabled: isLoaded,
  });

  const offeringsQuery = useQuery({
    queryKey: ["revenuecat", "offerings"],
    queryFn: async () => {
      const offerings = await Purchases.getOfferings();
      return offerings;
    },
    staleTime: 300 * 1000,
    enabled: isLoaded,
  });

  // ── Mutations ──────────────────────────────────────────────────────────
  const purchaseMutation = useMutation({
    mutationFn: async (packageToPurchase: any) => {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    },
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      return Purchases.restorePurchases();
    },
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const isSubscribed =
    isDemoMode ||
    customerInfoQuery.data?.entitlements.active?.[REVENUECAT_ENTITLEMENT_IDENTIFIER] !== undefined;

  return {
    customerInfo: customerInfoQuery.data,
    offerings: offeringsQuery.data,
    isSubscribed,
    isLoading: !isLoaded || customerInfoQuery.isLoading || offeringsQuery.isLoading,
    purchase: purchaseMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
    refetchCustomerInfo: customerInfoQuery.refetch,
  };
}

type SubscriptionContextValue = ReturnType<typeof useSubscriptionContext>;
const Context = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const value = useSubscriptionContext();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSubscription() {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return ctx;
}
