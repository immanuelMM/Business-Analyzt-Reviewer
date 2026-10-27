# Implementation Summary — Tabbed Store Dashboard
Sources: TS-Tabbed Store Dashboard-191026-075922.pdf (primary, 6 pages, rewritten Aug 24 2026, amended Aug 31 and Sep 2 2026). Cross-checked against: TS-Customize New Product, TS-Launch & Status Controls, TS-Order Management (Orders Tab), TS-Roster Management (My Team(s) Tab), TS-Store Analytics (Reports Tab), TS-Store Home (Home Tab), TS-Store Settings (Settings Tab), TS-Store Status & Lifecycle.

Refs use `Dash p.N` for the primary file. Other files: `Home`, `L&S` (Launch & Status Controls), `Lifecycle`, `Settings`, `Roster`, `CNP` (Customize New Product).

## 1. Scope
- **In scope:** the store workspace **shell** only: a full-height tabbed workspace with no marketing chrome, plus header controls (Dash p.1-2 Epic A)
- Tabs: Products, Orders, My Team(s), Reports, Settings. Each tab's contents are owned by its own spec, not by this one (Dash p.2) ⚠ open question OI-1 (Home adds a sixth tab, Home, and changes the order)
- Header/shell features: View live storefront ⚠ open question OI-3, switch stores ⚠ open question OI-8, open the Customizer ⚠ open question OI-9, and the Setup Guide re-entry point (Dash p.1, p.4)
- **Store Setup Guide:** an explanatory, dismissible paced card sequence for orientation (Dash p.3-5 Epic B)
- Launch, close and re-open controls are **not** in this spec. See Launch & Status Controls and Store Status & Lifecycle (Dash p.2)
- **Out of scope:** completion tracking, per-store progress records, required acknowledgement, any coupling to the launch gate or validation, and any in-product motion toggle (Dash p.5-6)
- **Deliberately not taught by the guide:** Settings sections and the Announcement Message (Dash p.4)

## 2. Actors & Roles
- **Store owner / rep** operating a single store: the only actor named (Dash p.2) ⚠ open question OI-10
- Rep sub-cases: first-time rep, rep setting up their first League store, experienced rep on their "twentieth store" (Dash p.2)
- Not covered here: non-owner reps, team-manager-role users, league directors. Other specs place these users in the workspace or the portal (Lifecycle Epic E/H; Settings Epic A2b, C; Roster p.2) ⚠ open question OI-10

## 3. Business Rules
**Shell**
- BR-1: When a store is opened, the workspace hides marketing chrome (Dash p.2 Epic A)
- BR-2: The tab count is fixed at five: Products, Orders, My Team(s), Reports, Settings (Dash p.2-3 Epic A) ⚠ open question OI-1
- BR-3: The shell renders the Settings tab only. It holds no reference to Settings sections or their count. Adding or removing a Settings section must never require a shell change (Dash p.3, p.6). Settings currently has 7 sections; Catalog & Decoration is conditional, so Prolook-only stores show 6 (Settings Epic A, Epic G)
- BR-4: Deep links into a Settings section carry a **section key** that the Settings spec resolves (Dash p.6; Settings Dependencies)
- BR-5: The shell composes the five tab specs and owns none of their behaviour (Dash p.6)

**Setup Guide: nature**
- BR-6: The guide is explanatory, not procedural. It does not track progress, score the store, report readiness, or block any action (Dash p.3)
- BR-7: The progress bar shows position in the card sequence only, never setup completion (Dash p.3)
- BR-8: The guide must not duplicate, pre-empt or contradict the launch gate or the Step 1 validation. It only describes them (Dash p.3) ⚠ open question OI-2
- BR-9: Never a gate. No store action (launch, add products, edit settings) depends on having viewed or completed the guide (Dash p.4)

**Setup Guide: content**
- BR-10: One idea per card. Each card has a short heading, 2-3 sentences of plain-language copy, and a visual (Dash p.3)
- BR-11: Each card has a still image at launch. The media slot accepts a short looping clip in place of the still with no layout change. Clips loop silently with no playback controls and are decorative-with-caption (Dash p.3) ⚠ open question OI-13
- BR-12: Every card must be fully understandable from its copy alone (screen readers, missing media) (Dash p.3)
- BR-13: Individual Team Store card set has 6 cards (Dash p.3-4):
  1. Cover: store name and logo, status chip ("Not live yet" for Draft), a line saying the store is created but buyers can't see it, and a line saying nothing here is required and the guide can be reopened from the header ⚠ open question OI-11
  2. The tabs: Products, Orders, My Team(s), Reports, Settings, one line each ⚠ open question OI-1
  3. How a product reaches the storefront: added → configured → visibility on → store launched. Hidden items stay in the catalog and are never shown to buyers ⚠ open question OI-17
  4. Team Required vs. Team Supplied: what each changes for the buyer. Both file under the Team Gear category
  5. Stock Vault vs. bundle vs. Catalog Template: one line each, teaching the distinction, not the mechanics ⚠ open question OI-18
  6. Launching, closing, re-opening: where the controls live, the need for at least one visible product to launch, and that closing is reversible. Terminal card; its primary action is **Done** ⚠ open question OI-2 ⚠ open question OI-4
- BR-14: League Store card set has 7 cards. It is the same as the individual set except that card 2 names the "league tab structure", and a divisions-and-teams card follows card 3 (how teams are organised beneath the league and how products associate to teams) (Dash p.4) ⚠ open question OI-12
- BR-15: Each card links out to the relevant tab rather than reproducing its spec (Dash p.5) ⚠ open question OI-14
- BR-16: Card copy is bound to current product labels and must be re-checked whenever they change. As of Aug 31 2026: Customizer (not Brand Catalog), Stock Vault (not Product Vault), Catalog Templates (not Product Packages), Other stores (Dash p.5) ⚠ open question OI-12

**Setup Guide: trigger and seen-state**
- BR-17: Auto-present on the rep's first entry into a store workspace after creating that store (Dash p.4) ⚠ open question OI-5
- BR-18: The seen flag is **per rep, per store type** (Individual / League), persisted at account scope. Once the rep is oriented on one type, the guide does not auto-present for other stores of that type (Dash p.4, p.6)
- BR-19: When a rep creates their first store of the *other* type, the guide auto-presents once more with that type's card set (Dash p.4)
- BR-20: Any dismissal path (Done, Skip, X, Escape, backdrop) marks the guide seen for that rep and store type (Dash p.5) ⚠ open question OI-5
- BR-21: Reopen on demand: a persistent workspace-header entry point opens the guide for any store, in any state, regardless of seen-state. It lands on card 1 with all controls available and no forced pacing (Dash p.4). Home adds a second caller of the same reopen path (Home Epic B)
- BR-22: Advancing happens only on user input (Next, click, tap, arrow keys), one card at a time. There is never auto-advance (Dash p.5)

**Setup Guide: status**
- BR-23: The cover chip reads the store's actual lifecycle state (Draft / Open / Closed / Archived) and never assumes Draft. For example, a guide reopened on a launched store shows Open (Dash p.4-5; Lifecycle Store Definitions) ⚠ open question OI-11
- BR-24: The Setup Guide and the Store Close Report never fire together, because a store can't be both newly created and freshly closed. Both take precedence over Home (Home Epic B)

## 4. Data
- **Store data model** with a link from management state to the rendered storefront instance (Dash p.6)
- **Setup Guide dismissal flag:** key = (rep account, store type ∈ {Individual Team, League}); value = seen. Persisted at account scope, not per store or session (Dash p.6)
- No completion state and no per-store progress records may be stored (Dash p.6)
- **Store lifecycle state** is read only, for the cover chip. Values: Draft, Open, Closed, Archived (Dash p.5; Lifecycle)
- **Store type:** Individual Team Store / League Store (Dash p.3-4; Settings Epic A) ⚠ open question OI-12
- **Card definition** (per store type): index, heading, copy, still image, optional looping clip, caption, link target. The media slot has one size for both still and clip (Dash p.3, p.6) ⚠ open question OI-14
- **Settings section key:** owned by the Settings spec and opaque to the shell (Dash p.6)

## 5. Flows
- **Open workspace:** rep opens a store → shell loads without marketing chrome → tabs render. No default tab is stated here; Home says Home is the default unless a deep link specifies a tab (Dash p.2; Home Epic A) ⚠ open question OI-1
- **First entry after creation:** workspace loads → if the (rep, store type) flag is unset, the guide auto-presents on card 1 over the workspace → rep advances card by card → Done on the terminal card closes the guide and leaves the rep in the workspace → flag set (Dash p.4-5) ⚠ open question OI-5
- **Early dismissal:** Skip, X, Escape or backdrop at any card → guide closes → flag set (Dash p.5)
- **Second store of same type:** no auto-present (Dash p.4)
- **First store of the other type:** auto-presents once with that type's card set (Dash p.4)
- **Reopen:** header entry point (or Home link) → card 1, free navigation, no pacing. The seen flag is not consulted (Dash p.4; Home Epic B)
- **View live storefront:** opens the consumer view of this store (Dash p.2) ⚠ open question OI-3
- **Switch store:** switch to another store without leaving the workspace. Not specified (Dash p.2) ⚠ open question OI-8
- **Open Customizer** from the workspace. Not specified (Dash p.1) ⚠ open question OI-9
- **Archived store:** the workspace is read-only (Lifecycle Epic E; Settings Epic C). Shell behaviour is not specified ⚠ open question OI-15

## 6. Integrations
- **Shared paced-card-sequence shell** (System Modals & Toasts), the same component as the Store Close Report. This spec owns card content only (Dash p.3, p.6; Lifecycle Close Report) ⚠ open question OI-6
- **Store lifecycle read model** (Store Status & Lifecycle) for the cover chip (Dash p.5-6)
- **Storefront route** for View live storefront / Preview Store (Dash p.2, p.6; L&S Live header controls) ⚠ open question OI-3
- **Five tab specs** composed by the shell, with section-key deep links into Settings (Dash p.2, p.6)
- **Customizer** (external "Customizer 3.0", brand-scoped via QX7). The link from the shell is undefined (CNP Dependencies) ⚠ open question OI-9
- No notifications or exports are defined by this spec

## 7. Non-Functional
- **Accessibility:** every card is fully understandable from copy alone (screen readers). Looping media is decorative-with-caption (Dash p.3) ⚠ open question OI-13
- **Motion:** no in-product motion toggle (Dash p.6). Shared motion rules live in System Modals & Toasts (Lifecycle Close Report "Experience principles") ⚠ open question OI-6
- **Tone:** educational, plain language, orientation-level. Fixes "too many words" (Dash p.5)
- **Vocabulary binding:** copy must match current labels (Dash p.5)
- **Metrics:** tab task-completion time, workspace bounce rate, guide completion vs early exit and exit card index, reopen rate, store-type re-arm share, and support-contact volumes (Dash p.6) ⚠ open question OI-16

## 8. Acceptance Criteria
- AC-1: Given I open a store, when the workspace loads, then marketing chrome is hidden and the tabs Products, Orders, My Team(s), Reports and Settings are available (Dash p.2 Epic A) ⚠ open question OI-1
- AC-2: Given I choose View live storefront, when it opens, then I see the consumer view of this store (Dash p.2 Epic A) ⚠ open question OI-3
- AC-3: Given a Settings section is added or removed, then no change to the shell is required (Dash p.3, p.6)
- AC-4: Given a rep completes store creation and enters the workspace for the first time, then the Setup Guide auto-presents on card 1 (Dash p.5)
- AC-5: Given the guide is open, when the rep presses Next, clicks, taps or uses the arrow keys, then the sequence advances one card and never auto-advances (Dash p.5)
- AC-6: Given any card, then the progress bar shows position in the sequence, and no completion, readiness or setup-progress state is shown anywhere in the guide (Dash p.5)
- AC-7: Given the final card, when the rep selects Done, then the guide closes and the rep is in the store workspace (Dash p.5)
- AC-8: Given the rep dismisses the guide by any path (Done, Skip, X, Escape, backdrop), then it is marked seen for that rep for that store type (Dash p.5) ⚠ open question OI-5
- AC-9: Given a rep oriented on Individual Team stores, when they open another Individual Team store, then the guide does not auto-present (Dash p.5)
- AC-10: Given that rep creates their first League store, when they enter the workspace, then the guide auto-presents once with the League card set (7 cards) (Dash p.4-5)
- AC-11: Given any store in any state, when the rep opens the guide from the workspace header, then it opens on card 1 regardless of seen-state (Dash p.5)
- AC-12: Given the cover card, then the status chip reflects the store's current lifecycle state as defined in Store Status & Lifecycle (Dash p.5) ⚠ open question OI-11
- AC-13: Given a card whose looping media has not been produced, then the card renders its still image and is fully understandable from its copy (Dash p.5)
- AC-14: Given any card, then every source and library it names matches the labels currently used on the Add Products page. No card teaches a retired term (Dash p.5; CNP source chips: Customizer, Stock Vault, Catalog Templates, Other stores)
- AC-15 (implied): Given any store action (launch, add products, edit settings), then it is available whether or not the rep has viewed or completed the guide (Dash p.4 "Never a gate")
- AC-16 (implied): Given the guide card set, then no card enumerates Settings sections or covers the Announcement Message (Dash p.4)

## 9. Dependencies & Assumptions
- Depends on the **System Modals & Toasts** spec (paced-card shell, Skip/X/progress bar, motion), which is not in the input set ⚠ open question OI-6
- Depends on **Product Catalog Management & Publishing (Products Tab)**, the owner of the launch gate and Add Products labels, which is not in the input set ⚠ open question OI-6
- Depends on the per-rep, per-store-type flag being persisted at account scope (Dash p.6)
- Depends on the lifecycle state read model (Lifecycle; L&S Dependencies)
- Store Home requires amending this shell to six tabs ("see Appendix A"), but Appendix A is not in the Home PDF ⚠ open question OI-1 ⚠ open question OI-6
- Lifecycle still uses retired tab names (Detail, Roster) and "Pause", which conflicts with this shell's tab set ⚠ open question OI-4
- Create Template sits in the header (L&S) or on the Settings Store Status card (Settings). Header composition is undefined ⚠ open question OI-7 ⚠ open question OI-8
- Assumption: "Draft" status chip text "Not live yet" is the Draft display label and other states show their canonical name ⚠ open question OI-11
- Cross-checked with no conflict found: Settings 7 sections and conditional Catalog & Decoration (Settings Epic A, G); Announcement Message in Step 1 and Settings with no banner when empty (Settings Epic I); Close Report shares the paced shell and its seen-state is separate (Lifecycle Close Report); no reduce-motion control (Lifecycle Experience principles); Add Products source-chip labels (CNP A4)

## Open items
See `clarification-questions.md` in this run folder for the full questions. Q-ID in brackets.
- ⚠ open question OI-1 (Q-1) — five tabs (Dashboard) vs six tabs with Home first and default (Home); tab order differs
- ⚠ open question OI-2 (Q-2) — launch gate "≥1 visible product" (Dashboard) vs "≥1 product added" (L&S, Lifecycle)
- ⚠ open question OI-3 (Q-4) — "View live storefront" vs Preview Store (post-launch only); behaviour on Draft/Closed/Archived
- ⚠ open question OI-4 (Q-7) — Lifecycle uses Detail/Roster tabs and "Pause"; Store Status/Archive location
- ⚠ open question OI-5 (Q-15, Q-17) — trigger for non-creators, existing reps, abandoned sessions; Skip undefined
- ⚠ open question OI-6 (Q-8) — System Modals & Toasts, Products Tab spec and Home Appendix A missing
- ⚠ open question OI-7 (Q-9) — Create Template: header menu (L&S) vs Settings Store Status card
- ⚠ open question OI-8 (Q-5) — store switcher and overall header composition unspecified
- ⚠ open question OI-9 (Q-6) — workspace "open the Customizer" vs brand-resolved Customize New Product entry
- ⚠ open question OI-10 (Q-11) — roles: who may open the shell and see the guide (non-owner reps, team managers)
- ⚠ open question OI-11 (Q-10) — cover copy and chip label for Open/Closed/Archived
- ⚠ open question OI-12 (Q-14) — "league tab structure" undefined; store-type and tab-label naming drift; which bound-terms list applies
- ⚠ open question OI-13 (Q-12) — looping clips vs OS reduced-motion / WCAG pause; alt-text rules
- ⚠ open question OI-14 (Q-16) — card link-outs: close/seen behaviour, targets; copy and asset ownership
- ⚠ open question OI-15 (Q-3) — shell behaviour on Archived (read-only) stores and how they're reached
- ⚠ open question OI-16 (Q-18) — no analytics instrumentation defined for the metrics
- ⚠ open question OI-17 (Q-13) — card 3 path omits other visibility blockers (art clearance, render processing, incomplete bundle)
- ⚠ open question OI-18 (Q-9) — card 5 Catalog Template ("saved set of this store's own gear") vs Create Template blueprint scope
