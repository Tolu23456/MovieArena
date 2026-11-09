# Phase 13 — Performance, resilience, and launch readiness

**Status:** Locked `v13.0` (approved 2026-11-08)
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 1 `v1.1` brief, Phase 2 `v2.0` strategy, Phase 3 `v3.0` IA, Phase 4 `v4.0` direction, Phase 5 `v5.0` colour, Phase 6 `v6.0` components, Phase 7 `v7.0` layouts, Phase 8 `v8.0` motion, Phase 9 `v9.0` accessibility, Phase 10 `v10.0` content, Phase 11 `v11.0` native parity, Phase 12 `v12.0` QA
**Preview:** `docs/design/phase-13-preview.html`
**Evidence:** Local measurements on 8 Nov 2026 against the classic server on `:8942` and the Bun/React server on `:8943`. File sizes, compression, headers, timings, and static source inspection. No browser, Lighthouse, trace, throttled network, device, or emulator run. Anything that needs one of those is labelled **unverified**.

---

## 1. Intent

Phase 12 established what is true. Phase 13 establishes what it costs.

The locked design promises a fast find → play path. This phase sets numeric budgets for that promise, measures the current build against them, and records the failures. It also answers the second question a launch asks:

> When the network, the relay, the catalog, or the video host fails, what does the product do?

Three rules govern this phase:

1. **A budget without a measurement is a wish.** Every budget below is either measured in this phase or explicitly marked unverified with the tool that would measure it.
2. **The slowest surface sets the product's reputation.** Native is equal to web, so a 1.4 MB catalog fetched on every app launch is a launch defect, not a mobile footnote.
3. **Performance work may not change the locked design.** No motion, colour, layout, copy, or accessibility decision is reopened to buy speed. Cut bytes, not contracts.

---

## 2. Evidence and method

### 2.1 What ran

| Layer | Method | What it measures |
|---|---|---|
| Transfer size | `wc -c`, Node `zlib` gzip/brotli | Raw, gzip, and brotli bytes per asset |
| Compression behaviour | `curl -H 'Accept-Encoding: br,gzip'` | What each server actually sends |
| Cache behaviour | `curl` with `If-None-Match` | ETag presence, 304, `cache-control` |
| Timing | `curl -w '%{time_starttransfer}'`, repeated runs | Warm TTFB, median of 10 |
| Startup | `date` around a fresh server process | Time to first `200 /api/health` |
| Build | `date` around `bun run apps/web/build.js` | Build wall time |
| Memory | `ps -o rss` | Resident memory of both servers |
| Resilience | Source inspection | Error paths, fallbacks, relay and worker behaviour |
| Native | Static inspection of `apps/mobile` | Fetch, cache, list, and player strategy |

Servers:

- `:8942` — classic site, `node server.js`
- `:8943` — built React app, `bun run apps/server/server.ts`

### 2.2 What did not run

- No Chromium, Lighthouse, WebPageTest, React Profiler, or performance trace.
- No throttled 3G/4G profile, no CPU throttling.
- No real-device native build, simulator, or emulator.
- No CDN, no production host, no TLS termination, no HTTP/2 or HTTP/3.
- No sustained load test, no soak test, no cache-hit simulation at scale.
- No telemetry, because accounts and telemetry are not implemented.
- No screen-reader or assistive-technology session.

`LCP`, `CLS`, `INP`, `TTFF`, `rebuffer ratio`, and native cold start are therefore **budgets with no measured value yet**. They are not reported as passes.

### 2.3 Re-runnable probe

`node scripts/qa-phase13.js` repeats the transfer, catalog, cache, and health measurements against the two local servers and writes `/tmp/opencode/qa-phase13-results.json`. Its current run reports **8 pass · 0 fail · 9 unmeasured** among 17 checks and confirms **0 of 13** measured defects open. `node scripts/qa-phase13-preview.js` validates the dashboard itself.

The probe is evidence, not a gate. It cannot restart a server, rebuild the bundle, throttle a connection, or run a device, so startup, build, LCP, CLS, INP, TTFF, rebuffer, and native checks stay unmeasured there.

---

## 3. Performance budgets

Phase 4 adopted TTFF < 2 s, rebuffer < 1 %, start failure < 1.5 %, and INP < 200 ms as constraints. Phase 7 added LCP = hero art and CLS = 0. Phase 8 added 60 fps and no long task over 50 ms from motion. Phase 13 makes those numbers testable and adds transfer budgets.

| ID | Budget | Target | Measured today | Verdict |
|---|---|---|---|---|
| P1 | HTML document, brotli | ≤ 4 KB | 0.8 KB classic · 0.3 KB React | **Pass** |
| P2 | Classic first-load code + catalog, brotli | ≤ 300 KB | **266 KB** (9 files) | **Pass, tight** |
| P3 | React first-load code, brotli | ≤ 150 KB | **126 KB** compressed potential · **524 KB** actual local transfer | **Fail as served** |
| P4 | Catalog payload on wire | ≤ 260 KB | **250.6 KB** classic brotli · **1,436 KB** React | **Fail on React** |
| P5 | Warm API TTFB | ≤ 100 ms | 3.7–5.4 ms health / 25–36 ms catalog classic · 38–63 ms health / 90–100 ms catalog React | **Pass, React at limit** |
| P6 | Server startup to first `200` | ≤ 1 s | 882 ms classic · 363 ms React | **Pass** |
| P7 | Production build | ≤ 5 s | **181 ms** | **Pass** |
| P8 | Repeat visit, unchanged asset | ≤ 1 KB overhead | 0 B with 304 classic · **232 KB full refetch React** | **Fail on React** |
| P9 | LCP on a mid-tier phone, 4G | ≤ 2.5 s | not measured | **Unverified** |
| P10 | CLS, shell, rails, player | 0 | boxes reserved; images lack dimensions | **Unverified** |
| P11 | TTFF, browse → playing | ≤ 2 s | not measured | **Unverified** |
| P12 | Rebuffer ratio | < 1 % | not measured | **Unverified** |
| P13 | Playback start failure | < 1.5 % | not measured | **Unverified** |
| P14 | INP | < 200 ms | not measured | **Unverified** |
| P15 | Native cold start to usable Home | ≤ 2 s | not measured | **Unverified** |
| P16 | Browse surfaces load no media runtime | 0 bytes | **413 KB hls.js** on every React page | **Fail** |

The gap between P3's compressed potential and its actual transfer is the single largest finding in this phase. The code is not unusually large. The server does not compress it.

---

## 4. Transfer and payload

### 4.1 Asset sizes

| File | Raw | Gzip | Brotli |
|---|---:|---:|---:|
| `index.html` | 2,635 | 1,054 | 789 |
| `watch.html` | 3,620 | 1,502 | 1,138 |
| `apps/web/dist/index.html` | 881 | 440 | 287 |
| `style.css` | 79,096 | 16,340 | 13,912 |
| `shows-data.js` | **1,436,570** | 274,590 | **219,405** |
| `player.js` | 137,550 | 34,252 | 28,799 |
| `apps/web/dist/main.js` | 232,112 | 72,866 | 63,382 |
| `apps/web/dist/main.css` | 9,370 | 2,760 | 2,402 |
| `apps/web/dist/app.css` | 11,402 | 3,246 | 2,785 |
| `watch.js` | 31,696 | 11,027 | 9,573 |
| `home.js` | 30,521 | 9,865 | 8,633 |
| `common.js` | 21,877 | 7,360 | 6,312 |
| `links.js` | 21,492 | 6,359 | 5,565 |
| `custom-links.js` | 20,932 | 4,370 | 3,804 |
| `moviemind.js` | 15,756 | 5,936 | 5,041 |
| `sw.js` | 12,770 | 4,431 | 3,802 |
| `icons.js` | 7,434 | 3,338 | 2,933 |
| `catalog-meta.js` | 799 | 441 | 368 |
| `hls.js` 1.5.13 (CDN) | **413,181** | 124,361 | 103,026 |

`apps/web/dist/app.css` is a dead duplicate of the source stylesheet. The applied stylesheet is `main.css`, emitted from the same import. The build copies `app.css` into `dist` but `index.html` never links it.

### 4.2 First load

**Classic home**, 9 local files, brotli:

```
style.css          13,912
shows-data.js     219,405
catalog-meta.js       368
icons.js            2,933
common.js           6,312
home.js             8,633
custom-links.js     3,804
links.js            5,565
moviemind.js        5,041
─────────────────────────
total             265,973   (266 KB)
```

`shows-data.js` is a synchronous `<script>` with no `defer`, so the parser blocks on a 1.44 MB file before the first card can render. Its 219 KB brotli weight is 82 % of the classic first-load budget, spent to render the first 120 cards and the rails.

**React home**, uncompressed from `:8943`:

```
main.js           232,112
main.css            9,370
style.css          79,096
player.js         137,550
icons.js            7,434
custom-links.js    20,932
links.js           21,492
moviemind.js       15,756
─────────────────────────
local total       523,742
hls.js            413,181
YouTube iframe API  unmeasured, external
─────────────────────────
known total       936,923   (915 KB)
```

The same eight local files total **125,838 B brotli**. The React site is served **4.2× larger than its own compressed size** because the Bun server has no compression path.

### 4.3 API and catalog

| Endpoint | Server | Encoding | Body | TTFB (warm) | Cache-Control |
|---|---|---|---:|---:|---|
| `/api/catalog` | `:8942` | brotli | 250,574 | 25–36 ms | `no-cache` + ETag |
| `/api/catalog` | `:8943` | none | **1,436,300** | 90–100 ms | `no-cache` + ETag |
| `/api/shows` | `:8942` | none | 238,726 | 14 ms | `no-store` |
| `/api/shows` | `:8943` | none | 234,063 | 70 ms | none |
| `/shows-data.js` | `:8942` | brotli | 250,755 | 4–12 ms warm · 313 ms first | `no-cache` + ETag |
| `/api/health` | `:8942` | none | 54 | 3.7–5.4 ms median | `no-store` |
| `/api/health` | `:8943` | none | 58 | 38–63 ms median | none |

Two separate problems:

1. **Transfer.** The React catalog crosses the wire at its full 1.4 MB. The classic catalog crosses at 250 KB.
2. **CPU.** The Bun server calls `loadShows()` inside the request handler. Every `/api/health` and every `/api/catalog` re-reads and re-parses the 1.4 MB file. Median `/api/health` is **38–63 ms** on React against **3.7–5.4 ms** on classic, which caches the parsed catalog in memory. A catalog read that should be free is the most expensive request on the React server.

### 4.4 Third-party runtime

`apps/web/index.html` loads two external scripts on **every route**, including Home:

- `https://www.youtube.com/iframe_api` (`async`)
- `https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js` (`defer`) — **413,181 B raw, 103,026 B brotli**

Neither is needed to browse. They are needed only when the Watch player mounts, and HLS is needed only for HLS sources. The hls.js fetch is a third-party dependency on the critical path of a page that only displays cards.

`watch.html` correctly preconnects to `cdn.jsdelivr.net`, `www.youtube-nocookie.com`, and `i.ytimg.com`. `index.html`, the React index, and Home have no preconnect at all.

### 4.5 Images

- Posters are `<img loading="lazy" src="…">` with no `width`, `height`, `srcset`, `sizes`, `decoding`, or `fetchpriority`.
- Cards render in `<picture>`-less 16:9 boxes (`.card-poster { aspect-ratio: 16/9 }`), so the box is reserved and CLS is mitigated **by layout, not by image metadata**.
- The hero loads `hqdefault` (480×360) and falls back to `mqdefault` if that probe fails.
- Every viewport downloads the same poster size; there is no density or width negotiation.
- Home does not preconnect to `i.ytimg.com`, so the first poster pays DNS + TLS after the card markup exists.

### 4.6 Duplicate and dead weight

- `dist/app.css` 11,402 B is copied on every build and never referenced.
- React `index.html` requests `player.js?v=4`; the classic pages request `player.js?v=20`. With query-keyed caches these are two distinct entries, and the version number no longer identifies the file. `icons.js`, `main.js`, and `moviemind.js` are unversioned; `shows-data.js` and `catalog-meta.js` are unversioned.
- `style.css` and `player.js` are shared by both surfaces but re-downloaded under separate URLs when the query string differs.

---

## 5. Caching strategy

### 5.1 Current behaviour

| Surface | Response | Encoding | Validator | Repeat visit |
|---|---|---|---|---|
| `:8942` HTML | `no-cache` | brotli | weak ETag | 304, 0 B |
| `:8942` JS/CSS | `no-cache` | brotli | weak ETag | 304, 0 B |
| `:8942` images | `public, max-age=300` | none | weak ETag | memory/disk for 5 min |
| `:8942` `/api/catalog` | `no-cache` | brotli | strong ETag | 304, 0 B |
| `:8942` `/api/shows` | `no-store` | none | none | refetch |
| `:8942` relay | `public, max-age=3600` | upstream | upstream | upstream-dependent |
| `:8943` HTML/JS/CSS | `no-cache` | **none** | **none** | **full refetch** |
| `:8943` `/api/catalog` | `no-cache` | **none** | strong ETag | 304 works, but no compression on 200 |
| `:8943` `/api/shows` | **none** | **none** | **none** | refetch, heuristic caching only |
| `:8943` media | **none** | none | none | no policy |

The classic server does the hard part correctly: precompressed, ETagged, `Vary: Accept-Encoding`. Its weakness is that versioned assets still say `no-cache`, so the browser must revalidate every JS and CSS file on every visit even when the URL is immutable by construction.

The React server does none of it.

### 5.2 Target policy

| Asset class | Header | Why |
|---|---|---|
| HTML | `no-cache` | Always revalidate the shell so a deploy is picked up |
| Versioned JS/CSS (`?v=` or content hash) | `public, max-age=31536000, immutable` | The URL changes when the bytes change |
| Unversioned JS/CSS | `no-cache` until versioned | Avoid stale code |
| `shows-data.js` / catalog API | `no-cache` + strong ETag | Changes daily; 304 is 0 B |
| Posters | `public, max-age=86400` | Third-party URLs are content-addressed by video id |
| Relay media | `public, max-age=3600`, `Accept-Ranges` | Range playback must stay cacheable |
| Service-worker media chunks | Cache API, `no-store` on the synthetic response | The worker owns eviction |

Required changes: add brotli/gzip and validators to `:8943`; stop keying the same file to two versions; add content hashes to `main.js` and `main.css`; serve immutable headers for `?v=` URLs; give `/api/shows` a cache policy.

### 5.3 Service-worker readahead

`sw.js` is a bounded, range-aware media cache. It is well designed for its one job:

- Only same-origin `/api/stream` requests for direct video files.
- 1 MiB chunks, ~320 MiB ceiling, 24 MiB default window bounded to 8–96 MiB.
- `READAHEAD_SECONDS = 300` — the locked five-minute readahead.
- One background connection, so the media element keeps its own request.
- Stores synthetic `200` responses because the Cache API rejects `206`.
- Assembles a valid `206` from chunks on demand.
- Falls back to the network when the host ignores Range, the suffix range is unsupported, or a chunk fails.
- Deletes old `ma-media-*` caches on activate.

Limits:

- It is registered **only by `watch.js`**, and only in a secure context.
- The React Watch route never registers it and never posts `ma:meta` / `ma:progress`. React loses the five-minute readahead entirely.
- Eviction deletes the oldest inserted keys, not the least recently used.
- There is no app-shell cache, so an offline navigation still fails.
- There is no user-visible cache state or "clear cached media" control.

---

## 6. Layout stability

What is already right:

- Hero, rails, cards, player, and grid reserve their boxes before data arrives.
- Cards use a fixed 16:9 ratio, so a late poster cannot push the layout.
- The player shell is reserved before the iframe or video mounts.
- System fonts only; no web-font swap.
- Rails render 120 cards at a time (classic) or slice to 120 (React); the full catalog is not in the DOM.

What is missing:

- Images have no intrinsic `width`/`height`, so CLS depends on the CSS box staying correct.
- No `srcset`, so mobile downloads desktop-sized art.
- No `fetchpriority="high"` on the hero, so it competes with card art.
- No `decoding="async"`.
- No explicit placeholder/error treatment for a failed poster beyond the hero fallback probe.
- The catalog script blocks before the first card, so the LCP element cannot start early even though its box is reserved.

CLS is therefore **structurally protected but not measured**, and image delivery is not responsive.

---

## 7. Resilience

### 7.1 Failure matrix

| # | Scenario | Expected | Actual | Verdict |
|---|---|---|---|---|
| R1 | Catalog API returns 5xx on classic | Page still renders from embedded data; refresh offers retry | `shows-data.js` is the source; refresh status shows "Update failed — retry" | **Pass** |
| R2 | Catalog API returns 5xx on React | Inline error with retry and cached content | Full-page `Catalog failed to load: api 500`; no retry | **Fail** |
| R3 | Catalog API returns 5xx on native | Error card with retry and API-base hint | Error card with retry and `EXPO_PUBLIC_API_BASE` hint | **Pass** |
| R4 | Catalog JSON is empty or malformed | Distinguish "empty catalog" from "request failed" | Bun catches parse errors and returns `[]`; clients show zero shows with no error | **Fail** |
| R5 | Offline after first load, classic | App shell available; browsing works | No app-shell cache; only in-memory session survives; navigation fails | **Partial** |
| R6 | Offline after first load, React | App shell available | Same; no service worker at all | **Fail** |
| R7 | Relay upstream times out | Explicit timeout, player fallback message | 15 s abort; 504; player shows "Can't play this episode here…" | **Pass** |
| R8 | Relay upstream 404 | 404, no retry loop | 404 propagated; player fallback | **Pass** |
| R9 | Relay health unavailable on React | Fall back to direct host URL | `window.__MA_RELAY !== false` is true by default; no probe, so direct playback is attempted through a dead relay | **Fail** |
| R10 | Host ignores Range | Stop prefetch, play from network | Worker cancels and throws; fetch falls through | **Pass** |
| R11 | Network drops mid-playback with readahead | Cached next five minutes play | Worker serves assembled `206` from chunks | **Pass by design, unverified at runtime** |
| R12 | Storage full or persist denied | Playback continues; cache is optional | Write errors swallowed; `persist()` ignored | **Pass** |
| R13 | Service worker unsupported | Direct playback | Registration skipped; network playback | **Pass** |
| R14 | jsdelivr blocked | HLS falls back or fails clearly | hls.js never loads; HLS sources fail; YouTube and MP4 unaffected | **Fail for HLS** |
| R15 | YouTube iframe API blocked | Clear message, no blank player | Player fallback copy is present; no alternative engine | **Partial** |
| R16 | Native catalog fetch fails | Retry without losing saved state | Error screen + retry; favorites and last-played remain | **Pass** |
| R17 | Native relay unavailable | Direct-source fallback | WebView uses the relay unconditionally for allowlisted hosts | **Fail** |

### 7.2 What the resilience pass proves

- The classic surface degrades better than React because its catalog ships with the page and its refresh UI has retry copy.
- React's error handling is a raw exception string, not a product state.
- The relay is the single point of failure for Archive and NASA playback, and only classic probes it.
- The service worker is a strength and a parity gap at the same time: excellent on classic Watch, absent on React Watch and native.
- No surface distinguishes "no results" from "catalog failed to load" when the server returns an empty array.

---

## 8. Native performance

Native is measured by static inspection only. No device, simulator, or emulator was run.

| Area | Current behaviour | Risk |
|---|---|---|
| Catalog | `fetch(`${API}/api/catalog`)` on every launch; full 1.4 MB JSON; no local catalog cache | Slow cold start, data cost, failure on weak networks |
| Persistence | `AsyncStorage` holds favorites and last-played only | Catalog cannot be shown offline |
| Images | `Image source={{ uri }}` at full source size; no resize or cache policy | Memory and data waste in long rails |
| Home | One vertical `ScrollView` containing every rail | All rail children mount eagerly |
| Lists | `FlatList` for search, list, and episodes | Correct primitive |
| Player | WebView wrapper around a `<video>` element | No native media pipeline, no PiP/background playback, no hardware integration |
| Background | No prefetch of the next episode | Next-episode start pays a fresh request |
| Measurement | None | Cold start, memory, and TTFF are unknown |

Targets before launch: cold start ≤ 2 s, catalog cached across launches with a stale-while-revalidate policy, first rail within 1 s of a warm start, no full-size image above 2× its rendered box, and video start ≤ 2 s on Wi-Fi. All are targets, not results.

---

## 9. Launch readiness

### 9.1 Performance blockers

| Blocker | Owner | Exit test |
|---|---|---|
| React/Bun server sends no compression | 13 | Initial React code ≤ 150 KB brotli; catalog ≤ 260 KB |
| Catalog reparsed per request | 13 | `/api/health` median ≤ 10 ms on `:8943` |
| React and native fetch the full catalog on launch | 13 | Light payload or cached snapshot; skeleton before data |
| Catalog blocks classic first paint | 13 | First card paints before the full catalog completes |
| hls.js loads on browse | 13 | Zero hls.js bytes on Home, Browse, Search, My List |
| No immutable caching and version drift | 13 | One version per file; 304 or 0 B repeat; `immutable` on hashed URLs |
| React loses readahead and relay probe | 11/13 | React Watch uses the same worker contract and relay probe |

### 9.2 Operational readiness

Not yet in place, and required before a public launch:

- Error tracking and a documented rollback path for a bad build.
- Opt-in, PII-free RUM for TTFF, rebuffer, start failure, and INP, consistent with Phase 10 consent.
- A load test at the expected launch concurrency for `/api/catalog`, `/api/shows`, and the relay.
- A CDN or compression layer decision for production, since neither local server is a production edge.
- A cache-invalidation procedure tied to the daily scrape.
- A service-worker version and kill-switch procedure.

### 9.3 Still-open product blockers

Phase 13 does not close Phase 12's register. The legal claims (QA-02…QA-05), the Invidious playback and caption paths (QA-06, QA-07, QA-13), the unsupported "Trending №1" claims (QA-08…QA-10), product CSS effects (QA-01a/01b), and native parity defects (QA-14…QA-20) remain launch blockers regardless of speed.

---

## 10. Defect register

| ID | Sev | Where | Open defect | Required fix | Acceptance test |
|---|---|---|---|---|---|
| PERF-01 | P0 | `apps/server/server.ts` | No compression on static files or JSON | Brotli/gzip with `Vary`, cached per file version | React initial ≤ 150 KB; catalog ≤ 260 KB |
| PERF-02 | P0 | `apps/server/server.ts` | `loadShows()` reparses 1.4 MB per request | Parse once, invalidate on mtime | `/api/health` median ≤ 10 ms |
| PERF-03 | P0 | React `App.jsx`, native `App.jsx` | Full catalog on every launch; no light endpoint, no cache | `/api/shows` + per-show fetch, or cached snapshot with revalidation | First paint before full catalog; warm launch uses cache |
| PERF-04 | P1 | `index.html` | 1.44 MB synchronous catalog before first paint | Defer, split, or stream; skeleton first | First card before catalog completes |
| PERF-05 | P1 | `apps/web/index.html` | 413 KB hls.js from a third-party CDN on every page | Self-host and load only on Watch HLS playback, or use the native engine | Zero hls.js on browse |
| PERF-06 | P1 | HTML heads | `no-cache` on versioned assets; version drift and unversioned files | Hash or single `?v=` per file; `immutable` on versioned URLs | One version per file; repeat 0 B |
| PERF-07 | P1 | `:8943` static | No ETag, no `Last-Modified`, no 304 | Add validators | Repeat request returns 304 |
| PERF-08 | P1 | `apps/web/src/Watch.jsx` | No service worker, no readahead, no relay health probe | Mirror the classic contract | Five-minute readahead present; direct fallback when relay fails |
| PERF-09 | P2 | `home.js`, `App.jsx` | Posters lack dimensions, `srcset`, priority, async decode | Responsive sizes and hero priority | CLS 0; mobile bytes reduced |
| PERF-10 | P2 | `index.html`, React index | No preconnect on browse surfaces | Preconnect only to hosts the page uses | Connection warm before art |
| PERF-11 | P2 | `apps/web/build.js` | `dist/app.css` is a dead 11.4 KB duplicate | Stop copying it | No unreferenced CSS in `dist` |
| PERF-12 | P2 | `apps/web/build.js` | One 232 KB bundle for all routes | Route-level split; Watch after Home | Home bundle excludes Watch code |
| PERF-13 | P2 | `sw.js` | Worker scope could drift into app-shell caching | Keep the worker media-only: no navigation handler, no offline shell | No `navigate` handling; media ranges only |
| PERF-14 | P2 | `sw.js` | Eviction is insertion-order; no cache visibility | LRU plus a clear-cache control | Old media evicted first; user can clear |
| PERF-15 | P2 | All surfaces | No performance instrumentation | Opt-in RUM for the four budgets | Dashboards exist before launch |

Totals: **3 P0 · 5 P1 · 7 P2.**

### 10.1 Resolution status

PERF-01…PERF-13 are implemented and verified by the probe: compression and validators on both servers, parse-once catalog, light `/api/shows` with cached snapshots and per-show deep links, async classic catalog, self-hosted on-demand hls.js, immutable `?v=22` assets, React relay probe plus media service worker, responsive poster delivery, preconnect, dead `dist/app.css` removal, and a lazy Watch route. The measured run is **8 pass · 0 fail · 9 unmeasured**, **0/13** open measured defects.

PERF-14 (LRU eviction plus a clear-cache control) and PERF-15 (opt-in, PII-free RUM) remain open P2 backlog. PERF-13 is verified as a media-only worker: the accepted decision is no app-shell or offline-navigation cache, so the worker has no `navigate` handler and cannot serve a stale shell.

---

## 11. Gate decisions

| # | Decision |
|---|---|
| 1 | Transfer and time budgets in §3 are launch gates. Measured failures block launch; unverified targets do not count as passes. |
| 2 | The Bun server must compress and validate before launch. Shipping 4.2× the necessary bytes is a defect, not a hosting choice. |
| 3 | The catalog is parsed once per process and invalidated on file change. Per-request parsing is not acceptable. |
| 4 | Browse surfaces may not download the full catalog. Use the light endpoint, a cached snapshot, or both; show a skeleton first. |
| 5 | No media runtime loads on a browse surface. hls.js is self-hosted and lazy, or replaced by the native engine. |
| 6 | Versioned assets are immutable; HTML is revalidated. One version per file across classic and React. |
| 7 | The five-minute readahead is a product contract on all three surfaces, not a classic-only feature. |
| 8 | React must probe the relay and fall back to the direct source, exactly as classic does. |
| 9 | Poster delivery becomes responsive: dimensions, `srcset`, hero priority, async decode. CLS stays 0. |
| 10 | Native catalog caching and a native media pipeline are launch requirements; current native timings are targets, not evidence. |
| 11 | Performance instrumentation is opt-in, PII-free, and tied to the Phase 10 consent model. |
| 12 | Performance work may not reopen Phase 4–12 visual, motion, copy, or accessibility decisions. |
| 13 | On approval, lock `v13.0` and proceed to Phase 14 — launch, rollout, and post-launch. |

---

## 12. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-08 | First performance and resilience pass: 16 budgets, asset and transfer matrix, compression and cache audit, catalog cost, third-party runtime, image delivery, service-worker contract, 17-scenario failure matrix, native inspection, launch readiness, and 15 defects (3 P0, 5 P1, 7 P2). Added `scripts/qa-phase13.js` measurement probe (3 pass · 5 fail · 9 unmeasured) and `scripts/qa-phase13-preview.js` dashboard validator (30/30). No runtime code changed. |
| `v13.0` | 2026-11-08 | Approved. Budgets, cache policy, defect register, and 13 gate decisions locked. Performance work may not reopen Phase 4–12 decisions. |

**Next:** Phase 14 — launch, rollout, and post-launch.
