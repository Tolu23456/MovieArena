import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

/**
 * MovieArena theme — Direction C · Quiet Premium.
 *
 * Phase 5 (colour), Phase 6 (type / space / radius / elevation / motion / sizes)
 * and the Phase 4 preview CSS are folded into one module. This is the only file
 * in the app allowed to contain raw colour literals; components ask for a role.
 */

export type Scheme = 'dark' | 'light';

/* ------------------------------------------------------------------ *
 * Typography — reference font stack
 * ------------------------------------------------------------------ *
 * The reference captures run on a humanist sans (SF Pro on macOS). Carlito is
 * metric-compatible with Calibri and reproduces the reference ink boxes within
 * ~2% here; on macOS the stack falls through to -apple-system (SF Pro), which
 * is exactly what the reference used. Injected as a stylesheet so every
 * React Native Web text node inherits it without per-component styling.
 */
export const FONT_STACK =
  "'Carlito', Calibri, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Icon glyphs must keep their own font — the global stack below is `!important`. */
export const ICON_FONT_FAMILY = 'FontAwesome';

if (typeof document !== 'undefined') {
  const css = [
    `* { font-family: ${FONT_STACK} !important; }`,
    `[data-ma-icon] { font-family: ${ICON_FONT_FAMILY} !important; }`,
    // Nav choice by width. The same rules are in the server document
    // (`app/+html.tsx`) so the first paint is already correct; keeping them
    // here keeps hot reload in sync.
    `@media (max-width: 980px) { [data-ma-sidebar] { display: none !important; } }`,
    `@media (min-width: 981px) { [data-ma-tabbar] { display: none !important; } }`,
  ].join('\n');
  let style = document.getElementById('ma-type') as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'ma-type';
    document.head.appendChild(style);
  }
  // Keep hot reloads in sync with the latest rule set.
  if (style.textContent !== css) style.textContent = css;
}

/* ------------------------------------------------------------------ *
 * Phase 5 — semantic colour tokens
 * ------------------------------------------------------------------ */

export interface Palette {
  surfacePage: string;
  surfaceSunken: string;
  surfaceCard: string;
  surfaceRaised: string;
  surfaceInverse: string;
  /** Blended chrome surfaces (page mixed toward card) from the preview CSS. */
  surfaceHeader: string;
  surfaceSidebar: string;

  borderSubtle: string;
  borderControl: string;
  borderEmphasis: string;

  contentPrimary: string;
  contentSecondary: string;
  contentTertiary: string;
  contentInverse: string;

  actionPrimary: string;
  actionPrimaryHover: string;
  actionPrimaryPressed: string;
  actionInk: string;
  actionSoft: string;
  actionSofter: string;

  focusRing: string;
  focusRingOnAccent: string;
  link: string;
  linkHover: string;

  statusSuccess: string;
  statusWarning: string;
  statusDanger: string;
  statusInfo: string;
  statusRank: string;

  overlayScrim: string;
  overlaySheet: string;

  switchOff: string;
  switchOn: string;
  switchKnob: string;
  switchKnobOn: string;

  skeleton: string;
  skeletonShine: string;

  shadow: string;
  cardHoverBorder: string;
  /** Kicker / accent text (preview `--accent-text`). */
  accentText: string;
}

const dark: Palette = {
  surfacePage: '#0c0e12',
  surfaceSunken: '#12151b',
  surfaceCard: '#161a21',
  surfaceRaised: '#1b2029',
  surfaceInverse: '#ffffff',
  surfaceHeader: '#0d0f14',
  surfaceSidebar: '#0d0f13',

  borderSubtle: '#282e38',
  borderControl: '#646e7c',
  borderEmphasis: '#6f7a8c',

  contentPrimary: '#eef1f5',
  contentSecondary: '#9aa3b2',
  contentTertiary: '#828d9d',
  contentInverse: '#0c0e12',

  actionPrimary: '#ff5c47',
  actionPrimaryHover: '#ff7a62',
  actionPrimaryPressed: '#e84632',
  actionInk: '#0c0e12',
  actionSoft: 'rgba(255,92,71,.16)',
  actionSofter: 'rgba(255,92,71,.07)',

  focusRing: '#ff8a3d',
  focusRingOnAccent: '#0c0e12',
  link: '#ff8a3d',
  linkHover: '#ffb066',

  statusSuccess: '#8fcfa5',
  statusWarning: '#e8c37a',
  statusDanger: '#ff9a8f',
  statusInfo: '#9db8ff',
  statusRank: '#c8b080',

  overlayScrim: 'rgba(7,8,11,.72)',
  overlaySheet: 'rgba(7,8,11,.55)',

  switchOff: '#646e7c',
  switchOn: '#ff5c47',
  switchKnob: '#eef1f5',
  switchKnobOn: '#0c0e12',

  skeleton: '#1b2029',
  skeletonShine: 'rgba(255,255,255,.06)',

  shadow: '0 10px 30px rgba(0,0,0,.22)',
  cardHoverBorder: '#3c4554',
  accentText: '#ff8a3d',
};

const light: Palette = {
  surfacePage: '#f6f7f9',
  surfaceSunken: '#eef0f4',
  surfaceCard: '#ffffff',
  surfaceRaised: '#f2f4f7',
  surfaceInverse: '#12151b',
  surfaceHeader: '#f7f8fa',
  surfaceSidebar: '#f7f8fa',

  borderSubtle: '#e1e5ec',
  borderControl: '#6f7a8c',
  borderEmphasis: '#646e7c',

  contentPrimary: '#12151b',
  contentSecondary: '#5c6472',
  contentTertiary: '#646e7c',
  contentInverse: '#ffffff',

  actionPrimary: '#ff5c47',
  actionPrimaryHover: '#e84632',
  actionPrimaryPressed: '#e84632',
  actionInk: '#12151b',
  actionSoft: 'rgba(255,92,71,.12)',
  actionSofter: 'rgba(255,92,71,.06)',

  focusRing: '#c0341f',
  focusRingOnAccent: '#12151b',
  link: '#c0341f',
  linkHover: '#972817',

  statusSuccess: '#2f6b3a',
  statusWarning: '#8a5a12',
  statusDanger: '#b3261e',
  statusInfo: '#2f5bb7',
  statusRank: '#8a6a2f',

  overlayScrim: 'rgba(18,21,27,.48)',
  overlaySheet: 'rgba(18,21,27,.28)',

  switchOff: '#6f7a8c',
  switchOn: '#ff5c47',
  switchKnob: '#ffffff',
  switchKnobOn: '#12151b',

  skeleton: '#eef1f5',
  skeletonShine: 'rgba(18,21,27,.05)',

  shadow: '0 10px 26px rgba(35,48,80,.10)',
  cardHoverBorder: '#c6cdd9',
  accentText: '#b3301f',
};

export const palettes: Record<Scheme, Palette> = { dark, light };

/** Phase 5 §4.3 — media chrome never flips with the theme. */
export const media = {
  bg: '#000000',
  chrome: '#ffffff',
  chromeMuted: '#b8bec9',
  controlBg: 'rgba(12,14,18,.62)',
  controlBorder: 'rgba(255,255,255,.28)',
  scrim: 'rgba(0,0,0,.72)',
  progressTrack: 'rgba(255,255,255,.22)',
  progressBuffered: 'rgba(255,255,255,.42)',
  progressFill: '#ff5c47',
  focus: '#ff8a3d',
  subtitleBg: 'rgba(0,0,0,.72)',
  subtitleText: '#ffffff',
  error: '#ff9a8f',
};

/** Badge + progress chrome used by cards (preview `.card-art .badge`). */
export const cardChrome = {
  badgeBg: 'rgba(10,12,18,.72)',
  badgeBorder: 'rgba(255,255,255,.18)',
  badgeFg: '#ffffff',
  badgeHotFg: '#ffd166',
  badgeHotBorder: 'rgba(255,209,102,.5)',
  badgeDubFg: '#a8c7ff',
  badgeDubBorder: 'rgba(168,199,255,.45)',
  progressTrack: 'rgba(255,255,255,.2)',
  /** Top-10 rank over artwork — never flips with the theme (Phase 6 §6.1). */
  rankFg: '#9aa3b2',
};

/** Fixed chrome details shared by both themes (preview `.avatar`, `.brand`). */
export const chrome = {
  avatarBorder: 'rgba(255,255,255,.18)',
  scrimTop: 'rgba(0,0,0,.12)',
};

/* ------------------------------------------------------------------ *
 * Abstract key art tones (preview `.art[data-tone]`)
 * ------------------------------------------------------------------ */

export interface Tone {
  /** deep — lower right */
  a1: string;
  /** warm — upper left */
  a2: string;
  /** base */
  a3: string;
}

export const artTones: Record<string, Tone> = {
  1: { a1: '#1f5b53', a2: '#d07a3e', a3: '#091d22' },
  2: { a1: '#6a3350', a2: '#e08a5a', a3: '#150b16' },
  3: { a1: '#2d3f78', a2: '#d9a441', a3: '#0a0e1d' },
  4: { a1: '#3f5a35', a2: '#cbb26a', a3: '#0c150c' },
  5: { a1: '#7d3b2b', a2: '#e6c39a', a3: '#1a0c09' },
  6: { a1: '#37306b', a2: '#e07a5f', a3: '#0b0a1c' },
  hero: { a1: '#1c4e5a', a2: '#cf6b42', a3: '#0a1116' },
  default: { a1: '#244c58', a2: '#c9743f', a3: '#0a1118' },
};

export type ToneKey = 1 | 2 | 3 | 4 | 5 | 6 | 'hero' | 'default';

/* ------------------------------------------------------------------ *
 * Phase 6 — foundations
 * ------------------------------------------------------------------ */

export const type = {
  /** Hero title — preview `clamp(1.75rem, 3.4vw, 2.55rem)` direction C. */
  heroMin: 28,
  heroMax: 41,
  heroVw: 0.034,
  title: 27,
  heading: 17,
  subheading: 15,
  body: 14,
  bodyStrong: 14,
  label: 12,
  caption: 11,
  micro: 10,
  /* component-specific */
  brand: 15,
  navItem: 13,
  navGroup: 10,
  button: 13,
  cardTitle: 12,
  cardMeta: 11,
  search: 12,
  railLink: 12,
  kicker: 12,
  heroMeta: 12,
  rank: 30,
} as const;

export const space = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
  7: 20,
  8: 24,
  9: 32,
  10: 40,
  11: 48,
  12: 64,
} as const;

export const radius = {
  xs: 3,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  pill: 999,
  /* direction C overrides */
  card: 12,
  button: 8,
  panel: 12,
  sheet: 14,
} as const;

export const elevation = {
  1: '0 1px 2px rgba(0,0,0,.24)',
  2: '0 10px 30px rgba(0,0,0,.22)',
  3: '0 24px 70px rgba(0,0,0,.38)',
  light1: '0 1px 2px rgba(35,48,80,.08)',
  light2: '0 10px 26px rgba(35,48,80,.10)',
  light3: '0 24px 60px rgba(35,48,80,.18)',
} as const;

export const motion = {
  fast: 120,
  base: 160,
  slow: 240,
} as const;

export const size = {
  controlSm: 32,
  controlMd: 40,
  controlLg: 48,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  touch: 44,
} as const;

/* ------------------------------------------------------------------ *
 * Shell metrics (Phase 7 §2 + preview direction C)
 * ------------------------------------------------------------------ */

export const shell = {
  headerDesktop: 64,
  headerMobile: 54,
  sidebar: 178,
  tabbar: 56,
  contentPad: 32,
  contentPadCompact: 18,
  railGap: 16,
  heroMin: 330,
  heroPad: 46,
  heroPadCompact: 18,
  heroArtMobile: 150,
  breakpoints: {
    compact: 720,
    sidebar: 980,
  },
} as const;

/* ------------------------------------------------------------------ *
 * System colour scheme — SSR safe (defaults to dark like the preview)
 * ------------------------------------------------------------------ */

function subscribe(onChange: () => void) {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }
  // Native (and any non-web runtime) follows the OS appearance setting.
  const subscription = Appearance.addChangeListener(onChange);
  return () => subscription.remove();
}

function getSnapshot(): Scheme {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
}

function getServerSnapshot(): Scheme {
  return 'dark';
}

export function useScheme(): Scheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useTheme() {
  const scheme = useScheme();
  return { scheme, colors: palettes[scheme] };
}
