# Phase 8 — Motion and interaction choreography

**Status:** Locked `v8.0`
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 6 `v6.0` motion tokens, Phase 7 `v7.0` layouts
**Preview:** `docs/design/phase-8-preview.html`
**Rule:** Motion explains a change. It never decorates, never glows, and never blocks input.

---

## 1. Intent

Phase 6 set durations and Phase 7 set frames. Phase 8 sets the cues:

1. **Motion is functional.** It shows where a surface came from, confirms a press, or reveals controls. If a change is understandable without motion, it does not animate.
2. **Motion is cheap.** Only `transform` and `opacity` animate on the compositor. Colour and border transitions are allowed. Width, height, top, left, filter, and box-shadow do not animate.
3. **Motion is interruptible.** Every enter animation can be reversed mid-flight. Nothing queues behind a transition.
4. **Reduced motion is a first-class mode.** It removes translation, shimmer, cross-fade, and auto-rotation. It never removes function.
5. **No glow, no lift, no zoom, no parallax.** Cards do not move on hover. Buttons press. Sheets slide. Nothing pulses.

---

## 2. Motion tokens

Inherited from Phase 6, extended with cue tokens.

| Token | Value | Use |
|---|---|---|
| `--motion-instant` | `0ms` | Focus rings, errors, captions, theme switch under reduced motion |
| `--motion-fast` | `120ms` | Press, border, small state changes |
| `--motion-base` | `160ms` | Hover, fade, toast, player controls, scrim |
| `--motion-theme` | `150ms` | Theme colour swap only; inherited from Phase 5 |
| `--motion-slow` | `240ms` | Sheet enter, hero cross-fade, native push |
| `--ease-standard` | `cubic-bezier(.2,.7,.2,1)` | Enter and state change |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | Dismiss and leave |
| `--ease-linear` | `linear` | Spinners, progress, countdown |

Rules:

- No transition or entrance animation above 240ms in the product UI. Loops (spinner, skeleton, countdown interval) are not transitions. Native platform transitions may use their system duration.
- No spring, bounce, overshoot, or elastic easing.
- `--motion-instant` is not a transition; it is the absence of one.
- Duration and easing never change per theme.

---

## 3. Input and feedback

### 3.1 Hover

| Component | Property | Duration |
|---|---|---|
| Button | background, border | `--motion-fast` |
| Card | border, title colour | `--motion-base` |
| Nav item | background, colour | `--motion-fast` |
| Rail arrow | background, border | `--motion-fast` |
| Chip | border, colour | `--motion-fast` |
| Input shell | border | `--motion-fast` |

- No transform on hover. No card lift, no art zoom, no shadow growth.
- Hover is optional; nothing depends on it.

### 3.2 Press

| Component | Feedback | Duration |
|---|---|---|
| Button | fill change + `scale(.98)` | `--motion-fast` |
| Icon button | background change + `scale(.96)` | `--motion-fast` |
| Card | border + title colour only | `--motion-fast` |
| Chip | background + border only | `--motion-fast` |
| Tab | background + rule only | `--motion-fast` |

- Press feedback must be visible with the pointer held down.
- Release returns at `--motion-fast`.
- Cards never scale; their art never moves.

### 3.3 Focus

- Focus ring appears **instantly**. Never fade a focus ring.
- Ring: 2px, 2px offset; `focus.onAccent` on accent fills.
- Programmatic focus after a route change or sheet close is instant.
- Suppress the ring only for pointer focus with `:focus:not(:focus-visible)`.

### 3.4 Disabled and loading

- Disabled: no transition, no hover, no press, `cursor: not-allowed`.
- Loading: button width is preserved; label remains in the accessibility tree; spinner runs at `700ms linear` infinite.
- No skeleton shimmer on a control; spinners are for actions only.

---

## 4. Navigation and page changes

### 4.1 Route change — classic and React

```
old content: removed instantly
new content: opacity 0 → 1 over 120ms
focus: h1, instantly
scroll: top (new route) or restored (Back)
```

- Do **not** slide the whole page on web. The shell stays still.
- Content may fade in over `--motion-fast`; the header, sidebar, and tab bar do not animate.
- The old page is removed immediately; there is no cross-fade between two full pages.
- Back restores scroll and focus without animation.
- Reduced motion: instant swap, no fade.

### 4.2 Route change — native

- Use the platform stack transition (push/pop). Do not custom-animate a full-screen page.
- Tab changes swap instantly; no slide between tabs.
- Hardware back follows the platform gesture.

### 4.3 Theme switch

- Colour, background, and border transition at `--motion-theme` (150ms) with `ease`.
- No transform, no image fade, no page re-render animation.
- Reduced motion: instant.
- Do not transition the player chrome, video, or key art.

### 4.4 Hero rotation

- Cross-fade between stills at `--motion-slow`.
- Interval: 8s; pause on hover, focus, or when the tab is hidden.
- A visible pause/resume control is always available; auto-rotation must satisfy WCAG 2.2.2.
- No Ken Burns, no zoom, no pan, no parallax.
- Reduced motion: rotation stops; previous/next and pause remain available, and manual changes swap instantly.
- The hero does not auto-advance while a sheet is open.

---

## 5. Rails and grids

### 5.1 Rail scroll

- Pointer: native horizontal scroll with scroll-snap.
- Arrow buttons: scroll by one card width using the platform's smooth scroll; the design target is 240ms with standard easing. Never use a custom rAF scroll loop.
- Reduced motion: arrow buttons jump instantly.
- Keyboard: arrow keys scroll one card; Home/End jump to ends.
- Edge mask is static; it does not animate.
- No auto-advance, no marquee, no infinite loop.

### 5.2 Grid changes

- Filter or sort: content swaps instantly; no reflow animation.
- Load more: new rows appear instantly; focus stays on the Load more button.
- Skeleton to content: 120ms opacity cross-fade, dimensions unchanged.
- Removed item: no collapse animation; the grid reflows instantly.

---

## 6. Sheets and modals

### 6.1 Enter

```
scrim: opacity 0 → 1 at 160ms
panel: translateY(16px) → 0 at 240ms, ease-standard
content: no separate animation
```

- Desktop: centered panel, translateY only; no scale.
- Mobile: bottom sheet, translateY only.
- Focus moves into the sheet after the panel starts; focus is never delayed by the animation.
- Reduced motion: instant appear.

### 6.2 Exit

- Panel: translateY(0) → 12px at 160ms, ease-exit.
- Scrim: opacity → 0 at 160ms.
- Focus returns to the trigger immediately on close, not after the animation.
- The page scroll unlocks at close start.
- Escape and scrim click use the same exit.

### 6.3 Interruption

- Reopening during exit cancels the exit and enters from the current position.
- Closing during enter reverses from the current position.
- No queue, no lockout, no “animation in progress” state.

### 6.4 Drag (native and mobile web)

- The sheet follows the finger 1:1.
- Release: if dragged past 35% or velocity is high, dismiss; otherwise settle back.
- No rubber-band beyond the top.
- Reduced motion does not disable drag; it removes the settle animation.

---

## 7. Player choreography

### 7.1 Control visibility

- Controls appear on pointer move, tap, focus, or key press: 160ms opacity.
- Auto-hide after **2.5s** of inactivity while playing.
- Never hide while paused, while a menu is open, while focus is inside the controls, or while dragging the seek bar.
- Cursor hides with the controls.
- Reduced motion: controls show/hide instantly.

### 7.2 Play and pause

- Center play button fades out at 120ms when playback starts.
- No scale, no ripple, no glow.
- Poster-to-video swap: instant; the poster is removed when the first frame is ready.

### 7.3 Seek and progress

- Dragging the seek bar is 1:1; the tooltip updates immediately.
- Played range uses `transform: scaleX()`; never animate `width`.
- During playback, progress updates every frame without a CSS transition.
- Buffered range updates instantly.
- Chapter markers are static.

### 7.4 Menus and settings

- Settings, captions, quality, audio, speed, and stats panels fade in at 120ms, fade out at 120ms.
- No slide, no bounce.
- Menu open keeps the controls visible and cancels auto-hide.
- Escape closes the menu first, then exits fullscreen.

### 7.5 Autoplay next

- Countdown: 8s, static number + progress fill updated once per second.
- No pulsing, no flashing, no glow.
- **Cancel** and **Play now** are always visible.
- Reduced motion: countdown still runs; no animated fill, use a numeric countdown only.
- Autoplay-next respects the user setting and never runs for archive films.

### 7.6 Errors and buffering

- Buffering: a static spinner at `700ms linear`; no pulsing overlay.
- Error: appears instantly with icon, message, and retry.
- No shake, no flash, no red flash frame.
- Recovery swaps the player source without a full-page transition.

---

## 8. Feedback surfaces

| Surface | Enter | Exit | Notes |
|---|---|---|---|
| Toast | opacity + translateY(8px), 160ms | 120ms | 4s passive; persistent for errors |
| Inline alert | instant | instant | No entrance animation |
| Skeleton | shimmer 1.4s linear | instant | Static under reduced motion |
| Spinner | 700ms linear infinite | instant | Actions only |
| Progress | transform 120ms on seek | — | No transition during playback |
| Theme swap | 150ms colour | — | No transform |
| Error | instant | instant | Never shake |
| Empty state | instant | instant | No illustration animation |

---

## 9. Reduced motion

`prefers-reduced-motion: reduce` (web) and `AccessibilityInfo.isReduceMotionEnabled()` (native) must:

- Remove page fade, hero cross-fade, sheet translate, toast translate, and skeleton shimmer.
- Keep focus rings instant.
- Keep functional gestures (drag, swipe back, scrub) but remove settle animations.
- Keep spinner rotation only where it communicates progress; otherwise use static text.
- Keep the autoplay countdown, but use a numeric countdown without an animated fill.
- Never disable playback, navigation, or controls.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
  /* A spinner may keep rotating only when it is the sole loading signal. */
  .spinner {
    animation-duration: .7s !important;
    animation-iteration-count: infinite !important;
  }
}
```

- The skeleton shimmer stops; the reserved block stays visible.
- If a spinner is the only loading signal, it may keep rotating. Otherwise use a static “Loading…” label.
- The autoplay countdown keeps its number but drops the animated fill.
- Test with the OS setting, not a manual class only. A preview toggle may simulate it, but production follows the OS preference.

---

## 10. Native motion and haptics

| Event | Motion | Haptics |
|---|---|---|
| Tab change | Instant swap | None |
| Push Watch | Platform push | None |
| Open sheet | Platform modal / slide | None |
| Save to My List | Icon/state change only | Light impact |
| Confirm destructive action | Sheet exit | Success notification |
| Error | Inline message | Error notification (once) |
| Pull to refresh | Platform control | None |
| Seek scrub | 1:1 drag | None |
| Autoplay countdown | Static countdown | None |

- No haptics on scroll, hover, or every tap.
- No UI sounds.
- Respect the OS reduce-motion and haptics settings.
- Status bar and navigation bar colours follow the resolved theme instantly.

---

## 11. Performance rules

- Animate only `transform` and `opacity`; colour and border transitions are allowed.
- Never animate `width`, `height`, `top`, `left`, `margin`, `box-shadow`, `filter`, or `background-position`.
- No `will-change` on rails, cards, or the player; use it only on a sheet while open, then remove it.
- No layout reads in scroll, pointer, or resize handlers.
- Rail scrolling is CSS scroll-snap; arrows call `scrollBy` once.
- Player progress updates via `transform`, not layout.
- Target 60fps; no long task over 50ms caused by motion.
- Images and video are never scaled or moved during UI motion.
- Motion must not delay input: controls respond on pointerdown, not after a transition.

---

## 12. Motion acceptance

- Every animation has a stated purpose, duration, and easing.
- Every enter can be interrupted and reversed.
- Focus is visible before, during, and after motion.
- Reduced motion removes translation, cross-fade, shimmer, and auto-rotation.
- No glow, lift, zoom, parallax, bounce, or pulse.
- No motion on the player chrome during a theme switch.
- No animation of layout properties.
- Player controls hide only after 2.5s of inactivity and never while paused or focused.
- The autoplay countdown is cancellable and has no flashing.
- Native uses platform transitions; haptics are limited to save, confirm, and error.

---

## 13. Gate — approved

**Outcome:** Approved and locked as `v8.0` on 2026-11-07. The motion contract is final.

| # | Decision | Locked value |
|---|---|---|
| 1 | **Tokens** | 0/120/150/160/240ms; standard, exit, linear easing; no spring |
| 2 | **Page change** | Shell still; 120ms content fade on web; platform push on native |
| 3 | **Hover and press** | Colour/border only on cards; `scale(.98)` on buttons only |
| 4 | **Hero** | 8s editorial cross-fade, pause on hover/focus/hidden plus a visible pause control; still image only; reduced motion stops rotation |
| 5 | **Rails** | Native scroll-snap; arrows scroll one card (platform smooth, ~240ms target); reduced motion instant |
| 6 | **Sheets** | Scrim 160ms + panel 240ms translate; interruptible; focus returns immediately |
| 7 | **Player controls** | 160ms fade; 2.5s auto-hide; never hide while paused or focused |
| 8 | **Progress** | `transform: scaleX()`; no transition during playback; 120ms on seek |
| 9 | **Autoplay next** | 8s static countdown; cancel and play now; no pulse or glow |
| 10 | **Feedback** | Toast 160/120ms; alerts instant; skeleton 1.4s; spinner 700ms |
| 11 | **Reduced motion** | Remove translation, fade, shimmer, auto-rotation; keep function |
| 12 | **Native** | Platform transitions; haptics only on save/confirm/error; no sounds |
| 13 | **Performance** | Compositor-only properties; no layout animation; 60fps target |

**Next:** Phase 9 — accessibility deep pass (keyboard, screen reader, focus order, target sizes, captions, forced colours, and WCAG 2.2 AA audit).

---

## 14. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First motion draft: tokens, hover/press/focus, page changes, hero, rails, sheets, player controls, autoplay countdown, feedback, reduced motion, native haptics, performance rules, acceptance criteria, thirteen gate decisions. |
| `v8.0` | 2026-11-07 | Approved and locked. Added `--motion-theme` (150ms); hero gets a visible pause control and stops rotating under reduced motion; rail arrows use platform smooth scroll with a ~240ms target; reduced-motion spinner exception documented. |
