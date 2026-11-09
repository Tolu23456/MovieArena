# Phase 7 — Page layouts and responsive composition

**Status:** Locked `v7.0`
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 3 `v3.0` IA, Phase 4 `v4.0` direction, Phase 5 `v5.0` colour, Phase 6 `v6.0` components
**Preview:** `docs/design/phase-7-preview.html`
**Rule:** Pages compose components. Pages do not invent component tokens or colour values.

---

## 1. Intent

Phase 7 turns the sitemap into frames:

1. **One shell, three surfaces.** Classic, React, and native share the same regions, order, and names. Native uses stack pushes and sheets where web uses pages and dialogs.
2. **Find → play is the spine.** Home, Browse, Search, and Watch are ordered around the shortest deliberate path to a moving picture.
3. **The frame never moves.** Header, rails, grids, player, and state pages reserve their space. No layout shift, no jump on load.
4. **Mobile is composed, not shrunk.** The five-tab bar, stacked Watch layout, and bottom sheets are designed for touch, not squeezed desktop.
5. **Quiet surfaces.** Flat surfaces, hard rules, no glow, no parallax, no auto-advancing carousel.

---

## 2. App shell

### 2.1 Regions

```
┌──────────────────────────────────────────────────────────┐
│ skip link (on focus)                                     │
├──────────────────────────────────────────────────────────┤
│ header: brand · search · profile                         │
├───────────────┬──────────────────────────────────────────┤
│ sidebar       │ main                                     │
│ navigation    │ page content                             │
│ (desktop)     │                                          │
│               │                                          │
├───────────────┴──────────────────────────────────────────┤
│ footer (desktop)                                         │
└──────────────────────────────────────────────────────────┘

Mobile:
┌──────────────────────────┐
│ header                   │
├──────────────────────────┤
│ main                     │
│                          │
├──────────────────────────┤
│ tab bar (home/browse/…)  │
└──────────────────────────┘
```

- **Header** is sticky at the top; height 64px desktop, 56px mobile.
- **Sidebar** is fixed under the header on desktop, 240px wide at `lg`, 72px icon-only at `md`.
- **Main** is the only page scroll container; the shell does not scroll horizontally.
- **Tab bar** is fixed at the bottom on `xs`/`sm`; height 56px + safe-area inset.
- **Footer** appears on Home, About, Legal, and Privacy only. It is not repeated inside Watch or account sheets.

### 2.2 Landmarks

| Region | Element | Notes |
|---|---|---|
| Skip link | `<a href="#main">Skip to content</a>` | Visible on focus, first tab stop |
| Header | `<header>` | Contains brand, search, profile |
| Primary nav | `<nav aria-label="Primary">` | Sidebar desktop; tab bar mobile |
| Main | `<main id="main">` | One per page |
| Watch aside | `<aside aria-label="Episodes">` | Episodes/related column on Watch |
| Footer | `<footer>` | Info links and source note |

- Exactly one `<h1>` per page.
- Section headings in order; no skipped levels.
- Focus moves to `<h1 tabindex="-1">` on route change.
- The page scroll position is restored on Back; new routes start at the top.

### 2.3 Breakpoints

| Token | Width | Shell |
|---|---|---|
| `xs` | `< 480px` | Header 56px, tab bar, 1 column, 16px gutter |
| `sm` | `480–767px` | Header 56px, tab bar, 2 columns, 20px gutter |
| `md` | `768–1023px` | Header 64px, icon sidebar, 3 columns, 24px gutter |
| `lg` | `1024–1279px` | Header 64px, full sidebar, 4 columns, 32px gutter |
| `xl` | `≥ 1280px` | Full sidebar, 5–6 columns, content max 1440px |

- Content max width: 1440px, centered; rails may bleed to the viewport edge.
- No page horizontal scroll at 320px.
- Use `env(safe-area-inset-*)` on mobile header and tab bar.
- Zoom to 200% must not clip controls; the grid degrades to fewer columns.

### 2.4 Scroll model

- Page scroll only; no nested full-page scroll containers.
- Rails scroll horizontally inside their own track, with keyboard support.
- The Watch page uses the page scroll; the player is not sticky, so details and episodes stay reachable without an overlay.
- Sheets lock the page scroll and scroll their own body.
- Returning from Watch restores the origin scroll position and focus.

---

## 3. Grid and cards

### 3.1 Grid

| Breakpoint | Columns | Card min | Gap |
|---|---:|---:|---:|
| `xs` | 1 | 100% | 12px |
| `sm` | 2 | 220px | 16px |
| `md` | 3 | 220px | 16px |
| `lg` | 4 | 240px | 20px |
| `xl` | 5 | 240px | 24px |
| `2xl` | 6 | 240px | 24px |

- Cards are 16:9 stills; grid rows align on the art, not the variable title length.
- The grid uses `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))` inside the breakpoint cap.
- Card titles clamp to two lines; metadata to one. The card does not grow on hover.
- Rank numerals sit inside the art, bottom-left, and never change the card height.

### 3.2 Rails

- Rail track height is fixed by the card art + two text lines.
- Card width: `clamp(220px, 30vw, 300px)`; gap 16px mobile, 20px desktop.
- 8–15 rails maximum on Home.
- Continue Watching is first when it has content.
- Rail headers use `--type-heading`, with optional `See all` and arrow controls.
- Edge mask is 24px; no glow.
- No auto-advance. Any carousel has visible previous/next and pause.

### 3.3 Ads in layout

- One labelled ad card per rail; it occupies a card slot and is visually distinct (Phase 6 ad surface).
- Grid: maximum two ad slots, after the first two rows.
- Never in Continue Watching, episode rows, Kids, or around the player.
- Reserved height equals a card slot; no layout shift when blocked or empty.

---

## 4. Header

### 4.1 Desktop

```
[ brand ] [ search field (max 520px) ]              [ ? ] [ profile ]
```

- Height 64px; sticky; bottom hairline `border.subtle`.
- Brand links Home.
- Search is the same omnibox as the Search tab; Enter submits, `/` focuses it.
- Profile menu: current profile, switch profile, account, privacy choices, sign out.
- Header is opaque; no blur.

### 4.2 Mobile

```
[ brand ]                         [ search icon ] [ avatar ]
```

- Height 56px + safe-area top inset.
- Search icon opens the full-screen Search page with autofocus.
- Avatar opens More, not a dropdown.
- No horizontal nav in the header.

### 4.3 Header states

| State | Behaviour |
|---|---|
| Scrolled | Hairline stays; no shadow, no height change |
| Search focused | Search border + hard ring; `/` hint hidden |
| Guest | Profile menu shows “Sign in to sync” first |
| Signed in | Profile name, switch, account, privacy, sign out |
| Offline | Small “Offline” text badge next to brand; no modal |
| Kids | Persistent “Kids” badge; account links hidden |

---

## 5. Page layouts

### 5.1 Home

```
[ hero: art | kicker · title · synopsis · Play · My List · meta ]
[ Continue Watching rail ]                       (if progress)
[ Top 10 rail ]
[ Popular rail ]
[ New rail ]
[ Films rail ]
[ Dubs rail ]
[ browse grid / more rails ]
[ footer ]
```

- Hero is editorial, rotating on a long interval; it does not auto-advance while hovered or focused, and reduced motion makes it an instant swap.
- Hero media is a still image; no autoplay video.
- Hero height: `min(68vh, 620px)` desktop; on mobile it becomes a stacked card under the header, 16:9 art with text below.
- Hero primary action opens Watch **paused**; the secondary is My List.
- Hero metadata: year, rating, episodes, languages, source.
- Continue Watching appears first when present, up to 10 items.
- If there is no progress, the hero and Top 10 lead.
- Empty rails are omitted; the grid takes over.
- Footer: About, Legal, Privacy, accessibility statement, source note.

### 5.2 Browse

```
[ h1 Browse ]
[ section tabs: TV · Movies · Animation · Most Watched ]
[ chips: genre/source ] [ sort: Popular · Newest · A–Z ]
[ grid ]
[ Load more ]
[ footer ]
```

- Section is a real destination; `See all` from a rail opens the matching section.
- Section tabs use the chip/tab component; active has rule + weight + background.
- Filters are shareable in the URL (`?section=`, `?genre=`, `?sort=`).
- Grid loads in pages of 48; “Load more” keeps focus and scroll.
- Ad slot after the second row, maximum two per page.
- Empty section: “Nothing in this section yet” + Browse links; never a dead end.

### 5.3 Search

Desktop:

```
[ h1 Search ]
[ omnibox (autofocus when arriving from the tab) ]
[ recent queries ] [ hot words ]
[ results grid ]
```

Mobile:

```
[ search field fixed under header ]
[ recent / hints ]
[ results grid ]
```

- Empty query shows recent searches (local only) and hot words; no personal history without consent.
- Results include title, source badge, episode count, and playable/external state.
- Result selection opens Watch paused.
- No results: query echoed, hot words, Browse sections, and a clear button.
- Error: retry, keep the query.
- Search history is local by default; signed-in sync only with consent.

### 5.4 Watch

Watch is the detail page. No separate title page.

Desktop `lg+`:

```
[ back to origin ]
[ player 16:9 ]                         [ episodes aside ]
[ title · meta · actions ]              [ season filter ]
[ synopsis · source note ]              [ episode rows ]
[ related rail ]                        [ pagination ]
```

Mobile:

```
[ back ]
[ player 16:9 ]
[ title · meta · Play/Resume · My List ]
[ synopsis ] [ source note ]
[ episodes (collapsible) ]
[ related rail ]
```

- Player is the first content after the header; controls never sit under the tab bar.
- Watch opens paused; only explicit Resume/Continue Watching auto-plays.
- Player keeps 16:9 at every width; no letterbox jumps.
- Episodes aside is 320px at `lg+`; below `lg` it moves under the synopsis.
- Episode rows show number, title, duration, progress, language.
- Source note states official/public-domain provenance and any external-link disclosure.
- Related titles are a rail; no ads anywhere on Watch.
- Archive films: no pre-roll, no episode rail, related films instead.
- Error states replace the player area, not the whole page.

### 5.5 My List

```
[ h1 My List ]
[ Continue Watching rail ]            (if progress)
[ Saved grid ]
[ empty state ]
```

- Saved grid uses the same card and grid rules.
- Empty state: “Your list is empty” + Browse + Search actions.
- Remove is available from the card overflow and the Watch page; it is not hover-only.
- No ads in My List.

### 5.6 More

```
[ profile row: avatar · name · Kids badge · switch ]
[ Account & sync ]
[ Playback settings ]
[ Privacy choices ]
[ About ]
[ Legal ]
[ Privacy notice ]
[ app version · source note ]
```

- More is a page on narrow web/native and the “You” sidebar group on desktop.
- Guest: “Save your progress across devices” card first, dismissible.
- Signed in: sync status and last synced.
- Kids: only profile switch, playback settings, about; no account, no external links.
- No duplicate destinations already in the sidebar on desktop.

### 5.7 Account

```
[ h1 Account ]
[ tabs: Overview · Profiles · Privacy & data · Devices ]
[ panel ]
```

- Overview: current profile, sync status, last synced, sign out.
- Profiles: up to four; create/rename/delete; kids flag; PIN state.
- Privacy & data: consent history, export, delete analytics, delete account.
- Devices: sessions with revoke.
- Tabs are URL-addressable (`?tab=` / `#/account/:tab`).
- Destructive actions use the Phase 6 sheet; re-authentication for delete.
- Account is not reachable from Kids.

### 5.8 Consent

```
[ sheet title: Privacy choices ]
[ Essential — Required — always on ]
[ Analytics — Off — switch ]
[ Personalised ads — Off — switch ]
[ Save choices ] [ Essential only ]
```

- Sheet over any surface; non-blocking; never a playback gate.
- Essential is labelled Required and is not a toggle.
- Optional rows default off.
- State words are visible; switches use position + word.
- Withdrawal applies immediately in the UI.
- Kids profiles cannot reach this sheet.

### 5.9 Legal, Privacy, About

```
[ h1 ]
[ last updated ]
[ table of contents (desktop) ] [ article 66ch ]
[ contact / source note ]
```

- Reading measure: 66ch; body `--type-body`; headings `--type-heading`.
- Desktop TOC is sticky; mobile TOC is a collapsible summary.
- Legal covers sources, copyright, official channels, and takedown.
- Privacy covers accounts, ads, telemetry, retention, export, deletion, and consent history.
- Both must be readable offline once loaded.
- `legal.html`’s current “no user database and no analytics” copy is removed at launch.

### 5.10 Not found

```
[ 404 ]
[ “We couldn’t find that title.” ]
[ failed slug ]
[ search field ]
[ Home ] [ Browse ]
```

- Unknown slug never renders a blank player.
- The failed slug is echoed as text, not a link.
- Search is focused on arrival.

---

## 6. State pages

### 6.1 Loading

- Shell, header, and nav render immediately.
- Content blocks use skeletons at final dimensions.
- Hero reserves its height; rails reserve card height; grid reserves rows.
- No spinner for content blocks; spinners only inside buttons.
- Skeletons stop after 8 seconds and show a retry state.

### 6.2 Empty

- One sentence of cause, one primary action, one optional secondary link.
- No giant illustration, no dead end.
- Empty rails are omitted; empty pages keep the header and nav.

### 6.3 Error

- Full-page error keeps header and nav usable.
- Message names what failed: catalog, playback, sign-in, sync, consent write.
- Primary: Retry. Secondary: Home or Browse.
- Cached catalog is shown with an “offline catalog” note when available.
- Playback errors stay inside the player area.

### 6.4 Offline

- Header shows an “Offline” text badge.
- Shell and cached metadata stay; playback explains the connection requirement.
- Progress is kept locally and synced later.
- No blocking modal.

### 6.5 Kids block

- Calm page: “Not available in Kids.”
- Switch profile (PIN if set) is the only action.
- No red alarm styling, no external links.

| State | Header | Nav | Primary action | Never |
|---|---|---|---|---|
| Loading | yes | yes | none | spinner for content |
| Empty | yes | yes | Browse/Search | dead end |
| Error | yes | yes | Retry | blank page |
| Offline | yes + badge | yes | Retry | blocking modal |
| Kids block | yes + Kids | yes | Switch profile | external link |

---

## 7. Responsive composition

| Page | `xs` | `sm` | `md` | `lg+` |
|---|---|---|---|---|
| Home | stacked hero, 1-col grid | 2-col grid | 3-col, icon sidebar | hero + 4–6 col |
| Browse | 1-col, filters scroll | 2-col | 3-col | 4–6 col |
| Search | full-screen field, 1-col | 2-col | 3-col | 4–6 col |
| Watch | player, stacked details, collapsible episodes | same | 3-col grid for related | player + 320px aside |
| My List | 1-col | 2-col | 3-col | 4–6 col |
| More | list rows | list rows | 2-col info | grouped sidebar |
| Account | stacked tabs, full-width panels | same | 2-col panels | tabs + panel |
| Legal | 66ch article | same | TOC collapses | sticky TOC |
| States | centered, 1 action | same | same | same |

- On `xs`/`sm`, the tab bar is the primary navigation; the sidebar is removed, not duplicated.
- On `md`, the sidebar is icon-only with accessible names and tooltips on focus.
- On `lg+`, the tab bar is removed.
- Watch hides the tab bar at every width to keep controls clear.
- Sheets become bottom sheets below `md`; centered dialogs at `md+`.

---

## 8. Cross-surface parity

| Region | Classic | React | Native |
|---|---|---|---|
| Shell | `common.js` header/sidebar/tab bar | App shell components | Root stack + tab navigator |
| Home | `index.html` | `#/` | Home tab |
| Browse | `index.html?section=` | `#/browse/:section` | Browse tab |
| Search | header omnibox / `?q=` | `#/search?q=` | Search tab |
| Watch | `watch.html?show=` | `#/watch/:slug` | pushed Watch screen |
| My List | `list.html` | `#/list` | My List tab |
| More | sidebar “You” + More page | `#/more` | More tab |
| Account | `account.html?tab=` | `#/account/:tab` | pushed Account |
| Consent | sheet over any page | `#/consent` | modal |
| Sign in | sheet / account | `#/sign-in` | modal |
| Legal | `legal.html` | `#/legal` | pushed screen |
| Privacy | `privacy.html` | `#/privacy` | pushed screen |
| Not found | `404.html` | `#/not-found` | in-stack screen |

- Same destinations, same labels, same empty/error copy.
- Native may use stack pushes, sheets, pull-to-refresh, and hardware back; it may not invent different destinations.
- Classic globals stay compatible: `player.js` and `watch.js` keep their public functions.

---

## 9. Layout stability and performance

- Reserve hero, rail, card, player, ad, and grid dimensions before data arrives.
- Images use `aspect-ratio: 16 / 9` and explicit width/height.
- Fonts: system sans first; no layout-shifting web-font swap.
- LCP target: the hero art or first rail art, not the page shell.
- CLS target: 0 for shell, rails, and player.
- No layout reads in scroll handlers; rails use CSS scroll-snap.
- Defer non-critical rails below the fold; keep Continue Watching and the first rail eager.
- No video preload on Watch until Play/Resume; poster only.
- The five-minute readahead cache is unchanged.

---

## 10. Acceptance criteria

Each page ships only when:

- One `<h1>`, ordered headings, and the shell landmarks are present.
- Keyboard reaches every control; focus is visible in both themes and on media.
- Skip link works; focus moves to the page heading on route change.
- Back restores origin scroll, query, and focus.
- 320px width has no horizontal scroll; 200% zoom does not clip.
- Touch targets are ≥44px; pointer targets are ≥24px.
- Empty, loading, error, offline, and not-found states exist and are reachable.
- No ad appears on Watch, Continue Watching, episode rows, or Kids.
- No glow, card lift, zoom, parallax, or auto-advance.
- The Watch entry rule holds: explicit Resume auto-plays; everything else opens paused.
- Classic, React, and native use the same destination names and state copy.

---

## 11. Gate — approved

**Outcome:** Approved and locked as `v7.0` on 2026-11-07. Page frames, responsive composition, and state pages are final.

| # | Decision | Locked value |
|---|---|---|
| 1 | **Shell** | Sticky header, fixed sidebar at `md+`, bottom tab bar below `md`, single page scroll |
| 2 | **Grid** | 1/2/3/4/5–6 columns; 220–240px card minimum; 16:9 stills |
| 3 | **Home** | Editorial hero, Continue Watching first, 8–15 rails, omit empty rails |
| 4 | **Browse** | Real section destinations, URL-addressable filters, 48-item pages |
| 5 | **Search** | Full-screen on mobile, autofocus from tab, local history by default |
| 6 | **Watch** | Player first, 320px episodes aside at `lg+`, stacked below; no ads |
| 7 | **My List** | Continue Watching + saved grid; no ads; labelled remove |
| 8 | **More / Account** | Grouped destinations; four account tabs; no Kids access |
| 9 | **Consent** | Non-blocking sheet; essential required; optional off |
| 10 | **Legal / Privacy** | 66ch reading measure, sticky TOC on desktop, offline readable |
| 11 | **States** | Loading, empty, error, offline, not-found, Kids block shells in §6 |
| 12 | **Parity** | Same destinations and copy across classic, React, native |
| 13 | **Stability** | Reserved dimensions, CLS 0 for shell/rails/player, no preload before Play |

**Next:** Phase 8 — motion and interaction choreography (page transitions, rail scroll, sheet enter/exit, player control fade, reduced motion).

---

## 12. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First page-layout draft: app shell, landmarks, breakpoints, grid, header, Home, Browse, Search, Watch, My List, More, Account, Consent, Legal/Privacy/About, not found, state pages, responsive matrix, cross-surface parity, stability, acceptance criteria, thirteen gate decisions. |
| `v7.0` | 2026-11-07 | Approved and locked. Watch player is explicitly not sticky; hero media is a still with no autoplay; reduced motion swaps the hero instantly. |
