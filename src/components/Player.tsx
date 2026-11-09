import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { media, useTheme } from '@/theme';
import { Art } from './Art';
import { PlayIcon } from './Icons';

/** Host element for real playback; typed loosely so RNW can render it. */
const VideoTag: React.FC<any> = 'video' as any;

interface PlayerProps {
  elapsed: string;
  duration: string;
  played: number;
  buffered: number;
  /** Start in the playing state (the watch page opens on playback). */
  autoPlay?: boolean;
  /** MP4 served by our media server (`YouTube -> server -> MP4`). */
  src?: string;
  /** Poster shown while the video loads or if it fails. */
  poster?: string;
}

/** Format seconds as `m:ss` or `h:mm:ss`. */
function formatClock(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const mm = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * Watch player. With a `src` it plays the MP4 straight from our media server
 * (no embed, no redirect); without one it keeps the simulated preview chrome.
 */
export function Player({
  elapsed,
  duration,
  played,
  buffered,
  autoPlay = false,
  src,
  poster,
}: PlayerProps) {
  const { colors } = useTheme();
  const [playing, setPlaying] = React.useState(autoPlay);
  const videoRef = React.useRef<any>(null);
  const live = !!src && Platform.OS === 'web';

  // Live playback drives the clock from the element; the simulated player uses
  // the props from the watch page.
  const [clock, setClock] = React.useState<{
    elapsed: string;
    duration: string;
    played: number;
    buffered: number;
  } | null>(null);

  React.useEffect(() => {
    setClock(null);
  }, [src]);

  React.useEffect(() => {
    if (!live || !autoPlay) return;
    const el = videoRef.current;
    if (!el) return;
    const attempt = el.play();
    if (attempt && typeof attempt.catch === 'function') {
      // Autoplay can be blocked (no gesture yet) — fall back to the paused
      // state so the center button starts it on click.
      attempt.catch(() => setPlaying(false));
    }
  }, [live, autoPlay, src]);

  const toggle = () => {
    const el = videoRef.current;
    if (live && el) {
      if (el.paused) {
        const attempt = el.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
      } else {
        el.pause();
      }
      return;
    }
    setPlaying((v) => !v);
  };

  const syncFromElement = () => {
    const el = videoRef.current;
    if (!el) return;
    const total = Number.isFinite(el.duration) ? el.duration : 0;
    const current = Number.isFinite(el.currentTime) ? el.currentTime : 0;
    let bufferedPct = 0;
    if (total > 0 && el.buffered && el.buffered.length) {
      bufferedPct = Math.min(100, (el.buffered.end(el.buffered.length - 1) / total) * 100);
    }
    setClock({
      elapsed: formatClock(current),
      duration: total > 0 ? formatClock(total) : duration,
      played: total > 0 ? Math.min(100, (current / total) * 100) : 0,
      buffered: Math.max(bufferedPct, total > 0 ? (current / total) * 100 : 0),
    });
  };

  const shownElapsed = clock?.elapsed ?? elapsed;
  const shownDuration = clock?.duration ?? duration;
  const shownPlayed = clock?.played ?? played;
  const shownBuffered = Math.max(clock?.buffered ?? buffered, shownPlayed);

  const seekTo = (event: any) => {
    const el = videoRef.current;
    if (!live || !el || !Number.isFinite(el.duration)) return;
    const node = event?.currentTarget;
    if (!node || typeof node.getBoundingClientRect !== 'function') return;
    const rect = node.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    syncFromElement();
  };

  return (
    <View
      testID="player"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        backgroundColor: media.bg,
      }}
    >
      <Art
        tone={1}
        poster={poster}
        veil={false}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {live ? (
        <VideoTag
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={syncFromElement}
          onLoadedMetadata={syncFromElement}
          onEnded={() => setPlaying(false)}
          onError={() => setPlaying(false)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            objectFit: 'cover',
            backgroundColor: '#000',
          }}
        />
      ) : null}

      {live ? (
        // Keep the chrome legible without dimming the real footage.
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.06)', 'rgba(0,0,0,.66)']}
          start={{ x: 0.5, y: 0.55 }}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 2 }}
        />
      ) : (
        <LinearGradient
          colors={['rgba(0,0,0,.12)', 'rgba(0,0,0,.28)', 'rgba(0,0,0,.72)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 2 }}
        />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause' : 'Play'}
        onPress={toggle}
        style={{
          position: 'absolute',
          zIndex: 4,
          left: '50%',
          top: '50%',
          marginLeft: -31,
          marginTop: -31,
          width: 62,
          height: 62,
          borderRadius: 31,
          borderWidth: 1,
          borderColor: media.controlBorder,
          backgroundColor: 'rgba(8,10,15,.55)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {playing ? (
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <View style={{ width: 5, height: 20, borderRadius: 1, backgroundColor: media.chrome }} />
            <View style={{ width: 5, height: 20, borderRadius: 1, backgroundColor: media.chrome }} />
          </View>
        ) : (
          <PlayIcon size={22} color={media.chrome} />
        )}
      </Pressable>

      <View
        style={{
          position: 'absolute',
          zIndex: 4,
          left: 14,
          right: 14,
          bottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 11, color: media.chromeMuted, fontVariant: ['tabular-nums'] }}>
          {shownElapsed}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Seek"
          onPress={seekTo}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 4,
            backgroundColor: media.progressTrack,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${shownBuffered}%`,
              backgroundColor: media.progressBuffered,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${shownPlayed}%`,
              backgroundColor: media.progressFill,
            }}
          />
        </Pressable>

        <Text style={{ fontSize: 11, color: media.chromeMuted, fontVariant: ['tabular-nums'] }}>
          {shownDuration}
        </Text>
      </View>
    </View>
  );
}
