import { useGlobalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { findTitle } from '@/data/catalog';
import { useMediaCatalog } from '@/data/media';
import { useViewportWidth } from '@/hooks/useLayout';
import { shell, useTheme } from '@/theme';
import { Icon } from './Icons';

/**
 * Watch chrome. Replaces the global MovieArena header while a video is open:
 * a back control plus the video's name, so the title is the page header.
 */
export function WatchHeader() {
  const { colors } = useTheme();
  const router = useRouter();
  const width = useViewportWidth();
  const params = useGlobalSearchParams<{ id?: string; offline?: string }>();
  // Re-render when the media server's catalog lands so ingested titles show
  // their name instead of the fallback.
  useMediaCatalog();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const offlineParam = Array.isArray(params.offline) ? params.offline[0] : params.offline;
  const offline = offlineParam === '1' || offlineParam === 'true';
  const item = findTitle(id);

  const compact = width <= 720;
  const narrow = width <= 380;
  const height = compact ? shell.headerMobile : shell.headerDesktop;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.push(offline ? '/downloads' : '/');
  };

  return (
    <View
      testID="watch-header"
      style={{
        position: 'relative',
        zIndex: 5,
        height,
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: compact ? 8 : 12,
        paddingLeft: narrow ? 10 : compact ? 12 : 14,
        paddingRight: narrow ? 12 : compact ? 16 : 18,
        backgroundColor: colors.surfaceHeader,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={goBack}
        hitSlop={8}
        style={({ pressed }) => ({
          width: compact ? 32 : 34,
          height: compact ? 32 : 34,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderWidth: 1,
          borderColor: pressed ? colors.borderEmphasis : colors.borderSubtle,
          backgroundColor: pressed ? colors.surfaceRaised : 'transparent',
        })}
      >
        <Icon name="chevronLeft" size={13} color={colors.contentPrimary} />
      </Pressable>

      <Text
        testID="watch-header-title"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: compact ? 14 : 15,
          fontWeight: '700',
          letterSpacing: -0.15,
          color: colors.contentPrimary,
        }}
      >
        {item?.title ?? 'Watch'}
      </Text>

      {offline ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
            backgroundColor: colors.surfaceSunken,
          }}
        >
          <Icon name="download" size={9} color={colors.contentSecondary} />
          <Text style={{ fontSize: 10, fontWeight: '700', color: colors.contentSecondary }}>
            Offline
          </Text>
        </View>
      ) : null}
    </View>
  );
}
