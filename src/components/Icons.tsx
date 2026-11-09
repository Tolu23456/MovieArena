import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Font from 'expo-font';
import React from 'react';
import { Platform, Text } from 'react-native';
import { FONTAWESOME_DATA_URI } from '@/fonts/fontawesome';
import { ICON_FONT_FAMILY } from '@/theme';

/**
 * Icon layer. The app uses Font Awesome (via @expo/vector-icons) so glyphs are
 * identical on web and native. Components ask for a semantic name; the mapping
 * to a Font Awesome glyph lives here.
 */

export type IconName =
  | 'home'
  | 'grid'
  | 'search'
  | 'list'
  | 'menu'
  | 'profile'
  | 'download'
  | 'play'
  | 'pause'
  | 'trash'
  | 'check'
  | 'close'
  | 'chevronLeft'
  | 'chevronRight'
  | 'bookmark'
  | 'cog'
  | 'users'
  | 'tv'
  | 'film'
  | 'magic'
  | 'star'
  | 'info'
  | 'shield';

type Glyph = React.ComponentProps<typeof FontAwesome>['name'];

const glyphs: Record<IconName, Glyph> = {
  home: 'home',
  grid: 'th-large',
  search: 'search',
  list: 'list-ul',
  menu: 'bars',
  profile: 'user',
  download: 'download',
  play: 'play',
  pause: 'pause',
  trash: 'trash-o',
  check: 'check',
  close: 'times',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  bookmark: 'bookmark',
  cog: 'cog',
  users: 'users',
  tv: 'tv',
  film: 'film',
  magic: 'magic',
  star: 'star',
  info: 'info-circle',
  shield: 'shield',
};

const glyphMap = FontAwesome.getRawGlyphMap() as Record<string, number>;

// The theme forces the body font stack with `!important`; this marker opts the
// glyph element back into FontAwesome (see the `[data-ma-icon]` rule there).
const webGlyphProps = Platform.OS === 'web' ? { dataSet: { maIcon: 'true' } } : {};

/**
 * Load the font once, as soon as this module is evaluated.
 *
 * On web `Font.loadAsync` synchronously injects the `@font-face` rule. The
 * source is the inlined data URI, not the dev-server asset URL: on a stalled
 * server the URL fetch can miss the first paint (glyphs show as `?` boxes) and
 * trip expo-font's 12s timeout. A data URI needs no round-trip, so the rule is
 * complete the moment it is inserted. A rejected promise is swallowed — it
 * must never gate rendering.
 */
let fontPromise: Promise<void> | null = null;
function preloadFont(): Promise<void> {
  if (!fontPromise) {
    fontPromise = Font.loadAsync({ FontAwesome: { uri: FONTAWESOME_DATA_URI } }).catch(
      () => undefined
    );
  }
  return fontPromise;
}

// Web renders glyphs immediately (see below), so start the font early in the
// browser. The server must not touch expo-font's server context here; it only
// needs the glyph text, which the client hydrates and paints.
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  preloadFont();
}

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 18, color = '#fff' }: IconProps) {
  // Web never waits: the glyph text itself makes the browser fetch the font,
  // even if the JS load promise timed out. Native needs the font registered
  // before a custom `fontFamily` can be used, so it renders after loading.
  const [ready, setReady] = React.useState(Platform.OS === 'web');

  React.useEffect(() => {
    if (ready) return;
    let active = true;
    preloadFont().then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [ready]);

  if (!ready) return <Text />;

  const code = glyphMap[glyphs[name]] ?? 0;

  return (
    <Text
      {...(webGlyphProps as any)}
      selectable={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        fontFamily: ICON_FONT_FAMILY,
        fontSize: size,
        color,
        fontWeight: 'normal',
        fontStyle: 'normal',
      }}
    >
      {String.fromCodePoint(code)}
    </Text>
  );
}

interface GlyphProps {
  size?: number;
  color?: string;
}

/** Back-compat wrappers used by Button / Hero / Player / AppHeader. */
export function PlayIcon({ size = 14, color = '#fff' }: GlyphProps) {
  return <Icon name="play" size={size} color={color} />;
}

export function SearchIcon({ size = 14, color = '#fff' }: GlyphProps) {
  return <Icon name="search" size={size} color={color} />;
}

export function CloseIcon({ size = 14, color = '#fff' }: GlyphProps) {
  return <Icon name="close" size={size} color={color} />;
}

export function CheckIcon({ size = 14, color = '#fff' }: GlyphProps) {
  return <Icon name="check" size={size} color={color} />;
}
