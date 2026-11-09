import { useGlobalSearchParams, usePathname } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from '@/hooks/useLayout';
import { useTheme } from '@/theme';
import { AppHeader } from './AppHeader';
import { ScrollStateProvider, type PageScrollState } from './ScrollState';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';
import { WatchHeader } from './WatchHeader';

interface AppFrameProps {
  children: React.ReactNode;
  /** Watch hides the tab bar at every width (Phase 7 §7). */
  hideTabBar?: boolean;
}

// Reset before paint on the client, plain effect on the server/native where a
// layout effect would warn.
const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect;

/**
 * App shell (Phase 7 §2): header on top, sidebar + single scroll region in the
 * middle, tab bar below on compact widths. Every link in the chain keeps
 * `minHeight: 0` so `main` is the only thing that scrolls.
 *
 * The shell sits inside a bordered, rounded "screen" frame — the same `.screen`
 * treatment the Phase 4 preview uses for each surface.
 */
export function AppFrame({ children, hideTabBar }: AppFrameProps) {
  const { colors } = useTheme();
  const layout = useLayout();
  const insets = useSafeAreaInsets();
  const [skipFocused, setSkipFocused] = React.useState(false);
  const [pageScroll, setPageScroll] = React.useState<PageScrollState>({
    atEnd: false,
    scrollable: false,
  });
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams<{ id?: string; ep?: string }>();
  // Downloads and Profile open straight into their content — no global brand
  // header. Watch swaps it for the video name instead.
  const basePath = pathname.replace(/\/+$/, '') || '/';
  const hideHeader =
    basePath === '/downloads' || basePath === '/profile' || basePath === '/more';
  const isWatch = basePath === '/watch';

  // A new episode starts at the top so the player is in view; other pages keep
  // one scroll position per route.
  const watchId = Array.isArray(searchParams.id) ? searchParams.id[0] : searchParams.id;
  const watchEp = Array.isArray(searchParams.ep) ? searchParams.ep[0] : searchParams.ep;
  const scrollKey = isWatch ? `${basePath}|${watchId ?? ''}|${watchEp ?? ''}` : pathname;

  const scrollRef = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const scrollPositions = React.useRef<Record<string, number>>({});
  const activePath = React.useRef(scrollKey);
  const lastDistance = React.useRef(0);

  // The shell keeps one scroll region across routes. Remember each page's
  // offset as it scrolls and restore it when that page is shown again, so
  // navigating between pages keeps everyone's place. Scroll events fired while
  // the new page is being committed are still attributed to the old page until
  // the restore below switches `activePath` over.
  useIsomorphicLayoutEffect(() => {
    const y = scrollPositions.current[scrollKey] ?? 0;
    scrollRef.current?.scrollTo({ y, animated: false });
    activePath.current = scrollKey;
    setPageScroll({ atEnd: false, scrollable: false });
  }, [scrollKey]);

  const rememberScroll = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    scrollPositions.current[activePath.current] = contentOffset.y;
    const scrollable = contentSize.height > layoutMeasurement.height + 4;
    const distance = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    lastDistance.current = distance;
    setPageScroll((prev) => {
      let atEnd = prev.atEnd;
      if (!scrollable) {
        atEnd = false;
      } else if (prev.atEnd) {
        // Hysteresis: once the end note is open, keep it open until the user
        // scrolls well away from the bottom (the note itself adds height).
        if (distance > 220) atEnd = false;
      } else if (distance <= 40) {
        atEnd = true;
      }
      return prev.atEnd === atEnd && prev.scrollable === scrollable
        ? prev
        : { atEnd, scrollable };
    });
  }, []);

  // The end-of-list note animates its height open when the user reaches the
  // bottom of Browse. Wheel and scrollbar users stop scrolling before that
  // extra height exists, which would leave the note just below the fold — once
  // it has finished opening, ease the page down so the note is actually
  // visible.
  React.useEffect(() => {
    if (!pageScroll.atEnd || pathname !== '/browse') return;
    const timer = setTimeout(() => {
      if (lastDistance.current <= 60) {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    }, 260);
    return () => clearTimeout(timer);
  }, [pageScroll.atEnd, pathname]);

  const focusMain = React.useCallback(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const el = document.getElementById('main-content');
      if (el) {
        el.setAttribute('tabindex', '-1');
        (el as HTMLElement).focus();
        (el as HTMLElement).scrollIntoView({ block: 'start' });
      }
    }
  }, []);

  // On web both navs are in the DOM and CSS (`app/+html.tsx`) picks the right
  // one by viewport width. That makes the first paint correct on reload instead
  // of showing the sidebar until the width effect runs.
  const web = Platform.OS === 'web';
  const showSidebar = web || layout.sidebar;
  const renderTabBar = !hideTabBar && (web || layout.tabbar);

  return (
    <View
      style={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        maxWidth: 1240,
        marginHorizontal: 'auto',
        // The reference frames the screen with an extra pixel above: the
        // outer border lands on y5 so the header/hero bands line up exactly.
        // On native the insets keep the shell clear of the status bar and the
        // home indicator; on web they are zero.
        paddingTop: insets.top + 5,
        paddingBottom: insets.bottom + 4,
        paddingLeft: insets.left + 4,
        paddingRight: insets.right + 4,
        backgroundColor: colors.surfacePage,
        position: 'relative',
      }}
    >
      <View
        style={{
          flex: 1,
          minHeight: 0,
          flexDirection: 'column',
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: colors.surfacePage,
          position: 'relative',
        }}
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Skip to content"
          onFocus={() => setSkipFocused(true)}
          onBlur={() => setSkipFocused(false)}
          onPress={focusMain}
          style={{
            position: 'absolute',
            left: 12,
            top: skipFocused ? 12 : -90,
            zIndex: 30,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.borderControl,
            backgroundColor: colors.surfaceRaised,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.contentPrimary }}>
            Skip to content
          </Text>
        </Pressable>

        {hideHeader ? null : isWatch ? <WatchHeader /> : <AppHeader />}

        <View style={{ flex: 1, minHeight: 0, flexDirection: 'row', position: 'relative' }}>
          {showSidebar ? <Sidebar /> : null}

          <ScrollView
            ref={scrollRef}
            onScroll={rememberScroll}
            scrollEventThrottle={16}
            style={{ flex: 1, minWidth: 0, minHeight: 0 }}
            contentContainerStyle={{ position: 'relative', flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            <ScrollStateProvider value={pageScroll}>
              <View
                nativeID="main-content"
                style={{
                  paddingLeft: layout.pad,
                  paddingRight: layout.pad,
                  paddingTop: layout.pad,
                  paddingBottom: 24,
                  position: 'relative',
                  minHeight: '100%',
                }}
              >
                {children}
                <View style={{ height: 8 }} />
              </View>
            </ScrollStateProvider>
          </ScrollView>
        </View>

        {renderTabBar ? <TabBar /> : null}
      </View>
    </View>
  );
}
