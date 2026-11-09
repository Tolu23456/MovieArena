import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Art } from '@/components/Art';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icons';
import { Player } from '@/components/Player';
import { useToast } from '@/components/Toast';
import {
  continueWatching,
  downloads,
  episodesFor,
  findTitle,
  isSeries,
  type Episode,
  type Title,
} from '@/data/catalog';
import { downloadMedia, resolveMedia, useMediaCatalog } from '@/data/media';
import { getSaved, saveDownload, useSavedDownloads } from '@/data/saved';
import { useLayout } from '@/hooks/useLayout';
import { radius, useTheme } from '@/theme';

const SERIES_SYNOPSIS =
  "Official upload from the rights holder's channel. Progress saves to this device. Sign in to keep your place across screens.";

const FILM_SYNOPSIS =
  'Restored from the public-domain archive. Playback works offline once downloaded.';

const SERIES_RUNTIME = 24 * 60 + 10;

/** Format seconds as `m:ss` or `h:mm:ss`. */
function formatClock(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Runtime in minutes parsed from the meta line ("1h 34m", "2h 22m"). */
function runtimeMinutes(item: Title) {
  const hours = /(\d+)\s*h/i.exec(item.meta);
  const minutes = /(\d+)\s*m\b/i.exec(item.meta);
  const total = (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
  return total || 97;
}

function ProgressBar({ value, height = 3 }: { value: number; height?: number }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        height,
        borderRadius: height,
        backgroundColor: colors.borderSubtle,
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
          width: `${Math.max(0, Math.min(100, value))}%`,
          backgroundColor: colors.actionPrimary,
        }}
      />
    </View>
  );
}

/** Online episode row — still, episode number, name, time, progress. */
function OnlineEpisodeRow({
  item,
  episode,
  first,
  onPress,
}: {
  item: Title;
  episode: Episode;
  first: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const layout = useLayout();
  const watched = episode.progress >= 100;

  return (
    <Pressable
      testID={`episode-${episode.number}`}
      accessibilityRole="button"
      accessibilityLabel={`Play episode ${episode.number}: ${episode.name}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: layout.compact ? 10 : 12,
        paddingHorizontal: layout.compact ? 10 : 14,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: colors.borderSubtle,
        backgroundColor: episode.active
          ? colors.actionSofter
          : pressed
            ? colors.surfaceRaised
            : 'transparent',
      })}
    >
      <Art
        tone={item.tone}
        poster={item.poster}
        slash={false}
        veil={false}
        style={{
          width: layout.compact ? 84 : 112,
          aspectRatio: 16 / 9,
          borderRadius: 6,
          flexShrink: 0,
        }}
      />

      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text
            style={{
              fontSize: 9.5,
              fontWeight: '800',
              letterSpacing: 0.6,
              color: episode.active ? colors.accentText : colors.contentTertiary,
            }}
          >
            {episode.n}
          </Text>
          {watched ? <Icon name="check" size={9} color={colors.statusSuccess} /> : null}
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: colors.contentPrimary,
            marginTop: 2,
          }}
        >
          {episode.name}
        </Text>
        <Text style={{ fontSize: 10.5, color: colors.contentTertiary, marginTop: 2 }}>
          {episode.time}
        </Text>
        <View style={{ marginTop: 6 }}>
          <ProgressBar value={episode.progress} />
        </View>
      </View>

      <Icon name="play" size={12} color={colors.contentTertiary} />
    </Pressable>
  );
}

/** Offline row — the download's still, its episode number and a progress bar. */
function OfflineEpisodeRow({
  item,
  episode,
  first,
  onPress,
}: {
  item: Title;
  episode: Episode;
  first: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const layout = useLayout();

  return (
    <Pressable
      testID={`offline-episode-${episode.number}`}
      accessibilityRole="button"
      accessibilityLabel={`Play downloaded episode ${episode.number}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: layout.compact ? 10 : 14,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: colors.borderSubtle,
        backgroundColor: episode.active
          ? colors.actionSofter
          : pressed
            ? colors.surfaceRaised
            : 'transparent',
      })}
    >
      <Art
        tone={item.tone}
        poster={item.poster}
        slash={false}
        veil={false}
        style={{
          width: layout.compact ? 72 : 96,
          aspectRatio: 16 / 9,
          borderRadius: 6,
          flexShrink: 0,
        }}
      />

      <Text
        style={{
          width: layout.compact ? 40 : 46,
          flexShrink: 0,
          fontSize: 10.5,
          fontWeight: '800',
          letterSpacing: 0.6,
          color: episode.active ? colors.accentText : colors.contentSecondary,
        }}
      >
        {episode.n}
      </Text>

      <View style={{ flex: 1, minWidth: 0 }}>
        <ProgressBar value={episode.progress} height={4} />
      </View>
    </Pressable>
  );
}

/** The movie data block that sits between the player and the episodes. */
function VideoDetails({
  item,
  episode,
  episodeCount,
  downloadState,
  onDownload,
}: {
  item: Title;
  episode?: Episode;
  episodeCount: number;
  downloadState: 'idle' | 'saving' | 'saved';
  onDownload: () => void;
}) {
  const { colors } = useTheme();
  const layout = useLayout();

  // Ingested titles carry their own synopsis and channel; the seed titles keep
  // the original archive copy.
  const fromServer = !!item.video;
  const kicker = episode ? `Episode ${episode.number} · Now playing` : 'Now playing';
  const meta = episode
    ? fromServer
      ? item.meta
      : `${episodeCount} episodes · Japanese audio · English subtitles · 24m`
    : item.meta;
  const synopsis = item.synopsis ?? (episode ? SERIES_SYNOPSIS : FILM_SYNOPSIS);
  const source = item.channel ?? (episode ? 'Anime Made By Bilibili' : 'Silver Screen Archive');
  const sourceNote = fromServer
    ? `Streamed and downloaded from our media server`
    : episode
      ? 'Subtitles and dub available'
      : 'Public domain · restored';

  const downloadLabel =
    downloadState === 'saved'
      ? `Saved · ${getSaved(item.id)?.size ?? ''}`.trim()
      : downloadState === 'saving'
        ? 'Downloading…'
        : 'Download';

  return (
    <View style={{ marginTop: 20, position: 'relative' }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.accentText }}>{kicker}</Text>
      <Text
        style={{
          fontSize: layout.compact ? 22 : 27,
          lineHeight: layout.compact ? 27 : 33,
          fontWeight: '600',
          letterSpacing: -0.4,
          color: colors.contentPrimary,
          marginTop: 8,
        }}
      >
        {item.title}
      </Text>
      <Text style={{ fontSize: 12, color: colors.contentSecondary, marginTop: 6 }}>{meta}</Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 21,
          color: colors.contentSecondary,
          marginTop: 12,
          maxWidth: 620,
        }}
      >
        {synopsis}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginTop: 18,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: colors.borderSubtle,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surfaceRaised,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
          }}
        >
          <Icon name={episode ? 'tv' : 'film'} size={14} color={colors.contentSecondary} />
        </View>
        <View style={{ minWidth: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.contentPrimary }}>
            {source}
          </Text>
          <Text style={{ fontSize: 11, color: colors.contentSecondary }}>{sourceNote}</Text>
        </View>

        {fromServer ? (
          <Pressable
            testID="download-media"
            accessibilityRole="button"
            accessibilityLabel={`Download ${item.title} from the media server`}
            accessibilityState={{ disabled: downloadState !== 'idle' }}
            onPress={onDownload}
            disabled={downloadState !== 'idle'}
            style={({ pressed }) => ({
              marginLeft: 'auto',
              flexShrink: 0,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor:
                downloadState === 'saved' ? colors.statusSuccess : colors.borderSubtle,
              backgroundColor: pressed ? colors.surfaceRaised : colors.surfaceCard,
              opacity: downloadState === 'saving' ? 0.7 : 1,
            })}
          >
            <Icon
              name={downloadState === 'saved' ? 'check' : 'download'}
              size={13}
              color={downloadState === 'saved' ? colors.statusSuccess : colors.contentPrimary}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color:
                  downloadState === 'saved' ? colors.statusSuccess : colors.contentPrimary,
              }}
            >
              {downloadLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/** Every episode for the series, listed under the player. */
function AllEpisodes({
  item,
  episodes,
  onPlay,
}: {
  item: Title;
  episodes: Episode[];
  onPlay: (episode: Episode) => void;
}) {
  const { colors } = useTheme();

  return (
    <View testID="all-episodes" style={{ marginTop: 28, position: 'relative' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16.5, fontWeight: '600', color: colors.contentPrimary }}>
          All episodes
        </Text>
        <Text style={{ fontSize: 11.5, color: colors.contentSecondary }}>
          Season 1 · {episodes.length}
        </Text>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: colors.surfaceCard,
        }}
      >
        {episodes.map((episode, index) => (
          <OnlineEpisodeRow
            key={episode.number}
            item={item}
            episode={episode}
            first={index === 0}
            onPress={() => onPlay(episode)}
          />
        ))}
      </View>
    </View>
  );
}

/** Downloaded episodes: still → episode number → progress bar. */
function OfflineEpisodes({
  item,
  episodes,
  onPlay,
}: {
  item: Title;
  episodes: Episode[];
  onPlay: (episode: Episode) => void;
}) {
  const { colors } = useTheme();

  return (
    <View testID="offline-episodes" style={{ marginTop: 22, position: 'relative' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.contentPrimary }}>
          Episodes
        </Text>
        <Text style={{ fontSize: 11, color: colors.contentSecondary }}>
          Season 1 · {episodes.length}
        </Text>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: colors.surfaceCard,
        }}
      >
        {episodes.map((episode, index) => (
          <OfflineEpisodeRow
            key={episode.number}
            item={item}
            episode={episode}
            first={index === 0}
            onPress={() => onPlay(episode)}
          />
        ))}
      </View>
    </View>
  );
}

/** Other ready downloads, one scrollable row with the scrollbar hidden. */
function MoreDownloads({ currentId }: { currentId: string }) {
  const { colors } = useTheme();
  const router = useRouter();
  const layout = useLayout();
  const saved = useSavedDownloads();

  const others = [...downloads, ...saved.filter((item) => item.status === 'ready')].filter(
    (item, index, all) =>
      item.id !== currentId &&
      item.status === 'ready' &&
      all.findIndex((other) => other.id === item.id) === index,
  );
  if (!others.length) return null;

  return (
    <View testID="more-downloads" style={{ marginTop: 26, position: 'relative' }}>
      <Text
        style={{
          fontSize: 16.5,
          fontWeight: '600',
          letterSpacing: -0.25,
          color: colors.contentPrimary,
          marginBottom: 10,
        }}
      >
        More downloads
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ position: 'relative' }}
        contentContainerStyle={{ gap: 16, paddingRight: 16, paddingBottom: 4 }}
      >
        {others.map((item) => (
          <Card
            key={item.id}
            item={item}
            width={layout.cardWidth}
            onPress={() =>
              router.push({
                pathname: '/watch',
                params: { id: item.id, offline: '1' },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

/**
 * Watch — one page for every title. Online: player, data, all episodes.
 * Offline (`offline=1`): player, compact downloaded episodes, more downloads.
 */
export default function Watch() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ id?: string; ep?: string; offline?: string }>();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const epParam = Array.isArray(params.ep) ? params.ep[0] : params.ep;
  const offlineParam = Array.isArray(params.offline) ? params.offline[0] : params.offline;
  const offline = offlineParam === '1' || offlineParam === 'true';

  // Subscribe to the media server so ingested titles resolve as soon as the
  // catalog fetch lands (findTitle reads the same cache).
  useMediaCatalog();

  const item = findTitle(id) ?? continueWatching[0];
  const episodes = episodesFor(item);
  const series = isSeries(item);
  const downloaded = downloads.some((entry) => entry.id === item.id);
  const saved = useSavedDownloads();
  const savedEntry = saved.find((entry) => entry.id === item.id);
  // Offline mode needs a real download: a seed entry or bytes we fetched.
  const offlineMode = offline && (downloaded || !!savedEntry);

  const [saving, setSaving] = React.useState(false);
  const [offlineBlob, setOfflineBlob] = React.useState<string | undefined>(undefined);

  const requested = epParam ? Number(epParam) : NaN;
  const selected =
    episodes.find((episode) => episode.number === requested) ??
    episodes.find((episode) => episode.active) ??
    episodes[0];

  // The MP4 our server streams for the current selection (episode-aware).
  const mediaPath = selected && item.mediaEpisodes?.length
    ? (item.mediaEpisodes.find((entry) => entry.number === selected.number)?.video ??
      item.video)
    : item.video;
  const src =
    offlineMode && savedEntry?.objectUrl
      ? savedEntry.objectUrl
      : offlineMode && offlineBlob
        ? offlineBlob
        : resolveMedia(mediaPath);
  const poster = resolveMedia(item.poster);

  // A reloaded page loses the blob URL but keeps the row: pull the bytes off
  // our server once so offline playback still runs from memory.
  const needsRefetch = offlineMode && !savedEntry?.objectUrl && !!mediaPath;
  React.useEffect(() => {
    if (!needsRefetch || !mediaPath) {
      setOfflineBlob(undefined);
      return;
    }
    let cancelled = false;
    setOfflineBlob(undefined);
    downloadMedia(mediaPath)
      .then((result) => {
        if (!cancelled) setOfflineBlob(result.url);
      })
      .catch(() => {
        /* fall back to streaming from the server */
      });
    return () => {
      cancelled = true;
    };
  }, [needsRefetch, mediaPath]);

  const downloadState: 'idle' | 'saving' | 'saved' = savedEntry
    ? 'saved'
    : saving
      ? 'saving'
      : 'idle';

  const handleDownload = async () => {
    if (!item.video || savedEntry || saving) return;
    setSaving(true);
    try {
      const record = await saveDownload(item);
      toast.show(`Downloaded ${record.title} · ${record.size}`);
    } catch {
      toast.show('Download failed — is the media server running?');
    } finally {
      setSaving(false);
    }
  };

  const openEpisode = (episode: Episode) => {
    router.push({
      pathname: '/watch',
      params: {
        id: item.id,
        ep: String(episode.number),
        ...(offlineMode ? { offline: '1' } : {}),
      },
    });
  };

  const totalSeconds = series ? SERIES_RUNTIME : runtimeMinutes(item) * 60;
  const played = series ? (selected?.progress ?? 0) : (item.progress ?? 0);
  const elapsed = formatClock(Math.round((played / 100) * totalSeconds));

  return (
    <View testID="watch-player" style={{ position: 'relative' }}>
      <Player
        elapsed={elapsed}
        duration={formatClock(totalSeconds)}
        played={played}
        buffered={Math.min(100, played + 22)}
        autoPlay
        src={src}
        poster={poster}
      />

      {offlineMode ? null : (
        <VideoDetails
          item={item}
          episode={series ? selected : undefined}
          episodeCount={episodes.length}
          downloadState={downloadState}
          onDownload={handleDownload}
        />
      )}

      {series && episodes.length ? (
        offlineMode ? (
          <OfflineEpisodes item={item} episodes={episodes} onPlay={openEpisode} />
        ) : (
          <AllEpisodes item={item} episodes={episodes} onPlay={openEpisode} />
        )
      ) : null}

      {offlineMode ? <MoreDownloads currentId={item.id} /> : null}
    </View>
  );
}
