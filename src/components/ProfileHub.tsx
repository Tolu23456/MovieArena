import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { continueWatching, downloads, myList } from '@/data/catalog';
import { useLayout } from '@/hooks/useLayout';
import { radius, useTheme } from '@/theme';
import { Rail } from './Card';
import { Icon, type IconName } from './Icons';
import { useToast } from './Toast';

interface ProfileRow {
  key: string;
  label: string;
  detail: string;
  icon: IconName;
  href?: string;
  onPress?: () => void;
}

/**
 * Profile hub — replaces the old “More” page. My List now lives here (as a row
 * plus a preview rail) instead of owning a tab.
 */
export function ProfileHub() {
  const { colors } = useTheme();
  const router = useRouter();
  const layout = useLayout();
  const toast = useToast();

  const readyDownloads = downloads.filter((item) => item.status === 'ready').length;

  const rows: ProfileRow[] = [
    {
      key: 'my-list',
      label: 'My List',
      detail: `${myList.length} saved titles`,
      icon: 'bookmark',
      href: '/my-list',
    },
    {
      key: 'downloads',
      label: 'Downloads',
      detail: `${readyDownloads} ready offline`,
      icon: 'download',
      href: '/downloads',
    },
    {
      key: 'account',
      label: 'Account and consent',
      detail: 'Playback, subtitles, analytics',
      icon: 'cog',
      href: '/account',
    },
    {
      key: 'profiles',
      label: 'Profiles',
      detail: 'Switch or add a profile',
      icon: 'users',
      href: '/account',
    },
    {
      key: 'about',
      label: 'About MovieArena',
      detail: 'Public-domain catalog and sources',
      icon: 'info',
      onPress: () => toast.show('MovieArena · public-domain cinema, restored'),
    },
    {
      key: 'privacy',
      label: 'Privacy and legal',
      detail: 'How local data is handled',
      icon: 'shield',
      onPress: () => toast.show('No accounts. Your data stays on this device.'),
    },
  ];

  return (
    <View testID="section-profile" style={{ position: 'relative' }}>
      <View
        style={{
          flexDirection: layout.compact ? 'column' : 'row',
          alignItems: layout.compact ? 'stretch' : 'center',
          gap: 12,
          padding: layout.narrow ? 12 : 16,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: radius.xl,
          backgroundColor: colors.surfaceCard,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
          <View
            style={{
              width: layout.narrow ? 44 : 52,
              height: layout.narrow ? 44 : 52,
              borderRadius: layout.narrow ? 22 : 26,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.actionPrimary,
              flexShrink: 0,
            }}
          >
            <Icon name="profile" size={layout.narrow ? 20 : 24} color={colors.actionInk} />
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.contentPrimary }}>
              Guest profile
            </Text>
            <Text style={{ fontSize: 12, color: colors.contentSecondary, marginTop: 2 }}>
              Signed out · progress stays on this device
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Account and consent"
          onPress={() => router.push('/account')}
          style={({ pressed }) => ({
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: radius.button,
            borderWidth: 1,
            borderColor: pressed ? colors.borderEmphasis : colors.borderSubtle,
            backgroundColor: pressed ? colors.surfaceRaised : 'transparent',
            flexShrink: 0,
            alignSelf: layout.compact ? 'flex-start' : 'center',
          })}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.contentPrimary }}>
            Settings
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          marginTop: 16,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: colors.surfaceCard,
        }}
      >
        {rows.map((row, index) => {
          const go = row.onPress ?? (() => row.href && router.push(row.href as never));

          return (
            <Pressable
              key={row.key}
              accessibilityRole={row.href ? 'link' : 'button'}
              accessibilityLabel={row.label}
              onPress={go}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 12,
                paddingHorizontal: layout.narrow ? 12 : 16,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.borderSubtle,
                backgroundColor: pressed ? colors.surfaceRaised : 'transparent',
              })}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.surfaceSunken,
                  flexShrink: 0,
                }}
              >
                <Icon name={row.icon} size={14} color={colors.contentSecondary} />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.contentPrimary }}>
                  {row.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 11, color: colors.contentSecondary, marginTop: 1 }}
                >
                  {row.detail}
                </Text>
              </View>

              <Icon name="chevronRight" size={12} color={colors.contentTertiary} />
            </Pressable>
          );
        })}
      </View>

      <Rail
        testID="profile-continue"
        title="Continue Watching"
        items={continueWatching}
        cardWidth={layout.cardWidth}
      />

      <Rail
        testID="profile-my-list"
        title="My List"
        items={myList}
        cardWidth={layout.cardWidth}
        onSeeAll={() => router.push('/my-list')}
      />
    </View>
  );
}
