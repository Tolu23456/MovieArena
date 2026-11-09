# Phase 10 — Content, copy, and legal rewrite

**Status:** Locked `v10.0` — approved 2026-11-07
**Product:** MovieArena (web classic, web React, native)
**Depends on:** Phase 1 `v1.1` brief, Phase 2 `v2.0` strategy, Phase 3 `v3.0` IA, Phase 9 `v9.0` accessibility
**Preview:** `docs/design/phase-10-preview.html`
**Rule:** Every sentence must be true today or clearly marked as not yet available. No claim about privacy, ads, accounts, or rights may run ahead of the code.

---

## 1. Intent

Phase 10 fixes the words. The interface already has a voice — it is just inconsistent, occasionally inflated, and in one place legally false. This phase:

1. **Locks a lexicon.** One name for each thing, on every surface.
2. **Sets a voice.** Calm, specific, human, and short. No hype, no blame, no dark patterns.
3. **Writes the state matrix.** Loading, empty, error, success, offline, permission, and destructive states get exact copy.
4. **Rewrites the legal page around what the code actually does**, and defines the addendum that must ship with accounts, ads, and telemetry.
5. **Removes claims that are already misleading** — including “no ads” while official embeds can carry ads, an unqualified “no proxies” while public-domain files use a relay, and a hard-coded “official upload” attribution that is wrong on Archive films. It also resolves the one production feature that contradicts the locked legal posture: the opt-in Invidious playback proxy.

This phase does not add account, ad, or telemetry features. It makes the copy honest now and makes the future copy a build requirement rather than a later afterthought.

---

## 2. Voice and tone

### 2.1 Principles

| Principle | What it means | What it forbids |
|---|---|---|
| **Calm** | The product is a screening room, not a carnival. | “Unleash”, “insane”, “mind-blowing”, countdown pressure |
| **Specific** | Name the thing, the action, and the result. | “Something went wrong”, “Oops!”, “Error 500” as the only message |
| **Brief** | One idea per sentence. Labels are 1–3 words. | Paragraphs in buttons, tooltips that repeat the label |
| **Human** | Second person, active voice, contractions. | “The user must…”, “Utilise”, “Leverage” |
| **Honest** | Say what is known, what is not, and what happens next. | Implying a feature exists before it ships |
| **Even** | The same tone for success and failure. | Blaming the user, jokes in errors, exclamation marks |
| **Respectful** | The user can decline, undo, and leave. | Confirmshaming, pre-ticked consent, hidden costs |

### 2.2 Tone by context

| Context | Tone | Example |
|---|---|---|
| Browsing | Quiet, editorial | “Classic movie night” |
| Playing | Terse, functional | “Back 10 seconds” |
| Success | Plain, brief | “Saved to My List.” |
| Error | Direct, useful | “This source didn't respond. Try again.” |
| Consent | Neutral, complete | “Optional analytics help us find broken playback. Off by default.” |
| Legal | Plain English, precise | “We do not proxy licensed video.” |
| Kids | Simple, warm, no jargon | “Pick a cartoon.” |

### 2.3 Mechanics

- Sentence case everywhere, including buttons and headings. Only proper nouns are capitalised.
- No exclamation marks in product UI. None in errors. None in success.
- Contractions are allowed: “didn't”, “you're”, “we'll”.
- Serial comma: yes.
- Ellipsis `…` only for an action that opens a dialog or a longer flow (“Subtitle appearance…”), never for loading.
- No emoji in UI copy. The brand mark and icons carry the visual tone.
- “Please” is reserved for consent and legal requests, not for errors.
- Never say “simply”, “just”, “easy”, or “obviously”. They blame the reader.
- Avoid “content” when “title”, “film”, or “episode” is more precise.

### 2.4 Numbers, time, dates

| Item | Rule | Example |
|---|---|---|
| Counts | Numerals; singular/plural agreement | “1 episode”, “28 episodes” |
| Durations | `1h 16m`, `24:10`, `8 seconds` | “1h 16m · 1920” |
| Dates | `7 Nov 2026` | Avoid `11/07` |
| Ranges | En dash | “Episodes 1–12” |
| Percent | Numeral + `%` | “48% watched” |
| Volume | Percent | “Volume 60%” |
| Currency | Only if a price exists; none today | — |

---

## 3. Lexicon

The lexicon is binding across web classic, web React, native, legal, and support.

| Concept | Use | Do not use |
|---|---|---|
| The product | **MovieArena** | Movie Arena, MovieArena™, the Arena |
| A show or film | **title** | content, asset, product |
| A single playable item | **episode**; **film** for a feature | video, item, media |
| A collection of episodes | **series** | show (in user-facing copy), season (unless metadata says so) |
| The place a stream comes from | **source** | provider (internal only), host, mirror |
| The official YouTube channel | **channel** | uploader, publisher |
| Saved titles | **My List** | Favorites, Watchlist, Bookmarks |
| In-progress playback | **Continue watching** | Keep watching, Resume watching |
| Start from saved position | **Resume** | Continue (as a button), Play from start |
| Start from the beginning | **Play** | Watch now, Stream now |
| Same-language text on screen | **Subtitles** in product UI; **captions** in accessibility/legal text | Closed captions as a product label |
| Translated text | **Subtitles** | Subs (except compact metadata) |
| Audio language | **Audio** | Dub track (unless the track itself is a dub) |
| Text alternative panel | **Transcript** | CC list, subtitle list |
| Picture quality | **Quality** | Resolution (unless a number) |
| Playback speed | **Speed** | Rate |
| Sign-in state | **Sign in** / **Sign out** | Log in, Log out |
| Account holder | **Account** | User, member |
| Household member | **Profile** | User, sub-account |
| Child profile | **Kids profile** | Child account, kid mode |
| Free, no payment | **Free** | Free-to-play, unlocked |
| Public-domain film | **Public-domain film** | PD film, archive movie |
| Optional data collection | **Optional analytics** | Telemetry (internal only), tracking |
| Advertising | **Ad** | Advertisement (except legal), promo |
| Sponsored placement | **Sponsored** | Partner content |

### 3.1 Names that stay as-is

- Official channel names: Anime Made By Bilibili, Muse Asia, Ani-One Asia.
- Source names: YouTube, Internet Archive, NASA.
- Technical names in help: `localStorage`, HLS, MP4, WebVTT, `.srt`, `.vtt`.
- Keyboard keys: `Space`, `Esc`, `Tab`, arrow keys.

---

## 4. Labels and actions

### 4.1 Button and link labels

| Action | Label | Notes |
|---|---|---|
| Open a title | **Watch** | Card and hero |
| Start a film from zero | **Play** | Watch page primary |
| Continue from saved position | **Resume 12:34** | Time is included; explicit action only |
| Save | **My List** | If space is tight; full label “Save to My List” |
| Remove | **Remove** | Destructive; never “Delete” for list items |
| Retry | **Try again** | Not “Retry” alone in body copy |
| Dismiss | **Close** | Icon buttons use an accessible name |
| More options | **More** | Not “…” as the only label |
| Open source | **Open official source** | External-link icon and new-tab note |
| Sign in | **Sign in** | Not “Login” |
| Create account | **Create account** | Only after value is shown |
| Consent accept | **Accept all** | Same visual weight as reject |
| Consent reject | **Reject optional** | Never “No thanks” |
| Consent customise | **Choose** | — |
| Kids exit | **Exit Kids** | Then PIN |

### 4.2 Link text

- Link text must make sense out of context. Never “click here” or “read more”.
- External links say where they go: “Open the Internet Archive source ↗”.
- Destructive links are never disguised as body text.

### 4.3 Metadata order

Cards and detail pages use one order:

```text
Title
Year · episodes or runtime · audio · source
Progress or badge
```

Examples:

- `Frieren: Beyond Journey's End`
- `28 episodes · SUB · DUB · Muse Asia`
- `The Cabinet of Dr. Caligari`
- `1920 · 1h 16m · public domain · Internet Archive`

---

## 5. State matrix

All surfaces use these strings. Native may shorten where the platform truncates, but never changes the meaning.

### 5.1 Loading

| State | Copy |
|---|---|
| Catalog | **Loading titles…** |
| My List | **Loading your list…** |
| Search | **Searching…** |
| Player source | **Opening the source…** |
| Subtitles | **Loading subtitles…** |
| Catalog refresh | **Checking the official sources…** |
| Account | **Signing you in…** |

### 5.2 Empty

| State | Copy | Action |
|---|---|---|
| No search results | **No titles match “friren”. Try fewer words or a genre.** | Clear search |
| Empty My List | **Your list is empty. Save a title to find it here.** | Browse titles |
| No episodes in a language | **No episodes in this audio track yet.** | Switch audio |
| No episode search results | **No episodes match “12”.** | Clear search |
| No saved progress | **Nothing to continue yet.** | Browse titles |
| No titles in a filter | **No titles in this filter.** | Show all |
| No transcript | **No transcript for this source.** | — |

### 5.3 Errors

| State | Copy | Action |
|---|---|---|
| Catalog failed | **The catalog didn't load. Check your connection and try again.** | Try again |
| Source failed | **This source didn't respond. Try again, or open the official source.** | Try again · Open official source |
| Subtitle file unreadable | **That subtitle file couldn't be read. Use a .srt or .vtt file.** | Choose another file |
| Subtitle search failed | **Subtitle search isn't responding right now. Try again in a moment.** | Try again |
| Copy failed | **Couldn't copy the link. Select it and copy it manually.** | — |
| Offline | **You're offline. Saved titles are still available.** | — |
| Sign-in link expired | **That link has expired. Send a new one.** | Send a new link |
| Profile limit | **This account already has four profiles. Remove one to add another.** | Manage profiles |

Rules:

- Error copy names the object, the failure, and the next step.
- Never expose a stack trace, status code, or exception string to the user.
- Never blame the user.
- The retry action repeats the same operation; it does not reload the whole page unless necessary.

### 5.4 Success and undo

| Action | Copy | Undo |
|---|---|---|
| Save | **Saved to My List.** | Undo |
| Remove | **Removed from My List.** | Undo |
| Copy | **Link copied.** | — |
| Sign out | **Signed out.** | — |
| Profile switch | **Switched to {name}.** | — |
| Ad personalisation | **Ad personalisation is off.** | Change |
| Delete account | **Your account is scheduled for deletion. You have 30 days to cancel.** | Cancel deletion |

Success copy appears for 4 seconds, is announced once, and does not steal focus.

### 5.5 Destructive confirmation

```text
Remove from My List?
Frieren: Beyond Journey's End will be removed from this profile.
Your watch progress is kept.
[Cancel] [Remove]
```

- Title is a question. Body states the consequence and what is kept.
- The destructive action repeats the verb, not “Yes” or “OK”.
- The safe action is focused by default.
- Undo is available after the action.

---

## 6. Player microcopy

### 6.1 Controls

| Control | Label | Tooltip / shortcut |
|---|---|---|
| Play | **Play** | `Space` |
| Pause | **Pause** | `Space` |
| Back | **Back 10 seconds** | `J` / `←` |
| Forward | **Forward 10 seconds** | `L` / `→` |
| Previous episode | **Previous episode** | `P` |
| Next episode | **Next episode** | `N` |
| Mute | **Mute** | `M` |
| Unmute | **Unmute** | `M` |
| Volume | **Volume 60%** | `↑` / `↓` |
| Subtitles | **Subtitles** | `C` |
| Quality | **Quality: Auto** | — |
| Speed | **Speed: 1×** | — |
| Settings | **Settings** | `S` |
| Theater | **Theater mode** | `T` |
| Fullscreen | **Fullscreen** | `F` |
| Picture in picture | **Picture in picture** | — |

### 6.2 Menus

- Settings title: **Settings**. Tabs: **Playback**, **Audio & subtitles**, **Extras**.
- Quality: **Auto**, **1080p**, **720p**, **480p**, **360p**. Locked state: **Locked at 720p**.
- Speed: **0.5×**, **0.75×**, **1×**, **1.25×**, **1.5×**, **2×**.
- Audio: track label, then **Original** or **Dubbed** where known.
- Subtitles: **Off**, then track names, then **Add subtitle file…**.
- Autoplay: **Autoplay next episode** with a switch and a one-line explanation: **Starts the next episode after 8 seconds.**
- Sleep timer: **Stop after 30 minutes**, **Stop at end of episode**.
- Transcript: **Transcript**, close button **Close transcript**.

### 6.3 Playback feedback

| Event | Copy |
|---|---|
| Buffering | **Buffering…** (not “Loading”, to distinguish from page load) |
| Quality switch | **Quality: 720p** |
| Speed change | **Speed: 1.5×** |
| Captions on | **Subtitles on** |
| Captions off | **Subtitles off** |
| Audio switch | **Audio: English dub** |
| Sleep timer | **Stopping after 30 minutes** |
| Autoplay next | **Up next: {episode}** |
| Autoplay cancelled | **Autoplay cancelled.** |
| Clip loop | **Looping this clip** |
| Clip preview ended | **Clip preview ended.** |

### 6.4 Playback errors

| Event | Copy |
|---|---|
| Source timed out | **This source didn't respond. Try again, or open the official source.** |
| Format unsupported | **This browser can't play this file. Try another browser or open the official source.** |
| HLS failed | **The stream stopped. Try again.** |
| Region blocked | **This source isn't available in your region. Open the official source for other options.** |
| Embed refused | **The source blocked embedding. Open it on the official site.** |

Never say “unknown error”. If the cause is unknown, say: **Playback stopped. Try again.**

---

## 7. Account, profiles, and consent copy

These surfaces ship after Phase 10, but their copy is locked now.

### 7.1 Guest-first

- The first screen never asks for an account.
- Account entry: **Sign in** in the header, with the helper **Save your list and progress across devices.**
- The account sheet opens with the value, not a form: **Keep your list and progress on every device.** Then **Continue with Google**, **Continue with Apple**, **Email me a sign-in link**, and **Stay signed out**.

### 7.2 Sign-in

| Field / state | Copy |
|---|---|
| Email label | **Email** |
| Email help | **We send a sign-in link. No password needed.** |
| Submit | **Send sign-in link** |
| Sent | **Check your email. The link signs you in once.** |
| Resend | **Send a new link** |
| Expired | **That link has expired. Send a new one.** |
| Error | **Enter a complete email address, like you@example.com.** |
| OAuth | **Continue with Google** / **Continue with Apple** |
| Optional password | **Use a password instead** |

### 7.3 Profiles

- Title: **Who's watching?**
- Add: **Add profile**
- Limit: **Up to four profiles per account.**
- Kids: **Kids profile** with the helper **Cartoons and films for younger viewers.**
- Until the Kids catalog is restricted to ad-free sources, do not add “No ads” to the helper. A YouTube embed can still serve its own ads.
- Edit: **Edit profile**, **Name**, **Avatar colour**, **Kids profile**, **Save**.
- Delete: **Remove profile** → **Remove {name}?** → **This deletes the profile's list and progress. This can't be undone.** → **Remove profile**.
- Switch: **Switch profile**.

### 7.4 Consent

Consent is a first-class screen, not a banner trick.

```text
Your privacy choices

We use essential storage to keep you signed in and remember this choice.
Optional analytics help us find broken playback and improve the catalog.
They are off unless you turn them on.

[Essential only] [Choose] [Accept optional]

You can change this any time in Settings → Privacy.
```

Rules:

- **Essential only**, **Choose**, and **Accept optional** are equally prominent. No colour trick.
- No pre-ticked optional boxes.
- “Accept optional” is not the only large button.
- Rejecting is one action, not a maze.
- The choice is stored and can be changed later.
- Kids profiles never see ads and never enable optional analytics.
- Consent is never requested inside the player during playback.

### 7.5 Privacy settings

| Setting | Copy | Default |
|---|---|---|
| Optional analytics | **Help improve MovieArena** — **Sends anonymous playback and error events. No titles you watch are attached.** | Off |
| Ad personalisation | **Use my activity to choose ads** — **Off by default. Ads still appear, but they are contextual.** | Off |
| Marketing email | **Send me catalog updates** — **No more than once a month.** | Off |
| Data export | **Download my data** | — |
| Delete account | **Delete account and data** | — |

### 7.6 Export and deletion

- Export: **Download my data** → **We'll email a copy when it's ready. It includes your list, progress, profiles, and consent history.**
- Delete: **Delete account and data** → **This removes your account, profiles, list, progress, and consent history. It can't be undone after 30 days.** → type the account email → **Delete account**.
- Confirmation: **Your account is scheduled for deletion. You have 30 days to cancel.**
- Cancellation: **Cancel deletion** → **Your account is restored.**

---

## 8. Ads copy

- Label: **Ad** in text, top-left, always visible while the ad plays.
- Countdown: **Ad · 0:15**.
- Skip: **Skip ad** only when skipping is actually available.
- Mute: **Mute ad**.
- Why: **Why this ad?**
- Contextual explanation: **This ad is based on the title you're watching, not your history.**
- Personalised explanation: **This ad uses your ad personalisation setting. Change it in Settings → Privacy.**
- Sponsored card: **Sponsored** before the title, never only a colour.
- No copy may imply the ad is part of the film, and no ad may use the film's title styling.
- Kids: no MovieArena ads, and therefore no MovieArena ad copy. Until the Kids catalog is restricted to ad-free sources, do not claim “No ads” for third-party embeds.

---

## 9. Legal rewrite

### 9.1 What is wrong now

| Current text / feature | Problem | Fix |
|---|---|---|
| “There is no user database and no analytics.” | Will become false when accounts and telemetry ship; it is written as a permanent promise | Replace with a dated current-state statement plus a launch addendum requirement |
| “Every stream … is delivered by YouTube.” | Contradicted later on the same page by the Archive direct-file paragraph; false for public-domain films | Separate official YouTube embeds from public-domain direct files |
| “No streams … proxied from MovieBox/123Movies-class aggregators.” | Accurate as narrowly written, but `about.html` repeats it as an unqualified “no proxies”, and production ships an opt-in Invidious playback proxy that its own code calls “ToS-gray for YouTube” | Remove the playback proxy; qualify the relay; never say “no proxies” without “no licensed video” |
| `watch.html` “Proxy: Off” | Ships an experimental Invidious playback path that the code itself labels ToS-gray; it contradicts the locked legal posture | Remove the control and the playback path; the official embed is the only YouTube path |
| `subs.js` caption fetch | Uses third-party Invidious instances to retrieve YouTube caption tracks | Prefer the official timedtext endpoint; if a third party is retained, disclose it and state that no video is proxied |
| `watch.html` static source note | Says every title is an “official upload from the show's own channel — Anime Made By Bilibili”, even on Archive film pages | Render the note from the actual source, or remove the channel name |
| `watch.js` player badge | “FREE · Official” is shown for Archive films too | “Free · Public domain” for Archive; “Free · Official” for channel embeds |
| “no ads” on the mobile More screen | False: official embeds can carry their own ads | Say “Official embeds may include their own ads” |
| Kids profile helper | Promises “No ads” while Kids titles can still play through YouTube embeds that serve ads | Either restrict Kids to ad-free sources or remove the promise |
| `apps/mobile/src/screens/HomeScreen.jsx` | Hard-codes “Search 1,200+ titles” | True today, but drifts as the catalog changes | Use “Search titles” or a live count |
| `scripts/scrape-shows.js` | Wrong extension; the script is `.mjs` | Correct the path |
| “taking the source down takes the entire site down” | Overstated; the catalog entry can be removed independently | Say the entry can be removed on request |
| Rights-holder requests ask the owner to edit a local file | Not a real contact path for a public site | Provide a contact address and a response target |

### 9.2 Legal page structure

1. **The short version** — five plain sentences.
2. **Where the video comes from** — official channels, public-domain archive, operator-curated extra links.
3. **What MovieArena doesn't do** — no ripping, no re-hosting licensed video, no video proxying, no DRM bypass, no unlicensed aggregators.
4. **Ads and support** — official embeds keep their ads; future on-site ads are labelled; Kids profiles only use ad-free sources.
5. **Your data today** — local storage only; no account; no analytics.
6. **When accounts launch** — what will be stored, why, retention, export, deletion, processors.
7. **Cookies and local storage** — essential only; no third-party advertising cookies today.
8. **Children and Kids profiles** — no optional analytics, parent exit, and no ads where the source allows it (see §8).
9. **Rights-holder requests** — contact, information required, response target.
10. **Credits and licences** — studios, channels, hls.js, open-source components.
11. **Changes and contact** — last updated, how changes are announced.

### 9.3 Current-state text (shipping now)

The legal page must say, in plain English:

- MovieArena is a front-end for officially released free videos and public-domain films.
- Official anime and donghua episodes play through the rights-holder's own YouTube embed. The embed may show the rights-holder's ads.
- Public-domain films from the Internet Archive and other open archives play as direct files through MovieArena's range-aware relay. The relay only fetches files the source serves publicly; it does not bypass access controls.
- MovieArena does not host, rip, re-upload, or proxy licensed video, and does not circumvent DRM. The experimental Invidious playback path has been removed.
- Some caption tracks are retrieved from the source or a caption service that returns text only. No video is proxied to obtain them.
- **As of 7 Nov 2026**, My List, progress, and settings are stored in the browser or on the device. There is no account and no analytics.
- When accounts and optional analytics launch, this page will list the data, purpose, retention, processors, and deletion path **before** those features are enabled.
- There are no third-party advertising cookies today. Official embeds may set their own cookies under the source's policy.
- Kids profiles do not add any ads of their own. A title played through a third-party embed may still carry that source's ads until the Kids catalog is restricted to ad-free sources.
- Rights-holder requests go to a contact address, with a response target. The catalog entry can be removed without touching the source.

### 9.4 Launch addendum (binding before accounts/ads/telemetry)

The following must be added to the legal page in the same release that enables the feature:

| Feature | Required legal content |
|---|---|
| Supabase accounts | Controller identity, data categories, lawful basis, retention, processors, export, deletion, security contact |
| Profiles | Profile data, kids profile rules, parental responsibility, deletion behaviour |
| Optional analytics | Events collected, no PII, opt-in default, retention (90 days raw), withdrawal, processor |
| Ads | Ad partner, contextual vs personalised, consent, cookies, frequency, kids exclusion |
| Third-party caption service | Provider, data sent (video ID only), purpose, retention, text-only guarantee, opt-out |
| Operator-curated extra links | Who supplies them, that they are reviewed, how a rights-holder requests removal |
| Payments (if added) | Processor, tax, refunds, cancellation |
| Push/email | Purpose, frequency, unsubscribe |

A release checklist item blocks the feature if the matching legal section is missing. Legal copy is a build artifact, not a post-launch task.

---

## 10. Kids copy

- Simple words, short sentences, no genre jargon.
- Titles: **Cartoons**, **Films**, **Shows**.
- Empty: **Nothing here yet. Ask a grown-up to add something.**
- Exit: **Exit Kids** → **Ask a grown-up for the PIN.**
- No MovieArena ads, no account upsell, no external links inside playback.
- Do not promise “No ads” until Kids is restricted to sources that carry no third-party ads.
- Never mention “data”, “analytics”, or “ads” in Kids UI.
- The same content warnings as the adult profile, in simpler language.

---

## 11. Accessibility copy

Phase 9 sets the behaviour; Phase 10 sets the words.

- Accessible names match the visible label wherever possible. If they differ, the visible label is contained in the accessible name.
- Alt text: describe the poster only if it carries information not in the title. Otherwise `alt=""`.
- Decorative images: empty alt.
- Captions and transcripts use the same punctuation and speaker labels as the rest of the product.
- Error announcements read the visible error text exactly; no separate “screen-reader version”.
- Player shortcut help is written as a list, not a paragraph.
- Link text is meaningful without the surrounding sentence.

---

## 12. Claims audit

| # | Location | Current claim | Status | Severity | Required change |
|---|---|---|---|---|---|
| 1 | `legal.html` | “There is no user database and no analytics.” | True today, unsafe as a permanent promise | P0 | Dated current-state statement + launch addendum |
| 2 | `legal.html` | “Every stream … is delivered by YouTube.” | Contradicted later on the same page; false for Archive films | P0 | Split the two delivery paths |
| 3 | `legal.html` | “No streams … proxied from MovieBox/123Movies-class aggregators.” | True as narrowly written, but the page never qualifies the Archive relay | P0 | Say “no licensed video is proxied”; explain the relay |
| 4 | `legal.html` | `scripts/scrape-shows.js` | Wrong extension | P2 | `scripts/scrape-shows.mjs` |
| 5 | `legal.html` | “taking the source down takes the entire site down” | Overstated | P1 | “The catalog entry can be removed.” |
| 6 | `legal.html` | Rights-holder edit instructions | Not a contact path for a public site | P0 | Add a contact address and response target |
| 7 | `apps/mobile/src/screens/MoreScreen.jsx` | “No accounts, no ads, no analytics” | “No ads” is already false | P0 | “No accounts today. Official embeds may include their own ads.” |
| 8 | `apps/web/src/App.jsx` | Comment: “no accounts, no analytics” | Internal, but misleading | P2 | “Local-only today; accounts and telemetry are planned behind consent.” |
| 9 | `common.js` footer | “embedded free, ad-supported uploads” | Accurate | — | Keep |
| 10 | `about.html` | “no re-hosting, no proxies” | Unqualified claim is false for the public-domain relay | P0 | “No re-hosting of licensed video; public-domain files use our relay.” |
| 11 | `about.html` | “subtitles … on the YouTube embed … drawing over the player surface isn't allowed” | Accurate | — | Keep |
| 12 | `index.html` hero | “Trending №1” | Implies measured rank without a stated basis | P1 | Either define the metric or use “Featured” |
| 13 | React hero | “Trending №1” | Same | P1 | Use “Featured” until a metric is defined |
| 14 | Player | “Subtitles” vs “Captions” | Inconsistent with Phase 9 | P1 | “Subtitles” in product UI; “captions” in accessibility/legal text |
| 15 | Player | “Clip & share…” | Ellipsis is correct (opens a panel) | — | Keep |
| 16 | Watch page | “FREE · Official” badge | Accurate for channel embeds, wrong for Archive films | P1 | Source-aware badge: “Free · Public domain” for Archive |
| 17 | `watch.html` static source note | Names Anime Made By Bilibili on every title | Wrong on Archive film pages | P1 | Render the note from the actual source |
| 18 | `watch.html` “Proxy: Off” + `watch.js` path | Experimental Invidious playback; code calls it “ToS-gray for YouTube” | Contradicts the locked legal posture | P0 | Remove the control and the playback path |
| 19 | `subs.js` caption fetch | Uses third-party Invidious instances for YouTube captions | Undisclosed intermediary | P1 | Prefer the official endpoint; otherwise disclose text-only retrieval |
| 20 | `apps/mobile/src/data.js` | Comment: “No accounts, no analytics” | Internal, but will age badly | P2 | “Local-only today; accounts and telemetry are planned behind consent.” |
| 21 | `apps/mobile/src/screens/HomeScreen.jsx` | “Search 1,200+ titles” | Hard-coded count drifts from the catalog | P2 | “Search titles” or a live count |
| 22 | Hero CTAs | “Watch now” | Inconsistent with the lexicon’s “Watch” and “Play” | P2 | “Watch” on cards and hero; “Play” on the Watch page |
| 23 | Kids profile helper | “No ads” | Not guaranteed while Kids titles can use YouTube embeds | P0 | Remove the promise until Kids is restricted to ad-free sources |

---

## 13. Implementation changes

Content changes that ship with this phase:

1. Rewrite `legal.html` to the current-state text above, with the launch addendum section clearly marked.
2. Remove the Invidious playback proxy: the `Proxy: Off` control in `watch.html`, the `ma.proxy` branch in `watch.js`, and the unused instance list. Keep the official embed as the only YouTube path.
3. Prefer the official caption endpoint in `subs.js`. If a third-party caption service remains, disclose it in the legal page and confirm it returns text only.
4. Fix the mobile More screen’s “no ads” claim, and the “no accounts/no analytics” comments in `apps/web/src/App.jsx` and `apps/mobile/src/data.js`.
5. Fix `about.html`’s “no proxies” sentence and the wrong script extension in `legal.html`.
6. Replace “Trending №1” with “Featured” until a ranking metric is defined.
7. Make the Watch page’s source note and player badge source-aware: “Free · Official” for channel embeds, “Free · Public domain” for Archive films.
8. Align the player’s “Subtitles” label and help text with the lexicon.
9. Replace the hard-coded “1,200+ titles” with “titles” or a live catalog count.
10. Remove “No ads” from the Kids helper until Kids is restricted to ad-free sources.
11. Add the copy keys to the design preview so future surfaces reuse them.

Copy, legal, and the removal of the proxy control. No layout or token changes. Keep asset versions unless a referenced file changes.

---

## 14. Acceptance checklist

- [ ] Every claim in the legal page is true today, or marked as not yet available.
- [ ] No page says “no ads” while official embeds can show ads.
- [ ] No page says “no proxies” without limiting it to licensed video.
- [ ] No production control offers a third-party video proxy.
- [ ] Archive films are labelled public domain, not official channel uploads.
- [ ] Caption retrieval is either official or disclosed as text-only.
- [ ] Hero badges do not claim a measured rank.
- [ ] No hard-coded catalog counts.
- [ ] “My List”, “Continue watching”, “Resume”, “Play”, “Subtitles”, “Source”, “Profile”, and “Kids profile” are used consistently.
- [ ] Buttons use verbs, not “Yes/OK” for destructive actions.
- [ ] Every error names the object, the failure, and the next step.
- [ ] Every empty state offers a next action.
- [ ] Consent options have equal visual weight and no pre-ticked optional boxes.
- [ ] Ads are labelled in text and absent from Kids.
- [ ] Dates and durations follow the number rules.
- [ ] No exclamation marks in product UI.
- [ ] Legal names a contact path and a response target for rights-holder requests.
- [ ] The launch addendum is a release blocker for accounts, ads, and telemetry.

---

## 15. Gate — decisions to approve

| # | Decision | Default |
|---|---|---|
| 1 | **Voice** | Calm, specific, brief, human, honest, even, respectful |
| 2 | **Mechanics** | Sentence case, contractions, serial comma, no exclamation marks, no hype |
| 3 | **Lexicon** | The table in §3 is binding on all surfaces |
| 4 | **Subtitles vs captions** | “Subtitles” in product UI; “captions” in accessibility and legal text |
| 5 | **State copy** | The matrix in §5 is the only approved wording |
| 6 | **Destructive copy** | Question title, consequence body, verb repeat, safe action focused |
| 7 | **Consent** | Equal weight, off by default, one-action reject, changeable later |
| 8 | **Legal current state** | Dated statement of what the code does today |
| 9 | **Legal launch addendum** | Required in the same release as accounts, ads, or telemetry |
| 10 | **Ads copy** | “Ad” label, truthful countdown, no Kids ads |
| 11 | **Kids copy** | Simple words, no data or ad language, parent exit |
| 12 | **Claims audit** | All 23 items resolved before Phase 10 closes |
| 13 | **Proxy removal** | The Invidious playback path is removed; the official embed is the only YouTube path |
| 14 | **Caption retrieval** | Official endpoint preferred; any third-party caption service is text-only and disclosed |
| 15 | **Source-aware labels** | Channel embeds are “Official”; Archive films are “Public domain” |
| 16 | **Rank claims** | “Featured” until a ranking metric is defined |
| 17 | **Scope** | Copy, legal, and the proxy-control removal; no layout or token changes |

**On approval:** lock as `v10.0` and proceed to Phase 11 — native parity.

---

## 16. Change log

| Version | Date | Change |
|---|---|---|
| `v0.1` | 2026-11-07 | First content pass: voice principles, mechanics, lexicon, labels, state matrix, player copy, account and consent copy, ads and Kids copy, legal rewrite, 16-item claims audit, implementation list, acceptance checklist, thirteen gate decisions. |
| `v0.2` | 2026-11-07 | Audit corrected against the shipped files: added the Invidious playback proxy, third-party caption retrieval, static Archive source note, source-aware badge, hard-coded catalog count, “Watch now” inconsistency, and unenforceable Kids “No ads” promise. Claims audit expanded to 23 items; gate expanded to 17 decisions; legal current-state text dated and qualified. |
| `v10.0` | 2026-11-07 | Gate approved. Voice, mechanics, lexicon, state matrix, consent, legal rewrite, claims audit, source-aware labels, proxy removal, and caption disclosure locked. No further wording changes without a new gate. |
