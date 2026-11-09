import { useSyncExternalStore } from 'react';
import type { Download, Title } from './catalog';
import { downloadMedia, formatBytes } from './media';

/**
 * Device-local record of titles whose MP4 bytes were pulled off the media
 * server. This is the `-> MovieArena` half of `YouTube -> server -> MP4 ->
 * MovieArena`: once saved here the row plays from the fetched blob, so the
 * offline watch page works without touching the network again.
 */
export interface SavedDownload extends Download {
  /** Blob URL of the fetched MP4, playable while the session lasts. */
  objectUrl?: string;
  /** Exact byte count fetched from the server. */
  bytes?: number;
}

const STORAGE_KEY = 'moviearena.downloads.v1';

let items: SavedDownload[] = restore();
const listeners = new Set<() => void>();

/** Blob URLs die with the page; persist everything else so rows survive reloads. */
function persist() {
  try {
    if (typeof localStorage === 'undefined') return;
    const slim = items.map(({ objectUrl: _url, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
  } catch {
    /* storage unavailable (private mode, native) — stay in-memory */
  }
}

function restore(): SavedDownload[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((entry) => entry && typeof entry.id === 'string')
      : [];
  } catch {
    return [];
  }
}

function emit() {
  persist();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function read() {
  return items;
}

/** Subscribe to the saved-download list. */
export function useSavedDownloads(): SavedDownload[] {
  return useSyncExternalStore(subscribe, read, read);
}

/** Non-reactive lookups. */
export function getSaved(id?: string): SavedDownload | undefined {
  if (!id) return undefined;
  return items.find((item) => item.id === id);
}

export function isSaved(id?: string): boolean {
  return !!getSaved(id);
}

/**
 * Fetch the title's MP4 from our server and record it as a ready download.
 * Returns the record (with the real byte size) or throws if the fetch fails.
 */
export async function saveDownload(item: Title): Promise<SavedDownload> {
  const existing = getSaved(item.id);
  if (existing && existing.status === 'ready') return existing;
  if (!item.video) throw new Error('title has no video');

  const pending: SavedDownload = {
    id: item.id,
    title: item.title,
    meta: item.meta,
    tone: item.tone,
    badges: item.badges,
    poster: item.poster,
    video: item.video,
    quality: '360p',
    size: '…',
    status: 'downloading',
    percent: 45,
  };
  items = [...items.filter((entry) => entry.id !== item.id), pending];
  emit();

  try {
    const { url, bytes } = await downloadMedia(item.video);
    const ready: SavedDownload = {
      ...pending,
      status: 'ready',
      percent: 100,
      bytes,
      size: formatBytes(bytes),
      objectUrl: url,
    };
    items = items.map((entry) => (entry.id === item.id ? ready : entry));
    emit();
    return ready;
  } catch (error) {
    items = items.filter((entry) => entry.id !== item.id);
    emit();
    throw error;
  }
}

/** Remove a saved download (frees the blob URL with it). */
export function removeSaved(id: string): SavedDownload | undefined {
  const gone = getSaved(id);
  if (!gone) return undefined;
  if (gone.objectUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) {
    try {
      URL.revokeObjectURL(gone.objectUrl);
    } catch {
      /* already released */
    }
  }
  items = items.filter((entry) => entry.id !== id);
  emit();
  return gone;
}
