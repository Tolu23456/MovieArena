import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';

const links = ['About', 'Privacy', 'Terms', 'Ad choices', 'Help'];

/** Phase 7 §2.1 — footer on Home only, quiet and flat. */
export function Footer() {
  const { colors } = useTheme();

  return (
    <View
      testID="footer"
      style={{
        marginTop: 36,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <Text style={{ fontSize: 11, lineHeight: 16, color: colors.contentTertiary }}>
        © 2026 MovieArena · Public domain catalog, restored and curated.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginLeft: 'auto' }}>
        {links.map((label) => (
          <Pressable
            key={label}
            accessibilityRole="link"
            onPress={() => {}}
            style={{ paddingVertical: 4, paddingHorizontal: 2 }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.contentSecondary }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
