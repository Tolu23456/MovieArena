import { usePathname } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from '@/hooks/useLayout';
import { radius, shell, useTheme } from '@/theme';

interface ToastState {
  show: (message: string) => void;
}

const ToastContext = React.createContext<ToastState>({ show: () => {} });

export function useToast(): ToastState {
  return React.useContext(ToastContext);
}

/** Lightweight confirmation layer — sits above the shell, below no dialogs. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const layout = useLayout();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = React.useState<string | null>(null);

  // Keep the toast above the tab bar and the device's bottom inset.
  const bottom =
    insets.bottom +
    (layout.tabbar && !pathname.startsWith('/watch') ? shell.tabbar + 12 : 20);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = React.useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(null), 2600);
  }, []);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      <View style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {children}
        {message ? (
          <View
            accessibilityRole="alert"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom,
              alignItems: 'center',
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                maxWidth: 420,
                backgroundColor: colors.surfaceRaised,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
                borderRadius: radius.md,
                paddingHorizontal: 14,
                paddingVertical: 10,
                boxShadow: '0 10px 30px rgba(0,0,0,.22)',
              }}
            >
              <Text style={{ color: colors.contentPrimary, fontSize: 13, fontWeight: '600' }}>
                {message}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}
