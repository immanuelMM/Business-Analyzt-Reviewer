# Implementation Summary — Team Stores: Store Workspace (all tabs, lifecycle, launch, customize)

Sources: input/requirements/TS-Store Status & Lifecycle-161026-094525.pdf (Lifecycle), TS-Launch & Status Controls-161026-094523.pdf (Launch), TS-Store Home (Home Tab)-161026-011919.pdf (Home), TS-Store Settings (Settings Tab)-161026-094514.pdf (Settings), TS-Order Management (Orders Tab)-161026-094455.pdf (Orders), TS-Roster Management (My Team(s) Tab)-161026-092450.pdf (Roster), TS-Store Analytics (Reports Tab)-161026-094501.pdf (Reports), TS-Customize New Product-161026-094448.pdf (Customize)

Ref style: `(Doc §Section)` using the short names above. Open questions are tracked in the consolidator's question file under the same OI-IDs.

## 1. Scope

**In scope**
- Store lifecycle state machine: Draft / Open / Closed / Archived, with per-surface behavior (Lifecycle §Definitions, §Behavior Matrix).
- Launch control, launch/success modals, post-launch header (Preview Store, Create Template menu) (Launch §AC).
- Store Close Report: summary + detail layers, auto-trigger, on-demand access, PDF/CSV exports (Lifecycle §Store Close Report, Epic H).
- Buyer-facing closed screen for Closed/Archived stores (Lifecycle Epic F).
- Workspace with six tabs in this order: Home, My Team(s), Products, Orders, Reports, Settings (Home Epic A). ⚠ open question OI-1 (Lifecycle lists different tabs and a "Detail" tab)
- Home tab: Needs your attention (condition catalogue C-01…C-27), Recently worked on trail, In your store rail, Team Managers panel, Brand assets panel, League structure directory (Home Epics A–J).
- Settings tab: seven-section sub-nav (General, Schedule & Status, Team & Roster, Store Customization & Design, People & Access, Distribution & Fulfillment, Catalog & Decoration [conditional]) (Settings §Solution, Epic A).
- Orders tab: All Orders + Pending Orders, MOQ batch submission, order detail drawer, pending-order roster update (Orders Epics A–E).
- My Team(s) tab: divisions/teams/rosters, player records, CSV import, duplicate-number policy, Roster Bank surfacing, League product coverage, move player (Roster Epics 0–7).
- Reports tab: 4 KPI cards, Team/League Revenue chart, Fundraising Report + PDF (Reports Epics A–D).
- Customize New Product: QX7 brand entitlement on the SOURCE pill, sport/category picker, customizer hand-off/return (Customize Epics A–C).

**Out of scope (explicit)**
- Store deletion. Archive is terminal (Lifecycle §Note; Settings Epic C).
- Self-service un-archive (Lifecycle §Transitions).
- Image/share-card export of the Close Report. PDF and CSV only (Lifecycle §Exports).
- Home: cross-store attention, notifications/emails from conditions, snooze/dismiss, assigning conditions, full audit log, per-rep condition config, Home-side authoring of store state (Home §Out of scope).
- Home: first-visit-per-tab hints, configurable landing tab (v1), fundraising goal/progress bar, "Extend deadline" action (Home Epics A, E, C4).
- Team Manager Portal Home equivalent. The spec recommends no for this version. ⚠ open question OI-18
- Payouts tracker widget on Reports (Reports Epic C).
- Bulk "sync roster to orders" (Orders Epic E; Roster Epic 2).
- Size-run gate (Home C3 notes).

## 2. Actors & Roles

- **Rep / store owner**: full workspace access; the only role that can launch, close and re-open (Lifecycle §Transitions; Launch §AC). ⚠ open question OI-12 (multi-rep ownership is undefined)
- **Owning rep**: the only one who can Archive. The action is hidden for non-owners and manager-role users (Lifecycle Epic E; Settings Epic C).
- **System**: auto-closes pop-up stores at the configured close date/time (Lifecycle Epic C).
- **Prolook support**: the only route to un-archive (Lifecycle §Transitions). ⚠ open question OI-2
- **Team manager (portal invitee)**: two-area portal (Reporting, Rosters) scoped to one store, granted only by an explicit invite (Settings Epic A2b). Close Report access: ⚠ open question OI-21 (full parity vs scoped variant). My Team(s) permissions: ⚠ open question OI-37
- **"League director"**: named in Roster §Solution only, never defined. ⚠ open question OI-37
- **Buyer / parent / fan**: browses and orders on Open stores, sees the closed screen otherwise (Lifecycle Epic F).
- **Prolook admin**: owns brand entitlement in QX7 and does not act in the Customize flow (Customize §Persona).
- **Manager record ≠ user**: adding or importing a manager grants no portal access (Settings Epic A1, A2b; Home Epic F).

## 3. Business Rules

### Lifecycle & launch
- BR-1: Every new store is created in Draft. The storefront is not live and has no buyer URL (Lifecycle Epic A; Launch §AC).
- BR-2: Draft → Open is manual only, by the rep via Launch Store, and requires ≥1 product (Lifecycle §Transitions). ⚠ open question OI-13 ("added" vs "visible" products)
- BR-3: Launch is one-way. No transition back to Draft exists from Open, Closed or Archived, and there is no "revert to draft" UI (Lifecycle §Transitions, Epic A).
- BR-4: There is no roster gate at launch. Basics completeness is enforced upstream by the creation wizard (Launch §Gate AC; Roster §Solution).
- BR-5: Confirming launch sends an email to all rostered players and the team manager and fires the onboarding-milestone event (Launch §Launch confirmation, §Dependencies). ⚠ open question OI-8
- BR-6: Open → Closed happens manually (rep, Close Store) or automatically when a pop-up store's close date/time is reached (Lifecycle §Transitions, Epic C).
- BR-7: Closed → Open is manual (rep, Re-open Store), takes effect immediately and has no confirmation modal (Lifecycle Epic D). ⚠ open question OI-5 (toast vs modal on status changes)
- BR-8: Archive is allowed from Open or Closed, by the owner only, and is irreversible except through Prolook support (Lifecycle §Transitions, Epic E). ⚠ open question OI-10 (Draft → Archived undefined)
- BR-9: Close Store and Re-open Store are mutually exclusive on the Store Status card (Lifecycle Epic B, D). ⚠ open question OI-1 (card location: Detail vs Settings → Schedule & Status)
- BR-10: Closed and Archived block new orders. In-flight orders continue with no auto-cancel or hold (Lifecycle §Behavior Matrix, Epic B).
- BR-11: In Closed, the workspace stays fully editable, and edits reach the storefront only on re-open (Lifecycle §Behavior Matrix; Settings Epic D).
- BR-12: In Archived, the workspace is read-only (all records viewable, nothing editable), all history is retained permanently, and the store is removed from the Stores list (Lifecycle Epic E). ⚠ open question OI-4 (Archived Stores section on the Account page)
- BR-13: Behavior in Closed is identical for auto-close and manual close (Lifecycle Epic C). ⚠ open question OI-3 (Launch says Closed is "technically equivalent to a draft")
- BR-14: Pop-up ordering window by state: Draft configurable but not running; Open runs; Closed suspended; Archived closed permanently (Lifecycle §Behavior Matrix). ⚠ open question OI-11 (re-open after the close date passes), OI-26 (repeating cadence), OI-27 (per-team-code windows)
- BR-15: The Open Stores / Active Stores KPI counts Open stores only (Lifecycle Epic G). ⚠ open question OI-6
- BR-16: Status badges: Draft blue, Open green, Closed amber. The Stores filter offers Draft, Open and Closed only (Lifecycle Epic G; Launch §Status surfaces).
- BR-17: Canonical status vocabulary is Draft / Open / Closed / Archived. "Active", "On Hold" and "Paused" must not render (Home Epic I; Launch §Status semantics).

### Store Close Report
- BR-18: A report is generated on every close event (any transition into Closed) and scoped to that Active Order Window. Re-close creates a new report, and prior reports are never overwritten (Lifecycle §Definition & scope; Settings Epic H). ⚠ open question OI-9 (window open date)
- BR-19: Auto-trigger condition: store is Closed AND the current user has not seen the report for this close event. It shows once per user per close event, and any dismissal marks it seen (Lifecycle §Trigger & presentation). ⚠ open question OI-21 (per user vs per rep)
- BR-20: No auto-trigger for Archived stores. Archiving does not generate a report (Lifecycle §Trigger; Settings Epic H).
- BR-21: Every figure must reconcile with the Reports tab and the Orders tab, read from the same source, with no second computation (Lifecycle §Note, Epic H).
- BR-22: Summary hero figures are Total Revenue, Orders, Net Fundraising (Avg. Order Value replaces it when Team Fundraising is disabled), and top product by quantity. Each carries the exact value, unit, an "as of [close date]" stamp and a trend delta (Lifecycle §Report contents). ⚠ open question OI-40 (Team Profit references), OI-41 (trend baseline)
- BR-23: Refunds and cancellations net out of revenue consistently with the Reports tab, and the netting is stated on the report (Lifecycle §Report contents).
- BR-24: Exports are PDF and CSV only, named `StoreCloseReport_[StoreName]_[CloseDate].pdf|.csv` (Lifecycle §Exports).
- BR-25: Edge cases (Lifecycle §Edge cases):
  - Zero orders: no superlatives; exports contain headers and zero rows.
  - Single order: non-ranking phrasing.
  - Large stores: the summary has a fixed size, and the detail table paginates and virtualizes.

### Home
- BR-26: Home is permanent, first, and the default landing tab when no deep link is given. Deep links always win. There is no per-rep override in v1 (Home Epic A).
- BR-27: Home persists no store state. The only write is the rep-scoped resume event. Every count is read from the owning service (Home §Governing rule 1).
- BR-28: Only conditions registered in the Epic C catalogue render, one card per condition (not per record), with no manual dismissal (Home Epic C).
- BR-29: Ordering is Blocking → Action → Informational, then a fixed within-tier rank. The list caps at 5 with an "n more" expander, and Blocking cards are never collapsed (Home §Presentation). ⚠ open question OI-16 (rank not defined)
- BR-30: Blocking-tier conditions put a presence dot on tab labels; Informational ones do not (Home Epic A).
- BR-31: Rail palette is red / blue / neutral, and amber is never used on Home. Tier labels are never displayed (Home §Governing rule 2, Epic I).
- BR-32: C-03 suppresses C-08 for the same division, and C-03 copy names the affected divisions/teams (Home Epic C notes).
- BR-33: C-14 fires at 7 days left (it reads the urgent pill threshold); C-15 at 14 days; C-24 after a 7-day invite age (Home Epic C notes). ⚠ open question OI-14 (C-15 trigger contradiction)
- BR-34: Card population is gated by store state and type in the resolver, not the view (Home §Dependencies):
  - Archived returns an empty set with an archived reason code.
  - League-only conditions are skipped on Single-Team stores.
  - Window conditions are skipped on always-on stores.
  (Home §Dependencies, state table) ⚠ open question OI-20
- BR-35: Setup Guide and Close Report sequences present over Home. They never both fire, and Home reads or writes neither seen flag (Home Epic B).
- BR-36: Resume events are written only for rep-authored writes against this store on a resumable surface (Home Epic D):
  - Buyer, system, destructive, read and other-store writes are excluded.
  - A bulk operation is one event.
  - Events collapse on surface+entity (keeping the latest), show 5 (expandable to 15), expire after 30 days, and are per rep.
  - Labels are composed at read time, and rows with deleted targets are dropped silently.
  (Home Epic D)
- BR-37: Point of Contact tag rules on the Team Managers panel: shown when ≥1 channel is in Team Manager mode; names the channel when only one is; absent when both are Salesperson/Custom (with a foot note on who buyers see). "Primary" is never used as a label (Home Epic F). ⚠ open question OI-17 (Settings must adopt the term first)

### Settings
- BR-38: All fields are editable in Draft. After launch a TBD subset locks. Explicit exemptions: Store Point of Contact, ship-to destination, Team Fundraising, manager collection, theme color, announcement message (Settings Epic B). ⚠ open question OI-22
- BR-39: Manager collection has exactly one primary at all times. Removing the primary is blocked until another is designated, and a primary change is disclosed before save (buyer-visible) (Settings Epic A2c).
- BR-40: Manager records and invites are independent. Add, import or remove never creates, alters or revokes portal access (Settings Epic A2b, A2c; Home Epic F).
- BR-41: Coach import adds and never replaces. Records are point-in-time copies with no write-back or live sync. On re-bind the prompt covers only records imported from the old team, and access holders are called out (Settings Epic A1). ⚠ open question OI-23, OI-24
- BR-42: Store Point of Contact is per channel (Email, Phone): Team Manager (default) / Salesperson / Custom. Team Manager mode live-binds to the primary record. A blank-value guard applies on save (Settings Epic A2).
- BR-43: Ship-to destination is one persisted field shared by Step 1, the Fulfillment Method card and the primary manager record (Settings Epic A3):
  - It can be cleared (the store becomes not fulfillment-ready).
  - It is map-service verified.
  - A saved Pick-up Location is held as a reference.
  - A switched-off location leaves the store with no destination.
  (Settings Epic A3)
- BR-44: The freight gate blocks pending-order submission when a manager assignment is missing or an assigned manager has no address (Settings Epic A3; Orders Epic B).
- BR-45: Team Fundraising master behaves as follows (Settings Epic A4):
  - Per-item toggles can narrow but never widen.
  - Disabling goes through a two-list interstitial (Will be disabled / Cannot be disabled).
  - Amounts are never cleared, and re-enable restores prior per-item state.
  - The commercial lock (an item with a non-cancelled order) is never overridden.
  - The card shows a three-state read: Enabled / Disabled / Disabled · n items still collecting.
- BR-46: Allow Duplicate Numbers in Settings is a bulk write to every roster plus a mixed-state read. New rosters inherit it at creation, and the roster's own value is authoritative (Settings Epic F; Roster Epic 4).
- BR-47: Theme color defaults to the team primary color and carries a source flag (Team default / Custom). Change Team re-derives only defaulted colors, and Reset re-arms derivation. It applies to buttons and accents only (Settings Epic I). ⚠ open question OI-25
- BR-48: The announcement message is one store-level field shared with Step 1. It is sanitized rich text with live propagation and is not rendered on a closed storefront. League stores can override it per division or standalone team, and teams in a division inherit (Settings Epic I, Epic D). ⚠ open question OI-25
- BR-49: The Catalog & Decoration section renders only when a third-party vendor is enabled (Settings Epic G).
- BR-50: The days-left pill turns urgent inside the final 7 days. Always-on stores show "Always open" (Settings Epic E).

### Orders
- BR-51: The order line snapshots jersey number, name on jersey, size and (Direct-to-Home) shipping address at purchase. No read path resolves them through the roster (Orders §Governing rule, §Dependencies).
- BR-52: Pending-order update is per line only, is never automatic or prompted, is pending orders only, is refused server-side once submitted, and does not change price (Orders Epic E; Roster Epic 2). ⚠ open question OI-32, OI-38
- BR-53: Pending containers mirror the roster architecture: one per division plus one per standalone team (League), or a single container (Single-Team) (Orders Epic B).
- BR-54: Submit scope is Group / Selected / All. Below-MOQ submissions proceed to the review modal with the Minimum Quantity Fee itemized per group, and there is no extra confirm step (Orders Epic B). ⚠ open question OI-30
- BR-55: Divergence is a derived comparison (never stored). It is shown only in the gear drawer and the order detail drawer, and it never gates or changes completion (Orders Epic C, §Dependencies; Roster Epic 2).

### My Team(s)
- BR-56: The roster is optional. A team holds at most one roster, and a roster belongs to exactly one team. Deleting a division re-homes its teams as standalone (Roster §Object model, Epic 0).
- BR-57: Roster edits are never blocked by order state (Roster §Governing rule). ⚠ open question OI-36 (the Move block contradicts this)
- BR-58: When duplicates are disallowed (Roster Epic 4):
  - Taken numbers (committed records ∪ pending captures for the team) are unselectable on every entry surface.
  - The inline error is a backstop for CSV and direct entry.
  - Turning the policy off grandfathers existing duplicates, with no sweep.
  (Roster Epic 4)
- BR-59: Jersey numbers are released immediately on delete, bulk delete, Clear Roster and Move. A capture's number is released on dismissal (Roster Epic 2, 4, 7).
- BR-60: Clear/Delete Roster never touch Roster Bank captures or product assignments. Delete Roster is not offered for a Single-Team store's only roster (Roster Epic 2).
- BR-61: Checkout address write-back and Roster Bank capture are mutually exclusive per order (Roster Epic 3).
- BR-62: A division-wide product assignment applies to teams added later (Roster Epic 6). ⚠ open question OI-35
- BR-63: Moving a player who has team-gear orders is refused (Roster Epic 7). ⚠ open question OI-36

### Reports & Customize
- BR-64: Team/League Revenue = gross buyer spend on orders attributable to the team (League: all teams, filterable by team/division) (Reports Epic C).
- BR-65: The Fundraising Report renders when fundraising is enabled or disabled-with-exemptions, and is hidden otherwise. Figures are recorded at order time and never recomputed (Reports Epic D).
- BR-66: The SOURCE pill shows only QX7-entitled brands (Customize Epic A):
  - With 1 brand it auto-resolves.
  - With 2 or more the rep must choose.
  - With 0 an explicit "contact Prolook admin" state shows.
  It scopes only the Customizer chip and the Customize button (Customize Epic A).
- BR-67: Non-entitled brand routes return access denied server-side. This must ship with the UI (Customize A5).
- BR-68: A custom item's design is last changeable in the per-item configuration modal, and is permanently locked on commit (Customize C2).

## 4. Data

- **Store**: status (draft/open/closed/archived); type (Individual Team / League); distribution format (pop-up / always-on); schedule (Set window opens/closes, or Always open); third-party vendor flag; fundraising master + three-state read; theme color + source flag; announcement message (sanitized rich text); tax (Collect Sales Tax, State, flat rate %); Point of Contact mode per channel (Settings Epic A, A2, A4, I; Launch §Dependencies).
- **Close event** (new): store, window open/close timestamps, trigger source (rep name or "system"); one report per event (Lifecycle §Dependencies). ⚠ open question OI-9
- **Close Report seen-state** (new): per user per close event, persistent (Lifecycle §Dependencies).
- **Resume event** (new): rep, store, surface key (existing deep-link key), entity ref (optional), field-group/operation id, timestamp; 30-day expiry (Home §Dependencies).
- **Manager record**: First/Last Name, Email, Phone (10-digit), Street Address (verified), Contact Preference; primary flag; source-team reference for imported records (Settings Epic A2c, §Dependencies). ⚠ open question OI-24
- **Invite** (People & Access): email, invited date, status (Active with last login / Invited · not logged in), actions Resend / Revoke / View portal as (Settings Epic A2b).
- **Division**: name, brand color, sport, team code, optional announcement override, applied-color flag, fulfillment mode (league / division / individual teams) (Roster Epic 0; Settings Epic I).
- **Team**: name (required), division (optional), team code (deterministic, backend only), optional announcement override if standalone (Roster Epic 0).
- **Roster**: team ref (1:1), Allow Duplicate Numbers (Roster Epic 4).
- **Player record**: First Name (req, ≤50), Last Name (req, ≤50), Jersey Number (00–99), Name on Jersey (≤15, uppercased), Contact Email (format-validated if present), Contact Phone (10-digit if present), Player Shipping Address (Direct-to-Home only, map-verified), Associated Emails (Roster §Schema).
- **Roster Bank capture**: pending entry banked per team from a team-gear order; holds a jersey number; owned by the Roster-Optional Architecture spec (Roster Epic 5). ⚠ open question OI-39
- **Order / order line**: lifecycle storefront → pending → submitted; origin (My Order / Fan …); Web Order #, Factory Order #, PO number, tracking; snapshotted personalization fields; optional player FK for the tracking join (Orders §Dependencies). ⚠ open question OI-29, OI-31, OI-34
- **Fundraising line items**: flagged price additions recorded at order time; platform and card-processing fees (Reports Epic D). ⚠ open question OI-42
- **Product assignment**: two scopes, team and division ("via division") (Roster Epic 6). ⚠ open question OI-35
- **Sources of truth**: the owning tab or service for every Home figure (Home §Governing rule 1); the Reports tab for Close Report figures (Lifecycle §Note); the roster's own setting for duplicates (Roster Epic 4).

## 5. Flows

- **Launch**: Draft → header LAUNCH STORE (disabled with tooltip "Add at least one product to launch your store." when 0 products) → "Launch Team Store" confirm (Cancel / Launch) → store Open → "Your store is now live!" (View Store / Stay In Editor) → header swaps to Preview Store + store menu (Create Template) (Launch §AC).
- **Manual close**: Store Status card → Close Store → confirmation (no new orders; existing unaffected; can re-open) → Closed instantly → report generated (Lifecycle Epic B).
- **Auto-close**: pop-up close date/time reached → Closed → report generated → next workspace entry shows the full-screen report modal instead of a banner (Lifecycle Epic C).
- **Re-open**: Re-open Store → Open immediately; edits go live; badges update everywhere (Lifecycle Epic D).
- **Archive**: owner → Danger Zone → Archive Store → modal listing 4 consequences + support-only undo → storefront neutral closed screen; removed from list; workspace read-only (Lifecycle Epic E; Settings Epic C).
- **Close Report**: modal (full-page route at narrow widths) → paced cards (cover → 3–5 hero figures → recap → handoff), user-paced, with Skip to full report always visible → dismissal (View full report / Done / close icon / Esc / backdrop) marks seen → on demand from the Reports tab entry (enabled for Closed/Archived, disabled with "Available when the store closes" for Draft/Open), the Store Status card link, or Home (Lifecycle §Trigger, §On-demand, §Experience principles).
- **Pending submission**: select scope → [freight gate: Assign Managers modal with address verification → auto-continue] → review modal (shipping, PO Number, billing, subtotal / MOQ fee / total, items by group) → Confirm · $total → snapshot final (Orders Epic B).
- **Fundraising disable**: toggle off → interstitial (skipped if nothing enabled or exempt) → Cancel reverts / Confirm disables non-exempt items (Settings Epic A4).
- **Re-bind team**: Change Team → picker → branding re-import + theme re-derive (if default) → coach selection (append) → old-team managers keep/remove prompt with access callout; primary protected (Settings Epic A1).
- **CSV import**: Upload Roster → template download → per-row/per-cell validation, invalid rows skipped → preview with valid/skipped counts → confirm (Roster Epic 1).
- **Move player**: row/bulk Move to team → destination picker (grouped by division, searchable) → number conflict prompt (reassign or move without number) → players with team-gear orders blocked and named (Roster Epic 7). ⚠ open question OI-36
- **Customize New Product**: SOURCE pill resolves → Customize New Product → [choose brand if ≥2] → sport/category grid (brand-scoped) → brand customizer (team name, colors, logos prefilled) → return staged → per-item config modal → commit (design lock) (Customize Epics A–C). ⚠ open question OI-44, OI-45, OI-46

## 6. Integrations

- **QX7**: dealership brand entitlement (brand list, brand type) (Customize Epic A). ⚠ open question OI-44
- **Customizer 3.0**: external design tool; template catalog by sport/category (Customize §Dependencies). ⚠ open question OI-44
- **Team Database**: branding (logo, colors, sports) and coach records on connect; no write-back (Settings Epic A1). ⚠ open question OI-24
- **Map service**: address verification for manager, destination and player addresses (Settings Epic A3; Roster Epic 3).
- **Email**: launch notification (Launch §AC); portal invite with password-set link (Settings Epic A2b); roster template share; store-link share; Send Reminder (Roster Epic 1, 2).
- **Factory / order service**: storefront → pending → submitted; production-stage data (Orders §Dependencies).
- **Export services**: Close Report PDF uses the Fundraising Report PDF service; CSV uses the All Orders export service (Lifecycle §Dependencies).
- **Pick-up Locations**: workspace-level location service, referenced by stores (Settings Epic A3).
- **Tax**: state → flat-rate lookup (Settings §Dependencies).

## 7. Non-Functional

- **Security**:
  - Server-side enforcement for brand entitlement (Customize A5) and for the pending-order update (Orders Epic E).
  - No access-granting side effects from manager records (Settings §Dependencies).
  - Announcement rich text uses a sanitizing renderer that strips script, embed, iframe and event-handler content; rep input is not treated as trusted (Settings §Dependencies).
- **Buyer storefront**: no leakage. Product and checkout URLs redirect to the closed screen for Closed/Archived stores, and Archived is indistinguishable from Closed (Lifecycle Epic F).
- **Performance**: the Home condition resolver runs on every workspace entry and resolves progressively, Blocking-tier first (Home §Dependencies). The Close Report detail table paginates and virtualizes (Lifecycle §Edge cases).
- **Motion/a11y**:
  - Close Report: fades and scale-ins of 200–300ms, count-up only on the hero figure, no auto-advance.
  - Advance by click, tap or arrow keys.
  - Tabular lining numerals; three type levels.
  - No in-product reduce-motion control.
  (Lifecycle §Experience principles)
- **Consistency**: a status change anywhere reflects everywhere (shared read model) (Launch §Dependencies). Settings section keys must stay stable for deep links (Settings §Dependencies).
- **Accuracy**: auto-close must hit 100% of pop-up close times, and zero orders may be accepted while Closed/Archived (Lifecycle §Metrics).

## 8. Acceptance Criteria

### Lifecycle / Launch
- AC-1: A new store is Draft with no accessible buyer URL (Lifecycle Epic A).
- AC-2: A Draft store with zero products has the launch action disabled with an explanatory message/tooltip (Lifecycle Epic A; Launch §Gate). ⚠ open question OI-13
- AC-3: Launch with ≥1 product makes the store Open immediately with a public storefront, and the success modal offers View Store / Stay In Editor (Lifecycle Epic A; Launch §Launch).
- AC-4: After launch the header shows Preview Store and a store menu whose single option is Create Template (Launch §Live header controls).
- AC-5: Draft stores show a Draft badge and are excluded from the Open Stores KPI (Lifecycle Epic A, G).
- AC-6: The close confirmation discloses: no new orders; existing orders unaffected; can re-open (Lifecycle Epic B).
- AC-7: In-flight orders on a Closed store continue with no cancellation or hold (Lifecycle Epic B).
- AC-8: Auto-close fires at the configured time with behavior identical to a manual close (Lifecycle Epic C).
- AC-9: Re-open needs no confirmation, and closed-period edits are live immediately (Lifecycle Epic D).
- AC-10: Archive Store is not visible to non-owners. The confirmation modal states all 4 consequences plus support-only undo (Lifecycle Epic E).
- AC-11: An Archived store is absent from the Stores list, and its workspace shows all records with nothing editable (Lifecycle Epic E).
- AC-12: Closed/Archived storefront URLs, including direct product and checkout URLs, show the neutral "This store is currently closed" screen (Lifecycle Epic F).
- AC-13: The Stores filter offers Draft, Open and Closed only (Lifecycle Epic G).

### Close Report
- AC-14: Every close event produces a report scoped to its window (Lifecycle Epic H).
- AC-15: The modal appears on first entry for each user who has not seen it, before other content is actionable, and never again for that event (Lifecycle Epic H).
- AC-16: Closed → Open → Closed re-arms the modal once for the new event (Lifecycle Epic H).
- AC-17: All dismissal paths mark the report seen, and View full report lands on the detail layer (Lifecycle Epic H).
- AC-18: The Reports tab entry is enabled for Closed/Archived and disabled with helper text for Draft/Open (Lifecycle Epic H). ⚠ open question OI-40
- AC-19: Summary figures equal Reports tab figures for the same window (Lifecycle Epic H).
- AC-20: The detail layer includes every window order, including cancelled and refunded orders, with current stage and status (Lifecycle Epic H).
- AC-21: Only PDF and CSV exports are offered, named per convention, and they still work after re-open or archive (Lifecycle Epic H).
- AC-22: Skip to full report is visible at every step of the summary (Lifecycle Epic H).
- AC-23: A team-manager user can view and export the report, and owner-only actions stay hidden (Lifecycle Epic H). ⚠ open question OI-21

### Home
- AC-24: Six tabs, with Home first and enabled in every state, type and format (Home Epic J).
- AC-25: The attention section and the In your store rail always render. The rail's first row reads "My Team(s)" and counts players (Home Epic J).
- AC-26: Only registered conditions render. Order is Blocking → Action → Informational and stable. The list caps at 5 unless Blocking cards exceed 5 (Home Epic J).
- AC-27: Card counts equal owning-tab counts, and primary actions deep-link scoped to the owning surface (Home Epic J).
- AC-28: Cards disappear when the condition clears. The empty state says so plainly and shows no filler (Home Epic J).
- AC-29: An Archived store shows a section stating archived/read-only with no actionable cards (Home Epic J).
- AC-30: Draft with 0 visible products shows C-09 and no launch action; Draft with ≥1 shows C-16, routing to the header launch control (Home Epic J). ⚠ open question OI-13
- AC-31: Resume events are recorded only for qualifying rep writes, collapsed per entity, per rep, with rows for deleted targets omitted, and the section is absent when empty (Home Epic J).
- AC-32: No amber, no tier labels, no banned terms and no completion/readiness/score indicators anywhere on Home (Home Epic J).
- AC-33: Team Managers panel: the same collection and modal as Settings; Point of Contact tag rules per BR-37; removing the designated record is blocked with a route to Settings → General; adding states that no portal access is granted; Add from Team Database is not offered (Home Epic J).
- AC-34: Brand assets panel uses existing components, all three assets stay editable after launch, the theme source is shown, and the artwork library is linked (not embedded) (Home Epic J).
- AC-35: The League structure directory renders collapsed divisions in a bounded height and routes scoped with breadcrumbs. It is absent on Individual Team stores and never shows team codes (Home Epic J).
- AC-36: C-03 names the specific affected divisions/teams (Home Epic J).

### Settings
- AC-37: The fundraising disable interstitial lists the items to be disabled with their amounts and the exempt items with the reason. Cancel writes nothing (Settings Epic A4).
- AC-38: Re-enabling fundraising restores each item's prior state and amount (Settings Epic A4).
- AC-39: Changing the primary manager updates the storefront footer immediately when the channel is in Team Manager mode, and is disclosed before save (Settings Epic A2c).
- AC-40: Clearing the destination address saves and shows the "No destination address" state, and pending-order submission is blocked (Settings Epic A3).
- AC-41: Revoking an invite removes portal access and close-report access, after a confirmation modal and with a toast (Settings Epic A2b).
- AC-42: The Catalog & Decoration section and its nav entry are absent on Prolook-only stores (Settings Epic G).
- AC-43: A custom theme color survives Change Team, and a defaulted one re-derives (Settings Epic I).

### Orders
- AC-44: All Orders is the default view with origin badges. Pending Orders shows a live count badge. Search works by name, email or order #, within the active sub-tab (Orders Epic A). ⚠ open question OI-29
- AC-45: Below-MOQ containers show a progress ring with % to MOQ and a fee tooltip, and the review modal itemizes the fee per group (Orders Epic B).
- AC-46: An unresolved routing group opens Assign Managers, then resumes to review (Orders Epic B).
- AC-47: A roster edit after purchase never changes the order line, and Item View shows the ordered value plus the current roster value when they differ (Orders §Governing rule, Epic D).
- AC-48: The update action appears only for divergent lines on pending orders, rewrites only that line, and is rejected server-side after submission (Orders Epic E).
- AC-49: The player drawer shows ordered/"Not ordered" per required item. Send Reminder shows only while gear is missing and is disabled with a reason when the player has no contact channel (Orders Epic C; Roster Epic 2).

### My Team(s)
- AC-50: A player record saves with only First and Last Name, and contact fields are validated only when present (Roster §Schema).
- AC-51: CSV import skips invalid rows with per-row/cell errors and imports valid rows. Duplicate numbers are errors only on rosters that disallow them (Roster Epic 1).
- AC-52: On no-duplicate rosters, taken numbers (including pending captures) render disabled on the add row, edit drawer, PDP and checkout (Roster Epic 4).
- AC-53: Turning duplicates off saves without a sweep and shows "duplicates off · n players share #x" until it self-resolves (Roster Epic 4).
- AC-54: Clear Roster keeps the roster entity, releases numbers, and toasts "Roster cleared — n players removed". It is disabled when the roster is empty (Roster Epic 2).
- AC-55: A team with no products shows the amber "No products yet" state. Drag onto a division header creates a "via division" assignment, and UI updates without reload (Roster Epic 6).
- AC-56: Committing a capture creates a normal player record (and a roster if none exists) at the captured values (Roster Epic 5).

### Reports / Customize
- AC-57: Four KPI cards with trend: Orders links to All Orders and Pending links to Pending Orders (Reports Epic B). ⚠ open question OI-41
- AC-58: The League Revenue chart is filterable by team/division. A single-team store shows Team Revenue with no filter, and no "profit" wording appears (Reports Epic C).
- AC-59: The Fundraising Report shows the mixed-state banner when disabled-with-exemptions. Presets: This season, Last 7 days, Last 30 days, YTD. The PDF settings modal offers Net (default) / Gross plus 3 checkboxes (Reports Epic D).
- AC-60: The brand pill shows only entitled brands; behavior with 1, ≥2 and 0 brands follows BR-66 (Customize §AC).
- AC-61: Direct navigation to a non-entitled brand route returns access denied (Customize §AC).
- AC-62: Switching brand re-scopes the Customizer chip and target, and staged items are unaffected. Stock Vault, Catalog Templates and Other stores are unaffected (Customize §AC).
- AC-63: The customizer opens prefilled with team name, colors and logos, and the returned item is staged and configured via the per-item modal (Customize §AC).
- AC-64: Store creation Step 2 and the Products tab behave identically (Customize A8).

## 9. Dependencies & Assumptions

- Specs that are referenced but not provided: Products Tab / Product Catalog Management, Product Categories, Roster-Optional Architecture, Step 1 — Basics, Step 2 — Divisions & Teams, Pick Up Locations, Storefront Announcement Banner, System Modals & Toasts (paced card sequence shell), Tabbed Store Dashboard (Setup Guide). ⚠ open question OI-19, OI-39
- Home Appendix A amendments (tab shell, Point of Contact term in Settings, lock list, header chip) must land before Home ships. ⚠ open question OI-17
- C-27 requires a Products Tab amendment (queryable orphaned state + filter) first (Home §Dependencies).
- Owning tabs need addressable filters for C-05, C-10 and C-23 routes. This is unaudited and possible hidden scope (Home §Dependencies).
- The Lifecycle "Verification… EIN/banking… 24–48 hr" dependency appears unrelated to the store lifecycle. ⚠ open question OI-7
- Pending orders on Archived stores are undefined. ⚠ open question OI-33
- The production-stage/status vocabulary is not unified. ⚠ open question OI-31
- MOQ thresholds and fee formula, and platform/card fee rates, are not given. ⚠ open question OI-30, OI-42
- The revenue chart granularity toggle is open. ⚠ open question OI-43

## Open items

All OIs were sent to `consolidator`; details are in the consolidator's question file.
- OI-1 Store Status card / tab set location (Detail vs Settings; tab list mismatch)
- OI-2 Un-archive actor: managing rep vs support only
- OI-3 Closed "equivalent to draft" vs closed landing page
- OI-4 Archived Stores section on the Account page
- OI-5 Close/Re-open confirmation: modal vs toast
- OI-6 Open Stores vs Active Stores KPI naming/location
- OI-7 Unrelated verification/EIN dependency in Lifecycle
- OI-8 Launch email recipients when roster or manager is empty; template
- OI-9 Active Order Window "open date" definition
- OI-10 Draft → Archived undefined; abandoned drafts
- OI-11 Re-open after the close date passes; "suspended" window semantics
- OI-12 Store ownership / multi-rep model
- OI-13 Launch gate: products added vs visible
- OI-14 C-15 trigger vs the 14-day rule
- OI-15 C-17 reachability
- OI-16 Within-tier rank missing
- OI-17 Home Appendix A missing / prerequisite amendments
- OI-18 Team Manager Portal Home equivalent
- OI-19 Products Tab spec missing
- OI-20 Condition count and state gating table gaps
- OI-21 Close Report: team-manager parity vs scoped variant; seen per user vs per rep; metric set; emailing
- OI-22 Post-launch lock list TBD; re-bind after launch
- OI-23 Add from Team Database on the manager card
- OI-24 Team Database coach schema (address, role)
- OI-25 Theme contrast; announcement length / allowed marks
- OI-26 Repeating close cadence vs lifecycle
- OI-27 Per-team-code windows vs store status; timezones
- OI-28 "Approved" vs "submit" pending terminology
- OI-29 Player orders in All Orders; origin badges
- OI-30 MOQ thresholds and fee formula
- OI-31 Production stage vocabulary
- OI-32 Order amendment history
- OI-33 Pending orders on Archived/Closed stores
- OI-34 Open PO / unsettled payment state
- OI-35 Division-wide assignment inheritance: decided vs open
- OI-36 Move-player order block; moves in Open/Closed; history
- OI-37 Team manager / league director permissions in My Team(s)
- OI-38 Shipping address included in the pending-order update?
- OI-39 Other referenced specs missing
- OI-40 Team Profit references in the Close Report; Close Report entry absent from the Reports layout
- OI-41 KPI definitions, refund netting, trend baseline
- OI-42 Platform / card fee calculation
- OI-43 Revenue chart granularity toggle
- OI-44 QX7 and Customizer 3.0 contracts
- OI-45 Brand selection persistence; de-entitled brand products
- OI-46 Creation step numbering for Add Products
