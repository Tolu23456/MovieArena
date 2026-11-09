# Phase 4 — Visual Directions

**Status:** Locked `v4.0` — gate approved: Direction C · Quiet Premium (see §8)
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 1 Brief `v1.1`, Phase 2 Strategy `v2.0`, Phase 3 IA `v3.0`
**Reference samples:** Home hero · Watch screen · Account & Consent sheet
**Visual preview:** `/docs/design/phase-4-preview.html` (open on the running server)

> Evidence rule for this document: every claim about a reference site is labelled **Verified** (seen in fetched markup or a named write-up) or **General observation** (industry pattern, not pixel-verified). No user research, statistics, or testing results are invented. Personas remain assumption-based.

---

## 1. Reference teardown

### 1.1 What each reference actually gave us

| Source | Evidence grade | Verified pattern | What we borrow | What we adapt or reject |
|---|---|---|---|---|
| **MovieBox** (`themoviebox.xyz`) | **Verified** navigation only; web body is client-rendered | Top nav: Home, TV show, Movie, Midnight, Animation, Most Watched, Apps, Games, Old Moviebox. Plain wordmark, compact search icon, app-download prompt. | Plain wordmark; small, dense nav groups; a separate "Most Watched" destination. | **Reject** `Midnight` (adult-adjacent rail), `Apps`/`Games`/store clutter, and the download-first prompt. Keep the product about watching, not installing. |
| **Netflix** | **Verified** landing page; app patterns are **general observation** | Landing: value-prop hero, Trending Now ranked 1–10, feature blocks, FAQ, repeated email CTA. | Ranked Top 10; Continue Watching pinned first; content-first hero; restrained card chrome. | **Reject** the marketing-page funnel as a product surface. We do not put a sign-up form between a visitor and the catalog. |
| **Prime Video** | **Verified** top nav + rails; per-card badge semantics **general observation** | Dual navigation (top categories + left rail), full-bleed hero carousel, numbered Top 10, "Recently added", genre rails, card state badges (`TRENDING`, `NEW MOVIE`, `NEW SERIES`, `NEW EPISODE`). | Dual-zone chrome on wide screens; semantic badges; "Recently added" rail. | **Adapt** badges: only three states — `FREE`, `NEW`, `DUB` — and never two badges that mean the same thing. **Reject** promo badges that imitate editorial fact. |
| **Disney+** | **Geo-blocked**; only footer/privacy links verified | Footer information architecture: subscriber agreement, privacy, children's privacy, closed captioning, interest-based ads. | Legal/privacy link completeness; a dedicated children's-privacy entry point. | Nothing visual can be claimed. Use only as an IA reminder. |
| **Tubi** | **Geo-blocked** | Nothing visual verified. | Free, ad-supported positioning is the closest business analogue. | No UI claims. |
| **Plex** | **Verified** destinations | Four destinations: Home, Live TV, On Demand, Discover; plus My Media, My Lists, search, sign-in. | Clear destination split; sign-in visible but not gating; "My Lists" as a first-class tab. | **Reject** four top-level content types for launch. We have one catalog; extra destinations would fragment find → play. |
| **Crunchyroll** | Site returned no content; **third-party 2025 app-refresh concept** used as **general observation** | Concept study: top user menu, category menu on Home, timed hero, bottom nav (Home/Search/My Lists/Games/Store), Continue Watching/My Watchlist/Top 10, regrouped player controls, recent/predictive/categorised search. | Player control grouping; search recents + predictive results; Continue Watching + watchlist first. | **Reject** `Games` and `Store` tabs. **Reject** timed hero autoplay when reduced motion is on or the tab is hidden. |
| **Industry UX guidance** (Fora Soft, Oct 2026) | **Verified** article content | 4–5 primary tabs max; Continue Watching first; 8–15 rails; 3-tap browse-to-watch; captions/language persistence; WCAG 2.2 AA; TTFF < 2 s, rebuffer < 1 %, start failure < 1.5 %, INP < 200 ms; no dark patterns. | All of it, as constraints rather than decoration. | Nothing to reject; treat the performance and accessibility numbers as budgets, not aspirations. |

### 1.2 Patterns we explicitly reject

These are piracy-site or growth-hack patterns. They do not enter any direction.

1. **Unlicensed catalog as a selling point.** We show official channels and public-domain archives only.
2. **Download-first / "save offline" pressure** on a web surface that cannot legally or reliably do it.
3. **Aggressive app-install interstitials** before playback.
4. **Adult-adjacent rails** ("Midnight") and unlabelled mature content.
5. **Games / store / gambling side-doors** that compete with watching.
6. **Autoplay with sound** on browse surfaces; only explicit Resume/Continue auto-plays.
7. **Fake urgency, fake view counts, fake "trending"** labels.
8. **Consent walls and pre-checked marketing toggles.**
9. **Ads inside the player controls, episode list, or Continue Watching.**
10. **Infinite hero carousels** that move while the user is reading.

### 1.3 What survives from the teardown

- **One job per surface:** Home orients and resumes; Browse narrows; Watch plays; My List returns; More holds settings and trust.
- **Continue Watching is the first rail** whenever progress exists.
- **Ranked Top 10** is a strong, honest discovery device; keep the numeral, drop the hype copy.
- **Badges are facts, not promotions.** Maximum two per card.
- **Search is an escape hatch, not the front door.** Recents and predictive results, no dead ends.
- **Trust is visible:** source note, rights language, consent state, and ad labels are part of the design, not footer debris.

---

## 2. Constraints shared by all three directions

| Constraint | Rule |
|---|---|
| Accent hue | Locked to `#ff5c47` → `#ff8a3d`. Companion neutrals, text inks, and focus colours are tuned per direction and per theme. |
| Themes | Dark and light are both first-class. System preference sets the default; manual override persists per device. Light is designed, not inverted. |
| Contrast | Body and UI text ≥ 4.5:1; large text ≥ 3:1; focus indicators ≥ 3:1 against adjacent colours. No state conveyed by colour alone. |
| Primary button ink | **Dark ink on the accent fill**, not white. White on `#ff5c47` is 3.06:1 and on `#ff8a3d` is 2.35:1; dark ink is 6.36:1 / 8.28:1. |
| Source art | Catalog art is 16:9 YouTube thumbnails and Archive stills. Keep a 16:9 still system; never force a 2:3 crop that decapitates frames. |
| Motion | Respect `prefers-reduced-motion`. No autoplaying hero motion while reading. Motion explains state; it does not entertain. |
| Density | Rails 8–15 at most on Home; 4–5 primary tabs; any title reachable in ≤ 3 deliberate actions. |
| Performance | No decorative webfont download on first paint. System stacks first; optional display face only if it can be subset and cached. |
| Parity | Every token has a classic CSS, React, and native equivalent. Names match across surfaces. |

---

## 3. Direction A — Cinema Editorial

**Thesis:** MovieArena is a repertory cinema, not a content feed. Warm near-black, printed-paper light mode, a serif voice for titles, and poster-first composition. The accent behaves like a marquee light: rare, warm, and purposeful.

### 3.1 Palette

**Dark — "Projection room"**

| Token | Value | Role | Contrast check |
|---|---|---|---|
| `--bg` | `#0d0b09` | Page | — |
| `--bg2` | `#15120f` | Inputs, wells | — |
| `--panel` | `#1a1613` | Cards, sheets | — |
| `--panel2` | `#221d18` | Raised rows, hover | — |
| `--line` | `#332c25` | Hairlines | — |
| `--text` | `#f2ece3` | Body | **16.73:1** on bg |
| `--muted` | `#b0a698` | Secondary | **8.19:1** on bg; **7.49:1** on panel |
| `--accent` | `#ff5c47` | Primary fill, focus source | **6.43:1** on bg (safe as text/icon) |
| `--accent2` | `#ff8a3d` | Gradient end, links | **8.38:1** with dark ink |
| `--accent-ink` | `#0d0b09` | Text on accent fill | **6.43:1** on accent; **8.38:1** on accent2 |
| `--focus` | `#ff8a3d` | Focus ring | ≥ 3:1 on all surfaces |
| `--gold` | `#d9b26a` | Rank numerals, archive accents | Decorative only |

**Light — "Reading room"**

| Token | Value | Role | Contrast check |
|---|---|---|---|
| `--bg` | `#f7f2ea` | Page | — |
| `--bg2` | `#efe7db` | Inputs, wells | — |
| `--panel` | `#fffaf2` | Cards, sheets | — |
| `--panel2` | `#f3ebdf` | Raised rows | — |
| `--line` | `#ddd2c2` | Hairlines | — |
| `--text` | `#1c1814` | Body | **15.83:1** on bg |
| `--muted` | `#6b6156` | Secondary | **5.43:1** on bg; **5.82:1** on panel |
| `--accent` | `#ff5c47` | Primary fill | Fill only; text must use `--accent-ink` |
| `--accent-ink` | `#1c1814` | Text on accent fill | **5.78:1** |
| `--accent-text` | `#b3301f` | Accent as text/icon | **5.61:1** on bg |
| `--focus` | `#b3301f` | Focus ring | ≥ 3:1 |

### 3.2 Typography

| Role | Spec |
|---|---|
| Display | `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif` · 600–700 · `clamp(2.4rem, 5vw, 4rem)` · line-height `1.0` · tracking `-0.02em` |
| Section title | Serif · 600 · `1.35rem` · sentence case |
| UI / body | `"Inter", "Segoe UI", system-ui, sans-serif` · 400–600 · `0.9rem` · line-height `1.55` |
| Kicker | UI · 700 · `0.68rem` · uppercase · tracking `0.16em` |
| Numerals | Tabular for episode/time; serif oldstyle only in editorial pull quotes (not in controls) |

### 3.3 Shape, spacing, elevation

- Radius: `4px` art, `6px` controls, `10px` sheets. Nothing pill-shaped except tags.
- Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
- Elevation: warm, low, diffuse — `0 18px 50px rgba(28, 16, 8, .45)`. No coloured glow on resting cards.
- Borders: 1px hairline is the primary separator; shadows are secondary.

### 3.4 Motion

- Standard: `220ms cubic-bezier(.22,.61,.36,1)`.
- Hero art crossfade: `500ms` opacity; no scale, no parallax.
- Card hover: `translateY(-2px)` + border warm-up. Image zoom capped at `1.03`.
- Reduced motion: instant swap, no transform, no crossfade.

### 3.5 Home hero

```
┌──────────────────────────────────────────────────────────────┐
│  KICKER · 1957 · PUBLIC DOMAIN                              │
│                                                              │
│  The Cranes Are Flying                     [16:9 still]      │
│  One line of editorial copy, two at most.                    │
│                                                              │
│  [ ▶ Resume 42:10 ]   [ + My List ]        1h 37m · CC       │
├──────────────────────────────────────────────────────────────┤
│  Continue Watching                              See all →    │
│  [still]      [still]      [still]      [still]              │
└──────────────────────────────────────────────────────────────┘
```

- Text sits on a warm scrim with a measured 7° gradient, not a black overlay.
- The serif title is the loudest element; the accent appears only in the kicker rule and primary button.
- Metadata is quiet: duration, year, source, captions — no fake popularity.
- Continue Watching uses the same still ratio as the catalog, so nothing jumps.

### 3.6 Watch

- Player frame has a 1px warm line and a `10px` radius; no glow around the video.
- Title is serif, `clamp(1.6rem, 3vw, 2.4rem)`; actions sit on one line to the right on desktop, below on phone.
- Episode rows read like a programme: number, title, duration, progress hairline. Progress is a thin gold-to-accent rule, not a badge shouting percentage.
- Source note is typeset like a colophon: small, calm, always visible.
- Paused state shows a single primary `Play` / `Resume 12:34`; no competing promo.

### 3.7 Account & Consent sheet

- Sheet on `--panel` with a serif `Account` heading and a readable measure (`≈ 62ch`).
- Profile row: avatar, name, "Kids · PIN on" as a plain fact.
- Consent uses three explicit rows with switches; the default state reads **Essential only**.
- Analytics and personalised ads are visibly off, with a one-line consequence sentence each.
- Destructive actions (delete data, delete account) are separated by a hairline and use text buttons, not accent fills.

### 3.8 Strengths / risks

- **Strengths:** distinctive without being loud; ideal for classic cinema and anime key art; light mode feels like paper, not a washed-out dark theme; excellent long-session comfort.
- **Risks:** serif can read "old" to anime-first users; requires disciplined hierarchy or it becomes stuffy; warm dark reduces the perceived punch of neon key art.
- **Mitigation:** serif only at display sizes; UI stays neutral sans; anime rails may use a slightly cooler panel tint without changing the system.

### 3.9 Native translation

- Same warm neutrals and serif display in large-title headers.
- Expo `NavigationBar` / status bar: dark warm background, light content.
- Sheets use native detents; consent rows map to `Switch` with the same labels.
- Haptics: light impact on Resume, success notification on consent save.

---

## 4. Direction B — Neon Arena

**Thesis:** Keep the current energy and make it intentional. Near-black blue, hard white type, orange-red gradients, ranked numerals, and sport-like rails. This is the "arena" in the name.

### 4.1 Palette

**Dark — "Arena floor"**

| Token | Value | Role | Contrast check |
|---|---|---|---|
| `--bg` | `#07080d` | Page | — |
| `--bg2` | `#0d0f17` | Inputs, wells | — |
| `--panel` | `#12141f` | Cards, sheets | — |
| `--panel2` | `#191d2b` | Raised rows | — |
| `--line` | `#2a2f45` | Hairlines | — |
| `--text` | `#f4f6ff` | Body | **18.55:1** on bg |
| `--muted` | `#a3aac4` | Secondary | **8.67:1** on bg; **7.95:1** on panel |
| `--accent` | `#ff5c47` | Fill, active rail | **6.36:1** with dark ink |
| `--accent2` | `#ff8a3d` | Gradient end, glow | **8.28:1** with dark ink |
| `--accent-ink` | `#0b0d13` | Text on accent | **6.36:1 / 8.28:1** |
| `--focus` | `#ffd166` | Focus ring | ≥ 3:1 on dark |
| `--ok` | `#7dffa1` | Live / available | Decorative only |

**Light — "Daylight arena"**

| Token | Value | Role | Contrast check |
|---|---|---|---|
| `--bg` | `#f4f6fb` | Page | — |
| `--bg2` | `#eaeef7` | Inputs, wells | — |
| `--panel` | `#ffffff` | Cards, sheets | — |
| `--panel2` | `#f1f4fa` | Raised rows | — |
| `--line` | `#d8deec` | Hairlines | — |
| `--text` | `#101320` | Body | **17.10:1** on bg |
| `--muted` | `#5a6178` | Secondary | **5.69:1** on bg; **6.15:1** on panel |
| `--accent` | `#ff5c47` | Fill | Fill only |
| `--accent-ink` | `#101320` | Text on accent | **6.05:1** |
| `--accent-text` | `#c0341f` | Accent as text | **5.18:1** on bg |
| `--focus` | `#c0341f` | Focus ring | ≥ 3:1 |

### 4.2 Typography

| Role | Spec |
|---|---|
| Display | `"Inter", "Segoe UI", system-ui, sans-serif` · 800–900 · `clamp(2rem, 4.6vw, 3.6rem)` · line-height `0.98` · tracking `-0.035em` |
| Section / rail title | UI · 800 · `0.78rem` · uppercase · tracking `0.12em` |
| UI / body | UI · 400–600 · `0.9rem` · line-height `1.5` |
| Labels | UI · 700 · `0.68rem` · uppercase · tracking `0.1em` |
| Numerals | Tabular, heavy, used as graphic rank elements |

### 4.3 Shape, spacing, elevation

- Radius: `10px` controls, `14px` cards, `18px` hero. Full pills for filters only.
- Spacing: `4 · 8 · 12 · 16 · 24 · 32 · 44`.
- Elevation: accent-tinted glow on hover/active — `0 0 0 1px rgba(255,92,71,.35), 0 14px 40px rgba(255,92,71,.12)`.
- Gradients: use on primary actions and rank numerals; never behind body text.

### 4.4 Motion

- Standard: `180ms cubic-bezier(.2,.8,.2,1)`.
- Card hover: `translateY(-4px)` + glow; rank numeral lifts `2px`.
- Primary button: a slow gradient shift on hover (`600ms`, one pass only).
- Hero: optional `12s` slow pan on the active slide; disabled under reduced motion and when the tab is hidden.
- Rail arrows fade in on hover/focus; always visible on touch.

### 4.5 Home hero

```
┌──────────────────────────────────────────────────────────────┐
│  ◆ NEW THIS WEEK                                             │
│                                                              │
│  SOLO LEVELING                              [16:9 key art]   │
│  One line. Then the action.                                  │
│                                                              │
│  [ ▶ PLAY NOW ]   [ + LIST ]        24 EP · SUB · DUB        │
│  ─────────────────────────────────────────────────────       │
│  TOP 10 THIS WEEK                                            │
│  01 [still]  02 [still]  03 [still]  04 [still]              │
└──────────────────────────────────────────────────────────────┘
```

- The numeral is the graphic: outlined, large, overlapping the still's lower-left corner.
- Kicker uses a diamond bullet (the existing `◆`) and a single accent rule.
- Primary action is unmistakable; secondary is a quiet outline.
- Hero motion is the only "showy" moment on Home.

### 4.6 Watch

- Player is the hero: full-bleed within the content column, `14px` radius, subtle accent edge on focus.
- Title is heavy sans, uppercase kicker above (`NOW PLAYING · EP 7`), actions right-aligned.
- Episode rows show `EP 7`, duration, and a percentage chip; the active row gets an accent left rule and dark-ink accent fill.
- Controls use dark glass; progress bar uses the accent gradient; captions/quality are icon-led.
- Up-next countdown is a compact strip below the player, never over the video.

### 4.7 Account & Consent sheet

- Sheet uses `--panel` and an uppercase `ACCOUNT` header.
- Profile cards are horizontal, with a strong avatar ring and a `KIDS` badge.
- Consent rows use large switches; the "Essential only" state is a filled accent chip.
- Personalised ads row includes a visible "Off" state and a short "why" line.
- Save button is the gradient primary; cancel is ghost.

### 4.8 Strengths / risks

- **Strengths:** closest to the current brand; high energy suits anime/donghua; ranked rails and badges are naturally legible; dark mode feels premium.
- **Risks:** fatigue over long sessions; glow and gradient can fail contrast if used behind text; light mode can look like a generic dashboard; easily drifts toward "gaming site" or piracy-site clutter.
- **Mitigation:** cap glow to one element per view; never put text on a gradient; light mode uses flat panels and borders, not glows.

### 4.9 Native translation

- Expo: dark navy shell, accent tab indicator, large-title headers in heavy sans.
- Native switches and segmented controls; gradient reserved for the primary CTA.
- Motion uses native spring for sheet presentation; reduce-motion falls back to fade.

---

## 5. Direction C — Quiet Premium

**Thesis:** Remove everything that is not the title, the play control, or the truth. Neutral graphite and paper, generous space, a single accent used for action and focus. The catalog provides the colour.

### 5.1 Palette

**Dark — "Graphite"**

| Token | Value | Role | Contrast check |
|---|---|---|---|
| `--bg` | `#0c0e12` | Page | — |
| `--bg2` | `#12151b` | Inputs, wells | — |
| `--panel` | `#161a21` | Cards, sheets | — |
| `--panel2` | `#1b2029` | Raised rows | — |
| `--line` | `#282e38` | Hairlines | — |
| `--text` | `#eef1f5` | Body | **17.05:1** on bg |
| `--muted` | `#9aa3b2` | Secondary | **7.59:1** on bg; **6.86:1** on panel |
| `--accent` | `#ff5c47` | Action, focus | **6.32:1** on bg |
| `--accent2` | `#ff8a3d` | Hover, progress | Decorative / fill |
| `--accent-ink` | `#0c0e12` | Text on accent | **6.32:1** |
| `--focus` | `#ff8a3d` | Focus ring | ≥ 3:1 |

**Light — "Paper"**

| Token | Value | Role | Contrast check |
|---|---|---|---|
| `--bg` | `#f6f7f9` | Page | — |
| `--bg2` | `#eef0f4` | Inputs, wells | — |
| `--panel` | `#ffffff` | Cards, sheets | — |
| `--panel2` | `#f2f4f7` | Raised rows | — |
| `--line` | `#e1e5ec` | Hairlines | — |
| `--text` | `#12151b` | Body | **17.05:1** on bg |
| `--muted` | `#5c6472` | Secondary | **5.56:1** on bg; **5.96:1** on panel |
| `--accent` | `#ff5c47` | Action fill | Fill only |
| `--accent-ink` | `#12151b` | Text on accent | **5.98:1** |
| `--accent-text` | `#b3301f` | Accent as text | **5.83:1** on bg |
| `--focus` | `#b3301f` | Focus ring | ≥ 3:1 |

### 5.2 Typography

| Role | Spec |
|---|---|
| Display | `"Inter", "Segoe UI", system-ui, sans-serif` · 600 · `clamp(1.8rem, 3.4vw, 2.6rem)` · line-height `1.1` · tracking `-0.015em` |
| Section title | UI · 600 · `1.05rem` · sentence case · no uppercase, no diamond bullet |
| UI / body | UI · 400–600 · `0.9rem` · line-height `1.55` |
| Labels | UI · 500 · `0.74rem` · sentence case |
| Numerals | Tabular; quiet, never graphic |

### 5.3 Shape, spacing, elevation

- Radius: `8px` controls, `12px` cards, `14px` sheets.
- Spacing: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`; more whitespace above section titles.
- Elevation: neutral and soft — `0 10px 30px rgba(0,0,0,.22)`; light mode uses border-first, shadow-second.
- Borders: 1px `--line` everywhere; no accent borders on resting cards.

### 5.4 Motion

- Standard: `160ms ease`.
- Opacity and colour only; **no card lift**, no image zoom, no parallax.
- Hero changes with a `200ms` crossfade; no auto-advance unless the user has not interacted and motion is allowed.
- Focus ring appears instantly; no animated outline.

### 5.5 Home hero

```
┌──────────────────────────────────────────────────────────────┐
│  New this week                                               │
│                                                              │
│  Frieren: Beyond Journey's End             [16:9 still]      │
│  One line of copy.                                           │
│                                                              │
│  [ Resume 12:34 ]   [ My List ]        28 EP · SUB · DUB     │
├──────────────────────────────────────────────────────────────┤
│  Continue watching                                           │
│  [still]      [still]      [still]      [still]              │
└──────────────────────────────────────────────────────────────┘
```

- No kicker shouting; a sentence-case label and a single accent action.
- Larger gaps between rails; fewer visible cards at once; nothing competes with key art.
- Ranked Top 10 still exists but uses small numerals, not outlined display type.

### 5.6 Watch

- The player is the only high-contrast object; page chrome recedes.
- Title is `1.8–2.6rem`, sentence case; metadata is a single muted line.
- Actions are text buttons with icons; the primary action is the only accent fill on the page.
- Episode list uses generous `56px` rows, 1px separators, a small progress line, and no percentage shouting.
- Source note is one muted line with an inline link.

### 5.7 Account & Consent sheet

- Sheet on white/graphite with a `1.05rem` heading and plain-language body.
- Profile row is a simple list item; kids state is a text badge, not a loud chip.
- Consent is a three-row list with switches; the default is visually obvious but not celebratory.
- Buttons: one accent `Save choices`, one text `Cancel`; no gradient.
- Data actions sit under a "Your data" subhead with clear consequences.

### 5.8 Strengths / risks

- **Strengths:** most accessible and least fatiguing; excellent light mode; scales cleanly to native settings and legal screens; content does the talking.
- **Risks:** can feel generic or "enterprise" without strong editorial art; weak differentiation from other streamers; risks losing the brand's orange-red energy.
- **Mitigation:** keep the accent for action/focus and use editorial photography, not chrome, for identity.

### 5.9 Native translation

- Expo: system-like navigation, sentence-case large titles, neutral surfaces, accent only on the primary action and tab indicator.
- Native `Switch`, `List.Section`, `Sheet`; no custom glow.
- Motion uses platform defaults; reduce-motion respected automatically.

---

## 6. Side-by-side comparison

| Dimension | A · Cinema Editorial | B · Neon Arena | C · Quiet Premium |
|---|---|---|---|
| First impression | Warm, curated, film-literate | Loud, energetic, anime-native | Calm, premium, neutral |
| Brand fit | Strong for classic cinema; good for anime | Strongest for anime/donghua; risks gaming | Safe; weakest brand signature |
| Long-session comfort | High | Medium | High |
| Light mode | Paper-like, distinctive | Dashboard-like | Clean, familiar |
| Accessibility headroom | High | Medium (glow/gradient traps) | Highest |
| Differentiation | High | High | Low–medium |
| Implementation cost | Medium (type pairing, warm tokens) | Low–medium (closest to current CSS) | Low |
| Native fit | High (large serif titles) | Medium (custom chrome) | Highest (system-native) |
| Risk of piracy-site drift | Low | Medium–high | Very low |

---

## 7. Gate outcome

**Direction C — Quiet Premium is locked as the `v4.0` base.**

The draft recommended A; the gate chose C. C now governs every surface: web classic, web React, and native. A and B remain documented explorations, not product defaults.

Why C holds up:

1. **Accessibility is the default, not a retrofit.** C has the widest contrast headroom and the simplest state language (colour + text + border, never colour alone). That matters for a product that must pass WCAG 2.2 AA while shipping accounts, consent, and ads.
2. **Dark and light are peers.** Graphite and paper both feel intentional; neither is an inversion of the other. The light theme is not a fallback for users who “don’t like dark mode.”
3. **Trust surfaces are first-class.** Account, consent, privacy, legal, and settings are where the product earns permission. C’s restraint is an advantage there, not a compromise.
4. **Native parity is direct.** System type, native switches, native sheets, and platform motion mean the native app can share the same tokens without imitating web chrome.
5. **The catalog provides the identity.** With neutral chrome, key art, titles, and editorial curation carry the brand. The orange-red accent stays locked and becomes more meaningful because it is rare.

**Guardrails so C does not become generic:**

- The accent is reserved for the primary action, focus, active state, and progress. It is not decoration.
- Home still opens with a strong editorial hero and real key art; C is quiet, not empty.
- Section titles stay sentence case and confident; no uppercase “dashboard” labels.
- Ranked Top 10 survives with small numerals, not display-type gimmicks.
- A’s serif and B’s gradient may appear in off-product campaign art, but **not** in the product UI.

**What we do not do:** no serif in product UI, no gradients behind text, no glow on cards or players, no forced 2:3 crops, no white text on accent fills, no motion that delays reading.

---

## 8. Gate — approved decisions

| # | Decision | Approved value |
|---|---|---|
| 1 | **Base direction** | **C · Quiet Premium** across all surfaces. A and B are reference explorations only. |
| 2 | **Source-art ratio** | Keep 16:9 stills everywhere; no 2:3 poster crop. |
| 3 | **Primary button ink** | Dark ink on accent fills (`#0c0e12` dark / `#12151b` light), never white. |
| 4 | **Theme model** | Dark + light both first-class; system default + manual override; light is designed independently. |
| 5 | **Type split** | Sans display + sans UI. No serif in product UI. Sentence-case section titles. |
| 6 | **Motion budget** | C’s `160ms` opacity/colour motion as default. No card lift, image zoom, parallax, or glow. Reduced motion is always instant. |

**Gate status:** approved and locked as `v4.0`.

**Next:** Phase 5 — dual-theme colour system. Full token set, semantic roles (surface, text, border, action, focus, status, ad label), contrast matrix for every pair, theme-switch behaviour, and the classic CSS / React / native token mapping.

---

## 9. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First visual-direction draft. Reference teardown with verified/general labels; three directions with dual-theme palettes, type, shape, motion, and the three reference samples; comparison matrix; recommendation A with C for utility surfaces; six gate decisions. |
| `v4.0` | 2026-11-07 | Gate approved **Direction C · Quiet Premium** as the base across web classic, web React, and native. Locked 16:9 stills, dark ink on accent, dual themes, sans-only product type, and C’s restrained motion. A and B downgraded to reference explorations. Preview defaults to C. |
