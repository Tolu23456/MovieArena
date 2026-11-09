import type { IconName } from '@/components/Icons';
import type { ToneKey } from '@/theme';
import { getMediaTitles, resolveMedia, type MediaEpisode, type MediaTitle } from './media';

export interface Badge {
  label: string;
  kind: 'free' | 'hot' | 'dub';
}

export interface Title {
  id: string;
  title: string;
  meta: string;
  tone: ToneKey;
  /** Genre tags used by the Browse category tabs. */
  genres?: string[];
  badges?: Badge[];
  /** percent watched, 0–100 */
  progress?: number;
  /** Top 10 rank as displayed */
  rank?: string;
  /** Poster art from the media server (YouTube thumbnail or local copy). */
  poster?: string;
  /** Catalog-relative MP4 path the in-app player streams from our server. */
  video?: string;
  /** Per-episode MP4s for ingested series (episodes beyond 24 play the main video). */
  mediaEpisodes?: MediaEpisode[];
  /** Provenance only — playback never links back out to YouTube. */
  youtubeId?: string;
  sourceUrl?: string;
  /** Channel the source video was published by. */
  channel?: string;
  /** Long-form description shown under the player. */
  synopsis?: string;
}

export interface LatestTitle extends Title {
  kicker: string;
  synopsis: string;
}

/** Newest additions — the Home carousel (7 titles + 1 video ad). */
export const latest: LatestTitle[] = [
  {
    id: 'cranes',
    title: 'The Cranes Are Flying',
    meta: '1957 · 1h 37m · CC',
    tone: 'hero',
    badges: [{ label: 'FREE', kind: 'free' }],
    kicker: 'Latest · Public domain',
    synopsis: 'A landmark of Soviet cinema, restored from the public-domain archive.',
  },
  {
    id: 'heron',
    title: 'The Boy and the Heron',
    meta: '2023 · 2h 4m · SUB · DUB',
    tone: 5,
    badges: [{ label: 'NEW', kind: 'hot' }],
    kicker: 'New this week · Animation',
    synopsis: "Miyazaki's hand-drawn farewell, newly added to the archive.",
  },
  {
    id: 'caligari',
    title: 'The Cabinet of Dr. Caligari',
    meta: '1920 · 1h 16m · CC',
    tone: 4,
    badges: [{ label: 'NEW', kind: 'hot' }],
    kicker: 'New restoration · Horror',
    synopsis: 'The expressionist nightmare that defined horror a century ago.',
  },
  {
    id: 'come-and-see',
    title: 'Come and See',
    meta: '1985 · 2h 22m · CC',
    tone: 2,
    kicker: 'Latest · War drama',
    synopsis: 'A devastating anti-war masterpiece, newly restored from 35mm.',
  },
  {
    id: 'potemkin',
    title: 'Battleship Potemkin',
    meta: '1925 · 1h 15m · CC',
    tone: 6,
    kicker: 'Latest · Silent',
    synopsis: "Eisenstein's revolutionary montage, remastered with a new score.",
  },
  {
    id: 'nosferatu',
    title: 'Nosferatu',
    meta: '1922 · 1h 34m · CC',
    tone: 2,
    kicker: 'Latest · Silent horror',
    synopsis: 'The original vampire film, restored frame by frame.',
  },
  {
    id: 'metropolis',
    title: 'Metropolis',
    meta: '1927 · 2h 33m · CC',
    tone: 3,
    kicker: 'Latest · Sci-Fi',
    synopsis: "Fritz Lang's futuristic epic, complete and restored.",
  },
];

/** The single video-ad slot at the end of the Home carousel. */
export const videoAd = {
  kicker: 'Advertisement · 0:15',
  title: 'Every classic, frame by frame.',
  synopsis:
    'Silver Screen Archive restores public-domain cinema in 4K — free to watch, forever.',
  cta: 'Learn more',
  sponsor: 'Silver Screen Archive',
  tone: 6 as ToneKey,
  duration: 15,
};

export const continueWatching: Title[] = [
  {
    id: 'frieren',
    title: "Frieren: Beyond Journey's End",
    meta: '28 episodes · SUB · DUB · 12m left',
    tone: 1,
    badges: [
      { label: 'FREE', kind: 'free' },
      { label: 'DUB', kind: 'dub' },
    ],
    progress: 62,
  },
  {
    id: 'come-and-see',
    title: 'Come and See',
    meta: 'Film · 2h 22m · 1h 54m left',
    tone: 2,
    badges: [{ label: 'NEW', kind: 'hot' }],
    progress: 18,
  },
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    meta: '24 episodes · SUB · DUB',
    tone: 3,
    badges: [{ label: 'FREE', kind: 'free' }],
    progress: 6,
  },
  {
    id: 'caligari',
    title: 'The Cabinet of Dr. Caligari',
    meta: 'Film · 1h 16m · 46m left',
    tone: 4,
    badges: [{ label: 'NEW', kind: 'hot' }],
    progress: 40,
  },
];

export const top10: Title[] = [
  {
    id: 'heron',
    title: 'The Boy and the Heron',
    meta: 'Film · SUB · DUB',
    tone: 5,
    rank: '01',
  },
  {
    id: 'potemkin',
    title: 'Battleship Potemkin',
    meta: 'Film · 1h 15m · CC',
    tone: 6,
    rank: '02',
  },
  {
    id: 'jujutsu',
    title: 'Jujutsu Kaisen',
    meta: '47 episodes · SUB · DUB',
    tone: 1,
    rank: '03',
  },
  {
    id: 'nosferatu',
    title: 'Nosferatu',
    meta: 'Film · 1h 34m · CC',
    tone: 2,
    rank: '04',
  },
  {
    id: 'metropolis',
    title: 'Metropolis',
    meta: 'Film · 2h 33m · CC',
    tone: 3,
    rank: '05',
  },
  {
    id: 'man-with-camera',
    title: 'Man with a Movie Camera',
    meta: 'Film · 1h 8m · CC',
    tone: 6,
    rank: '06',
  },
  {
    id: 'night-living-dead',
    title: 'Night of the Living Dead',
    meta: 'Film · 1h 36m · CC',
    tone: 4,
    rank: '07',
  },
  {
    id: 'his-girl-friday',
    title: 'His Girl Friday',
    meta: 'Film · 1h 32m · CC',
    tone: 5,
    rank: '08',
  },
];

/** Rail used by Browse / Search / My List. */
export const catalog: Title[] = [
  ...continueWatching,
  ...top10,
  {
    id: 'cranes',
    title: 'The Cranes Are Flying',
    meta: 'Film · 1h 37m · CC',
    tone: 'hero',
    badges: [{ label: 'FREE', kind: 'free' }],
  },
  {
    id: 'safety-last',
    title: 'Safety Last!',
    meta: 'Film · 1h 14m · CC',
    tone: 4,
    badges: [{ label: 'FREE', kind: 'free' }],
  },
  {
    id: 'the-general',
    title: 'The General',
    meta: 'Film · 1h 18m · CC',
    tone: 3,
  },
  {
    id: 'charade',
    title: 'Charade',
    meta: 'Film · 1h 53m · CC',
    tone: 2,
    badges: [{ label: 'DUB', kind: 'dub' }],
  },
  {
    id: 'plan-9',
    title: 'Plan 9 from Outer Space',
    meta: 'Film · 1h 19m · CC',
    tone: 6,
  },
  {
    id: 'steamboat',
    title: 'Steamboat Bill, Jr.',
    meta: 'Film · 1h 11m · CC',
    tone: 1,
    badges: [{ label: 'FREE', kind: 'free' }],
  },
];

/** Saved titles — My List lives inside Profile now. */
export const myList: Title[] = catalog.slice(0, 6);

/* ------------------------------------------------------------------ *
 * Browse categories
 * ------------------------------------------------------------------ */

/** Genre tags for the Browse tabs; titles not listed simply have none. */
const genresById: Record<string, string[]> = {
  frieren: ['Animation', 'Fantasy'],
  'come-and-see': ['Drama', 'War'],
  'solo-leveling': ['Animation', 'Action'],
  caligari: ['Horror', 'Silent'],
  heron: ['Animation', 'Fantasy'],
  potemkin: ['Drama', 'Silent'],
  jujutsu: ['Animation', 'Action'],
  nosferatu: ['Horror', 'Silent'],
  metropolis: ['Sci-Fi', 'Silent'],
  'man-with-camera': ['Documentary', 'Silent'],
  'night-living-dead': ['Horror'],
  'his-girl-friday': ['Comedy'],
  cranes: ['Drama', 'War'],
  'safety-last': ['Comedy', 'Silent'],
  'the-general': ['Comedy', 'Silent'],
  charade: ['Thriller', 'Comedy'],
  'plan-9': ['Sci-Fi', 'Horror'],
  steamboat: ['Comedy', 'Silent'],
};

/** Catalog with genre tags attached, used by the Browse tabs. */
export const taggedCatalog: Title[] = catalog.map((item) => ({
  ...item,
  genres: genresById[item.id] ?? [],
}));

/** Episode count parsed from the meta line ("28 episodes · SUB · DUB"). */
export function episodeCount(item: Title): number {
  const match = /(\d+)\s+episodes?/i.exec(item.meta);
  return match ? Number(match[1]) : 0;
}

export const isSeries = (item: Title) => episodeCount(item) > 0;

export interface BrowseFilter {
  key: string;
  label: string;
  matches: (item: Title) => boolean;
}

/** Top-of-page category tabs on Browse. */
export const browseFilters: BrowseFilter[] = [
  { key: 'all', label: 'All', matches: () => true },
  { key: 'movies', label: 'Movies', matches: (item) => !isSeries(item) },
  { key: 'series', label: 'TV Shows', matches: isSeries },
  { key: 'drama', label: 'Drama', matches: (item) => !!item.genres?.includes('Drama') },
  { key: 'animation', label: 'Animation', matches: (item) => !!item.genres?.includes('Animation') },
  { key: 'comedy', label: 'Comedy', matches: (item) => !!item.genres?.includes('Comedy') },
  { key: 'horror', label: 'Horror', matches: (item) => !!item.genres?.includes('Horror') },
  { key: 'scifi', label: 'Sci-Fi', matches: (item) => !!item.genres?.includes('Sci-Fi') },
  { key: 'silent', label: 'Silent', matches: (item) => !!item.genres?.includes('Silent') },
];

export interface Download extends Title {
  quality: string;
  size: string;
  status: 'ready' | 'downloading';
  /** Download progress, 0–100. */
  percent: number;
}

/** Offline library shown on the Downloads tab. */
export const downloads: Download[] = [
  {
    id: 'frieren',
    title: "Frieren: Beyond Journey's End",
    meta: '28 episodes · SUB · DUB',
    tone: 1,
    quality: '1080p',
    size: '4.2 GB',
    status: 'ready',
    percent: 100,
  },
  {
    id: 'come-and-see',
    title: 'Come and See',
    meta: 'Film · 2h 22m',
    tone: 2,
    quality: '720p',
    size: '1.8 GB',
    status: 'ready',
    percent: 100,
  },
  {
    id: 'nosferatu',
    title: 'Nosferatu',
    meta: 'Film · 1h 34m · CC',
    tone: 4,
    quality: '1080p',
    size: '2.1 GB',
    status: 'ready',
    percent: 100,
  },
  {
    id: 'metropolis',
    title: 'Metropolis',
    meta: 'Film · 2h 33m · CC',
    tone: 3,
    quality: '720p',
    size: '0.9 GB',
    status: 'downloading',
    percent: 64,
  },
];

export interface Episode {
  /** Display label, e.g. "EP 7". */
  n: string;
  /** 1-based episode number used in the /watch route. */
  number: number;
  name: string;
  time: string;
  progress: number;
  active?: boolean;
}

const episodeNames = [
  'The Journey North',
  'A Quiet Village',
  'The Old Mage',
  'First Snow',
  'The Long Road',
  'A Door in the Rain',
  'The Hollow Crown',
  'Ash and Ember',
  'The Last Letter',
  'What the River Kept',
  'Before the Storm',
  'The Way Home',
];

/** Where each series is currently up to. */
const seriesProgress: Record<string, { watched: number; active: number; activeProgress: number }> = {
  frieren: { watched: 6, active: 7, activeProgress: 52 },
  'solo-leveling': { watched: 0, active: 1, activeProgress: 0 },
  jujutsu: { watched: 0, active: 1, activeProgress: 0 },
};

/** Full episode list for a series; empty for a film. */
export function episodesFor(item: Title): Episode[] {
  // Ingested series ship their own rows (names + per-episode MP4 paths).
  if (item.mediaEpisodes?.length) {
    const state = seriesProgress[item.id] ?? { watched: 0, active: 1, activeProgress: 0 };
    return item.mediaEpisodes.map((episode) => {
      const number = episode.number;
      const active = number === state.active;
      const watched = number <= state.watched;
      return {
        n: `EP ${number}`,
        number,
        name: episode.name || `Episode ${number}`,
        time: episode.time || '24m',
        progress: watched ? 100 : active ? state.activeProgress : 0,
        active,
      };
    });
  }

  const count = episodeCount(item);
  if (!count) return [];

  const state = seriesProgress[item.id] ?? { watched: 0, active: 1, activeProgress: 0 };

  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const active = number === state.active;
    const watched = number <= state.watched;

    return {
      n: `EP ${number}`,
      number,
      name: episodeNames[index] ?? `Episode ${number}`,
      time: active ? '12m left' : '24m',
      progress: watched ? 100 : active ? state.activeProgress : 0,
      active,
    };
  });
}

/**
 * Convert one media-server title into a catalog `Title`.
 * Kept separate from the seed data so the player, rails, and search all see
 * one shape — with the poster and MP4 path attached.
 */
export function fromMedia(remote: MediaTitle): Title {
  return {
    id: remote.id,
    title: remote.title,
    meta: remote.meta,
    tone: ((remote.tone ?? 1) as ToneKey) || 1,
    genres: remote.genres,
    badges: remote.badges,
    progress: remote.progress ?? 0,
    // Absolute URL: catalog-relative posters must resolve against the media
    // server, not the page origin.
    poster: resolveMedia(remote.poster),
    video: remote.video,
    mediaEpisodes: remote.episodes,
    youtubeId: remote.youtubeId,
    sourceUrl: remote.sourceUrl,
    channel: remote.channel,
    synopsis: remote.synopsis,
  };
}

/**
 * Ingested titles from the media server, deduped against the seed catalog by
 * id (the ingested copy wins because it carries the playable MP4).
 */
export function mediaCatalog(): Title[] {
  const remote = getMediaTitles().map(fromMedia);
  const seedIds = new Set(
    [...latest, ...continueWatching, ...top10, ...catalog, ...downloads].map((item) => item.id),
  );
  return remote.filter((item) => !seedIds.has(item.id));
}

/** Find a title by id across every catalog surface. */
export function findTitle(id?: string): Title | undefined {
  if (!id) return undefined;

  // Ingested titles from the media server win: they carry the real poster and
  // the MP4 path the player needs.
  const remote = getMediaTitles().find((item) => item.id === id);
  if (remote) return fromMedia(remote);

  const matches = [...latest, ...continueWatching, ...top10, ...catalog, ...downloads].filter(
    (item) => item.id === id,
  );
  if (!matches.length) return undefined;
  // Continue Watching carries the playback position; prefer it over the
  // poster-only copies so the player opens where the viewer left off.
  return matches.reduce((best, current) =>
    (current.progress ?? 0) > (best.progress ?? 0) ? current : best,
  );
}

export const navGroups: {
  label: string;
  items: { label: string; href: string; icon: IconName }[];
}[] = [
  {
    label: 'Browse',
    items: [
      { label: 'Home', href: '/', icon: 'home' },
      { label: 'TV Shows', href: '/browse', icon: 'tv' },
      { label: 'Movies', href: '/browse', icon: 'film' },
      { label: 'Animation', href: '/browse', icon: 'magic' },
      { label: 'Most Watched', href: '/browse', icon: 'star' },
    ],
  },
  {
    label: 'Library',
    items: [
      { label: 'My List', href: '/my-list', icon: 'bookmark' },
      { label: 'Downloads', href: '/downloads', icon: 'download' },
      { label: 'Continue Watching', href: '/profile', icon: 'play' },
    ],
  },
  {
    label: 'You',
    items: [
      { label: 'Profile', href: '/profile', icon: 'profile' },
      { label: 'Account', href: '/account', icon: 'cog' },
      { label: 'Profiles', href: '/account', icon: 'users' },
    ],
  },
];

export const tabs: { label: string; href: string; icon: IconName }[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Browse', href: '/browse', icon: 'grid' },
  { label: 'Search', href: '/search', icon: 'search' },
  { label: 'Downloads', href: '/downloads', icon: 'download' },
  { label: 'Profile', href: '/profile', icon: 'profile' },
];
