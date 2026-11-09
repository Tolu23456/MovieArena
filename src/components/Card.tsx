import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { cardChrome, radius, useTheme } from '@/theme';
import type { Title } from '@/data/catalog';
import { Icon } from './Icons';

interface CardProps {
  item: Title;
  width: number;
  onPress?: () => void;
  testID?: string;
}

function Badge({ label, kind, side }: { label: string; kind: 'free' | 'hot' | 'dub'; side: 'left' | 'right' }) {
  const fg =
    kind === 'hot' ? cardChrome.badgeHotFg : kind === 'dub' ? cardChrome.badgeDubFg : cardChrome.badgeFg;
  const border =
    kind === 'hot'
      ? cardChrome.badgeHotBorder
      : kind === 'dub'
        ? cardChrome.badgeDubBorder
        : cardChrome.badgeBorder;

  return (
    <View
      style={{
        position: 'absolute',
        top: 10,
        left: side === 'left' ? 10 : undefined,
        right: side === 'right' ? 10 : undefined,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        backgroundColor: cardChrome.badgeBg,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          lineHeight: 13,
          fontWeight: '800',
          letterSpacing: 0.9,
          textTransform: 'uppercase',
          color: fg,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/** Phase 6 §6.1 — still with badges and a single-line title. */
export function Card({ item, width, onPress, testID }: CardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [hovered, setHovered] = React.useState(false);
  const titleRef = React.useRef<React.ComponentRef<typeof Text>>(null);

  const badges = item.badges ?? [];
  const primary = badges.find((b) => b.kind !== 'dub');
  const dub = badges.find((b) => b.kind === 'dub');
  // Single-line title frees one title line; give that space to the still so the
  // card keeps its original overall height and the thumbnail fills the gap.
  const titleLine = 19.5;
  const artHeight = Math.round(((width - 2) * 9) / 16 + titleLine);
  const iconSize = Math.round(Math.min(Math.max(width * 0.18, 30), 64));
  const [posterFailed, setPosterFailed] = React.useState(false);
  const poster = item.poster && !posterFailed ? item.poster : undefined;

  // Browser-native tooltip on the title: hovering a truncated name shows the
  // full title in the familiar white system bubble. RNW's Text drops unknown
  // props, so set the DOM attribute directly.
  React.useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = titleRef.current as unknown as HTMLElement | null;
    if (node && typeof node.setAttribute === 'function') {
      node.setAttribute('title', item.title);
    }
  }, [item.title]);

  return (
    <Pressable
      testID={testID ?? `card-${item.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.meta}`}
      onPress={
        onPress ?? (() => router.push({ pathname: '/watch', params: { id: item.id } }))
      }
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        width,
        flexGrow: 0,
        flexShrink: 0,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: hovered ? colors.borderEmphasis : colors.borderSubtle,
        backgroundColor: hovered ? colors.surfaceRaised : colors.surfaceCard,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <View
        style={{
          width: '100%',
          height: artHeight,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: colors.surfaceSunken,
          overflow: 'hidden',
        }}
      >
        {poster ? (
          <Image
            source={{ uri: poster }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            onError={() => setPosterFailed(true)}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, width: '100%', height: '100%' }}
          />
        ) : (
          <Icon name="film" size={iconSize} color={colors.contentTertiary} />
        )}
        {primary ? <Badge label={primary.label} kind={primary.kind} side="left" /> : null}
        {dub ? <Badge label={dub.label} kind={dub.kind} side="right" /> : null}
      </View>

      <View style={{ paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 14 }}>
        <Text
          ref={titleRef}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 15.5,
            lineHeight: titleLine,
            fontWeight: '600',
            color: colors.contentPrimary,
          }}
        >
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
}

interface RailProps {
  title: string;
  items: Title[];
  cardWidth: number;
  onSeeAll?: () => void;
  testID?: string;
}

/** Phase 6 §6.2 — sticky-feeling heading, horizontally scrolling row of cards. */
export function Rail({ title, items, cardWidth, onSeeAll, testID }: RailProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View testID={testID} style={{ position: 'relative', marginTop: 24 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16.5,
            lineHeight: 16,
            fontWeight: '600',
            letterSpacing: -0.25,
            color: colors.contentPrimary,
          }}
        >
          {title}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
          onPress={onSeeAll ?? (() => router.push('/browse'))}
          style={{
            position: 'relative',
            top: 2,
            paddingVertical: 1,
            paddingLeft: 2,
            paddingRight: 6,
            flexShrink: 0,
          }}
        >
          <Text style={{ fontSize: 11.75, fontWeight: '700', color: colors.contentSecondary }}>
            See all →
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ position: 'relative' }}
        contentContainerStyle={{ gap: 16, paddingRight: 16, paddingBottom: 4 }}
      >
        {items.map((item) => (
          <Card key={item.id} item={item} width={cardWidth} />
        ))}
      </ScrollView>
    </View>
  );
}
