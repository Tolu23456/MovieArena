import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { chrome, shell, useTheme } from '@/theme';
import { useViewportWidth } from '@/hooks/useLayout';
import { CloseIcon, SearchIcon } from './Icons';

export function AppHeader() {
  const { colors } = useTheme();
  const width = useViewportWidth();
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);

  const compact = width <= 720;
  const narrow = width <= 380;
  const tight = width <= 340;
  const height = compact ? shell.headerMobile : shell.headerDesktop;

  return (
    <View
      testID={`header-w${width}`}
      style={{
        position: 'relative',
        zIndex: 5,
        height,
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: compact ? 0 : 14,
        paddingLeft: narrow ? 12 : compact ? 16 : 18,
        paddingRight: narrow ? 12 : compact ? 16 : 18,
        backgroundColor: colors.surfaceHeader,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      }}
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="MovieArena home"
        onPress={() => router.push('/')}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 }}
      >
        <View
          style={{
            width: 17,
            height: 17,
            borderRadius: 3,
            backgroundColor: colors.actionPrimary,
          }}
        />
        {tight ? null : (
          <Text
            numberOfLines={1}
            style={{
              color: colors.contentPrimary,
              fontSize: 14,
              fontWeight: '700',
              letterSpacing: -0.15,
            }}
          >
            MovieArena
          </Text>
        )}
      </Pressable>

      <View
        style={{
          flex: 1,
          minWidth: 0,
          maxWidth: 460,
          // Reference compact gaps: 15px after the brand, 13px before the avatar.
          marginLeft: narrow ? 10 : compact ? 15 : 'auto',
          marginRight: narrow ? 10 : compact ? 13 : 0,
          height: 31,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingLeft: 12,
          paddingRight: 12,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: focused ? colors.focusRing : colors.borderSubtle,
          backgroundColor: colors.surfaceSunken,
        }}
      >
        <View style={{ flexShrink: 0 }}>
          <SearchIcon size={13} color={colors.contentTertiary} />
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => {
            const next = query.trim();
            router.push(next ? { pathname: '/search', params: { q: next } } : '/search');
          }}
          accessibilityRole="search"
          accessibilityLabel="Search titles, people, genres"
          placeholder="Search titles, people, genres…"
          placeholderTextColor={colors.contentTertiary}
          returnKeyType="search"
          style={
            {
              flex: 1,
              minWidth: 0,
              height: 28,
              padding: 0,
              margin: 0,
              color: colors.contentPrimary,
              fontSize: 12,
              outlineStyle: 'none',
            } as any
          }
        />
        {query ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery('')}
            hitSlop={8}
            style={{ padding: 2 }}
          >
            <CloseIcon size={11} color={colors.contentSecondary} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile"
        onPress={() => router.push('/profile')}
        style={({ pressed }) => ({ flexShrink: 0, opacity: pressed ? 0.85 : 1 })}
      >
        <LinearGradient
          colors={[colors.accentText, colors.actionPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: narrow ? 24 : 27,
            height: narrow ? 24 : 27,
            borderRadius: narrow ? 12 : 14,
            overflow: 'hidden',
            backgroundColor: colors.actionPrimary,
            borderWidth: 1,
            borderColor: chrome.avatarBorder,
          }}
        />
      </Pressable>
    </View>
  );
}
