---
title: Tabbed Store Dashboard
confluence_id: 4153409540
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153409540/Tabbed+Store+Dashboard
last_modified: 2026-09-02
pulled: 2026-10-26
---
*Rewritten August 24, 2026 following the team store testing walkthrough. The previous version described a three-tab General / Products / Roster workspace, which no longer matches the product: store settings moved into a **seven-section Settings tab** and Orders and Reports became first-class tabs. The **Store Setup Guide** is specified here for the first time, as an informational/educational modal.*

*Amended August 31, 2026: the Setup Guide moves from a single scrolling list of bullets to a **paced card sequence**, reusing the Store Close Report shell. Driven by usability testing — "store setup guide has too many words" (Usability Testing Log) — and by the request to make Draft state legible at first entry (Ideas From Usability Testing).*

*Amended August 31, 2026 (relabelling): card 5 now teaches the **Stock Vault** (formerly Product Vault) and **Catalog Templates** (formerly Product Packages). See* [*Product Catalog Management (Products Tab)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab)*, Epics G and M.*

*Amended September 2, 2026: the Settings tab gains a **seventh section, Store Customization & Design** (store theme color and the storefront Announcement Message) — see* [*Store General Settings (Settings Tab)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab)*, Epic I. The two references to a six-section Settings tab in the August 24 rewrite note above are corrected to seven. **The Setup Guide card set does not change** — card 2 teaches the five workspace tabs, not the sections inside Settings, and adding a Settings section is not an orientation-level concept.*

The operational home for a single store, opened without marketing chrome — a tabbed workspace plus launch controls.

### Executive Summary & Problem Statement

#### The Problem

Running a live store means editing settings, catalog, roster, and orders in one place without distraction. A rep landing in the workspace for the first time also has no orientation: the tabs assume the rep already knows what a Stock Vault is, what Team Required means, or why a product they added isn't on the storefront. The previous setup guide tried to solve that by sitting permanently in the workspace as a checklist, which made a one-time orientation problem into permanent furniture — and implied the store was incomplete long after it was fine. Its replacement then over-corrected into a single dense list of bullets that testers described as having too many words.

#### The Solution

A focused full-height workspace that drops the storefront chrome, with tabs for **Products**, **Orders**, **My Team(s)**, **Reports**, and **Settings**, plus the ability to view the live storefront, switch stores, and open the Customizer. Orientation is handled by a **Store Setup Guide** presented as a **paced card sequence** — one idea per card, advanced by the rep, each card carrying a visual of the thing it describes. It explains how the workspace works, states plainly that the store is not yet live, then gets out of the way, and can be reopened on demand.

### User persona & use cases

**Who is this for?** Store owners / reps operating a single store.

**Scenarios encountered** Editing store details; jumping to the live storefront; switching to another store without leaving the workspace; opening a store for the first time and needing to understand what each tab is for; finishing store creation and not knowing whether buyers can already see the store; setting up a league store for the first time after having only ever built individual team stores; re-reading the explanation of visibility or team settings weeks later without hunting for documentation.

### Functional Requirements & Core Workflows

#### User Stories

- As an owner, I want a tabbed, chrome-free store workspace, so that I can operate one store efficiently.
- As a rep opening my first store, I want an explanation of what this workspace does, so that I am not guessing at what each tab controls.
- As a rep who has just finished creating a store, I want to know immediately that it is not yet live, so that I do not assume buyers can already order from it.
- As a rep taking in a new concept, I want to see the thing being described rather than only read about it, so that I understand it on first pass.
- As a rep setting up my first league store, I want orientation on how divisions and teams work, so that my experience with individual team stores does not leave me guessing.
- As an experienced rep, I want that explanation to be dismissible and never to block me, so that orientation content does not become clutter on my twentieth store.

##### Epic A — Tabbed workspace

- Given I open a store, when the workspace loads, then marketing chrome is hidden and the store tabs are available: **Products**, **Orders**, **My Team(s)**, **Reports**, and **Settings**.
- Each tab's contents are specified in its own page — [Product Catalog Management & Publishing (Products Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab), [Order Management (Orders Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153933836/Order+Management+Orders+Tab), [Roster Management (My Team(s) Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153507841/Roster+Management+My+Team+s+Tab), [Store Analytics (Reports Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049253/Store+Analytics+Reports+Tab), and [Store General Settings (Settings Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab). This page owns only the shell.
- Given I choose View live storefront, when it opens, then I see the consumer view of this store.
- Launch, close, and re-open controls are specified in [Launch & Status Controls](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802774/Launch+Status+Controls) and [Store Status & Lifecycle](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4168908810/Store+Status+Lifecycle).
- **The tab count is fixed at five; the Settings tab's internal section count is not.** Settings currently carries **seven sections**, one of which (Catalog & Decoration) is conditional. This shell owns neither the sections nor their count — it renders the tab and nothing more. Adding or removing a Settings section must never require a change here.

##### Epic B — Store Setup Guide (paced card sequence)

The Store Setup Guide is **explanatory, not procedural**. It teaches the rep how the workspace works and tells them where their store currently stands. It does not track their progress, score their store, or stand between them and any action.

**Presentation**

- The guide is a **paced card sequence**, using the shared shell specified in [System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts) — the same shell as the Store Close Report. This page owns the card content; it does not redefine the shell.
- **One idea per card.** Each card carries a short heading, two or three sentences of plain-language copy, and a visual of the thing being described.
- **Card media.** Each card ships with a still image at launch and is authored to accept a short looping clip in its place without a layout change. Clips loop silently, carry no playback controls, and are decorative-with-caption rather than load-bearing — every card must be fully understandable from its copy alone, for screen readers and for any card whose media has not yet been produced.

**Not a checklist**

The progress bar reflects **position in the card sequence**, not setup completion. The guide does not track completion state, mark steps done, or report store readiness. Store readiness is enforced where it belongs — the launch gate requires at least one visible product (Products Tab spec), and Step 1 validation governs required store settings. The guide describes those gates in plain language and must not duplicate, pre-empt, or contradict them.

**Card set — Individual Team Store**

1. **Cover.** Store name and logo. A **Draft** status chip reading *Not live yet*. One line stating that the store has been created but buyers cannot see it, and a supporting line that nothing here is required and the guide can be reopened from the workspace header.
2. **The tabs.** Products, Orders, My Team(s), Reports, Settings — one line each.
3. **How a product reaches the storefront.** Added → configured → visibility on → store launched. Names hidden items explicitly: they stay in the catalog and never show to buyers.
4. **Team Required vs. Team Supplied.** What each changes for the buyer; both file under the Team Gear category.
5. **The Stock Vault vs. a bundle.** The Stock Vault is the library of blank stock gear a rep pulls into any store; a bundle is buyer-facing, several catalog items sold as one storefront line. The card also names the third thing reps confuse with both — a **Catalog Template**, a saved set of this store's own gear that can be reused in a later store. One line each; the card teaches the distinction, not the mechanics.
6. **Launching, closing, re-opening.** Where the controls live, that a store needs at least one visible product to launch, and that closing is reversible. Terminal card — its primary action is **Done**, which closes the guide and lands the rep in the store workspace.

**Card set — League Store**

Identical, except card 2 names the league tab structure and card 3 is followed by a **divisions and teams** card explaining how teams are organized beneath the league and how products associate to teams. League orientation therefore runs seven cards to the individual store's six.

**Deliberately not taught**

The guide does not enumerate Settings sections, and the **Announcement Message** is not a card. It is optional, it is discoverable in two places a rep already visits (Step 1 during creation and Settings afterward), and an empty message produces no storefront banner — so a rep who never finds it suffers no broken state. Adding a card for every optional field is exactly the "too many words" failure the paced sequence was written to fix.

**Trigger and seen-state**

- **First open:** given a rep enters a store workspace for the first time after creating that store, when the workspace loads, then the Setup Guide is presented automatically.
- **Dismissal is remembered per rep, per store type.** Given a rep has been oriented on one store type, when they open another store **of that same type**, then the guide does not auto-present. Given they create their first store of the **other** type — individual after league, or league after individual — then the guide auto-presents once more, with that type's card set. A rep oriented on an individual team store has not been oriented on divisions and teams.
- **Reopenable on demand.** A persistent entry point in the workspace header reopens the guide at any time, for any store, regardless of seen-state. Opening on demand lands on card 1 with all controls available and no forced pacing.
- **Never a gate.** The guide blocks nothing. No store action — launching, adding products, editing settings — depends on having viewed or completed it.

**Draft state**

The cover card states the store's current status. This is the rep's first workspace entry after creation, and the single most valuable thing the guide can tell them is that the store is not yet visible to buyers. The status shown is read from the store's actual lifecycle state ([Store Status & Lifecycle](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4168908810/Store+Status+Lifecycle)), not assumed — a guide reopened from the header on a launched store shows **Open**, not Draft.

**Tone**

Educational and plain-language, written for a rep standing up their first store, not a reference manual. Orientation-level throughout — each card links out to the relevant tab rather than reproducing its spec.

**Naming**

The guide is the rep's first exposure to the product's vocabulary, so its card copy is **bound to the current labels** and must be re-checked whenever they change. As of August 31, 2026 those are: **Customizer** (not Brand Catalog), **Stock Vault** (not Product Vault), **Catalog Templates** (not Product Packages), and **Other stores**.

**Acceptance criteria**

- Given a rep completes store creation and enters the workspace for the first time, then the Setup Guide auto-presents on card 1.
- Given the guide is open, when the rep presses Next, clicks, taps, or uses the arrow keys, then the sequence advances one card and never auto-advances.
- Given any card, then the progress bar shows position in the sequence and no completion, readiness, or setup-progress state is displayed anywhere in the guide.
- Given the final card, when the rep selects Done, then the guide closes and the rep is in the store workspace.
- Given the rep dismisses the guide by any path — Done, Skip, X, Escape, backdrop — then it is marked seen for that rep for that store type.
- Given a rep who has been oriented on individual team stores, when they open another individual team store, then the guide does not auto-present.
- Given that same rep creates their first league store, when they enter the workspace, then the guide auto-presents once with the league card set.
- Given any store in any state, when the rep opens the guide from the workspace header, then it opens on card 1 regardless of seen-state.
- Given the cover card, then the status chip reflects the store's current lifecycle state as defined in Store Status & Lifecycle.
- Given a card whose looping media has not been produced, then the card renders its still image and remains fully understandable from its copy.
- Given any card, then every source and library it names matches the labels currently used on the Add Products page — no card teaches a retired term.

**Out of scope**

Completion tracking, per-store progress records, required acknowledgement, any coupling to the launch gate or validation, and any in-product motion toggle.

### Metrics & Success Criteria

- Tab task-completion time
- Workspace bounce rate
- Setup Guide: share of sequences completed to the final card vs. skipped or dismissed early, and the card index at which reps exit — a consistent drop-off point identifies the card that is not earning its place
- Setup Guide reopen rate from the workspace header — near zero suggests the content is not worth surfacing; a high rate suggests the workspace itself is unclear
- Share of reps who see the guide a second time via the store-type re-arm, and whether their league-store setup time differs from reps who do not
- Support contacts about "why isn't my product showing on the storefront" — the single question the guide most needs to answer
- Support contacts about a store not appearing live after creation — the question the Draft cover card is there to prevent
- Support contacts confusing the Stock Vault, Catalog Templates, and bundles — the distinction card 5 exists to draw

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires the store data model and a link from management state to the rendered storefront instance. The tab shell composes the five tab specs listed in Epic A and owns none of their behavior. In particular it holds **no reference to the Settings tab's section list or section count** — deep links into a specific Settings section carry a section key resolved by the Settings spec, so sections may be added or removed without a change here.

The **Store Setup Guide** requires a **per-rep, per-store-type dismissal flag** persisted at account scope, so a dismissal carries across every store of that type the rep opens while a first store of the other type re-arms the trigger once. It requires a header entry point to reopen it; a read of the store's current lifecycle state for the cover card's status chip; the shared paced-card-sequence shell specified in [System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts); and a media slot per card sized identically for a still image or a short looping clip, so clips can replace stills without a layout change. No completion state, no per-store progress records, and no coupling to the launch gate or any validation path.
