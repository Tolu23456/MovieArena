import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { shell } from '@/theme';

/**
 * Viewport width that is safe to read during SSR and on native.
 *
 * `useWindowDimensions()` reports 0 on the server (and before hydration), which
 * collapses the shell into the mobile layout and makes the server markup
 * disagree with the client's first render. This hook renders the same fallback
 * value on both sides and only switches to the real width after mount, so
 * hydration stays warning-free. On native it reads `Dimensions` and follows
 * orientation changes.
 */
function readViewportWidth(fallback: number): number {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.innerWidth || fallback;
  }
  return Dimensions.get('window').width || fallback;
}

export function useViewportWidth(fallback = 1440): number {
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const read = () => {
      const next = readViewportWidth(fallback);
      setWidth((prev) => (prev === next ? prev : next));
    };
    read();

    const subscription = Dimensions.addEventListener('change', read);
    const hasWindow = Platform.OS === 'web' && typeof window !== 'undefined';

    if (hasWindow) {
      window.addEventListener('resize', read);
      window.addEventListener('orientationchange', read);
    }

    return () => {
      subscription.remove();
      if (hasWindow) {
        window.removeEventListener('resize', read);
        window.removeEventListener('orientationchange', read);
      }
    };
  }, [fallback]);

  return width;
}

export interface Layout {
  width: number;
  /** ≤720 — compact padding, stacked hero. */
  compact: boolean;
  /** ≤380 — single-column grids and tighter chrome. */
  narrow: boolean;
  /** >980 — sidebar replaces the tab bar. */
  sidebar: boolean;
  /** ≤980 — tab bar replaces the sidebar. */
  tabbar: boolean;
  pad: number;
  contentWidth: number;
  /** How many cards fit in a content-width grid. */
  gridColumns: number;
  /** One card size shared by rails and grids so pages match. */
  cardWidth: number;
  heroTitle: number;
}

/**
 * Shell layout. `sidebar` and `tabbar` are complementary: the sidebar is the
 * desktop nav (>980) and the tab bar takes over at 980 and below. The tab bar
 * is chosen by width alone so narrow desktop windows get navigation too; the
 * initial paint is handled by CSS (see `app/+html.tsx`) to avoid a sidebar
 * flash before hydration.
 */
export function useLayout(): Layout {
  const width = useViewportWidth();
  const compact = width <= shell.breakpoints.compact;
  const narrow = width <= 380;
  const sidebar = width > shell.breakpoints.sidebar;
  const tabbar = width <= shell.breakpoints.sidebar;
  const pad = narrow ? 12 : compact ? 16 : 32;

  // The shell sits in the bordered "screen" frame: 4px page margin + 1px border
  // on each side, capped at 1240px wide.
  const frame = Math.max(0, Math.min(width, 1240) - 10);
  const contentWidth = Math.max(0, frame - (sidebar ? shell.sidebar : 0) - pad * 2);
  // One card size everywhere. Columns target ~280px, rounded to the nearest
  // count (at least two), then the width is solved so the grid fills the row.
  // Rails reuse this exact width so Home, Browse and Search cards match.
  const gap = 16;
  const target = 280;
  const gridColumns = Math.max(
    2,
    Math.min(6, Math.round((contentWidth + gap) / (target + gap))),
  );
  // Floor the solved width so the full column count always fits without a
  // rounding overflow wrapping the last card onto its own row.
  const cardWidth = Math.floor(
    (contentWidth - gap * (gridColumns - 1)) / gridColumns,
  );
  // Scale the hero from the actual content column, not the raw viewport, so it
  // does not overgrow when the desktop sidebar is present.
  const heroTitle = Math.min(Math.max(28, contentWidth * 0.043), 41);

  return {
    width,
    compact,
    narrow,
    sidebar,
    tabbar,
    pad,
    contentWidth,
    gridColumns,
    cardWidth,
    heroTitle,
  };
}
