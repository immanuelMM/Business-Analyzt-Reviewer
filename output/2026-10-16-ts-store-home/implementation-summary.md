# Implementation Summary — TS-Store Home (Home Tab)
Sources: input/requirements/TS-Store Home (Home Tab)-161026-011919.pdf (49 pp.; cited below as "TS-Store Home.pdf p.N")

## 1. Scope
**In scope**
- New permanent **Home** tab, first in the store workspace navigation (TS-Store Home.pdf p.8)
- Sections: **Needs your attention** (Epic C), **Recently worked on** resume trail (Epic D), **In your store** summary rail (Epic E) (p.2, p.26-30)
- Panels: **Team Managers** (Epic F), **Brand assets** (Epic G), **League structure directory** (Epic H, League only) (p.30-36)
- Tab-label attention dots; Home as default landing tab; Setup Guide reopen link; Close Report route (p.8-10)
- Copy and vocabulary rules for all Home text (Epic I) (p.36-42)
- Store-level only. A workspace-level equivalent is out of scope (p.9)

**Out of scope** (p.45)
- Cross-store attention ("everything needing me across all my stores")
- Notifications/emails derived from conditions
- Snoozing, dismissing, or assigning conditions
- Full activity/audit log
- Per-rep configuration of which conditions show
- Any Home-side authoring of store state (apart from hosted shared components)
- Configurable landing tab (per rep or per store) in v1 (p.9)
- Fundraising goal / progress bar (p.29-30)
- First-visit-per-tab hints (p.6)
- Hosting the structure editor, Change Team, the Point of Contact mode selector, PoC designation, or Add from Team Database on Home (p.32-35)
- Send Reminder from Home (p.13)
- Team Manager Portal equivalent ⚠ open question OI-1 (p.6)

## 2. Actors & Roles
- **Rep (store owner)**: the primary user, on a single store in any lifecycle state (p.6)
- **Co-managing reps**: each sees only their own resume trail (p.28)
- **Team managers**: no Home surface in this version. If ever added, the resolver must return a permission-filtered condition set ⚠ open question OI-1 (p.6, p.49)
- **Buyers/parents, system**: their writes never create resume events (p.28)

## 3. Business Rules

**Governing rules (apply to everything)**
- BR-1 Home persists no store state. The only new persisted data is the rep-scoped resume event (TS-Store Home.pdf p.3, p.45)
- BR-2 Home may host an existing authoring component but never define one. A hosted editor writes the owning spec's field, with no Home-local copy, full validation, and unshortened consequence disclosures, and the result must be indistinguishable from an edit made on the owning surface. If a component can't meet this, Home routes to it instead (TS-Store Home.pdf p.3)
- BR-3 No second computation. Every count, threshold, and condition is read from the owning service. If Home and a tab disagree, the tab is right (TS-Store Home.pdf p.3, p.47)
- BR-4 No new vocabulary. Use the owning spec's labels (TS-Store Home.pdf p.3)
- BR-5 No enforcement. Home never blocks, gates, or becomes a prerequisite, and never duplicates or contradicts the launch gate or freight gate (TS-Store Home.pdf p.2-3)
- BR-6 New conditions are added only by registering them in the Epic C catalogue (owning spec, tier, trigger, route). A condition with no owning spec can't ship. The catalogue is data, not code branches (TS-Store Home.pdf p.4, p.47)
- BR-7 No guidance or checklist content. No steps-not-taken lists, scores, grades, readiness/completion language, or visit tracking (TS-Store Home.pdf p.5, p.42)

**Severity tiers**
- BR-8 Three fixed tiers per condition: Blocking (red rail, primary button, first), Action (blue rail, secondary button, second), Informational (neutral rail, link or no action, last) (TS-Store Home.pdf p.4) ⚠ open question OI-3
- BR-9 Tiers never escalate over time. Time-based urgency is modelled as separate conditions (TS-Store Home.pdf p.4)
- BR-10 No amber anywhere on Home. Only red, blue, and neutral are used (TS-Store Home.pdf p.4, p.42)
- BR-11 A Blocking card always names who is blocked (the consequence, not the internal state) (TS-Store Home.pdf p.5)
- BR-12 The tier is never shown as a label on the card (e.g. no "BLOCKING" eyebrow) (TS-Store Home.pdf p.41)

**Attention list presentation**
- BR-13 Order is Blocking, then Action, then Informational. Within a tier, a fixed per-condition cost-of-delay rank decides (not recency or count), so the order is identical across renders (TS-Store Home.pdf p.24) ⚠ open question OI-4
- BR-14 Show at most 5 cards plus an "n more" expander. Blocking cards are never collapsed: if more than 5 Blocking conditions hold, all of them render (TS-Store Home.pdf p.24)
- BR-15 One card per condition, not per record. The card states the count (TS-Store Home.pdf p.24)
- BR-16 Oldest age is required on C-01, C-05, and C-06 (e.g. "Oldest placed 3 days ago") (TS-Store Home.pdf p.25) ⚠ open question OI-12
- BR-17 No manual dismiss, snooze, or hide. A card clears only when its underlying state clears (TS-Store Home.pdf p.25)
- BR-18 Each card has exactly one primary action. Two possible resolutions means two conditions, or a route to a surface that offers both (TS-Store Home.pdf p.25) ⚠ open question OI-3
- BR-19 Empty state: say plainly that nothing needs the rep and name the current lifecycle state. Never add filler or tips (TS-Store Home.pdf p.6, p.25)
- BR-20 A condition must be false on a well-run store. Anything true in the common case can't be registered (TS-Store Home.pdf p.24, p.44)
- BR-21 Conditions already enforced at save time (uncategorized products, League TR/TS items with zero team assignment) are never cards (TS-Store Home.pdf p.19)
- BR-22 No card is rendered disabled (TS-Store Home.pdf p.26)

**Condition catalogue** (Condition = internal name, never card copy; Tier; Trigger; Resolves to; Clears when) (TS-Store Home.pdf p.10-11) ⚠ open question OI-5
- BR-23 C-01 Pending orders awaiting submission. Action. ≥1 order pending, not submitted to factory (Order Mgmt A). Goes to Orders → Pending Orders. Clears when all are submitted or cancelled (TS-Store Home.pdf p.11)
- BR-24 C-02 Shipping group below MOQ. Informational. ≥1 pending group below its minimum (Order Mgmt B). Goes to Orders → Pending Orders, scrolled to the group. Clears when MOQ is reached or the group is submitted short (TS-Store Home.pdf p.11) ⚠ open question OI-13
- BR-25 C-03 Manager unassigned on a division/team with pending orders. Blocking. ≥1 pending group whose group/team manager is unassigned (Order Mgmt B; Settings A3). Goes to Settings → Distribution & Fulfillment with the affected division auto-opened. Clears when every assigned group has a resolved manager. Copy must name the specific divisions/teams (TS-Store Home.pdf p.12-13, p.45)
- BR-26 C-04 No ship-to destination address. Blocking. Fulfillment method is Ship to Team Manager and the address is empty (Settings A3). Goes to Settings → Distribution & Fulfillment → Fulfillment Method. Clears when a verified address exists (TS-Store Home.pdf p.12) ⚠ open question OI-8
- BR-27 C-03 and C-04 stay separate cards, even though both can hold at once (TS-Store Home.pdf p.13)
- BR-28 C-05 Rostered players missing required gear. Action. ≥1 committed player record with un-ordered Team Required gear (Order Mgmt C; Roster 2). Goes to My Team(s) → store-wide player view filtered to incomplete. Clears when all gear is ordered or opted out. Players who opted out ("I already own this") count as satisfied. The detail line carries the "no email or phone" caveat (TS-Store Home.pdf p.12-13, p.16)
- BR-29 C-06 Roster Bank captures awaiting review. Action. ≥1 pending capture against any team (Roster 5). Goes to My Team(s) → store-wide Roster Bank view. Clears when every capture is committed or dismissed (TS-Store Home.pdf p.13)
- BR-30 C-07 Teams carrying no products (League only). Action. ≥1 team with zero products, direct or via division (Roster 6). Goes to the My Team(s) canvas or the division's per-team coverage table. Clears when every team has ≥1 product (TS-Store Home.pdf p.14-15) ⚠ open question OI-20
- BR-31 C-08 Divisions/teams with no fulfillment manager (League, Ship-to-Manager only). Action. ≥1 division or team "Not assigned" (Roster 0). Goes to Settings → Distribution & Fulfillment. Clears when every division/team has an effective manager. C-03 suppresses C-08 for the same division (TS-Store Home.pdf p.14-15) ⚠ open question OI-10
- BR-32 C-25 is retired (folded into C-05). Its ID is never reused (TS-Store Home.pdf p.14, p.17)
- BR-33 C-09 No visible products, store can't launch (Draft only). Blocking. Catalog holds zero visible products (Products base; Lifecycle A). Goes to Products → Catalog. Clears when ≥1 product is visible. Home offers no launch action (TS-Store Home.pdf p.17, p.43)
- BR-34 C-10 Products held by the render gate. Action. ≥1 decorated product in Render pending (Products H). Goes to Products → Catalog filtered to those items. Clears when the render set exists or the item is undecorated (TS-Store Home.pdf p.17)
- BR-35 C-11 Render failure, retry required. Blocking. ≥1 product whose render generation failed (Products H). Goes to the product's detail page. Clears when a retry succeeds (TS-Store Home.pdf p.18-19)
- BR-36 C-12 Bundles in the Incomplete state. Blocking. ≥1 bundle with a single member (Products J). Goes to the bundle's detail page → Members. Clears when the bundle regains a second member or is deleted (TS-Store Home.pdf p.18-19)
- BR-37 C-13 Products with unconfirmed application sizing. Action. ≥1 product whose sizing confirmation is incomplete (Products F). Goes to the product detail page → Application Sizing. Clears when confirmed on every row. Copy must never say customers can't order (TS-Store Home.pdf p.18-19)
- BR-38 C-27 Products orphaned by a deleted category. Action. ≥1 product whose category was deleted at workspace level (Product Categories D; Products Tab). Goes to Products → Catalog filtered to the affected items. Clears only when they are re-filed under an existing category; recreating a same-name category doesn't clear it (TS-Store Home.pdf p.18-19)
- BR-39 C-14 Ordering window closing soon. Informational. Store is Open with a set window and the days-left pill is in its urgent range (Settings E; pill urgent at final 7 days). Goes to Settings → Schedule & Status → Edit Store Schedule. Clears when the window closes or the date moves out of range (TS-Store Home.pdf p.20, p.22)
- BR-40 C-15 Window closing with players missing gear. Action. C-14 and C-05 triggers both hold. Goes to My Team(s) → incomplete-player view. Clears when either trigger clears. Text says it fires at 14 days (TS-Store Home.pdf p.20, p.22) ⚠ open question OI-7
- BR-41 C-14 and C-15 are always two separate cards (TS-Store Home.pdf p.22)
- BR-42 C-16 Store is Draft and ready to launch. Action. Draft with ≥1 visible product (Lifecycle A). Goes to the workspace header → Launch control. Clears when the store goes Open (TS-Store Home.pdf p.20, p.43)
- BR-43 C-17 Store closed, Close Report not yet viewed. Informational. Closed and this user hasn't seen the report for this close event (Lifecycle H). Goes to Reports → Store Close Report. Clears when the report is viewed or dismissed (TS-Store Home.pdf p.21) ⚠ open question OI-21
- BR-44 C-18 Orders still in production after close. Informational. Closed with ≥1 order not yet shipped. Goes to Orders → All Orders. Clears when every order is Delivered or cancelled (TS-Store Home.pdf p.21)
- BR-45 C-19 Order-window coverage gap (per-team-code scheduling only). Action. Scheduler gap detection flags ≥1 day with no team open (Settings E). Goes to Settings → Schedule & Status → Order Window Scheduler. Clears when the gap is closed or accepted (TS-Store Home.pdf p.21)
- BR-46 C-20 Closed with unsettled payment. Action. ≥1 order in the window with an open PO (Lifecycle edge cases). Goes to Orders → All Orders, filtered. Clears when the PO settles (TS-Store Home.pdf p.22)
- BR-47 C-21 Managers left behind by a team re-bind. Action. ≥1 manager record whose source team is no longer the connected team (Settings A1). Goes to Settings → General → League/Team Manager Information. Clears when records are kept or removed (TS-Store Home.pdf p.22-23)
- BR-48 C-22 Left-behind manager still holds portal access. Blocking. C-21 trigger plus an active/pending invite (Settings A1, A2b). Goes to Settings → People & Access. Clears when access is revoked or the record is confirmed kept (TS-Store Home.pdf p.23-24)
- BR-49 C-23 Team Fundraising disabled with items still collecting. Informational. Fundraising read resolves to disabled-with-exemptions (Settings A4). Goes to Products → Catalog filtered to exempted items. Clears when no exempted item remains or fundraising is re-enabled. Must not imply an error (TS-Store Home.pdf p.23-24)
- BR-50 C-24 Pending team-manager invites never activated. Informational. ≥1 invite in "Invited · not logged in" beyond a 7-day threshold (Settings A2b). Goes to Settings → People & Access. Clears when the invite activates or is revoked (TS-Store Home.pdf p.23-24) ⚠ open question OI-11 ⚠ open question OI-20

**Card population by store state/type** (gating lives in the resolver, not the view) (TS-Store Home.pdf p.25-26, p.49) ⚠ open question OI-6
- BR-51 Draft: C-04, C-08, C-09, C-16, C-10 to C-13. No order, Roster Bank, or window conditions (TS-Store Home.pdf p.25)
- BR-52 Open: full catalogue except C-09 and C-16 (launch-specific) and C-17, C-18, C-20 (close-specific) (TS-Store Home.pdf p.25)
- BR-53 Closed: most of the catalogue including Action tier, plus C-17, C-18, C-20. C-14 can't hold (TS-Store Home.pdf p.25-26)
- BR-54 Archived: no cards. The resolver returns an empty set with an archived reason code, and the section states the store is archived and read-only (TS-Store Home.pdf p.26, p.49)
- BR-55 Individual Team stores: C-07 and C-08 can't hold and aren't evaluated. Always-on stores: C-14, C-15, C-19 can't hold and aren't evaluated. League and Pop-up: full catalogue (TS-Store Home.pdf p.26, p.49)

**Navigation & landing**
- BR-56 Six tabs in this order: Home, My Team(s), Products, Orders, Reports, Settings. Home is present in every state, store type, and distribution format, and is never hidden, disabled, or conditional (TS-Store Home.pdf p.8)
- BR-57 A tab label shows a presence dot (no count) when ≥1 Blocking condition resolves to that tab. Informational never shows a dot (TS-Store Home.pdf p.8-9, p.48) ⚠ open question OI-2
- BR-58 Home is the default landing tab when no deep link specifies a tab. Deep links always win (TS-Store Home.pdf p.9)
- BR-59 The workspace header (status chip, storefront URL, Preview Store, Setup Guide entry) stays where it is. Home may echo it but never authors it (TS-Store Home.pdf p.9)
- BR-60 When their triggers are met, the Setup Guide and Close Report sequences present over Home, and Home is available on dismissal. They never fire together, so no ordering logic between them is built. Home reads and writes neither seen-flag (TS-Store Home.pdf p.10, p.49) ⚠ open question OI-21
- BR-61 A Setup Guide reopen link is always present. It behaves like the header control: lands on card 1, no forced pacing, regardless of seen-state (TS-Store Home.pdf p.10)
- BR-62 Closed/Archived stores show a route to the Close Report. Availability and disabled copy are owned by Lifecycle Epic H (TS-Store Home.pdf p.10)

**Recently worked on (resume trail)**
- BR-63 The section heading is "Recently worked on". It's a location aid, never a to-do list, completion, or readiness indicator. Row actions return the rep ("Open", "Go to Products"), never "Resume" (TS-Store Home.pdf p.26-27, p.29)
- BR-64 Qualifying writes are the rep's own authored writes, against this store, on a resumable surface with a stable deep link. Reads, filters, sorts, searches, tab switches, other stores, workspace scope, and other actors' writes don't qualify (TS-Store Home.pdf p.27-28) ⚠ open question OI-18
- BR-65 Buyer and system writes never qualify (orders, checkout write-backs, Roster Bank captures, auto-close, render completion). Neither do destructive actions (deletes, roster clears) (TS-Store Home.pdf p.28)
- BR-66 A bulk action records one event referencing the operation (e.g. "imported 40 players") (TS-Store Home.pdf p.28)
- BR-67 Collapse by surface + entity, keeping the most recent timestamp (TS-Store Home.pdf p.28)
- BR-68 Show 5 rows by default, most recent first, expandable to 15. Events expire after 30 days (TS-Store Home.pdf p.28)
- BR-69 The trail is always per rep (TS-Store Home.pdf p.28)
- BR-70 The label is composed at read time from the entity reference plus field group (so renames show), never stored as prose (TS-Store Home.pdf p.27)
- BR-71 Rows whose target was deleted are silently dropped. If there are no events the section is absent (not empty). On Archived stores the trail is read-only and routes to read-only surfaces (TS-Store Home.pdf p.29)

**In your store (summary rail)**
- BR-72 One row per tab, in nav order: My Team(s), Products, Orders, Reports. Labels match the tab exactly (first row "My Team(s)", never "Rosters") (TS-Store Home.pdf p.29) ⚠ open question OI-9
- BR-73 Each row has the tab's headline count plus its attention overlay where one exists (e.g. "148 players · 5 Roster Bank captures", "24 orders · 4 to submit"). The overlay is the same figure as the Epic C card (TS-Store Home.pdf p.29)
- BR-74 Roster entries are always "players". Player counts exclude captures. Catalog and order counts follow their owning tabs (TS-Store Home.pdf p.29) ⚠ open question OI-15
- BR-75 Rows always render, including at zero. No revenue/profit/fundraising breakdowns. Total raised in the window may be shown as a bare figure (no bar, no denominator) (TS-Store Home.pdf p.30)

**Team Managers panel**
- BR-76 Reads and writes the same manager collection as Settings Epic A2c, Step 1, and coach import. There's no Home-local record (TS-Store Home.pdf p.30)
- BR-77 Title is "League Manager Information" (League) or "Team Manager Information" (Individual Team). Rows show Name, Email, Phone, Contact Preference (TS-Store Home.pdf p.30)
- BR-78 Point of Contact tag: if ≥1 PoC channel is on Team Manager mode, the designated record is tagged "Point of Contact", even when it's the only record. If only one channel is, the tag names it ("Point of Contact · email"). If both channels are Salesperson/Custom, nothing is tagged and the panel foot states who buyers see, with a route to the Store Point of Contact setting. Never use "Primary" or "Primary Contact" (TS-Store Home.pdf p.30-31) ⚠ open question OI-16
- BR-79 The designation is shown read-only. Changing it routes to Settings → General (TS-Store Home.pdf p.32)
- BR-80 Add/Edit/Remove use the existing manager edit modal with its full field set (First Name, Last Name, Email, Phone Number, Street Address, Contact Preference) and full validation (TS-Store Home.pdf p.31-32)
- BR-81 Exactly one designated record at all times. Removing the designated record is blocked, with the reason and a route to Settings → General. Changes to the designation are disclosed before save (TS-Store Home.pdf p.32)
- BR-82 Adding a manager never changes the designation. The first record on a new store becomes PoC by being the only one (TS-Store Home.pdf p.32)
- BR-83 No access granted. The modal opened from Home states that a manager record grants no portal access and links to Settings → People & Access. Home never creates, infers, or revokes an entitlement, and removal never touches the invite table (TS-Store Home.pdf p.32-33, p.48)
- BR-84 Invite is offered on every row with an email, routing to People & Access. If the person already has an invite, the row shows its status ("Portal access active" / "Invited, not signed in") instead of the button (TS-Store Home.pdf p.31-32)
- BR-85 Removing a manager with an active/pending invite: the confirmation says access remains until revoked, and links to People & Access (TS-Store Home.pdf p.33)
- BR-86 Editing the primary's email/phone while a channel is on Team Manager mode updates the storefront footer live, and the modal says so before save (TS-Store Home.pdf p.33)
- BR-87 No PoC mode selector and no Add from Team Database on Home (route to Settings → General) (TS-Store Home.pdf p.33)
- BR-88 The panel renders in every state (no post-launch lock). It's read-only on Archived stores (TS-Store Home.pdf p.33)

**Brand assets panel**
- BR-89 Shows Team Logo and Team Colors (Step 1/Settings components) and Store Theme Color (Prolook color picker, no bespoke picker). Links to the Team artwork library (not embedded) and states its Team-level scope (TS-Store Home.pdf p.33-34)
- BR-90 The theme swatch shows its source (Team default / Custom). Reset to team color is available on Custom and re-arms re-derivation. Helper copy says the color applies "to buttons and accents only" (TS-Store Home.pdf p.34)
- BR-91 The source flag must be preserved on read/write and never inferred from the value (TS-Store Home.pdf p.48-49)
- BR-92 Change Team isn't hosted; route to the Edit Store Details modal (TS-Store Home.pdf p.35)
- BR-93 Editable in every state, including after launch. Read-only on Archived stores (TS-Store Home.pdf p.35)

**League structure directory**
- BR-94 League stores only. It doesn't render on Individual Team stores, and everything else on Home is unchanged (TS-Store Home.pdf p.35)
- BR-95 Read-only. It must not instantiate the structure editor (TS-Store Home.pdf p.35, p.49)
- BR-96 Header has divisions · teams · players counts (same as the My Team(s) stats header). Then division rows with nested teams, then standalone teams. Each row has a player count and a pending-capture count where >0 (TS-Store Home.pdf p.35-36)
- BR-97 Divisions are always collapsed (no size threshold). Expansion is per session and not persisted. The panel has a bounded height and scrolls internally (TS-Store Home.pdf p.36)
- BR-98 No product thumbnails, product-count pills, coverage tables, catalog drawer, or team codes (TS-Store Home.pdf p.36)

**Copy & vocabulary**
- BR-99 Card copy comes from Epic I only, never from the condition name. Rules: name the consequence and then the action; no internal state names; say who is affected (TS-Store Home.pdf p.11, p.36) ⚠ open question OI-19
- BR-100 Banned on cards: "Freight routing unresolved", "Below MOQ", "Held by the render gate", "Unconfirmed application sizing", "Team re-bind / left-behind records", "Order-window coverage gap", "Submission blocked / cannot be submitted", "Container", "Primary"/"Primary Contact", "Orphaned products / dangling category reference", and the word "blocked" (TS-Store Home.pdf p.37, p.41)
- BR-101 Say "group", never "container", anywhere on Home. Say "Submit", never "approve" (TS-Store Home.pdf p.13, p.37)
- BR-102 Bound terms (as of 2026-09-03): Stock Vault, Catalog Templates, Customizer, Other stores, My Team(s), Roster Bank, Pending Orders, Submit, Open (not Active), Closed (not Paused/On Hold), Draft, Archived, Point of Contact. Copy must be re-checked whenever labels change (TS-Store Home.pdf p.41-42)
- BR-103 Status labels are Draft/Open/Closed/Archived only. Never render "Active" (TS-Store Home.pdf p.42)
- BR-104 Never scold ("you forgot", "overdue"), and never use red on Informational (TS-Store Home.pdf p.42)
- BR-105 Card headline / detail / button per condition, with counts and names interpolated (TS-Store Home.pdf p.38-41) ⚠ open question OI-14:
  - C-01 "n pending orders to submit" / "Oldest placed n days ago — orders reach the factory after you submit" / Go to Pending Orders
  - C-02 "Division 3 is under the minimum to ship" / "n more items needed, or submit as-is and a minimum-quantity fee applies" / View group
  - C-03 "Division 3 and Division 7 need a manager before their orders can ship" / "n orders are waiting on this" / Assign managers
  - C-04 "Add a delivery address before orders can ship" / "Orders ship to the team manager, and there's no address on file yet" / Add address
  - C-05 "n players haven't ordered their required gear" / "Window closes date — n of them have no email or phone, so a reminder won't reach them" / View players
  - C-06 "n Roster Bank captures awaiting review" / "Oldest captured n days ago — banked from storefront orders, not yet on a roster" / Open Roster Bank
  - C-07 "n teams carry no products" / "U10 Red, U14 White — there's nothing to buy for these teams yet" / Review coverage
  - C-08 "n divisions or teams have no manager assigned" / "Orders for them can't ship until someone's assigned" / Assign managers
  - C-09 "Add a product before you launch" / "Customers need at least one thing to buy" / Go to Products
  - C-10 "n products are still generating images" / "Customers can't see them until the images are ready" / View products
  - C-11 "Images failed for n products" / "They can't go on the storefront until this is retried" / Retry
  - C-12 "n bundles have only one item left" / "They've come off the storefront — add an item or delete the bundle" / Fix bundles
  - C-13 "Confirm sizing for n products" / "Sizing hasn't been confirmed on every decoration" / Confirm sizing
  - C-14 "Ordering window closes date — n days left" / "Change the close date from the store schedule" / Edit Store Schedule
  - C-15 "n players still haven't ordered and the window closes in n days" / "Send reminders where you have contact details, or move the close date" / View players
  - C-16 "Your store is ready to launch" / "Customers can start ordering as soon as you do" / Launch store
  - C-17 "Your close report is ready" / "Totals, fundraising, and what shipped" / View report
  - C-18 "n orders are still being made" / "They'll ship as they're finished — nothing needed from you" / View orders
  - C-19 "Some days have no team able to order" / "n days in the window aren't covered by any team's schedule" / Review schedule
  - C-20 "n orders haven't been paid for" / "Payment is still open on these" / View orders
  - C-21 "n manager records are from the team you switched away from" / "Keep them or remove them" / Review managers
  - C-22 "Someone from the previous team can still see this store" / "Name has access to this store's reports and rosters" / Review access
  - C-23 "Fundraising is off, but n products still add to it" / "This is fine if it's intentional" / View products
  - C-24 "n invited managers haven't signed in yet" / "Invited n days ago" / Review invites
  - C-27 "n products aren't in a category" / "A category they were in was deleted — shoppers can still buy them, but can't filter or search for them" / Re-file products

## 4. Data
- **No new store state.** Home reads existing records only (p.3, p.47)
- **Resume event (new, the only DB change):** acting rep, store, surface key (the existing deep-link key), optional entity reference, field-group or operation identifier, and timestamp. Written on opt-in qualifying writes only. Collapsed on read (surface + entity, most recent wins), expired on read (>30 days), filtered to the requesting rep. No stored label (p.27, p.48-49) ⚠ open question OI-18
- **Resolver output per condition:** condition ID, count, oldest-affected timestamp (where applicable), tier, resolution route. Plus per-tab Blocking roll-up for the dots, and an archived reason code (p.47-49)
- **Fixed per-condition rank** (within-tier order) is part of the catalogue data (p.24) ⚠ open question OI-4
- **Existing data read/written (owned elsewhere):** manager collection with its single-primary invariant (Settings A2c); invite status (Settings A2b, People & Access); PoC channel modes (Email/Phone: Team Manager / Salesperson / Custom) (Settings A2); Team Logo, Team Colors, Store Theme Color plus source flag (Settings A/I, Step 1 D); division/team/roster structure with player and pending-capture counts (Roster Mgmt) (p.30-36, p.48-49)

## 5. Flows
- **Workspace entry:** if the Setup Guide or Close Report trigger holds, the sequence presents over Home, and Home shows on dismissal. Otherwise, a deep link opens its target, or else Home opens (p.9-10)
- **Home render:** the resolver evaluates conditions progressively with Blocking predicates first, gated by store state/type. Cards are sorted and capped. The rail, resume trail, panels, and Setup Guide link render (p.47, p.49)
- **Card action:** deep link to the owning surface, scoped/filtered where the owning spec supports it. My Team(s) targets open at the entity with the containing division auto-opened and breadcrumbs intact (p.15, p.42, p.48)
- **Resume:** a qualifying write commits, then an event is recorded. On render: collapse, expire, filter to rep, compose labels, drop deleted targets, show 5 (expand to 15) (p.27-29)
- **Add manager:** open the shared modal (with no-access disclosure) and save to the shared collection. Invite routes to People & Access (p.31-32)
- **Remove manager:** blocked if it's the designated record (route to Settings → General). If the person has an invite, the confirmation states access remains, with a link (p.32-33)
- **Change PoC / Add from Team Database / Change Team:** route to Settings → General or Edit Store Details (p.32-35)
- **Directory click:** division opens that division; team opens the team detail with the division auto-opened (p.36)
- **Archived store:** attention section states archived/read-only with no actions. Rail, trail, panels, and directory are read-only (p.26, p.29, p.33, p.35-36)

## 6. Integrations
Internal only. Home reads the owning services' own predicates (p.47):
- Order Mgmt: pending-order query, MOQ evaluation, freight-gate resolution
- Products: render-state read, Incomplete-bundle flag, orphaned-category state
- Lifecycle: launch gate's visible-product count, Close Report seen flag, store state
- Settings: three-state fundraising read, days-left derivation, coverage-gap analysis, invite-status read, re-bind source-team resolution
- Roster Mgmt: roster↔order join, capture counts, coverage aggregate

Deep-link schemes are reused, never new (p.48):
- Settings section keys (must stay stable)
- My Team(s) division-scoped jump-ins with auto-open
- Products catalog scroll-to-and-focus
- Orders sub-tab and filter state

Shared components hosted:
- Manager edit modal
- Team Logo drop zone and Team Colors control
- Prolook color picker
- Setup Guide reopen path

No external systems, notifications, or emails (p.45).

## 7. Non-Functional
- **Performance:** the resolver runs on every workspace entry and must not make opening a store slow. Resolution is progressive with Blocking first (decided over synchronous resolution and short-TTL caching). Heavy predicates to watch: C-05 roster↔order join, C-07 coverage aggregate, C-23 catalog-wide fundraising read (p.47)
- **Consistency:** Home counts must exactly match the owning tabs (target: zero disagreements) (p.44, p.47)
- **Security/access:** no code path from Home may create, infer, or revoke portal entitlement (p.48)
- **Determinism:** same store state means same card order (p.24, p.42)
- **Layout:** the directory has a bounded height so it can't push the attention list off-screen (p.36, p.49)
- **Metrics instrumentation** (p.45-47):
  - Condition resolution within a session, time-to-resolve per condition, C-03/C-04 dwell time
  - Home-only sessions, click-through per condition, cards per session, empty-list share, expander open rate
  - Resume click-through, clicked rows by age/position, resume clicks targeting My Team(s), omitted resume rows
  - Time to reach a team, workspace re-entries
  - Manager adds by source, same-session invites, theme/logo edits by source, directory clicks by depth
  - Send Reminder attempts with no channel, count-disagreement reports, related support contacts
  - Launch with/without visiting Home, Setup Guide reopens by entry point

## 8. Acceptance Criteria
- AC-1 When a rep opens a store workspace, the Home tab is present and first in the navigation (TS-Store Home.pdf p.42)
- AC-2 In every state, type, and distribution format, Home is present and enabled. Five tabs never render (TS-Store Home.pdf p.42)
- AC-3 In every state, Needs your attention and In your store both render, and neither is ever hidden or disabled (TS-Store Home.pdf p.42)
- AC-4 The rail's first row is labelled "My Team(s)", and roster entries are counted as players (TS-Store Home.pdf p.42)
- AC-5 No amber is used anywhere on Home (TS-Store Home.pdf p.42)
- AC-6 When the Setup Guide or Close Report trigger is met on entry, the sequence presents over Home and Home is available on dismissal (TS-Store Home.pdf p.42)
- AC-7 Every card maps to a registered Epic C condition. No unregistered condition renders (TS-Store Home.pdf p.42)
- AC-8 Cards are ordered Blocking, Action, Informational, identically on every render for the same state (TS-Store Home.pdf p.42)
- AC-9 With more than 5 conditions, the top 5 render plus an expander, unless more than 5 are Blocking, in which case all Blocking cards render (TS-Store Home.pdf p.42)
- AC-10 A card's count exactly matches the owning tab's count (TS-Store Home.pdf p.42)
- AC-11 A card's primary action lands on the owning surface, scoped/filtered where supported (TS-Store Home.pdf p.42) ⚠ open question OI-17
- AC-12 When the underlying state clears, the card is absent on next render. No other way to dismiss exists (TS-Store Home.pdf p.43)
- AC-13 With zero conditions, the section says so plainly and shows no substitute content (TS-Store Home.pdf p.43)
- AC-14 On an Archived store, the section states archived/read-only and no card carries an action (TS-Store Home.pdf p.43)
- AC-15 On a Draft store with zero visible products, C-09 renders at Blocking tier and no launch action is offered (TS-Store Home.pdf p.43)
- AC-16 On a Draft store with ≥1 visible product, C-16 renders and routes to the header launch control (TS-Store Home.pdf p.43)
- AC-17 A qualifying write records a resume event against the rep, the store, and the existing deep-link key (TS-Store Home.pdf p.43)
- AC-18 Repeated edits to the same entity show one resume event, at the most recent timestamp (TS-Store Home.pdf p.43)
- AC-19 Buyer orders, checkout write-backs, Roster Bank captures, and system events record no resume event (TS-Store Home.pdf p.43)
- AC-20 Co-managing reps each see only their own trail (TS-Store Home.pdf p.43)
- AC-21 A resume row whose target was deleted is omitted, with no error state (TS-Store Home.pdf p.43)
- AC-22 With no qualifying events, the resume section is absent rather than empty (TS-Store Home.pdf p.43)
- AC-23 No completion percentage, readiness score, or setup-progress indicator appears anywhere on Home (TS-Store Home.pdf p.43)
- AC-24 The Team Managers panel lists the same manager collection that Settings and Step 1 write (TS-Store Home.pdf p.43)
- AC-25 With ≥1 PoC channel on Team Manager mode, the designated record is tagged "Point of Contact", including when it's the only record, and never "Primary" or "Primary Contact" (TS-Store Home.pdf p.43)
- AC-26 With only one channel on Team Manager mode, the tag names that channel (TS-Store Home.pdf p.43)
- AC-27 With both channels on Salesperson/Custom, no row is tagged and the panel states who buyers see (TS-Store Home.pdf p.43)
- AC-28 Changing the PoC routes to Settings → General and isn't hosted on Home (TS-Store Home.pdf p.43)
- AC-29 A removal that would leave no designated record is blocked, with the reason and a route to Settings → General (TS-Store Home.pdf p.43)
- AC-30 The manager modal opened from Home is the same modal Settings opens (full fields and validation, no Home variant) (TS-Store Home.pdf p.44)
- AC-31 Add manager is the only add affordance. Add from Team Database isn't offered, and coach import routes to Settings → General (TS-Store Home.pdf p.44)
- AC-32 No card displays its tier as a label (TS-Store Home.pdf p.44)
- AC-33 Every registered condition is false on a store with no outstanding work (TS-Store Home.pdf p.44)
- AC-34 Add manager opens the full existing modal and states that no portal access is granted (TS-Store Home.pdf p.44)
- AC-35 Adding, editing, or removing a manager from Home is indistinguishable from doing it in Settings, and no invite is created, altered, or revoked (TS-Store Home.pdf p.44)
- AC-36 Removing a manager with an active/pending invite shows a confirmation saying access remains until revoked, with a link to People & Access (TS-Store Home.pdf p.44)
- AC-37 Editing the primary's contact details from Home (Team Manager mode) updates the storefront footer without further action, and the modal said so before save (TS-Store Home.pdf p.44)
- AC-38 Brand assets use the existing Step 1/Settings components and the Prolook picker, with no bespoke control, and all three stay editable after launch (TS-Store Home.pdf p.44)
- AC-39 A manager row whose person has an active/pending invite shows that status instead of omitting Invite (TS-Store Home.pdf p.44)
- AC-40 The theme swatch shows Team default/Custom, Reset to team color is available on Custom, and the "buttons and accents only" helper copy is shown (TS-Store Home.pdf p.44)
- AC-41 The Team artwork library is linked with its Team-level scope stated, not reproduced inline (TS-Store Home.pdf p.44)
- AC-42 On League stores, the directory shows divisions with nested teams, standalone teams separately, and the same divisions · teams · players counts as the stats header, with divisions collapsed and the panel bounded in height (TS-Store Home.pdf p.44)
- AC-43 On Individual Team stores, the directory doesn't render and Home is otherwise unchanged (TS-Store Home.pdf p.44)
- AC-44 Selecting a division/team row opens My Team(s) at that entity, with the containing division auto-opened and breadcrumbs intact (TS-Store Home.pdf p.44)
- AC-45 The directory renders no product thumbnails, coverage tables, catalog drawer, or team codes (TS-Store Home.pdf p.44)
- AC-46 Every card headline names the consequence and its button names the action. No internal state names and no banned terms (TS-Store Home.pdf p.45)
- AC-47 Card copy is the Epic I headline, never the Epic C condition name (TS-Store Home.pdf p.45)
- AC-48 The C-03 card names the specific affected divisions/teams, not only a count (TS-Store Home.pdf p.45)
- AC-49 Every label on a card matches the owning spec's current label, and no retired terms appear (TS-Store Home.pdf p.45)
- AC-50 When Home renders, it writes no store state other than the rep-scoped resume event (TS-Store Home.pdf p.45)

## 9. Dependencies & Assumptions
- **Tabbed Store Dashboard shell amendment** so the tab count is no longer fixed at five (Appendix A) (p.8) ⚠ open question OI-16
- **Settings must adopt "Point of Contact"** before Home ships (Appendix A 8e). Also pending: Team Logo/Colors added to the Settings Epic B no-lock list (8d), Add from Team Database on the Settings manager card (8b), and correcting the header chip "Active" (10) (p.31, p.33, p.35, p.42) ⚠ open question OI-16
- **C-27** depends on a Products Tab amendment: the orphaned state must be first-class and queryable, with an error treatment and an addressable filter. Home must not ship C-27 ahead of it (p.48)
- **Owning-tab filters** for C-05, C-10, C-23 (and others) may be new work. Audit before estimating; this is the main unknown cost (p.48) ⚠ open question OI-17
- **Verifications pending:** the Roster Mgmt stats header uses "players" (p.29), and whether reps see the "Incomplete" bundle label (p.41) ⚠ open question OI-15 ⚠ open question OI-14
- **Candidate C-26** (artwork "Needs vector") is not registered until Products Epic I is fleshed out. Out of scope for now (p.35)
- **Role scope** depends on the Team Manager Portal decision (p.6, p.49) ⚠ open question OI-1
- **Default landing on Home** is a design decision, not research-backed. Revisit against the "Home-only sessions" metric (p.9)

## Open items
See the question-consolidator output in output/2026-10-16-ts-store-home/ for full text.
- ⚠ OI-1 Team Manager Portal equivalent: confirm before build (p.6)
- ⚠ OI-2 Nav dot for Action-tier conditions (p.8-9 vs p.48)
- ⚠ OI-3 Informational "no action" vs "exactly one primary action" (p.4 vs p.25)
- ⚠ OI-4 Within-tier rank column missing from the catalogue (p.24)
- ⚠ OI-5 "24 registered conditions" vs 25 active, and C-26 undefined (p.25)
- ⚠ OI-6 Per-state card population table incomplete/ambiguous (p.25-26)
- ⚠ OI-7 C-15 14-day firing vs trigger = C-14 (7 days), and who owns the threshold (p.20-22)
- ⚠ OI-8 C-04 "empty" trigger vs "verified address" clear (p.12)
- ⚠ OI-9 Summary rail excludes Settings, and Reports row content undefined (p.29-30)
- ⚠ OI-10 C-03 suppression of the aggregated C-08 card (p.15, p.24)
- ⚠ OI-11 Who owns the C-24 7-day threshold (p.23-24)
- ⚠ OI-12 C-05 oldest-age basis undefined (p.25, p.38)
- ⚠ OI-13 C-02 single-group copy/route when several groups are below MOQ (p.11, p.38)
- ⚠ OI-14 C-12 "Incomplete" label visibility to verify (p.41)
- ⚠ OI-15 "players" vs "members" in the Roster Mgmt stats header (p.29)
- ⚠ OI-16 Appendix A amendments referenced but missing (pp.8, 31, 33, 35, 42)
- ⚠ OI-17 Owning-tab filters may not exist, unestimated scope (p.48)
- ⚠ OI-18 Qualifying resume surfaces/write types not enumerated (p.27-28, p.48)
- ⚠ OI-19 Missing copy: resume rows, empty/archived states, PoC footer, no-access disclosure, expander (p.29, Epic I)
- ⚠ OI-20 C-24 "blue on Home" vs Informational (neutral) tier (p.5, p.23-24)
- ⚠ OI-21 C-17 needs the Close Report seen flag, which Home is barred from reading (p.21 vs p.10, p.49)
