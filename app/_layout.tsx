import { Stack, ThemeProvider, usePathname, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppFrame } from '@/components/AppFrame';
import { ToastProvider } from '@/components/Toast';
import { FONTAWESOME_DATA_URI } from '@/fonts/fontawesome';
import { useTheme } from '@/theme';

/**
 * Register the icon font from an inlined data URI after hydration.
 *
 * @expo/vector-icons would otherwise fetch its .ttf from the dev server, and a
 * stalled fetch trips expo-font's 12s timeout as an uncaught error (full-screen
 * LogBox overlay). The preload must NOT run during the hydration render — the
 * server renders icons as bare `<Text />` (font not loaded there), so making
 * `Font.isLoaded('FontAwesome')` true on the client first would mismatch. In an
 * effect both sides start unloaded, and the data URI resolves long before the
 * lazily-loaded route chunk constructs its first <Icon>, so the vector-icons
 * components skip their own fetch entirely. Web only — native resolves the
 * bundled asset itself.
 */
function useIconFont() {
  React.useEffect(() => {
    Font.loadAsync({ FontAwesome: { uri: FONTAWESOME_DATA_URI } }).catch(() => {});
  }, []);
}

/**
 * React Navigation paints each screen with `theme.colors.background`. Its
 * default is the light grey `#f2f2f2`, which shows through behind transparent
 * route content — so the navigator gets our palette instead.
 */
function NavTheme({ children }: { children: React.ReactNode }) {
  const { scheme, colors } = useTheme();

  const value = React.useMemo(
    () => ({
      ...DefaultTheme,
      dark: scheme === 'dark',
      colors: {
        ...DefaultTheme.colors,
        primary: colors.actionPrimary,
        background: colors.surfacePage,
        card: colors.surfaceCard,
        text: colors.contentPrimary,
        border: colors.borderSubtle,
        notification: colors.actionPrimary,
      },
    }),
    [scheme, colors],
  );

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ThemeProvider value={value}>{children}</ThemeProvider>
    </>
  );
}

/**
 * Root layout — one shell for every route. No `+html.tsx`: expo-router's
 * default document owns `<html>` so the client bundle tags are injected.
 */
export default function RootLayout() {
  const pathname = usePathname();
  const hideTabBar = pathname.startsWith('/watch');
  useIconFont();

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AppFrame hideTabBar={hideTabBar}>
          <NavTheme>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            />
          </NavTheme>
        </AppFrame>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
