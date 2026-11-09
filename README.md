# MovieArena

A streaming UI (Expo / React Native web + native) with a real media pipeline
behind it:

```
YouTube  ->  server  ->  MP4  ->  MovieArena
```

Clicking a video never redirects to YouTube. The app fetches `catalog.json`
(movie details) and the MP4s from **our own server**, plays them in a real
`<video>` element, and can download the actual bytes for offline playback.

## Pieces

| Path | What it does |
| --- | --- |
| `scripts/ingest_youtube.py` | Pulls a YouTube video (`yt-dlp`), transcodes it to a compact baseline-H.264 MP4 with `ffmpeg` (`+faststart`, ≤360p), drops it in `media/videos/`, downloads the poster to `media/posters/`, and registers the title in `media/catalog.json`. |
| `scripts/media-server.js` | Local static server for `media/` on `:8090` — CORS, byte ranges (so seeking works), path-traversal guard. |
| `.github/workflows/media.yml` | The hosted server: validates `media/catalog.json` and publishes `media/` to **GitHub Pages** on every push touching `media/**` (or manually from the Actions tab). |
| `src/data/media.ts` | Client for the media server: catalog fetch, URL resolution, byte downloads. |
| `src/data/saved.ts` | Device-local download records (persisted in `localStorage`; offline playback uses the fetched blob). |

## Run locally

```bash
npm install

# terminal 1 — the media server (media/ on :8090)
node scripts/media-server.js

# terminal 2 — the app
npx expo start --web        # http://127.0.0.1:8081
```

The app reads `EXPO_PUBLIC_MEDIA_BASE` when set, otherwise it targets
`http://<hostname>:8090` on web. Point it at the Pages URL to stream from the
hosted server instead:

```bash
EXPO_PUBLIC_MEDIA_BASE=https://tolu23456.github.io/MovieArena npx expo start --web
```

## Ingest a video

```bash
# full video, capped at 360p
python3 scripts/ingest_youtube.py "https://www.youtube.com/watch?v=XXXX" --title "Title" --id my-title

# first 10 seconds only — small file for testing playback + download
python3 scripts/ingest_youtube.py "https://youtu.be/XXXX" --id my-title --title "Title" --slice 10
```

Only ingest material you have the right to store and serve.

## Verify

```bash
npx tsc --noEmit
```

Browser checks live in `/tmp/opencode/*.cjs` (Playwright): home rail, real
`<video>` streaming, byte downloads, offline playback, browse/search merge,
phone viewport — asserting zero console errors and zero outbound YouTube
requests.
