import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { navGroups } from '@/data/catalog';
import { shell, useTheme } from '@/theme';
import { Icon } from './Icons';

/**
 * Desktop primary navigation (Phase 4 preview `.side` + Phase 6 §7.1).
 * Items are grouped, the active row carries an accent rule rather than accent
 * text, and the glyph is a small bordered square as in the preview.
 */
export function Sidebar() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const seen = new Set<string>();

  // The web shell renders both navs and lets CSS choose one, so the correct
  // nav is painted before hydration (no sidebar flash on small screens).
  const webNavProps = Platform.OS === 'web' ? { dataSet: { maSidebar: 'true' } } : {};

  return (
    <View
      {...(webNavProps as any)}
      testID="sidebar"
      style={{
        width: shell.sidebar,
        flexShrink: 0,
        borderRightWidth: 1,
        borderRightColor: colors.borderSubtle,
        backgroundColor: colors.surfaceSidebar,
        paddingHorizontal: 10,
        paddingTop: 16,
        paddingBottom: 24,
        position: 'relative',
      }}
    >
      {navGroups.map((group) => (
        <View key={group.label}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: colors.contentSecondary,
              opacity: 0.72,
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 5,
            }}
          >
            {group.label}
          </Text>

          {group.items.map((item) => {
            const eligible = !seen.has(item.href);
            seen.add(item.href);
            const active = eligible && pathname === item.href;

            return (
              <Pressable
                key={item.label}
                accessibilityRole="link"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: active }}
                onPress={() => router.push(item.href as never)}
                style={({ pressed }) => ({
                  position: 'relative',
                  minHeight: 34,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingVertical: 7,
                  paddingHorizontal: 10,
                  borderRadius: 7,
                  marginTop: 1,
                  backgroundColor: active
                    ? colors.actionSoft
                    : pressed
                      ? colors.surfaceRaised
                      : 'transparent',
                })}
              >
                {active ? (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: colors.actionPrimary,
                      borderTopLeftRadius: 7,
                      borderBottomLeftRadius: 7,
                    }}
                  />
                ) : null}

                <View style={{ width: 14, alignItems: 'center', flexShrink: 0 }}>
                  <Icon
                    name={item.icon}
                    size={13}
                    color={active ? colors.actionPrimary : colors.contentSecondary}
                  />
                </View>

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13,
                    fontWeight: active ? '700' : '600',
                    color: active ? colors.contentPrimary : colors.contentSecondary,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
