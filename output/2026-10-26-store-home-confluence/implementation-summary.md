# Implementation Summary — Store Home (Home Tab)

Sources:
- Summarized: `input/requirements/Team-Store-Confluence/Store Workspace/Store Home (Home Tab).md` (Confluence page 4308860929, last modified 2026-10-13, pulled 2026-10-26)
- Cross-checked (not summarized): every other `.md` under `input/requirements/Team-Store-Confluence/`. The main ones were Tabbed Store Dashboard, Launch & Status Controls, Store Status & Lifecycle, Store Settings (Settings Tab), Order Management (Orders Tab), Roster Management (My Team(s) Tab), Product Catalog Management (Products Tab), Store Analytics (Reports Tab), System Modals & Toasts, Step 1 — Basics, Product Categories and Workspace.
- References look like "(Home: Epic C — C1 — Orders)". "Home" means the Store Home page. Other specs are named by their title and section.
- Appendix A is referenced by Home but isn't published anywhere ⚠ open question OI-2.

## Glossary

- **Rep** — the salesperson who owns and runs a team store. This is the only user Home is built for.
- **Store workspace** — the management screen for one store. It holds the tabs (Home, My Team(s), Products, Orders, Reports, Settings).
- **Home tab** — the new first tab. It shows what needs the rep's attention, what they recently worked on, and summary counts.
- **Needs your attention** — the Home section that lists problems that need action. Each problem is a card with one button.
- **Attention card** — one item in "Needs your attention". It is driven by one condition, e.g. "4 pending orders to submit".
- **Condition / C-codes (C-01 … C-27)** — the fixed list of store situations that can produce a card. Each has an ID, e.g. C-14 is the "ordering window closes soon" card. C-25 is retired. C-26 is reserved but not registered.
- **Condition catalogue** — the table in Epic C that registers every allowed condition. A condition that isn't in it can't show a card.
- **Tier** — how serious a condition is: Blocking, Action or Informational. Tier sets the order and the colour of the card.
- **Blocking** — buyers, orders or shipping are stopped right now (red rail).
- **Action** — rep work is waiting and delay has a cost, but nothing is broken (blue rail).
- **Informational** — something the rep should know; there may be nothing to do (neutral grey rail).
- **Rail** — the coloured stripe on the side of a card that shows its tier.
- **Recently worked on (resume trail)** — the Home section listing the rep's own recent edits in this store, each with a link back to where it happened.
- **Resume event** — the record saved when a rep makes a qualifying edit. It is the only new data Home stores.
- **Surface key** — the existing link address the workspace already uses to open a particular screen or section (e.g. a Settings section key).
- **In your store (summary rail)** — the Home section with one row per tab showing headline counts, e.g. "148 players · 5 Roster Bank captures".
- **Deep link** — a link that opens a tab already scrolled, filtered or opened to the exact item, not just the tab's start page.
- **Draft / Open / Closed / Archived** — the four store states. Draft = not launched yet. Open = buyers can order. Closed = no new orders but still editable. Archived = permanently shut, read-only.
- **Individual Team store (Single-Team Locker)** — a store for one team, with no divisions.
- **League store** — a store with divisions that contain teams, plus optional standalone teams.
- **Division** — a group of teams inside a League store, e.g. a club or city.
- **Pop-up vs always-on** — a pop-up store has a set ordering window with a close date. An always-on store stays open until closed by hand.
- **Ordering window (Active Order Window)** — the dates when a pop-up store accepts orders. Its card in Settings shows a "days left" pill.
- **Days-left pill** — the label on the Active Order Window card counting days to close. It turns red ("urgent") in the final 7 days.
- **Pending order** — an order placed on the storefront that the rep hasn't yet submitted to the factory.
- **Submit (Submit Group / Submit Selected / Submit All)** — the Orders tab actions that send pending orders to the factory.
- **Group (shipping group)** — a batch of pending orders that ship together. Reps see "group". Specs sometimes say "container", which Home must never show.
- **MOQ (minimum order quantity)** — the factory minimum for a group. Submitting below it adds a minimum-quantity fee.
- **Freight gate** — the rule in Orders that stops pending orders being submitted until every group has a manager and an address.
- **Launch gate** — the rule that a Draft store can't launch until it has a product ⚠ open question OI-3 (whether that means "added" or "visible").
- **Roster** — a team's list of players. It is optional and never needed to launch.
- **Roster Bank** — a queue of player details captured from storefront orders. The rep reviews each capture and commits or dismisses it.
- **Capture** — one entry in the Roster Bank that isn't yet on a roster.
- **Team Required / Team Supplied gear** — products every player on the team must have; Team Supplied is gear the team pays for.
- **Allow opt-out** — a product setting that lets a player say "I already own this", which counts as having the required gear.
- **Render / render gate** — product images the system generates after decoration. A decorated product can't be made visible until its images exist.
- **Bundle / Incomplete bundle** — a bundle sells several items as one storefront line. A bundle left with only one item becomes "Incomplete" and drops off the storefront.
- **Application sizing** — a per-decoration confirmation of the logo/print size on a product. It doesn't stop buyers ordering.
- **Orphaned product** — a product whose category was deleted at workspace level. It still sells but isn't in any category.
- **Team Manager (manager record)** — a contact record for a coach or manager on the store. It is not a login.
- **Point of Contact** — the manager record whose email/phone buyers see in the storefront footer. Settings calls it "primary" today ⚠ open question OI-12.
- **Store Point of Contact setting** — the Settings control choosing, separately for Email and Phone, whether buyers see the Team Manager, the Salesperson, or a Custom value.
- **Team Manager Portal** — a separate, limited login for team managers with two areas, Reporting and Rosters.
- **People & Access** — the Settings section where the rep sends, resends and revokes portal invites.
- **Team re-bind (Change Team)** — reconnecting the store to a different team in the Team Database. It re-imports branding and asks about managers from the old team.
- **Team Database** — the external source of team logos, colours, sports and coach records.
- **Setup Guide** — a one-time, card-by-card orientation shown on first entry after creating a store. It can be reopened from the header.
- **Store Close Report** — a card-by-card summary shown on first entry after a store closes. It is also reachable on demand.
- **Paced card sequence** — the shared modal format used by the Setup Guide and Close Report, where the user clicks through one card at a time.
- **Team Fundraising (disabled-with-exemptions)** — fundraising is a per-item markup. "Disabled-with-exemptions" means the store switched it off, but some already-ordered items still collect it.
- **Order Window Scheduler / coverage gap** — a Settings tool that sets ordering windows per team code. A coverage gap is a day when no team can order.
- **Team code** — a backend ID for a division or team. Home never shows it.
- **Stock Vault, Catalog Templates, Customizer, Other stores** — current product names for the blank-gear library, saved store catalogs, the design tool, and the store switcher. Home copy must use these exact names.
- **Appendix A** — a list of required changes to other specs that Home refers to. It isn't published ⚠ open question OI-2.

## 1. Scope

**In scope**
- A new **Home** tab, first in the store workspace navigation (Home: Epic A — The Home tab & workspace navigation).
- **Needs your attention**: a ranked, capped list of cards for registered conditions only (Home: Epic C — Needs your attention: the attention-card catalogue).
- **Recently worked on**: the rep's own recent edits in this store, with links back (Home: Epic D — Recently worked on).
- **In your store**: a summary rail of counts per tab (Home: Epic E — In your store (summary rail)).
- **Team Managers panel**: list, add, edit and remove managers using the existing Settings modal (Home: Epic F — Team Managers panel).
- **Brand assets panel**: Team Logo, Team Colors and Store Theme Color using existing controls, plus a link to the team artwork library (Home: Epic G — Brand assets panel).
- **League structure directory**: a read-only list of divisions and teams, League stores only (Home: Epic H — League structure directory).
- A link to reopen the Setup Guide, and a link to the Close Report on Closed/Archived stores (Home: Epic B — Interaction with the two existing auto-presenting sequences).
- Copy rules and the exact card text (Home: Epic I — Copy & vocabulary).

**Out of scope** (Home: Out of scope)
- Attention across all of a rep's stores (a workspace-level list). The workspace Overview is named as its future home.
- Notifications or emails triggered by attention conditions.
- Snoozing, dismissing or hiding cards.
- Assigning a condition to another user.
- A full activity or audit log.
- Per-rep settings for which conditions appear.
- Any editing of store data that belongs only to Home.
- A per-tab "what this tab is for" hint on first visit was considered and cut (Home: Governing rule 3 — Guidance without a checklist).
- A choice of landing tab per rep or per store is not in v1 (Home: Epic A).
- "Add from Team Database" on Home (Home: Epic F).
- A fundraising goal or progress bar, because no goal field exists (Home: Epic E).
- A Home surface in the Team Manager Portal is recommended "no, this version" but isn't confirmed ⚠ open question OI-26.

## 2. Actors & Roles

- **Rep (store owner)** — the only user of Home. They run one store in any state (Home: User persona & use cases).
- **Two reps sharing a store** — each rep sees only their own "Recently worked on" list (Home: Epic D — Collapse, ordering & expiry).
- **Team managers** — don't use Home. Their portal has only Reporting and Rosters (Store Settings: Epic A2b). If Home is ever opened to them, the system must hide conditions they can't fix, not show them disabled (Home: Dependencies & Technical Constraints) ⚠ open question OI-26.
- **Buyers (parents/players) and the system** — their actions never appear in "Recently worked on". Home's cards often describe how buyers are affected (Home: Epic D — What qualifies).
- **Store owner vs other reps** — only the owner can archive (Store Status & Lifecycle: Epic E). Home offers no lifecycle actions itself.

## 3. Business Rules

**Home only reads data; it doesn't own any**
- BR-1: Home stores nothing about the store. It reads existing records and shows them. The only thing it saves is the rep's own "Recently worked on" history (Home: Governing rule 1 — Home is derived, and derives only from published state).
- BR-2: Every count, threshold and condition shown on Home comes from the tab that owns it. Home must not recalculate "below MOQ", "days left", "n to submit" or any other figure. If Home and a tab disagree, the tab is right and Home has a bug (Home: Governing rule 1).
- BR-3: Home uses the same label as the owning spec for everything. A rep must never learn a second name for something (Home: Governing rule 1) ⚠ open question OI-9 ⚠ open question OI-10.
- BR-4: Home never blocks, gates or becomes a step the rep must complete. Launch is enforced only by the launch gate and shipping only by the freight gate (Home: Governing rule 1).
- BR-5: Where Home lets the rep edit something, it must open the same component as the owning screen, write the same saved field, and apply the same validation and warnings in full. A change made on Home must look exactly the same afterward as one made on the owning screen (Home: Governing rule 1).
- BR-6: If a component can't meet BR-5, Home links to the owning screen instead of hosting the component. Example: the League structure editor isn't hosted on Home (Home: Governing rule 1).
- BR-7: A new attention condition is added by registering it in the Epic C catalogue with its owning spec, tier, trigger and link target. A condition with no owning spec can't ship (Home: Governing rule 1).

**Guidance, not a checklist**
- BR-8: Home reports what is true about the store now. It never lists steps not yet taken, never scores or grades the store, and never suggests the store is incomplete when it is fine (Home: Governing rule 3 — Guidance without a checklist).
- BR-9: Every card exists only because a check found a matching record. When that record goes away, the card goes away (Home: Governing rule 3).
- BR-10: An empty attention list is the success state. Home must not fill it with tips, checklists or "next steps" (Home: Governing rule 3).
- BR-11: Orientation content stays in the Setup Guide. Home links to it and never copies it (Home: Governing rule 3).
- BR-12: No completion percentage, readiness score or progress indicator appears anywhere on Home (Home: Epic I — Product vocabulary).

**Tiers, colours and order**
- BR-13: Every condition has one fixed tier: Blocking (red rail, primary button, shown first), Action (blue rail, secondary button, second), Informational (neutral rail, link or no button, last) (Home: Governing rule 2 — Severity tiers).
- BR-14: A condition's tier never escalates over time. Where urgency depends on time, it is modelled as two separate conditions, e.g. C-14 and C-15 (Home: Governing rule 2).
- BR-15: Home uses only red, blue and neutral. Amber is never used on Home. Destination screens that use amber (e.g. My Team(s) "No products yet") stay unchanged (Home: Governing rule 2).
- BR-16: A Blocking card always says who is blocked, e.g. "pending orders can't be submitted", not the internal state (Home: Governing rule 2).
- BR-17: Cards are ordered Blocking, then Action, then Informational. Within a tier they follow a fixed "cost of delay" rank per condition, never recency or count. The same store state always gives the same order (Home: Epic C — Presentation, ordering & limits) ⚠ open question OI-7.
- BR-18: The tier label is never shown on the card (e.g. no red "BLOCKING" heading). Only the rail colour shows severity (Home: Epic I — The tier is not displayed on the card — decided).

**Cards: count, cap and clearing**
- BR-19: The list shows at most five cards. Any extra cards go behind an "n more" expander (Home: Epic C — Presentation, ordering & limits).
- BR-20: Blocking cards are never hidden in the expander. If more than five Blocking conditions hold, all of them show and the cap is exceeded (Home: Epic C — Presentation, ordering & limits).
- BR-21: There is one card per condition, not per record. Four pending orders make one C-01 card that says "4" (Home: Epic C — Presentation, ordering & limits).
- BR-22: C-01, C-05 and C-06 must show the age of the oldest affected item, e.g. "Oldest placed 3 days ago" (Home: Epic C — Presentation, ordering & limits) ⚠ open question OI-22.
- BR-23: Cards can't be dismissed, snoozed or marked done. A card clears only when its underlying state clears, as set out in the catalogue's "Clears when" column (Home: Epic C — Presentation, ordering & limits).
- BR-24: Every card has exactly one main action. If a problem has two possible fixes, it is either two conditions or the card links to a screen offering both (Home: Epic C — Presentation, ordering & limits).
- BR-25: A condition may only be registered if it would be false on a well-run store. Something that is true for most stores is permanent clutter, not an attention condition (Home: Epic C — Presentation, ordering & limits).
- BR-26: When nothing holds, the section says plainly that nothing needs the rep right now and names the store's current state (Home: Epic C — Presentation, ordering & limits).

**Condition catalogue — Orders (C1)**
- BR-27: C-01 "Pending orders awaiting submission" — Action. Shows when at least 1 order is pending and not yet submitted. Links to Orders → Pending Orders. Clears when every pending order is submitted or cancelled (Home: Epic C — C1 — Orders).
- BR-28: C-01 copy uses "Submit" and "pending". It must never say "approve", because there is no approval step (Home: Epic C — C1 — Orders) ⚠ open question OI-9.
- BR-29: C-02 "A shipping group is below MOQ" — Informational. Shows when at least 1 pending group is below its minimum. Links to Orders → Pending Orders, scrolled to that group. Clears when the group reaches MOQ or is submitted short (Home: Epic C — C1 — Orders).
- BR-30: C-03 "Manager unassigned on a division or team with pending orders" — Blocking. Shows when at least 1 pending group has no group or team manager. Links to Settings → Distribution & Fulfillment with the affected division auto-opened. Clears when every group has a manager (Home: Epic C — C1 — Orders) ⚠ open question OI-19.
- BR-31: C-03 must name the affected divisions or teams, e.g. "Division 3 and Division 7", not just a count (Home: Epic C — C1 — Orders).
- BR-32: C-04 "No ship-to destination address" — Blocking. Shows when the fulfilment method is Ship to Team Manager and the destination address is empty. Links to Settings → Distribution & Fulfillment → Fulfillment Method. Clears when a verified destination address exists (Home: Epic C — C1 — Orders).
- BR-33: C-03 and C-04 stay as separate cards, even when both hold, because they are fixed in different places (Home: Epic C — C1 — Orders).
- BR-34: C-05 "Rostered players missing required gear" — Action. Shows when at least 1 committed player hasn't ordered Team Required gear. Links to My Team(s) → store-wide player view, filtered to incomplete. Clears when every rostered player's required gear is ordered or opted out (Home: Epic C — C1 — Orders) ⚠ open question OI-15.
- BR-35: C-05 counts a player who chose "I already own this" on an Allow opt-out product as having the gear (Home: Epic C — C1 — Orders).
- BR-36: C-05 doesn't offer Send Reminder on Home. Reminders are sent per player from the player drawer (Home: Epic C — C1 — Orders).
- BR-37: C-05's detail line warns how many of the players have no email or phone, so a reminder won't reach them. C-15 carries the same warning (Home: Epic C — C2 — My Team(s)).

**Condition catalogue — My Team(s) (C2)**
- BR-38: C-06 "Roster Bank captures awaiting review" — Action. Shows when at least 1 pending capture exists. Links to My Team(s) → store-wide Roster Bank view. Clears when every capture is committed or dismissed (Home: Epic C — C2 — My Team(s)).
- BR-39: C-07 "Teams carrying no products" — Action, League only. Shows when at least 1 team has zero assigned products, directly or through its division. Links to the My Team(s) canvas or the division's per-team coverage table. Clears when every team has at least 1 product. Uses the same wording as the canvas: "No products yet" (Home: Epic C — C2 — My Team(s)).
- BR-40: C-08 "Divisions or teams with no fulfillment manager" — Action, League stores shipping to managers only. Shows when at least 1 division or team is in the "Not assigned" state. Links to Settings → Distribution & Fulfillment. Clears when every division and team has a manager (Home: Epic C — C2 — My Team(s)).
- BR-41: When C-03 and C-08 both hold for the same division, only C-03 shows for that division (Home: Epic C — C2 — My Team(s)).
- BR-42: C-25 is retired and its ID must never be reused. Future conditions take the next free number (Home: Epic C — C2 — My Team(s)).
- BR-43: No card for "teams with no roster" and no card for "incomplete roster". Rosters are optional, and "incomplete" can't be measured (Home: Epic C — C2 — My Team(s)).
- BR-44: Every My Team(s) link from Home must open at the exact division, team or roster, with breadcrumbs intact, not at the canvas (Home: Epic C — C2 — My Team(s)).

**Condition catalogue — Products (C3)**
- BR-45: C-09 "No visible products — store cannot launch" — Blocking, Draft only. Shows when the catalog has zero visible products. Links to Products → Catalog. Clears when at least 1 product is visible (Home: Epic C — C3 — Products) ⚠ open question OI-3.
- BR-46: C-10 "Products held by the render gate" — Action. Shows when at least 1 decorated product's images are still being generated ("Render pending"). Links to Products → Catalog, filtered to those items. Clears when the images exist or the item is undecorated (Home: Epic C — C3 — Products) ⚠ open question OI-15.
- BR-47: C-11 "Render failure — retry required" — Blocking. Shows when image generation failed for at least 1 product. Links to that product's detail page. Clears when a retry succeeds (Home: Epic C — C3 — Products) ⚠ open question OI-20.
- BR-48: C-12 "Bundles in the Incomplete state" — Blocking. Shows when at least 1 bundle has only one item. Links to the bundle's detail page → Members. Clears when the bundle has a second item again or is deleted (Home: Epic C — C3 — Products) ⚠ open question OI-21.
- BR-49: C-13 "Products with unconfirmed application sizing" — Action. Links to the product's detail page → Application Sizing. Clears when sizing is confirmed on every row. Its copy must never say customers can't order (Home: Epic C — C3 — Products).
- BR-50: C-27 "Products orphaned by a deleted category" — Action. Shows when at least 1 product's category was deleted at workspace level. Links to Products → Catalog, filtered to those items. Clears only when every affected product is filed under an existing category. Recreating a category with the same name doesn't fix it (Home: Epic C — C3 — Products) ⚠ open question OI-30.
- BR-51: There are no cards for states the system already blocks when saving, e.g. uncategorized products or League TR/TS items with no team (Home: Epic C — C3 — Products) ⚠ open question OI-30.

**Condition catalogue — Lifecycle & schedule (C4)**
- BR-52: C-14 "Ordering window closing soon" — Informational. Shows when the store is Open, has a set window, and the days-left pill is in its urgent range (final 7 days). Links to Settings → Schedule & Status → "Edit Store Schedule". Clears when the window closes or the close date moves out of range (Home: Epic C — C4 — Lifecycle & schedule).
- BR-53: C-15 "Window closing with players still missing required gear" — Action. Defined as C-14 and C-05 both holding, but also said to fire earlier, at 14 days. Links to the My Team(s) incomplete-player view. Clears when either underlying condition clears (Home: Epic C — C4 — Lifecycle & schedule) ⚠ open question OI-4 ⚠ open question OI-31.
- BR-54: Home offers no "extend deadline" action. It links to "Edit Store Schedule". A store that already closed automatically also needs a Re-open (Home: Epic C — C4 — Lifecycle & schedule).
- BR-55: C-16 "Store is Draft and ready to launch" — Action. Shows when the store is Draft and has at least 1 visible product. Links to the Launch control in the workspace header. Clears when the store is Open (Home: Epic C — C4 — Lifecycle & schedule) ⚠ open question OI-3.
- BR-56: C-17 "Store closed — Close Report not yet viewed" — Informational. Shows when the store is Closed and this user hasn't seen this close event's report. Links to Reports → Store Close Report. Clears when the report is viewed or dismissed (Home: Epic C — C4 — Lifecycle & schedule) ⚠ open question OI-5 ⚠ open question OI-25.
- BR-57: C-18 "Orders still in production after close" — Informational. Shows when the store is Closed with at least 1 order not yet shipped. Links to Orders → All Orders. Clears when every order is Delivered or cancelled (Home: Epic C — C4 — Lifecycle & schedule) ⚠ open question OI-18.
- BR-58: C-19 "Order-window coverage gap" — Action, per-team-code scheduling only. Shows when the Order Window Scheduler flags at least 1 day with no team open. Links to Settings → Schedule & Status → Order Window Scheduler. Clears when the gap is closed or accepted (Home: Epic C — C4 — Lifecycle & schedule) ⚠ open question OI-16.
- BR-59: C-20 "Closed with unsettled payment" — Action. Shows when at least 1 order in the window has an open PO (purchase order). Links to Orders → All Orders, filtered. Clears when the PO settles (Home: Epic C — C4 — Lifecycle & schedule) ⚠ open question OI-17.

**Condition catalogue — Settings & access (C5)**
- BR-60: C-21 "Managers left behind by a team re-bind" — Action. Shows when at least 1 manager record comes from a team that is no longer the connected team. Links to Settings → General → League/Team Manager Information. Clears when the records are kept or removed (Home: Epic C — C5 — Settings & access) ⚠ open question OI-32.
- BR-61: C-22 "A left-behind manager still holds portal access" — Blocking. Shows when C-21 holds and that person has an active or pending invite. Links to Settings → People & Access. Clears when access is revoked or the record is confirmed kept (Home: Epic C — C5 — Settings & access) ⚠ open question OI-32.
- BR-62: C-23 "Team Fundraising disabled with items still collecting" — Informational. Shows when fundraising reads "disabled-with-exemptions". Links to Products → Catalog, filtered to exempted items. Clears when no exempted item remains or fundraising is re-enabled. Copy must not suggest the rep made a mistake (Home: Epic C — C5 — Settings & access).
- BR-63: C-24 "Pending team-manager invites never activated" — Informational. Shows when at least 1 invite has been "Invited · not logged in" for more than 7 days. Links to Settings → People & Access. Clears when the invite is activated or revoked (Home: Epic C — C5 — Settings & access) ⚠ open question OI-31.

**Which cards can appear, by store state and type**
- BR-64: Draft stores: only C-04, C-08, C-09, C-16 and C-10 to C-13 can appear. No order, Roster Bank or window conditions (Home: Epic C — Which cards populate the list, by store state and store type) ⚠ open question OI-23.
- BR-65: Open stores: everything except C-09 and C-16 (launch only) and C-17, C-18 and C-20 (closed only) (Home: Epic C — Which cards populate the list, by store state and store type).
- BR-66: Closed stores: most conditions, including Action tier, because the workspace stays editable. C-17, C-18 and C-20 are specific to this state. C-14 can't appear (Home: Epic C — Which cards populate the list, by store state and store type).
- BR-67: Archived stores: no cards. The section still shows and says the store is archived and read-only, so nothing needs action. No card is shown disabled (Home: Epic C — Which cards populate the list, by store state and store type).
- BR-68: Individual Team stores: C-07 and C-08 can't appear. Always-on stores: C-14, C-15 and C-19 can't appear (Home: Epic C — Which cards populate the list, by store state and store type).
- BR-69: Store state and type change only which cards appear. They never hide the tab or the section (Home: Epic C — Needs your attention: the attention-card catalogue) ⚠ open question OI-6.

**Navigation**
- BR-70: The workspace shows six tabs in this order: Home, My Team(s), Products, Orders, Reports, Settings (Home: Epic A — The Home tab & workspace navigation) ⚠ open question OI-1 ⚠ open question OI-24.
- BR-71: The Home tab is always there and enabled, in every store state, store type and distribution format. It is never hidden, disabled or removed (Home: Epic A).
- BR-72: Home is the default tab on workspace entry when no deep link names another tab. Deep links always go straight to their target. No per-rep or per-store override exists (Home: Epic A).
- BR-73: A tab label shows a dot (presence, not a number) when one or more conditions that link to that tab hold. Blocking conditions add the dot; Informational conditions don't (Home: Epic A) ⚠ open question OI-8.
- BR-74: Home doesn't replace the workspace header. The status chip, storefront URL, Preview Store and Setup Guide link stay in the header (Home: Epic A) ⚠ open question OI-28.

**Setup Guide and Close Report**
- BR-75: When the Setup Guide or Close Report is due to auto-open, it opens on top of Home. Home is fully usable after it is dismissed (Home: Epic B — Interaction with the two existing auto-presenting sequences).
- BR-76: Home never reads or writes the "seen" flags of either sequence and never re-triggers them (Home: Epic B) ⚠ open question OI-5.
- BR-77: Home always shows a link to reopen the Setup Guide. It behaves exactly like the header control: it opens on card 1 with no forced pacing, whatever has been seen before (Home: Epic B).
- BR-78: On Closed and Archived stores, Home shows a link to the Close Report. Its availability and disabled text are owned by Store Status & Lifecycle (Home: Epic B).

**Recently worked on**
- BR-79: A resume event is saved only for the rep's own edit, to this store, on a screen with a stable deep link (Home: Epic D — What qualifies).
- BR-80: These never create resume events: reads, filters, sorts, searches, tab switches, other reps' edits, team managers' edits, buyer orders, checkout address write-backs, Roster Bank captures, auto-close, finished renders, and deletions (Home: Epic D — What qualifies).
- BR-81: A bulk action records one event, e.g. "imported 40 players" (Home: Epic D — What qualifies).
- BR-82: Repeated edits to the same screen and item collapse into one row, timed at the most recent edit (Home: Epic D — Collapse, ordering & expiry).
- BR-83: Five rows show by default, newest first, and the list expands to 15. Events expire after 30 days (Home: Epic D — Collapse, ordering & expiry).
- BR-84: Each rep sees only their own rows (Home: Epic D — Collapse, ordering & expiry).
- BR-85: The row label is built from the item when the list is shown, not stored as text, so a renamed product shows its current name (Home: Epic D — The resume record).
- BR-86: A row whose target no longer exists is silently left out (Home: Epic D — Presentation).
- BR-87: The section is not shown at all when the rep has no events (Home: Epic D — Presentation).
- BR-88: The section is named "Recently worked on". It must never look or read like a to-do list, completion percentage or readiness score. Row buttons say "Open" or "Go to …", never "Resume" (Home: Epic D — What it is).

**In your store (summary rail)**
- BR-89: There is one row per tab, in navigation order: My Team(s), Products, Orders, Reports. Rows always show, even at zero (e.g. "0 products") (Home: Epic E — In your store (summary rail)) ⚠ open question OI-27.
- BR-90: The first row is labelled "My Team(s)", exactly matching the tab, not "Rosters" (Home: Epic E) ⚠ open question OI-24.
- BR-91: Roster entries are always called "players" on Home, never "members" (Home: Epic E).
- BR-92: Each row shows the tab's headline count plus, if any, the same figure the matching card shows, e.g. "24 orders · 4 to submit" (Home: Epic E).
- BR-93: Player counts exclude Roster Bank captures (Home: Epic E).
- BR-94: The Reports row is only a link. Home doesn't repeat revenue, dealer profit or fundraising breakdowns (Home: Epic E).
- BR-95: No fundraising progress bar. Home may show total raised during the window as a plain figure, read from the Active Order Window card (Home: Epic E) ⚠ open question OI-27.

**Team Managers panel**
- BR-96: The panel reads and writes the same manager list as Settings, Step 1 and coach import. Home keeps no copy (Home: Epic F — Team Managers panel).
- BR-97: The panel title is "League Manager Information" on League stores and "Team Manager Information" on Individual Team stores (Home: Epic F).
- BR-98: The "Point of Contact" tag shows when at least one contact channel (email or phone) is set to Team Manager. If only one channel is, the tag names it, e.g. "Point of Contact · email". If neither is, no row is tagged and the panel footer says who buyers actually see, with a link to the setting (Home: Epic F).
- BR-99: The tag also shows when there is only one manager. It must never read "Primary" or "Primary Contact" (Home: Epic F) ⚠ open question OI-12.
- BR-100: Home shows the Point of Contact tag but can't change it. To change it, the rep follows a link to Settings → General (Home: Epic F — Designating the point of contact — Home displays it, Home does not set it) ⚠ open question OI-11.
- BR-101: Add, edit and remove use the existing manager modal with all its fields and validation. There is no cut-down Home version (Home: Epic F).
- BR-102: Removing the designated Point of Contact record is blocked until another record is designated. The block gives the reason and a link to Settings → General (Home: Epic F — Designating the point of contact — Home displays it, Home does not set it).
- BR-103: Adding a manager never changes which record is the Point of Contact (Home: Epic F — Designating the point of contact — Home displays it, Home does not set it).
- BR-104: Adding, editing or removing a manager on Home never creates, changes or revokes portal access (Home: Epic F — Adding a manager grants no access, and Home must say so in place).
- BR-105: Rows with an email offer "Invite", which links to People & Access. If the person already has an active or pending invite, the row shows that status instead of the button (Home: Epic F) ⚠ open question OI-10.
- BR-106: The panel shows in every store state, because the manager list never locks after launch. On Archived stores it is read-only (Home: Epic F — Availability).
- BR-107: Home offers only "Add manager". To import a coach from the Team Database, the rep follows a link to Settings → General (Home: Epic F) ⚠ open question OI-14.
- BR-108: Home doesn't show the Store Point of Contact mode selector. It lives in the Edit Store Details modal (Home: Epic F — Point-of-contact propagation).

**Brand assets panel**
- BR-109: The panel shows Team Logo and Team Colors, editable with the existing Step 1/Settings controls, and Store Theme Color, editable with the Prolook color picker. No custom-built controls (Home: Epic G — Brand assets panel).
- BR-110: The theme swatch shows its source ("Team default" or "Custom"). "Reset to team color" is offered on a custom colour. Helper text says the colour applies to buttons and accents only (Home: Epic G — Theme color behavior is inherited whole).
- BR-111: The team artwork library is only linked, with a note that it is team-level (shared across all of that team's stores) (Home: Epic G).
- BR-112: Home doesn't host "Change Team". It links to the Edit Store Details modal (Home: Epic G).
- BR-113: The whole panel stays editable after launch. On Archived stores it is read-only (Home: Epic G — Availability) ⚠ open question OI-13.

**League structure directory**
- BR-114: The directory shows on League stores only. It doesn't show on Individual Team stores (Home: Epic H — League structure directory).
- BR-115: The directory is read-only. It shows divisions (collapsed) with their teams inside, standalone teams separately, and the same divisions · teams · players counts as the My Team(s) stats header (Home: Epic H).
- BR-116: Each row shows its player count and its pending Roster Bank capture count, if any (Home: Epic H).
- BR-117: Clicking a division opens that division in My Team(s). Clicking a team opens that team with its division auto-opened and breadcrumbs intact (Home: Epic H).
- BR-118: The directory never shows product thumbnails, product-count pills, coverage tables, the catalog drawer or team codes (Home: Epic H).
- BR-119: Divisions always start collapsed, whatever the league size. The panel has a fixed maximum height and scrolls. Expanded divisions don't stay expanded after a reload (Home: Epic H).

**Copy rules**
- BR-120: Card copy comes only from the Epic I table. The internal "Condition" names in Epic C must never be shown as card text (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-121: Cards name the consequence first, then the action. They use no internal state names and say who is affected (Home: Epic I — Card copy — the rule, and the terms it bans).
- BR-122: Banned words on cards include "Freight routing unresolved", "Below MOQ", "Held by the render gate", "Unconfirmed application sizing", "Team re-bind", "Order-window coverage gap", "Submission blocked", "Container", "Primary"/"Primary Contact" and "Orphaned products". No card uses "blocked" (Home: Epic I — Card copy — the rule, and the terms it bans).
- BR-123: Home copy uses the current product labels: Stock Vault, Catalog Templates, Customizer, Other stores, My Team(s), Roster Bank, Pending Orders, Submit, Open, Closed, Draft, Archived, Point of Contact. It must never show "Active" for a store status (Home: Epic I — Product vocabulary).
- BR-124: Cards never scold: no "you forgot", no "overdue", and no red on an Informational card (Home: Epic I — Product vocabulary).

## 4. Data

- **No new store data.** Home reads existing order, roster, catalog, settings and reporting records (Home: Dependencies & Technical Constraints).
- **Resume event (the only new record).** It holds: acting rep, store, surface key (deep-link target), optional item reference, field group or operation ID, and timestamp. The label is built when the list is shown (Home: Epic D — The resume record; Dependencies & Technical Constraints).
  - Saved only by screens that explicitly opt in. There is no general hook on every save, because that would also capture buyer and system writes (Home: Dependencies & Technical Constraints).
  - Collapsing, expiry (30 days) and per-rep filtering happen when the list is read (Home: Dependencies & Technical Constraints).
- **Condition catalogue is data, not code branches.** Each entry holds: ID, internal name, tier, trigger (owning spec), link target, clear rule, and a cost-of-delay rank ⚠ open question OI-7. Rep-facing copy (headline, detail line, button) comes from Epic I (Home: Dependencies & Technical Constraints; Epic I — Rep-facing headlines).
- **Resolver output per condition:** count, oldest-affected timestamp where relevant, tier, link target. For C-03 it also returns the names of the affected divisions/teams (Home: Dependencies & Technical Constraints; Epic C — C1 — Orders).
- **Archived stores:** the resolver returns an empty set with an "archived" reason code (Home: Dependencies & Technical Constraints).
- **Manager record (owned by Settings Epic A2c):** First Name, Last Name, Email, Phone Number, Street Address, Contact Preference. Exactly one record is designated (internal field name "primary"). Home's read view shows Name, Email, Phone and Contact Preference (Home: Epic F — Team Managers panel).
- **Invite status (owned by Settings Epic A2b):** active or pending ("Invited · not logged in") (Home: Epic F) ⚠ open question OI-10.
- **Brand fields (owned by Settings/Step 1):** Team Logo, Team Colors, Store Theme Color plus its source flag (Team default / Custom). The source flag must be saved as its own value, because a custom colour can match the team colour (Home: Dependencies & Technical Constraints).
- **Structure read:** divisions, nested teams, standalone teams, per-item player counts and pending capture counts, all from the same data as My Team(s) (Home: Dependencies & Technical Constraints).
- **Rep-facing card copy, with placeholders filled in** (Home: Epic I — Rep-facing headlines):

| ID | Headline | Detail line | Button |
| --- | --- | --- | --- |
| C-01 | *n* pending orders to submit | Oldest placed *n* days ago — orders reach the factory after you submit | Go to Pending Orders |
| C-02 | *Division 3* is under the minimum to ship | *n* more items needed, or submit as-is and a minimum-quantity fee applies | View group |
| C-03 | *Division 3* and *Division 7* need a manager before their orders can ship | *n* orders are waiting on this | Assign managers |
| C-04 | Add a delivery address before orders can ship | Orders ship to the team manager, and there's no address on file yet | Add address |
| C-05 | *n* players haven't ordered their required gear | Window closes *date* — *n* of them have no email or phone, so a reminder won't reach them | View players |
| C-06 | *n* Roster Bank captures awaiting review | Oldest captured *n* days ago — banked from storefront orders, not yet on a roster | Open Roster Bank |
| C-07 | *n* teams carry no products | *U10 Red*, *U14 White* — there's nothing to buy for these teams yet | Review coverage |
| C-08 | *n* divisions or teams have no manager assigned | Orders for them can't ship until someone's assigned | Assign managers |
| C-09 | Add a product before you launch | Customers need at least one thing to buy | Go to Products |
| C-10 | *n* products are still generating images | Customers can't see them until the images are ready | View products |
| C-11 | Images failed for *n* products | They can't go on the storefront until this is retried | Retry |
| C-12 | *n* bundles have only one item left | They've come off the storefront — add an item or delete the bundle | Fix bundles |
| C-13 | Confirm sizing for *n* products | Sizing hasn't been confirmed on every decoration | Confirm sizing |
| C-14 | Ordering window closes *date* — *n* days left | Change the close date from the store schedule | Edit Store Schedule |
| C-15 | *n* players still haven't ordered and the window closes in *n* days | Send reminders where you have contact details, or move the close date | View players |
| C-16 | Your store is ready to launch | Customers can start ordering as soon as you do | Launch store |
| C-17 | Your close report is ready | Totals, fundraising, and what shipped | View report |
| C-18 | *n* orders are still being made | They'll ship as they're finished — nothing needed from you | View orders |
| C-19 | Some days have no team able to order | *n* days in the window aren't covered by any team's schedule | Review schedule |
| C-20 | *n* orders haven't been paid for | Payment is still open on these | View orders |
| C-21 | *n* manager records are from the team you switched away from | Keep them or remove them | Review managers |
| C-22 | Someone from the previous team can still see this store | *Name* has access to this store's reports and rosters | Review access |
| C-23 | Fundraising is off, but *n* products still add to it | This is fine if it's intentional | View products |
| C-24 | *n* invited managers haven't signed in yet | Invited *n* days ago | Review invites |
| C-27 | *n* products aren't in a category | A category they were in was deleted — shoppers can still buy them, but can't filter or search for them | Re-file products |

## 5. Flows

**Entering the workspace**
1. The rep opens a store. If a deep link names a tab, section or item, that target opens directly (Home: Epic A).
2. Otherwise Home opens (Home: Epic A).
3. If this is the first entry after creating the store, the Setup Guide opens on top of Home. If this is the first entry after a close, the Close Report opens on top. The two can never both be due (Home: Epic B).
4. After the rep dismisses the sequence, Home is fully usable (Home: Epic B).

**Loading Home**
1. The resolver checks conditions for this store, Blocking ones first, so the most serious cards appear first (Home: Dependencies & Technical Constraints).
2. Store state and type limit which conditions are checked at all, e.g. League-only conditions aren't checked on Individual Team stores (Home: Dependencies & Technical Constraints).
3. Cards are sorted by tier, then rank, and capped at five plus an "n more" expander. All Blocking cards always show (Home: Epic C — Presentation, ordering & limits).
4. The summary rail always shows. "Recently worked on" shows only if the rep has events. The directory shows only on League stores (Home: Epic A; Epic D; Epic H).

**Acting on a card**
1. The rep clicks the card's one button (Home: Epic C).
2. The owning tab opens, scrolled, filtered or opened to the affected records where that tab supports it (Home: Epic J — Acceptance criteria).
3. The rep fixes the problem there. The card is gone the next time Home is shown (Home: Epic J — Acceptance criteria).

**Adding a manager from Home**
1. The rep clicks "Add manager". The existing manager modal opens (Home: Epic F).
2. The modal says that adding a manager creates a contact record only and grants no portal access, and links to Settings → People & Access (Home: Epic F — Adding a manager grants no access, and Home must say so in place).
3. If a contact channel is set to Team Manager and the designated record's email or phone changes, the modal says before saving that the storefront footer will update. After saving, the footer updates automatically (Home: Epic F — Point-of-contact propagation).

**Removing a manager from Home**
- If the record is the designated Point of Contact, removal is blocked with the reason and a link to Settings → General (Home: Epic F).
- If the person has an active or pending invite, the confirmation says their portal access stays until revoked in People & Access, and links there (Home: Epic F).

**Archived store**
- The attention section says the store is archived and read-only, so nothing needs action. The rail, "Recently worked on", the managers panel, the brand panel and the directory are all read-only and link only to read-only screens (Home: Epic C; Epic D; Epic F; Epic G; Epic H).

## 6. Integrations

- **Owning services read by the resolver** — Home must call each owner's own logic, not re-implement it: the pending-order query, the MOQ check, the freight gate, render state, the Incomplete-bundle flag, the launch gate's visible-product count, the three-state fundraising read, the days-left value, coverage-gap detection, invite status, and the re-bind source team (Home: Dependencies & Technical Constraints).
- **Deep-link routing** — reuses existing schemes only: Settings section keys, My Team(s) division jump-ins (with auto-open), the Products catalog scroll-to-item return path, and Orders sub-tab/filter state (Home: Dependencies & Technical Constraints).
- **Filters that may not exist yet** — C-05 incomplete players, C-10 render-pending, and C-23 exempted items must be added to the owning tabs as linkable states. Home must not build them itself. Check which exist before estimating (Home: Dependencies & Technical Constraints) ⚠ open question OI-15.
- **Shared components hosted on Home** — manager edit modal (Settings Epic A2c), Team Logo drop zone and Team Colors control (Step 1/Settings), Prolook color picker (Settings Epic I), Setup Guide reopen path (Tabbed Store Dashboard Epic B) (Home: Epic F; Epic G; Epic B).
- **Team Database** — not called by Home. Coach import and Change Team stay in Settings (Home: Epic F; Epic G).
- **Notifications/emails** — none. Home sends nothing, including reminders (Home: Out of scope; Epic C — C1 — Orders).
- **Storefront footer** — updated through the existing link to the designated manager record when that record is edited from Home (Home: Epic F — Point-of-contact propagation).

## 7. Non-Functional

- **Performance:** the resolver runs on every workspace entry and must be cheap enough not to slow store opening. The C-05 roster-to-order join, the C-07 coverage totals and the C-23 catalog-wide fundraising read are named as costly (Home: Dependencies & Technical Constraints).
- **Progressive loading (decided):** conditions are checked progressively, Blocking first. This was chosen over checking everything at once and over short-lived caching (Home: Dependencies & Technical Constraints).
- **Consistency:** Home counts must match the tabs exactly. The target for reported mismatches is zero (Home: Metrics & Success Criteria).
- **Security / access:** no code path from Home may create, infer or revoke portal access. Removing a manager must not touch the invite table (Home: Dependencies & Technical Constraints).
- **Large leagues:** the directory has a fixed maximum height so it can't push the attention list off screen (Home: Epic H).
- **Copy upkeep:** Home copy is tied to the product labels as of September 3, 2026 and must be re-checked whenever they change (Home: Epic I — Product vocabulary).

## 8. Acceptance Criteria

- AC-1: When a rep opens a store workspace, a Home tab is present and first in the navigation (Home: Epic J — Acceptance criteria) ⚠ open question OI-1.
- AC-2: In any store state, store type or distribution format, the Home tab is present and enabled. The workspace never shows only five tabs (Home: Epic J — Acceptance criteria).
- AC-3: In any state, "Needs your attention" and "In your store" both show. Neither is hidden or disabled (Home: Epic J — Acceptance criteria).
- AC-4: The rail's first row reads "My Team(s)", matching the tab, and roster entries are counted as "players" (Home: Epic J — Acceptance criteria) ⚠ open question OI-24.
- AC-5: No amber is used anywhere on Home (Home: Epic J — Acceptance criteria).
- AC-6: When the Setup Guide or Close Report is due, it opens over Home, and Home is usable after dismissal (Home: Epic J — Acceptance criteria).
- AC-7: Every card matches a registered Epic C condition. No card shows for an unregistered condition (Home: Epic J — Acceptance criteria).
- AC-8: Cards are ordered Blocking → Action → Informational, in the same order on every render of the same store state (Home: Epic J — Acceptance criteria) ⚠ open question OI-7.
- AC-9: With more than five conditions, the top five show with an expander, unless more than five are Blocking, in which case all Blocking cards show (Home: Epic J — Acceptance criteria).
- AC-10: Each card's count matches the owning tab's count exactly (Home: Epic J — Acceptance criteria).
- AC-11: A card's main button takes the rep to the owning screen, scoped or filtered to the affected records where that screen supports it (Home: Epic J — Acceptance criteria) ⚠ open question OI-15.
- AC-12: When a condition's underlying state clears, the card is gone on the next render. No card can be dismissed any other way (Home: Epic J — Acceptance criteria).
- AC-13: With zero conditions, the section says so plainly and shows nothing in its place (Home: Epic J — Acceptance criteria).
- AC-14: On an Archived store, the attention section shows, says the store is archived and read-only, and no card has an action (Home: Epic J — Acceptance criteria).
- AC-15: A Draft store with zero visible products shows C-09 at Blocking tier, and Home offers no launch action (Home: Epic J — Acceptance criteria) ⚠ open question OI-3.
- AC-16: A Draft store with at least one visible product shows C-16, which links to the header launch control (Home: Epic J — Acceptance criteria) ⚠ open question OI-3.
- AC-17: A qualifying rep edit saves a resume event against that rep, that store and the screen's existing deep-link key (Home: Epic J — Acceptance criteria).
- AC-18: Repeated edits to the same item show as one row, timed at the latest edit (Home: Epic J — Acceptance criteria).
- AC-19: A buyer order, a checkout write-back, a Roster Bank capture or any system event saves no resume event (Home: Epic J — Acceptance criteria).
- AC-20: When two reps share a store, each sees only their own "Recently worked on" list (Home: Epic J — Acceptance criteria).
- AC-21: A row whose target was deleted is left out, with no error shown (Home: Epic J — Acceptance criteria).
- AC-22: With no qualifying events, the "Recently worked on" section is absent, not empty (Home: Epic J — Acceptance criteria).
- AC-23: No completion percentage, readiness score or setup-progress indicator appears anywhere on Home (Home: Epic J — Acceptance criteria).
- AC-24: The Team Managers panel lists the store's manager collection, and it is the same collection Settings and Step 1 write (Home: Epic J — Acceptance criteria).
- AC-25: If at least one contact channel is on Team Manager mode, the designated record is tagged "Point of Contact", even when it is the only record, and is never tagged "Primary" or "Primary Contact" (Home: Epic J — Acceptance criteria) ⚠ open question OI-12.
- AC-26: If only one channel is on Team Manager mode, the tag names that channel (Home: Epic J — Acceptance criteria).
- AC-27: If both channels are on Salesperson or Custom, no row is tagged and the panel says who buyers actually see (Home: Epic J — Acceptance criteria).
- AC-28: To change the Point of Contact, Home sends the rep to Settings → General and doesn't host the change (Home: Epic J — Acceptance criteria) ⚠ open question OI-11.
- AC-29: If a removal would leave no designated record, it is blocked with the reason and a link to Settings → General (Home: Epic J — Acceptance criteria).
- AC-30: The manager modal opened from Home is the same modal Settings opens, with its full fields and validation (Home: Epic J — Acceptance criteria).
- AC-31: "Add manager" is the only add option. "Add from Team Database" isn't offered, and coach import links to Settings → General (Home: Epic J — Acceptance criteria) ⚠ open question OI-14.
- AC-32: No card shows its tier as a label (Home: Epic J — Acceptance criteria).
- AC-33: Every registered condition is false on a store with no outstanding work (Home: Epic J — Acceptance criteria).
- AC-34: "Add manager" opens the existing modal and says that adding a manager grants no portal access (Home: Epic J — Acceptance criteria).
- AC-35: Adding, editing or removing a manager on Home has the same result as doing it in Settings. No portal invite is created, changed or revoked (Home: Epic J — Acceptance criteria).
- AC-36: Removing a manager with an active or pending invite shows a confirmation saying access stays until revoked in People & Access, with a link there (Home: Epic J — Acceptance criteria).
- AC-37: If a channel is on Team Manager mode and the designated record's contact details are edited on Home, the storefront footer updates with no further action, and the modal said so before saving (Home: Epic J — Acceptance criteria).
- AC-38: The brand panel shows Team Logo, Team Colors and Store Theme Color using the existing Step 1/Settings components and the Prolook color picker. All three stay editable after launch (Home: Epic J — Acceptance criteria) ⚠ open question OI-13.
- AC-39: A manager row whose person has an active or pending invite shows that status instead of hiding the Invite action (Home: Epic J — Acceptance criteria) ⚠ open question OI-10.
- AC-40: The theme swatch shows "Team default" or "Custom". "Reset to team color" is offered on a custom value. Helper text says the colour applies to buttons and accents only (Home: Epic J — Acceptance criteria).
- AC-41: The team artwork library is linked, with its team-level scope stated, and isn't reproduced on Home (Home: Epic J — Acceptance criteria).
- AC-42: On a League store, the directory shows divisions with nested teams, standalone teams separately, and the same divisions · teams · players counts as the My Team(s) stats header. Divisions are collapsed and the panel has a maximum height (Home: Epic J — Acceptance criteria).
- AC-43: On an Individual Team store, the directory doesn't show, and the rest of Home is unchanged (Home: Epic J — Acceptance criteria).
- AC-44: Selecting a division or team row opens My Team(s) at that item, with its division auto-opened and breadcrumbs intact (Home: Epic J — Acceptance criteria).
- AC-45: The directory shows no product thumbnails, coverage tables, catalog drawer or team codes (Home: Epic J — Acceptance criteria).
- AC-46: Every card headline names the consequence and its button names the action. No headline states an internal system state, and no card uses a banned term (Home: Epic J — Acceptance criteria).
- AC-47: Every card uses its Epic I headline, not the Epic C internal name (Home: Epic J — Acceptance criteria).
- AC-48: C-03 names the specific affected divisions or teams, not just a count (Home: Epic J — Acceptance criteria).
- AC-49: Every label on a card matches the owning spec's current label. No retired term is used (Home: Epic J — Acceptance criteria) ⚠ open question OI-9.
- AC-50: When Home renders, it has written no store data other than the rep's own resume events (Home: Epic J — Acceptance criteria).
- AC-51 (implied): A tab label shows a dot, not a number, when a Blocking condition links to it. Informational conditions add no dot (Home: Epic A — The Home tab & workspace navigation) ⚠ open question OI-8.
- AC-52 (implied): With more than five rows, "Recently worked on" shows five and expands to 15. Events older than 30 days aren't shown (Home: Epic D — Collapse, ordering & expiry).
- AC-53 (implied): With no deep link, Home opens on workspace entry. A deep link opens its target directly (Home: Epic A — The Home tab & workspace navigation).
- AC-54 (implied): The Setup Guide link on Home opens the guide on card 1 in any store state, whatever has been seen before (Home: Epic B — Interaction with the two existing auto-presenting sequences).

## 9. Dependencies & Assumptions

- **Tabbed Store Dashboard shell must change** from five fixed tabs to six with Home first. The amendment is in unpublished Appendix A (Home: Epic A) ⚠ open question OI-1 ⚠ open question OI-2 ⚠ open question OI-29.
- **Settings must adopt "Point of Contact"** in place of "primary" before Home ships its tag (Appendix A, 8e) (Home: Epic F) ⚠ open question OI-12.
- **Settings Epic B lock list** must record that Team Logo and Team Colors don't lock after launch (Appendix A, 8d) (Home: Epic G) ⚠ open question OI-13.
- **Settings Epic A1** must add "Add from Team Database" to the manager card (Appendix A, 8b) (Home: Epic F) ⚠ open question OI-14.
- **Workspace header status chip** must show lifecycle vocabulary, not "Active" (Appendix A, 10) (Home: Epic I) ⚠ open question OI-28.
- **C-27 needs the Products Tab orphaned-state amendment** (a queryable orphaned state, catalog error treatment and a linkable filter) to land first. Home must not scan for missing category IDs itself (Home: Dependencies & Technical Constraints) ⚠ open question OI-30.
- **Owning tabs must provide linkable filters** for C-05, C-10 and C-23. This is the biggest unknown cost in the feature (Home: Dependencies & Technical Constraints) ⚠ open question OI-15.
- **Settings section keys must stay stable** as sections are added (Home: Dependencies & Technical Constraints).
- **Team Manager Portal scope** — recommended "no Home equivalent this version"; must be confirmed before build (Home: User persona & use cases) ⚠ open question OI-26.
- **C-26 candidate** (team artwork marks in "Needs vector") is not registered. It waits until Products Epic I has precise acceptance criteria (Home: Epic G).
- **Roster Management stats header must say "players"**, matching Home. Cross-check: it says "divisions · teams · players" (Roster Management: Epic 0 — League structure: divisions & teams).
- **Assumption — Setup Guide and Close Report keep their own triggers and "seen" flags**: per rep per store type for the Guide, per user per close event for the Report (Home: Dependencies & Technical Constraints) ⚠ open question OI-5.
- **Database changes are limited to the resume-event record** (Home: Dependencies & Technical Constraints).

## Open items

All open items are sent to `consolidator-store-home-confluence` and are tracked in the run's question file.

- ⚠ OI-1 — Tab set and order: six tabs (Home) vs "fixed at five" in Tabbed Store Dashboard.
- ⚠ OI-2 — Appendix A (amendments 8b, 8d, 8e, 10) is referenced but not published.
- ⚠ OI-3 — Launch gate: "visible product" (Home, Products, Tabbed Store Dashboard) vs "product added" (Store Status & Lifecycle, Launch & Status Controls).
- ⚠ OI-4 — C-15 trigger: 7 days (C-14's trigger) or 14 days.
- ⚠ OI-5 — C-17 needs the Close Report "seen" flag, which Home says it never reads; C-17 may never be visible.
- ⚠ OI-6 — "24 registered conditions" vs 25 active IDs (C-01 to C-24 plus C-27).
- ⚠ OI-7 — The cost-of-delay rank within a tier isn't recorded anywhere.
- ⚠ OI-8 — Whether Action-tier conditions add a tab dot.
- ⚠ OI-9 — Orders still says "approved" and "container"; Home bans both.
- ⚠ OI-10 — Invite status wording: Settings "Active"/"Invited · not logged in" vs Home "Portal access active"/"Invited, not signed in".
- ⚠ OI-11 — Settings sets the designated manager inside the manager modal; Home says the modal doesn't.
- ⚠ OI-12 — "Point of Contact" tag vs "primary" label still used in Settings and Step 1.
- ⚠ OI-13 — Team Logo/Colors post-launch lock: Home says never locked; Settings lock list is still TBD.
- ⚠ OI-14 — "Add from Team Database" on the Settings manager card is still OPEN in Settings.
- ⚠ OI-15 — Link targets for C-05, C-10, C-15 (and possibly C-23) don't exist in the owning specs.
- ⚠ OI-16 — C-19 "accepted" coverage gap: Settings has no way to accept a gap.
- ⚠ OI-17 — C-20 open/settled PO state isn't defined anywhere; trigger lacks "store is Closed".
- ⚠ OI-18 — C-18 trigger (not shipped) vs clear rule (Delivered) for shipped-but-not-delivered orders.
- ⚠ OI-19 — No card for an assigned division/team manager with no address, although it blocks submission.
- ⚠ OI-20 — C-11 "Retry" and C-16 "Launch store" buttons vs Home "routes only"; no "render failed" state in Products.
- ⚠ OI-21 — C-12: reps do see "Incomplete" on the Products tab, so the card wording is undecided.
- ⚠ OI-22 — "Oldest age" required on C-05, but C-05 copy has none and "oldest" isn't defined.
- ⚠ OI-23 — Draft card population: C-07, C-21–C-24 and C-27 unlisted; C-05 gating unclear.
- ⚠ OI-24 — Exact tab label: "My Team(s)" vs "My Team"/"My Teams" in Roster Management.
- ⚠ OI-25 — Reports spec doesn't define the Store Close Report entry that C-17 links to.
- ⚠ OI-26 — Team Manager Portal equivalent of Home: open decision.
- ⚠ OI-27 — Summary rail: four rows vs "each tab"; undefined "summary strip"; total raised optional or required.
- ⚠ OI-28 — Header status chip has no owning spec; "Active" claim about Launch & Status Controls is out of date.
- ⚠ OI-29 — Setup Guide card 2 still teaches five tabs without Home.
- ⚠ OI-30 — C-27: Products amendment landed, but its open conflicts with Product Categories are unresolved; "Uncategorized" wording clash.
- ⚠ OI-31 — 7-day invite threshold (C-24) and 14-day lead time (C-15) are numbers Home defines itself.
- ⚠ OI-32 — C-21/C-22 "kept" decision isn't stored by Settings, so kept records would never clear.
