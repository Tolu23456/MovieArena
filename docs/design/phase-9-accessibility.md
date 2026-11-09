# Phase 9 — Accessibility deep pass

**Status:** Locked `v9.0`
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 5 `v5.0` colour, Phase 6 `v6.0` components, Phase 7 `v7.0` layouts, Phase 8 `v8.0` motion
**Preview:** `docs/design/phase-9-preview.html`
**Target:** WCAG 2.2 Level AA on all three surfaces, with the product targets noted below
**Rule:** Accessibility is the behaviour of the component, not a patch applied after it. If a control cannot be named, reached, operated, and understood without a pointer or without colour, it is not finished.

---

## 1. Intent

Phase 9 turns the earlier decisions into an operable contract:

1. **Every task has a keyboard path.** Find → play, search, episode change, subtitles, quality, my list, consent, and account are all reachable and operable with a keyboard alone on web, and with a screen reader on native.
2. **Every state is announced.** Loading, empty, error, saved, removed, muted, playing, paused, and countdown states have a text equivalent.
3. **Focus is always visible and never lost.** Route changes, dialogs, sheets, player panels, and episode changes move focus deliberately and return it to the trigger.
4. **Colour is never the only signal.** State also carries text, shape, icon, or `aria-*` state.
5. **Media has parity.** Captions, transcripts, keyboard seeking, and volume control work without a pointer. Nothing autoplays with sound.
6. **The three surfaces share one contract.** Web classic, web React, and native implement the same labels, order, and states, using each platform's native semantics.

This phase does **not** claim user testing. It is a source audit, a computed-contrast check, and a specification of acceptance tests to run before launch. Findings marked “current” describe the repository at the time of the audit, not a measured usability study.

---

## 2. Scope and method

### 2.1 Surfaces audited

| Surface | Files |
|---|---|
| Web classic | `index.html`, `watch.html`, `list.html`, `about.html`, `legal.html`, `style.css`, `common.js`, `watch.js`, `player.js`, `links.js`, `custom-links.js` |
| Web React | `apps/web/src/App.jsx`, `apps/web/src/Watch.jsx` |
| Native | `apps/mobile/App.jsx`, `apps/mobile/src/screens/*.jsx`, `apps/mobile/src/components.js`, `apps/mobile/src/theme.js` |

### 2.2 Method

- Static source audit of landmarks, headings, names, roles, states, tab order, event handlers, and live regions.
- Computed WCAG contrast ratios from the exact production tokens and from the locked Phase 5 token set. Ratios are calculated, not sampled from a screen.
- Keyboard-path review of every control rendered by `player.js`, `links.js`, `common.js`, and `watch.js`.
- ARIA pattern review against the WAI-ARIA Authoring Practices for dialog, tabs, combobox/listbox, slider, and disclosure.
- Native review against React Native accessibility props, iOS VoiceOver, and Android TalkBack conventions.

### 2.3 What is not claimed

- No screen-reader session, no keyboard-only usability session, and no participant testing has been run.
- Contrast values are exact for token pairs. Values over photographs, gradients, or third-party embeds are called out as unknown and given a fallback rule.
- Third-party YouTube and Vimeo players are audited at the boundary: what MovieArena controls, labels, and passes through. Their internal DOM is not ours to fix.

---

## 3. Conformance target

WCAG 2.2 Level AA is the floor. The product adds stricter targets where the default is too weak for a media app.

| Area | WCAG target | Product target |
|---|---|---|
| Text contrast | 4.5:1 normal, 3:1 large | 4.5:1 normal, 3:1 large; secondary text ≥ 6:1 |
| Non-text contrast | 3:1 for controls, states, focus | 3:1 against both adjacent colours where possible |
| Target size | 2.5.8: 24×24 CSS px minimum | 44×44 CSS px for primary controls; 24×24 absolute floor |
| Focus appearance | 2.4.7 visible; 2.4.13 is AAA | 2px hard ring, 2px offset, 3:1 against both sides |
| Keyboard | 2.1.1 all functionality | Full parity, including seek, volume, captions, quality |
| Focus not obscured | 2.4.11 | Sticky shell and player chrome never cover the focused item |
| Dragging | 2.5.7 | Every drag has a non-drag alternative (buttons, keys, menu) |
| Consistent help | 3.2.6 | Search, Help, and Account sit in the same order on every surface |
| Redundant entry | 3.3.7 | Consent, profile, and search state persist within a session |
| Accessible authentication | 3.3.8 | Magic link and OAuth; no puzzle, no memorised code required |

---

## 4. Perception — colour, contrast, forced colours

### 4.1 Locked token pairs

Phase 5 already verified the token system. These are the values Phase 9 audits against.

**Dark theme**

| Pair | Ratio | Use |
|---|---:|---|
| `content.primary` `#eef1f5` on `surface.page` `#0c0e12` | 16.9:1 | Body text |
| `content.secondary` `#9aa3b2` on page | 7.3:1 | Supporting text |
| `action` `#ff5c47` on page | 6.0:1 | Accent text and icons |
| `action.ink` `#0c0e12` on `action` `#ff5c47` | 6.0:1 | Filled button label |
| White on `#ff5c47` | 3.1:1 | **Forbidden for normal text** |
| `focus` `#ff8a3d` on page | 8.3:1 | Focus ring |
| `border.control` `#646e7c` on page | 3.6:1 | Input boundaries |

**Light theme**

| Pair | Ratio | Use |
|---|---:|---|
| `content.primary` `#12151b` on `#f6f7f9` | 16.7:1 | Body text |
| `content.secondary` `#5c6472` on page | 5.5:1 | Supporting text |
| `link` `#c0341f` on page | 5.2:1 | Accent text and icons |
| `action.ink` `#12151b` on `#ff5c47` | 6.0:1 | Filled button label |
| White on `#ff5c47` | 3.1:1 | **Forbidden for normal text** |
| `focus` `#c0341f` on page | 5.2:1 | Focus ring |
| `border.control` `#6f7a8c` on page | 4.3:1 | Input boundaries |

### 4.2 Current production gap — white on accent

The current stylesheet uses white labels on the accent gradient:

```css
.btn.primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; }
.chip.active { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; }
.ep.active .ep-num { background: var(--accent); color: #fff; }
.pg.cur { background: var(--accent); color: #fff; }
```

White on `#ff5c47` computes **3.06:1** and white on `#ff8a3d` is lower. This fails 4.5:1 for normal text. Phase 5 locked **dark ink on accent fills**; Phase 9 makes that binding on every filled control, badge, and active state. Nothing changes about the accent hue.

### 4.3 Rules

- **Filled accent:** label uses `action.ink` (dark), never white. Applies to primary buttons, active chips, pagination current, episode number, switches, and the countdown fill label.
- **Accent text on dark:** `#ff5c47` is 6.0:1 on page and 5.4:1 on cards. Acceptable for text.
- **Accent text on light:** raw `#ff5c47` is fill-only. Text and icons use `#c0341f` (5.2:1).
- **Secondary text** must stay ≥ 6:1 on dark and ≥ 4.5:1 on light. Do not use `content.tertiary` for anything a user must read.
- **Borders that carry meaning** (inputs, unchecked switches, player track) need 3:1 against the adjacent surface. Decorative dividers may be lower.
- **Player chrome** is theme-independent: white text on a dark scrim. The scrim must keep ≥ 7:1 over bright video. Use `rgba(0,0,0,.72)` or a solid bar; never a translucent white bar with white text.
- **Focus ring** is a hard 2px outline at 2px offset. It never fades, pulses, or glows. On media and photography, add a 1px dark inset ring so the orange ring keeps 3:1 against both the control and the image.
- **Colour-only state is forbidden.** “Active”, “saved”, “muted”, “selected”, and “error” also carry an icon, text label, underline, or `aria-*` state.
- **No glow.** Bloom, halo, ambient wash, and animated shadow remain banned from Phase 5 onward.

### 4.4 Forced colours and high contrast

Windows High Contrast / `forced-colors: active`, and `prefers-contrast: more`:

```css
@media (forced-colors: active) {
  .btn, .chip, .card, .ep, .vp-btn, input, select { border: 1px solid ButtonBorder; }
  .btn.primary, .chip.active, .pg.cur { background: Highlight; color: HighlightText; }
  .card, .panel, .sheet { background: Canvas; color: CanvasText; }
  :focus-visible { outline: 2px solid Highlight; outline-offset: 2px; }
  .vp-ui, .vp-bar { forced-color-adjust: none; background: CanvasText; color: Canvas; }
  svg { forced-color-adjust: auto; }
}
```

- Gradients are replaced by `Highlight` / `CanvasText` system colours.
- Artwork and thumbnails are content and keep their colours.
- Player chrome opts out of forced-colour adjustment because video needs its scrim; its controls still take system focus colours.
- `prefers-contrast: more` raises borders one step and removes translucency from the header, sidebar, and sheets.
- High-contrast mode must not hide the focus ring, and must not rely on the accent hue.

---

## 5. Keyboard contract

### 5.1 Global — all web surfaces

| Key | Action | Notes |
|---|---|---|
| `Tab` / `Shift+Tab` | Move focus | DOM order is visual order; no positive `tabindex` anywhere |
| `Enter` | Activate link or button | Native behaviour |
| `Space` | Activate button; toggle play when the player owns focus | Never scrolls while the player is focused |
| `/` | Focus header search | Ignored while typing in a field |
| `Escape` | Close the topmost overlay; clear search when the field is focused | Never navigates away |
| `Shift+?` | Open the keyboard-shortcut sheet | Also reachable from the player menu |

### 5.2 Header search

| Key | Action |
|---|---|
| `ArrowDown` | Move into the first result |
| `ArrowUp` / `ArrowDown` inside results | Walk result links |
| `Enter` | Open the focused result |
| `Escape` | Close results and return focus to the input |
| `Tab` | Leave the search; results close on focus out |

Current gap: the input carries `aria-expanded` without `role="combobox"`, and the popup is `role="dialog"`. Phase 9 locks the combobox pattern: input `role="combobox"`, `aria-autocomplete="list"`, `aria-controls`, `aria-expanded`, and the popup `role="listbox"` with `role="option"` children. Focus moves into options, so `aria-activedescendant` is not required. The result count is announced once in a polite live region: “12 results for frieren.”

### 5.3 Cards and rails

- Cards are links or buttons. The whole card is one target; the heart is a separate button when present.
- `ArrowLeft` / `ArrowRight` on a focused rail scroll the rail one card and keep focus on the current card.
- `Home` / `End` jump to the first or last card.
- Cards never open on hover. Hover only changes border and title colour.
- A card exposes one accessible name. When the visible title is already inside the link, the poster image uses `alt=""` so the name is not read twice.

Current gap: React cards render `alt={show.title}` beside a visible title, producing “Frieren, Frieren”. Fix: `alt=""` on the poster, keep the title text.

### 5.4 Episode list

- The list is a list of buttons; the current episode carries `aria-current="true"`.
- `Escape` in the episode search clears it and returns focus to the field.
- Filtering updates a polite status: “14 episodes match ‘12’.”
- Page buttons carry `aria-label` (“Page 3”, “Previous page”) and `aria-current="page"`.
- Selecting an episode moves focus to the player region only when the user asked to play; otherwise focus stays on the episode button.

Current gap: filtered counts are not announced. The active row’s percentage is both visible text and `aria-label`, so it is read twice; keep the label and mark the visible number `aria-hidden`.

### 5.5 Player

| Key | Action |
|---|---|
| `Space` / `K` | Play or pause |
| `J` / `←` | Back 10s |
| `L` / `→` | Forward 10s |
| `↑` / `↓` | Volume ±5% |
| `M` | Mute |
| `F` | Fullscreen |
| `T` | Theater mode |
| `C` | Captions on/off |
| `A` | Cycle audio track |
| `S` | Open settings |
| `N` / `P` | Next / previous episode |
| `0`–`9` | Seek to 0–90% |
| `Home` / `End` | Start / end |
| `[` / `]` | Decrease / increase speed |
| `,` / `.` | Subtitle timing −0.1s / +0.1s |
| `?` | Shortcut sheet |
| `Escape` | Close panel, menu, subtitle search, or hint |

- Shortcuts are disabled while focus is in a text field and while a modifier is held.
- The shortcut sheet lists every key and is reachable from the player menu without a keyboard (so it is discoverable on touch).
- Player shortcuts must not fire when focus is in another interactive control outside the player, except the global media keys that the player explicitly owns.

Current gap: the progress bar is a `div` with pointer handlers only. It has no `role="slider"`, no `tabindex`, and no accessible value. Phase 9 locks it as a slider:

```html
<div class="vp-progress" role="slider" tabindex="0"
     aria-label="Playback position" aria-valuemin="0" aria-valuemax="100"
     aria-valuenow="48" aria-valuetext="12:34 of 24:10">
```

`←` / `→` seek ±5s, `Home` / `End` seek to start/end, and `PageUp` / `PageDown` seek ±60s. The buffered range is exposed as `aria-describedby` text, not a second slider.

### 5.6 Menus, panels, and dialogs

- **Settings panel:** opens as a non-modal dialog. Focus moves to the panel heading or first control; `Escape` closes and returns focus to the gear. It is not trapped, because the player behind it remains usable.
- **Subtitle search:** modal dialog. Focus moves to the query field, `Tab` is trapped, `Escape` closes, and focus returns to the subtitles button.
- **Provider modal (`links.js`):** already modal with a trap and focus restore. Keep it; add `aria-describedby` for the “official embed” note.
- **Native sheets:** modal, `accessibilityViewIsModal`, focus to the title, back gesture closes, and focus returns to the trigger.

---

## 6. Focus order and focus management

### 6.1 Page order

```text
Skip link
Header: brand → search → account
Sidebar / mobile tabs: primary navigation
Main:
  h1
  primary action
  hero / continue row
  rails in visual order
  filters
  catalog grid
Footer
```

- No positive `tabindex`. Only `0` and `-1`.
- The skip link is the first focusable item, visually hidden until focused, and targets `<main id="main">`.
- The skip link is injected by `common.js` today. Phase 9 requires it in the static HTML too, so it exists before JavaScript runs.

Current gap: React has no skip link. Add one in the app shell, not per page.

### 6.2 Route changes

- Web classic: a full page load starts at the top with normal browser focus. On same-page hash changes (`?section=`, home show dialogs), focus moves to the changed heading.
- React: after a hash-route change, focus the new `h1` with `tabindex="-1"` and update `document.title`. Back restores the previous scroll position and the triggering card’s focus.
- Native: pushing Watch moves accessibility focus to the back control and the title; popping returns focus to the originating card.

Current gap: React never updates the title or moves focus. Add a route effect in `App.jsx` and `Watch.jsx`.

### 6.3 Focus visibility

- `:focus-visible` is the only focus style. Mouse clicks do not draw the ring; keyboard and switch input do.
- The ring is `2px solid var(--focus)` at `2px` offset. Never `outline: none` without a replacement.
- Search fields currently set `outline: none` and only change the border colour. That is not a sufficient focus indicator. They keep the border change **and** gain the standard ring.
- Focus never lands under the fixed header, sidebar, player bar, or mobile tab bar. Use `scroll-margin` and `scroll-padding-top`.
- The player must not auto-hide its controls while focus is inside them. Current `_wake()` hides after 2.8s when playing and no menu is open; it does not check focus. Phase 9 locks: if `document.activeElement` is inside the player chrome, controls stay visible.
- A focused control is never removed from the DOM by an auto-refresh, filter, or countdown without moving focus first.

### 6.4 Returning focus

| Action | Focus returns to |
|---|---|
| Close provider modal | The card or button that opened it |
| Close settings panel | The settings button |
| Close subtitle search | The subtitles button |
| Cancel a sheet | The trigger |
| Delete from My List | The next card, or the empty-state heading |
| Sign out | The account entry point |
| Close the shortcut sheet | The help button |

The current provider modal and the Phase 8 sheet already restore focus. The player panel needs the same treatment.

---

## 7. Screen-reader contract

### 7.1 Landmarks and headings

- One `<main>` per page, one `<header>`, one `<nav aria-label="Primary">`, one `<footer>`.
- One `<h1>` per page. `list.html` currently has **none** — its first heading is an `h2`. Fix: “Everything on MovieArena” becomes the `h1`.
- Heading levels never skip. Card titles are not headings; rail titles are `h2`.
- Each rail is a `<section>` with `aria-labelledby` pointing at its heading.

### 7.2 Names, roles, values

- Every icon-only button has `aria-label`. The current player does this well; keep it.
- Decorative glyphs and SVG are `aria-hidden="true"`.
- Toggle buttons expose `aria-pressed`; tabs expose `role="tab"`, `aria-selected`, and `aria-controls`; switches expose `role="switch"` and `aria-checked`.
- The volume input keeps `aria-label="Volume"` and reports `aria-valuetext` as a percentage.
- The progress slider reports elapsed and total time in `aria-valuetext`.
- The theme control exposes the current resolved theme, not just “System”.
- “FREE” and source badges are read as text; do not rely on the badge colour.

### 7.3 Live regions

| Event | Region | Politeness |
|---|---|---|
| Search result count | Header search status | polite |
| Episode filter count | Episode list status | polite |
| Saved / removed | Toast | polite |
| Playback state change caused by the user | Player caption status | polite, atomic |
| Autoplay countdown | Countdown text | polite, once per second is too noisy — announce at 8, 5, and 1 |
| Error | Inline `role="alert"` | assertive |
| Loading a route | `aria-busy="true"` on main | — |

- Captions are **not** a live region. Spoken captions belong to the media track, not the screen reader. The current `role="status" aria-live="polite"` on the caption element should be removed or set to `aria-live="off"`; otherwise every subtitle line interrupts the screen reader.
- Toast regions are mounted once and only their text changes. Do not recreate the live region node.

### 7.4 Media semantics

- The player shell is a labelled region: `role="region" aria-label="Video player"`.
- The `<video>` element has a `<track kind="captions">` when a caption file exists, plus `aria-describedby` to the title and source.
- The YouTube iframe gets an explicit `title` attribute after the API creates it. The API does not set one by default. Format: `"{show} — {episode} — official video"`.
- The transcript panel is a labelled list of buttons; the current cue is `aria-current="true"`.
- Time displays are text, not sliders. Only the progress bar is a slider.

---

## 8. Target sizes

WCAG 2.2 requires 24×24 CSS px. MovieArena targets 44×44 for primary controls and 24×24 as the absolute floor.

| Control | Current | Target | Action |
|---|---|---|---|
| Primary buttons (`.btn`) | ~35px tall (~43px for `.big`) | 44px | Raise min-height |
| Header search field | 40px tall | 44px | Raise height |
| Player transport buttons | 34px desktop / 30px mobile | 44px | Raise to 40px minimum inside the bar, 44px on touch layouts |
| Player progress track | 4px visual, 20px hit area | 44px hit area | Add a transparent hit area; keep the 4px visual |
| Episode rows | ~35px desktop / 48px mobile | 44px | Raise desktop min-height |
| Rail arrows | 32px | 44px | Raise |
| Heart / favourite | 32px | 44px | Raise hit area with `hitSlop` on native |
| Chips | ~30px | 36px minimum | Raise with spacing |
| Pagination buttons | 36px | 44px | Raise |
| Native tab bar | ~44px | 48px | Raise |

Exceptions: inline text links inside a sentence, and controls with 24px visible size that have at least 24px spacing on all sides. Exceptions are listed in the component doc, not improvised per page.

---

## 9. Media accessibility

### 9.1 Captions

- Captions are available wherever the source provides them, and can be toggled by button and by `C`.
- The choice is remembered per profile. Default is on when the OS caption preference is set, otherwise off until the user chooses.
- Captions use the media token colours: white on a 72% black box, 16px minimum, maximum two lines, no overlap with the player bar.
- Burned-in captions cannot be turned off; the UI says “Captions are part of this video” instead of offering a toggle that does nothing.
- Caption text is selectable and exposed to the DOM so browser translation and reader-mode tools can reach it.

### 9.2 Transcripts

- The side-panel transcript satisfies the text-alternative requirement for owned and public-domain media.
- Each cue is a button that seeks to its timestamp, with `aria-label="12:34 — subtitle text"`.
- The panel is a labelled region with a close button and focus restore.
- Transcripts stay available even when captions are off.

### 9.3 Audio description

- Where the rights-holder supplies an audio-description track, it appears in the audio menu with the label “Audio description”.
- For public-domain films without an AD track, MovieArena does not claim one exists. The Watch page offers the transcript and a written synopsis as the text alternative.
- Third-party embeds may not expose AD. The UI states the available tracks; it never fabricates a control that does nothing.

### 9.4 Autoplay

- No media autoplays with sound. Entry from browse, search, a card, or a deep link opens paused.
- Only an explicit Resume or Continue Watching action starts playback, and it starts from the stored position.
- Autoplay-next is opt-in, has an 8s visible countdown, and can be cancelled by keyboard, pointer, or screen reader action.
- `prefers-reduced-motion` does not change playback, only the countdown’s animated fill.

### 9.5 Flashing and motion

- No content flashes more than three times per second. No strobing loading state.
- Motion follows Phase 8. Reduced motion removes translation, fade, shimmer, and auto-rotation without removing function.

---

## 10. Forms and errors

- Every field has a persistent visible label or an `aria-label`; placeholder text is never the only label.
- Errors are inline, next to the field, with `role="alert"`, and are also summarised at the top of the form when more than one field fails.
- Error text states what happened and how to fix it. “Enter a valid email” — not “Invalid input”.
- Required fields use the `required` attribute and a visible “Required” note, not just an asterisk.
- Password fields offer show/hide with a labelled toggle.
- Magic-link and OAuth flows avoid memory tests and time limits. A one-time code is copyable and never expires mid-typing.
- Search fields are not forms that reload the page; they filter live and announce the count.

Planned account surfaces must inherit these rules before they ship.

---

## 11. Player accessibility specification

### 11.1 Structure

```text
region "Video player"
  heading (visually hidden): show — episode
  video / iframe (title set)
  status: playback state
  controls
    slider: playback position
    button: play/pause
    button: back 10s
    button: forward 10s
    button: previous episode
    button: next episode
    button: mute (pressed state)
    slider: volume
    button: audio track
    button: subtitles (pressed state)
    button: quality
    button: speed
    button: settings
    button: picture in picture
    button: theater (pressed state)
    button: fullscreen
  panel "Player settings" (non-modal)
    tablist: Playback / Audio & subs / Extras
    tabpanel
  dialog "Subtitles search" (modal)
  transcript region
```

### 11.2 Rules

- Open paused. The big play button is the first control in the tab order after the video.
- The video surface is not focusable; the controls are. Clicking the surface toggles play only for pointer users; keyboard users use the play button or `Space`.
- Controls stay visible while paused, while focus is inside them, while a menu or panel is open, and while the pointer is over the bar. They auto-hide only during playback with focus outside.
- The seek slider has a 44px hit area; the visual track stays 4px.
- Volume is a real range input and also responds to `↑`/`↓` when the player has focus.
- Menus close on `Escape`, on focus out, and on selection; focus returns to the trigger.
- The settings tabs use arrow-key navigation and `aria-selected`; only the active panel is in the tab order.
- The “Next episode” countdown exposes Cancel and Play now before the countdown ends.
- The player never traps focus. Only the subtitle-search dialog is modal.
- Errors (“This source did not respond”) are inline, with a retry button and a link to the official source.
- The player works at 200% zoom and 320 CSS px width without horizontal scrolling; the bottom bar wraps or collapses into an overflow menu.

### 11.3 Current player gaps

| Gap | Priority |
|---|---|
| Progress bar is pointer-only, no slider role or value | P0 |
| Controls can auto-hide while keyboard focus is inside them | P0 |
| Settings panel does not move or restore focus | P1 |
| Settings tabs lack arrow-key navigation and initial `aria-selected="false"` | P1 |
| YouTube iframe created by the API has no `title` | P1 |
| Caption line is a polite live region, so it interrupts screen readers | P1 |
| Transport buttons are 30–34px | P1 |
| Shortcut sheet is pointer-only to discover | P2 |
| Volume slider has no `aria-valuetext` percentage | P2 |

---

## 12. Ads accessibility

Ads ship later, but the contract is set now.

- Ads are labelled “Ad” in text, not only by colour or position.
- An ad never steals focus, never opens a modal on load, and never plays sound before the user has interacted with the page.
- Skip and mute controls are real buttons, reachable by keyboard, with a visible countdown.
- Ad video controls follow the same keyboard and caption rules as the player.
- No ad flashes or strobes. No auto-expanding ad covers content or focus.
- Sponsor cards are links with a clear accessible name that includes “Sponsored”.
- Ads are absent from Kids profiles.
- Ad consent is never bundled into a control that also starts playback.

---

## 13. Kids profile accessibility

- Same keyboard, focus, and screen-reader contract as the adult profile.
- Simpler language and larger targets: 48px minimum for primary actions.
- No ads, no external links, no account upsell inside playback.
- Exit is always a labelled button with a parent check that is operable by keyboard and screen reader.
- Content labels use plain words (“Cartoons”, “Movies”) and avoid genre jargon.
- No autoplay with sound; the same paused-entry rule applies.

---

## 14. Native accessibility

### 14.1 Roles, labels, and state

| Element | Required props |
|---|---|
| Poster card | `accessibilityRole="button"`, label `"{title}, {episodes} episodes, free"`, `accessibilityHint="Opens details"` |
| Heart | `accessibilityRole="button"`, label `"Save {title}"` / `"Remove {title} from My List"`, `accessibilityState={{ selected }}` |
| Tab | `accessibilityRole="tab"`, `accessibilityState={{ selected }}`, label |
| Chip / sort | `accessibilityRole="button"`, `accessibilityState={{ selected }}` |
| Search field | `accessibilityLabel="Search titles"`, `accessibilityHint="Typos are allowed"`, `returnKeyType="search"` |
| Episode row | `accessibilityRole="button"`, label `"Episode {n}, {title}"`, `accessibilityState={{ selected }}` |
| Audio track pill | role button, state selected |
| Player WebView | `accessible`, `accessibilityLabel="Video player: {title}"`, plus native controls described below |

Current gap: only `PosterCard` has a role and label. The heart is a nested `Pressable` with no label, role, or state, which is the most serious native issue. Nested pressables also confuse TalkBack focus. Fix: move the heart out of the card’s pressable subtree, or give it its own focusable node with a label and state.

### 14.2 Focus and navigation

- The tab bar is a tablist: each tab exposes role and selected state; focus moves with the platform’s swipe order.
- Opening Watch sets accessibility focus to the back button and title; closing returns focus to the card.
- The hardware back button follows the visual hierarchy: player → list → home.
- Modal sheets set `accessibilityViewIsModal`; content behind them is not focusable.
- Decorative images use `accessible={false}` and empty labels.

### 14.3 Type, motion, and feedback

- Support dynamic type: no fixed heights on text containers, `allowFontScaling` stays on, and text wraps instead of clipping. Test at 200%.
- Respect `AccessibilityInfo.isReduceMotionEnabled`; skip non-essential transitions and haptics.
- Haptics fire only on save, confirm, and error, never on scroll or hover.
- Loading uses `accessibilityLiveRegion="polite"`; errors use `"assertive"`.
- Contrast follows the same token floor as the web. Current mobile tokens: muted 7.7:1 on page, accent 6.3:1, white on accent 3.1:1 (forbidden).

### 14.4 The embedded player

The WebView player is the hardest native surface.

- Give the WebView an accessible label and a short instruction: “Video player. Playback controls are inside.”
- Expose native mirror controls for play/pause, seek ±10s, mute, captions, and fullscreen above or below the WebView, so VoiceOver and TalkBack users are not dependent on the web DOM.
- If the embedded page cannot be operated by the screen reader, the native controls remain the supported path.
- Captions stay available through the native mirror control.
- The WebView must not autoplay with sound.

---

## 15. Zoom, reflow, and text spacing

- 200% browser zoom and 400% reflow at 320 CSS px: no horizontal scrolling, no clipped text, no hidden actions.
- Text spacing overrides (line height 1.5, paragraph 2, letter 0.12em, word 0.16em) do not clip buttons or badges.
- The sidebar collapses before content is squeezed. The player bar wraps into an overflow menu.
- Fixed heights are replaced by `min-height` on anything containing text.
- Landscape phone: the player takes the width; the episode list moves below.

---

## 16. Audit matrix

Legend: **P0** blocks launch, **P1** blocks the phase, **P2** polish.

### 16.1 Web classic

| # | Finding | Priority |
|---|---|---|
| 1 | `list.html` has no `h1` | P0 |
| 2 | White text on accent fills is 3.06:1 | P0 |
| 3 | Search and episode inputs set `outline: none` with no ring | P0 |
| 4 | Player progress bar is pointer-only, no slider semantics | P0 |
| 5 | Player controls auto-hide while focus is inside them | P0 |
| 6 | Settings panel does not move or restore focus | P1 |
| 7 | Settings tabs lack arrow keys and initial state | P1 |
| 8 | YouTube iframe has no `title` | P1 |
| 9 | Caption line is a polite live region | P1 |
| 10 | Transport targets are 30–34px | P1 |
| 11 | Search uses `aria-expanded` without combobox/listbox roles | P1 |
| 12 | No forced-colours or `prefers-contrast` rules | P1 |
| 13 | Reduced-motion block kills spinners and all transitions indiscriminately | P1 |
| 14 | Card lift, image zoom, hero animation and hover shadows conflict with Phase 4–8 | P1 |
| 15 | Focus ring can fall below 3:1 over artwork | P1 |
| 16 | Skip link exists only after JavaScript runs | P2 |
| 17 | Episode filter count is not announced | P2 |
| 18 | Active episode percentage is announced twice | P2 |
| 19 | Header search is 40px tall | P2 |
| 20 | Shortcut sheet is not discoverable without a pointer | P2 |

### 16.2 Web React

| # | Finding | Priority |
|---|---|---|
| 1 | Grid search sets inline `outline: none` with no ring | P0 |
| 2 | No skip link | P1 |
| 3 | Card accessible name repeats the title via poster `alt` | P1 |
| 4 | Route change does not update title or move focus | P1 |
| 5 | Mobile tab bar has no `aria-current` | P1 |
| 6 | Loading and error states have no live status | P2 |
| 7 | Top navigation has no `aria-current` | P2 |
| 8 | “Show not found” has no `h1` | P2 |
| 9 | Smooth scroll ignores reduced motion | P2 |

### 16.3 Native

| # | Finding | Priority |
|---|---|---|
| 1 | Heart is a nested, unlabelled `Pressable` with no state | P0 |
| 2 | White on accent fills is 3.06:1 | P0 |
| 3 | WebView player has no accessible native control path | P0 |
| 4 | Tabs lack role and selected state | P1 |
| 5 | Chips and sort controls lack selected state | P1 |
| 6 | Search field lacks a label and hint | P1 |
| 7 | Opening Watch does not move accessibility focus | P1 |
| 8 | Loading and error have no live region | P2 |
| 9 | Reduced motion and dynamic type are not handled | P2 |
| 10 | Heart, chips, and tabs are below 44px | P2 |
| 11 | Decorative images are not marked `accessible={false}` | P2 |

---

## 17. Remediation plan

Production changes begin after this gate. Order is by user impact.

1. **Accent ink:** swap every filled accent label from white to `action.ink`; verify all active states. One token rule, many call sites.
2. **Focus:** restore a visible ring on all search fields; add the dual ring on media; remove `outline: none` wherever it has no replacement.
3. **Headings and skip links:** add `h1` to `list.html`; put the skip link in static HTML and React; keep the JS injection as a fallback.
4. **Player seek:** convert the progress bar to a focusable slider with value text and arrow-key seeking.
5. **Player focus:** never auto-hide while focus is inside; move and restore focus for the settings panel; add arrow keys to the tabs.
6. **Media:** remove the live region from captions; set the iframe title; keep transcripts.
7. **Targets:** raise primary controls to 44px and player transport to at least 40px with 44px touch layouts.
8. **Search semantics:** combobox + listbox pattern, result count announcement.
9. **Contrast and modes:** forced-colours and `prefers-contrast` rules; tighten the reduced-motion block with the Phase 8 spinner exception.
10. **Native:** heart fix, tab roles and states, search label, focus on open, reduce-motion, dynamic type.
11. **Regression:** re-run the link, header, page-smoke, provider, and watch/modal tests after each production change.

---

## 18. Acceptance checklist

Run before launch and after any component change. This is a test plan, not a record of completed testing.

### Keyboard

- [ ] Skip link is the first `Tab` stop and reaches `<main>`.
- [ ] Every interactive element is reachable in visual order with no positive `tabindex`.
- [ ] The focus ring is visible on every control, including search fields, cards, chips, tabs, sliders, and the player.
- [ ] The focus ring is never hidden by the fixed header, sidebar, player bar, or tab bar.
- [ ] `Escape` closes the topmost overlay and returns focus to its trigger.
- [ ] Dialogs trap focus; non-modal panels do not.
- [ ] The player is fully operable with `Space`, arrows, `J/K/L`, `M`, `C`, `F`, `S`, and `Escape`.
- [ ] Seeking works from the focused slider with arrows, `Home`, `End`, `PageUp`, `PageDown`.
- [ ] Controls do not auto-hide while focused.
- [ ] No drag-only interaction exists.

### Screen reader

- [ ] One `h1` per page; headings descend without skips.
- [ ] Landmarks are named and unique.
- [ ] Every icon-only control has a name.
- [ ] Toggles expose pressed/checked state; tabs expose selected state.
- [ ] The progress slider reports position and duration.
- [ ] Search and filter counts are announced.
- [ ] Captions do not interrupt the screen reader.
- [ ] Toasts are announced once, from a stable live region.
- [ ] The iframe has a descriptive title.
- [ ] Cards are read once, not twice.

### Visual

- [ ] Text contrast ≥ 4.5:1; large text ≥ 3:1; secondary ≥ 6:1 dark.
- [ ] Non-text controls and focus ≥ 3:1.
- [ ] No white label on an accent fill.
- [ ] State is never conveyed by colour alone.
- [ ] Forced-colours mode keeps all controls visible and operable.
- [ ] 200% zoom and 400% reflow at 320px have no horizontal scroll or clipping.
- [ ] Text-spacing overrides do not clip.

### Media

- [ ] Nothing autoplays with sound.
- [ ] Captions can be toggled and the choice persists.
- [ ] Transcript cues seek on activation.
- [ ] Audio-description availability is stated truthfully.
- [ ] Autoplay-next countdown can be cancelled by keyboard and screen reader.
- [ ] No flashing above three times per second.

### Native

- [ ] VoiceOver and TalkBack can reach every control.
- [ ] The heart has a name and selected state and is not nested in the card pressable.
- [ ] Tabs expose role and selected state.
- [ ] Watch open and close move focus correctly.
- [ ] The WebView has a native control alternative.
- [ ] Dynamic type at 200% does not clip.
- [ ] Reduced motion removes non-essential motion.

---

## 19. Gate — approved

**Outcome:** Approved and locked as `v9.0` on 2026-11-07. The accessibility contract is binding on all three surfaces.

| # | Decision | Locked value |
|---|---|---|
| 1 | **Conformance** | WCAG 2.2 AA on web classic, web React, and native; product targets above the floor |
| 2 | **Targets** | 44×44 for primary controls, 24×24 absolute floor, documented exceptions |
| 3 | **Focus** | 2px ring, 2px offset, dual ring on media, never removed |
| 4 | **Filled accent** | Dark ink on accent everywhere; white on accent banned |
| 5 | **Seek** | Progress bar becomes a focusable slider with value text and key seeking |
| 6 | **Player focus** | Controls never auto-hide while focused; panel moves and restores focus |
| 7 | **Captions** | Available wherever the source has them; remembered per profile; not a live region |
| 8 | **Audio description** | Exposed when supplied; transcript and synopsis otherwise; never fabricated |
| 9 | **Autoplay** | No sound autoplay; explicit resume only; accessible countdown |
| 10 | **Search pattern** | Combobox + listbox, result count announced |
| 11 | **Modes** | Forced-colours and prefers-contrast rules; reduced motion per Phase 8 |
| 12 | **Native** | Roles, labels, and states everywhere; WebView has native mirror controls |
| 13 | **Kids and ads** | Same contract; no ads in Kids; no focus theft or sound from ads |
| 14 | **Verification** | Manual keyboard + screen-reader checklist; no user-testing claims |

**Next:** Phase 10 — content, copy, and legal rewrite.

---

## 20. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First accessibility deep pass: WCAG 2.2 AA target, computed token contrast, keyboard map, focus order and restoration, screen-reader contract, target sizes, captions and transcripts, player specification, ads, Kids, native, forced colours, zoom and reflow, 40-item gap matrix, remediation order, acceptance checklist, fourteen gate decisions. |
| `v9.0` | 2026-11-07 | Approved and locked. Conformance, targets, focus, accent ink, seek slider, player focus, captions, audio description, autoplay, search pattern, forced colours, native contract, Kids/ads, and verification method are binding. |
