# Phase 14 — Launch, rollout, and post-launch

**Status:** Locked `v14.0` (approved 2026-11-08) — design process complete
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 1 `v1.1` brief, Phase 2 `v2.0` strategy, Phase 3 `v3.0` IA, Phase 4 `v4.0` direction, Phase 5 `v5.0` colour, Phase 6 `v6.0` components, Phase 7 `v7.0` layouts, Phase 8 `v8.0` motion, Phase 9 `v9.0` accessibility, Phase 10 `v10.0` content, Phase 11 `v11.0` native parity, Phase 12 `v12.0` QA, Phase 13 `v13.0` performance
**Preview:** `docs/design/phase-14-preview.html`

---

## 1. Intent

The design process ends here. This phase does not add another surface or another visual rule. It answers the last question the work has been building toward:

> What has to be true before a real person can press play, and what happens after they do?

The answer is a gate, not a date. MovieArena is not launch-ready today. Two registers are open — 21 QA defects and 15 performance findings — and 13 of those findings are P0. A launch plan that pretends otherwise would undo the honesty Phase 10, 12, and 13 were built to enforce.

This phase therefore defines:

- the launch gate and its current state,
- the staged rollout and its rollback triggers,
- the production environment the local servers do not represent,
- the SLOs and instrumentation that make "working" measurable,
- the incident, kill-switch, and legal runbooks,
- the post-launch review that decides whether to continue, iterate, or roll back.

---

## 2. Launch gate

### 2.1 Gate state

| # | Gate | Exit criterion | Current state |
|---|---|---|---|
| G1 | Design contracts locked | Phases 4–13 approved | **Pass** — `v4.0` … `v13.0` |
| G2 | P0 register closed | 0 open P0 | **Fail** — 13 open (10 QA, 3 performance) |
| G3 | Playback and legal P1 closed | 0 open P1 in playback, consent, or claims | **Fail** — 16 P1 open across both registers |
| G4 | Performance budgets | Every measured launch budget passes | **Fail** — 5 measured failures; 3 are P0 |
| G5 | Legal and privacy accurate | Every claim matches the shipped code | **Fail** — QA-02…QA-05 |
| G6 | Native parity and store readiness | Parity register closed; signed build accepted | **Fail** — QA-14…QA-20; no build |
| G7 | Observability and SLOs | Metrics, dashboards, and alerts live | **Fail** — no telemetry exists |
| G8 | Support and rollback | Channel open; rollback rehearsed | **Fail** — no channel, no runbook drill |

**1 of 8 gates passes.** The design is locked; the product is not shippable.

### 2.2 The 13 P0 findings

| Register | P0 | What it blocks |
|---|---:|---|
| Performance | 3 | No compression, per-request catalog parse, full catalog on React/native launch |
| QA | 10 | Legal and About claims, Invidious playback and captions, preview CSS effects, unsupported “Trending №1” claims, mobile parity and autoplay, origin allowlist |

The full lists are in Phase 12 §9 and Phase 13 §10. This phase does not re-triage them. It requires them closed with re-run evidence, not asserted closed.

### 2.3 Rules for closing a gate

1. A defect closes only when its acceptance test passes on the surface it names.
2. A test may not be edited to match the code. Phase 12 already locked that rule.
3. A P0 that cannot be fixed before launch removes the affected surface from launch scope. It does not become a P2.
4. Legal claims close only with reviewed copy that matches the shipped build.
5. Performance closes only with the probe re-run and attached; a local number is not a production number.
6. Every closed defect keeps its entry, its evidence, and its date. Nothing is deleted.

---

## 3. Release scope

### 3.1 What launches

| Surface | Launch scope |
|---|---|
| Web classic | Catalog browse, search, show pages, Watch player, subtitles, quality forcing, resume, five-minute readahead |
| Web React | Same destinations and playback contract as classic; parity defects closed |
| Native | Five tabs, Home/Browse/Search/My List/More, Watch push, native player contract from Phase 11 |

### 3.2 What does not launch unbuilt

Accounts, ad delivery, telemetry, household profiles, and the kids profile are specified but not implemented. They are **post-launch increments**, each behind its own gate. Until they ship:

- The product may not claim they exist.
- The product may not claim they will never exist.
- Legal and privacy copy must describe the build that is actually running.

When ads or accounts do ship, Phase 10 consent, Phase 12 legal claims, and Phase 13 RUM rules apply again in full. A post-launch increment is not exempt from the locked contracts.

### 3.3 Deferred by decision

- Personalised recommendations that require an account.
- Downloads and offline library.
- Social features, comments, and ratings.
- Live channels.
- Any region-specific catalogue promise.

---

## 4. Rollout plan

Five stages. Each stage has an entry condition, an exit condition, and a rollback. Durations are relative, not calendar promises.

| Stage | Scope | Entry | Exit | Rollback |
|---|---|---|---|---|
| S0 Internal | Team devices, local and staging | Build green; dashboards render; no P0 regression | Dogfood period with no new P0; runbooks read | Revert build |
| S1 Closed beta | Invited web users, classic + React | All P0 closed; legal rewrite reviewed; observability live; support channel open | 7 days without an SLO breach or new P0; task success observed | Feature flags, previous build, beta pause |
| S2 Public web | All web traffic | S1 exit; load test passed; rollback rehearsed; status page live | 14 days stable; no rollback trigger | Edge/DNS flip to previous release |
| S3 Native staged | TestFlight and Play internal → 20% → 100% | S2 stable; store approval; crash reporting live; remote config tested | No rollback trigger at each percentage step | Halt staged rollout; remote kill switch |
| S4 General availability | All surfaces, all users | S3 complete; post-launch review passed | Handover to steady-state operation | Per-surface rollback remains available |

### 4.1 Rollback triggers

Any one of these stops the current stage:

- A P0 regression on any surface.
- Start failure above 1.5 % for one hour.
- Rebuffer ratio above 1 % for one hour.
- Catalog API error rate above 1 % for five minutes.
- Relay error rate above 2 % for five minutes.
- A legal complaint or a claim found to be false.
- Native crash-free sessions below 99.5 %.
- A security or consent incident.

### 4.2 Rollout mechanics

- Web releases are immutable and content-hashed; rollback is an edge swap, never a rebuild.
- Native releases use staged store rollout; the first percentage is a real gate, not a formality.
- Feature flags are server-owned and default off. A flag may hide a surface; it may not hide a legal claim.
- The service worker is versioned with a kill switch. A stuck worker is a release blocker.
- The catalogue can be pinned to the last known-good snapshot without a deploy.
- Every stage has a named decision owner and a written go/no-go note.

---

## 5. Production environment

The local servers are not the production edge. Before public traffic:

| Concern | Requirement | Local reality |
|---|---|---|
| TLS and HTTP/2 | Terminated at the edge | None |
| Compression | Brotli at the edge and origin | Classic yes; Bun no |
| Caching | Immutable hashed assets; 304 for catalog | Classic partial; Bun none |
| CDN | Static and media delivery; range support | None |
| Secrets | Supabase keys, relay allowlist, store credentials | Environment files only |
| Rate limits | Catalog, relay, auth, search | None |
| Media egress | Budget, caps, and abuse alarms | Unbounded relay |
| Backups | Catalog snapshots and config | File copies only |
| Status page | Public incident communication | None |
| Log retention | 30 days operational, no PII | Local files |

The Bun server must not face the public internet unchanged. Phase 13's compression and validator defects are production blockers, not local annoyances.

---

## 6. SLOs and instrumentation

Targets are stated; none is currently measured. The instrumentation is opt-in and PII-free, per Phase 10.

| ID | SLO | Target | Source | Today |
|---|---|---|---|---|
| SLO-01 | Web availability | 99.9 % monthly | uptime probe | not instrumented |
| SLO-02 | Catalog API availability | 99.9 % monthly | server logs | not instrumented |
| SLO-03 | Catalog API latency | p75 ≤ 400 ms | server timing | local 36–91 ms, not production |
| SLO-04 | HTML TTFB | p75 ≤ 800 ms | edge + RUM | not measured |
| SLO-05 | LCP | p75 ≤ 2.5 s | RUM | not measured |
| SLO-06 | INP | p75 ≤ 200 ms | RUM | not measured |
| SLO-07 | CLS | p75 ≤ 0.1, shell 0 | RUM | not measured |
| SLO-08 | TTFF | p75 ≤ 2 s | player RUM | not measured |
| SLO-09 | Rebuffer ratio | < 1 % | player RUM | not measured |
| SLO-10 | Playback start failure | < 1.5 % | player RUM | not measured |
| SLO-11 | Native crash-free sessions | ≥ 99.5 % | store vitals | not measured |
| SLO-12 | Catalog freshness | ≤ 26 h | scrape status | daily scrape exists, unmonitored |

### 6.1 Dashboards

- **Release health** — error rate, start failure, rebuffer, TTFF by surface and release.
- **Edge health** — TTFB, cache hit rate, compression ratio, 4xx/5xx.
- **Relay health** — requests, bytes, errors, upstream latency, allowlist rejects.
- **Catalogue health** — last successful scrape, age, schema failures, show count.
- **Consent health** — opt-in rate, opt-out rate, telemetry volume (aggregate only).

### 6.2 Alert thresholds

- Availability below 99.9 % for 10 minutes.
- Catalog error rate above 1 % for 5 minutes.
- Relay error rate above 2 % for 5 minutes.
- Start failure above 1.5 % for 15 minutes.
- Rebuffer above 1 % for 15 minutes.
- Catalogue older than 26 hours.
- Any P0-class JavaScript error spike after a release.

Alerting is a launch requirement for public web, not a post-launch improvement.

---

## 7. Incident response

### 7.1 Severity

| Severity | Definition | Response |
|---|---|---|
| SEV-1 | Playback or catalogue unavailable for most users, legal exposure, or data/consent incident | Immediate rollback or kill switch; all hands |
| SEV-2 | One surface degraded, elevated start failure, or a broken major journey | Contain within 30 minutes; fix or roll back |
| SEV-3 | Localised failure, cosmetic regression, single-source outage | Fix in the normal release path |

### 7.2 Runbooks

| # | Runbook | Detect | Contain | Recover | Verify |
|---|---|---|---|---|---|
| RB-01 | Relay down | Relay error rate, health probe | Disable relay; direct-source fallback | Restore upstream or keep direct | Play an Archive and a NASA title |
| RB-02 | Bad catalog | Freshness alert, schema failure | Pin last-good snapshot | Re-run scrape; validate schema | Browse, search, one show |
| RB-03 | Bad web deploy | Error spike, SLO breach | Edge rollback to previous build | Fix forward in a new release | Smoke the five core journeys |
| RB-04 | Bad native release | Crash-free drop, store reviews | Halt staged rollout; remote kill | New build after fix | Cold start, Watch, back stack |
| RB-05 | Stuck service worker | Stale media reports, cache errors | Bump worker; serve network-first | Clear media cache on activate | Range playback after reload |
| RB-06 | Legal takedown | Rights-holder notice | Remove the title from catalogue and search | Record the action; update source list | Confirm 404 and no cached card |
| RB-07 | Auth outage | Sign-in failures, Supabase status | Guest mode stays open; hide account writes | Restore provider | Sign-in, consent, sign-out |
| RB-08 | Ad provider failure | Fill rate zero, layout errors | Serve reserved space or no ad; never block playback | Restore or disable ads | Player starts with ads on and off |

### 7.3 Communication

- SEV-1 and SEV-2 get a status-page entry within 15 minutes of confirmation.
- Copy states what is affected and what still works. It does not estimate a fix time that is not known.
- A post-incident note is written within 48 hours: cause, impact, fix, prevention.
- Legal and privacy incidents are handled with counsel, not by product copy alone.

---

## 8. Kill switches

Every launch-critical dependency has an off switch, a safe default, and an owner role.

| # | Switch | Safe state | Effect | Owner |
|---|---|---|---|---|
| KS-01 | Relay | Off on failure | Direct-source playback where allowed | Engineering |
| KS-02 | HLS runtime | Lazy, off on browse | HLS titles fail clearly; MP4/YouTube unaffected | Engineering |
| KS-03 | Media readahead | On, bounded | Worker stops prefetching; playback continues | Engineering |
| KS-04 | Autoplay | Off | Next episode waits for a press | Product |
| KS-05 | Ads | Off | No ad slot; layout holds | Product |
| KS-06 | Catalog refresh | Frozen | Last-good catalogue serves | Data |
| KS-07 | Native remote config | Conservative | Native falls back to bundled behaviour | Mobile |
| KS-08 | Account writes | Read-only | Guest browsing and local progress continue | Engineering |

A switch is not a fix. Each switch is tested before the stage that needs it, and every use is logged with a reason.

---

## 9. Legal, privacy, and store readiness

### 9.1 Before public web

- Rewrite `legal.html` so it no longer claims “no user database and no analytics”.
- Review every About, footer, card, and empty-state claim against the build.
- Remove Invidious and any unofficial playback path from code, copy, and documentation.
- Publish a takedown contact and a documented removal process.
- Publish a privacy page that matches actual storage, including local progress and any opt-in telemetry.
- Add a cookie/tracking statement even if the answer is “none yet”.
- Keep official-channel and public-domain labels source-aware; no blanket “FREE · Official”.

### 9.2 Before native stores

- Privacy nutrition labels that match the build.
- Age rating and content descriptors.
- WebView justification only if the shipped player still uses one; otherwise remove the claim.
- Account deletion path if accounts ship.
- Kids-profile behaviour and parental gate, if that profile ships.
- Store screenshots that show the real product, not a concept.
- No “no ads” copy while ads are in the business model or the build.

### 9.3 Standing obligations

- A rights-holder request is actioned before the next catalogue refresh.
- A source that changes its terms is reviewed before it is re-ingested.
- Every new source gets a legal note, a label, and an allowlist entry.
- Consent text and legal text change together, never separately.

---

## 10. Support and feedback

| Channel | Purpose | First response |
|---|---|---|
| In-product feedback | Bugs, playback reports, broken titles | 2 working days |
| Support email | Account, privacy, legal, accessibility | 2 working days |
| Status page | Outages and degradation | 15 minutes after confirmation |
| Accessibility contact | Barrier reports | 5 working days |
| Rights-holder contact | Takedown and licensing | 1 working day |

- The known-issues page lists open P0/P1 work in plain language.
- Feedback is triaged into the Phase 12/13 registers, not a separate inbox.
- A playback report asks for title, episode, surface, region, and time — no unnecessary personal data.
- Support copy follows the Phase 10 voice: calm, specific, brief, human, honest.

---

## 11. Post-launch review

| Review | When | Question | Output |
|---|---|---|---|
| Launch day | +24 h | Did any rollback trigger fire? | Incident list and immediate fixes |
| Week one | +7 d | Are the four player SLOs inside target? | Go / iterate / roll back |
| Month one | +30 d | Did the launch meet its product principles? | Retro, backlog, next increment gate |
| Each increment | Before ship | Does ads/accounts/telemetry meet Phase 10 consent? | New gate note |

The 30-day review checks principles, not just numbers:

- Playback still comes before promotion.
- Value still comes before an account.
- Consent still comes before collection.
- Curation still beats volume.
- Trust-by-default claims are still true.

A launch that hits its latency targets while shipping a false legal claim has failed.

---

## 12. Risk register

| ID | Risk | Likelihood | Impact | Trigger | Mitigation | Owner |
|---|---|---|---|---|---|---|
| R01 | Legal claims contradict the build | High | High | Review or complaint | Phase 10 rewrite; claim-by-claim audit | Legal |
| R02 | Unofficial playback path survives | High | High | Source blocked or removed | Delete Invidious paths; official embeds only | Engineering |
| R03 | Relay outage or egress spike | Medium | High | Error rate or bill | Health probe, direct fallback, caps | Ops |
| R04 | Bad catalogue scrape | Medium | High | Freshness or schema alert | Validate, pin last-good, alert | Data |
| R05 | Bad deploy with no rollback | Medium | High | Error spike | Immutable builds, canary, edge rollback | Engineering |
| R06 | Stale service worker | Medium | Medium | Stale media reports | Versioned worker, kill switch, clear cache | Engineering |
| R07 | hls.js CDN blocked | Medium | Medium | HLS start failures | Self-host, lazy load, native engine | Engineering |
| R08 | Native store rejection | High | High | Review rejection | Policy review, privacy labels, native player plan | Mobile |
| R09 | Auth provider outage | Medium | Medium | Sign-in failures | Guest-first, read-only fallback | Engineering |
| R10 | Ad provider or policy failure | Medium | Medium | Zero fill, blocked ads | Contextual only, labelled, layout fallback | Product |
| R11 | Accessibility regression | High | High | Audit or report | Automated and manual gate per release | Design |
| R12 | Launch load exceeds capacity | Low | High | Latency and 5xx spike | Load test, CDN, rate limits, queue | Ops |

---

## 13. Sign-off

| Role | Accountable for | State |
|---|---|---|
| Product | Scope, stage go/no-go, post-launch review | Pending |
| Design | Locked contracts, no visual regression, accessibility | Pending |
| Engineering | P0 fixes, build, rollback, kill switches | Pending |
| QA | Re-run registers, acceptance evidence | Pending |
| Performance | Budgets, probe, production measurements | Pending |
| Legal | Claims, privacy, takedown, store labels | Pending |
| Operations | Edge, monitoring, SLOs, incident process | Pending |
| Support | Channels, known issues, response times | Pending |

No single role can approve its own gate. Launch requires all eight signatures on the same build.

---

## 14. Gate decisions

| # | Decision |
|---|---|
| 1 | Launch is gated by readiness, not a date. |
| 2 | All 13 open P0 findings close with re-run evidence before any public traffic. |
| 3 | Playback, consent, and legal P1 findings are launch blockers regardless of severity label. |
| 4 | Rollout is staged: internal → closed beta → public web → native staged → GA. Each stage has entry, exit, and rollback. |
| 5 | The local Bun server is not the production edge. Edge compression, TLS, HTTP/2, caching, and rate limits are pre-launch requirements. |
| 6 | Opt-in RUM, server metrics, dashboards, and alerts exist before the closed beta; SLOs are active for public web. |
| 7 | Every launch-critical service has a tested kill switch and a rehearsed rollback. |
| 8 | Native ships only with privacy labels, age rating, a real build, and staged rollout. |
| 9 | Support channels and a known-issues page exist before public web. |
| 10 | Accounts, ads, and telemetry remain post-launch increments until built, consented, and tested. Nothing unbuilt may be claimed. |
| 11 | Post-launch reviews run at 24 hours, 7 days, and 30 days, with go / iterate / roll back. |
| 12 | On approval, lock `v14.0` and close the 15-phase design process. Implementation proceeds against the locked contracts. |

---

## 15. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-08 | First launch-readiness pass: 8-gate launch gate, 13 P0 blockers, 5-stage rollout with rollback triggers, production environment requirements, 12 SLOs, 8 incident runbooks, 8 kill switches, legal and store checklist, support model, post-launch reviews, 12-item risk register, 8-role sign-off, and 12 gate decisions. |
| `v14.0` | 2026-11-08 | Approved. Launch gate, rollout stages, SLOs, runbooks, kill switches, sign-off, and 12 decisions locked. The 15-phase design process is complete; implementation proceeds against the locked contracts. |

**Next:** implementation against the locked contracts. No further design phase is open.
