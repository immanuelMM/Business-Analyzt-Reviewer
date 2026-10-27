---
title: Store Status & Lifecycle
confluence_id: 4168908810
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4168908810/Store+Status+Lifecycle
last_modified: 2026-10-20
pulled: 2026-10-26
---
**Correction pass — October 20, 2026.** This spec had drifted from the current product in three ways, all fixed below. The workspace tabs are **Home, My Team(s), Products, Orders, Reports, Settings** — there is no **Detail** tab (its contents are now the **Settings** tab, and the Store Status card sits in its **Schedule & Status** section) and no **Roster** tab (renamed **My Team(s)** in July 2026). The manual Open → Closed action is **Close Store**, not **Pause** — the transitions table said Pause while Epic B already said Close Store. And the Close Report's **Team Profit** chart is now the **Team Revenue** chart, Team Profit having been removed from the product on September 1, 2026. A stray paragraph about rep verification, EIN, and banking has also been removed from Dependencies; it belonged to another spec. No behavior changes — this is naming and accuracy only.

### Executive Summary & Problem Statement

#### The Problem

Store status governs buyer access, order intake, workspace permissions, and reporting across the entire platform — but the rules defining what each state means, how transitions occur, and what changes per surface are scattered across individual UI epics rather than defined in one authoritative place.

#### The Solution

A single source of truth for all four store states — **Draft**, **Open**, **Closed**, and **Archived** — covering their definitions, valid transitions, behavioral consequences per surface, and acceptance criteria. All other features reference this section for status semantics; they own only the UI surface that triggers a transition.

‌

### Store Definitions

| **Status** | **Detail** |
| --- | --- |
| Draft DRAFT | The default state of every newly created store. The storefront is not live and is inaccessible to buyers. The rep has full management access to configure the store — products, roster, settings, and schedule. A Draft store **cannot be launched until at least one product has been added**. Once launched it transitions to **Open** and cannot return to Draft. Draft stores exist only in the management workspace. |
| Open OPEN | The store is fully operational. The storefront is publicly accessible; buyers can browse, configure, and place new orders. The rep has full management access. This is the state a store enters on launch and returns to when manually re-opened from Closed. |
| Closed CLOSED | The storefront is closed to new orders, but the management workspace remains fully editable and existing orders continue to process normally. Can be entered **manually** (rep closes the store from the Store Status card) or **automatically** when a pop-up store's configured ordering window close date is reached. The store can be re-opened to Open at any time. *Corresponds to the “store closing” state specified in* [*Store Settings (Settings Tab)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab)*, Epics C–D.* |
| Archived ARCHIVED | The store is permanently shut down. The storefront is hidden from all buyers immediately; no new orders can be placed; any active ordering window is closed; and the store is removed from the active stores list. All order history and reports are retained as a read-only record. **Cannot be self-reversed** — restoring an archived store can only be done by a managing rep. |

#### Valid State Transitions

| **From \> To** | **Trigger - Who - Reversible?** |
| --- | --- |
| **Draft → Open** | Manual only — rep clicks Launch Store (requires at least one product to be added first). Rep only. **One-way** — a store cannot return to Draft once launched. |
| **Open → Closed** | Manual (rep clicks **Close Store** on the Store Status card) *or* automatic (scheduled ordering window close date reached). Rep or system. **Reversible** — rep re-opens to Open at any time. |
| **Closed → Open** | Manual only — rep clicks Re-open Store on the Store Status card. Rep only. **Reversible**. |
| **Open → Archived** | Manual only — store owner clicks Archive Store in the **Danger Zone of the Store Status card, in Settings → Schedule & Status**. Owner only. **Irreversible** without a support request. |
| **Closed → Archived** | Manual only — store owner clicks Archive Store in the **Danger Zone of the Store Status card, in Settings → Schedule & Status**. Owner only. **Irreversible** without a support request. |
| **Archived → Open***or***Closed** | **Not self-service.** Requires a Prolook support request. Support staff only. |
| **Open / Closed / Archived → Draft** | **Not allowed.** Draft is the entry state only. Once a store is launched it can never return to Draft. |

**Note:** There is no store deletion. Archiving is the terminal state. Draft (pre-launch) is a setup state and not part of the Open / Closed / Archived lifecycle — it transitions to Open on first launch.

‌

#### Behavior Matrix by Surface

| **Surface** | **Draft** | **Open** | **Closed** | **Archived** |
| --- | --- | --- | --- | --- |
| **Storefront (buyer-facing)** | Not live — storefront URL is inaccessible to buyers | Fully accessible — browse, configure, checkout | “This store is closed” landing page — no shopping or checkout | Hidden immediately — URL serves a neutral closed screen |
| **New orders** | Blocked — not live | **Allowed** | **Blocked** | **Blocked** |
| **Existing / in-flight orders** | None — store has never been open | Unaffected | Unaffected — continue to process normally | Unaffected — retained as read-only history |
| **Management workspace** | Fully editable | Fully editable | Fully editable — changes go live on re-open | Read-only — all records viewable, nothing editable |
| **Open stores list** | Visible — Draft badge | Visible — Open badge | Visible — Closed badge | Removed from list entirely |
| **Ordering window (pop-up only)** | Configurable but not running | Runs as configured | Suspended — does not advance | Closed immediately and permanently |
| **Order history & reports** | Empty — no orders yet | Accessible | Accessible | Retained — read-only |
| **Store Close Report** | Not applicable — no window has run | Not yet generated — becomes available on close | Auto-triggers on first workspace entry after close; available on demand from the Reports tab | Viewable read-only; exports still available |
| **Overview KPI — Open Stores count** | Not counted | Counted | Not counted | Not counted |

‌

‌

### User persona & use cases

**Who is this for?** Store owners (reps) managing store availability; Prolook support agents handling archive reversals; buyers who encounter a closed or archived storefront URL.

**Scenarios encountered** Setting up a new store in Draft before it's ready to go live; attempting to launch without any products added; manually closing a store mid-season to make catalog changes; a pop-up store auto-closing when its ordering window closes; extending a window by re-opening; permanently archiving a store at season end; a buyer landing on a closed storefront URL.

‌

## Functional Requirements & Acceptance Criteria

#### User Stories

- As a rep, I want my new store to start as a draft so I can configure it fully before any buyers can see it.
- As a rep, I want to be prevented from launching a store with no products, so I don’t accidentally go live with an empty catalog.
- As a rep, I want to close my store so buyers can’t place new orders while I make changes, knowing I can re-open it at any time.
- As a rep, I want the store to automatically close when its ordering window closes, so I don’t have to manually intervene at end-of-window.
- As a rep, I want to re-open a closed store so my changes go live and buyers can order again.
- As a rep, I want to archive a store at season end so it’s removed from my active list while all history is preserved.
- As a buyer, I want a clear message when I land on a closed or archived storefront, so I understand why I can’t order.
- As a rep, I want a complete review of everything that happened during the store’s ordering window the moment it closes, so I can verify the numbers, hand off fulfilment, and report back to the team without assembling it myself.
- As a rep, I want to pull that close report up again later on demand, so I’m not dependent on catching it the first time.

Epic A — Draft state & launch

- **Default state on creation:** Given a rep completes the store creation wizard and deploys, when the store is created, then it enters **Draft** state. The storefront is not live and no buyer-facing URL is accessible.
- **Full workspace access:** Given a Draft store, when the rep opens the management workspace, then all six tabs (**Home, My Team(s), Products, Orders, Reports, Settings**) are accessible and fully editable — the rep can configure everything before launch.
- **Launch gate — product required:** Given a Draft store with **zero products**, when the rep attempts to launch, then the launch action is **disabled** and a clear message explains that at least one product must be added before the store can open.
- **Launch gate satisfied:** Given a Draft store with **at least one product added**, when the rep clicks Launch Store, then the store transitions to **Open** immediately and the storefront becomes publicly accessible.
- **One-way transition:** Given a store that has been launched and is now Open, Closed, or Archived, then the Draft state is **not available** as a target — there is no “revert to draft” action anywhere in the UI.
- **Draft badge in stores list:** Given a Draft store, when it appears in the Stores tab list, then it shows a **Draft** badge and is excluded from the Open Stores KPI count.
- **Draft is stated at first entry:** Given a newly created Draft store, when the rep enters the workspace for the first time, then the Store Setup Guide's cover card states that the store is not yet live — see [Tabbed Store Dashboard](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153409540/Tabbed+Store+Dashboard), Epic B. The guide reports status only; it does not enforce the launch gate.

Epic B — Closing a store (manual)

- **Trigger surface:** Given an Open store, when the rep opens the **Store Status card in Settings → Schedule & Status**, then a **Close Store** action is available. If the store is already Closed, the action is not shown.
- **Confirmation:** Given the rep clicks Close Store, when the confirmation appears, then it discloses: buyers won’t be able to place new orders while the store is closed; existing orders are unaffected; the store can be re-opened at any time.
- **Immediate state change:** Given the rep confirms, when the action is applied, then the store transitions to **Closed** instantly — the storefront shows a closed landing page and the status badge updates to Closed.
- **Workspace access retained:** Given the store is Closed, when the rep opens any workspace tab (**Home, My Team(s), Products, Orders, Reports, Settings**), then all content remains fully editable.
- **No order disruption:** Given the store is Closed and orders are in-flight, then those orders continue to process normally — no automatic cancellation or hold is applied.
- **Close Report generated:** Given the store transitions to Closed by any path, then a **Store Close Report** is generated for that close event — see the Store Close Report section and Epic H below.

Epic C — Auto-close on ordering window close (pop-up stores)

- **Trigger:** Given a pop-up store with a configured close date/time, when that moment is reached, then the store automatically transitions to **Closed** — no rep action required.
- **Behavioral parity:** Given the auto-close has fired, then storefront access, order handling, workspace editability, and status badge behavior are identical to a manually closed store.
- **Rep notification:** Given auto-close has fired, when the rep next opens the workspace, then a banner or status indicator informs them the ordering window has closed and the store is now Closed. *The Store Close Report (Epic H) is the primary presentation of this notification — the report modal replaces the banner as the entry point on first entry after close.*
- **Re-open available:** Given the auto-closed store, when the rep wants to extend or restart the window, then they can re-open to Open from the Store Status card and optionally edit the store schedule.

Epic D — Re-opening a closed store

- **Trigger surface:** Given a Closed store, when the rep opens the Store Status card, then a **Re-open Store** action is available (Close Store is not shown while closed).
- **No confirmation required:** Given the rep clicks Re-open Store, then the store transitions to **Open** immediately — re-opening is a low-risk, reversible action and requires no confirmation modal.
- **Workspace changes go live:** Given edits were made in the workspace while Closed, when the store is re-opened, then those changes are reflected on the live storefront immediately.
- **Status badge updates:** Given the store is now Open, then the status badge updates to Open in the store list, workspace header, and any KPI aggregations.
- **Prior Close Report retained:** Given the store is re-opened, then the Close Report for the previous close event remains viewable on demand and is not overwritten. A subsequent close produces a new, separately scoped report.

Epic E — Archiving a store

See also: [**Store Settings (Settings Tab)**](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab) **— Epic C (Store archiving)** for the UI surface (Danger Zone placement within the Store Status card, modal copy). This epic defines the behavioral contract; that feature owns the controls.

- **Owner-only:** Given a store in Open or Closed state, when a rep who is *not* the owner opens **Settings → Schedule & Status**, then the Archive Store action is **not visible to them**.
- **Confirmation — full consequences disclosed:** Given the owning rep clicks Archive Store, when the confirmation modal appears, then it explicitly states all four consequences: (1) the storefront is hidden from all buyers immediately; (2) no new orders can be placed and any active ordering window is closed; (3) the store is removed from the active stores list; (4) order history and reports are retained. It also states that **this can only be undone by Prolook support**.
- **Immediate storefront takedown:** Given the rep confirms, when archiving is applied, then the public storefront URL immediately serves a neutral closed screen and is no longer discoverable or shoppable.
- **Removed from active list:** Given the store is Archived, when the rep views the Stores tab, then the store no longer appears in the list.
- **Read-only workspace:** Given the store is Archived, when the rep opens the management workspace, then settings, products, roster, and orders are all visible but **no field or action is editable**.
- **History fully retained:** Given the store is Archived, then all order history, reports, roster data, and product records are permanently retained and accessible in the read-only workspace.
- **Support-only reversal:** Given the rep wishes to un-archive, when they contact Prolook support, then support can reverse the Archived state — **no self-service reversal path exists in the product UI**.

Epic F — Buyer-facing closed storefront screen

- **Closed store:** Given a buyer visits a Closed store’s URL, when the page loads, then they see a neutral *“This store is currently closed”* screen — no products, cart, or checkout are accessible.
- **Archived store:** Given a buyer visits an Archived store’s URL, when the page loads, then they see the same neutral closed screen — the storefront is indistinguishable from Closed to buyers; no indication it is permanently archived is surfaced.
- **No leakage:** Given either Closed or Archived state, when a buyer attempts to access a product URL or checkout URL directly, then they are redirected to the closed screen — no part of the storefront is accessible via direct link.

Epic G — Status badge & filter alignment

- **Badge display:** Given any store in the Stores tab list, when rendered, then its status badge reflects current state: **Draft** (blue), **Open** (green), **Closed** (amber). Archived stores do not appear in the list.
- **Filter parity:** Given the Stores tab Filter control, when opened, then **Draft**, **Open**, and **Closed** are available as status filter values. Archived is not a filter option — those stores are excluded from the list entirely. The retired terms **Active** and **On Hold** must not appear as filter values.
- **Overview KPI:** Given the **Open Stores** KPI card on the Overview, when rendered, then it counts only stores in the **Open** state — Closed and Archived stores do not contribute to the count.

---

### Store Close Report

The moment a store closes is the one moment a rep needs the whole window summarized in one place — and today nothing does that. The rep is left assembling the picture manually across the Reports tab, the Orders tab, and the Fundraising Report. The **Store Close Report** closes that gap and becomes the opening step of the store-closing flow.

This section defines the behavioral contract for the report. The **Reports** tab owns the on-demand entry point and the report UI itself; the **Store Status** card owns the secondary link.

#### Definition & scope

The Store Close Report is a complete review of every order placed during the store’s **Active Order Window** (open date → close date), plus summarized performance data for that window. It serves two jobs at once:

- **Summary layer** — a card-paced, progressively revealed recap of the window’s headline numbers, designed to be read in under a minute and shared with the team or league.
- **Detail layer** — the full order-level operational record the rep verifies, reconciles, and exports for fulfilment.

The report is generated per **close event**. A close event is any transition into **Closed**, whether manual (Close Store) or automatic (ordering window close date reached). A store that is re-opened and later closed again produces a **new** close event with a new report scoped to the new window; prior reports are retained.

**Note:** The Close Report is a **read layer only**. It introduces no new metrics, no new state, and no changes to the lifecycle state machine, notifications, or the buyer-facing closed storefront screen. Every figure it shows is sourced from — and must reconcile exactly with — the Reports tab and the Orders tab.

#### Trigger & presentation

- **Auto-trigger condition:** the store is in **Closed** state *and* the current user has not yet seen the report for this close event.
- **Presentation:** a prominent full-screen modal (a dedicated full-page route at narrow viewport widths) shown on first workspace entry after close. It kicks off the closing flow and serves as the presentation of the Epic C rep notification. The summary layer uses the shared **paced card sequence** shell specified in [System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts) — this section owns the card payload and the trigger, not the shell.
- **Seen state is per user.** A rep and an invited team-manager-role user each see the auto-trigger once for the same close event.
- **Dismissal:** primary action **View full report** (opens the detail layer); secondary **Done** / close icon; Escape key and backdrop click also dismiss. Any dismissal marks the report as seen for that user.
- **Subsequent visits:** no auto-trigger. The workspace shows the normal Closed state and the report is reachable on demand.
- **Re-close:** Closed → Open → Closed re-arms the auto-trigger once for the new close event.
- **Always-open (non-pop-up) stores:** no scheduled close date exists, so the auto-trigger only fires after a manual Close Store.
- **Archived stores:** the report remains viewable on demand as part of the read-only record; no auto-trigger fires.

#### On-demand access

- **Primary entry point — Reports tab.** A **Store Close Report** entry sits at the top of the Reports tab. It is available when the store is Closed or Archived; for Draft and Open stores it renders disabled with helper text (“Available when the store closes”).
- **Secondary entry point — Store Status card.** A **View Close Report** link sits alongside the Close Store / Re-open Store actions, so the report is reachable from the same card that governs the transition.
- **Review mode.** Opening on demand lands on the summary layer with all controls visible and no forced pacing, with the detail layer one click away. The user is never trapped in the paced sequence.

#### Report contents

| **Layer** | **Contents** |
| --- | --- |
| **Summary layer** (hero treatment, one figure per view) | **Total Revenue** · **Orders** · **Net Fundraising** (only when Team Fundraising is enabled; **Avg. Order Value** is promoted into this slot when it is disabled) · one derived superlative — **top product by quantity ordered**. Each figure carries its exact value, its unit, and an “as of \[close date\]” stamp, plus the vs.-last-period trend delta the KPI cards already use. |
| **Detail layer** (tables and charts) | Full **order table** scoped to the window, at line-item grain: Web Order #, Factory Order #, order origin badge, buyer, roster / team, product, size, quantity, unit price, line total, personalization (name / number), production stage, PO number, tracking, fulfilment status, and any Minimum Quantity Fee — with the existing Orders toolbar (search, sort, filter, date range, column visibility, row selection). Plus the **Team Revenue** chart for the window; **Pending Orders** count and any below-MOQ containers still open at close; the **Fundraising Report** breakdown (Fundraising Collected, Platform Fees, Card Processing Fees, Net Fundraising); **Avg. Order Value**; the production-stage mix (Order placed → Confirmed → Artwork → Factory production → Shipped → Delivered); and a refunds / cancellations summary. |

Refunds and cancellations net out of revenue consistently with the Reports tab, and the netting is stated on the report so the summary and detail figures always reconcile.

**On Team Revenue.** The detail layer previously specified a **Team Profit** chart. Team Profit was removed from the product on September 1, 2026 and has no source, so the chart is the **Team Revenue** chart — gross buyer spend on orders attributable to the team — matching [Store Analytics (Reports Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049253/Store+Analytics+Reports+Tab), Epic C. Per the read-layer rule above, this report must read that same series rather than compute its own, and no surface of this report may describe the figure as profit or margin.

#### Exports

- **Summary PDF** — a presentation-ready one-pager carrying store name, Team Logo and Team Colors, the Active Order Window dates, the hero figures, and the **Team Revenue** trend. Follows the existing Fundraising Report *Download PDF* pattern, including a settings step (summary style, detailed breakdown, selected date range, report notes).
- **Full order-level CSV** — every order in the window at line-item grain, following the existing All Orders *CSV Export* pattern and respecting the current column-visibility selection.
- **PDF and CSV are the only export formats.** No image or share-card export is in scope.
- **File naming:** `StoreCloseReport_[StoreName]_[CloseDate].pdf` and `StoreCloseReport_[StoreName]_[CloseDate].csv`.

#### Roles & permissions

- **Rep / store owner:** full access to the report and both exports.
- **Team-manager role:** full parity with the rep *for this report* — a team-manager-role user may view and export everything the report contains. Owner-only lifecycle actions (notably Archive Store, per Epic E) remain hidden and are unaffected.
- No separate dealer or decorator view is required.

#### Experience principles

The report is data-dense but must read as accessible and familiar rather than as a spreadsheet — the reference points are Apple Music Replay and Spotify Wrapped, adapted with restraint for an operator who has to trust the numbers.

- **Step down, don’t wall off.** Cover → three to five hero figures → a full recap card → a clear handoff into the detail tables. A persistent **Skip to full report** control and a progress indicator are visible at all times.
- **User-paced.** One figure per view, advanced by click, tap, or arrow keys. No auto-advance.
- **Restrained motion.** Fades and scale-ins around 200–300ms; a count-up on the hero figure only. No parallax or confetti, and no looping animation on a figure card — motion must never compete with a number the rep is being asked to trust. Motion is otherwise specified once for both paced card sequences in [System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts); there is no in-product reduce-motion control.
- **Three type levels only** — hero figure, section header, label — with tabular lining numerals throughout so figures align and do not jitter during count-up.
- **Store-owned palette.** The report uses the store’s configured Team Colors and Team Logo. Color communicates status (trend up / down) rather than decoration.
- **Trustworthy by default.** Every hero view shows the exact figure and its as-of date. Celebratory framing is suppressed wherever the data does not support it.

Epic H — Store Close Report

- **Generated on every close event:** Given a store transitions to **Closed** by any path, then a Store Close Report scoped to that Active Order Window is generated and available.
- **Auto-trigger on first entry:** Given a Closed store and a user who has not yet seen the report for that close event, when that user next opens the workspace, then the Store Close Report is presented as a prominent full-screen modal before any other workspace content is actionable.
- **Trigger fires once per user per close event:** Given the user has viewed or dismissed the report, when they re-enter the workspace, then the modal does **not** re-appear and the workspace loads in its normal Closed state.
- **Re-close re-arms the trigger:** Given a store goes Closed → Open → Closed, when a user next enters the workspace, then the modal fires once more for the new close event, scoped to the new window.
- **Dismissal paths:** Given the modal is open, when the user selects View full report, Done, the close icon, Escape, or the backdrop, then the modal closes and the report is marked seen for that user. View full report additionally lands them on the detail layer.
- **On-demand availability:** Given a Closed or Archived store, when the user opens the **Reports** tab, then a Store Close Report entry is present and opens the report in review mode.
- **Unavailable before close:** Given a Draft or Open store, when the user opens the Reports tab, then the Store Close Report entry is visible but **disabled**, with helper text explaining it becomes available when the store closes.
- **Secondary entry point:** Given a Closed store, when the rep opens the Store Status card, then a **View Close Report** link is available alongside Re-open Store.
- **Figures reconcile:** Given the report is open, then every figure in the summary layer matches the corresponding figure on the Reports tab for the same window — no figure is computed by a second, divergent method.
- **No retired metric is reported:** Given the report is open, then no figure, chart, axis label, or export header describes **Team Profit** — the team-side series is **Team Revenue** and is read from the Reports tab.
- **Complete order coverage:** Given the report’s detail layer, then **every** order placed during the Active Order Window is present, including cancelled and refunded orders, each with its current production stage and fulfilment status.
- **Exports:** Given the report is open, when the user exports, then a summary **PDF** and a full order-level **CSV** are both available, named per the convention above. No other export format is offered.
- **Team-manager parity:** Given a team-manager-role user opens the report, then they can view and export the same content as the rep; owner-only lifecycle actions remain hidden.
- **Retained after re-open and archive:** Given a store is re-opened or archived, then previously generated Close Reports remain viewable on demand and their exports continue to work.
- **Skip is always available:** Given the summary layer is displayed at any point in the sequence, then a Skip to full report control is visible and moves the user directly to the detail layer.

#### Edge cases

| **Case** | **Behavior** |
| --- | --- |
| Zero orders in the window | Superlatives and celebratory framing are suppressed. The report shows a calm factual summary of the window and its dates, and the detail layer shows an empty state. Exports still produce valid files with headers and zero rows. |
| Very low order count (single order) | The top-product superlative degrades to that one order and is phrased so it does not imply a ranking that does not exist. |
| Closed with unfulfilled / in-production orders | The summary layer still reports window totals. The detail layer surfaces a prominent count of orders not yet shipped alongside the production-stage mix, reinforcing that existing orders continue to process after close. |
| Closed with unsettled payment (open PO) | Affected orders are flagged in the detail table and summarized in a needs-attention strip. Framing is factual, not alarmist. |
| Refunds and cancellations present | A refunds / cancellations summary (count and amount) appears in the detail layer, netted against revenue consistently with the Reports tab, with the netting stated on the report. |
| Below-MOQ containers still open at close | Listed in the detail layer with their MOQ progress and any itemized Minimum Quantity Fee, so the rep can see what did not reach minimum before the window closed. |
| Very large stores | The summary layer is fixed size regardless of order volume. The detail table paginates and virtualizes; exports still contain the complete data set. |
| Team Fundraising disabled | The Net Fundraising hero figure and the fundraising breakdown are omitted entirely; Avg. Order Value is promoted into the vacated hero slot. |

‌

### Metrics & Success Criteria

- Launch gate enforcement: 0% of stores successfully launch with zero products
- Draft-to-launch conversion rate (signal for setup friction)
- Auto-close accuracy: 100% of pop-up stores transition to Closed at their configured close date/time
- Zero buyer orders accepted while a store is in Closed or Archived state
- Close → re-open cycle time (signal for how quickly reps act after a window closes)
- Archive rate per season (adoption of intentional lifecycle management vs. stores abandoned in Open)
- Support tickets for archive reversal (informs whether a self-service undo path is needed)
- Close Report generation reliability: 100% of close events produce a viewable report
- Close Report engagement rate on first workspace entry after close (share of auto-triggered modals viewed rather than immediately dismissed)
- Share of close events where the report is exported as PDF or CSV (signal for whether it is replacing manual assembly)
- On-demand Close Report views per closed store (signal for whether the report is being returned to, not just seen once)
- Skip-to-full-report rate (signal for whether the summary layer earns its place ahead of the detail tables)
- Reduction in manual Reports-tab + Orders-tab + Fundraising Report sessions in the 48 hrs following a close

‌

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

**Store Close Report — dependencies**

Requires a per-user, per-close-event **seen-state** record (not session-only) so the auto-trigger fires exactly once per user per close event and survives re-close. Requires a durable **close-event record** capturing the window’s open and close timestamps and the trigger source (rep name or “system” for auto-close, consistent with System Emails), so a re-opened-and-re-closed store produces correctly scoped, non-overwriting reports. Report aggregation must read from the same source as the Reports tab KPI cards and the Fundraising Report rather than recomputing, or the summary and detail layers will diverge — this includes the **Team Revenue** series, which is read from [Store Analytics (Reports Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049253/Store+Analytics+Reports+Tab), Epic C and must not be re-derived here. Any aggregation, column, or seed series still referencing the retired **Team Profit** input must be retired rather than re-pointed. PDF generation follows the existing Fundraising Report export service; CSV follows the All Orders export service. The summary layer's shell is the shared paced card sequence component specified in System Modals & Toasts.
