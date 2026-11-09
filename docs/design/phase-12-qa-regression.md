# Phase 12 — QA and regression

**Status:** Locked `v12.0` — approved 2026-11-08
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 1 `v1.1` brief, Phase 2 `v2.0` strategy, Phase 3 `v3.0` IA, Phase 4 `v4.0` direction, Phase 5 `v5.0` colour, Phase 6 `v6.0` components, Phase 7 `v7.0` layouts, Phase 8 `v8.0` motion, Phase 9 `v9.0` accessibility, Phase 10 `v10.0` content, Phase 11 `v11.0` native parity
**Preview:** `docs/design/phase-12-preview.html`
**Evidence:** Executable probe run on 8 Nov 2026 against the classic server on `:8942` and the built React app on `:8943`. Static file inspection of the native app. No browser automation, no screenshots, no device or emulator run, and no user testing. Findings describe what the probe measured.

---

## 1. Intent

The first eleven phases decided what the product should be. This phase asks a narrower question:

> What is actually true in the working tree today, and what will break when the locked design is implemented?

Phase 12 is not a redesign. It is a **regression baseline**. It turns the locked contracts into executable checks, records the gap between the contracts and the shipped code, and gives every later implementation change a test it must not break.

Three rules govern this phase:

1. **Measure, do not assert.** Every pass or fail below comes from a command that can be re-run. Claims about accessibility, performance, or device behaviour that were not measured are listed as coverage gaps, not results.
2. **A design preview is not production.** A locked preview may contain a rejected-direction sample, a neutral elevation shadow, or the word “glow” in a sentence that forbids glow. Production code gets the strict test.
3. **Known defects stay visible.** The probe does not turn known blockers green. It records them as expected-open defects with an owner phase and an acceptance test, so the implementation phase can close them one by one.

---

## 2. Evidence and method

### 2.1 What ran

| Layer | Command | What it measures |
|---|---|---|
| QA probe | `node scripts/qa-phase12.js` | 185 executable checks across both servers and static files |
| Preview validator | `node scripts/qa-phase12-preview.js` | 19 checks: dashboard structure, embedded data, both themes, focus, reduced motion |
| Link player | `node /tmp/opencode/test-links.js` | 21 checks: playable cards, official embeds, Archive `<video>`, modal teardown |
| Header | `node /tmp/opencode/test-header.js` | 20 checks: brand, search placement, shortcuts, dropdown, filtering |
| Pages smoke | `node /tmp/opencode/test-pages-smoke.js` | 49 checks: one header, one sidebar, one search, no script errors |
| React build | `bun run apps/web/build.js` | Bundles `apps/web/src` to `apps/web/dist` |
| React server | `bun run apps/server/server.ts` | Serves the built app at `http://localhost:8943` |

Servers used:

- `:8942` — classic site and static assets, `node server.js`
- `:8943` — built React app plus root fallback assets, Bun server

The React build is deliberately tested at **origin root** on `:8943`. It references `/main.css`, `/style.css`, `/player.js`, and `/main.js` as root paths. Requesting `/apps/web/dist/index.html` from `:8942` is not a supported deployment and was removed from the probe.

### 2.2 What did not run

- No Chromium, Playwright, Puppeteer, Lighthouse, axe, or screenshot tooling.
- No iOS simulator, Android emulator, or physical device.
- No live Supabase project, account flow, consent flow, ad call, or telemetry endpoint.
- No visual diff, bundle-size budget, or performance trace.
- No screen-reader session (VoiceOver, TalkBack, NVDA).
- No user test or survey.

Anything below that depends on those tools is labelled **unverified**.

---

## 3. Test matrix

| Surface | Routing | Data | Security guards | Caching | Copy | Visual contract | A11y behaviour |
|---|---|---|---|---|---|---|---|
| Web classic | ✅ probe | ✅ probe | ✅ probe | ✅ probe | ✅ audit | ⚠ CSS backlog | ⚠ manual only |
| Web React | ✅ probe | ✅ probe | ⚠ root-fallback | ✅ probe | ✅ audit | ⚠ CSS backlog | ⚠ manual only |
| Native | ⚠ static only | ⚠ static only | ⚠ static only | — | ✅ audit | ⚠ static only | ❌ unverified |
| Design docs | ✅ previews | — | — | — | ✅ audit | ✅ preview rules | ⚠ manual only |

Legend: ✅ measured and passing · ⚠ measured with open defects or limited coverage · ❌ not measured.

---

## 4. Results

```
checks      185/185 passed
defects     21/21 confirmed open
resolved    0
unexpected  0
```

| Area | Checks | Result |
|---|---:|---|
| Classic pages, assets, duplicate IDs | 71 | Pass |
| React build at origin root | 17 | Pass |
| Catalog API and integrity | 28 | Pass |
| Relay, traversal, method guards | 8 | Pass |
| Cache policy and asset versions | 10 | Pass |
| JustWatch check and mobile screen files | 6 | Pass |
| Design preview integrity | 39 | Pass |
| Regression suites, build, server parity | 6 | Pass |

The 21 expected-open defects are the gap between the locked contracts and the current code. They are catalogued in §6.

The catalog measured at run time:

```
1,210 shows · 8,393 episodes · 7,501 YouTube ids · 844 Archive files · 48 NASA files
16 sources · 0 duplicate slugs · 0 plain-http ids · 0 Invidious ids
```

---

## 5. What the probe proves

### 5.1 Routing and static assets

- `/`, `/index.html`, `/watch.html`, `/list.html`, `/about.html`, `/legal.html` all return `200 text/html`.
- Every local `src`/`href` in those pages resolves to a `200` asset.
- No classic page contains a duplicate `id`.
- Unknown pages, `..` traversal, and encoded traversal do not return `200`.
- Markdown documents under `docs/design/` are not served, by design.
- `HEAD /api/health` returns `200` with an empty body.

### 5.2 React build

- `/`, `/index.html`, and the SPA fallback `/watch/demo-slug` return `200`.
- `/main.css`, `/style.css`, `/main.js`, `/player.js`, `/icons.js`, `/custom-links.js`, `/links.js`, and `/moviemind.js` all return `200` at origin root.
- The index contains `#root` and loads `main.js`; the bundle is over 100 KB.
- The React server reports the same catalog size and episode count as the classic server.
- `bun run apps/web/build.js` exits `0`.

This closes the false failure from the first probe run, which requested dist files under the `/apps/web/dist/` subpath instead of origin root.

### 5.3 Catalog integrity

- Every show has a slug, a title, a `langs` object, and at least one episode.
- Slugs are unique.
- Episode numbers are numeric and unique per language.
- Every episode id is either an 11-character YouTube id or an `https` URL.
- No plain-http ids.
- No Invidious ids in the catalog.
- Direct-file ids use only `archive.org` or `images-assets.nasa.gov`, matching the relay allowlist.
- The episode total reported by `/api/health` equals the sum of the catalog.
- `/api/shows` returns the same number of shows as `/api/catalog`.

### 5.4 Relay and guards

| Request | Expected | Measured |
|---|---|---|
| `GET /api/stream` | `400` | `400` |
| `GET /api/stream?url=https://evil.example/x.mp4` | `400` | `400` |
| `GET /api/catalog/refresh` | `405` | `405` |
| `GET /../etc/passwd` | not `200` | not `200` |
| `GET /%2e%2e/%2e%2e/etc/passwd` | not `200` | not `200` |
| `HEAD /api/health` | `200`, empty body | pass |

### 5.5 Caching

- `/api/catalog` returns an `ETag`; a conditional request returns `304`.
- Classic and React HTML both send `cache-control: no-cache`.
- Each versioned asset carries exactly one `?v=` value across all classic pages.
- `shows-data.js` is `no-store` on the Bun server; catalog responses revalidate with an `ETag`.

### 5.6 Regression suites

| Suite | Checks | Result |
|---|---:|---|
| Link player | 21 | Pass |
| Header | 20 | Pass |
| Pages smoke | 49 | Pass |

These suites cover the locked behaviours from the baseline cleanup: header search, sidebar navigation, modal player, official embeds, Archive playback, focus restore, and scroll lock.

### 5.7 Design previews

All eight phase previews (4–11) return `200`. CSS braces balance, each has one inline script pair, and Phase 11 is fully free of `radial-gradient`, `text-shadow`, `box-shadow`, “glow”, and “halo”. The Phase 4–10 effect inventory is resolved in §7.

The Phase 12 dashboard is checked separately by the preview validator: 19/19 pass, covering structure, embedded data, both themes, hard focus, reduced motion, and zero visual effect tokens in its own CSS.

---

## 6. Defect register

Severity follows the phase that owns the contract. `P0` blocks the implementation phase from being called complete; `P1` blocks launch; `P2` is polish.

| ID | Sev | Where | Open defect | Owner | Required fix | Acceptance test |
|---|---|---|---|---|---|---|
| QA-01a | P0 | `style.css` | Radial-gradient washes, text-shadows, and coloured shadows still ship; the user-facing no-glow rule is not yet true | 4/5/8 | Remove ambient washes, text shadows, coloured focus glow, and coloured hover shadows; keep neutral elevation only where Phase 6 allows it | Probe check “product CSS ships glow” flips to resolved |
| QA-01b | P1 | `style.css` | `.card:hover` still lifts with `translateY` | 8 | Remove lift; hover changes border and title only | Probe check “product CSS lifts cards” flips |
| QA-02 | P0 | `legal.html` | “There is no user database and no analytics” is true today but unsafe as a permanent promise | 10 | Replace with a dated current-state statement and a launch addendum | Phrase absent; dated statement present |
| QA-03 | P0 | `legal.html` | “Every stream … is delivered by YouTube” contradicts the next sentence and is false for Archive films | 10 | Split YouTube and direct-file delivery paths | Phrase absent; both paths described |
| QA-04 | P1 | `legal.html` | “No streams … proxied” does not qualify the Archive relay | 10 | Say no licensed video is proxied; explain the relay | Phrase absent; relay disclosed |
| QA-05 | P1 | `about.html` | “No re-hosting, no proxies” is unqualified | 10 | “No re-hosting of licensed video; public-domain files use our relay” | Phrase absent |
| QA-06 | P0 | `watch.html` | `Proxy: Off` control exposes Invidious playback | 10 | Remove the control | `#btn-proxy` absent |
| QA-07 | P0 | `watch.js` | Invidious playback branch, labelled “ToS-gray for YouTube” | 10 | Remove the branch and instance list | No `PROXY_INSTANCES`, no “ToS-gray” |
| QA-08 | P1 | `home.js` | Hero badge “Trending №1” implies a measured rank | 10 | “Featured” until a metric is defined | Phrase absent |
| QA-09 | P1 | `apps/web/src/App.jsx` | React hero repeats “Trending №1” | 10 | “Featured” | Phrase absent |
| QA-10 | P1 | `apps/mobile/src/screens/HomeScreen.jsx` | Native hero repeats “TRENDING №1” | 10 | “Featured” | Phrase absent |
| QA-11 | P0 | `apps/mobile/src/screens/MoreScreen.jsx` | “No accounts, no ads, no analytics” — “no ads” is already false | 10 | “No accounts today. Official embeds may include their own ads.” | Phrase absent |
| QA-12 | P1 | `watch.js` | Player badge is hard-coded “FREE · Official” for every source | 10 | Source-aware: “Free · Official” or “Free · Public domain” | Badge derives from source |
| QA-13 | P1 | `subs.js` | YouTube captions fetched through third-party Invidious hosts | 10 | Prefer the official endpoint; otherwise disclose text-only retrieval | No Invidious host; disclosure present |
| QA-14 | P0 | `apps/mobile/src/screens/WatchScreen.jsx` | `killCaptions()` loop suppresses captions every 2.5 s | 9/11 | Remove the loop; Subtitles control; captions default off | No `killCaptions` |
| QA-15 | P0 | `apps/mobile/app.json` | `userInterfaceStyle: "dark"` forces dark mode | 5/11 | System/dark/light with a semantic theme object | Config no longer forces dark |
| QA-16 | P1 | `apps/mobile/app.json` | No deep-link scheme | 11 | `moviearena` scheme and route map | Scheme present |
| QA-17 | P0 | `apps/mobile/App.jsx` | Four glyph tabs; Browse missing | 11 | Five labelled tabs with roles and selected state | Five tabs, Browse present |
| QA-18 | P0 | `WatchScreen.jsx` | WebView autoplays with sound | 11 | Open paused; Play is the gesture; Resume only from a resume action | No autoplay attribute on entry |
| QA-19 | P1 | `WatchScreen.jsx` | `hls.js` loaded from jsdelivr | 11 | Native media engine or bundled dependency | No CDN script |
| QA-20 | P1 | `WatchScreen.jsx` | `originWhitelist: ["*"]` | 11 | Restricted origin allowlist | No wildcard |

Totals: **10 P0 · 11 P1 · 0 P2.**

Note on QA-02: the statement is not false today. It is a P0 because Phase 10 requires the legal page to stop making an open-ended promise before accounts and telemetry exist.

---

## 7. Triage — the seven preview “forbidden effects” flags

The first probe run failed Phases 4–10 for containing `radial-gradient`, `text-shadow`, `box-shadow`, or the words “glow”/“halo”. That test was wrong for design previews. The corrected classification:

| Preview | What is present | Classification | Action |
|---|---|---|---|
| Phase 4 | 3 `radial-gradient`, 2 `text-shadow`, 10 `box-shadow` | **Legacy pre-amendment sample.** The gradients and text shadow belong to rejected Directions A/B; the locked Direction C panels use `box-shadow: none` and `transform: none`. | None. The document is locked and the preview is an archive. |
| Phase 5 | 4 `box-shadow`, 1 “halo” | Neutral elevation plus prose that forbids halo. | None. |
| Phase 6 | 7 `box-shadow`, 6 “glow” | Neutral elevation, inset tab rules, and prohibition copy. | None. |
| Phase 7 | 2 `box-shadow` | Inset nav/tab rules for layout mocks. | None. |
| Phase 8 | 1 `box-shadow`, 5 “glow” | Sheet elevation and prohibition copy. | None. |
| Phase 9 | 3 `box-shadow`, 1 “glow”, 1 “halo” | Dialog/phone elevation and prohibition copy. | None. |
| Phase 10 | 1 `box-shadow` | Dialog elevation. | None. |
| Phase 11 | 0 of all five | Post-amendment reference. | Keep as the strict baseline. |

The probe now asserts:

- Phases 5–11 have **zero** `text-shadow` and **zero** `radial-gradient`.
- Phase 11 has **zero** `box-shadow`, “glow”, and “halo”.
- Phase 4 is reported as an inventory, not a failure.
- Production `style.css` is tested strictly, and fails — that is QA-01a, the real backlog.

This resolves the seven false failures without hiding the production violation.

---

## 8. Coverage gaps

These are not passes. They are the work Phase 13 and the implementation phase must still cover.

| Gap | Why it cannot be proven yet | Planned check |
|---|---|---|
| Player time-update loop | No browser automation; player state depends on iframe events | Playwright harness with a test episode and captured time events |
| Captions rendering | Requires YouTube iframe or native `<video>` with a real track | Manual matrix plus caption DOM assertions |
| Keyboard depth | jsdom smoke covers focus basics, not every surface | Playwright keyboard walk of Phase 9 map |
| Screen reader | No VoiceOver/TalkBack/NVDA session | Recorded manual pass per surface |
| Contrast in the shipped app | Token math is verified in Phase 5/9; production CSS still overrides it | Computed-style audit in Playwright |
| Theme switching | Classic CSS still hard-codes dark values | Visual and computed-style test in both themes |
| Native behaviour | No simulator, no device | EAS preview build plus manual checklist |
| Account, consent, ads, telemetry | Not implemented | Contract tests against the Supabase schema and Edge Functions |
| Performance | No trace, no bundle budget | Lighthouse and React Profiler in Phase 13 |
| Visual regression | No screenshot tool by instruction | Baseline review after the first implementation pass |
| Legal accuracy after rewrite | Copy not yet changed | Claims probe flips QA-02…QA-05 to resolved |

---

## 9. Definition of done for the implementation phase

A change is complete only when:

1. The QA probe reports `0 unexpected failures`.
2. Every P0 in §6 is resolved, or explicitly deferred with a dated reason.
3. The three regression suites pass unchanged.
4. `bun run apps/web/build.js` passes and the built app serves at origin root.
5. No new `radial-gradient`, `text-shadow`, coloured glow, card lift, zoom, parallax, or animated shadow enters product CSS.
6. Any new destination or label matches Phase 3 and Phase 10.
7. Any new native surface uses the Phase 11 theme object and roles.
8. Any copy change keeps the claims probe honest — no new unsupported promise.

---

## 10. Regression cadence

```bash
# classic server
node server.js                    # :8942

# React server (separate terminal)
bun run apps/server/server.ts     # :8943

# build
bun run apps/web/build.js

# QA
node scripts/qa-phase12.js
node scripts/qa-phase12-preview.js
node /tmp/opencode/test-links.js
node /tmp/opencode/test-header.js
node /tmp/opencode/test-pages-smoke.js
```

The probe is read-only except for the React build, which rewrites `apps/web/dist`. It does not restart `:8942`, does not install dependencies, and does not use a browser.

The probe and the preview validator live in `scripts/`. The three baseline suites use a local jsdom install under `/tmp/opencode/matest`; if they are absent, the probe records them as informational rather than failing.

Probe artefact: `/tmp/opencode/qa-phase12-results.json` (185 checks, 21 defects, full detail).

---

## 11. Gate decisions

| # | Decision |
|---|---|
| 1 | QA is an executable baseline, not a visual opinion. 185 checks pass; 21 defects are expected-open. |
| 2 | React is tested at origin root on `:8943`; subpath deployment is out of scope for this app. |
| 3 | Design previews use a context-aware effect test; Phase 11 is the strict post-amendment reference. |
| 4 | Production `style.css` is not exempt. QA-01a and QA-01b stay open until the CSS is rewritten. |
| 5 | The legal and claims defects are P0/P1 blockers, not documentation debts. |
| 6 | The Invidious playback path and caption hosts are P0/P1 security and legal blockers. |
| 7 | Native caption suppression, forced dark mode, four tabs, and autoplay are P0 parity blockers. |
| 8 | The 49-check pages smoke suite and 41-check link/header suites are the minimum regression bar. |
| 9 | No defect is closed by changing a test to match the code; only by changing the code to match the contract. |
| 10 | Performance, screen-reader, device, and visual-regression coverage move to Phase 13 and the implementation phase. |
| 11 | The probe and its result JSON are the Phase 12 evidence of record. |
| 12 | On approval, lock `v12.0` and proceed to Phase 13 — performance, resilience, and launch readiness. |

---

## 12. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-08 | First QA pass: 185 executable checks across classic `:8942` and React `:8943`; catalog integrity, relay and traversal guards, caching, build, three regression suites, claims audit, mobile static contract, and preview integrity. 21 defects triaged (10 P0, 11 P1). Preview effect flags reclassified. Coverage gaps and exit criteria recorded. The QA probe and preview validator were added under `scripts/`; no product or server runtime code changed. |
| `v12.0` | 2026-11-08 | Gate approved. 185-check baseline, 21-defect register, preview-effect classification, coverage gaps, exit criteria, and 12 decisions locked. |

**Next:** Phase 13 — performance, resilience, and launch readiness.
