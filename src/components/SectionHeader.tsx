import React from 'react';
import { Text, View } from 'react-native';
import { useLayout } from '@/hooks/useLayout';
import { useTheme } from '@/theme';

interface SectionHeaderProps {
  title: string;
  blurb: string;
  children?: React.ReactNode;
}

/** Shared page heading used by Browse, Search, Downloads, My List and Profile. */
export function SectionHeader({ title, blurb, children }: SectionHeaderProps) {
  const { colors } = useTheme();
  const layout = useLayout();

  return (
    <View
      style={{
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
        marginBottom: 18,
      }}
    >
      <Text
        style={{
          fontSize: layout.narrow ? 23 : 27,
          lineHeight: layout.narrow ? 29 : 33,
          fontWeight: '600',
          letterSpacing: -0.4,
          color: colors.contentPrimary,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          color: colors.contentSecondary,
          marginTop: 6,
          maxWidth: 520,
        }}
      >
        {blurb}
      </Text>
      {children}
    </View>
  );
}
