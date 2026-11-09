import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

export default function NotFound() {
  const { colors } = useTheme();

  return (
    <View testID="not-found" style={{ position: 'relative', paddingVertical: 48 }}>
      <Text
        style={{
          fontSize: 27,
          lineHeight: 33,
          fontWeight: '600',
          letterSpacing: -0.4,
          color: colors.contentPrimary,
        }}
      >
        Page not found
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 21,
          color: colors.contentSecondary,
          marginTop: 8,
          maxWidth: 420,
        }}
      >
        That address is not part of MovieArena yet. Head back to the catalog and keep browsing.
      </Text>

      <Link
        href="/"
        style={{
          marginTop: 20,
          alignSelf: 'flex-start',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: colors.actionPrimary,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.actionInk }}>
          Back to Home
        </Text>
      </Link>
    </View>
  );
}
