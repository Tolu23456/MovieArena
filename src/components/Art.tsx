import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { artTones, type ToneKey } from '@/theme';

interface ArtProps extends ViewProps {
  /** Abstract key-art tone; `default` when omitted. */
  tone?: ToneKey | string;
  /** Poster from the media server; the gradient stays as the fallback. */
  poster?: string;
  /** Diagonal light slash from the preview `.slash`. */
  slash?: boolean;
  /** Bottom scrim so overlaid type stays legible. */
  veil?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Key art — the media server's poster when there is one, otherwise a layered
 * gradient built from the preview's tone ramps.
 *
 * Layers are absolutely positioned, so the root must stay a positioned box
 * (RNW Views default to `position: static`).
 */
export function Art({
  tone = 'default',
  poster,
  slash = true,
  veil = true,
  style,
  children,
  ...rest
}: ArtProps) {
  const t = artTones[tone] ?? artTones.default;
  const fill = StyleSheet.absoluteFill;
  const [posterFailed, setPosterFailed] = React.useState(false);
  const showPoster = !!poster && !posterFailed;

  return (
    <View style={[styles.root, style]} {...rest}>
      <LinearGradient
        colors={[t.a3, t.a1]}
        start={{ x: 0.92, y: 0.08 }}
        end={{ x: 0.08, y: 1 }}
        style={fill}
      />
      <LinearGradient
        colors={[t.a2, 'rgba(0,0,0,0)']}
        start={{ x: 0.06, y: 0.02 }}
        end={{ x: 0.74, y: 0.82 }}
        style={[fill, { opacity: 0.78 }]}
      />
      {showPoster ? (
        <Image
          source={{ uri: poster }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          onError={() => setPosterFailed(true)}
          style={fill as any}
        />
      ) : null}
      <LinearGradient
        colors={['rgba(0,0,0,0)', t.a3]}
        start={{ x: 0.45, y: 0.35 }}
        end={{ x: 1, y: 1 }}
        style={[fill, { opacity: showPoster ? 0.25 : 0.55 }]}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,.14)', 'rgba(255,255,255,0)']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={fill}
      />
      {slash ? (
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,.34)', 'rgba(255,255,255,0)']}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.72, y: 1 }}
          style={[fill, { opacity: 0.22 }]}
        />
      ) : null}
      {veil ? (
        <LinearGradient
          colors={['rgba(0,0,0,.04)', 'rgba(0,0,0,.32)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={fill}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#10131a',
  },
});
