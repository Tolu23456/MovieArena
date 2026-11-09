import { useEffect, useState, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

/**
 * Media server client — the `MovieArena <- server` half of
 * `YouTube -> server -> MP4 -> MovieArena`.
 *
 * `scripts/media-server.js` serves this locally on :8090; the same directory is
 * published to GitHub Pages by `.github/workflows/media.yml`. Either way the app
 * only ever reads `catalog.json` and MP4s from our own origin — no YouTube
 * embed, no outbound redirect.
 */

/** Override with EXPO_PUBLIC_MEDIA_BASE (e.g. the GitHub Pages URL). */
const ENV_BASE = process.env.EXPO_PUBLIC_MEDIA_BASE;

function defaultBase(): string {
  if (ENV_BASE) return ENV_BASE.replace(/\/+$/, '');
  // Web dev runs on :8081 with the media server beside it on :8090.
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:8090`;
  }
  return 'http://127.0.0.1:8090';
}

export const MEDIA_BASE = defaultBase();

/** Absolute URL for a catalog-relative path (`videos/x.mp4`, `posters/x.jpg`). */
export function resolveMedia(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${MEDIA_BASE}/${path.replace(/^\/+/, '')}`;
}

export interface MediaEpisode {
  number: number;
  name: string;
  time: string;
  /** Catalog-relative MP4 path. */
  video: string;
  poster?: string;
}

export interface MediaTitle {
  id: string;
  title: string;
  meta: string;
  synopsis?: string;
  channel?: string;
  genres?: string[];
  badges?: { label: string; kind: 'free' | 'hot' | 'dub' }[];
  tone?: number;
  /** percent watched, 0–100 */
  progress?: number;
  poster?: string;
  /** Catalog-relative MP4 path played by the in-app player. */
  video?: string;
  episodeCount?: number;
  episodes?: MediaEpisode[];
  source?: string;
  sourceUrl?: string;
  youtubeId?: string;
}

interface CatalogPayload {
  version?: number;
  generatedAt?: string;
  titles?: MediaTitle[];
}

export type MediaStatus = 'idle' | 'loading' | 'ready' | 'error';

interface Snapshot {
  titles: MediaTitle[];
  status: MediaStatus;
}

let snapshot: Snapshot = { titles: [], status: 'idle' };
const listeners = new Set<() => void>();
let started = false;

function emit(next: Snapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Fetch the catalog once. Failures are non-fatal: the seed catalog in
 * `./catalog` still renders, just without the ingested titles.
 */
export function loadMediaCatalog(): Promise<MediaTitle[]> {
  if (started) return Promise.resolve(snapshot.titles);
  started = true;
  emit({ ...snapshot, status: 'loading' });

  return fetch(`${MEDIA_BASE}/catalog.json`, { cache: 'no-cache' })
    .then((res) => {
      if (!res.ok) throw new Error(`catalog ${res.status}`);
      return res.json() as Promise<CatalogPayload>;
    })
    .then((payload) => {
      const titles = Array.isArray(payload?.titles) ? payload.titles : [];
      emit({ titles, status: 'ready' });
      return titles;
    })
    .catch(() => {
      emit({ titles: [], status: 'error' });
      return [] as MediaTitle[];
    });
}

/** Subscribe to the ingested catalog (starts the fetch on first use). */
export function useMediaCatalog(): Snapshot {
  useEffect(() => {
    loadMediaCatalog();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => snapshot,
  );
}

/** Ingested titles only — for the Home rail and Browse/Search merges. */
export function useMediaTitles(): MediaTitle[] {
  return useMediaCatalog().titles;
}

/** Non-reactive read, safe to call from render helpers like `findTitle`. */
export function getMediaTitles(): MediaTitle[] {
  return snapshot.titles;
}

/** Result of pulling a file's bytes off our media server. */
export interface MediaDownload {
  /** Blob URL for in-app playback (offline until the page reloads). */
  url: string;
  /** Exact byte count as served. */
  bytes: number;
  /** Catalog-relative path that was fetched. */
  path: string;
}

/**
 * One-shot download of a catalog file: fetches the real bytes from our server
 * so the app can show the true size and play the result offline.
 */
export async function downloadMedia(path: string): Promise<MediaDownload> {
  const url = resolveMedia(path);
  if (!url) throw new Error('no media path');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`media ${res.status}`);

  const blob = await res.blob();
  const objectUrl =
    typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
      ? URL.createObjectURL(blob)
      : url;
  return { url: objectUrl, bytes: blob.size, path };
}

/** Byte size of a catalog file, used by the Downloads list. */
export async function mediaSize(path: string): Promise<number> {
  const url = resolveMedia(path);
  if (!url) return 0;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const len = res.headers.get('content-length');
    return len ? Number(len) : 0;
  } catch {
    return 0;
  }
}

/** Human-readable byte count for the download rows. */
export function formatBytes(bytes: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Load the catalog during SSR/first paint without suspending: returns the
 * cached snapshot immediately and re-renders when the fetch lands.
 */
export function useMediaCatalogReady(): boolean {
  const [, setTick] = useState(0);
  useEffect(() => {
    loadMediaCatalog().then(() => setTick((n) => n + 1));
  }, []);
  return snapshot.status === 'ready';
}
