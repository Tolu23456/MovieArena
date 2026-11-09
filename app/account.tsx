import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Switch } from '@/components/Switch';
import { useLayout } from '@/hooks/useLayout';
import { radius, useTheme } from '@/theme';

interface Row {
  key: string;
  title: string;
  detail: string;
}

const sections: { heading: string; note?: string; rows: Row[] }[] = [
  {
    heading: 'Playback',
    rows: [
      { key: 'autoplay', title: 'Autoplay next episode', detail: 'Starts the next episode automatically.' },
      { key: 'previews', title: 'Video previews while browsing', detail: 'Plays short previews on hover.' },
      { key: 'data', title: 'Data saver', detail: 'Lower quality on mobile networks.' },
    ],
  },
  {
    heading: 'Content and subtitles',
    rows: [
      { key: 'dub', title: 'Prefer dubbed audio', detail: 'Show dub tracks first when available.' },
      { key: 'cc', title: 'Subtitles by default', detail: 'Turns captions on for every title.' },
      { key: 'mature', title: 'Show mature titles', detail: 'Includes unrated archive material.' },
    ],
  },
  {
    heading: 'Consent',
    note: 'Analytics are optional. Rejecting keeps playback and progress saving on this device working.',
    rows: [
      { key: 'analytics', title: 'Usage analytics', detail: 'Anonymous viewing statistics.' },
      { key: 'ads', title: 'Personalised ad choices', detail: 'Only applies to the free, ad-supported catalog.' },
    ],
  },
];

/** Account + consent sheet — Phase 7 §6, mirrors the preview `.sheet`. */
export default function Account() {
  const { colors } = useTheme();
  const layout = useLayout();
  const router = useRouter();
  const pad = layout.narrow ? 14 : 18;
  const close = () => (router.canGoBack() ? router.back() : router.push('/profile'));
  const [state, setState] = React.useState<Record<string, boolean>>({
    autoplay: true,
    previews: false,
    data: false,
    dub: false,
    cc: true,
    mature: false,
    analytics: false,
    ads: false,
  });

  return (
    <View
      testID="account-sheet"
      style={{
        position: 'relative',
        maxWidth: 620,
        backgroundColor: colors.surfaceCard,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        borderRadius: radius.xl,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: pad,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderSubtle,
        }}
      >
        <View style={{ minWidth: 0 }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.contentPrimary }}>
            Account
          </Text>
          <Text style={{ fontSize: 12, color: colors.contentSecondary, marginTop: 3 }}>
            Signed out · progress stays on this device
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={close}
          style={{ paddingVertical: 6, paddingHorizontal: 10 }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.contentSecondary }}>
            Close
          </Text>
        </Pressable>
      </View>

      <View style={{ padding: pad }}>
        {sections.map((section, i) => (
          <View key={section.heading} style={{ marginTop: i === 0 ? 0 : 22 }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                fontWeight: '600',
                color: colors.contentPrimary,
              }}
            >
              {section.heading}
            </Text>
            {section.note ? (
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 18,
                  color: colors.contentSecondary,
                  marginTop: 6,
                  marginBottom: 4,
                }}
              >
                {section.note}
              </Text>
            ) : null}

            {section.rows.map((row, j) => (
              <View
                key={row.key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.borderSubtle,
                  marginTop: j === 0 && !section.note ? 8 : 0,
                }}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      lineHeight: 17,
                      fontWeight: '600',
                      color: colors.contentPrimary,
                    }}
                  >
                    {row.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      lineHeight: 15,
                      color: colors.contentSecondary,
                      marginTop: 2,
                    }}
                  >
                    {row.detail}
                  </Text>
                </View>

                <Switch
                  testID={`switch-${row.key}`}
                  label={row.title}
                  checked={!!state[row.key]}
                  onChange={(next) => setState((s) => ({ ...s, [row.key]: next }))}
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: layout.compact ? 'column' : 'row',
          alignItems: layout.compact ? 'stretch' : 'center',
          justifyContent: 'flex-end',
          gap: 10,
          padding: pad,
          borderTopWidth: 1,
          borderTopColor: colors.borderSubtle,
          backgroundColor: colors.surfaceSunken,
        }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={close}
          style={{ paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.contentSecondary }}>
            Reject optional
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={close}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: radius.button,
            backgroundColor: colors.actionPrimary,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.actionInk }}>
            Accept selected
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
