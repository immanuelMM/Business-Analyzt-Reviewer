# Implementation Summary — Order Management (Orders Tab)
Sources: input/requirements/TS-Order Management (Orders Tab)-161026-094455.pdf (OM). Cross-checked against: TS-Roster Management (My Team(s) Tab) (RM), TS-Store Status & Lifecycle (SSL), TS-Store Analytics (Reports Tab) (SA), TS-Store Home (Home Tab) (SH), TS-Store Settings (Settings Tab) (SS), TS-Launch & Status Controls (LSC), TS-Customize New Product (CNP).

## 1. Scope
- In scope: Orders tab in the store workspace with two sub-tabs, All Orders (default) and Pending Orders (OM Epic A p3).
- In scope: MOQ-aware batch submission of pending orders, review & submit modal, freight-routing gate (OM Epic B p3-4).
- In scope: order detail side drawer with Order View / Item View (OM Epic D p4-5).
- In scope: personalization snapshot on the order line, divergence read, per-line pending-order update (OM Governing rule p1-2, Epic E p5, Dependencies p6-7).
- In scope (owned here, rendered in My Team(s)): per-player ordered-vs-missing gear drawer, Send Reminder, divergence line (OM Epic C p4).
- Out of scope: a Player Orders sub-tab (OM Epic A p3).
- Out of scope: any bulk "sync roster to orders" control, multi-select update or store-wide sweep (OM Epic E p5).
- Out of scope: surfacing divergence on Home (OM Dependencies p7; RM Epic 2 p11).
- Order sources: rep-placed, player (team-required/supplied gear), fan orders (OM Problem p1). Where submitted player orders appear ⚠ open question OI-3

## 2. Actors & Roles
- Rep / store manager: views and manages all orders, submits, enters PO, takes Epic E update (OM persona p2).
- Team managers / league directors: also "store managers" per RM, but OM grants them nothing; team-manager portal has no Orders area (SS Epic A2b p10) while Close Report gives full order table (SSL p11) ⚠ open question OI-17
- Parents/players: place orders at storefront; receive reminders (OM Epic C p4).

## 3. Business Rules
- BR-1 Order line copies jersey number, name on jersey, size and (Direct-to-Home only) shipping address at purchase; these are never re-read from the player record (OM Governing rule p1).
- BR-2 No roster mutation (edit number, rename, move, delete player, clear roster) changes an existing order line: no cascade, no sync, no recalculation (OM Governing rule p2; RM Epic 2 p11).
- BR-3 Moving a player with orders: OM implies allowed; RM Epic 7 refuses the move (OM p2; RM p18) ⚠ open question OI-13
- BR-4 Order → roster write-back (checkout address onto player record, team-gear order creating a Roster Bank capture) is unaffected by BR-2 (OM Governing rule p2; RM Epic 3 p12).
- BR-5 Whether checkout also writes number/name back onto an existing player record is unclear (OM p2; SS Epic F p18; RM p5) ⚠ open question OI-26
- BR-6 Order lifecycle: storefront → pending → submitted; pending = placed in storefront, not yet submitted to factory (OM Epic A p3, Dependencies p6). Full status set and production stages undefined ⚠ open question OI-4
- BR-7 Stepper stages differ between OM ("Submit Date → Order Confirmed → production stages → Delivery") and SSL ("Order placed → Confirmed → Artwork → Factory production → Shipped → Delivered") (OM Epic D p4; SSL p10) ⚠ open question OI-19
- BR-8 Pending orders appear only in the Pending sub-tab, never in All Orders (OM Epic A p3).
- BR-9 Pending containers mirror roster architecture: League = one per roster group + one per standalone roster; Single-Team = one container (OM Epic B p3). Conflicts with RM team/division model and roster-optional teams (RM p3, p8) ⚠ open question OI-11
- BR-10 Container header shows team code, rosters, shipping destination (league / group / team managers) and, when below MOQ, a progress ring with % to MOQ and a tooltip stating the fee (OM Epic B p3). Manager terminology conflicts with RM/SS "division manager" (RM p8; SS A3 p13) ⚠ open question OI-12
- BR-11 MOQ thresholds and minimum-quantity fee are calculated per shipping container (OM Dependencies p6). Values, unit and formula not given ⚠ open question OI-1
- BR-12 MOQ unit of evaluation when a container mixes brands/vendors is unclear (OM p1, p6; CNP Epic A; SS Epic G) ⚠ open question OI-27
- BR-13 Submit scopes: Submit Group (container header), Submit Selected (n) (row checkboxes), Submit All (sticky footer) (OM Epic B p3). Fee rule for partial-group submission undefined ⚠ open question OI-2
- BR-14 Below-MOQ submission is allowed; it goes into the same review modal with the Minimum Quantity Fee itemized per shipping group and in the order summary; no separate destructive confirmation (OM Epic B p3).
- BR-15 Review modal totals: subtotal + any minimum-quantity fee = total; Confirm button shows total (OM Epic B p3-4).
- BR-16 Payment is a PO Number only (OM Epic B p3). Format/validation undefined ⚠ open question OI-9
- BR-17 Freight-routing gate: if any group in the submission has unresolved routing (missing group/team manager), an Assign Managers modal blocks, collects the group manager or a team manager per unassigned roster with address verification, then auto-continues to review (OM Epic B p4).
- BR-18 SS and SH also block submission on a missing ship-to destination address; OM gate omits it and is silent on Direct-to-Home stores (SS A3 p13; SH C-04 p12) ⚠ open question OI-23
- BR-19 Whether the Assign Managers modal writes the shared mapping / manager collection or only picks existing records is unclear (OM p4; SS A3 p13; RM p8) ⚠ open question OI-25
- BR-20 Submission closes the pending window: snapshot becomes final, Epic E update withdrawn; review modal never re-reads the roster, so roster edits while it is open do not change the submission (OM Epic B p4).
- BR-21 Divergence = snapshotted personalization differs from player's current roster values; it is computed on read, never stored as a flag, and resolves itself if either side changes back (OM Dependencies p7; RM Dependencies p20).
- BR-22 Divergence consumers: OM says gear drawer + order detail drawer "and nothing else"; RM adds Team Gear column and Player Address column (OM p7; RM p11-12) ⚠ open question OI-14
- BR-23 Divergence never changes completion: item still counts as ordered and does not re-arm Send Reminder; it never gates submission or launch (OM Epic C p4; RM Epic 2 p11).
- BR-24 Epic E update offered only when the line diverges and the order is pending; shown on the divergence line in the gear drawer and in the order detail drawer (OM Epic E p5).
- BR-25 Epic E rewrites one order line's snapshot from current roster values; afterwards the line is indistinguishable from one placed with those values (OM Epic E p5).
- BR-26 Epic E is per line only; no bulk endpoint may exist (absence is a requirement) (OM Epic E p5, Dependencies p7).
- BR-27 Epic E must be refused server-side for any order not in pending state; after submission divergence renders as information only (OM Epic E p5, Dependencies p7).
- BR-28 Epic E is never automatic and never prompted: no modal, banner or attention card asks the rep to apply it (OM Epic E p5).
- BR-29 Epic E never changes line total, container MOQ progress or review-modal figures (OM Epic E p5). Which fields it rewrites (size, DTH address) and whether size affects price is unclear (OM p1, p5; RM Epic 3 p12) ⚠ open question OI-6 ⚠ open question OI-15
- BR-30 Epic E behaviour when the player was deleted or moved, and container placement of a moved player's pending line, undefined (OM Epic C/E) ⚠ open question OI-7
- BR-31 Whether an Epic E update is recorded in an order amendment history is OPEN in the source; recommended minimal record of what/when/who (OM Epic E p5, Dependencies p7) ⚠ open question OI-5
- BR-32 Gear drawer shows each required/supplied item as ordered (size, qty, order #, order date, status badge, price; $0.00 for team-supplied) or a red "Not ordered" flag (OM Epic C p4). No opted-out state although SH/Products allow opt-out (SH C-05 p13) ⚠ open question OI-24
- BR-33 Send Reminder appears pinned to drawer footer only while required gear is un-ordered (OM Epic C p4); disabled with a reason for a player with no contact channel (RM Epic 2 p10). Channel/recipient undefined ⚠ open question OI-8
- BR-34 Uncommitted Roster Bank captures count toward team-gear completion but are not players; how their orders join tracking/containers is undefined (RM Epic 5 p15; OM Epic C) ⚠ open question OI-16
- BR-35 Pending-order cancellation is assumed elsewhere (SH C-01 "submitted or cancelled"; SS A4 "non-cancelled order") but OM defines no cancel action or state (SH p11; SS p15) ⚠ open question OI-22
- BR-36 Submit / Epic E availability in Closed and Archived stores, and fate of un-submitted pending orders at archive, undefined (SSL p3, p7; LSC p2) ⚠ open question OI-18
- BR-37 PO settlement ("open PO") state is required by SSL Close Report and SH C-20 but OM has no payment status (SSL p13; SH p22) ⚠ open question OI-20
- BR-38 Pending count definition differs: OM "placed ... not yet sent to the factory" vs SA KPI "active orders currently processing" (OM p3; SA Epic B p2) ⚠ open question OI-21

## 4. Data
- Order line (own fields, not references): jersey number, name on jersey, size, DTH shipping address (OM Dependencies p6; RM schema p4: number integer 00-99, name max 15 chars uppercase).
- Order line may keep a foreign key to the player record for the roster join only; it must never be the source of printed values (OM Dependencies p6).
- No read path (drawer, review modal, PO/factory export, any report) may resolve personalization through the roster (OM Dependencies p6).
- Order: Web Order #, Factory Order #, organization, cart name, origin badge (My Order / Fan), status, PO number, tracking, delivery, sport, rep/dealership, item pricing (OM Epic A p3, Epic D p4).
- Shipping container: keyed to roster architecture; team code; shipping destination; MOQ threshold; fee (OM Epic B p3). Team codes are backend keys stamped onto orders for container routing (RM Dependencies p21).
- Review submission: PO number, billing confirmation, shipping details, subtotal, minimum-quantity fee per group, total (OM Epic B p3-4).
- Per-user column-visibility preferences for All Orders (OM Dependencies p6).
- Amendment history for Epic E: not present today ⚠ open question OI-5

## 5. Flows
- Open Orders tab → All Orders shown by default; search (name, email, order #) filters the active sub-tab (OM Epic A p3).
- All Orders toolbar: search, sort, filter, date range, column visibility, row selection + bulk Export Selected, pagination, CSV Export, Order Status Guide; factory-order-number link opens drawer in Order View (OM Epic A p3). Field-level details missing ⚠ open question OI-10
- Pending submit: choose scope (Group / Selected / All) → [freight gate: Assign Managers modal if routing unresolved] → review modal (shipping, PO, billing, items grouped by shipping group) → Confirm · $total → orders become submitted (OM Epic B p3-4).
- Below-MOQ path: same as above, fee itemized in modal; no extra confirmation (OM Epic B p3).
- Divergence (pending): roster edited → gear drawer and order drawer show "ordered as #12 · roster says #7" + update action → rep updates one line (OM Epic C p4, Epic E p5).
- Divergence (submitted): same display, no action; rep warns parent outside the system (OM persona p2, Epic E p5).
- Order detail drawer: click any order → side drawer; opens in Item View (Order View if from factory-order link); Order View line item click jumps to Item View; Item View shows snapshot plus current roster value where drifted (OM Epic D p4-5).

## 6. Integrations
- Shared internal order / roster / factory services; order service spans rep, player and fan orders (OM Dependencies p6).
- Roster join to My Team(s) player drawers and Team Gear column (OM Dependencies p6; RM Dependencies p22).
- Reminder channel for Send Reminder (OM Dependencies p6) ⚠ open question OI-8
- Address verification (map service) inside Assign Managers modal, shared with Settings manager mapping (OM Epic B p4; RM Dependencies p21).
- CSV export (full and selected); Close Report CSV reuses the All Orders export service and respects column visibility (OM Dependencies p6; SSL p10, p15).
- Deep links from Reports KPI cards (Orders → All Orders, Pending Orders → Pending sub-tab) and Home C-01/C-02/C-18/C-20 into Orders sub-tabs/filters (SA Epic B p2; SH Epic C p11, p22).
- Order-detail and production-stage data feed the drawer (OM Dependencies p6).

## 7. Non-Functional
- Security: Epic E state check enforced server-side so a stale client cannot rewrite a submitted line (OM Epic E p5).
- Data integrity: no bulk personalization-update endpoint may exist (OM Dependencies p7).
- Consistency: Home and Close Report figures must reconcile exactly with the Orders tab (SH Governing rule 1 p3; SSL p9).

## 8. Acceptance Criteria
- AC-1 Given the Orders tab opens, then All Orders is shown by default with rep and fan orders badged My Order / Fan, and no pending orders appear there (OM Epic A p3).
- AC-2 Given the Pending sub-tab, then it shows a live count badge and lists only orders placed but not yet submitted (OM Epic A p3).
- AC-3 Given a search term, then results are filtered by name, email or order number within the active sub-tab only (OM Epic A p3).
- AC-4 Given a factory-order-number link, when clicked, then the drawer opens in Order View (OM Epic A p3, Epic D p4).
- AC-5 Given a League store, then Pending shows one container per roster group plus one per standalone roster; Single-Team shows one container (OM Epic B p3).
- AC-6 Given a container below MOQ, then its header shows a progress ring with % to MOQ and a tooltip with the fee (OM Epic B p3).
- AC-7 Given a below-MOQ submission, then the review modal itemizes the Minimum Quantity Fee per shipping group and in the summary, with no extra confirmation step (OM Epic B p3).
- AC-8 Given any submission, then the review modal shows shipping details, PO Number entry, billing confirmation, subtotal / fee / total, items grouped by shipping group, and a "Confirm · $total" button (OM Epic B p3-4).
- AC-9 Given a submission including a group with a missing group/team manager, then the Assign Managers modal blocks and, on completion, opens the review modal automatically (OM Epic B p4).
- AC-10 Given the review modal is open and the roster is edited, then the submitted personalization is unchanged (OM Epic B p4).
- AC-11 Given any roster mutation (edit, rename, move, delete, clear), then every existing order line is unchanged (OM Governing rule p2).
- AC-12 Given a pending line whose snapshot differs from the roster, then the gear drawer and order drawer show both values and offer the update action (OM Epic C p4, Epic E p5).
- AC-13 Given the update action is taken, then only that one line is rewritten and the divergence clears (OM Epic E p5).
- AC-14 Given a submitted order, then no update action is shown and a direct API call to update its line is refused (OM Epic E p5, Dependencies p7).
- AC-15 Given an update, then line total, container MOQ progress and review-modal figures are unchanged (OM Epic E p5).
- AC-16 Given the roster is edited back to the ordered value, then the divergence disappears without any action (OM Dependencies p7).
- AC-17 Given a diverged ordered item, then it still counts toward team-gear completion and Send Reminder is not re-armed (OM Epic C p4).
- AC-18 Given a player missing required items, then Send Reminder is pinned to the drawer footer; it disappears once all required gear is ordered (OM Epic C p4).
- AC-19 Given a team-supplied item is ordered, then its price shows $0.00 (OM Epic C p4).
- AC-20 Given any order, when clicked, then the drawer opens in Item View with Web Order #, Factory Order #, organization and cart name in the header (OM Epic D p4).
- AC-21 Given Item View on a diverged line, then it shows the ordered values and notes the current roster value alongside (OM Epic D p5).
- AC-22 Given no UI or API, then there is no bulk or multi-select "sync roster to orders" path (OM Epic E p5).

## 9. Dependencies & Assumptions
- Depends on shared division/team/roster state and team codes from My Team(s) for container keying (RM Dependencies p20-21) ⚠ open question OI-11
- Depends on Settings → Distribution & Fulfillment mapping and ship-to destination for the freight gate (SS Epic A3 p13; RM Epic 0 p8) ⚠ open question OI-23
- Roster Management's permissive editing depends absolutely on the snapshot rule (OM Dependencies p6; RM Dependencies p20).
- Store lifecycle (Draft/Open/Closed/Archived) owned by SSL; Orders tab accessible in Draft and editable in Closed, read-only in Archived (SSL p3, p5-7) ⚠ open question OI-18
- Amendment-history decision must be settled before build (OM Dependencies p7) ⚠ open question OI-5

## Open items
Questions are tracked in output/2026-10-19-order-management/clarification-questions.md.
- OI-1 MOQ values, unit, fee formula, owner — ⚠ open question OI-1
- OI-2 Fee/MOQ for Submit Selected on part of a group — ⚠ open question OI-2
- OI-3 Where submitted player orders appear; fan orders and pending/MOQ — ⚠ open question OI-3
- OI-4 Full order status set and production stages — ⚠ open question OI-4
- OI-5 Amendment history for Epic E updates (OPEN in source) — ⚠ open question OI-5
- OI-6 Which fields divergence/Epic E covers; size and price — ⚠ open question OI-6
- OI-7 Divergence/update for deleted or moved players; container placement — ⚠ open question OI-7
- OI-8 Send Reminder channel, recipient, content, limits — ⚠ open question OI-8
- OI-9 PO number format/validation; billing confirmation — ⚠ open question OI-9
- OI-10 All Orders filters, sort, date field, page size, CSV columns — ⚠ open question OI-10
- OI-11 Containers per roster vs per team/division (OM vs RM) — ⚠ open question OI-11
- OI-12 Group vs division manager; roster vs team unit (OM vs RM, SS) — ⚠ open question OI-12
- OI-13 Moving a player with orders allowed or refused (OM vs RM) — ⚠ open question OI-13
- OI-14 Divergence consumers list (OM vs RM) — ⚠ open question OI-14
- OI-15 Epic E and shipping address (OM vs RM Epic 3) — ⚠ open question OI-15
- OI-16 Roster Bank capture orders in tracking/containers (OM vs RM) — ⚠ open question OI-16
- OI-17 Team manager / league director permissions on orders (OM vs RM, SS, SSL) — ⚠ open question OI-17
- OI-18 Submit/update by store status; pending orders at archive (OM vs SSL, LSC) — ⚠ open question OI-18
- OI-19 Production-stage names (OM vs SSL) — ⚠ open question OI-19
- OI-20 PO settlement state (OM vs SSL, SH) — ⚠ open question OI-20
- OI-21 Pending count definition (OM vs SA) — ⚠ open question OI-21
- OI-22 Pending-order cancellation (OM vs SH, SS) — ⚠ open question OI-22
- OI-23 Freight gate omits missing destination address; DTH stores (OM vs SH, SS) — ⚠ open question OI-23
- OI-24 Opted-out gear state (OM vs SH) — ⚠ open question OI-24
- OI-25 Assign Managers modal write path (OM vs SS, RM) — ⚠ open question OI-25
- OI-26 Checkout write-back of number/name (OM vs SS, RM) — ⚠ open question OI-26
- OI-27 MOQ per container vs per manufacturer (OM vs CNP, SS) — ⚠ open question OI-27
