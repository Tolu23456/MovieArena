# Phase 3 — Information Architecture & User Flows

**Status:** Locked `v3.0` — gate approved (see §15 change log)
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 1 Brief `v1.1`, Phase 2 Strategy `v2.0`
**Evidence basis:** verified routes and screens in the working tree (`index.html`, `watch.html`, `list.html`, `about.html`, `legal.html`, `common.js`, `watch.js`, `player.js`, `apps/web/src/App.jsx`, `apps/mobile/App.jsx`, mobile screens). Personas remain assumption-based; no user testing or statistics are claimed.

---

## 1. IA intent

Six rules drive every decision below.

1. **Playback over promotion.** Any title is at most one deliberate action from playing; no account, consent, ad, or promo may sit between a title and its player.
2. **Value before account.** Guest mode is complete. Sign-in is offered where it adds value (sync, profiles, cross-device resume), never as a gate.
3. **Consent before collection.** Essential storage only until an explicit choice. Analytics and personalised ads are off by default and revocable.
4. **One system, three surfaces.** Web classic, web React, and native share the same names, order, and state language even when the chrome differs.
5. **Curation over volume.** Editorial hero, human rails, and a finite set of browse sections; search is the escape hatch, not the front door.
6. **Trust by default.** Ads are labelled and placed away from controls; legal/privacy copy matches what the code actually does.

---

## 2. Surface model

| ID | Surface | Runtime | Chrome | Primary input |
|---|---|---|---|---|
| **S1** | Web classic | Static HTML + classic scripts | Header + collapsible sidebar on desktop; bottom tabs on narrow screens | Mouse, keyboard, touch |
| **S2** | Web React | `apps/web` (hash routing) | Same topology as S1; shares design tokens | Mouse, keyboard, touch |
| **S3** | Native | Expo / React Native | 5 bottom tabs; stack for Watch; sheets for sign-in/consent | Touch, hardware back, OS share |

S1 and S2 are **parity surfaces**: same routes conceptually, same screen names, same empty/error copy. S3 may present the same screens with native patterns (sheets, stack pushes, pull-to-refresh), but must not invent different destinations.

---

## 3. App map

```
MovieArena
├── Home                         /  ·  #/  ·  tab Home
│   ├── Hero (editorial, rotating)
│   ├── Continue Watching        (hidden until there is progress)
│   ├── Top 10 this week
│   ├── Popular now
│   ├── New arrivals
│   ├── Films
│   ├── Dubs
│   └── Catalog grid + section chips + sort
├── Browse                       /?section=…  ·  #/browse/:section  ·  tab Browse
│   ├── TV Shows
│   ├── Movies
│   ├── Animation (anime + donghua)
│   └── Most Watched
├── Search                       header omnibox  ·  #/search?q=  ·  tab Search
│   ├── Results (titles)
│   ├── Recent queries (device-local)
│   └── Hints / hot words
├── Watch (title + player)       /watch.html?show=&ep=&lang=&t=  ·  #/watch/:slug  ·  stack screen
│   ├── Player
│   ├── Title meta + actions
│   ├── Synopsis / source note
│   ├── Episodes + filters
│   └── Related rail
├── My List                      /list.html  ·  #/list  ·  tab My List
│   ├── Continue Watching (when present)
│   └── Saved titles
├── Account                      /account.html?tab=…  ·  #/account/:tab  ·  pushed screen
│   ├── Overview (profile, sync status, sign out)
│   ├── Profiles (up to 4, optional kids profile)
│   ├── Privacy & data (consent, export, deletion)
│   └── Devices & sessions
├── More                         tab More (native / narrow web)
│   ├── Profile switcher
│   ├── Account & sync
│   ├── Playback settings
│   ├── Privacy choices
│   ├── About
│   ├── Legal
│   └── Privacy notice
├── Consent                      sheet over any surface  ·  #/consent  ·  native modal
├── Sign in                      sheet over any surface  ·  #/sign-in  ·  native modal
└── System
    ├── Not found / bad slug
    ├── Offline / catalog unavailable
    ├── Stream unavailable
    └── Kids mode (restricted home, no ads, no account management)
```

**No separate detail page.** `Watch` is the detail page: synopsis, metadata, source note, actions, episodes, and related titles live around the player. This protects find → play speed and matches the current classic and React implementations.

---

## 4. Navigation specification

### 4.1 Web desktop (S1 + S2)

- **Persistent left sidebar** (collapsible): brand, search entry, then groups:
  - **Browse:** Home · TV Shows · Movies · Animation · Most Watched
  - **Library:** My List · Continue Watching (when progress exists)
  - **You:** Account · Profiles
  - **Info:** About · Legal · Privacy
- **Header:** brand (small screens), search omnibox, theme toggle, profile avatar/menu.
- **Active state:** current section; on Watch, Home remains active but the originating section is remembered for the Back action.
- **Collapse state:** persists per device (`ma.navCollapsed`).
- **Keyboard:** skip link → header search → sidebar; focus ring on every target; `/` focuses search.

### 4.2 Web narrow / phone browser (S1 + S2)

Five bottom tabs, matching the approved model:

`Home · Browse · Search · My List · More`

- **Home:** hero, Continue Watching, rails, grid.
- **Browse:** section chooser (TV, Movies, Animation, Most Watched) — a real destination, not a scroll jump.
- **Search:** full-screen search with autofocus and recent queries.
- **My List:** Continue Watching + saved.
- **More:** profile, account, playback settings, privacy, about, legal, privacy notice, app info.
- Header keeps brand, search shortcut, and profile avatar.
- Sidebar collapses into More; no duplicated destinations.

### 4.3 Native (S3)

Same five tabs, same order, same labels. SVG icon set replaces the current text glyphs.

- Tab state and per-tab scroll position persist across app restarts.
- **Watch** is pushed onto the current tab's stack; hardware back returns to the exact origin (search query, section, or list position) with state intact.
- **Sign in** and **Consent** are modal sheets; **Account**, **Profiles**, **Privacy & data** are full-screen pushes.
- **Kids profile:** simplified Home (no account settings, no ads, no external links except allow-listed sources), persistent “Kids” badge, exit requires the profile PIN if one is set.

### 4.4 Cross-surface rules

| Rule | Behaviour |
|---|---|
| Back from Watch | Return to origin surface with query/scroll preserved |
| Back from Account subpage | Previous account tab, then origin |
| Deep link to Watch | Resolve slug; if unknown → Not found with search field |
| Deep link to a restricted title in Kids | Block with “Ask a grown-up” screen; no autoplay |
| Profile switch | Save outgoing progress first, then reload the new profile's state |
| Sign-out | Local progress stays; account-linked data stops syncing; UI returns to guest |
| Tab re-tap | Scroll current tab to top; second tap refreshes catalog |
| Search submit | Creates a history entry; back returns to results, not an empty field |

---

## 5. URL & deep-link map

### 5.1 Canonical routes

| Screen | Classic (S1) | React (S2) | Native (S3) | Notes |
|---|---|---|---|---|
| Home | `/` | `#/` | tab `home` | Default route |
| Browse section | `/?section=tv\|movies\|animation\|watched` | `#/browse/:section` | tab `browse` + section | Unknown section → Home |
| Search | `/?q=` or omnibox | `#/search?q=` | tab `search` | Empty `q` = recent/hot words |
| Watch | `/watch.html?show=:slug&ep=&lang=&t=` | `#/watch/:slug?ep=&lang=&t=` | `moviearena://watch/:slug?…` | `t` = start offset seconds |
| My List | `/list.html` | `#/list` | tab `list` | Includes Continue Watching |
| Account | `/account.html?tab=overview\|profiles\|privacy\|data` | `#/account/:tab` | push `account/:tab` | Default `overview` |
| Consent | any page + `?consent=manage` | `#/consent` | modal | Re-openable from More |
| Sign in | `/account.html?signin=1` | `#/sign-in` | modal | Optional entry |
| About | `/about.html` | `#/about` | More → push WebView? | Prefer native copy screen |
| Legal | `/legal.html` | `#/legal` | More → push WebView | Must be readable offline |
| Privacy | `/privacy.html` **(new)** | `#/privacy` | More → push WebView | Split from Legal |
| Not found | `/404.html` fallback | `#/not-found` | in-stack screen | Offers search + Home |

### 5.2 Canonicalisation

- `show`/slug is required for Watch. Missing → Home (never a blank player).
- `ep` is clamped to the available episode range; invalid values fall back to the saved episode, then episode 1.
- `lang` falls back to the first available language; the resolved value is written back to the URL.
- `t` applies only to the linked episode and is dropped when the user changes episode.
- Trailing empty parameters are stripped with `history.replaceState` (classic already does this).
- React hash routes mirror classic semantics so a shared link can be translated both ways.
- Native universal links are a later addition; the custom scheme is canonical for now.

### 5.3 Migration map (current → target)

| Current | Target |
|---|---|
| React only `#/watch/:slug` | Add `#/`, `#/browse/:section`, `#/search`, `#/list`, `#/account/:tab`, `#/about`, `#/legal`, `#/privacy` |
| React top nav: Home/About/Legal | Sidebar parity + 5-tab narrow layout |
| Mobile tabs: Home/Search/My List/More | Home/Browse/Search/My List/More |
| Mobile glyph tabs `⌂ ⌕ ♡ ⋯` | Shared SVG icon set |
| Classic 4-page nav | Add Account, Privacy, Continue destination |
| `legal.html` only | Split Legal (sources/copyright) and Privacy (data/consent/account) |

---

## 6. Content inventory

### 6.1 Catalog

- **1,210 shows**, **8,350 episodes**, **16 sources**.
- **764 Internet Archive films** + **1 NASA collection**.
- **38 curated registry entries** in `custom-links.js`, all resolving to official or public-domain playback.
- Source families: official YouTube channels, Internet Archive, NASA/Blender open licence, Mosfilm.

### 6.2 Content objects

| Object | Fields shown | Where |
|---|---|---|
| Show | title, slug, poster, source, language(s), episode count, tags, popularity, year | Home rails, Browse grid, Search, My List |
| Episode | number, title, language, duration, progress % | Watch episode list, Continue Watching |
| Playback source | provider, official/external flag, quality, audio tracks, subtitles | Player, source note, unavailable state |
| Progress record | show, episode, position, duration, updated-at, profile | Continue Watching, episode badges |
| List entry | show, added-at, profile | My List |
| Profile | name, avatar, kids flag, PIN state | Account, switcher, More |
| Consent record | purpose, granted/denied, version, timestamp | Consent sheet, Privacy & data |
| Ad slot | placement, label, contextual flag | Browse rails/grid, between episodes |

### 6.3 Editorial & utility content

- Rotating hero with kicker, title, synopsis, primary action, metadata.
- Continue Watching rail (up to 10; minutes remaining; actual film/episode title).
- Top 10, Popular, New, Films, Dubs rails.
- Hot search terms + genre/source chips + sort (Popular/Newest/A–Z).
- Search hints when no query; “no results” suggestions.
- Source note and rights explanation on Watch.
- Legal, Privacy, About, accessibility statement.
- System copy: empty, offline, stream unavailable, sign-in expired, consent saved, sync conflict.

### 6.4 Ads inventory (by placement)

| Placement | Format | Rules |
|---|---|---|
| Browse rails / grid | Fixed labelled card slot | Reserved height, no layout shift; never inside Continue Watching |
| Between episodes | Short slate before next episode | Never before the first play; never on archive films; always dismissible/skippable |
| Watch page | **No** display ads around the player | Player controls and episode list stay clear |
| Kids profile | **None** | Hard rule |

---

## 7. Core flows

Each flow lists the happy path plus error, empty, and interruption paths.

### Flow A — Find → Play

**Goal:** from intent to moving picture in the fewest deliberate actions.

1. Entry: Home search, Search tab, sidebar search, or a shared/deep link.
2. Type a query; results appear with title, source, episode count, and a clear playable/external badge.
3. Select a result → **Watch opens paused** at the saved position (or at 0) with a visible `Resume 12:34` / `Play` control.
4. Press Play (or Resume) → player starts; controls fade; progress saves.
5. Back returns to the search results with query and scroll intact.

**Empty:** no matches → show “No titles for ‘…’” + hot words + browse sections; never a dead end.
**Error:** catalog API fails → retry button; if a cached catalog exists, show it with an “offline catalog” note.
**Bad link:** unknown slug → Not found screen with the failed slug and a search field.
**Unavailable:** embed blocked or file 404 → try the next official source; offer “Open on source ↗” with an external-link disclosure; never spin forever.
**Interruption:** sign-in or consent prompts never block playback; they appear as dismissible sheets after the action, not before it.

> **Gate default:** browse/search/card/deep-link entries open **paused**. Only an explicit Continue Watching/Resume action auto-plays.

### Flow B — Discovery & browsing

1. Home hero rotates editorially; primary action opens Watch.
2. Continue Watching appears first when progress exists; otherwise the hero and Top 10 lead.
3. Rails are horizontally scrollable with keyboard support; “See all” opens the matching Browse section.
4. Browse section → chips + sort + grid; infinite/“Load more” reveals the rest.
5. Card → Watch paused; hover/focus reveals save + play affordances.

**Empty:** a rail with no eligible titles is omitted, not shown empty.
**Loading:** poster skeletons at the final card size; no layout shift.
**Error:** catalog unavailable → full-page retry with cached content when possible.
**Ads:** labelled slots only in browse rails/grid; reserved height; never in Continue Watching.
**Reduced motion:** hero cross-fade becomes an instant swap; rails scroll without smooth animation.

### Flow C — Watch, resume & next episode

1. Watch opens paused; player shows poster, title, and a single primary Play/Resume control.
2. Playing: custom controls (play, seek, volume, captions, quality, speed, audio, PiP/fullscreen, stats), keyboard shortcuts, wake lock.
3. Resume: saved position restored with a non-blocking “Resumed from 12:34” toast and a “Start over” action.
4. Episodes: search/filter, per-episode progress badges, language switch, pagination.
5. Near the end: “Up next in 8s” countdown with **Cancel** and **Play now**; autoplay-next respects the user setting.
6. Episode/lang changes update the URL so the address bar always names what is playing.
7. Leaving saves progress; the outgoing profile's state is committed before a profile switch.

**Stream error:** retry current source → fall back to direct/relay → next official source → clear error with “Open on source”.
**HLS error:** native `<video>` fallback when supported; otherwise explain and offer the official player.
**Offline:** keep the page shell and cached metadata; explain that playback needs a connection; do not lose progress.
**Archive film:** no pre-roll; inter-episode slate does not apply.
**Kids profile:** blocked titles show a calm “Not available in Kids” screen; no external links out.

### Flow D — Account, sync & profiles

1. Guest uses the product fully; progress and My List stay on the device.
2. A “Save your progress across devices” card appears in More and under Continue Watching — dismissible, never modal.
3. Sign in sheet: magic link (default), Google/Apple, or optional password. Email verification states are explicit.
4. First sign-in offers to **merge this device's progress and list** into the account; a summary shows what will merge.
5. Account page:
   - Overview: current profile, sync status, last synced, sign out.
   - Profiles: up to 4; create/rename/delete; optional kids profile + PIN.
   - Privacy & data: consent history, export, delete data, delete account.
   - Devices & sessions: revoke individual sessions.
6. Profile switch from header/More: save outgoing progress, load incoming profile, return to the same screen where possible.

**Merge conflict:** newest `updated-at` wins for progress; favourites are unioned; a short “What changed” summary is shown.
**Token expiry:** silent refresh; on failure, switch to guest with a non-blocking “Session expired — sign in again” banner. Local playback continues.
**Offline:** sign-in unavailable with a clear message; guest mode unaffected.
**Delete:** re-authentication required; local data cleared immediately; server deletion follows the published retention window; export is offered first.
**Kids exit:** PIN required if set; otherwise a confirm step.

### Flow E — Consent, privacy & data controls

1. First run: a **non-blocking** “Privacy choices” sheet/banner, not a playback gate.
2. Default = **Essential only**: local progress, list, theme, and playback settings.
3. Optional purposes: analytics (opt-in), personalised ads (opt-in). Contextual ads may appear without profiling.
4. Every choice is recorded with purpose, version, and timestamp; the UI reflects the current state.
5. More → Privacy choices re-opens the sheet at any time; withdrawal takes effect immediately.
6. Privacy & data (signed in): download export, delete analytics data, delete account, view consent history.
7. Legal and Privacy pages are rewritten to match accounts, ads, telemetry, and retention. `legal.html`'s current “no user database and no analytics” claim is removed.

**Consent write fails:** keep the previous state, tell the user, retry; do not begin collection.
**Offline:** store the choice locally with a timestamp; sync when online; no analytics sent before a server-side consent record exists.
**Withdrawal:** stop collection immediately; UI removes personalised placements; deletion/export paths remain available.
**Kids profile:** analytics and personalised ads forced off; consent UI is not reachable from Kids mode.

---

## 8. Edge-case & state matrix

| # | Situation | Expected experience | Recovery |
|---|---|---|---|
| 1 | Catalog API down | Cached catalog if present; otherwise retry screen | Retry; Home/More remain reachable |
| 2 | Empty catalog | “Catalog is being refreshed” + retry | Auto-retry with backoff |
| 3 | Search no results | Suggestions + hot words + Browse links | Edit query / clear |
| 4 | Unknown slug | Not found screen with search | Search / Home |
| 5 | Missing episode number | Clamp to saved episode, then EP 1 | URL normalized |
| 6 | Unknown language | First available language | URL normalized |
| 7 | Embed blocked | Try next official source | “Open on source ↗” |
| 8 | Direct file / relay error | Retry URL once, then next source | Manual retry |
| 9 | HLS unsupported | Native fallback where possible | Official player link |
| 10 | Stale resume position | Clamp to duration − 5 s; offer Start over | Start over |
| 11 | Profile switch mid-play | Save outgoing progress, then reload | Return to same screen |
| 12 | Kids tries restricted title | Calm block screen | Switch profile with PIN |
| 13 | Session expired | Guest mode + banner | Re-sign-in |
| 14 | Sync conflict | Newest wins; union favourites; summary | Review in Account |
| 15 | Offline during playback | Shell + message; no data loss | Reconnect and retry |
| 16 | Ad blocker | Content and playback unaffected; no nag | — |
| 17 | Consent storage unavailable | Essential-only; explain limitation | Retry save |
| 18 | Reduced motion | No parallax/auto-cross-fade; instant transitions | — |
| 19 | Keyboard only | Visible focus, skip link, Esc closes sheets, focus returns | — |
| 20 | Screen reader | Landmarks, live regions for search/up-next/toasts, labelled controls | — |
| 21 | Slow network | Skeletons; poster LQIP/blur; player spinner with cancel | Lower quality manually |
| 22 | Background/foreground | Progress saved; playback pauses or continues per platform | Resume control |
| 23 | Deep link into signed-in-only area | Sign-in sheet, then continue to intended destination | Cancel returns to guest origin |

---

## 9. Screen inventory

| ID | Screen | S1 | S2 | S3 | Primary job |
|---|---|---|---|---|---|
| H1 | Home | ✓ | ✓ | ✓ | Orient, resume, discover |
| B1 | Browse section | ✓ | ✓ | ✓ | Narrow the catalog |
| S1 | Search results | ✓ | ✓ | ✓ | Find a known title |
| W1 | Watch / title | ✓ | ✓ | ✓ | Play and continue |
| L1 | My List | ✓ | ✓ | ✓ | Return to saved titles |
| C1 | Continue Watching | rail | rail | rail + List header | Resume fast |
| A1 | Account overview | ✓ | ✓ | ✓ | Manage identity/sync |
| A2 | Profiles | ✓ | ✓ | ✓ | Switch/create profiles |
| A3 | Privacy & data | ✓ | ✓ | ✓ | Consent/export/delete |
| A4 | Devices & sessions | ✓ | ✓ | ✓ | Revoke access |
| M1 | More | narrow only | narrow only | ✓ | Settings + info hub |
| O1 | Consent sheet | ✓ | ✓ | ✓ | Choose purposes |
| O2 | Sign-in sheet | ✓ | ✓ | ✓ | Authenticate in context |
| P1 | Profile switcher | header menu | header menu | sheet | Change identity |
| K1 | Kids home | ✓ | ✓ | ✓ | Safe, ad-free catalog |
| E1 | Not found | ✓ | ✓ | ✓ | Recover to search |
| E2 | Offline / catalog error | ✓ | ✓ | ✓ | Explain + retry |
| E3 | Stream unavailable | ✓ | ✓ | ✓ | Alternate source |

---

## 10. Screen-state matrix

| Screen | Loading | Empty | Error | Offline | Signed out | Signed in | Kids |
|---|---|---|---|---|---|---|---|
| Home | Skeletons | Hero + Browse fallback | Retry + cached | Cached + note | Guest rails | Continue + profile rails | Simplified, no ads |
| Browse | Grid skeletons | “Nothing in this section” | Retry | Cached + note | Same | Same | Filtered catalog |
| Search | Inline spinner | Hot words/recent | Retry | Recent only + note | Same | Recent + synced? (local only) | Filtered results |
| Watch | Player poster skeleton | No episodes → source note | Source fallback + error | Shell + message | Saves locally | Saves + syncs | Restricted titles blocked |
| My List | Skeletons | Empty state + Browse CTA | Local retry | Local list works | Device list | Synced list | Device/child list |
| Account | Spinner | Guest explainer | Retry | Offline message | Sign-in entry | Management | Hidden |
| More | — | — | — | Local info works | Sign-in card | Profile card | Reduced set |
| Consent | — | — | Save error | Local queue | Same | Same | Hidden |

---

## 11. Low-fidelity wireframes

### 11.1 Home — desktop web

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ MovieArena        [ Search titles, people, genres…            ]   ◐  (avatar) │
├────────────┬─────────────────────────────────────────────────────────────────┤
│  BROWSE    │  HERO                                                           │
│  Home      │  KICKER · year · source                                         │
│  TV Shows  │  Title                                                          │
│  Movies    │  One-line synopsis…                                             │
│  Animation │  [ Resume 12:34 ]  [ + My List ]        metadata               │
│  Most Wat. │                                                                 │
│  LIBRARY   │  Continue Watching                            See all →         │
│  My List   │  [poster+12m left] [poster] [poster] [poster]                   │
│  Continue  │                                                                 │
│  YOU       │  Top 10 this week                                               │
│  Account   │  [1] [2] [3] [4] [5] …                                          │
│  Profiles  │                                                                 │
│  INFO      │  Popular now                          See all →                 │
│  About     │  [poster] [poster] [poster] [poster] [poster]                   │
│  Legal     │                                                                 │
│  Privacy   │  Hot search: …   [chips]        Sort [Popular ▾]                │
│            │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                     │
│            │  │    │ │    │ │    │ │    │ │    │ │    │                     │
│            │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                     │
└────────────┴─────────────────────────────────────────────────────────────────┘
```

### 11.2 Home — phone web / native

```
┌──────────────────────────────┐
│ MovieArena            ◐      │
│ [ Search titles…          ]  │
│                              │
│  HERO                        │
│  KICKER · year · source      │
│  Title                       │
│  [ Resume 12:34 ]  [ ♡ ]     │
│                              │
│  Continue Watching   See all │
│  [ 12m left ] [ poster ] [ ] │
│                              │
│  Top 10 this week            │
│  [1] [2] [3] [4] [5]         │
│                              │
│  Popular now                 │
│  [ poster ] [ poster ] [ ]   │
│                              │
│  [chips]        Sort [Pop ▾] │
│  ┌──────┐ ┌──────┐           │
│  │      │ │      │           │
│  └──────┘ └──────┘           │
├──────────────────────────────┤
│  ⌂       ▦       ⌕      ♡    ⋯│
│ Home   Browse  Search  List  More │
└──────────────────────────────┘
```

### 11.3 Watch — desktop web

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ MovieArena        [ Search… ]                                  ◐  (avatar)    │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐  EPISODES  [search / #ep]   │
│ │                                              │  ┌─────────────────────────┐ │
│ │            ▶  (paused poster)                │  │ EP 1 · 24m      12% ▓▓  │ │
│ │                                              │  ├─────────────────────────┤ │
│ │  [ ▶ Play / Resume 12:34 ]                   │  │ EP 2 · 24m       0%     │ │
│ └──────────────────────────────────────────────┘  ├─────────────────────────┤ │
│  Title                              [+ My List]   │ EP 3 · 24m       0%     │ │
│  year · source · lang · episodes                   └─────────────────────────┘ │
│  Synopsis…                                         [1] [2] [3] …             │
│  meta chips                                                        │
│                                                                    │
│  Related                                                           │
│  [poster] [poster] [poster] [poster]                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 11.4 Watch — phone / native

```
┌──────────────────────────────┐
│ ←  Title                     │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │        ▶ (paused)        │ │
│ │                          │ │
│ │  [ ▶ Resume 12:34 ]      │ │
│ └──────────────────────────┘ │
│  Title              [ ♡ ]   │
│  year · source · 24 eps     │
│  Synopsis…                  │
│  [ Up next ▾ ]              │
│  EP 1 · 24m          12%    │
│  EP 2 · 24m           0%    │
│  EP 3 · 24m           0%    │
└──────────────────────────────┘
```

### 11.5 More / Account hub — native

```
┌──────────────────────────────┐
│  More                        │
│ ┌──────────────────────────┐ │
│ │  ◐  Guest                 │ │
│ │  Save progress & list →   │ │
│ └──────────────────────────┘ │
│  Continue Watching        →  │
│  Account & sync           →  │
│  Profiles                 →  │
│  Playback settings        →  │
│  Privacy choices          →  │
│  ─────────────────────────  │
│  About                    →  │
│  Legal                    →  │
│  Privacy notice           →  │
│  App version · sources       │
├──────────────────────────────┤
│  ⌂      ▦      ⌕      ♡    ⋯ │
└──────────────────────────────┘
```

### 11.6 Consent sheet — phone / native

```
┌──────────────────────────────┐
│  Privacy choices          ✕  │
│                              │
│  Essential storage is on to  │
│  remember your place and     │
│  list. Optional uses are off │
│  unless you choose them.     │
│                              │
│  ● Essential only   (default)│
│  ○ Allow analytics           │
│  ○ Personalise ads           │
│                              │
│  Manage per purpose ▾        │
│                              │
│  [ Save choices ]            │
│  Read privacy notice         │
└──────────────────────────────┘
```

---

## 12. Navigation & content rules checklist

- [ ] Every screen reachable in ≤ 2 actions from a tab.
- [ ] No destination exists only in a footer or only in a sidebar.
- [ ] Watch is always one action from any title card.
- [ ] Account, consent, and ads never gate the first play.
- [ ] Every empty state offers a next action.
- [ ] Every deep link resolves to a valid screen or a recovery screen.
- [ ] Back restores the previous context (query, scroll, tab).
- [ ] Phone and desktop share labels and order.
- [ ] Native back and web history behave the same way.
- [ ] Kids mode has no ads, no account settings, and no external escape.

---

## 13. Gate — five defaults to approve

| # | Decision | Default | Why |
|---|---|---|---|
| 1 | **Watch entry** | Browse/search/card/deep-link entries open **paused**; only Continue/Resume auto-plays | Predictable audio, accessibility, no surprise autoplay; still one tap to play |
| 2 | **Title detail** | **Watch is the detail page**; no separate title route | Fastest find → play; matches current classic/React structure |
| 3 | **Auth shape** | **Hybrid:** in-context sign-in sheet + full Account page for profiles/privacy/data | Sign-in never loses your place; privacy actions remain deep-linkable |
| 4 | **First-run consent** | **Non-blocking, essential-only default**; analytics/personalised ads opt-in | Consent before collection without holding playback hostage |
| 5 | **Kids ads** | **No ads at all in Kids profiles**; contextual ads elsewhere by default | Trust by default; simplest rule to explain and enforce |

**On approval:** lock this document as `v3.0`, record the decisions in the change log, and proceed to Phase 4 (three visual directions on the same Home/Watch/Consent reference samples).

## 14. Open questions (not gating)

- Exact retention/deletion window for account data (needs policy sign-off before Privacy copy is final).
- Whether search should return episode-level matches in the first release or title-level only.
- Whether Continue Watching deserves a dedicated route or remains a rail + My List header.
- Native universal links vs custom scheme only for the first account release.

---

## 15. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First IA draft: surface model, app map, nav spec, URL map, content inventory, flows A–E, state matrices, wireframes, five gate defaults. |
| `v3.0` | 2026-11-07 | Gate approved. All five defaults locked: paused Watch entry, Watch-as-detail, hybrid auth, non-blocking essential-only consent, no ads in Kids. Status moved from draft to locked. Next: Phase 4 visual directions. |

