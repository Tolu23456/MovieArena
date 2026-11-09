# MovieArena design process

Working documents for the 15-phase UI/UX pass. Each phase has an explicit gate; only the approved version is treated as locked.

| Phase | Document | Status | Gate |
|---|---|---|---|
| 0 | Kickoff (conversation record) | Approved | Whole-product scope, web + native equal |
| 1 | Design Brief | Locked `v1.1` | Product scope, audiences, constraints, legal posture |
| 2 | Product Strategy | Locked `v2.0` | Personas (assumption-based), JTBD, journeys, principles, metrics |
| 3 | [Information Architecture & Flows](phase-3-ia.md) | Locked `v3.0` | Sitemap, nav, URL map, flows A–E, five defaults |
| 4 | [Visual Directions](phase-4-visual-directions.md) | Locked `v4.0` | Direction C · Quiet Premium approved for all surfaces |
| 4 | [Visual preview](phase-4-preview.html) | Preview | Interactive direction, surface, and theme switcher; opens on C |
| 5 | [Dual-theme colour system](phase-5-color-system.md) | Locked `v5.0` | Token set, semantic roles, computed contrast matrix; no glow |
| 5 | [Colour preview](phase-5-preview.html) | Preview | Live token ramps, semantic roles, contrast matrix, component states |
| 6 | [Component system](phase-6-component-system.md) | Locked `v6.0` | Type, spacing, states, component tokens; no glow |
| 6 | [Component preview](phase-6-preview.html) | Preview | Live buttons, fields, cards, rails, nav, sheets, player chrome, ads |
| 7 | [Page layouts](phase-7-page-layouts.md) | Locked `v7.0` | Shell, grid, page frames, state pages, responsive composition |
| 7 | [Layout atlas](phase-7-preview.html) | Preview | Desktop/mobile frame switcher across nine page types |
| 8 | [Motion and interaction](phase-8-motion.md) | Locked `v8.0` | Cue table, durations, easing, reduced motion |
| 8 | [Motion preview](phase-8-preview.html) | Preview | Live cues, sheet, player auto-hide, autoplay countdown, reduced-motion toggle |
| 9 | [Accessibility deep pass](phase-9-accessibility.md) | Locked `v9.0` | Keyboard, focus order, screen reader, targets, captions, forced colours, WCAG 2.2 AA |
| 9 | [Accessibility preview](phase-9-preview.html) | Preview | Contrast lab, focus tour, player slider, combobox, dialog trap, targets, forced colours, native states |
| 10 | [Content, copy, and legal rewrite](phase-10-content-legal.md) | Locked `v10.0` | Voice, lexicon, state copy, consent, legal accuracy, 23-item claims audit |
| 10 | [Copy and legal preview](phase-10-preview.html) | Preview | Voice pairs, lexicon filter, state matrix, dialogs, consent, claims audit, copy checker |
| 11 | [Native parity](phase-11-native-parity.md) | Locked `v11.0` | Five tabs, stacks, theme object, Watch entry, player, accounts, consent, 32-item gap audit |
| 11 | [Native parity preview](phase-11-preview.html) | Preview | Phone/tablet device shell, theme switch, five screens, player controls, consent and destructive sheets, gap audit, tokens |
| 12 | [QA and regression](phase-12-qa-regression.md) | Locked `v12.0` | 185 executable checks, 21 triaged defects, preview-effect classification, coverage gaps, exit criteria |
| 12 | [QA dashboard](phase-12-preview.html) | Preview | Live check groups, defect filters, severity counters, preview inventory, coverage map, theme switch |
| 13 | [Performance and resilience](phase-13-performance.md) | Locked `v13.0` | 16 budgets, transfer/cache audit, 17 resilience scenarios, 15 defects (3 P0 / 5 P1 / 7 P2) |
| 13 | [Performance dashboard](phase-13-preview.html) | Preview | Budget verdicts, transfer toggle, asset table, cache policy, scenario and defect filters, native inspection |
| 14 | [Launch and rollout](phase-14-launch-rollout.md) | Locked `v14.0` | 8-gate launch gate, 13 P0, 5-stage rollout, 12 SLOs, 8 runbooks, 8 kill switches, risk and sign-off |
| 14 | [Launch control](phase-14-preview.html) | Preview | Gate scorecard, stages, SLOs, risk and runbook filters, kill-switch and sign-off simulation |

**All 15 phases (0–14) are locked.** The design process is complete; implementation proceeds against these contracts. Launch itself remains gated by Phase 14: 1 of 8 gates passes and 13 P0 findings are open.

## Previews

With the local server running on `:8942`:

- Phase 4 directions: `http://localhost:8942/docs/design/phase-4-preview.html`
- Phase 5 colour system: `http://localhost:8942/docs/design/phase-5-preview.html`
- Phase 6 components: `http://localhost:8942/docs/design/phase-6-preview.html`
- Phase 7 layouts: `http://localhost:8942/docs/design/phase-7-preview.html`
- Phase 8 motion: `http://localhost:8942/docs/design/phase-8-preview.html`
- Phase 9 accessibility: `http://localhost:8942/docs/design/phase-9-preview.html`
- Phase 10 copy and legal: `http://localhost:8942/docs/design/phase-10-preview.html`
- Phase 11 native parity: `http://localhost:8942/docs/design/phase-11-preview.html`
- Phase 12 QA dashboard: `http://localhost:8942/docs/design/phase-12-preview.html`
- Phase 13 performance dashboard: `http://localhost:8942/docs/design/phase-13-preview.html`
- Phase 14 launch control: `http://localhost:8942/docs/design/phase-14-preview.html`

Phase 4 deep links: `#c-dark-home`, `#c-light-watch`, `#a-dark-home`, `#b-light-consent`. The preview opens on the locked direction, C.

The previews use abstract CSS art, not catalog imagery. They are decision aids, not production pages.

## Evidence rules

- No invented user research, statistics, or test results.
- Personas are labelled assumption-based.
- Reference-site claims are labelled verified or general observation.
- Contrast ratios are computed, not estimated.
- Legal copy must match what the code actually does before launch.
