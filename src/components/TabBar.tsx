import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { tabs } from '@/data/catalog';
import { useLayout } from '@/hooks/useLayout';
import { shell, useTheme } from '@/theme';
import { Icon } from './Icons';

/** Phase 6 §7.2 — five tabs, accent as the rule, never as the label colour. */
export function TabBar() {
  const { colors } = useTheme();
  const layout = useLayout();
  const pathname = usePathname();
  const router = useRouter();

  // The web shell renders both navs and lets CSS choose one, so the correct
  // nav is painted before hydration (no sidebar flash on small screens).
  const webNavProps = Platform.OS === 'web' ? { dataSet: { maTabbar: 'true' } } : {};

  return (
    <View
      {...(webNavProps as any)}
      testID="tabbar"
      style={{
        height: shell.tabbar,
        flexShrink: 0,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        backgroundColor: colors.surfaceCard,
        position: 'relative',
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;

        return (
          <Pressable
            key={tab.label}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            onPress={() => router.push(tab.href as never)}
            style={{
              flex: 1,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
              gap: layout.narrow ? 2 : 3,
              position: 'relative',
              backgroundColor: active ? colors.actionSoft : 'transparent',
            }}
          >
            {active ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: colors.actionPrimary,
                }}
              />
            ) : null}

            <Icon
              name={tab.icon}
              size={layout.narrow ? 17 : 19}
              color={active ? colors.contentPrimary : colors.contentSecondary}
            />
            <Text
              style={{
                fontSize: layout.narrow ? 9 : 10,
                fontWeight: active ? '700' : '500',
                letterSpacing: 0.4,
                color: active ? colors.contentPrimary : colors.contentSecondary,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
