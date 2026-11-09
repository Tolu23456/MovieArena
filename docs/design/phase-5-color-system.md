# Phase 5 — Dual-theme colour system

**Status:** Locked `v5.0`
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 4 `v4.0` — Direction C · Quiet Premium
**Preview:** `docs/design/phase-5-preview.html` — live ramps, semantic roles, computed matrix, component states
**Reference:** Contrast ratios computed with the WCAG 2.x relative-luminance formula. No values are estimated by eye.

---

## 1. Intent

Phase 4 chose a quiet, neutral system where the catalog provides the colour. Phase 5 makes that system real:

1. **Semantic tokens are the contract.** Components never use raw hex. They ask for a role (`surface.page`, `content.secondary`, `action.primary`) and the theme answers.
2. **Dark and light are peers.** Light is not an inversion. Both themes have their own surfaces, borders, and status values.
3. **The accent is rare.** `#ff5c47` is for action, focus, progress, and active state. In light mode it is **fill-only**; text uses a darker accent.
4. **State is never colour alone.** Focus, selected, disabled, ad, kids, and status all pair colour with a rule, icon, label, weight, or position.
5. **Media chrome is theme-independent.** Player controls sit on video, not on the app surface, so they keep one dark chrome in both themes.
6. **No glow.** Focus is a hard ring at a fixed offset. There are no coloured halos, bloom, ambient washes, or animated shadows.

---

## 2. Layer model

```
Primitive ramps        raw values, no meaning
      ↓
Semantic tokens        surface / content / border / action / status / ad / media
      ↓
Component tokens       button.primary, input.default, card, sheet, switch…
      ↓
Platform mapping       CSS custom properties · React theme object · native theme object
```

Phase 5 owns the first two layers and the platform mapping. Phase 6 owns the full component layer.

**Naming convention**

`--color-<category>-<role>[-<state>]`

Examples: `--color-surface-card`, `--color-content-secondary`, `--color-action-primary-hover`, `--color-ad-label`, `--color-media-progress-fill`.

React and native use the same path in camelCase:

```js
theme.color.surface.card
theme.color.content.secondary
theme.color.action.primaryHover
theme.color.media.progressFill
```

---

## 3. Primitive ramps

Primitives exist to keep values consistent. They are **not** used directly by components.

### 3.1 Neutral

| Token | Value | Typical use |
|---|---|---|
| `--ma-neutral-0` | `#ffffff` | Light card, inverse text |
| `--ma-neutral-50` | `#f6f7f9` | Light page |
| `--ma-neutral-75` | `#f2f4f7` | Light raised |
| `--ma-neutral-100` | `#eef1f5` | Dark primary text, light sunken |
| `--ma-neutral-150` | `#e1e5ec` | Light border |
| `--ma-neutral-200` | `#c6cdd9` | Light strong border |
| `--ma-neutral-300` | `#9aa3b2` | Dark secondary text |
| `--ma-neutral-400` | `#828d9d` | Dark tertiary text |
| `--ma-neutral-500` | `#6f7a8c` | Light control border |
| `--ma-neutral-600` | `#646e7c` | Light tertiary text, dark control border |
| `--ma-neutral-700` | `#5c6472` | Light secondary text |
| `--ma-neutral-750` | `#4a5362` | Disabled / muted control |
| `--ma-neutral-800` | `#3c4554` | Dark emphasis border |
| `--ma-neutral-850` | `#282e38` | Dark subtle border |
| `--ma-neutral-900` | `#1b2029` | Dark raised |
| `--ma-neutral-925` | `#161a21` | Dark card |
| `--ma-neutral-950` | `#12151b` | Dark sunken, light primary text |
| `--ma-neutral-1000` | `#0c0e12` | Dark page, dark action ink |
| `--ma-neutral-1100` | `#07080b` | Scrims, player surround |

### 3.2 Accent (hue locked)

| Token | Value | Typical use |
|---|---|---|
| `--ma-accent-50` | `#fff1ee` | Soft tint on light |
| `--ma-accent-100` | `#ffe0da` | Hover tint |
| `--ma-accent-200` | `#ffc4b8` | Selected tint |
| `--ma-accent-300` | `#ff9f8e` | Disabled accent |
| `--ma-accent-400` | `#ff7a62` | Dark hover |
| `--ma-accent-500` | `#ff5c47` | **Locked accent** — primary action |
| `--ma-accent-600` | `#e84632` | Hover/pressed on light |
| `--ma-accent-700` | `#c0341f` | Accent text on light |
| `--ma-accent-800` | `#972817` | Link hover on light |
| `--ma-accent-900` | `#6e1d10` | Deep tint |

### 3.3 Warm accent

| Token | Value | Typical use |
|---|---|---|
| `--ma-warm-100` | `#ffe6cf` | Warm tint |
| `--ma-warm-200` | `#ffc48f` | Warm border |
| `--ma-warm-300` | `#ffb066` | Link hover on dark |
| `--ma-warm-400` | `#ff8a3d` | **Locked warm accent** — focus, links on dark |
| `--ma-warm-500` | `#e87325` | Warm pressed |
| `--ma-warm-600` | `#b85618` | Warm text on light |
| `--ma-warm-700` | `#8a3d0f` | Deep warm |

### 3.4 Status

| Family | Dark value | Light value | Use |
|---|---|---|---|
| Success | `#8fcfa5` | `#2f6b3a` | Available, saved, completed |
| Warning | `#e8c37a` | `#8a5a12` | Ad label, attention, expiring |
| Danger | `#ff9a8f` | `#b3261e` | Error, destructive action |
| Info | `#9db8ff` | `#2f5bb7` | Dubs, sync, session info |
| Rank | `#c8b080` | `#8a6a2f` | Top 10 numerals, archive accent |

Status colours are always paired with an icon or text. None of these tokens is ever the only signal.

---

## 4. Semantic tokens

### 4.1 Dark — Graphite

| Token | Value | Role |
|---|---|---|
| `--color-surface-page` | `#0c0e12` | Page background |
| `--color-surface-sunken` | `#12151b` | Inputs, wells, episode strip |
| `--color-surface-card` | `#161a21` | Cards, panels, sheets |
| `--color-surface-raised` | `#1b2029` | Hover rows, raised panels |
| `--color-surface-inverse` | `#ffffff` | Inverse blocks |
| `--color-border-subtle` | `#282e38` | Decorative hairline; not a control boundary |
| `--color-border-control` | `#646e7c` | Inputs, switches, secondary buttons |
| `--color-border-emphasis` | `#6f7a8c` | Hover / active border |
| `--color-content-primary` | `#eef1f5` | Body, titles |
| `--color-content-secondary` | `#9aa3b2` | Metadata, secondary copy |
| `--color-content-tertiary` | `#828d9d` | Placeholder, disabled, timestamps |
| `--color-content-inverse` | `#0c0e12` | Text on light/inverse surfaces |
| `--color-action-primary` | `#ff5c47` | Primary fill, progress, active rule |
| `--color-action-primary-hover` | `#ff7a62` | Primary hover |
| `--color-action-primary-pressed` | `#e84632` | Primary pressed |
| `--color-action-ink` | `#0c0e12` | Text/icon on the primary fill |
| `--color-action-soft` | `rgba(255,92,71,.16)` | Active nav background, selected row |
| `--color-action-softer` | `rgba(255,92,71,.07)` | Card flash, subtle tint |
| `--color-focus-ring` | `#ff8a3d` | Focus ring on app surfaces |
| `--color-focus-ring-on-accent` | `#0c0e12` | Focus ring inside an accent fill |
| `--color-link` | `#ff8a3d` | Inline links |
| `--color-link-hover` | `#ffb066` | Link hover |
| `--color-status-success` | `#8fcfa5` | Success |
| `--color-status-warning` | `#e8c37a` | Warning, ad label |
| `--color-status-danger` | `#ff9a8f` | Error |
| `--color-status-info` | `#9db8ff` | Info, dub badge |
| `--color-status-rank` | `#c8b080` | Top 10 numerals |
| `--color-ad-surface` | `#1c1b17` | Ad slot background |
| `--color-ad-border` | `#3a3428` | Ad slot border |
| `--color-ad-label` | `#e8c37a` | "Ad" label |
| `--color-ad-text` | `#eef1f5` | Ad body copy |
| `--color-kids-surface` | `#1a2030` | Kids badge / banner |
| `--color-kids-text` | `#b9ccff` | Kids badge text |
| `--color-kids-border` | `#33436a` | Kids badge border |
| `--color-skeleton` | `#1b2029` | Loading block |
| `--color-skeleton-shine` | `rgba(255,255,255,.06)` | Shimmer |
| `--color-overlay-scrim` | `rgba(7,8,11,.72)` | Modal/sheet scrim |
| `--color-overlay-sheet` | `rgba(7,8,11,.55)` | Secondary dim |
| `--color-switch-off` | `#646e7c` | Switch track, off |
| `--color-switch-on` | `#ff5c47` | Switch track, on |
| `--color-switch-knob` | `#eef1f5` | Knob, off |
| `--color-switch-knob-on` | `#0c0e12` | Knob, on |
| `--color-scrollbar-thumb` | `rgba(255,92,71,.45)` | Scrollbar |
| `--color-scrollbar-thumb-hover` | `rgba(255,138,61,.75)` | Scrollbar hover |

### 4.2 Light — Paper

| Token | Value | Role |
|---|---|---|
| `--color-surface-page` | `#f6f7f9` | Page background |
| `--color-surface-sunken` | `#eef1f5` | Inputs, wells, episode strip |
| `--color-surface-card` | `#ffffff` | Cards, panels, sheets |
| `--color-surface-raised` | `#f2f4f7` | Hover rows, raised panels |
| `--color-surface-inverse` | `#12151b` | Inverse blocks |
| `--color-border-subtle` | `#e1e5ec` | Decorative hairline; not a control boundary |
| `--color-border-control` | `#6f7a8c` | Inputs, switches, secondary buttons |
| `--color-border-emphasis` | `#646e7c` | Hover / active border |
| `--color-content-primary` | `#12151b` | Body, titles |
| `--color-content-secondary` | `#5c6472` | Metadata, secondary copy |
| `--color-content-tertiary` | `#646e7c` | Placeholder, disabled, timestamps |
| `--color-content-inverse` | `#ffffff` | Text on inverse surfaces |
| `--color-action-primary` | `#ff5c47` | Primary fill, progress, active rule |
| `--color-action-primary-hover` | `#e84632` | Primary hover |
| `--color-action-primary-pressed` | `#e84632` | Primary pressed (plus inset shadow) |
| `--color-action-ink` | `#12151b` | Text/icon on the primary fill |
| `--color-action-soft` | `rgba(255,92,71,.12)` | Active nav background, selected row |
| `--color-action-softer` | `rgba(255,92,71,.06)` | Card flash, subtle tint |
| `--color-focus-ring` | `#c0341f` | Focus ring on app surfaces |
| `--color-focus-ring-on-accent` | `#12151b` | Focus ring inside an accent fill |
| `--color-link` | `#c0341f` | Inline links |
| `--color-link-hover` | `#972817` | Link hover |
| `--color-status-success` | `#2f6b3a` | Success |
| `--color-status-warning` | `#8a5a12` | Warning |
| `--color-status-danger` | `#b3261e` | Error |
| `--color-status-info` | `#2f5bb7` | Info, dub badge |
| `--color-status-rank` | `#8a6a2f` | Top 10 numerals |
| `--color-ad-surface` | `#fbf3e6` | Ad slot background |
| `--color-ad-border` | `#e6d6bb` | Ad slot border |
| `--color-ad-label` | `#7a5310` | "Ad" label |
| `--color-ad-text` | `#12151b` | Ad body copy |
| `--color-kids-surface` | `#eef3ff` | Kids badge / banner |
| `--color-kids-text` | `#2f5bb7` | Kids badge text |
| `--color-kids-border` | `#c9d8f7` | Kids badge border |
| `--color-skeleton` | `#eef1f5` | Loading block |
| `--color-skeleton-shine` | `rgba(18,21,27,.05)` | Shimmer |
| `--color-overlay-scrim` | `rgba(18,21,27,.48)` | Modal/sheet scrim |
| `--color-overlay-sheet` | `rgba(18,21,27,.28)` | Secondary dim |
| `--color-switch-off` | `#6f7a8c` | Switch track, off |
| `--color-switch-on` | `#ff5c47` | Switch track, on |
| `--color-switch-knob` | `#ffffff` | Knob, off |
| `--color-switch-knob-on` | `#12151b` | Knob, on |
| `--color-scrollbar-thumb` | `rgba(192,52,31,.35)` | Scrollbar |
| `--color-scrollbar-thumb-hover` | `rgba(192,52,31,.55)` | Scrollbar hover |

### 4.3 Media tokens — identical in both themes

Video chrome sits on video, not on the app surface. It must not flip with the theme.

| Token | Value | Role |
|---|---|---|
| `--color-media-bg` | `#000000` | Player surround |
| `--color-media-chrome` | `#ffffff` | Primary control icon |
| `--color-media-chrome-muted` | `#b8bec9` | Secondary control icon |
| `--color-media-control-bg` | `rgba(12,14,18,.62)` | Glass control background |
| `--color-media-control-border` | `rgba(255,255,255,.28)` | Control hairline |
| `--color-media-scrim` | `rgba(0,0,0,.72)` | Bottom control scrim |
| `--color-media-progress-track` | `rgba(255,255,255,.22)` | Seek track |
| `--color-media-progress-buffered` | `rgba(255,255,255,.42)` | Buffered range |
| `--color-media-progress-fill` | `#ff5c47` | Played range |
| `--color-media-focus` | `#ff8a3d` | Focus ring on video chrome |
| `--color-media-subtitle-bg` | `rgba(0,0,0,.72)` | Caption background |
| `--color-media-subtitle-text` | `#ffffff` | Caption text |
| `--color-media-error` | `#ff9a8f` | Playback error on video |

Contrast on media: white on black is **21:1**; `#b8bec9` on black is **11.25:1**; the error colour is **9.45:1**. No media token depends on the app theme.

---

## 5. Contrast matrix

### 5.1 Dark — text and icons

| Pair | Ratio | Normal 4.5:1 | Large 3:1 |
|---|---:|---|---|
| Content primary / page | **17.05:1** | PASS | PASS |
| Content primary / card | **15.40:1** | PASS | PASS |
| Content secondary / page | **7.59:1** | PASS | PASS |
| Content secondary / card | **6.86:1** | PASS | PASS |
| Content tertiary / page | **5.75:1** | PASS | PASS |
| Content tertiary / card | **5.19:1** | PASS | PASS |
| Link / page | **8.24:1** | PASS | PASS |
| Link / card | **7.44:1** | PASS | PASS |
| Action as text / page | **6.32:1** | PASS | PASS |
| Action as text / card | **5.71:1** | PASS | PASS |
| Action ink / action | **6.32:1** | PASS | PASS |
| Action ink / action hover | **7.55:1** | PASS | PASS |
| Action ink / action pressed | **4.92:1** | PASS | PASS |
| Status success / card | **9.67:1** | PASS | PASS |
| Status warning / card | **10.40:1** | PASS | PASS |
| Status danger / card | **8.53:1** | PASS | PASS |
| Status info / card | **8.92:1** | PASS | PASS |
| Status rank / card | **8.29:1** | PASS | PASS |
| Ad label / ad surface | **10.27:1** | PASS | PASS |
| Ad text / ad surface | **15.21:1** | PASS | PASS |

### 5.2 Dark — boundaries and focus

| Pair | Ratio | UI 3:1 |
|---|---:|---|
| Border control / page | **3.74:1** | PASS |
| Border control / sunken | **3.54:1** | PASS |
| Border control / card | **3.38:1** | PASS |
| Border control / raised | **3.16:1** | PASS |
| Focus ring / page | **8.24:1** | PASS |
| Focus ring / card | **7.44:1** | PASS |
| Focus ring on accent / action | **6.32:1** | PASS |
| Border subtle / page | 1.41:1 | Decorative only |

### 5.3 Light — text and icons

| Pair | Ratio | Normal 4.5:1 | Large 3:1 |
|---|---:|---|---|
| Content primary / page | **17.05:1** | PASS | PASS |
| Content primary / card | **18.28:1** | PASS | PASS |
| Content secondary / page | **5.56:1** | PASS | PASS |
| Content secondary / card | **5.96:1** | PASS | PASS |
| Content tertiary / page | **4.82:1** | PASS | PASS |
| Content tertiary / card | **5.17:1** | PASS | PASS |
| Link / page | **5.22:1** | PASS | PASS |
| Link / card | **5.60:1** | PASS | PASS |
| **Action as text / page** | **2.85:1** | **FAIL** | **FAIL** |
| **Action as text / card** | **3.06:1** | **FAIL** | PASS (large only) |
| Action ink / action | **5.98:1** | PASS | PASS |
| Action ink / action hover | **4.66:1** | PASS | PASS |
| Action ink / action pressed | **4.66:1** | PASS | PASS |
| Status success / card | **6.39:1** | PASS | PASS |
| Status warning / card | **5.91:1** | PASS | PASS |
| Status danger / card | **6.54:1** | PASS | PASS |
| Status info / card | **6.36:1** | PASS | PASS |
| Status rank / card | **5.02:1** | PASS | PASS |
| Ad label / ad surface | **6.21:1** | PASS | PASS |
| Ad text / ad surface | **16.60:1** | PASS | PASS |

### 5.4 Light — boundaries and focus

| Pair | Ratio | UI 3:1 |
|---|---:|---|
| Border control / page | **4.05:1** | PASS |
| Border control / sunken | **3.83:1** | PASS |
| Border control / card | **4.34:1** | PASS |
| Border control / raised | **3.94:1** | PASS |
| Focus ring / page | **5.22:1** | PASS |
| Focus ring / card | **5.60:1** | PASS |
| Focus ring on accent / action | **5.98:1** | PASS |
| Border subtle / page | 1.18:1 | Decorative only |

### 5.5 Deliberate exception — accent text on light

`#ff5c47` is **2.85:1** on the light page. It is therefore **fill-only** in light mode.

| Use | Token | Why |
|---|---|---|
| Primary button fill | `--color-action-primary` | Dark ink on the fill is 5.98:1 |
| Progress bar / active rule | `--color-action-primary` | Non-text graphic; 3:1 against the light surface is met on cards, and the rule is never the only state signal |
| Inline link / accent text | `--color-link` (`#c0341f`) | 5.22:1 on page, 5.60:1 on card |
| Icon that must be understood | `--color-link` | 5.22:1; raw accent is not allowed for meaningful small icons |

This is the single most important rule in the light theme. A component that uses `action.primary` for text is a bug.

---

## 6. State and interaction rules

| State | Rule |
|---|---|
| **Hover** | Border or fill changes; no layout shift. Primary hover changes fill; secondary hover changes border to `--color-border-emphasis`. |
| **Pressed** | Fill change + `transform: scale(.98)` or inset shadow. Never colour alone. |
| **Selected** | `--color-action-soft` background + 2px `--color-action-primary` rule + text weight 650. Three signals. |
| **Focus** | Hard 2px `--color-focus-ring` outline, 2px offset. On an accent fill, use `--color-focus-ring-on-accent`. No halo, no shadow, no bloom. Never remove the ring; suppress only for pointer focus with `:focus:not(:focus-visible)`. |
| **Disabled** | `aria-disabled="true"` + `--color-content-tertiary` text + no shadow + `cursor: not-allowed`. Do not use opacity alone. |
| **Loading** | `--color-skeleton` + shimmer; final dimensions reserved. No layout shift. |
| **Error** | `--color-status-danger` + icon + text. Never red text alone. |
| **Success** | `--color-status-success` + icon + text. |
| **Ad** | `--color-ad-surface` + `--color-ad-border` + visible text label "Ad". Never colour alone. |
| **Kids** | `--color-kids-surface` + text "Kids" + icon. Never colour alone. |
| **Link** | Underline in body copy; nav/card links may use weight and hover rule. |
| **Scrollbar** | Thin, themed, never the only scroll affordance. |

---

## 7. Trust surfaces

### 7.1 Ads

- Contextual ads are allowed on browse rails/grid and between episodes. No ads in Kids, around the player, in episode rows, or in Continue Watching.
- An ad slot uses `--color-ad-surface` and `--color-ad-border`, with a visible `Ad` label in `--color-ad-label`.
- The slot reserves its final height before load. No layout shift, no fake content, no disguised native card.
- An ad blocker leaves content and playback untouched. No nag, no overlay.

### 7.2 Consent

- Default is essential-only. Optional rows are visibly off.
- The on/off switch uses `--color-switch-on` + `--color-switch-knob-on`; off uses `--color-switch-off` + `--color-switch-knob`. Knob position is the second signal.
- Required storage is labelled `Required`, not just shown as a locked toggle.
- Withdrawal takes effect immediately; the UI reflects the stored state before the network call resolves.
- Consent state is not encoded in colour alone; every row has a state word.

### 7.3 Kids

- Kids mode uses the same neutrals; the `Kids` badge uses `--color-kids-*`.
- No ads, no account management, no external links except allow-listed sources.
- Restricted titles show a calm block screen with a profile-switch action; no red alarm styling.

---

## 8. Theme switching

### 8.1 Modes

| Mode | Behaviour |
|---|---|
| `system` (default) | Follows `prefers-color-scheme`; changes live when the OS changes |
| `dark` | Always dark, regardless of OS |
| `light` | Always light, regardless of OS |

Storage key: `ma.theme` with values `system`, `dark`, `light`. Never store the resolved theme; store the mode.

### 8.2 Boot without flash (classic web)

The inline script must run **before** the stylesheet:

```html
<script>
(function () {
  try {
    var mode = localStorage.getItem('ma.theme') || 'system';
    var dark = mode === 'dark' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.themeMode = mode;
    root.style.colorScheme = dark ? 'dark' : 'light';
  } catch (_) {}
})();
</script>
```

CSS structure:

```css
:root { /* primitive ramps only */ }

:root,
[data-theme="dark"] {
  color-scheme: dark;
  --color-surface-page: var(--ma-neutral-1000);
  /* …dark semantics… */
}

[data-theme="light"] {
  color-scheme: light;
  --color-surface-page: var(--ma-neutral-50);
  /* …light semantics… */
}
```

No-JS fallback: a `@media (prefers-color-scheme: light)` block may duplicate the light semantics for `:root:not([data-theme])`. If duplication is unacceptable, default to dark without JS and let the theme control appear only when JS is available. Do not ship a flash.

### 8.3 Switching at runtime

```js
function setThemeMode(mode) {
  localStorage.setItem('ma.theme', mode);
  const dark = mode === 'dark' ||
    (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const root = document.documentElement;

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-switching');
    setTimeout(() => root.classList.remove('theme-switching'), 180);
  }

  root.dataset.theme = dark ? 'dark' : 'light';
  root.dataset.themeMode = mode;
  root.style.colorScheme = dark ? 'dark' : 'light';
}
```

```css
html.theme-switching,
html.theme-switching * {
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease !important;
}
html.theme-switching img,
html.theme-switching video,
html.theme-switching .media-chrome {
  transition: none !important;
}
```

- Do not transition `background-image`, key art, video, or the player chrome.
- Respect reduced motion: switch instantly.
- Listen for OS changes only when mode is `system`.
- Sync across tabs with the `storage` event.

### 8.4 React

- `ThemeProvider` owns `mode`, resolves `theme`, and writes `data-theme` + `colorScheme`.
- Read the initial mode from `localStorage` and the initial resolved theme from `document.documentElement.dataset.theme` during hydration.
- Subscribe to the media query with `useSyncExternalStore`.
- Components consume `theme.color.*`; no raw hex, no `prefers-color-scheme` checks inside components.

### 8.5 Native

- `mode` is persisted in SecureStore (session-adjacent settings) or AsyncStorage (non-sensitive preference).
- Read it before the first app frame; the splash screen covers the read.
- `useColorScheme()` supplies the system value. `theme = mode === 'system' ? system : mode`.
- Pass the same token object shape as React: `theme.color.surface.page`, `theme.color.action.primary`.
- Set the status bar and navigation bar style from the resolved theme. Do not hardcode per screen.
- No CSS variables in native; the token object is the source of truth.

---

## 9. Migration from the current CSS

The current stylesheet uses short dark-only names. Phase 6 can migrate incrementally with aliases.

| Current | New semantic | Migration note |
|---|---|---|
| `--bg` | `--color-surface-page` | Alias during migration |
| `--bg2` | `--color-surface-sunken` | Inputs, wells |
| `--panel` | `--color-surface-card` | Cards, sheets |
| `--panel2` | `--color-surface-raised` | Hover rows |
| `--line` | `--color-border-subtle` / `--color-border-control` | Split decorative vs interactive |
| `--text` | `--color-content-primary` | — |
| `--muted` | `--color-content-secondary` | Placeholder needs tertiary |
| `--accent` | `--color-action-primary` | Fill/action, not text on light |
| `--accent2` | `--color-link` (text) / `--color-action-primary-hover` (fills) | Context decides |
| `--ok` | `--color-status-success` | Add icon/text |
| `--gold` | `--color-status-rank` | Rank numerals |
| `--shadow` | `--elevation-2` | Theme-specific value |
| `--sb`, `--sb-hover` | `--color-scrollbar-thumb`, `--color-scrollbar-thumb-hover` | — |
| `rgba(255,92,71,…)` literals | `--color-action-soft` / `--color-action-softer` | Replace all |
| `#8db1ff` links | `--color-link` | Remove hardcoded blue |
| `html { color-scheme: dark }` | Theme blocks | Remove dark-only lock |
| `body` radial gradients | — | Delete; surfaces stay flat |
| Focus `box-shadow` glow | `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` | Replace; no halo |

### Legacy alias block (temporary)

```css
:root,
[data-theme="dark"] {
  --bg: var(--color-surface-page);
  --bg2: var(--color-surface-sunken);
  --panel: var(--color-surface-card);
  --panel2: var(--color-surface-raised);
  --text: var(--color-content-primary);
  --muted: var(--color-content-secondary);
  --accent: var(--color-action-primary);
  --accent2: var(--color-action-primary-hover);
}

[data-theme="light"] {
  --bg: var(--color-surface-page);
  --bg2: var(--color-surface-sunken);
  --panel: var(--color-surface-card);
  --panel2: var(--color-surface-raised);
  --text: var(--color-content-primary);
  --muted: var(--color-content-secondary);
  --accent: var(--color-action-primary);
  --accent2: var(--color-action-primary-hover);
}
```

Remove aliases only after every page and the React/mobile surfaces use semantic tokens.

---

## 10. Accessibility beyond contrast

### 10.1 Forced colours

```css
@media (forced-colors: active) {
  :root {
    --color-border-control: CanvasText;
    --color-focus-ring: Highlight;
    --color-content-primary: CanvasText;
    --color-content-secondary: CanvasText;
    --color-surface-page: Canvas;
    --color-surface-card: Canvas;
    --color-action-primary: ButtonFace;
    --color-action-ink: ButtonText;
    --color-link: LinkText;
  }
  .hero-art,
  .art::before,
  .art::after,
  .hero::after {
    display: none;
  }
  .card,
  .sheet,
  .player {
    forced-color-adjust: auto;
  }
}
```

- Keep focus visible with a system `Highlight` outline.
- Do not rely on the gradient key art for meaning; every card has text.
- Ensure controls keep their system borders.

### 10.2 Increased contrast

```css
@media (prefers-contrast: more) {
  :root {
    --color-content-secondary: var(--color-content-primary);
    --color-border-subtle: var(--color-border-control);
    --color-border-control: var(--color-border-emphasis);
  }
}
```

- Secondary text becomes primary.
- Decorative borders become control-strength.
- Keep the accent fill contrast; do not brighten text on accent.

### 10.3 Colour-blind safety

- Status uses icon + text.
- Switches use knob position + state word.
- Selected nav uses rule + weight + background.
- Charts and progress use labels and values; progress bars have `aria-valuenow`.
- Ad and Kids labels are text, not colour chips only.

### 10.4 Do not

- Do not use `opacity` to create secondary text; it breaks contrast unpredictably.
- Do not use the raw accent for text in light mode.
- Do not use `--color-border-subtle` as the only boundary of an input, switch, or button.
- Do not use red/green alone for success and error.
- Do not animate colour on the player or key art during a theme switch.
- Do not add glow, coloured halos, bloom, ambient radial washes, or animated shadows. Focus is a hard ring; elevation is neutral shadow only.

---

## 11. Gate — approved

**Outcome:** Approved and locked as `v5.0` on 2026-11-07, with one amendment: **no glow effect anywhere**. Coloured focus halos, ambient page washes, bloom, and animated shadows are removed from the system.

| # | Decision | Locked value |
|---|---|---|
| 1 | **Token architecture** | Primitive → semantic → component → platform, with `--color-<category>-<role>[-<state>]` naming |
| 2 | **Dark values** | Graphite set in §4.1, all text pairs pass 4.5:1, control borders pass 3:1 |
| 3 | **Light values** | Paper set in §4.2, all text pairs pass 4.5:1, control borders pass 3:1 |
| 4 | **Light accent rule** | `action.primary` is fill-only; `link` (`#c0341f`) is the only accent text/icon token |
| 5 | **Theme switching** | `system` / `dark` / `light`, stored as `ma.theme`, inline boot script, no flash, reduced-motion instant |
| 6 | **Media tokens** | One dark chrome in both themes; no theme flip on the player |
| 7 | **Migration** | Ship aliases for the current `--bg`…`--shadow` names, remove after parity |
| 8 | **Accessibility modes** | Forced-colours and increased-contrast overrides in §10 |
| 9 | **No glow** | Focus is a hard 2px ring at 2px offset. No coloured halo, bloom, ambient wash, or animated shadow |

**Next:** Phase 6 — component system and states (buttons, inputs, cards, rails, player chrome, sheets, ads, and the full component-token layer).

---

## 12. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First dual-theme colour draft: primitive ramps, dark/light semantic sets, media tokens, computed contrast matrix, state rules, trust surfaces, theme switching, migration aliases, forced-colours behaviour, eight gate decisions. |
| `v5.0` | 2026-11-07 | Approved and locked. Removed `--color-focus-halo`, `--color-atmosphere-accent`, and `--color-atmosphere-cool`; focus is a hard 2px ring with 2px offset; no glow, bloom, ambient wash, or animated shadow anywhere. Added gate decision 9. |
