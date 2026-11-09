import React from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { latest, videoAd, type LatestTitle } from '@/data/catalog';
import type { Layout } from '@/hooks/useLayout';
import { radius, shell, useTheme } from '@/theme';
import { Art } from './Art';
import { Icon } from './Icons';
import { useToast } from './Toast';

/** Seven latest titles + one video ad. */
const SLIDE_COUNT = latest.length + 1;
/** Extra physical cell after the ad that clones slide 1, so “next” loops forward. */
const CLONE_INDEX = SLIDE_COUNT;
const PHYSICAL_COUNT = SLIDE_COUNT + 1;
/** How long a title slide stays on screen before advancing. */
const AUTO_ADVANCE_MS = 6000;

/** Text on top of the key art always sits on a dark scrim. */
const INK = '#ffffff';
const INK_MUTED = 'rgba(255,255,255,.76)';

function SlideButton({
  label,
  primary,
  icon,
  onPress,
  testID,
}: {
  label: string;
  primary?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}) {
  const { colors } = useTheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        height: 36,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: primary ? colors.actionPrimary : 'rgba(255,255,255,.42)',
        backgroundColor: primary
          ? hovered
            ? colors.actionPrimaryHover
            : colors.actionPrimary
          : hovered
            ? 'rgba(255,255,255,.18)'
            : 'rgba(10,12,16,.24)',
      }}
    >
      {icon}
      <Text
        numberOfLines={1}
        style={{ fontSize: 13, fontWeight: '700', color: primary ? colors.actionInk : INK }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ArrowButton({
  direction,
  onPress,
}: {
  direction: 'left' | 'right';
  onPress: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={direction === 'left' ? 'Previous slide' : 'Next slide'}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,.26)',
        backgroundColor: hovered ? 'rgba(255,255,255,.28)' : 'rgba(10,12,16,.42)',
      }}
    >
      <View style={{ transform: [{ rotate: direction === 'left' ? '180deg' : '0deg' }] }}>
        <Icon name="chevronRight" size={13} color={INK} />
      </View>
    </Pressable>
  );
}

/** One latest-title slide: key art, kicker and copy. */
function TitleSlide({
  item,
  width,
  height,
  layout,
  testID,
}: {
  item: LatestTitle;
  width: number;
  height: number;
  layout: Layout;
  testID?: string;
}) {
  const { colors } = useTheme();
  const inset = layout.compact ? 20 : 34;
  const titleSize = Math.min(layout.heroTitle, layout.compact ? 30 : 38);

  return (
    <View
      testID={testID ?? `latest-slide-${item.id}`}
      style={{
        width,
        height,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: colors.surfaceSunken,
      }}
    >
      <Art tone={item.tone} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(6,8,12,.34)' }]} />

      <View style={{ position: 'absolute', left: inset, right: inset, bottom: inset }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 11,
              lineHeight: 14,
              fontWeight: '700',
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: colors.actionPrimary,
            }}
          >
            {item.kicker}
          </Text>
          {item.badges?.slice(0, 1).map((badge) => (
            <View
              key={badge.label}
              style={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,.4)',
                backgroundColor: 'rgba(10,12,16,.32)',
              }}
            >
              <Text style={{ fontSize: 9.5, fontWeight: '800', letterSpacing: 0.7, color: INK }}>
                {badge.label}
              </Text>
            </View>
          ))}
        </View>

        <Text
          numberOfLines={2}
          style={{
            fontSize: titleSize,
            lineHeight: titleSize * 1.08,
            fontWeight: '600',
            letterSpacing: -titleSize * 0.015,
            color: INK,
            maxWidth: Math.min(width - inset * 2, 620),
          }}
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={layout.compact ? 2 : 1}
          style={{
            fontSize: 13.3,
            lineHeight: 19,
            color: INK_MUTED,
            marginTop: 7,
            maxWidth: Math.min(width - inset * 2, 520),
          }}
        >
          {item.synopsis}
        </Text>
      </View>
    </View>
  );
}

/**
 * The single ad slot. It starts on its own as soon as it becomes the active
 * slide (there is deliberately no pause/play control) and reports when the
 * 15-second spot has finished so the carousel can advance.
 */
function AdSlide({
  width,
  height,
  layout,
  active,
  onDone,
}: {
  width: number;
  height: number;
  layout: Layout;
  active: boolean;
  onDone: () => void;
}) {
  const { colors } = useTheme();
  const toast = useToast();
  const inset = layout.compact ? 20 : 34;
  const [remaining, setRemaining] = React.useState(videoAd.duration);
  const progress = React.useRef(new Animated.Value(0)).current;
  const onDoneRef = React.useRef(onDone);

  React.useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  React.useEffect(() => {
    if (!active) {
      progress.stopAnimation();
      progress.setValue(0);
      setRemaining(videoAd.duration);
      return;
    }

    setRemaining(videoAd.duration);
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: videoAd.duration * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      if (finished) onDoneRef.current();
    });

    const timer = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => {
      animation.stop();
      clearInterval(timer);
    };
  }, [active, progress]);

  return (
    <View
      testID="latest-slide-ad"
      style={{
        width,
        height,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: colors.surfaceSunken,
      }}
    >
      <Art tone={videoAd.tone} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(6,8,12,.44)' }]} />

      <View
        style={{
          position: 'absolute',
          top: inset,
          left: inset,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <View
          style={{
            paddingHorizontal: 7,
            paddingVertical: 3,
            borderRadius: 4,
            backgroundColor: colors.actionPrimary,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 0.9, color: colors.actionInk }}>
            AD
          </Text>
        </View>
        <Text style={{ fontSize: 10.5, fontWeight: '700', letterSpacing: 0.8, color: INK_MUTED }}>
          {active ? 'PLAYING' : 'SPONSORED VIDEO'}
        </Text>
      </View>

      <View style={{ position: 'absolute', left: inset, right: inset, bottom: inset }}>
        <Text
          style={{
            fontSize: 11,
            lineHeight: 14,
            fontWeight: '700',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: colors.actionPrimary,
            marginBottom: 8,
          }}
        >
          {`Advertisement · 0:${String(remaining).padStart(2, '0')}`}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: Math.min(layout.heroTitle, layout.compact ? 27 : 34),
            lineHeight: Math.min(layout.heroTitle, layout.compact ? 27 : 34) * 1.1,
            fontWeight: '600',
            color: INK,
            maxWidth: Math.min(width - inset * 2, 560),
          }}
        >
          {videoAd.title}
        </Text>
        <Text
          numberOfLines={layout.compact ? 2 : 1}
          style={{
            fontSize: 13.3,
            lineHeight: 19,
            color: INK_MUTED,
            marginTop: 7,
            maxWidth: Math.min(width - inset * 2, 520),
          }}
        >
          {videoAd.synopsis}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <SlideButton
            label={videoAd.cta}
            onPress={() => toast.show(`Sponsored by ${videoAd.sponsor}`)}
            testID="latest-ad-cta"
          />
          <Text
            numberOfLines={1}
            style={{ fontSize: 12, color: INK_MUTED, marginTop: 4, flexShrink: 1, minWidth: 0 }}
          >
            Sponsored by {videoAd.sponsor}
          </Text>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          backgroundColor: 'rgba(255,255,255,.22)',
        }}
      >
        <Animated.View
          style={{
            height: 3,
            backgroundColor: colors.actionPrimary,
            width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
    </View>
  );
}

/**
 * Home hero carousel — seven latest titles followed by one video-ad slot.
 *
 * The slides are paged with a real gap between them, advance on their own, and
 * loop forward from the last slide back to slide 1 (an appended clone makes the
 * wrap look like a normal next-slide move rather than a rewind).
 */
export function HeroCarousel({ layout }: { layout: Layout }) {
  const { colors } = useTheme();
  const scrollRef = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  /** Physical cell currently shown (can be CLONE_INDEX). */
  const posRef = React.useRef(0);
  // While an arrow/dot scroll is animating, intermediate offsets must not move
  // the dot indicator (it would flicker back and forth across slides).
  const targetIndex = React.useRef<number | null>(null);
  const targetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const width = layout.contentWidth;
  const height = layout.compact ? 300 : shell.heroMin;
  const gap = layout.compact ? 12 : 16;
  const slideWidth = Math.max(1, width - gap);

  const scrollToPhysical = React.useCallback(
    (next: number, animated: boolean) => {
      const bounded = Math.max(0, Math.min(PHYSICAL_COUNT - 1, next));
      targetIndex.current = animated ? bounded : null;
      posRef.current = bounded;
      setIndex(bounded % SLIDE_COUNT);
      scrollRef.current?.scrollTo({ x: bounded * width, animated });

      if (targetTimer.current) clearTimeout(targetTimer.current);
      targetTimer.current = animated
        ? setTimeout(() => {
            targetIndex.current = null;
          }, 900)
        : null;
    },
    [width],
  );

  const advance = React.useCallback(() => {
    const current = posRef.current;
    // After the ad comes the cloned slide 1; otherwise just step forward.
    scrollToPhysical(current >= CLONE_INDEX ? 1 : current + 1, true);
  }, [scrollToPhysical]);

  const goTo = React.useCallback(
    (next: number) => {
      const bounded = ((next % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
      scrollToPhysical(bounded, true);
    },
    [scrollToPhysical],
  );

  React.useEffect(
    () => () => {
      if (targetTimer.current) clearTimeout(targetTimer.current);
    },
    [],
  );

  // Auto-advance title slides. The ad drives its own end (and reports via
  // `advance`), so it is excluded here.
  React.useEffect(() => {
    if (paused) return;
    if (index === SLIDE_COUNT - 1) return;
    const timer = setTimeout(advance, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [index, paused, advance]);

  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!width) return;
      const x = event.nativeEvent.contentOffset.x;
      const target = targetIndex.current;

      if (target !== null) {
        if (Math.abs(x - target * width) <= 2) {
          targetIndex.current = null;
          if (target === CLONE_INDEX) {
            // The clone of slide 1 has arrived; swap to the real slide 1
            // without animation — it looks identical, so the loop is seamless.
            posRef.current = 0;
            setIndex(0);
            scrollRef.current?.scrollTo({ x: 0, animated: false });
          } else {
            posRef.current = target;
            setIndex(target % SLIDE_COUNT);
          }
        }
        return;
      }

      // Only track positions that are snapped to a slide, so a drag updates the
      // dots once it lands rather than on every intermediate pixel.
      const nearest = Math.round(x / width);
      if (Math.abs(x - nearest * width) > 2) return;

      if (nearest === CLONE_INDEX) {
        posRef.current = 0;
        setIndex(0);
        scrollRef.current?.scrollTo({ x: 0, animated: false });
        return;
      }

      const bounded = Math.max(0, Math.min(CLONE_INDEX - 1, nearest));
      posRef.current = bounded;
      setIndex((prev) => (prev === bounded % SLIDE_COUNT ? prev : bounded % SLIDE_COUNT));
    },
    [width],
  );

  // Keep the current slide aligned when the viewport (and slide width) changes.
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ x: posRef.current * width, animated: false });
  }, [width]);

  return (
    <View testID="hero-carousel" style={{ position: 'relative' }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onScrollBeginDrag={() => setPaused(true)}
        onScrollEndDrag={() => setPaused(false)}
        onMomentumScrollEnd={() => setPaused(false)}
        scrollEventThrottle={16}
        style={{ width, height }}
      >
        {latest.map((item) => (
          <View key={item.id} style={{ width, height, paddingHorizontal: gap / 2 }}>
            <TitleSlide item={item} width={slideWidth} height={height} layout={layout} />
          </View>
        ))}

        <View key="ad" style={{ width, height, paddingHorizontal: gap / 2 }}>
          <AdSlide
            width={slideWidth}
            height={height}
            layout={layout}
            active={index === SLIDE_COUNT - 1}
            onDone={advance}
          />
        </View>

        {/* Forward-loop clone of slide 1; hidden from the dot indicator. */}
        <View key="loop-clone" style={{ width, height, paddingHorizontal: gap / 2 }}>
          <TitleSlide
            item={latest[0]}
            width={slideWidth}
            height={height}
            layout={layout}
            testID="latest-slide-clone"
          />
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          top: layout.compact ? 14 : 18,
          right: layout.compact ? 14 : 18,
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <ArrowButton direction="left" onPress={() => goTo(index - 1)} />
        <ArrowButton direction="right" onPress={advance} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          marginTop: 12,
        }}
      >
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => {
          const active = i === index;
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={`Go to slide ${i + 1} of ${SLIDE_COUNT}`}
              accessibilityState={{ selected: active }}
              onPress={() => goTo(i)}
              style={{ height: 24, paddingHorizontal: 3, justifyContent: 'center' }}
            >
              <View
                style={{
                  width: active ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: active ? colors.actionPrimary : colors.borderControl,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
