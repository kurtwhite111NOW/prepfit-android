---
name: PrepFit Android nav & theme
description: Scrollable tab bar, orange status bar, in-app theme toggle pattern
---

## Scrollable tab bar
- Expo Router `<Tabs>` does not support native horizontal scroll. Use `tabBar={(props: any) => <ScrollableTabBar {...props} />}` with a custom component built on `ScrollView horizontal`.
- `@react-navigation/bottom-tabs` is a transitive dep only — do NOT import `BottomTabBarProps` from it. Define a local `TabBarProps` type instead, and cast `props: any` at the call site.

## Orange status bar (camera notch cover)
- `<StatusBar backgroundColor="#F26B1D" style="light" translucent />` from `expo-status-bar`.
- With `translucent`, `insets.top` is still non-zero (status bar height). The AppBar wrapper uses `paddingTop: insets.top` so content starts below the camera area.
- All tab screens previously used `paddingTop: insets.top + 16` in their header Views. After adding the AppBar wrapper to the layout, those were changed to `paddingTop: 16` only.
- Exception: full-screen Modals (`<Modal>`) still need their own `insets.top` padding since they overlay the entire screen.

## In-app theme toggle
- `lib/theme.tsx` — `ThemeProvider` + `useTheme()`. Persists choice in AsyncStorage under key `prepfit_theme`. Defaults to system scheme until AsyncStorage resolves.
- `hooks/useColors.ts` uses `useTheme().resolvedTheme` instead of `useColorScheme()`.
- `ThemeProvider` is placed just inside `<ClerkProvider>` in `app/_layout.tsx`.

**Why:** useColorScheme() is read-only system state; AsyncStorage lets the user override it in-app. Placing ThemeProvider high in the tree means all hooks (including those used by sign-in screens) get the right colors.
