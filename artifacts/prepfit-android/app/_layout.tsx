import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeRevenueCat, SubscriptionProvider } from "@/lib/revenuecat";
import { DemoProvider, useDemoMode } from "@/lib/demo";
import { ThemeProvider } from "@/lib/theme";

setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);

SplashScreen.preventAutoHideAsync();

try {
  initializeRevenueCat();
} catch (err: any) {
  Alert.alert("RevenueCat Unavailable", err?.message ?? "Unknown error");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

const CLERK_KEY =
  publishableKeyFromHost(
    process.env.EXPO_PUBLIC_DOMAIN ?? "",
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  ) ?? "";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: clerkLoaded, getToken } = useAuth();
  const { isDemoMode, isLoaded: demoLoaded } = useDemoMode();
  const segments = useSegments();
  const router = useRouter();
  const [clerkTimedOut, setClerkTimedOut] = useState(false);

  // If Clerk hasn't loaded within 10 s (e.g. network issue on device),
  // proceed anyway so demo mode and the auth screens are never blocked.
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

  useEffect(() => {
    if (!clerkLoaded) return;
    setAuthTokenGetter(async () => {
      if (isDemoMode) return null;
      try {
        return (await getToken()) ?? null;
      } catch {
        return null;
      }
    });
  }, [getToken, clerkLoaded, isDemoMode]);

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
    <ClerkProvider publishableKey={CLERK_KEY}>
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
    </ClerkProvider>
  );
}
