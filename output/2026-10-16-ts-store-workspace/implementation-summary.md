# Implementation Summary — TS Store Workspace (Products, Orders, Reports, Settings, Launch & Lifecycle)
Sources: input/requirements/TS-Customize New Product-161026-094448.pdf (5 pp) · TS-Launch & Status Controls-161026-094523.pdf (3 pp) · TS-Order Management (Orders Tab)-161026-094455.pdf (7 pp) · TS-Store Analytics (Reports Tab)-161026-094501.pdf (5 pp) · TS-Store Settings (Settings Tab)-161026-094514.pdf (27 pp) · TS-Store Status & Lifecycle-161026-094525.pdf (15 pp)
Reference only (already reviewed): TS-Store Home, TS-Roster Management (prior Q-IDs cited as "Home Q-n" / "Roster Q-n").
Short refs: Product, Launch, Orders, Reports, Settings, Lifecycle + page number.
Version check: Lifecycle is cited as TS-Store Status & Lifecycle-161026-094525.pdf, the only remaining export; no diff OIs were raised.

---

## A. Store Status & Lifecycle (authoritative for status semantics)

### A1. Scope
- One source of truth for the four store states (Draft, Open, Closed, Archived): definitions, transitions, per-surface behaviour, plus the Store Close Report (Lifecycle p1, p8).
- Other features own only the UI that triggers a transition (Lifecycle p1).
- There is no store deletion; Archived is terminal (Lifecycle p3).
- ⚠ open question OI-9: the Dependencies section contains unrelated text about verification, EIN and banking, and a 24–48 hr review queue (Lifecycle p14).

### A2. Actors & Roles
- Rep (store owner or managing rep): launch, close, re-open (Lifecycle p2-3).
- Owner only: archive (Lifecycle p2, p7). ⚠ open question OI-12: how "owner" is determined.
- Prolook support: the only path to reverse an archive (Lifecycle p3, p7). ⚠ open question OI-3: p2 says "a managing rep" can restore.
- System: auto-close (Lifecycle p2).
- Team-manager-role user: full Close Report parity; owner-only actions stay hidden (Lifecycle p11). ⚠ open question OI-34 / OI-45.
- Buyer: sees the closed screen (Lifecycle p4).

### A3. Business Rules
- BR-1 New stores start in Draft; the storefront is not live and its URL is inaccessible (Lifecycle p1, p5).
- BR-2 Draft → Open is manual only (Launch Store), needs ≥1 product added, and is one-way: no state ever returns to Draft (Lifecycle p2-3). ⚠ open question OI-16: what counts as "added".
- BR-3 Open → Closed is manual (rep) or automatic when a pop-up's configured close date/time is reached (Lifecycle p2, p6). ⚠ open question OI-2: the button is labelled "Pause" vs "Close Store". ⚠ open question OI-39: what "pop-up" means.
- BR-4 Closed → Open is manual only (Re-open Store), with no confirmation, at any time (Lifecycle p2, p6).
- BR-5 Open or Closed → Archived is manual and owner-only, from the Danger Zone; reversible only through a support request (Lifecycle p2-3). ⚠ open question OI-50: the Danger Zone location ("Detail tab").
- BR-6 Archived → Open/Closed is support staff only, with no self-service UI (Lifecycle p3, p7). ⚠ open question OI-3: which target state, and the rep-restore contradiction.
- BR-7 Behaviour matrix (Lifecycle p3-4):
  - Draft: storefront inaccessible; new orders blocked; workspace fully editable; Draft badge in the list; ordering window configurable but not running; no Close Report; not counted in Open Stores.
  - Open: storefront fully accessible; orders allowed; window runs as configured; counted.
  - Closed: "This store is closed" landing page; new orders blocked; existing orders unaffected; workspace fully editable, with changes going live on re-open; Closed badge; window "Suspended — does not advance"; Close Report auto-triggers; not counted. ⚠ open question OI-10.
  - Archived: neutral closed screen; orders blocked; workspace read-only; removed from the list; window closed permanently; reports read-only with exports available; not counted.
- BR-8 Closed has no effect on in-flight orders: no automatic cancel or hold (Lifecycle p6). ⚠ open question OI-22: pending orders on Closed or Archived stores.
- BR-9 Badge colours: Draft blue, Open green, Closed amber. Archived never appears in the Stores list or filter (Lifecycle p8). ⚠ open question OI-53.
- BR-10 The Overview store-count KPI counts Open only (Lifecycle p8). ⚠ open question OI-8: "Open Stores" vs "Active Stores".
- BR-11 A close event is any transition into Closed, manual or automatic. Each one produces a new Close Report scoped to its window, and prior reports are retained (Lifecycle p8, p11).
- BR-12 The Close Report is a read layer only: no new metrics or state. Every figure must reconcile exactly with the Reports and Orders tabs and come from the same source (Lifecycle p8-9, p15). ⚠ open question OI-11 / OI-27 / OI-29.
- BR-13 Auto-trigger fires once per user per close event. Any dismissal (View full report, Done, close icon, Escape, backdrop) marks it seen. A re-close re-arms it. No auto-trigger on archived stores. Always-open stores trigger only after a manual close (Lifecycle p9). ⚠ open question OI-35: per user vs per rep.
- BR-14 Summary layer: Total Revenue, Orders, Net Fundraising (when Team Fundraising is off, AOV takes this slot) and the top product by quantity. Each figure shows its value, unit, "as of [close date]" and the vs-last-period delta (Lifecycle p10). ⚠ open question OI-11 / OI-28 / OI-36.
- BR-15 Detail layer: line-item order table with Web Order #, Factory Order #, origin badge, buyer, roster/team, product, size, qty, unit price, line total, personalization, production stage, PO, tracking, fulfilment status and MOQ fee. It reuses the Orders toolbar. It also shows the Team Profit chart, the Pending Orders count, below-MOQ containers, the fundraising breakdown, AOV, the stage mix and a refunds summary (Lifecycle p10). ⚠ open question OI-26: Team Profit was renamed. ⚠ open question OI-23: stage list.
- BR-16 Refunds and cancellations net out of revenue the same way as on the Reports tab, and the report states the netting (Lifecycle p10, p13). ⚠ open question OI-29.
- BR-17 Exports are PDF and CSV only, named `StoreCloseReport_[StoreName]_[CloseDate].pdf/.csv`. The PDF follows the Fundraising PDF settings step; the CSV follows the All Orders CSV and respects column visibility (Lifecycle p10-11).
- BR-18 Experience rules: user-paced (click, tap, arrows; no auto-advance); Skip to full report and a progress indicator always visible; 200–300 ms fades; count-up on the hero figure only; three type levels; tabular numerals; Team Colors and Logo; no reduce-motion control (Lifecycle p11).

### A4. Data
- Store status enum: draft / open / closed / archived (Lifecycle p1; Launch p2).
- Close-event record: window open and close timestamps, trigger source (rep name or "system") (Lifecycle p14-15).
- Per-user, per-close-event seen-state, persisted rather than session-only (Lifecycle p14).
- Generated-report record per close event (Lifecycle p8; Settings p26).

### A5. Flows
- Close: Store Status card → Close Store → confirmation (no new orders; existing orders unaffected; can re-open) → Closed instantly, with landing page and badge updated (Lifecycle p5-6). ⚠ open question OI-1 / OI-6.
- Auto-close: at the close date/time → Closed. On the next entry the Close Report modal is the notification (Lifecycle p6). Re-open with an optional schedule edit (Lifecycle p6). ⚠ open question OI-10 / OI-38.
- Archive: owner → confirmation listing four consequences plus "only Prolook support can undo" → storefront takedown, removal from the list, read-only workspace (Lifecycle p7). ⚠ open question OI-4: how an archived store is reached afterwards.
- Close Report entry points: auto modal on first entry (a full-page route at narrow widths); on demand from the top of the Reports tab (disabled on Draft and Open); a "View Close Report" link on the Store Status card (Lifecycle p9). ⚠ open question OI-25.

### A6. Integrations
- PDF uses the Fundraising Report export service; CSV uses the All Orders export service; the summary shell is the paced card sequence from System Modals & Toasts (Lifecycle p15).

### A7. Non-Functional
- Large stores: the summary layer has a fixed size; the detail table paginates and virtualises; exports contain the full data set (Lifecycle p13).
- 100% of close events must produce a viewable report; auto-close must be 100% accurate; zero orders may be accepted while Closed or Archived (Lifecycle p14).

### A8. Acceptance Criteria
- AC-1 A newly deployed store is Draft with no buyer URL, and all tabs are editable (Lifecycle p5).
- AC-2 With zero products, launch is disabled with an explanatory message. With ≥1 product, Launch takes the store to Open and the storefront becomes public (Lifecycle p5). ⚠ open question OI-5: confirmation modal and email.
- AC-3 No "revert to draft" action exists anywhere (Lifecycle p5).
- AC-4 A Draft store shows a Draft badge and is excluded from the KPI. The Setup Guide cover card says the store is not live; the guide doesn't enforce the gate (Lifecycle p5).
- AC-5 Close Store appears only when the store is Open; Re-open appears only when Closed (Lifecycle p5-6).
- AC-6 Close confirmation shows its three disclosures; on confirm, the store is Closed instantly and the badge updates (Lifecycle p6).
- AC-7 A Closed store keeps all tabs editable and in-flight orders process normally (Lifecycle p6).
- AC-8 Auto-close behaves exactly like a manual close (Lifecycle p6).
- AC-9 Re-open needs no modal; edits go live immediately; badges update in the list, header and KPI; the prior Close Report is retained (Lifecycle p6-7).
- AC-10 The Archive action is hidden from non-owners. The modal states the four consequences and "support only". The URL serves a neutral closed screen; the store disappears from the Stores list; the workspace is read-only with all history retained (Lifecycle p7).
- AC-11 Buyers on a Closed or Archived URL see the same neutral "This store is currently closed" screen. Direct product or checkout URLs redirect to it (Lifecycle p7-8).
- AC-12 The Stores filter offers Draft/Open/Closed only; Archived is excluded (Lifecycle p8).
- AC-13 The Close Report is generated on every close event and auto-presented before any workspace content is actionable (Lifecycle p11). ⚠ open question OI-35.
- AC-14 The Close Report appears once per user per close event, and a re-close re-arms it (Lifecycle p11-12).
- AC-15 On demand from the Reports tab when Closed or Archived, it opens in review mode; on Draft or Open it is disabled with helper text (Lifecycle p12).
- AC-16 Summary figures equal the Reports tab figures for the same window (Lifecycle p12).
- AC-17 The detail layer includes every order in the window, including cancelled and refunded ones (Lifecycle p12).
- AC-18 Team-manager-role users can view and export the same content (Lifecycle p12). ⚠ open question OI-34.
- AC-19 Reports and exports survive re-open and archive; Skip is always visible (Lifecycle p12).
- AC-20 Zero orders: calm factual summary, empty detail state, and exports with headers and no rows. A single order gives a non-ranking superlative. Unfulfilled orders show a not-shipped count. An open PO is flagged in a needs-attention strip. With fundraising disabled, the fundraising figures are omitted and AOV is promoted (Lifecycle p12-13).

### A9. Dependencies & Assumptions
- Durable close-event and seen-state records; aggregation from the same source as the Reports KPIs and the Fundraising Report (Lifecycle p14-15).

---

## B. Launch & Status Controls

### B1. Scope
- Launch control, launch confirmation and success modals, post-launch header (Preview Store and a store menu with Create Template), status tags on dashboard cards, Stores-tab filter (Launch p1-2).
- Pause and resume live on the Settings tab's Store Status card, not in the header (Launch p2). ⚠ open question OI-1.

### B2. Actors & Roles
- Store owners and reps (Launch p1).

### B3. Business Rules
- BR-19 Launch gate: LAUNCH STORE is disabled while the catalog has zero products, with the tooltip "Add at least one product to launch your store." Basics completeness is enforced upstream by the wizard, and there is no roster gate (Launch p1-2). ⚠ open question OI-16.
- BR-20 "Published" is no longer a valid term; the per-item visibility toggle replaces it (Launch p2).
- BR-21 Launch confirmation modal "Launch Team Store": all players and the team manager get an email; the store can be closed at any time; actions are Cancel and Launch Team Store (Launch p2). ⚠ open question OI-5 / OI-54.
- BR-22 On confirm: store Open; "Your store is now live!" modal with View Store and Stay In Editor; the onboarding milestone event fires (Launch p2-3).
- BR-23 Post-launch header: LAUNCH STORE is replaced by Preview Store (opens the live storefront) and a store menu whose single option is Create Template (Launch p2). ⚠ open question OI-37 / OI-53.
- BR-24 Closed suspends ordering ("technically equivalent to a draft") but returns to Open directly. Status changes confirm with toasts (Launch p2). ⚠ open question OI-6 / OI-7.
- BR-25 Status is a shared read model: Draft/Open/Closed tags on dashboard cards and filter values. Archived cards appear only in the Archived Stores section of the Account page (Launch p2-3). ⚠ open question OI-4.

### B4. Integrations
- Notification send to rostered players and the team manager; onboarding-milestone event; storefront preview route; create-template flow seeded from the store's configuration (Launch p2-3).

### B5. Acceptance Criteria
- AC-21 A new store starts as draft (Launch p1).
- AC-22 With zero products, LAUNCH STORE is disabled and shows the tooltip text (Launch p1).
- AC-23 Launch → confirmation modal → success modal → store Open and milestone advanced (Launch p2).
- AC-24 On a launched store, the header shows Preview Store and the Create Template menu (Launch p2).
- AC-25 A status change anywhere is reflected on every surface (Launch p2).

---

## C. Customize New Product (Products tab and wizard Step 2)

### C1. Scope
- Brand-context SOURCE pill (resolved from QX7), the brand-scoped Customizer chip, a sport/category picker, hand-off to the brand customizer and return as a staged custom product (Product p1, p3-4).
- Both entry points (wizard Step 2 and the Products tab) behave identically (Product p4).

### C2. Actors & Roles
- Rep. Prolook admins own entitlement in QX7 but don't act in this flow (Product p1).

### C3. Business Rules
- BR-26 The pill lists only the brands the rep's dealership is entitled to in QX7; there is no fixed list (Product p2-3). ⚠ open question OI-15.
- BR-27 With exactly one entitled brand, the pill auto-resolves, no picker appears, and Customize New Product opens that customizer directly (Product p2-3).
- BR-28 With two or more brands, the rep must resolve the pill before a customizer opens. Brand type (owned/manufactured or licensed) is shown where QX7 exposes it (Product p2-3).
- BR-29 With zero brands, the pill and Customizer chip show an explicit state pointing to the Prolook admin. Stock Vault, Catalog Templates and Other stores keep working (Product p2, p4).
- BR-30 The pill scopes only the Customizer chip (saved designs and carts) and the Customize New Product target; the other sources are unaffected (Product p2-3).
- BR-31 When reopening the picker, the prior selection is visible but not pre-committed. Switching re-scopes the chip and target; staged items are unaffected (Product p3-4).
- BR-32 Server-side enforcement: direct navigation to a non-entitled customizer or catalog returns access-denied, and this must ship together with the UI (Product p3-4).
- BR-33 The picker grid (baseball, basketball, football, soccer, apparel, accessories, gendered variants) is scoped to the resolved brand (Product p4).
- BR-34 The customizer opens pre-filled with the store's Team Name, Team Colors and Logos (Product p3-4).
- BR-35 The returned item is staged and configured in the per-item configuration modal, which is the last point where its design can change. The design locks permanently on commit (Governing rule 1) (Product p3-4). ⚠ open question OI-14.

### C4. Integrations
- QX7 entitlement service (Product p1-4). ⚠ open question OI-15.
- External Customizer 3.0 and a sport/category template catalog (Product p4-5). ⚠ open question OI-13.

### C5. Acceptance Criteria
- AC-26 On load, the pill offers only entitled brands; one brand auto-resolves; with several, the rep must choose before a customizer opens; with zero, the explicit state shows (Product p2).
- AC-27 Customizer chip results are brand-scoped; the other chips are unchanged (Product p2-3).
- AC-28 Switching brand keeps staged items; a non-entitled route returns access-denied (Product p3).
- AC-29 The picker shows only the resolved brand's templates; selecting one opens the matching template; branding is pre-filled; the return lands in the configuration modal (Product p3).

---

## D. Order Management (Orders tab)

### D1. Scope
- Two sub-tabs: All Orders (default) and Pending Orders (with a live count badge). There is no Player Orders sub-tab; per-player tracking is in the My Team(s) player drawer (Orders p3, p4).
- Order detail drawer; pending-to-roster update path (Epic E) (Orders p4-5).

### D2. Actors & Roles
- Rep / store manager (Orders p2). ⚠ open question OI-24: team-manager access.

### D3. Business Rules
- BR-36 Snapshot rule: jersey number, name on jersey, size and (Direct-to-Home) shipping address are copied onto the order line at purchase and never re-read from the roster (Orders p1, p6). ⚠ open question OI-17.
- BR-37 No roster mutation (edit, rename, move, delete, clear) changes any placed order line: no cascade, sync or recalculation (Orders p2). This answers the order side of Roster Q-18. ⚠ open question OI-18: the move-player conflict.
- BR-38 Order → roster write-back (the checkout address and Roster Bank capture) is unaffected (Orders p2).
- BR-39 All Orders consolidates the rep's own and fan orders with origin badges (My Order / Fan); pending orders appear only in Pending. Search covers name, email and order number within the active sub-tab (Orders p3). ⚠ open question OI-20.
- BR-40 All Orders toolbar: search, sort, filter, date range, column visibility (per-user preference), row selection with an Export Selected bulk bar, pagination, CSV Export and the Order Status Guide. The factory-order link opens the drawer in Order View (Orders p3, p6).
- BR-41 Pending means placed in the storefront but not yet approved by the rep and sent to the factory (Orders p3).
- BR-42 Pending containers mirror the roster architecture: League gets one per roster group plus one per standalone roster; Single-Team gets one. The header shows the team code, rosters and destination; below MOQ it shows a progress ring (% to MOQ) and a tooltip with the fee (Orders p3). ⚠ open question OI-21.
- BR-43 Submit scopes: Submit Group (container header), Submit Selected (n), Submit All (sticky footer) (Orders p3).
- BR-44 Below-MOQ submission uses the same review modal, with the Minimum Quantity Fee itemized per group and in the summary; there is no extra destructive confirmation (Orders p3).
- BR-45 Review modal: shipping details, PO Number payment, billing confirmation, summary (subtotal, fee, total), items by shipping group, then Confirm · $total (Orders p3-4).
- BR-46 Freight-routing gate: any group with unresolved routing opens the Assign Managers modal (group manager or a team manager per unassigned roster, with address verification), then resumes to review (Orders p4). ⚠ open question OI-44.
- BR-47 Submission finalises the snapshot. The review modal never re-reads the roster, so edits made while it is open don't affect the submission (Orders p4).
- BR-48 Player drawer: each required or supplied item shows its ordered state (size, qty, order #, date, status, price, $0.00 for supplied gear) or a red "Not ordered" flag. Send Reminder is pinned only while gear is still unordered (Orders p4).
- BR-49 Divergence ("ordered as #12 · roster says #7") shows in the player drawer and the Item View. It doesn't change completion or re-arm Send Reminder, it is computed rather than stored, and it is not shown on Home (Orders p4-5, p7).
- BR-50 Epic E update: available only on a pending line that diverges. It rewrites that one line's snapshot from current roster values. It is per line only, with no bulk endpoint at all; never automatic or prompted; refused server-side once submitted; and has no pricing or MOQ effect (Orders p5, p7). ⚠ open question OI-19: amendment history.
- BR-51 Drawer: header shows Web Order #, Factory Order #, organization and cart name. It opens in Item View by default (Order View from a factory link). The stepper runs Submit Date → Order Confirmed → production stages → Delivery. Personalization shown is always the snapshot (Orders p4-5). ⚠ open question OI-23.

### D4. Data
- Order line holds its own personalization fields; the player FK is kept only for the tracking join (Orders p6).
- Lifecycle: storefront → pending → submitted (Orders p6).

### D5. Integrations
- Shared order, roster and factory services; reminder channel; CSV export (full and selected) (Orders p6).

### D6. Acceptance Criteria
- AC-30 Orders opens on All Orders; Pending carries a count badge; there is no Player Orders sub-tab (Orders p3).
- AC-31 A below-MOQ submission shows the fee itemized before Confirm (Orders p3).
- AC-32 Unresolved routing blocks submission until Assign Managers completes, then continues to review automatically (Orders p4).
- AC-33 A roster edit after placement leaves the order line unchanged (Orders p2).
- AC-34 The update action appears only on pending, diverging lines; a submitted line rejects the update server-side (Orders p5).

---

## E. Store Analytics (Reports tab)

### E1. Scope
- Store-scoped page stacking, in order: the KPI row, the Team Revenue chart (titled League Revenue on league stores) and the conditional Fundraising Report (Reports p2). ⚠ open question OI-25: the Close Report entry is missing here.
- No header Export; export lives only on the Fundraising Report (Reports p2). The Payouts tracker is out of scope (Reports p3).

### E2. Business Rules
- BR-52 The KPI cards reuse the Overview KPI components: Total Revenue, Orders (count of closed sales; clicks to All Orders), Pending Orders (clicks to the Pending sub-tab) and AOV, each with a trend vs last month (Reports p2-3). ⚠ open question OI-27.
- BR-53 Team Revenue is gross buyer spend on orders attributable to the team, not fundraising. It is an independent component, not the Overview chart, and must never be labelled profit or margin (Reports p3).
- BR-54 League stores: League Revenue aggregates all teams and divisions and has a team/division filter. Single-team stores have no filter (Reports p3, p5).
- BR-55 The Fundraising Report renders when the store flag is on, or when it is off but commercially locked items are still collecting. Mixed state shows a banner (Reports p3-4, p5). ⚠ open question OI-28 / OI-33.
- BR-56 The Fundraising Report covers only items whose fundraising was enabled at order time. Figures are recorded at order time and never recomputed (Reports p4-5).
- BR-57 Date presets: This season (open window), Last 7 days, Last 30 days, Year to date (Reports p4). ⚠ open question OI-31.
- BR-58 Breakdown: Fundraising Collected, Platform Fees, Card Processing Fees, Net Fundraising (bold), plus a summary sentence and a scope banner ("Fundraising" price additions only) (Reports p4). ⚠ open question OI-29.
- BR-59 Download PDF opens a settings modal: summary mode (Net Fundraising Summary by default, or Gross Total) and checkboxes for Detailed Breakdown, Selected Date Range and Include PDF Report Notes (Reports p4).

### E3. Acceptance Criteria
- AC-35 The Orders and Pending KPI cards deep-link to the matching Orders sub-tabs (Reports p2, p5).
- AC-36 The Fundraising Report is hidden only when fundraising is off and nothing is collecting (Reports p5).
- AC-37 Turning an item's fundraising off never changes historical totals (Reports p4-5).
- ⚠ open question OI-30: chart granularity toggle is OPEN (Reports p2). ⚠ open question OI-32: team-manager access.

---

## F. Store Settings (Settings tab)

### F1. Scope
- A sticky left sub-nav of seven sections: General → Schedule & Status → Team & Roster → Store Customization & Design → People & Access → Distribution & Fulfillment → Catalog & Decoration. The last appears only for third-party-vendor stores, so Prolook-only stores show six (Settings p1, p6, p18-19).
- Each card is read-only with a pencil that opens a focused edit modal; fields mirror Step 1 Basics (Settings p6).
- Section keys must be stable for deep links, and adding a section must not renumber them (Settings p23).

### F2. Actors & Roles
- Rep / owner: everything; archive is owner-only and hidden for manager-role users (Settings p16). ⚠ open question OI-45.
- Team-manager portal invitee: a slimmed portal with Reporting and Rosters only, scoped to the store; gets the manager Close Report (Settings p10-11). ⚠ open question OI-34.

### F3. Business Rules
- BR-60 General → Store Details shows Store Name, Store Type (Individual Team / League), Team Name, Sport, Logo, Colors, a Team Fundraising three-state pill and the Store Point of Contact. The modal also edits Roster Rules, Fundraising, and Compliance & Taxation (Collect Sales Tax → searchable State select by name or 2-letter code → read-only flat Tax Rate %) (Settings p6-7).
- BR-61 Connect-to-team: the banner reads "Connected — [Team]" with Change Team, or "Import Team Profile" when unbound. A re-bind re-imports logo, colors and sports, and re-derives the theme color if it is still on the default (Settings p8).
- BR-62 Coach import: nothing is imported silently; records are multi-selectable point-in-time copies with no write-back or live sync. A connect appends to existing managers and never replaces them (Settings p8, p24).
- BR-63 A re-bind lists the managers imported from the old team and asks keep/remove (hand-entered ones are excluded). Managers with portal access are called out (removing a record doesn't revoke access). Removing the primary is blocked until a new one is designated. Footer changes are stated before saving (Settings p8-9). ⚠ open question OI-42: "Add from Team Database" on the manager card is still OPEN.
- BR-64 Importing grants nothing: no account, email or access. Portal access comes only from an explicit invite (Settings p9, p24).
- BR-65 Point of Contact: Email (Team Manager default / Salesperson / Custom) and Phone (the same three) are set independently per channel. Team Manager mode inherits live from the primary record; non-primary records never feed it. A blank-value guard applies at save. The binding doesn't extend to the Team Database (Settings p9-10, p25). ⚠ open question OI-41: "primary" vs the "Point of Contact" label.
- BR-66 People & Access: the email invite is disabled until the address is valid (Enter submits), followed by a toast. Invite is offered against manager records that have an email. Table columns: Invitee, Invited, Status (Active with green dot and last login, or "Invited · not logged in" with amber dot). Empty state: "No team managers invited yet." Actions: View portal as (active), Resend (pending), Revoke (all; confirmation; also removes Close Report access) (Settings p10-11, p26).
- BR-67 Manager collection: written by Step 1, coach import and this card, with no classes by origin. Fields: First/Last Name, Email, Phone, Street Address, Contact Preference. Exactly one primary at all times; changing the primary repoints the footer, with a warning before save. Removing a record never revokes an invite (Settings p11-12). ⚠ open question OI-47: whether Team DB coach records carry an address.
- BR-68 Fulfillment Method: Ship to Team Manager (FREE) or Direct-To-Home. Ship to Team Manager shows a destination address that can be edited, cleared, or chosen from saved Pick-up Locations (held as a reference). Clearing saves, shows "No destination address" and blocks submission. Addresses are map-service verified, including imported ones (Settings p12-13, p25-26). ⚠ open question OI-43.
- BR-69 Order Fulfillment Mapping applies to League stores on Ship to Team Manager only. It mirrors the My Team(s) structure live. Per division it routes to the league manager, a division manager, or team managers with per-team overrides; managers need a 10-digit phone and an address. Incomplete mapping blocks submission. The header shows "n division · m team", and jump-ins from My Team(s) land with the division auto-opened (Settings p13). ⚠ open question OI-44.
- BR-70 Team Fundraising is a store master over per-item toggles. An item renders fundraising only when both the store flag and its own toggle are on, and a rep can't enable an item while the store is off. New items default to on (Settings p13-14). ⚠ open question OI-51.
- BR-71 Disable interstitial lists "Will be disabled" (name and amount) and "Cannot be disabled" (commercially locked: already ordered; this section is omitted if empty). Cancel reverts. It is skipped when nothing is enabled or exempt. Amounts are always preserved; re-enabling restores each item's prior state. Locked items unlock automatically when all their orders are cancelled (Settings p14-15, p24).
- BR-72 Three-state pill: Enabled (count of items collecting), Disabled (—), "Disabled · n items still collecting" (links to Products filtered to those items) (Settings p15).
- BR-73 Edit permissions: Draft is fully editable; after launch a TBD subset locks. Explicit exceptions that never lock: Point of Contact, ship-to address, Team Fundraising, the manager collection, theme color and announcement (Settings p15-16, p26). ⚠ open question OI-40.
- BR-74 Archive (Schedule & Status → Store Status → Danger Zone) is owner-only, behind a confirmation of its consequences. The storefront routes to "This store is closed"; the dashboard becomes read-only; the Archived pill shows and the close/archive actions disappear; existing Close Reports remain (Settings p16).
- BR-75 Close: manual (with confirmation) or at the scheduled close date. The storefront is locked and the announcement banner hidden; the workspace stays fully editable; changes go live only on re-open; a Close Report is generated (Settings p17).
- BR-76 Active Order Window card: Set window shows a progress bar, a "days left" pill (red in the final 7 days, "Closed" once closed) and the total raised. Always open shows the "Always open" pill (Settings p17). ⚠ open question OI-52.
- BR-77 Order Window Scheduler: store-level or per team code (start/end/timezone), searchable and status-sorted, with bulk apply ("only unset"), status counts and coverage-gap detection. It is keyed per team code; don't share code with Epic I's per-division keys (Settings p17-18, p25). ⚠ open question OI-38.
- BR-78 Repeating close dates (League only): Weekly, Every 2 weeks, Monthly or End of season; the next date is derived from the current one (Settings p18). ⚠ open question OI-38.
- BR-79 Allow Duplicate Numbers is a bulk write to every roster, not inherited at read time; each roster is authoritative and may override. Mixed state shows a count and a My Team(s) link. New rosters copy the store value at creation (Settings p18, p26). ⚠ open question OI-48.
- BR-80 Jersey Number Selection has two exclusive modes: Team manager chooses (no buyer entry) or Players choose (entered on the PDP; the roster fills in from orders). It saves immediately with a toast. Both values are shared with Step 1 D1 and never duplicated (Settings p18, p26). ⚠ open question OI-49.
- BR-81 Catalog & Decoration: seller scope and art policy (the default blocks publishing until art is cleared), gated on a per-store vendor flag (Settings p19, p27).
- BR-82 Close Report (Settings view): auto-presented once on the rep's next return, then reachable from the Store Status card. Re-close regenerates for the new window and keeps the prior report; archiving generates none. There is a team-manager variant (Settings p19). ⚠ open question OI-34 / OI-35 / OI-36 / OI-46.
- BR-83 Theme color: a swatch with source (Team default / Custom) using the Prolook picker. It defaults live to the team primary and re-derives on Change Team only if still on the default; a custom color survives. Reset to team color is available. It applies to buttons and accents via tokens, not a global override, and needs a source flag field (Settings p20, p24-25). ⚠ open question OI-47: contrast.
- BR-84 Announcement: rendered rich text with an empty state ("no banner"). The modal editor has a non-saved placeholder. It is the same field as Step 1 Epic H. It propagates live with no republish, is free text (no date checks) and must be sanitized (strip script, embed, iframe and handlers) (Settings p20-21, p25). ⚠ open question OI-47: length and allowed marks.
- BR-85 League overrides: per-division and per-standalone-team messages (teams inside a division inherit) shown as "inheriting". A per-division toggle applies the division brand color (stored in My Team(s)). Deleting a division drops its overrides. Searchable bulk apply writes per division or team (Settings p21, p25).

### F4. Integrations
- Team Database (branding and coaches), salesperson directory, state→tax-rate lookup with liability agreement, map-service verification, workspace Pick-up Locations service, Prolook color picker, email invite and password-set, "View portal as" impersonation (Settings p23-26).

### F5. Acceptance Criteria
- AC-38 The sub-nav shows 7 sections, or 6 on Prolook-only stores (Settings p18-19).
- AC-39 Changing the primary manager's email or phone updates the storefront footer with no re-save (Settings p10, p25).
- AC-40 Saving a Team Manager-mode channel with a blank primary field shows an inline error (Settings p10).
- AC-41 Importing a coach creates no invite or access; deleting a manager record doesn't revoke an invite (Settings p9, p24).
- AC-42 A cleared destination saves, shows "No destination address" and blocks pending submission (Settings p13).
- AC-43 Fundraising disable shows the two-list interstitial; confirm leaves locked items untouched; re-enable restores prior per-item states and amounts (Settings p14-15).
- AC-44 A custom theme color survives Change Team; a default color re-derives (Settings p20).
- AC-45 An announcement edited on a live store appears on the storefront without republish (Settings p21).

---

## G. Cross-spec

### G1. Conflicts between Launch & Status Controls and Store Status & Lifecycle
- Store Status card location: Launch and Settings say Settings → Schedule & Status; Lifecycle says "Detail tab". ⚠ open question OI-1 / OI-50.
- Launch flow: Launch has a confirmation modal, an email, a success modal and a milestone event; Lifecycle has an immediate transition. ⚠ open question OI-5.
- Close/Re-open confirmation: "confirm with toasts" vs a close modal and no re-open modal. ⚠ open question OI-6.
- Closed "technically equivalent to a draft" vs distinct storefront and report behaviour. ⚠ open question OI-7.
- Archived visibility: an Account-page Archived section vs "removed entirely". ⚠ open question OI-4.
- Control naming ("Pause" vs "Close Store") and KPI naming ("Open" vs "Active"). ⚠ open question OI-2 / OI-8.

### G2. Settings vs Lifecycle and Launch
- Team-manager Close Report: scoped variant vs full parity. ⚠ open question OI-34.
- Close Report blocking, tone and seen-key; metric set; profit vs revenue. ⚠ open question OI-35 / OI-36 / OI-26.
- Per-team-code windows and repeating close dates vs the single store-level auto-close state machine. ⚠ open question OI-38.
- Create Template entry point (header menu vs Store Status card). ⚠ open question OI-37.
- Agreement: archive is owner-only and support-only undo; closed workspace stays fully editable; re-close keeps prior reports (Settings p16-19; Lifecycle p6-8).

### G3. Settings vs Home (prior run)
- Appendix A 8e (Point of Contact rename) is not applied: Settings still says "primary". ⚠ open question OI-41 (Home Q-1).
- Appendix A 8b (Add from Team Database on the manager card) is still OPEN in Settings. ⚠ open question OI-42.
- Appendix A 8d (logo and colors don't lock) is not in the Settings lock list, which is still TBD. ⚠ open question OI-40.
- Appendix A 10 (header status chip) isn't specified in Launch, while Lifecycle mandates amber for Closed. ⚠ open question OI-53 (Home Q-21).
- Home Q-29 is partly resolved: exactly one primary always exists when a Team Manager-mode channel depends on one (Settings p11-12). Whether zero managers is allowed when no channel uses Team Manager mode is still unstated.
- Home Q-3 / C-14: the 7-day urgent pill is defined in Settings Epic E (Settings p17). Home Q-25: Settings A2b has no 7-day invite threshold, so that threshold is Home-owned.
- Home Q-2 / Q-22: Lifecycle defines a per-user, per-close-event seen record (Lifecycle p14). The precedence between the Setup Guide and the Close Report is still unresolved.
- Home Q-18 owning-tab filters: these specs add more filter dependencies. Settings needs "Products filtered to collecting items" (Settings p15) and a My Team(s) → Settings section-key deep link (Settings p13, p23). No spec here defines the filters Home needs.
- Tab shell: Home's six tabs (Home, My Team(s), Products, Orders, Reports, Settings) contradict Lifecycle's "Detail, Products, Roster, Orders, Reports". ⚠ open question OI-50.

### G4. Orders and Settings vs Roster (prior run)
- Roster Q-18 is resolved on the order side: deleting or clearing players never mutates orders (Orders p2). Whether a delete is allowed at all is still Roster's call.
- Roster Q-5 / Q-24: the move-player refusal conflicts with Orders' "moving… leaves every line as it was". ⚠ open question OI-18.
- Roster Q-10 / Q-19: Size and address in the snapshot and in Epic E. ⚠ open question OI-17.
- Roster Q-20 is partly resolved: the bulk apply overwrites every roster (Settings p18). Roster Q-21 is partly resolved: new rosters copy the store value at creation (Settings p18).
- Roster Q-15: which record "league manager" mode routes to is still undefined. ⚠ open question OI-44.
- Roster Q-6: team-manager invitees get a Rosters area (Settings p10). Their actions there are still unspecified. ⚠ open question OI-45.
- Roster Q-30 vocabulary: Settings and Home say "Individual Team Store"; Orders says "Single-Team stores".

### G5. Other cross-spec
- Launch gate definition of "product added" across Launch, Lifecycle and Product. ⚠ open question OI-16.
- Fundraising gating differs across Reports, Settings and the Close Report. ⚠ open question OI-28.
- Production-stage enum differs between Orders and the Close Report. ⚠ open question OI-23.
- Pending orders on Closed or Archived stores. ⚠ open question OI-22.

---

## Open items
All are sent to `question-consolidator`; see output/2026-10-16-ts-store-workspace/clarification-questions.md.
- OI-1 ⚠ Store Status card location (Settings vs Detail tab)
- OI-2 ⚠ "Pause" vs "Close Store" label
- OI-3 ⚠ Archive restore: managing rep vs support only
- OI-4 ⚠ Archived store entry point and the Account-page section
- OI-5 ⚠ Launch confirmation, email and success modal vs immediate transition
- OI-6 ⚠ Close/re-open: toast vs modal
- OI-7 ⚠ Closed "equivalent to draft"
- OI-8 ⚠ Open Stores vs Active Stores KPI; "Active" vocabulary
- OI-9 ⚠ Stray EIN/banking verification text in Lifecycle Dependencies
- OI-10 ⚠ Window behaviour on close, re-open after the close date, and launch before the open date
- OI-11 ⚠ Close Report window and "last period" for always-open or re-opened stores
- OI-12 ⚠ Definition of store owner
- OI-13 ⚠ Customizer 3.0 hand-off contract
- OI-14 ⚠ Missing Governing rule 1 and Product Catalog Management Epic A
- OI-15 ⚠ QX7 contract, pill persistence, revoked entitlement
- OI-16 ⚠ What counts as "product added" for the launch gate
- OI-17 ⚠ Size and address in the snapshot vs the Roster schema
- OI-18 ⚠ Move player with orders; container after a move
- OI-19 ⚠ Epic E amendment history (OPEN)
- OI-20 ⚠ Player team-gear orders in All Orders and origin badge
- OI-21 ⚠ MOQ thresholds and fee formula; billing source
- OI-22 ⚠ Pending orders on Closed or Archived stores
- OI-23 ⚠ Production-stage enum
- OI-24 ⚠ Team-manager access to Orders
- OI-25 ⚠ Close Report entry missing from the Reports layout
- OI-26 ⚠ Team Profit chart in the Close Report vs Team Revenue
- OI-27 ⚠ KPI definitions and periods
- OI-28 ⚠ Fundraising Report and hero gating conditions
- OI-29 ⚠ Refund netting and fee formulas
- OI-30 ⚠ Revenue chart granularity toggle (OPEN)
- OI-31 ⚠ "This season" preset scope
- OI-32 ⚠ Team-manager access to the Reports tab
- OI-33 ⚠ Missing Product Catalog Governing rule 3
- OI-34 ⚠ Team-manager Close Report: parity vs scoped variant
- OI-35 ⚠ Close Report blocking, tone and seen-state key
- OI-36 ⚠ Close Report metric set; email to the manager
- OI-37 ⚠ Create Template entry point
- OI-38 ⚠ Per-team-code windows and repeating close dates vs the lifecycle state machine
- OI-39 ⚠ What "pop-up" means; schedule toggle after launch
- OI-40 ⚠ Post-launch lock list TBD; Appendix A 8d
- OI-41 ⚠ "Primary" vs "Point of Contact" (Appendix A 8e)
- OI-42 ⚠ Add from Team Database on the manager card (Appendix A 8b)
- OI-43 ⚠ Ship-to destination vs primary manager address vs Pick-up Location
- OI-44 ⚠ "League manager" record; Assign Managers modal write path
- OI-45 ⚠ Manager-role model (workspace vs portal)
- OI-46 ⚠ No Close Report when archiving from Open
- OI-47 ⚠ Contrast, announcement limits and marks, coach schema (OPEN)
- OI-48 ⚠ Duplicate-numbers bulk apply confirmation and existing duplicates
- OI-49 ⚠ Jersey Number Selection edge cases
- OI-50 ⚠ Stale tab names and archive location in Lifecycle
- OI-51 ⚠ Fundraising toggle for items added while the store flag is off
- OI-52 ⚠ "Total raised": revenue or fundraising
- OI-53 ⚠ Header status chip, colours and vocabulary (Appendix A 10)
- OI-54 ⚠ Launch email recipients and edge cases
