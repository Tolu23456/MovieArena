# Phase 6 — Component system and states

**Status:** Locked `v6.0`
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 5 `v5.0` — dual-theme colour system; Phase 4 `v4.0` — Direction C
**Preview:** `docs/design/phase-6-preview.html`
**Rule:** Components consume component tokens. Components never use primitives or raw hex.

---

## 1. Intent

Phase 5 defined what colour means. Phase 6 defines what a control *is*:

1. **One component, three surfaces.** A button has the same anatomy, states, and token names in classic CSS, React, and native. Only the renderer changes.
2. **Quiet by default.** No glow, no lift, no zoom, no parallax. Emphasis comes from contrast, weight, spacing, and a single accent fill.
3. **States are explicit.** Every interactive component defines default, hover, pressed, focus-visible, disabled, and loading. Nothing is inferred at implementation time.
4. **Touch and pointer are peers.** Minimum 44×44px targets on touch, 32px compact controls on pointer, 24px absolute minimum.
5. **Player chrome is its own system.** It uses the Phase 5 media tokens in both themes and never inherits app surfaces.

---

## 2. Foundations

### 2.1 Type scale

Sans-only, as locked in Phase 4. Display uses tight tracking; body stays open.

| Token | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|
| `--type-display` | `clamp(2.4rem, 5vw, 4rem)` / 1.02 | 650 | `-.035em` | Hero title |
| `--type-title` | `1.6rem` / 1.15 | 650 | `-.025em` | Page title |
| `--type-heading` | `1.125rem` / 1.3 | 650 | `-.015em` | Section heading |
| `--type-subheading` | `.95rem` / 1.4 | 650 | `-.01em` | Card rail title |
| `--type-body` | `.875rem` / 1.6 | 400 | `0` | Body copy |
| `--type-body-strong` | `.875rem` / 1.6 | 650 | `0` | Emphasised body |
| `--type-label` | `.75rem` / 1.4 | 650 | `.01em` | Buttons, fields |
| `--type-caption` | `.6875rem` / 1.45 | 500 | `.01em` | Metadata, helper |
| `--type-micro` | `.625rem` / 1.3 | 750 | `.08em` | Badges, overlines; uppercase |

Rules:

- No text below `11px`.
- Metadata uses `content.secondary`; never opacity.
- Overlines are uppercase with `--type-micro`, never letter-spaced body text.
- Numeric data uses `font-variant-numeric: tabular-nums`.

### 2.2 Spacing

| Token | Value | Use |
|---|---|---|
| `--space-1` | `2px` | Hairline offsets |
| `--space-2` | `4px` | Icon-to-label |
| `--space-3` | `6px` | Badge padding |
| `--space-4` | `8px` | Tight stacks |
| `--space-5` | `12px` | Control padding |
| `--space-6` | `16px` | Card padding |
| `--space-7` | `20px` | Panel padding |
| `--space-8` | `24px` | Section gap |
| `--space-9` | `32px` | Page gutter (desktop) |
| `--space-10` | `40px` | Major section gap |
| `--space-11` | `48px` | Hero breathing room |
| `--space-12` | `64px` | Page top/bottom |

### 2.3 Radius

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | `3px` | Badge |
| `--radius-sm` | `6px` | Chip, small control |
| `--radius-md` | `8px` | Button, input |
| `--radius-lg` | `10px` | Card |
| `--radius-xl` | `14px` | Panel, sheet |
| `--radius-pill` | `999px` | Switch, pill, avatar |

### 2.4 Elevation

Neutral shadow only. No coloured shadow, no glow, no bloom.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--elevation-1` | `0 1px 2px rgba(0,0,0,.24)` | `0 1px 2px rgba(35,48,80,.08)` | Card at rest |
| `--elevation-2` | `0 10px 30px rgba(0,0,0,.22)` | `0 10px 26px rgba(35,48,80,.10)` | Sticky rail header, popover |
| `--elevation-3` | `0 24px 70px rgba(0,0,0,.38)` | `0 24px 60px rgba(35,48,80,.18)` | Sheet, modal |

- Borders carry structure in dark; shadows are secondary.
- Never animate a shadow. State changes are colour and border only.
- No inset shadow except the pressed state of a filled button.

### 2.5 Sizes and targets

| Token | Value | Use |
|---|---|---|
| `--size-control-sm` | `32px` | Dense desktop toolbar |
| `--size-control-md` | `40px` | Default control |
| `--size-control-lg` | `48px` | Primary hero action |
| `--size-icon-sm` | `16px` | Inline icon |
| `--size-icon-md` | `20px` | Control icon |
| `--size-icon-lg` | `24px` | Player icon |
| `--target-touch` | `44px` | Minimum touch target on native and mobile web |
| `--target-min` | `24px` | Absolute minimum (WCAG 2.2) |

- On touch surfaces, the hit area expands to `--target-touch` even when the visual control is smaller.
- Adjacent targets keep at least `--space-4` between them.

### 2.6 Motion

| Token | Value | Use |
|---|---|---|
| `--motion-fast` | `120ms` | Pressed feedback |
| `--motion-base` | `160ms` | Colour, opacity, border |
| `--motion-slow` | `240ms` | Sheet enter/exit |
| `--ease-standard` | `cubic-bezier(.2,.7,.2,1)` | Default |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | Dismiss |

Allowed: opacity, colour, border-colour, transform on a **control press only** (`scale(.98)`), sheet translate, skeleton shimmer.

Forbidden: card lift, card zoom, parallax, glow, blur-in, spring bounce, animated shadows, auto-playing carousels with motion that cannot be paused.

`prefers-reduced-motion: reduce` removes all transforms and shimmer, keeps instant state changes.

---

## 3. Component token contract

Naming:

```
--comp-<component>-<part>-<role>-<state>
```

Examples: `--comp-button-primary-bg-hover`, `--comp-field-border-focus`, `--comp-player-progress-fill`.

React and native use the same path:

```js
theme.component.button.primary.bgHover
theme.component.field.borderFocus
theme.component.player.progressFill
```

Component tokens are **theme-agnostic names**. Their values resolve from the Phase 5 semantic tokens inside each theme block. A component never branches on `dark`/`light`.

---

## 4. Buttons

### 4.1 Anatomy

```
[ leading icon? ] [ label ] [ trailing icon? ]
```

- Height: `--size-control-md`; large `--size-control-lg`; small `--size-control-sm`.
- Horizontal padding: `14px` md, `18px` lg, `10px` sm.
- Gap: `--space-2`.
- Radius: `--radius-md`.
- Label: `--type-label`, weight 700.
- Icon: `--size-icon-md`; never the only label unless `aria-label` is present.

### 4.2 Variants

| Token | Primary | Secondary | Ghost | Danger |
|---|---|---|---|---|
| `bg` | `action.primary` | transparent | transparent | transparent |
| `fg` | `action.ink` | `content.primary` | `content.secondary` | `status.danger` |
| `border` | transparent | `border.control` | transparent | `status.danger` |
| `bg-hover` | `action.primary-hover` | `surface.raised` | `surface.raised` | `status.danger` at 10% |
| `fg-hover` | `action.ink` | `content.primary` | `content.primary` | `status.danger` |
| `border-hover` | transparent | `border.emphasis` | transparent | `status.danger` |
| `bg-pressed` | `action.pressed` + inset shadow | `surface.sunken` | `surface.sunken` | `status.danger` at 16% |
| `bg-disabled` | `surface.raised` | transparent | transparent | transparent |
| `fg-disabled` | `content.tertiary` | `content.tertiary` | `content.tertiary` | `content.tertiary` |

- Primary is the only filled button. One primary per view region.
- Danger stays outlined at rest and inside confirmation dialogs, with a full-strength `status.danger` border so the boundary meets 3:1. The dialog may add a 10% danger tint on hover or pressed; the label names the object being removed.
- Focus: hard 2px focus ring, 2px offset; `focus.on-accent` on primary.
- Loading: keep width, replace label with a spinner and `aria-busy="true"`; no layout shift.

### 4.3 Token set

```css
--comp-button-radius: var(--radius-md);
--comp-button-font: var(--type-label);
--comp-button-gap: var(--space-2);
--comp-button-pad-x: 14px;
--comp-button-pad-x-sm: 10px;
--comp-button-pad-x-lg: 18px;

--comp-button-primary-bg: var(--color-action-primary);
--comp-button-primary-bg-hover: var(--color-action-primary-hover);
--comp-button-primary-bg-pressed: var(--color-action-primary-pressed);
--comp-button-primary-fg: var(--color-action-ink);
--comp-button-primary-border: transparent;

--comp-button-secondary-bg: transparent;
--comp-button-secondary-bg-hover: var(--color-surface-raised);
--comp-button-secondary-bg-pressed: var(--color-surface-sunken);
--comp-button-secondary-fg: var(--color-content-primary);
--comp-button-secondary-border: var(--color-border-control);
--comp-button-secondary-border-hover: var(--color-border-emphasis);

--comp-button-ghost-bg-hover: var(--color-surface-raised);
--comp-button-ghost-fg: var(--color-content-secondary);
--comp-button-ghost-fg-hover: var(--color-content-primary);

--comp-button-danger-fg: var(--color-status-danger);
--comp-button-danger-border: var(--color-status-danger);
--comp-button-danger-bg-hover: color-mix(in srgb, var(--color-status-danger) 10%, transparent);

--comp-button-disabled-bg: var(--color-surface-raised);
--comp-button-disabled-fg: var(--color-content-tertiary);
--comp-button-focus: var(--color-focus-ring);
--comp-button-focus-on-accent: var(--color-focus-ring-on-accent);
```

### 4.4 States

| State | Visual | Accessible signal |
|---|---|---|
| Default | Variant tokens | Native `<button>` |
| Hover | `bg-hover`, `border-hover` | — |
| Pressed | `bg-pressed`, `scale(.98)` | — |
| Focus-visible | 2px ring, 2px offset | Visible outline |
| Disabled | `bg-disabled`, `fg-disabled` | `disabled` + `aria-disabled`; no pointer events |
| Loading | Spinner, preserved width | `aria-busy="true"`, label stays in the accessibility tree |
| Danger confirm | Filled danger only in dialog | Explicit action label |

---

## 5. Fields

### 5.1 Search and text input

```
[ label? ]
[ leading icon? ] [ input ] [ clear? ]
[ helper or error ]
```

- Height: `--size-control-md`; large search `--size-control-lg`.
- Background: `surface.card`; border: `border.control`; radius: `--radius-md`.
- Placeholder: `content.tertiary`.
- Focus: border `focus.ring` + hard 2px ring, 1px offset. No glow.
- Error: border `status.danger`, icon + message; never colour alone.
- Disabled: `surface.sunken`, `content.tertiary`, `aria-disabled`.

### 5.2 Token set

```css
--comp-field-bg: var(--color-surface-card);
--comp-field-bg-disabled: var(--color-surface-sunken);
--comp-field-border: var(--color-border-control);
--comp-field-border-hover: var(--color-border-emphasis);
--comp-field-border-focus: var(--color-focus-ring);
--comp-field-border-error: var(--color-status-danger);
--comp-field-fg: var(--color-content-primary);
--comp-field-placeholder: var(--color-content-tertiary);
--comp-field-label: var(--color-content-secondary);
--comp-field-help: var(--color-content-secondary);
--comp-field-error: var(--color-status-danger);
--comp-field-radius: var(--radius-md);
--comp-field-ring: var(--color-focus-ring);
```

### 5.3 Select, checkbox, radio

- Select uses the same field shell; the chevron is a text/icon pair, not a colour change.
- Checkbox: 18px box, 2px border, `action.primary` fill when checked, dark check on the fill.
- Radio: 18px circle, 2px border, inner dot when selected.
- Both use a 44px touch row; the label is part of the hit area.
- State is expressed by shape + `aria-checked`, never colour alone.

### 5.4 Switch

- Track: 40×23px desktop, 44×26px touch.
- Off: `switch.off` track, `switch.knob`; On: `switch.on` track, `switch.knob-on`.
- Knob position is the second signal; every row also has a state word.
- Focus ring sits outside the track, 2px offset.
- No glow around the knob.

---

## 6. Cards and rails

### 6.1 Title card

```
[ 16:9 still ]
[ badge row ]
[ title ]
[ metadata ]
[ progress? ]
```

- Art: 16:9, `--radius-lg`, `surface.sunken` placeholder.
- Art never lifts, zooms, or glows on hover. Hover changes the **title** to `content.primary` and the border to `border.emphasis`.
- Badges: top-left `FREE`/`NEW`; bottom-left rank; progress pinned to the bottom edge.
- Title: `--type-subheading`, two lines max.
- Metadata: `--type-caption`, one line, `content.secondary`.
- Whole card is one link; the focus ring wraps the card, 2px offset.
- Progress uses `action.primary` on a `media.progress-track`-style track; it has an accessible label with minutes left.

### 6.2 Continue Watching card

- Same art as the title card.
- Title + `S2 E4 · 12m left`.
- Primary action: **Resume**; secondary: overflow.
- Resume is the only place a card auto-plays on open.
- If progress is finished, the card leaves Continue Watching and shows a **Replay** action.
- The remove action is a labelled icon button, not a hover-only control.

### 6.3 Rail

```
[ title ]                         [ See all ] [ ‹ ] [ › ]
[ card ] [ card ] [ card ] [ card ] …
```

- Horizontal scroll with scroll-snap; arrows are optional enhancements.
- Edge fade is a hard mask, not a glow: `mask-image: linear-gradient(90deg, transparent, #000 24px, #000 calc(100% - 24px), transparent)`.
- Arrow buttons use the icon-button token set; hidden when the rail cannot scroll.
- Rail header sticks only inside the rail, never over the player.
- No auto-advancing rails. Any carousel has pause/next/previous and respects reduced motion.
- 8–15 rails maximum on Home; Continue Watching is first.

### 6.4 Token set

```css
--comp-card-bg: var(--color-surface-card);
--comp-card-border: var(--color-border-subtle);
--comp-card-border-hover: var(--color-border-emphasis);
--comp-card-radius: var(--radius-lg);
--comp-card-art-ratio: 16 / 9;
--comp-card-art-bg: var(--color-surface-sunken);
--comp-card-title: var(--color-content-primary);
--comp-card-meta: var(--color-content-secondary);
--comp-card-progress-track: color-mix(in srgb, var(--color-content-primary) 20%, transparent);
--comp-card-progress-fill: var(--color-action-primary);
--comp-card-focus: var(--color-focus-ring);
--comp-rail-gap: var(--space-6);
--comp-rail-header-gap: var(--space-4);
--comp-rail-mask: 24px;
```

---

## 7. Navigation

### 7.1 Sidebar item

| State | Background | Text | Extra |
|---|---|---|---|
| Default | transparent | `content.secondary` | icon at 70% opacity |
| Hover | `surface.raised` | `content.primary` | — |
| Active | `action.soft` | `content.primary` | inset 2px `action.primary` rule, weight 700 |
| Focus | — | — | 2px ring inside the item |
| Disabled | transparent | `content.tertiary` | `aria-disabled` |

### 7.2 Mobile tab bar

Five tabs: **Home · Browse · Search · My List · More**.

- Height: 56px + safe-area inset.
- Icon 22px, label `--type-micro`.
- Active: `surface` uses `action.soft`; icon and label use `content.primary`; a 2px top rule uses `action.primary`; label weight 700. The accent is the rule, not the text.
- Inactive: `content.secondary`.
- Hit area is the full tab, minimum 44px.
- The tab bar never overlays the player controls; it is hidden on Watch.

### 7.3 Token set

```css
--comp-nav-item-fg: var(--color-content-secondary);
--comp-nav-item-fg-hover: var(--color-content-primary);
--comp-nav-item-bg-hover: var(--color-surface-raised);
--comp-nav-item-bg-active: var(--color-action-soft);
--comp-nav-item-rule: var(--color-action-primary);
--comp-nav-item-radius: var(--radius-sm);
--comp-tabbar-bg: var(--color-surface-card);
--comp-tabbar-border: var(--color-border-subtle);
--comp-tabbar-active: var(--color-content-primary);
--comp-tabbar-rule: var(--color-action-primary);
--comp-tabbar-inactive: var(--color-content-secondary);
--comp-tabbar-height: 56px;
```

---

## 8. Chips, badges, and filters

- Chip: 28px height, pill radius, 1px `border.subtle`, `content.secondary`.
- Selected chip: `action.soft` background + `action.primary` border + `content.primary` text + weight 700. Three signals.
- Filter row scrolls horizontally with the same hard mask as a rail.
- Badge: uppercase `--type-micro`, 3px 6px padding, `--radius-xs`.
- Status badges always include a dot or icon **and** a word.
- `Ad`, `Kids`, `NEW`, `FREE`, `SUB`, `DUB`, rank numerals use their Phase 5 tokens; none is colour-only.
- Rank numeral is large but still paired with the title.

---

## 9. Sheets, modals, and popovers

### 9.1 Sheet

```
scrim
┌──────────────────────────────┐
│ title                    ×   │
│ body                          │
│ footer actions                │
└──────────────────────────────┘
```

- Scrim: `overlay.scrim`; no blur, no glow.
- Surface: `surface.card`; border: `border.subtle`; radius: `--radius-xl`; `elevation-3`.
- Desktop: centered, max-width 560px. Mobile: bottom sheet, full width, top radius only.
- Focus is trapped; Escape closes; focus returns to the trigger.
- Scroll lock on the page; the sheet body scrolls independently.
- Footer actions stack on mobile with the primary last.
- Destructive confirmation uses the danger button variant and names the object being deleted.

### 9.2 Token set

```css
--comp-sheet-bg: var(--color-surface-card);
--comp-sheet-border: var(--color-border-subtle);
--comp-sheet-radius: var(--radius-xl);
--comp-sheet-scrim: var(--color-overlay-scrim);
--comp-sheet-elevation: var(--elevation-3);
--comp-sheet-title: var(--color-content-primary);
--comp-sheet-body: var(--color-content-secondary);
--comp-sheet-close-fg: var(--color-content-secondary);
--comp-sheet-close-fg-hover: var(--color-content-primary);
```

---

## 10. Alerts, toasts, and empty states

- Inline alert: `surface.sunken` + 1px `border.subtle` + 3px left rule in the status colour + icon + title + body.
- Toast: `surface.inverse`, `content.inverse`, `--radius-pill`, bottom-center desktop, above the tab bar on mobile. One action maximum.
- Toast duration: 4s for passive, persistent for errors with a dismiss action.
- Empty state: icon, one-sentence cause, one primary action, optional secondary link. No giant illustration.
- Skeleton: `skeleton` block + `skeleton.shine`; reserved dimensions; never a spinner for a content block.

```css
--comp-alert-bg: var(--color-surface-sunken);
--comp-alert-border: var(--color-border-subtle);
--comp-alert-rule: var(--color-status-info);
--comp-toast-bg: var(--color-surface-inverse);
--comp-toast-fg: var(--color-content-inverse);
--comp-skeleton-bg: var(--color-skeleton);
--comp-skeleton-shine: var(--color-skeleton-shine);
```

---

## 11. Player chrome

The player keeps the Phase 5 media tokens. It does not use app surfaces and does not flip with the theme.

### 11.1 Layout

```
┌──────────────────────────────────────────┐
│              video                        │
│                                           │
│  [ big play ]                             │
│  [ scrim ]                                │
│  ▶  ─────────●────────  12:34 / 24:10     │
│  CC  ⚙  ⛶                                │
└──────────────────────────────────────────┘
```

- Controls sit on a bottom scrim; the scrim is a flat gradient from transparent to `media.scrim`.
- Control bar height: 56px desktop, 64px touch.
- Center play button: 56px, `media.control-bg`, 1px `media.control-border`.
- Progress track: 4px visual, 24px hit area; buffered and played ranges are distinct.
- Time: `--type-caption`, tabular numerals, `media.chrome-muted`.
- Icons: 24px, `media.chrome`; hover raises to white and adds a 1px border, no glow.
- Settings, captions, quality, audio, speed, and stats keep their current behavior and labels.
- Subtitles: `media.subtitle-bg` + `media.subtitle-text`; size and background are user settings.
- Error: `media.error` + icon + retry action; never a dead black frame.

### 11.2 Token set

```css
--comp-player-bg: var(--color-media-bg);
--comp-player-chrome: var(--color-media-chrome);
--comp-player-chrome-muted: var(--color-media-chrome-muted);
--comp-player-control-bg: var(--color-media-control-bg);
--comp-player-control-border: var(--color-media-control-border);
--comp-player-scrim: var(--color-media-scrim);
--comp-player-track: var(--color-media-progress-track);
--comp-player-buffered: var(--color-media-progress-buffered);
--comp-player-fill: var(--color-media-progress-fill);
--comp-player-focus: var(--color-media-focus);
--comp-player-subtitle-bg: var(--color-media-subtitle-bg);
--comp-player-subtitle-fg: var(--color-media-subtitle-text);
--comp-player-error: var(--color-media-error);
--comp-player-radius: var(--radius-lg);
```

### 11.3 Preservation contract

These must not regress in any surface:

- Header search still opens the same catalog search.
- Playback, subtitles, quality forcing, audio tracks, speed, and stats remain available.
- Resume works from explicit Resume and Continue Watching only; browse/search/card/deep-link opens paused.
- The five-minute readahead cache is untouched.
- Official embed and direct-file paths are untouched.
- No pre-roll on archive films.

---

## 12. Ads

- Slot background `ad.surface`, border `ad.border`, label `ad.label`, body `ad.text`.
- Visible `Ad` label, always. No disguised native card.
- Reserved height before load; no layout shift.
- Allowed on browse rails/grid and between episodes. Never in Continue Watching, episode rows, Kids, or around the player.
- No ad blocker nag, overlay, or playback block.
- One ad slot per rail maximum; two per grid view maximum.
- CTA uses the secondary button variant, not the primary accent.

```css
--comp-ad-bg: var(--color-ad-surface);
--comp-ad-border: var(--color-ad-border);
--comp-ad-label: var(--color-ad-label);
--comp-ad-text: var(--color-ad-text);
--comp-ad-radius: var(--radius-md);
--comp-ad-min-height: 96px;
```

---

## 13. Responsive contract

| Breakpoint | Width | Behaviour |
|---|---|---|
| `xs` | `< 480px` | One card per row; bottom tab bar; sheet is full-width bottom |
| `sm` | `480–767px` | Two cards; filters scroll |
| `md` | `768–1023px` | Three cards; sidebar collapses to icons |
| `lg` | `1024–1279px` | Four cards; full sidebar |
| `xl` | `≥ 1280px` | Five to six cards; max content width 1440px |

- Page gutter: 16px below `md`, 24px at `md`, 32px at `lg`.
- Player keeps 16:9 at every width; controls stay inside the video bounds.
- No horizontal page scroll at any width.
- Text does not truncate below two lines on cards; titles wrap.

---

## 14. Platform mapping

| Concern | Classic CSS | React | Native |
|---|---|---|---|
| Token source | CSS custom properties on `:root` / `[data-theme]` | `ThemeProvider` object from the same JSON | Same JSON, read before first frame |
| Theme switch | `data-theme` + `colorScheme` | `useSyncExternalStore` for system, context for mode | `useColorScheme()` + persisted mode |
| Component style | Class + component vars | Style object / CSS module using `theme.component.*` | `StyleSheet.create` from `theme.component.*` |
| Focus | `:focus-visible` outline | Same, plus programmatic focus on route change | `focusable`, `accessibilityState`, TV focus |
| Touch target | `min-height: 44px` | Same | `hitSlop` + `minHeight: 44` |
| Reduced motion | `prefers-reduced-motion` | Same | `AccessibilityInfo.isReduceMotionEnabled()` |
| Safe area | `env(safe-area-inset-*)` | Same | `SafeAreaView` / insets |
| Player chrome | Shared media tokens | Same tokens | Same tokens; native controls styled to match |

- Do not fork token values per platform. If a platform needs a different value, add a documented platform override, not an inline hex.
- Classic globals stay compatible: `player.js` and `watch.js` keep their public functions; new tokens are CSS-only.

---

## 15. Component inventory

| Component | Priority | Web classic | React | Native | Phase |
|---|---|---|---|---|---|
| Button / icon button | P0 | yes | yes | yes | 6 |
| Search field | P0 | yes | yes | yes | 6 |
| Title card / Continue card | P0 | yes | yes | yes | 6 |
| Rail | P0 | yes | yes | yes | 6 |
| Player chrome | P0 | yes | yes | yes | 6 |
| Sheet / modal | P0 | yes | yes | yes | 6 |
| Sidebar / tab bar | P0 | yes | yes | yes | 6 |
| Switch / checkbox / radio | P1 | yes | yes | yes | 6 |
| Chip / filter | P1 | yes | yes | yes | 6 |
| Alert / toast | P1 | yes | yes | yes | 6 |
| Skeleton / empty state | P1 | yes | yes | yes | 6 |
| Ad slot | P1 | yes | yes | yes | 6 |
| Badge / rank | P1 | yes | yes | yes | 6 |
| Select / dropdown | P1 | yes | yes | yes | 6 |
| Tooltip | P2 | yes | yes | no | 6 |
| Avatar / profile chip | P2 | yes | yes | yes | 7 |

---

## 16. Accessibility acceptance

Each component ships only when all of these pass:

- Keyboard reachable; visible focus ring in both themes and on media.
- Name, role, and state exposed (`button`, `switch`, `checkbox`, `dialog`, `progressbar`).
- Touch target ≥44px on mobile and native.
- Contrast meets Phase 5: 4.5:1 text, 3:1 boundaries.
- State is not colour-only: icon, word, rule, or position.
- Reduced motion honoured.
- Forced-colours and increased-contrast overrides keep boundaries and focus.
- Zoom to 200% does not clip labels or controls.
- No horizontal scroll at 320px width.
- Player controls work with keyboard only: play/pause, seek, volume, captions, fullscreen, Escape.

### 16.1 Verified component pairs

Computed with the Phase 5 formula. Soft-state ratios use the blended background (accent over card).

| Pair | Dark | Light |
|---|---:|---:|
| Ghost / secondary label on `surface.raised` | 6.42:1 | 5.41:1 |
| Disabled label on `surface.raised` | 4.86:1 | 4.69:1 |
| Danger label on `surface.card` | 8.53:1 | 6.54:1 |
| Danger border on `surface.card` | 8.53:1 | 6.54:1 |
| Active nav label on `action.soft` | 12.53:1 | 15.94:1 |
| Ad label on `ad.surface` | 10.27:1 | 6.21:1 |
| Player muted chrome on media black | 11.25:1 | 11.25:1 |
| Checkbox check ink on accent fill | 6.32:1 | 5.98:1 |
| Switch knob off on off-track | 4.56:1 | 4.34:1 |
| Switch knob on on on-track | 6.32:1 | 5.98:1 |

- `action.primary` is still fill-only in light. The active tab and nav icon use `content.primary`; the accent appears as the 2px rule and the soft background.
- Danger is never filled. A filled light/dark danger would need a theme-specific ink value, and Phase 6 avoids adding one.

---

## 17. Gate — approved

**Outcome:** Approved and locked as `v6.0` on 2026-11-07. The component system, states, and token contract are final. No glow, no card lift, no zoom.

| # | Decision | Locked value |
|---|---|---|
| 1 | **Type scale** | Six-step sans scale in §2.1; no text below 11px |
| 2 | **Spacing / radius / elevation** | 4px-based spacing, 3–14px radius, neutral shadows only |
| 3 | **Control sizes** | 32 / 40 / 48px; 44px touch target; 24px absolute minimum |
| 4 | **Button system** | Primary, secondary, ghost, outlined danger; explicit default/hover/pressed/focus/disabled/loading |
| 5 | **Field system** | Search, text, select, checkbox, radio, switch; hard ring focus, no glow |
| 6 | **Card and rail** | 16:9 stills; no hover lift/zoom; hard edge mask; no auto-advance |
| 7 | **Navigation** | Sidebar item states and five-tab mobile bar in §7 |
| 8 | **Sheets** | Scrim, focus trap, Escape, focus return, no blur/glow |
| 9 | **Player chrome** | Phase 5 media tokens; preservation contract in §11.3 |
| 10 | **Ads** | Labelled, reserved height, contextual placement; no player/Continue Watching/Kids ads |
| 11 | **Platform parity** | One token contract; no per-platform hex |
| 12 | **Motion** | 120/160/240ms; transform only on press; reduced motion instant |
| 13 | **No glow** | No coloured shadow, halo, bloom, ambient wash, or animated shadow in any component |

**Next:** Phase 7 — page-level layouts and responsive composition (Home, Browse, Search, Watch, My List, More, account, and empty/error states).

---

## 18. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First component system draft: type, spacing, radius, elevation, sizes, motion; buttons, fields, cards, rails, navigation, chips, sheets, alerts, player chrome, ads; responsive and platform mapping; inventory; accessibility acceptance; verified component contrast pairs; thirteen gate decisions. |
| `v6.0` | 2026-11-07 | Approved and locked. Active tab/nav icons use `content.primary` with the accent as a rule; danger stays outlined; verified component contrast pairs recorded; no glow anywhere. |
