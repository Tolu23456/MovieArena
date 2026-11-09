import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import NotFound from './+not-found';
import { Card } from '@/components/Card';
import { DownloadsList } from '@/components/DownloadsList';
import { ProfileHub } from '@/components/ProfileHub';
import { SectionHeader } from '@/components/SectionHeader';
import { usePageScrollState } from '@/components/ScrollState';
import {
  browseFilters,
  catalog,
  mediaCatalog,
  myList,
  taggedCatalog,
  type Title,
} from '@/data/catalog';
import { useMediaCatalog } from '@/data/media';
import { hotWords, searchCatalog } from '@/data/search';
import { useLayout } from '@/hooks/useLayout';
import { radius, useTheme } from '@/theme';

const simpleSections: Record<string, { heading: string; blurb: string; items: Title[] }> = {
  'my-list': {
    heading: 'My List',
    blurb: 'Saved titles, stored on this device until you sign in.',
    items: myList,
  },
};

function CardGrid({ items, testID }: { items: Title[]; testID?: string }) {
  const layout = useLayout();
  const gap = 16;
  // Same card size as the homepage rails; the shared layout solves the width so
  // this many columns exactly fill the content area.
  const width = layout.cardWidth;

  return (
    <View
      testID={testID}
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap, position: 'relative' }}
    >
      {items.map((item) => (
        <Card key={item.id} item={item} width={width} />
      ))}
    </View>
  );
}

/** Browse — category tabs replace the old heading and blurb. */
function BrowseSection() {
  const { colors } = useTheme();
  const layout = useLayout();
  const { atEnd } = usePageScrollState();
  const [activeKey, setActiveKey] = React.useState(browseFilters[0].key);
  // Subscribe to the media server so its titles join the grid when they land.
  const { status } = useMediaCatalog();

  const active = browseFilters.find((f) => f.key === activeKey) ?? browseFilters[0];
  const items = React.useMemo(
    () => [...taggedCatalog, ...mediaCatalog()].filter(active.matches),
    [active, status],
  );

  // Fade/slide the end-of-list note in once the user drags to the bottom.
  const reveal = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(reveal, {
      toValue: atEnd ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [atEnd, reveal]);

  // The shell owns the one vertical scroll region, so the chips pin themselves
  // to its top on web instead of scrolling away with the grid.
  const sticky = Platform.OS === 'web' ? ({ position: 'sticky', top: 0 } as const) : null;

  return (
    <View testID="section-browse" style={{ position: 'relative' }}>
      <View
        style={[
          {
            zIndex: 2,
            marginBottom: 18,
            paddingTop: 4,
            paddingBottom: 12,
            backgroundColor: colors.surfacePage,
          },
          sticky as any,
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        >
          {browseFilters.map((tab) => {
            const selected = tab.key === active.key;

            return (
              <Pressable
                key={tab.key}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected }}
                onPress={() => setActiveKey(tab.key)}
                style={({ pressed }) => ({
                  paddingVertical: 9,
                  paddingHorizontal: layout.narrow ? 12 : 15,
                  borderRadius: radius.pill,
                  borderWidth: 1,
                  borderColor: selected
                    ? colors.actionPrimary
                    : pressed
                      ? colors.borderEmphasis
                      : colors.borderSubtle,
                  backgroundColor: selected
                    ? colors.actionSoft
                    : pressed
                      ? colors.surfaceRaised
                      : 'transparent',
                })}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: selected ? '700' : '600',
                    color: selected ? colors.contentPrimary : colors.contentSecondary,
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {items.length ? (
        <>
          <CardGrid items={items} />
          <Animated.View
            testID="browse-end"
            accessibilityElementsHidden={!atEnd}
            importantForAccessibility={atEnd ? 'auto' : 'no-hide-descendants'}
            style={{
              height: reveal.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }),
              overflow: 'hidden',
              opacity: reveal,
              transform: [
                {
                  translateY: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            }}
          >
            <View style={{ alignItems: 'center', gap: 8, paddingTop: 20, paddingBottom: 20 }}>
              <View style={{ width: 44, height: 1, backgroundColor: colors.borderSubtle }} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  letterSpacing: 0.2,
                  color: colors.contentTertiary,
                }}
              >
                You're all caught up.
              </Text>
            </View>
          </Animated.View>
        </>
      ) : (
        <Text style={{ fontSize: 13, color: colors.contentSecondary }}>
          Nothing in this category yet.
        </Text>
      )}
    </View>
  );
}

function SearchSection({ initialQuery }: { initialQuery: string }) {
  const { colors } = useTheme();
  const router = useRouter();
  // Subscribe so server titles become searchable once the catalog lands.
  const { status } = useMediaCatalog();

  const trimmed = initialQuery.trim();
  const results = React.useMemo(
    () => searchCatalog(initialQuery, [...catalog, ...mediaCatalog()]),
    [initialQuery, status],
  );

  return (
    <View testID="section-search" style={{ position: 'relative' }}>
      <Text style={{ fontSize: 12, color: colors.contentSecondary, marginBottom: 14 }}>
        {trimmed
          ? `${results.length} ${results.length === 1 ? 'title' : 'titles'} for “${trimmed}”`
          : 'Showing the full catalog.'}
      </Text>

      {results.length ? (
        <CardGrid items={results} />
      ) : (
        <View
          style={{
            alignItems: 'flex-start',
            gap: 8,
            paddingVertical: 36,
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.contentPrimary }}>
            No titles match “{trimmed}”.
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 19, color: colors.contentSecondary }}>
            Try one of these, or browse the full catalog.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
              marginTop: 6,
            }}
          >
            {hotWords.map((word) => (
              <Pressable
                key={word}
                accessibilityRole="button"
                accessibilityLabel={`Search for ${word}`}
                onPress={() => router.setParams({ q: word })}
                style={({ pressed }) => ({
                  paddingVertical: 6,
                  paddingHorizontal: 11,
                  borderRadius: radius.pill,
                  borderWidth: 1,
                  borderColor: pressed ? colors.borderEmphasis : colors.borderSubtle,
                  backgroundColor: pressed ? colors.surfaceRaised : colors.surfaceCard,
                })}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.contentPrimary }}>
                  {word}
                </Text>
              </Pressable>
            ))}

            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Browse all titles"
              onPress={() => router.push('/browse')}
              style={{ paddingVertical: 6, paddingHorizontal: 4 }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.link }}>
                Browse all →
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

/** Shared body for Browse / Search / Downloads / My List / Profile. */
export default function Section() {
  const { section, q } = useLocalSearchParams<{ section: string; q?: string }>();

  // Keep old `/more` links working after the Profile rename.
  const key = section === 'more' ? 'profile' : section;
  const initialQuery = Array.isArray(q) ? (q[0] ?? '') : (q ?? '');

  if (key === 'search') return <SearchSection initialQuery={initialQuery} />;
  if (key === 'downloads') return <DownloadsList />;
  if (key === 'profile') return <ProfileHub />;
  if (key === 'browse') return <BrowseSection />;

  const data = key ? simpleSections[key] : undefined;
  // Unknown segment — show the not-found surface rather than a blank page.
  if (!data) return <NotFound />;

  return (
    <View testID={`section-${key}`} style={{ position: 'relative' }}>
      <SectionHeader title={data.heading} blurb={data.blurb} />
      <CardGrid items={data.items} />
    </View>
  );
}
