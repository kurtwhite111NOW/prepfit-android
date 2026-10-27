import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { ClerkProvider, useAuth, useClerk } from "@clerk/expo";
import * as SecureStore from "expo-secure-store";
import { setBaseUrl, setAuthTokenGetter, setOnUnauthorizedHandler } from "@workspace/api-client-react";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
};
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeRevenueCat, SubscriptionProvider } from "@/lib/revenuecat";
import { DemoProvider, useDemoMode } from "@/lib/demo";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/i18n";

setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);

SplashScreen.preventAutoHideAsync();

try {
  initializeRevenueCat();
} catch (err: any) {
  Alert.alert("RevenueCat Unavailable", err?.message ?? "Unknown error");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error: any) => {
        // Never retry auth failures — the 401 handler signs the user out
        if (error?.status === 401) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1_500 * 2 ** attempt, 15_000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401) return false;
        return failureCount < 1;
      },
    },
  },
});

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: clerkLoaded, getToken } = useAuth();
  const { signOut } = useClerk();
  const { isDemoMode, isLoaded: demoLoaded } = useDemoMode();
  const segments = useSegments();
  const router = useRouter();
  const [clerkTimedOut, setClerkTimedOut] = useState(false);

  // Refs so the token getter closure always sees fresh values without re-registering
  const getTokenRef = useRef(getToken);
  const clerkLoadedRef = useRef(clerkLoaded);
  const isDemoModeRef = useRef(isDemoMode);
  const signOutRef = useRef(signOut);
  getTokenRef.current = getToken;
  clerkLoadedRef.current = clerkLoaded;
  isDemoModeRef.current = isDemoMode;
  signOutRef.current = signOut;

  useEffect(() => {
    if (clerkLoaded) return;
    const t = setTimeout(() => setClerkTimedOut(true), 10_000);
    return () => clearTimeout(t);
  }, [clerkLoaded]);

  const isFullyLoaded = (clerkLoaded || clerkTimedOut) && demoLoaded;
  const isAuthed = isSignedIn || isDemoMode;

  useEffect(() => {
    if (!isFullyLoaded) return;
    const inAuth = (segments as string[])[0] === "(auth)";
    if (!isAuthed && !inAuth) {
      router.replace("/(auth)" as never);
    } else if (isAuthed && inAuth) {
      router.replace("/(tabs)" as never);
    }
  }, [isAuthed, isFullyLoaded, segments]);

  // Register token getter once on mount. Reads from refs so it always has
  // fresh values. Waits up to 8 s for Clerk to finish loading from SecureStore
  // before giving up — this prevents the initial-load race where React Query
  // fires queries before Clerk has hydrated its session.
  useEffect(() => {
    setAuthTokenGetter(async () => {
      if (isDemoModeRef.current) return "demo-mode-prepfit";

      // Poll until Clerk session is ready (handles SecureStore async hydration)
      const POLL_MS = 150;
      const MAX_WAIT_MS = 8_000;
      let waited = 0;
      while (!clerkLoadedRef.current && waited < MAX_WAIT_MS) {
        await new Promise<void>((r) => setTimeout(r, POLL_MS));
        waited += POLL_MS;
      }

      if (!clerkLoadedRef.current) return null;

      try {
        // Try cached token first; if null force a network refresh before giving up.
        // This handles the case where the JWT has expired while the app was in
        // the background and Clerk hasn't refreshed it yet.
        let token = (await getTokenRef.current()) ?? null;
        if (!token) {
          token = (await getTokenRef.current({ skipCache: true })) ?? null;
        }
        return token;
      } catch {
        return null;
      }
    });

    // When any API call returns 401, sign the user out so they get a fresh
    // session on next open rather than being stuck in an auth-failure loop.
    setOnUnauthorizedHandler(() => {
      if (!isDemoModeRef.current) {
        signOutRef.current().catch(() => {});
      }
    });

    return () => {
      setAuthTokenGetter(null);
      setOnUnauthorizedHandler(null);
    };
  }, []); // register once; refs keep values current

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
      <LanguageProvider>
        <ThemeProvider>
          <DemoProvider>
            <SafeAreaProvider>
              <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                  <SubscriptionProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <KeyboardProvider>
                        <AuthGuard>
                          <RootLayoutNav />
                        </AuthGuard>
                      </KeyboardProvider>
                    </GestureHandlerRootView>
                  </SubscriptionProvider>
                </QueryClientProvider>
              </ErrorBoundary>
            </SafeAreaProvider>
          </DemoProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ClerkProvider>
  );
}
