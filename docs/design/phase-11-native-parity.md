# Phase 11 — Native parity

**Status:** Locked `v11.0` — approved 2026-11-08
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 1 `v1.1` brief, Phase 2 `v2.0` strategy, Phase 3 `v3.0` IA, Phase 5 `v5.0` colour, Phase 6 `v6.0` components, Phase 7 `v7.0` layouts, Phase 8 `v8.0` motion, Phase 9 `v9.0` accessibility, Phase 10 `v10.0` content
**Preview:** `docs/design/phase-11-preview.html`
**Evidence:** Static source audit of `apps/mobile` on 7 Nov 2026. The app was not run on a device, simulator, or emulator, and no screenshots were taken. Findings describe code, not observed runtime behaviour. No user testing is claimed.

---

## 1. Intent

Native is not a companion view of the website. It is the third equal surface, and it is currently the least complete.

Phase 3 locked five tabs, a pushed Watch screen, and a restoration contract. Phase 5 locked semantic tokens and a real light theme. Phase 6 locked 44pt targets and the tab bar. Phase 9 locked roles, focus, captions, and native mirror controls. Phase 10 locked the words. The mobile app implements almost none of that: it has four glyph tabs, one hard-coded dark palette, no progress position, no consent or account surface, a player that suppresses captions, and copy that repeats claims Phase 10 removed.

This phase closes the gap. It does not add new product scope. It makes the locked contracts true on iOS and Android:

1. **Same destinations, same order, same words.** Five tabs. Browse is a real screen. Watch is a push, not a mode.
2. **Same design system.** One theme object with dark and light peers, semantic tokens, no raw hex, no glow.
3. **Same playback promises.** Paused entry, explicit resume, captions available, quality and speed reachable, progress saved, errors explained, no autoplay with sound.
4. **Same honesty.** No “no ads” while embeds can carry ads. Consent before collection. Kids is restricted or it makes no promise.
5. **Native where native is better.** Stack pushes, hardware back, sheets, pull-to-refresh, dynamic type, VoiceOver and TalkBack, PiP and fullscreen — never a different destination or a different claim.

---

## 2. Evidence and scope

### 2.1 What was inspected

| File | Lines | Role |
|---|---|---|
| `apps/mobile/App.jsx` | 181 | Tab shell, catalog fetch, favorites, last-played, Watch switch |
| `apps/mobile/app.json` | 30 | Expo config, forced dark style, no scheme |
| `apps/mobile/index.js` | 6 | Expo entry point |
| `apps/mobile/src/theme.js` | 18 | Hard-coded palette |
| `apps/mobile/src/components.js` | 171 | Card, rail, badge, chip, empty state |
| `apps/mobile/src/customLinks.js` | 13 | Static operator-link registry |
| `apps/mobile/src/data.js` | 186 | API base, storage keys, search, relay host list |
| `apps/mobile/src/screens/HomeScreen.jsx` | 215 | Hero, rails, chips, grid |
| `apps/mobile/src/screens/SearchScreen.jsx` | 109 | Search field and results |
| `apps/mobile/src/screens/ListScreen.jsx` | 88 | Continue card and saved grid |
| `apps/mobile/src/screens/MoreScreen.jsx` | 130 | Stats, claims, links, clear list |
| `apps/mobile/src/screens/WatchScreen.jsx` | 419 | WebView player, episodes, related |

Total: **1,566 lines across 12 files.** `package.json` (32 lines) and `babel.config.js` (6 lines) were also read for dependencies and build configuration.

### 2.2 What was not verified

- No device or emulator run. VoiceOver, TalkBack, dynamic type, safe areas, WebView behaviour, and video playback are **unverified**.
- No performance measurement. Frame rate, startup time, and memory are targets, not results.
- No store submission review. Privacy manifest, data-safety form, and permission text are requirements, not completed filings.
- No live Supabase project. Account, consent, profile, and telemetry schemas remain the Phase 10 plan.

---

## 3. Parity contract

### 3.1 Destinations

Phase 3 is binding. Native may change the chrome, never the destination or the name.

| Destination | Native form | Current state |
|---|---|---|
| Home | tab `home` | Exists |
| Browse | tab `browse` + section | **Missing** |
| Search | tab `search` | Exists |
| My List | tab `list` | Exists |
| More | tab `more` | Exists |
| Watch | push `watch/:slug` | Exists as a shell switch, not a stack |
| Continue Watching | Home rail; List header | Partial: hero and List card only |
| Account | push `account/:tab` | **Missing** |
| Profiles | push `account/profiles` | **Missing** |
| Consent | modal over any screen | **Missing** |
| Sign in | modal | **Missing** |
| About | native copy screen | **Missing** (opens web) |
| Legal | native copy screen | **Missing** (opens web) |
| Privacy | native copy screen | **Missing** |
| Kids | profile mode | **Missing** |
| Not found | inline state | **Missing** |

### 3.2 Five tabs

Locked order: **Home · Browse · Search · My List · More.**

- Height **56pt + bottom safe-area inset**.
- Icon **22pt**, label **11pt** minimum, weight 700 when active.
- Active: `action.soft` background, `content.primary` icon and label, **2pt top rule** in `action.primary`. The accent is the rule, not the text.
- Inactive: `content.secondary`.
- Full tab is the hit target; minimum 44pt.
- `accessibilityRole="tab"`, `accessibilityState={{ selected }}`.
- Hidden while Watch is visible.
- Tab re-tap scrolls to top; second re-tap refreshes the catalog.
- Per-tab scroll position and stack survive app restarts.

### 3.3 Header

- Height **56pt + top safe-area inset**.
- Brand at the leading edge; search shortcut and account avatar at the trailing edge.
- Remove the tagline “official · free · legal”. It is a claim, not a label, and it is not true for every title.
- No sticky header on Watch; the back control belongs to the Watch screen.

### 3.4 Watch entry rule

Phase 3 locked this and Phase 10 repeated it:

> Browse, search, card, rail, and deep-link entries open **paused**. Only an explicit **Continue watching / Resume** action starts playback.

Native currently violates it twice: it restores `last.ep` for any entry into the same show, and every WebView autoplays (`autoplay: 1`, `youtubeHtml`).

Required state machine:

| Entry | Episode | Position | Playing |
|---|---|---|---|
| Continue Watching / Resume | Saved episode | Saved seconds | Yes |
| Hero with active progress, labelled Resume | Saved episode | Saved seconds | Yes |
| Hero without progress | First episode | 0 | No |
| Card, rail, search, Browse, related | First episode unless the user picks another | 0 | No |
| Episode row tap | Chosen episode | 0 | No, until Play |
| Deep link to episode | Linked episode | 0 unless `resume=1` | No |
| Autoplay next, if enabled | Next episode | 0 | Yes after 8s countdown |

The Play control is a user gesture. It may start sound.

### 3.5 State copy

Use the Phase 10 matrix. Native may shorten, never reword the meaning.

| State | Native copy |
|---|---|
| Catalog loading | “Loading titles…” |
| Catalog error | “The catalog didn't load. Check your connection and try again.” |
| Retry action | “Try again” |
| Empty search | “No titles match “{query}”. Try fewer words or a genre.” |
| Empty My List | “Your list is empty. Save a title to find it here.” |
| Nothing to continue | “Nothing to continue yet.” |
| Source failed | “This source didn't respond. Try again, or open the official source.” |
| Offline | “You're offline. Saved titles are still available.” |
| Save success | “Saved to My List.” |
| Remove success | “Removed from My List.” + Undo |
| Clear list confirmation | “Clear My List?” / “All {n} saved titles will be removed from this profile. Your watch progress is kept.” / “Clear” |
| Clear success | “My List cleared.” + Undo |
| Sign-in expired | “That link has expired. Send a new one.” |
| Profile limit | “This account already has four profiles. Remove one to add another.” |

Developer strings such as `EXPO_PUBLIC_API_BASE`, `HTTP 500`, or “server is reachable” never appear in user copy. They belong in a diagnostics screen behind More → About.

### 3.6 Divergence register

Native may diverge only in interaction pattern, never in destination, wording, or claim.

| Allowed | Not allowed |
|---|---|
| Stack push instead of page load | A different screen name or a missing destination |
| Bottom sheet instead of centred dialog | Different consent meaning or unequal actions |
| Hardware back | Back that skips the visual hierarchy |
| Pull-to-refresh | A refresh that wipes scroll or progress |
| Native share sheet | A share action that uploads viewing data |
| PiP and fullscreen | Playback that continues after the user leaves without a control |
| Dynamic type and screen-reader order | Fixed heights that clip text |

---

## 4. Theme and visual foundation

### 4.1 One theme object

Phase 5 locked semantic tokens and the camelCase path. Native currently imports a raw palette `C` and uses hex values directly in every screen. Replace it.

```js
// theme.js — shape, not the full table
export const themes = {
  dark: {
    color: {
      surface: { page, sunken, card, raised },
      border: { subtle, control, emphasis },
      content: { primary, secondary, tertiary, inverse },
      action: { primary, primaryHover, primaryPressed, ink, soft },
      focus, link, linkHover,
      success, warning, danger, info,
      media: { scrim, chromeFg, chromeMuted, progressTrack, progressFill },
      ad: { label, surface },
    },
    radius: { xs, sm, md, lg, xl, pill },
    space: { 1: 2, 2: 4, 3: 6, 4: 8, 5: 12, 6: 16, 7: 20, 8: 24, 9: 32 },
    type: { display, title, heading, subheading, body, label, caption, micro },
    motion: { fast: 120, base: 160, slow: 240 },
  },
  light: { /* same keys, light values */ },
};
```

Rules:

- Components never import a raw palette. They import `useTheme()`.
- No raw hex outside `theme.js`, including one-off “error red” and “link blue”.
- Media chrome is identical in both themes.
- Focus is a 2pt ring at 2pt offset, never a glow.
- No text shadow. The rank numeral gets a solid scrim, not a shadow.

### 4.2 Dark, light, and system

`app.json` currently sets `"userInterfaceStyle": "dark"` and every surface is fixed dark. Change to `"automatic"`.

| Mode | Behaviour |
|---|---|
| `system` (default) | Follows the OS; changes live |
| `dark` | Locked dark |
| `light` | Locked light |

- Store **`ma.theme`** with the mode, never the resolved theme.
- Resolve with `useColorScheme()`.
- `StatusBar` uses `light-content` on dark and `dark-content` on light.
- Splash background has a light counterpart; no flash on launch.
- The theme control lives in More → Appearance, and in Account → Settings when signed in.
- Both themes ship at launch. Light is not a later flag.

### 4.3 Values that change

| Role | Dark | Light |
|---|---|---|
| Page | `#0c0e12` | `#f6f7f9` |
| Card | `#161a21` | `#ffffff` |
| Raised | `#1b2029` | `#f2f4f7` |
| Sunken | `#12151b` | `#eef1f5` |
| Primary text | `#eef1f5` | `#12151b` |
| Secondary text | `#9aa3b2` | `#5c6472` |
| Subtle border | `#282e38` | `#e1e5ec` |
| Control border | `#646e7c` | `#6f7a8c` |
| Action fill | `#ff5c47` | `#ff5c47` |
| Action ink | `#0c0e12` | `#12151b` |
| Accent text/icon | `#ff8a3d` | `#c0341f` |
| Focus ring | `#ff8a3d` | `#c0341f` |

The current mobile page `#0c0e15` is not the locked token. It becomes `#0c0e12`.

### 4.4 Forbidden effects

- No glow, halo, bloom, ambient wash, or coloured shadow.
- No animated shadow.
- No card lift, card zoom, parallax, blur-in, or spring bounce.
- No gradient over text unless it is a flat scrim behind it.
- No accent text on the raw light fill; use `#c0341f`.
- No white label on an accent fill; use `action.ink`.

### 4.5 Type and dynamic type

| Native role | Size | Line | Weight |
|---|---|---|---|
| Display | 34pt | 36 | 650 |
| Title | 26pt | 30 | 650 |
| Heading | 18pt | 23 | 650 |
| Subheading | 15pt | 21 | 650 |
| Body | 14pt | 22 | 400 |
| Body strong | 14pt | 22 | 650 |
| Label | 12pt | 17 | 650 |
| Caption | 11pt | 16 | 500 |
| Micro | 11pt | 14 | 750, uppercase |

Rules:

- `allowFontScaling` stays on. No `maxFontSizeMultiplier` below 2.
- Test at 200%. Text wraps; nothing clips.
- Fixed heights containing text become `minHeight`.
- Hero art height is independent of the text block; text grows below it.
- Badges may grow horizontally; they never truncate a word.
- No text below 11pt. The Phase 6 `micro` token is 10px on web; native clamps to 11pt to meet the same floor.
- Use system fonts. No bundled display face.

### 4.6 Targets and spacing

- Every interactive element is at least **44×44pt**, measured by hit area, not visible glyph.
- Between adjacent targets: at least 8pt.
- Heart: 44pt hit area, 28pt visual.
- Tab: full 56pt bar.
- Episode row: minimum 56pt.
- Chips: 40pt tall visual, 44pt hit area.
- Transport controls: 44pt.
- Player seek: 44pt tall hit area around a 4pt track.
- Page gutter: 16pt; section gap: 24pt; card gap: 12pt.

---

## 5. Navigation and state

### 5.1 Tabs and stack

- Five tabs, each with its own stack.
- Watch is pushed on the current tab's stack. It is not a global boolean.
- Related-title taps push another Watch screen; back returns to the previous title.
- Account, Profiles, About, Legal, Privacy, and Kids are pushes.
- Consent and Sign in are modals.
- Hardware back follows: modal → Watch → origin tab. It never exits the app from Watch.

Current `App.jsx` uses `watchOpen` plus a single `cur` show. That cannot represent a stack or restore an origin. Replace with React Navigation (native stack + bottom tabs) or an equivalent reducer that stores `[{slug, lang, ep, position}]` per tab.

### 5.2 Focus and restoration

- Opening Watch moves accessibility focus to the back control, then announces the title.
- Closing Watch returns focus to the card or episode row that opened it.
- Switching tabs restores the tab's scroll offset.
- Re-tapping the active tab scrolls to top; a second re-tap refreshes.
- Deep links land on the destination with a working back path to Home.

### 5.3 Deep links

- Custom scheme: `moviearena://watch/:slug`, `moviearena://browse/:section`, `moviearena://account/:tab`, `moviearena://kids`.
- Universal links are a later addition.
- Unknown slug renders a native not-found state, not a blank player.
- Sign-in-gated destinations open the sign-in modal, then continue to the intended destination.

### 5.4 Sheets and modals

- Bottom sheet, full width, top radius only, `accessibilityViewIsModal`.
- Scrim uses the theme token; no blur.
- Focus moves to the sheet title or first control; close returns focus.
- Back gesture closes.
- Footer actions stack vertically on small screens with the primary last.

---

## 6. Watch and player

### 6.1 Architecture

| Source | Engine | Reason |
|---|---|---|
| YouTube channel embed | WebView + IFrame Player API | YouTube requires its own player; no stream extraction |
| Direct MP4 / WebM / HLS | Native media engine | Native HLS, captions, quality levels, PiP, background handling |

Preferred direct-file engine: **`expo-video`** (Expo-managed, native HLS, PiP, fullscreen). Acceptable alternative: **`react-native-video` 6** if a spike shows `expo-video` cannot meet the caption or quality contract. The decision is recorded before implementation.

Current code plays direct files inside a WebView with `hls.js` loaded from jsdelivr. That is a third-party script at runtime, a privacy dependency, and a supply-chain risk. It is removed.

### 6.2 Entry and resume

- Open paused for every browse/search/card/deep-link entry.
- Explicit Resume starts playback at the saved position.
- No resume prompt on a fresh title.
- If the saved position is within 10 seconds of the end, treat the title as finished; Resume starts the next episode or the first episode after a confirmation.

### 6.3 Controls

Native mirror controls, above or below the player, always available to screen readers:

| Control | Label | Notes |
|---|---|---|
| Play / Pause | “Play” / “Pause” | Mirrors WebView state |
| Back 10 | “Back 10 seconds” | Seeks, does not change episode |
| Forward 10 | “Forward 10 seconds” | Seeks |
| Mute | “Mute” / “Unmute” | Reflects state |
| Seek | Slider, “{time} of {duration}” | 44pt hit area, adjustable |
| Subtitles | “Subtitles” | Opens track list; off by default |
| Quality | “Quality: Auto” | Auto default; list of levels |
| Speed | “Speed: 1×” | 0.5×, 0.75×, 1×, 1.25×, 1.5×, 2× |
| Settings | “Settings” | Groups quality, speed, subtitles |
| Fullscreen | “Fullscreen” | Landscape; returns to previous orientation |
| Episodes | “Episodes” | Scrolls to the episode list |
| Open source | “Open official source” | External browser or YouTube app |

- Controls never auto-hide while focus is inside them.
- Tap-to-show, tap-to-hide; no hover states on touch.
- Player chrome is dark in both themes.
- No control sits under the tab bar; the tab bar is hidden on Watch.

### 6.4 Captions

Current `youtubeHtml` runs `killCaptions()` on a loop. That makes captions impossible, contradicts Phase 9, and contradicts the Phase 10 “Subtitles” control. Remove the kill loop.

- Captions default **off**, not forced off.
- The Subtitles control lists tracks from the IFrame API; if the list is empty, the control is disabled with the label “Subtitles unavailable”.
- Direct files use WebVTT tracks. Side-loaded `.srt` is converted to VTT on device; the file never leaves the device.
- Captions are not a live region and are never announced line by line.
- Transcript is available from the player menu where the source provides one.
- No third-party caption fetch. Any exception requires the Phase 10 disclosure and is text-only.

### 6.5 Quality and speed

- Quality default: **Auto**.
- Direct HLS: map native levels to “Auto”, “1080p”, “720p”, “480p”, “360p” with the actual height from the manifest.
- YouTube: `setPlaybackQuality` is advisory. The UI says “Quality is controlled by YouTube” when the player refuses the request. Never imply a guaranteed resolution.
- Speed applies to the player, not the app; state persists for the session only.

### 6.6 Autoplay next

Current code advances after 900ms with no countdown and `autoNext` default `true`. Replace with:

- Default **off**.
- When on, an 8-second countdown: “Up next: Episode {n}” + “Play now” + “Cancel”.
- Cancel keeps the current episode on its end frame.
- Countdown is announced once, politely; it is not a live region that repeats every second.
- Reduced motion: countdown still appears, but no progress animation; the text updates each second.
- Backgrounding the app cancels the countdown.

### 6.7 Progress, resume, and readahead

Current save shape is `{slug, lang, ep, ts}`. It has no position, so “resume” only means “open the same episode”.

New record:

```js
{
  slug, lang, ep,
  positionSec, durationSec,
  updatedAt,
  profileId
}
```

- Save every 10 seconds while playing, on pause, on episode change, and on `AppState` background.
- Continue Watching shows minutes remaining, not a percentage alone.
- The existing server `/api/stream` range relay and five-minute readahead stay server-side. Native uses the same API and does not add a second cache.
- No media prefetch before Play. With autoplay-next on, prefetch only the next episode's manifest after the countdown starts.
- Local record wins in guest mode. On sign-in, merge by `updatedAt`, newest wins, and show a one-time “Progress merged” note.

### 6.8 Errors, offline, and source fallback

- An error replaces the player area, not the whole screen.
- Copy: “This source didn't respond. Try again, or open the official source.”
- Actions: “Try again” and “Open official source”.
- Distinguish offline from source failure.
- A failed episode does not mark itself watched.
- Cached catalog: show the last successful JSON with “Updated {relative time}. You're offline.” and a retry action.
- No silent fallback to a different source.

### 6.9 Fullscreen, PiP, and background

- Fullscreen is landscape on phones; the episode list moves below on return.
- PiP is available for direct files; YouTube PiP follows the embed's capability and is not promised.
- Audio pauses when the app backgrounds unless the user explicitly enables background play for a direct file. No background play for the YouTube embed.
- The player never continues audio after the Watch screen is popped without a visible control.

### 6.10 Security

- WebView `originWhitelist` is restricted to the exact YouTube hosts used, not `["*"]`.
- External links open with `Linking.openURL` only for `http(s)` and only after the Phase 10 legal check.
- No injected HTML contains catalog titles without escaping.
- The relay host list in `data.js` must match the server allowlist; drift is a launch blocker.
- No DRM bypass, no stream extraction, no proxying licensed video.

---

## 7. Data, accounts, consent, ads, and Kids

### 7.1 Local-first, then optional account

- Guest mode is complete: catalog, search, My List, progress, appearance, and playback.
- Sign-in is optional and never blocks playback.
- Supabase tokens live in **SecureStore** (`expo-secure-store`), never AsyncStorage.
- AsyncStorage keeps guest favorites, progress, theme, and consent choice.
- Signing out returns to guest data; it does not delete local data.
- RLS on every table; anon key only; no service-role key in the app.

### 7.2 Consent

- First launch: no consent banner before the user plays. Consent is requested at the first optional collection point, or from More → Privacy.
- Modal with three equal actions: “Essential only”, “Choose”, “Accept optional”.
- Nothing pre-ticked. Rejecting is one action.
- Copy follows Phase 10 §7.4.
- Choice is stored locally and, when signed in, in `consent_events`.
- Changing the choice is available in More → Privacy at any time.
- Telemetry is off until opted in; ads are contextual by default.

### 7.3 Profiles and Kids

- Up to four profiles per account, including one optional Kids profile.
- Guest mode has one implicit local profile.
- Profile switch does not require re-authentication unless the account enables a PIN.
- Kids mode:
  - Simplified Home, large targets, no account upsell inside playback.
  - Catalog restricted to curator-approved, ad-free sources.
  - No analytics, no ad personalisation, no marketing.
  - Exit requires a parent PIN or device biometric.
  - If the restriction cannot be enforced, the UI makes **no “No ads” promise**.

### 7.4 Ads

- Contextual by default; personalised only with opt-in.
- Placements: Browse rails/grid, between episodes. **No pre-roll on public-domain films.**
- Every ad slot has a visible text label “Ad” and reserved height. No disguised native card.
- Native ad slot is a reserved surface with its own close/skip affordances; it never overlays player controls.
- Kids mode has no ads only when the catalog is restricted to ad-free sources.

### 7.5 Export and deletion

- More → Privacy → “Export my data” and “Delete my account”.
- Export produces a machine-readable file through an Edge Function and the native share sheet.
- Deletion schedules a 30-day window, states the consequence, and offers cancel.
- Deletion copy follows Phase 10 §7.6.
- Local data is removed on confirmation.

---

## 8. Search, Browse, and My List

### 8.1 Search

- Search tab opens with the field focused and the keyboard up.
- Label “Search titles”; hint “Typos are allowed”.
- Result count announced once: “{n} titles for {query}.”
- Empty state offers hot words and Browse links; never a dead end.
- Recent searches are local by default, clearable, and never synced without opt-in.
- Search is local over the cached catalog. No query leaves the device unless telemetry is opted in.

### 8.2 Browse

New tab. Sections locked by Phase 3:

- TV Shows
- Movies
- Animation
- Most Watched

Each section: chips, sort, grid, “Load more”, reserved card dimensions, labelled ad slot. “Most Watched” is a curated rail label, not a measured rank unless a metric is defined.

### 8.3 My List

- Continue Watching first when progress exists, then saved titles.
- Saved title removal offers Undo.
- Clear My List uses the Phase 10 destructive dialog and offers Undo.
- Star/heart state is exposed as selected, not colour-only.
- Empty state: “Your list is empty. Save a title to find it here.”

---

## 9. Accessibility parity

Phase 9 §14 is binding. Native-specific additions:

| Element | Required |
|---|---|
| Tab | role `tab`, selected state, label |
| Poster card | role `button`, label “{title}, {n} episodes, free”, hint “Opens details” |
| Heart | sibling node, role `button`, label “Save {title}” / “Remove {title} from My List”, selected state, 44pt |
| Chip / sort | role `button`, selected state |
| Search | label, hint, `returnKeyType="search"` |
| Episode row | role `button`, label “Episode {n}, {title}”, selected state |
| Audio pill | role `button`, selected state |
| Player | accessible label “Video player: {title}”, native mirror controls |
| Loading | polite announcement |
| Error | assertive announcement |
| Modal | `accessibilityViewIsModal`, focus to title, focus return |

- Opening Watch moves focus to back and title; closing returns to the origin.
- Dynamic type at 200% is a launch gate.
- Reduce motion removes transforms, countdown progress animation, and shimmer. The spinner exception from Phase 8 still applies.
- Haptics only on save, confirm, and error; never on scroll.
- Every control has a spoken label; no icon-only unlabelled button.

---

## 10. Performance and offline

Targets, not measured results:

- Cold start to interactive Home: ≤ 2.0s on a mid-range Android device with a warm cache; ≤ 3.5s cold without cache.
- Scroll: 60fps for rails and grid on a mid-range device.
- Images: cached, sized to the card, decoded off the main thread.
- Search: first result within 100ms for a 1,200-title catalog.
- No layout shift when rails, hero, or images load. Card and hero dimensions are reserved.
- Catalog JSON cached with `updatedAt`; stale-while-revalidate on launch.
- Rails inside a vertical list must not nest virtualized lists. Use one vertical `FlatList` with rail sections, or a non-virtualized horizontal scroll for bounded rails.
- No media download or prefetch before Play.
- Memory: release off-screen poster bitmaps; cap the image cache.

Offline:

- Cached catalog and saved list render.
- Playback fails with the offline state and a retry action.
- Progress and list changes queue locally and sync on reconnect when signed in.

---

## 11. Platform configuration

### 11.1 `app.json`

| Key | Current | Required |
|---|---|---|
| `userInterfaceStyle` | `"dark"` | `"automatic"` |
| `scheme` | absent | `"moviearena"` |
| `ios.supportsTablet` | absent | `true` |
| `orientation` | `"default"` | `"default"` (player locks landscape) |
| Splash | dark only | dark + light background |
| Version | `1.0.0` | single source of truth; displayed from config |
| `android.adaptiveIcon` | absent | provided |
| Permissions | default | audit; no unused permission |
| Privacy manifest | absent | `NSPrivacyTracking=false`, declared data types, required-reason APIs |
| Store data safety | not filed | declare account, analytics, ads, diagnostics |

### 11.2 Safe areas and status bar

- Replace React Native's `SafeAreaView` with `react-native-safe-area-context`.
- Apply top inset to the header and bottom inset to the tab bar.
- Landscape: top inset is 0 on the sides; content respects left/right notches.
- Status bar style follows the theme.
- Android navigation bar colour follows the theme.

### 11.3 API base

- One origin for the project. The current default `http://{metroHost}:8943` points at a port the project server does not use (`:8942`); only the no-Metro fallback is correct.
- Resolve order: `EXPO_PUBLIC_API_BASE` → `extra.apiBase` → Metro host on the project port → emulator alias.
- Surface a readable error if the base is unreachable; keep the env var in diagnostics, not user copy.

### 11.4 Dependencies to add

| Package | Purpose |
|---|---|
| `expo-video` | Native MP4/HLS playback, PiP, fullscreen |
| `expo-secure-store` | Supabase tokens |
| `react-native-safe-area-context` | Insets |
| `@react-navigation/native` + native-stack + bottom-tabs | Stacks, tabs, deep links |
| `@react-native-community/netinfo` | Offline detection |
| `expo-haptics` | Save/confirm/error feedback only |

No package is installed by this phase. Versions are pinned at implementation against the Expo SDK.

---

## 12. Gap audit

Legend: **P0** blocks launch, **P1** blocks the phase, **P2** polish. Evidence is the shipped source at the time of audit.

| # | Location | Finding | Priority | Required change |
|---|---|---|---|---|
| 1 | `theme.js`, `app.json` | One hard-coded dark palette; `userInterfaceStyle: "dark"`; status bar always light | P0 | Semantic theme object; system/dark/light; theme-aware status bar |
| 2 | `components.js`, screens | White on `#ff5c47` is 3.06:1 in hero, chip, empty, continue and play buttons | P0 | `action.ink` on every accent fill |
| 3 | `components.js` | Heart is nested inside the card pressable, 28×28, unlabelled, no state | P0 | Sibling 44pt control with role, label, selected state |
| 4 | `WatchScreen.jsx` | WebView autoplays with sound on open; no user gesture | P0 | Open paused; Play is explicit; Resume only from a resume action |
| 5 | `WatchScreen.jsx` | `killCaptions()` loop makes captions impossible | P0 | Remove loop; Subtitles mirror control; off by default |
| 6 | `WatchScreen.jsx` | No native mirror controls for the WebView player | P0 | Play, ±10, mute, seek, subtitles, quality, speed, fullscreen |
| 7 | `App.jsx` | Four tabs; Browse missing | P0 | Five locked tabs with Browse |
| 8 | `App.jsx` | Tab bar below 44pt; no role/selected state; no bottom inset | P0 | 56pt + inset, role tab, selected state |
| 9 | `App.jsx`, `WatchScreen.jsx` | Every entry restores the last episode and autoplays | P0 | Entry matrix in §3.4 |
| 10 | `App.jsx`, `data.js` | Progress stores episode only; no seconds or duration | P0 | Position, duration, updated-at, profile |
| 11 | `MoreScreen.jsx` | “No accounts, no ads, no analytics” contradicts shipped embeds and roadmap | P0 | Phase 10 copy; consent/account surfaces |
| 12 | App-wide | No consent, account, profiles, privacy, export, deletion, or Kids surfaces | P0 | Native screens and modals per Phase 3/10 |
| 13 | `WatchScreen.jsx` | Autoplay-next fires after 900ms, default on, no countdown or cancel | P1 | Opt-in, 8s countdown, cancel, background cancels |
| 14 | `App.jsx` | Watch is a boolean shell; no stack, no origin restore, no scroll preservation | P1 | Per-tab stacks and restoration |
| 15 | `HomeScreen.jsx` | Loading and error copy exposes `EXPO_PUBLIC_API_BASE` and HTTP errors; no cache | P1 | Phase 10 copy; cached catalog; diagnostics screen |
| 16 | `WatchScreen.jsx` | No in-player error state; error text sits below the player; watched still recorded | P1 | Error replaces player area; retry + official source |
| 17 | `WatchScreen.jsx` | HLS loads `hls.js` from jsdelivr; `originWhitelist: ["*"]` | P1 | Native media engine; restricted origin allowlist |
| 18 | `WatchScreen.jsx` | No quality or speed control | P1 | Auto quality, level list, speed menu |
| 19 | `WatchScreen.jsx` | No subtitle file support or transcript path | P1 | WebVTT/SRT, transcript, no third-party captions |
| 20 | `HomeScreen.jsx`, `components.js` | Fixed 320pt hero, `numberOfLines`, 8–9.5pt text; dynamic type clips | P1 | minHeight, wrapping, 11pt floor, 200% test |
| 21 | `components.js`, `App.jsx` | No reduce-motion handling; rank uses a text shadow | P1 | Reduce-motion branch; solid rank scrim |
| 22 | All screens | Raw `accent2`, `gold`, `free`, `#7d849c`, `#cfddff` outside Phase 5 tokens | P1 | Replace with semantic tokens |
| 23 | `HomeScreen.jsx`, `App.jsx`, `components.js` | Rank and claim copy: “TRENDING №1”, “Watch now”, “1,200+”, “All series · official”, “Top 10 this week” | P1 | Phase 10 lexicon; source-aware labels; define or drop rank |
| 24 | App-wide | No ad slots or “Ad” labels; no Kids ad restriction | P1 | Labelled contextual slots; no pre-roll on Archive |
| 25 | `SearchScreen.jsx` | No result announcement, history, hot words, or empty-state Browse links | P2 | Announce count; local history; useful empty state |
| 26 | `MoreScreen.jsx` | Clear uses `Alert`; no undo; copy differs from Phase 10 | P2 | Destructive sheet, verb repeat, undo |
| 27 | `MoreScreen.jsx` | About and Legal open the browser; no Privacy | P2 | Native copy screens |
| 28 | `customLinks.js` | Static duplicate of the web registry | P2 | Read the operator link feed; one shape |
| 29 | `App.jsx` | React Native `SafeAreaView` is iOS-only; Android uses `StatusBar.currentHeight` | P2 | `react-native-safe-area-context` |
| 30 | `App.jsx` | No tab re-tap-to-top, pull-to-refresh, or scroll persistence | P2 | Add all three |
| 31 | `MoreScreen.jsx` | “MovieArena v3” hard-coded; no error boundary | P2 | Read app version; add boundary |
| 32 | `app.json` | No scheme, tablet support, privacy manifest, or store data-safety declaration | P2 | Add before store submission |

### 12.1 Count

| Priority | Count |
|---|---|
| P0 | 12 |
| P1 | 12 |
| P2 | 8 |
| **Total** | **32** |

---

## 13. Implementation plan

Production changes begin after the gate. Order is by user impact and dependency.

1. **Theme foundation.** `theme.js` exports dark and light semantic objects; `ThemeProvider`; `useColorScheme`; status bar; safe-area provider. Replace every raw colour. One PR.
2. **Accent ink and targets.** Swap filled-button labels to `action.ink`; raise heart, tabs, chips, transport to 44pt. Verify computed contrast.
3. **Navigation.** Add React Navigation with five tabs, per-tab stacks, Watch push, deep links, back handling, scroll restoration.
4. **Watch entry.** Implement the §3.4 matrix. Open paused; explicit resume; progress record with seconds.
5. **Player.** Replace direct-file WebView with `expo-video` or `react-native-video`; build mirror controls; remove the caption kill loop; add quality, speed, subtitles, error state.
6. **Autoplay.** Opt-in, 8s countdown, cancel, background cancel, reduced-motion text.
7. **Browse and states.** Add Browse; align loading, empty, error, offline copy; cached catalog; notifications.
8. **Account and consent.** Sign-in modal, profiles, consent modal, privacy settings, export, deletion, SecureStore.
9. **Kids and ads.** Kids restrictions and PIN; labelled ad slots; no pre-roll on Archive.
10. **Copy and claims.** Apply Phase 10 lexicon and source-aware labels; remove `TRENDING №1`, `Watch now`, `1,200+`, “No ads”.
11. **Accessibility.** Roles, labels, states, focus moves, announcements, dynamic type, reduce motion.
12. **Platform config.** Scheme, tablet, splash, privacy manifest, data safety, dependency additions.
13. **Regression.** Re-run the web link/header/page/watch tests; run a native checklist on one iOS and one Android device.

---

## 14. Acceptance checklist

This is a test plan, not a record of completed testing.

### Shell and navigation

- [ ] Five tabs in the locked order, with Browse as a real destination.
- [ ] Tab bar is 56pt + bottom inset; every tab is at least 44pt.
- [ ] Active tab shows `content.primary` text and a 2pt accent rule, not accent text.
- [ ] Light, dark, and system modes work; no flash on launch.
- [ ] Status bar and Android navigation bar follow the theme.
- [ ] Tab re-tap scrolls to top; second re-tap refreshes.
- [ ] Scroll position and stack survive a restart.
- [ ] Deep links open the right destination with a working back path.

### Watch and player

- [ ] Browse/search/card entry opens paused at the first episode.
- [ ] Resume starts at the saved position.
- [ ] Progress saves every 10s, on pause, on episode change, and on background.
- [ ] Captions are available, default off, and never force-killed.
- [ ] Native mirror controls work with VoiceOver and TalkBack.
- [ ] Quality and speed are reachable; Auto is the default.
- [ ] Autoplay-next is off by default; when on, 8s countdown with Cancel.
- [ ] Player errors replace the player area and offer retry and official source.
- [ ] The player never autoplays with sound without a user action.
- [ ] Fullscreen and PiP behave; background audio follows the policy.
- [ ] No third-party script is fetched by the player.

### Theme and type

- [ ] No raw hex outside `theme.js`.
- [ ] No glow, halo, bloom, coloured shadow, card lift, or text shadow.
- [ ] White never appears on an accent fill; ink contrast is ≥ 4.5:1.
- [ ] Light accent text is `#c0341f`, not the raw fill.
- [ ] 200% dynamic type: nothing clips; actions remain reachable.
- [ ] Metadata uses `content.secondary`, not opacity.

### Data and trust

- [ ] More no longer claims “no accounts, no ads, no analytics”.
- [ ] Consent is equal-weight, off by default, and changeable.
- [ ] Guest mode works without sign-in.
- [ ] Sign-in tokens live in SecureStore.
- [ ] Four profiles, one optional Kids profile.
- [ ] Kids exits with a PIN; no ad or data language inside Kids.
- [ ] Ads are labelled in text and absent from Kids when restricted.
- [ ] Export and deletion work and explain their consequences.
- [ ] Legal and Privacy are readable natively and match the code.

### Accessibility

- [ ] Every icon-only control has a label.
- [ ] Heart, tab, chip, sort, episode, and audio state are exposed.
- [ ] Opening and closing Watch moves focus correctly.
- [ ] Loading is polite; errors are assertive.
- [ ] Reduce motion removes transforms and countdown animation.
- [ ] Decorative images are `accessible={false}`.

### Performance and offline

- [ ] Cached catalog renders offline with a timestamp and retry.
- [ ] No layout shift when rails, hero, or images load.
- [ ] No nested virtualized list warning.
- [ ] 60fps scroll target verified on one mid-range Android device.
- [ ] No media prefetch before Play.

---

## 15. Gate — decisions to approve

| # | Decision | Default |
|---|---|---|
| 1 | **Five tabs** | Home · Browse · Search · My List · More |
| 2 | **Navigation** | Per-tab native stack; Watch is a push; modals for consent and sign-in |
| 3 | **Theme** | One semantic theme object; dark, light, system; light ships at launch |
| 4 | **Tokens** | Phase 5 values; native page becomes `#0c0e12`; no raw hex outside the theme |
| 5 | **Accent ink** | `action.ink` on every accent fill; accent text uses `#c0341f` in light |
| 6 | **Effects** | No glow, halo, bloom, coloured shadow, text shadow, card lift, zoom, or parallax |
| 7 | **Watch entry** | Paused for browse/search/card/deep link; Resume only from an explicit resume action |
| 8 | **Progress** | Episode + position + duration + updated-at + profile; save every 10s and on background |
| 9 | **Direct-file engine** | `expo-video` preferred, `react-native-video` 6 fallback after a spike |
| 10 | **YouTube** | WebView + IFrame API; no extraction, no proxy, no DRM bypass |
| 11 | **Captions** | Available, default off, native mirror control, no kill loop, no third-party fetch |
| 12 | **Quality and speed** | Auto quality; speed 0.5×–2×; YouTube quality labelled advisory |
| 13 | **Autoplay next** | Off by default; 8s countdown; cancel; background cancels |
| 14 | **Accounts** | Guest-first; optional Supabase; tokens in SecureStore; RLS on every table |
| 15 | **Consent** | Equal-weight modal; nothing pre-ticked; one-action reject; changeable |
| 16 | **Kids** | Up to four profiles; one optional Kids profile; restricted catalog and PIN exit |
| 17 | **Ads** | Contextual default; labelled slots; no pre-roll on Archive; no Kids ads only when restricted |
| 18 | **Copy** | Phase 10 lexicon; source-aware labels; dev strings out of user copy |
| 19 | **Accessibility** | Phase 9 §14 roles, focus, 44pt, dynamic type, reduce motion, mirror controls |
| 20 | **Performance** | Cached catalog, reserved dimensions, no pre-Play prefetch, no nested virtualized lists |
| 21 | **Platform** | Scheme `moviearena`, tablets, theme-aware splash, privacy manifest, data-safety filing |
| 22 | **Scope** | Native parity only; no web redesign and no new catalog sources in this phase |

**On approval:** lock as `v11.0` and proceed to Phase 12 — QA and regression.

---

## 16. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First native parity pass: static audit of 12 files and 1,566 lines; parity contract; five-tab and stack model; theme object and light mode; dynamic type and targets; Watch entry matrix; player architecture, mirror controls, captions, quality, speed, autoplay, progress and readahead; accounts, consent, profiles, Kids, ads; 32-item gap audit; implementation plan; acceptance checklist; 22 gate decisions. |
| `v11.0` | 2026-11-08 | Gate approved. Parity contract, five-tab stack model, semantic theme with light mode, Watch entry matrix, player and captions contract, accounts/consent/Kids/ads surfaces, 32-item audit, and 22 decisions locked. No production code changed in this phase. |
