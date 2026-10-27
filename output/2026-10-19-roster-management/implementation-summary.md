# Implementation Summary — Roster Management (My Team(s) Tab)
Sources: input/requirements/TS-Roster Management (My Team(s) Tab)-161026-092450.pdf (cited as "Roster p.N", 22 pages). Cross-checked for conflicts only (not summarized) against every other file in input/requirements/: TS-Order Management (Orders Tab) ("Orders"), TS-Store Settings (Settings Tab) ("Settings"), TS-Launch & Status Controls ("Launch"), TS-Store Status & Lifecycle ("Lifecycle"), TS-Store Home (Home Tab) ("Home"), TS-Store Analytics (Reports Tab) ("Analytics"), TS-Customize New Product ("Customize").

## 1. Scope
- In scope: the My Team(s) tab (labelled "My Team" on Single-Team stores): division/team structure, rosters and player records, manual/CSV/template roster filling, duplicate-number policy and number selection, Direct-to-Home player address, Roster Bank surfacing, roster→order divergence reporting and the pending-order update, League product visibility/assignment, and moving players between teams (Roster p.2, p.7-18)
- Store types: League (Multi-Team Hub) with divisions, teams and a canvas; Single-Team Locker with no division tier or grouping UI (Roster p.3, p.7) ⚠ open question OI-35 (names differ across specs)
- The structure editor is one shared component with two hosts: this tab and League store creation Step 2 (Divisions & Teams) (Roster p.8, p.20-21) ⚠ open question OI-36
- A roster is never required to launch; a team may have no roster (Roster p.2)
- Out of scope / owned elsewhere:
  - Roster Bank capture, pre-grouping and commit mechanics: Roster-Optional Architecture spec, Epic C (Roster p.14, p.22)
  - Storefront team selector: Roster-Optional Architecture, Epic D (Roster p.8, p.21)
  - Order snapshot model, pending window, update endpoint: Orders spec (Roster p.11, p.20)
  - Catalog record, pricing, team-code bindings, assignment permissions: Products tab spec (Roster p.15, p.21)
  - Fulfillment mapping definition: Store General Settings Epic A3 (Roster p.8)
- Explicitly not built: bulk "sync roster to orders" control (Roster p.11); rep- or shopper-facing team code entry (Roster p.8, p.21); a Home attention card for divergence (Roster p.11)
- Store-wide player view for Home C-05 is not defined here ⚠ open question OI-28
- Addressable deep-link routes and resume events required by Home are not defined here ⚠ open question OI-38
- Behaviour of this tab on Archived stores is not defined here (Lifecycle and Settings make it read-only) ⚠ open question OI-33

## 2. Actors & Roles
- Rep (store manager): full use of the tab (Roster p.2, p.6-7)
- Team manager: add, edit, import, remove players, clear/delete roster per user stories; Settings gives team managers only a two-area portal (Reporting, Rosters) ⚠ open question OI-25
- League director: named as a store manager, never defined ⚠ open question OI-25
- Parent/player (shopper): picks jersey numbers on storefront PDP/checkout; supplies shipping address at checkout (Roster p.7, p.12-13)
- Product assignment permissions follow existing Products tab rules; this tab adds no new authority (Roster p.21)

## 3. Business Rules
Structure
- BR-1: Divisions exist only in League stores, are optional, carry branding (name, color, sport) and contain teams; teams may sit in a division or stand alone (Roster p.3, p.7) ⚠ open question OI-5
- BR-2: Every team must have a name; a roster is optional on every team (Roster p.3, p.7)
- BR-3: A roster attaches to exactly one team; a team holds at most one roster; no free-standing rosters (Roster p.3, p.20)
- BR-4: Deleting a division keeps its teams: they become standalone, drop division branding, and keep roster and players intact (Roster p.8, p.20) ⚠ open question OI-7
- BR-5: Deleting a team removes it and any roster it holds from shared state (Roster p.10, p.20) ⚠ open question OI-10
- BR-6: Each division and team gets a deterministic, human-readable team code (e.g. RT47A), generated at creation, stamped on orders, read-only in the workspace, never entered by rep or shopper, not shown during store creation (Roster p.8, p.21) ⚠ open question OI-6
- BR-7: Fulfillment mapping per division: league manager, division manager, or individual team managers; same state is read/written by Settings → Distribution & Fulfillment and the division/team detail components (Roster p.8, p.21) ⚠ open question OI-9, OI-31
- BR-8: Unassigned managers gate pending-order submission (Roster p.8) ⚠ open question OI-27, OI-31
- BR-9: In the creation host (Step 2), branding, team code and all Epic 6 product affordances are suppressed presentationally only; codes are still generated and division color takes its default (Roster p.8, p.20-21)

Player records & validation
- BR-10: Only First Name and Last Name are required; no contact channel is required (Roster p.3, p.22)
- BR-11: Contact email and phone are format-validated only when supplied (Roster p.3, p.5, p.22) ⚠ open question OI-4
- BR-12: Name on Jersey is converted to UPPERCASE dynamically (Roster p.4) ⚠ open question OI-1
- BR-13: A record with no email and no phone is fully valid; Share Team Store Link degrades to copy-only and Send Reminder is disabled with a stated reason for that player (Roster p.6, p.10, p.22) ⚠ open question OI-13

Roster edits vs orders
- BR-14: Roster edits (number, name on jersey, duplicate policy) are never blocked by order state: no block, no confirmation, no warning interstitial (Roster p.2, p.11) ⚠ open question OI-33, OI-34
- BR-15: A roster edit never mutates a placed order; personalization is snapshotted on the order line at purchase and never re-read (Roster p.2, p.11, p.20) ⚠ open question OI-2
- BR-16: Divergence (ordered value ≠ current roster value) is a derived comparison, never a stored flag, and self-resolves when either side changes (Roster p.20) ⚠ open question OI-26
- BR-17: Divergence never gates anything: not submission, not the launch gate, not Home cards, not team-gear completion (Roster p.11)
- BR-18: While the order is pending, the divergence line offers one per-line action that rewrites that line's snapshot to current roster values; no bulk variant exists (Roster p.11, p.20) ⚠ open question OI-39
- BR-19: The pending-order update is refused server-side once the order is submitted, not merely hidden (Roster p.20)

Roster maintenance
- BR-20: Deleting a player (single or bulk), Clear Roster, or moving a player releases their jersey number immediately (Roster p.10, p.13, p.17)
- BR-21: Single delete is instant; bulk delete, Clear Roster and Delete Roster require a confirmation modal (Roster p.10)
- BR-22: Clear Roster removes all players and keeps the roster entity attached to its team; disabled when the roster is empty (Roster p.10, p.20)
- BR-23: Delete Roster removes the roster entity and keeps the team; offered only in League stores, never on a Single-Team store's only roster (Roster p.10, p.20) ⚠ open question OI-12
- BR-24: Clear/Delete Roster never touch Roster Bank captures or product assignments; modal counts state committed players only and mention pending captures where present (Roster p.10, p.20)

Direct-to-Home address
- BR-25: Player Shipping Address field and Player Address column exist only when store fulfillment is Direct to Home Delivery; never collected otherwise (Roster p.5, p.12)
- BR-26: Address is optional for the rep; when entered it is validated against a map service on the backend before acceptance (Roster p.12)
- BR-27: If an existing player's address is blank, the address entered at storefront checkout writes back onto the roster (Roster p.5, p.12) ⚠ open question OI-15
- BR-28: Write-back and Roster Bank capture are mutually exclusive for one order: existing record → write-back; no matching record → capture (Roster p.12) ⚠ open question OI-15
- BR-29: Nothing in this tab writes an address onto a placed order; address divergence is reported like personalization (Roster p.12) ⚠ open question OI-14

Duplicate-number policy
- BR-30: Allow Duplicate Numbers is persisted per roster and the roster's own value is always what validation reads (Roster p.12, p.21) ⚠ open question OI-17
- BR-31: The league-level control (Settings → Team & Roster, Roster Rules card; also Step 1 Basics Epic D1, same field) is a bulk write cascading to every roster, not a read-time inherited value (Roster p.12-13, p.21) ⚠ open question OI-16
- BR-32: New rosters copy the league-level value at creation only, then diverge freely (Roster p.13, p.21)
- BR-33: Settings shows a mixed state when rosters disagree; each roster view states the policy in force (Roster p.13)
- BR-34: Duplicates disallowed: taken set = committed player records ∪ pending Roster Bank captures for that team; taken numbers render disabled on every entry surface (roster add row, edit drawer, storefront PDP, checkout) (Roster p.13, p.21-22) ⚠ open question OI-18, OI-32
- BR-35: The edited player's own current number is excluded from the taken set (Roster p.9, p.13, p.22)
- BR-36: Inline error "Number [X] is already assigned to [Player Name]" is a server-side backstop only for CSV import and direct field entry (Roster p.13, p.22)
- BR-37: A capture's held number is released only when the capture is dismissed from the Roster Bank (Roster p.13)
- BR-38: Duplicates allowed: all numbers selectable, no conflict error, captures impose no constraint, in-use numbers labelled "duplicate" not "taken" (Roster p.13-14)
- BR-39: Turning duplicates off is never blocked: no sweep, no conflict list, no record change, no number released (Roster p.14, p.22)
- BR-40: Grandfathered duplicates stand; they count as taken so no third player can join; the roster view shows the derived exception line until it self-clears on delete, move, renumber, or policy back on (Roster p.14, p.22)
- BR-41: Taken-number set invalidates on player delete, bulk delete, Clear Roster, capture commit and capture dismissal (Roster p.22)

Roster Bank
- BR-42: Committing a capture writes an ordinary player record at the captured values; creates the team's roster if none exists (Roster p.15)
- BR-43: Captures are not players: not in the player table or player counts, unaffected by Clear/Delete Roster, but they hold jersey numbers and count toward team-gear completion (Roster p.15) ⚠ open question OI-19, OI-37
- BR-44: Roster Bank is not surfaced during store creation (Roster p.15)

Product assignment (League only)
- BR-45: Product surfaces render only in League stores in the workspace; never on Single-Team stores or in the creation step (Roster p.8, p.15)
- BR-46: This tab and the Products tab read/write the same assignments; neither is authoritative (Roster p.15, p.21)
- BR-47: Assignment has two scopes, team and division; division-scoped products appear on teams as "via division" rows (Roster p.16-17, p.21)
- BR-48: A division-wide assignment applies to teams added to the division later, without re-assignment (Roster p.17) ⚠ open question OI-21
- BR-49: Clearing/deleting a roster leaves team product assignments untouched; products do not travel with a moved player (Roster p.10, p.18)

Move player
- BR-50: Move to team lists every other team in the store; League list grouped by division and searchable (Roster p.17) ⚠ open question OI-24
- BR-51: If the number is taken or disallowed on the destination (taken set per BR-34), the rep assigns a different number or moves without one (Roster p.18)
- BR-52: A player with one or more team-gear orders cannot be moved; control disabled with reason; bulk move names each blocked player (Roster p.18) ⚠ open question OI-22, OI-23, OI-40
- BR-53: Moving the last player off a roster leaves the roster entity in place (Roster p.18)

## 4. Data
- Division: name, brand color, sport, team code, fulfillment mode; optional division-scoped product assignments (Roster p.3, p.8, p.21) ⚠ open question OI-5
- Team: name (required), division ref (optional), team code (backend), at most one roster (Roster p.3, p.8) ⚠ open question OI-40 (revenue attribution after re-home)
- Roster: team ref (1:1, required once created), Allow Duplicate Numbers (per roster) (Roster p.3, p.12) ⚠ open question OI-12
- Store: league-level Allow Duplicate Numbers default (single field shared with Step 1) (Roster p.13, p.21) ⚠ open question OI-16
- Store: Jersey Number Selection mode (team manager chooses / players choose), defined in Settings Epic F, not in this spec ⚠ open question OI-32
- Player record (Roster p.3-6, p.22):
  - First Name: required, string ≤50
  - Last Name: required, string ≤50
  - Jersey Number: optional, integer 00–99, 2-digit input ⚠ open question OI-3
  - Name on Jersey: optional, string ≤15, uppercased
  - Contact Email: optional, valid email when present
  - Contact Phone: optional, 10-digit numeric when present ⚠ open question OI-4
  - Player Shipping Address: optional, street/city/state/ZIP, map-verified; Direct-to-Home only; source badge "From checkout" / placeholder "Awaiting checkout"
  - Associated Emails: optional list of valid emails
  - No Size field ⚠ open question OI-2
- Roster Bank capture: pending entry per team from a team-gear order; holds a jersey number; schema owned by Roster-Optional Architecture spec (Roster p.14-15)
- Order line (owned by Orders): snapshot of jersey number, name on jersey, size, shipping address; player FK allowed for tracking only (Roster p.20; Orders §Dependencies)
- Manager record: name, email, 10-digit phone, address (Roster p.21)
- Sources of truth: roster's own duplicate setting; order line snapshot for printed values; shared structure state read by Products, Orders and Settings (Roster p.20-21)

## 5. Flows
- League home: stats header (divisions · teams · players + pending-capture count), canvas of division headers and team nodes, standalone-teams list, New Team / New Division (Roster p.7, p.14)
- Single-Team: tab opens straight into the team's player table (Roster p.7)
- Division create/edit: modal with name, brand color, fulfillment-manager mode (Roster p.8) ⚠ open question OI-5
- Team: add to a division or standalone, rename, delete with confirmation (Roster p.8) ⚠ open question OI-8, OI-10
- Drill-in: division → its teams; team → breadcrumbs + branded banner (division color, team avatar) + player table; detail panel split Setup / Products in the workspace; Setup only in creation (Roster p.8, p.16)
- Order Fulfillment strip on division/team views: effective manager or "Not assigned" + Manage link (Roster p.8) ⚠ open question OI-31
- Add player: inline "Add Player" row at table foot with all fields (address only for Direct-to-Home); green check adds instantly (Roster p.9)
- CSV import: toolbar Upload Roster → modal (drag-drop / browse, "Download CSV template") → per-row/per-cell validation → preview with valid/skipped counts → confirm; invalid rows skipped ("n rows skipped — fix and re-upload") (Roster p.9) ⚠ open question OI-11
  - Only missing required fields or a malformed present email/phone skip a row; duplicates skip only on rosters that disallow them
- Share Roster Template: emails blank prolook_roster_template.csv to team managers (addresses from Settings manager records), message pre-drafted and signed by the logged-in rep (Roster p.9)
- Edit: row 3-dot menu → Edit → side drawer pre-populated; number control follows policy (Roster p.9)
- Delete: row menu single delete (instant); checkbox selection → bulk delete with confirmation (Roster p.10)
- Clear Roster: confirmation stating player count and that the roster is kept → toast "Roster cleared — n players removed" (Roster p.10)
- Delete Roster (League): confirmation stating roster and n players deleted → return to team detail → toast "Roster "name" deleted" (Roster p.10)
- Share Team Store Link: row menu copies per-player invite link; multi-select → bulk modal pre-filled from contact + associated emails; no-email players listed copy-only; if none have email, link offered for manual distribution (Roster p.10)
- Team Gear column: "n/m team gear items" → gear drawer (ordered vs missing required gear, Send Reminder) (Roster p.10) ⚠ open question OI-37
- Sorting: Name A–Z/Z–A, Number low→high/high→low, live player count (Roster p.10)
- Divergence: gear item shows "ordered as #12 · roster says #7"; pending → "update the order to #7" action; submitted → information only (Roster p.11) ⚠ open question OI-26
- Direct-to-Home address: entry → "Verifying address with map service…" → failure offers retry or leave blank (Roster p.12)
- Duplicate policy off with existing duplicates: setting saves → exception line "duplicates off · 2 players share #7, assigned before the rule changed" with affected rows identifiable (Roster p.14)
- Roster Bank: per-team view from team detail; store-wide view from My Team(s) home with team column and filters; commit from either (Roster p.14)
- Product canvas: team node thumbnail strip, amber "No products yet", per-node + opens drawer scoped to team, division count pill (Roster p.15) ⚠ open question OI-20
- Product inspect: hover thumbnail → floating Products-tab card (thumbnail, name, design ID, team setting, assigned teams, Youth/Adult prices); click thumbnail or panel row title → full product detail modal, editable; close returns to origin with edits reflected (Roster p.16)
- Team Products tab: assigned products with "via division" rows; Add Products split menu (Add New Product → existing flow; Add from Catalog → drawer); Roster button; "+ Add Product" in tab header (Roster p.16)
- Division Products tab: division-wide list + per-team coverage table; amber "+ Assign products" for uncovered teams; Add Products and Add Team (Roster p.16)
- Catalog drawer: docks right, search + filters All / Unassigned / Not on [X]; click Assign → launching scope; drag grip onto any team node → team; onto division header → division-wide (Roster p.16-17)
- Move player: row or bulk Move to team → destination picker → number conflict prompt → confirm; blocked players stay and are named (Roster p.17-18) ⚠ open question OI-22, OI-24

## 6. Integrations
- Shared platform state: division/team/roster structure read by Products tab (assignment), Orders tab (pending shipping containers) and Settings (manager mapping) (Roster p.7, p.20) ⚠ open question OI-27
- Orders: order-line snapshot, divergence read, per-line pending update (Orders Epic E), roster↔order join for Team Gear column and gear drawer, reminder channel (Roster p.10-11, p.20, p.22)
- Roster-Optional Architecture: Roster Bank capture storage/commit, storefront team selector (Roster p.8, p.14, p.22)
- Storefront: PDP and checkout jersey-number pickers consume the per-roster taken-number set; checkout address write-back (Roster p.12-13, p.22)
- Products tab: shared product card and product detail components; team↔product assignment join read in both directions; same team-code bindings; optimistic UI reconciled with server (Roster p.16, p.21)
- Settings: Team & Roster → Roster Rules (league duplicate default, mixed state); Distribution & Fulfillment (mapping); manager records (Roster p.8-9, p.12, p.21)
- Store creation: Step 1 Basics Epic D1 (duplicate default field); Step 2 Divisions & Teams (shared structure editor, manual + CSV paths; atomic commit with the store on deploy) (Roster p.8, p.13, p.21-22)
- Map service: backend address verification for player and manager addresses, shared with the freight gate (Roster p.12, p.21)
- Email: roster template share, store-link sends, Send Reminder, per-player invite links (Roster p.9-10, p.22) ⚠ open question OI-13
- Home: C-05 routes into a store-wide player view; C-06/C-07/Epic H/Epic D need scoped My Team(s) routes and resume events (Home Epic C, D, H) ⚠ open question OI-28, OI-38
- Analytics: League Revenue filter by team/division reads the structure (Analytics Epic C) ⚠ open question OI-40
- Customize New Product: same creation wizard; step numbering differs (Customize §Persona, A8) ⚠ open question OI-36
- Launch: launch email to "all players" (Launch §Launch confirmation) ⚠ open question OI-29

## 7. Non-Functional
- Server-side enforcement: pending update refused after submission; duplicate-number backstop for CSV and direct entry (Roster p.20, p.22)
- Derived reads, not stored flags: divergence and grandfathered-duplicate condition (Roster p.20, p.22)
- Immediate UI updates: number release, assignment feedback without reload, modal edits reflected in strips/cards (Roster p.10, p.16-17)
- Single shared component for structure editor and product card/detail page to prevent drift (Roster p.20-21)
- No stated latency, volume, or audit-log targets ⚠ open question OI-30

## 8. Acceptance Criteria
- AC-1: A store launches with no roster, and a team can exist with no roster (Roster p.2, p.6)
- AC-2: A player record saves with only First and Last Name; email/phone are validated only when present (Roster p.3, p.22)
- AC-3: For a player with no email or phone, Share Team Store Link is copy-only and Send Reminder is disabled with a reason (Roster p.6, p.10)
- AC-4: League home shows stats header, canvas, standalone list, New Team / New Division; Single-Team opens directly to the player table (Roster p.7)
- AC-5: Deleting a division turns its teams into standalone teams with rosters and players intact (Roster p.8)
- AC-6: Team codes are never editable and never shown during store creation (Roster p.8, p.21)
- AC-7: The add row contains all schema fields (address only for Direct-to-Home) and a valid record appears instantly on confirm (Roster p.9)
- AC-8: CSV import reports errors per row and cell, skips only invalid rows, imports valid rows, and shows valid/skipped counts before confirm (Roster p.9)
- AC-9: A CSV row missing email/phone imports; a row with a malformed email is skipped (Roster p.9)
- AC-10: Duplicate numbers in a CSV are errors only on rosters that disallow duplicates (Roster p.9, p.22)
- AC-11: Editing Jersey Number or Name on Jersey for a player with orders saves with no block, modal, or warning (Roster p.11)
- AC-12: After such an edit, the order line still holds the purchased values (Roster p.11, p.20)
- AC-13: A divergent item shows "ordered as #X · roster says #Y"; on a pending order it offers one per-line update; on a submitted order it shows no action (Roster p.11)
- AC-14: The update API rejects calls for submitted orders and no bulk endpoint exists (Roster p.20)
- AC-15: Divergence does not change team-gear completion, block submission, affect launch, or create a Home card (Roster p.11)
- AC-16: Clear Roster removes all players, keeps the roster, toasts "Roster cleared — n players removed", and is disabled when empty (Roster p.10)
- AC-17: Delete Roster removes the roster but keeps the team, and is not offered on a Single-Team store's only roster (Roster p.10)
- AC-18: Clear/Delete Roster leave pending captures and product assignments intact (Roster p.10)
- AC-19: Deleted, cleared or moved players' numbers become selectable immediately (Roster p.10, p.13, p.17)
- AC-20: Direct-to-Home stores show the address field and Player Address column; other stores show neither (Roster p.12)
- AC-21: A checkout address fills a blank roster address with a "From checkout" badge; blank shows "Awaiting checkout" (Roster p.12)
- AC-22: One order never triggers both write-back and a Roster Bank capture (Roster p.12)
- AC-23: Setting the league-level duplicate control writes every roster; a roster overridden afterward keeps its value; Settings shows mixed state when they differ (Roster p.12-13; Settings Epic F)
- AC-24: On a no-duplicates roster, numbers held by players or pending captures are disabled on the add row, edit drawer, PDP and checkout, and the player's own number stays selectable when editing (Roster p.13)
- AC-25: On a duplicates-allowed roster, all numbers are selectable and in-use numbers are labelled "duplicate" (Roster p.13-14)
- AC-26: Turning duplicates off with existing shared numbers saves without a sweep, shows the exception line with count, and blocks a third player from that number (Roster p.14)
- AC-27: The exception line clears automatically when a sharing player is deleted, moved, renumbered, or duplicates are turned on (Roster p.14)
- AC-28: Committing a capture creates an ordinary player record at the captured values, and creates a roster if the team had none (Roster p.15)
- AC-29: Captures are excluded from the player table and player counts; pending-capture counts show on team/division cards and the stats header (Roster p.14-15)
- AC-30: A League team with no products shows the amber "No products yet" state (Roster p.15)
- AC-31: Dropping a drawer product on a division header creates a division-wide assignment shown as "via division" on its teams; strips, pills and coverage table update without reload (Roster p.17)
- AC-32: The hover card and detail modal are the Products-tab components; saving in the modal updates the catalog record and the canvas immediately (Roster p.16, p.21)
- AC-33: No product surfaces render on Single-Team stores or in the creation step (Roster p.8, p.15)
- AC-34: Moving a player releases their number on the origin roster; a destination conflict prompts for a new number or no number (Roster p.17-18)
- AC-35: A player with team-gear orders cannot be moved, with the reason shown; bulk moves name each blocked player (Roster p.18) ⚠ open question OI-22
- AC-36: Moving the last player leaves an empty roster in place (Roster p.18)

## 9. Dependencies & Assumptions
- Orders must store personalization as order-line fields, not roster references; this tab's permissive edits depend on it absolutely (Roster p.20; Orders §Dependencies)
- Orders pending window (Epic B) defines when the update action is available (Roster p.11, p.20)
- Roster-Optional Architecture spec (not provided) owns capture, commit, pre-grouping and the storefront team selector (Roster p.14, p.21)
- Products tab spec (not provided) owns catalog records, assignment bindings and permissions (Roster p.15, p.21)
- Step 1 Basics and Step 2 Divisions & Teams specs (not provided) host the shared structure editor and duplicate default (Roster p.8, p.13)
- Store General Settings Epic A3/A4 (Settings) owns fulfillment mapping and the three-state pattern reused here (Roster p.8, p.14)
- Team-database integration with roster sync and member/role management (Roster p.20) ⚠ open question OI-25
- Move player block pending decision with Orders on freight routing (Roster p.18) ⚠ open question OI-22
- Store lifecycle (Draft/Open/Closed/Archived) owned by Lifecycle; Closed keeps the workspace editable, Archived makes it read-only (Lifecycle §Behavior matrix) ⚠ open question OI-33
- Post-launch lock list in Settings Epic B is TBD and may cover Team & Roster controls (Settings Epic B) ⚠ open question OI-34

## Open items
Full questions: output/2026-10-19-roster-management/clarification-questions.md (consolidated by consolidator-roster-management).
- ⚠ OI-1 Does Name on Jersey also write back from checkout? (p.5 vs p.12)
- ⚠ OI-2 Size is snapshotted but missing from the player schema (p.1, p.20)
- ⚠ OI-3 Jersey number 0 vs 00; grid range (p.4, p.13)
- ⚠ OI-4 Phone format and Name on Jersey character set (p.4-5)
- ⚠ OI-5 Where division sport is set; default brand color (p.3, p.8, p.21)
- ⚠ OI-6 Team code algorithm, uniqueness and stability (p.8, p.21)
- ⚠ OI-7 Division delete: division-scoped products, mapping, containers (p.8)
- ⚠ OI-8 Moving a team into/out of/between divisions (p.8)
- ⚠ OI-9 Fulfillment mapping for standalone teams and Single-Team stores (p.8, p.21)
- ⚠ OI-10 Deleting a team or player with orders, captures or assignments (p.8, p.10)
- ⚠ OI-11 CSV import: append/replace, duplicate scope, list/address columns, limits (p.9)
- ⚠ OI-12 Roster "name" attribute undefined (p.10)
- ⚠ OI-13 Phone-only players: is there an SMS channel? (p.6, p.10, p.22)
- ⚠ OI-14 Can the pending update rewrite the shipping address? (p.12 vs Orders Epic E)
- ⚠ OI-15 Matching key for write-back vs capture (p.12)
- ⚠ OI-16 League duplicate default value, re-apply semantics, Single-Team, toggle location (p.12-13)
- ⚠ OI-17 Duplicate rule for a team with no roster at PDP/checkout (p.3, p.12)
- ⚠ OI-18 When a shopper's number is reserved; concurrent picks (p.13)
- ⚠ OI-19 How captures count toward team-gear completion (p.15)
- ⚠ OI-20 Division count pill: distinct count vs sum (p.15)
- ⚠ OI-21 Forward inheritance of division assignments: decided (p.17) vs open (p.21)
- ⚠ OI-22 Move refusal for players with orders vs governing rule and Orders (p.18 vs p.2)
- ⚠ OI-23 Move allowed when Active/Closed; activity history (p.18)
- ⚠ OI-24 Move to roster-less team; captures/tracking after move; Single-Team (p.17-18)
- ⚠ OI-25 Role and permission matrix; team manager scope; league director (p.2, p.6-7)
- ⚠ OI-26 Divergence surfaces: Team Gear column vs Orders "nothing else" (p.11, p.20)
- ⚠ OI-27 Containers keyed by team vs roster (Orders Epic B)
- ⚠ OI-28 Home C-05 store-wide player view not defined here (cross-spec)
- ⚠ OI-29 Launch email to "all players" with optional roster/contacts (cross-spec)
- ⚠ OI-30 No NFR targets: latency, CSV limits, audit (p.19-22)
- ⚠ OI-31 Fulfillment strip/gate on all stores vs League Ship-to-Manager only (p.8 vs Settings A3, Home C-08)
- ⚠ OI-32 Jersey Number Selection mode (Settings F) missing from this spec (p.13)
- ⚠ OI-33 Archived read-only (Lifecycle E, Settings C) vs edits "at any time" (p.2, p.11)
- ⚠ OI-34 Post-launch lock list may cover Team & Roster controls (Settings B vs p.2, p.14)
- ⚠ OI-35 Terminology: store types, fulfillment name, tab name, "Active" (cross-spec)
- ⚠ OI-36 Which creation step is Step 2: Divisions & Teams vs Products (p.8 vs Customize)
- ⚠ OI-37 Opt-out state missing from Team Gear completion (p.10 vs Home C-05)
- ⚠ OI-38 Deep-link routes and resume events Home needs from My Team(s) (Home deps)
- ⚠ OI-39 Pending-order update has no audit/amendment history decision (p.11 vs Orders E)
- ⚠ OI-40 Revenue attribution after division delete or player move (Analytics C vs p.8, p.17)
