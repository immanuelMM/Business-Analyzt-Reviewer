# Implementation Summary — Store Home (Home Tab)
Sources: `input/requirements/Team-Store-Confluence/Store Workspace/Store Home (Home Tab).md` (Confluence page 4308860929, last modified 2026-10-13, pulled 2026-10-26). Cross-checked against the other 54 Markdown pages under `input/requirements/Team-Store-Confluence/`.

How to read the references:
- "Home: Epic C" means the Store Home page, section "Epic C".
- References to other pages use that page's short name, e.g. "Settings: Epic A2c" for Store Settings (Settings Tab).
- Card IDs (C-01 … C-27) are the spec's own IDs for attention cards.
- "OI-n" points to an open question. All of them are listed at the end and answered in `clarification-questions.md`.

## 1. Scope

**In scope**
- A new **Home** tab inside a single store's workspace. It is the first of six tabs. ⚠ open question OI-17 (Home: Epic A — The Home tab & workspace navigation)
- Home always has these three working parts:
  - **Needs your attention:** a short, ranked list of problems in the store that the rep can fix. Each card links to the screen that fixes it. (Home: Epic C)
  - **Recently worked on:** the rep's own recent edits in this store, each with a link back. ⚠ open question OI-1 (the section's name) (Home: Epic D)
  - **In your store:** a summary rail (a strip of counts) with one row per tab. (Home: Epic E)
- Three further panels:
  - **Team Managers.** (Home: Epic F)
  - **Brand assets:** logo, colors and theme color. (Home: Epic G)
  - **League structure directory**, on League stores only. (Home: Epic H)
- A dot on tab labels when that tab has a serious open problem. (Home: Epic A)
- A link that reopens the Setup Guide. On Closed and Archived stores, a route to the Close Report. (Home: Epic B)
- One new saved record: the rep's "recently worked on" events. (Home: Dependencies & Technical Constraints)

**Out of scope** (Home: Out of scope)
- Attention across several stores (a workspace-level "everything that needs me"). The workspace Overview is named as its future home.
- Notifications or emails triggered by attention cards.
- Snoozing or dismissing cards, or assigning a card to someone else.
- A full activity or audit log.
- Letting each rep choose which cards appear.
- Home saving its own copy of any store data.
- Letting a rep or store pick a different landing tab. (Home: Epic A)
- A fundraising goal or progress bar. No goal field exists. (Home: Epic E)
- Hosting any of these on Home: "Change Team", "Add from Team Database", the Store Point of Contact mode selector, or the League structure editor. Home links to them instead. (Home: Epic F, G, H)
- Card C-26 (a team logo still marked "Needs vector"). It is a candidate only and stays unregistered until Products Tab Epic I is written in more detail. (Home: Epic G)

## 2. Actors & Roles
- **Rep (store owner):** the only user of Home. A rep runs one store at a time, in any lifecycle state. (Home: User persona & use cases)
- **Co-managing reps:** when two reps manage the same store, each rep sees only their own "Recently worked on" list. (Home: Epic D)
- **Team managers:**
  - They are not Home users in this version.
  - Whether the Team Manager Portal gets an equivalent of Home is still open. The spec recommends no.
  - Other specs say team managers sign in to the workspace itself, so they might see Home. ⚠ open question OI-13 ⚠ open question OI-31
  - If team managers are ever included, the list of conditions must be filtered by permission. Disabled actions are not acceptable. (Home: Dependencies)
- **Buyers (parents, players, fans) and the system:** their actions never appear in a rep's "Recently worked on" list. (Home: Epic D)

## 3. Business Rules

**Home stores nothing of its own**
- BR-1: Home saves no store data. It only reads data that other tabs own and shows it. The one exception is the rep's "Recently worked on" record (Epic D), which is data about the rep, not the store. (Home: Governing rule 1 — Home is derived, and derives only from published state)
- BR-2: Home never calculates a figure again itself. For example, "below MOQ" (the minimum order quantity), "days left" and "n to submit" all come from the tab that owns them. If Home and a tab disagree, the tab is right and Home has a bug. (Home: Governing rule 1 — Home is derived, and derives only from published state)
- BR-3: Home uses the same labels as the tab that owns each item. It never invents a second name. (Home: Governing rule 1 — Home is derived, and derives only from published state)
- BR-4: Home never blocks or gates anything. The rep doesn't have to visit it or acknowledge anything on it. (Home: Governing rule 1 — Home is derived, and derives only from published state)
- BR-5: Home may host an existing editor, but only if three things hold. The editor writes the same saved field. It keeps all of its validation and warnings. And a change made on Home looks exactly like the same change made on the owning screen. If an editor can't meet all three, Home links to the owning screen instead. (Home: Governing rule 1 — Home is derived, and derives only from published state)
- BR-6: A new attention card is added only by registering it in the Epic C catalogue. The entry gives the owning spec, tier, trigger and where the card links to. A condition with no owning spec can't ship. (Home: Governing rule 1 — Home is derived, and derives only from published state)

**Severity tiers**
- BR-7: Every condition has one fixed tier, and the tier never changes over time. If urgency depends on time, the spec defines two separate conditions instead, e.g. C-14 and C-15. (Home: Governing rule 2 — Severity tiers)
  - **Blocking:** buyers, orders or fulfillment are stopped right now. Red rail; the button is a primary button. Blocking cards always come first.
  - **Action:** rep work is waiting and costs something if it keeps waiting. Blue rail; the button is a secondary button. Action cards come second.
  - **Informational:** something the rep should know. Neutral rail; the action is a link, or there is no action. Informational cards come last.
- BR-8: Home doesn't use amber anywhere. Screens Home links to may still show amber, e.g. the "No products yet" state and an unactivated invite. (Home: Governing rule 2 — Severity tiers)
- BR-9: A Blocking card always says who is blocked, e.g. "Customers can't order this yet". It doesn't name the internal state. (Home: Governing rule 2 — Severity tiers)
- BR-10: The tier is never shown as a label on the card. For example, there is no "BLOCKING" heading. Only the rail color shows severity. (Home: Epic I — The tier is not displayed on the card)

**Guidance without a checklist**
- BR-11: Each card appears only because a query found a matching record. When the underlying state changes, the card goes away. (Home: Governing rule 3 — Guidance without a checklist)
- BR-12: An empty attention list is the normal, good state. Home must never fill it with tips, checklists, "next steps" or Informational filler. (Home: Governing rule 3 — Guidance without a checklist)
- BR-13: There are no first-visit hints per tab, and no tracking of which tabs the rep has visited. (Home: Governing rule 3 — Guidance without a checklist)
- BR-14: No completion percentage, readiness score or progress language appears anywhere on Home. (Home: Epic I — Product vocabulary)

**Navigation and the workspace header**
- BR-15: The tabs appear in this order: Home, My Team(s), Products, Orders, Reports, Settings. ⚠ open question OI-17 (Home: Epic A — The Home tab & workspace navigation)
- BR-16: The Home tab always appears and is always enabled, in every store state (Draft, Open, Closed, Archived), on both store types (Individual Team, League) and in both distribution formats (pop-up, always-on). Only the cards inside it change. (Home: Epic A — The Home tab & workspace navigation)
- BR-17: Home is the tab that opens when the rep enters a store workspace without a deep link. A deep link to another tab, Settings section or My Team(s) division always opens that place directly. (Home: Epic A — The Home tab & workspace navigation)
- BR-18: A tab label shows a dot when at least one Blocking condition links to that tab. The dot shows that something is there; it doesn't show a count. Informational conditions never add a dot. ⚠ open question OI-4 (whether Action-tier conditions add a dot) (Home: Epic A — The Home tab & workspace navigation)
- BR-19: The workspace header stays the same: the status chip, storefront URL, Preview Store and the Setup Guide link. Home may repeat header information, but it never edits it. ⚠ open question OI-19 (Home: Epic A — The Home tab & workspace navigation)

**Setup Guide and Close Report**
- BR-20: When its trigger is met, the Setup Guide or the Close Report sequence appears on top of Home. Home stays usable underneath and after the sequence is closed. The two can never fire together, so no rule for ordering them is needed. (Home: Epic B — Interaction with the two existing auto-presenting sequences)
- BR-21: Home never reads or writes the "already seen" flag of either sequence. (Home: Epic B — Interaction with the two existing auto-presenting sequences)
- BR-22: Home always shows a link to reopen the Setup Guide. It behaves exactly like the header control: it opens on card 1 with no forced pacing, whatever the seen-state. (Home: Epic B — Interaction with the two existing auto-presenting sequences)
- BR-23: On Closed and Archived stores, Home shows a route to the Close Report. Store Status & Lifecycle (Epic H) owns whether the report is available and how it behaves. ⚠ open question OI-30 (Home: Epic B — Interaction with the two existing auto-presenting sequences)

**Needs your attention: how cards are listed**
- BR-24: Only conditions registered in the catalogue (see table below) produce a card. The active IDs are C-01 to C-24 and C-27. C-25 is retired and its number must never be reused. ⚠ open question OI-7 (Home: Epic C — Needs your attention: the attention-card catalogue)
- BR-25: Cards are ordered Blocking, then Action, then Informational. Within a tier, a fixed rank per condition decides the order (not how recent or how many). The same store state always gives the same order. ⚠ open question OI-5 (no rank is listed) (Home: Epic C — Presentation, ordering & limits)
- BR-26: At most 5 cards show. Any extra cards sit behind an "n more" expander. Blocking cards are never hidden behind the expander, so if more than 5 Blocking cards hold, they all show. (Home: Epic C — Presentation, ordering & limits)
- BR-27: There is one card per condition, not one per record. For example, 4 pending orders produce one C-01 card that says "4". (Home: Epic C — Presentation, ordering & limits)
- BR-28: C-01, C-05 and C-06 must show the age of the oldest affected record, e.g. "Oldest placed 3 days ago". ⚠ open question OI-6 (Home: Epic C — Presentation, ordering & limits)
- BR-29: The rep can't dismiss, snooze or mark a card done. A card clears only when its underlying state clears. If the rep wants to accept a condition rather than fix it, they do that on the owning screen, e.g. by submitting short or deleting the bundle. (Home: Epic C — Presentation, ordering & limits)
- BR-30: When no conditions hold, the section still shows. It says plainly that nothing needs the rep and names the store's current lifecycle state. (Home: Epic C — Presentation, ordering & limits)
- BR-31: Each card has exactly one primary action. If a condition has two possible fixes, it becomes two conditions, or the card links to a screen that offers both. ⚠ open question OI-34 (Home: Epic C — Presentation, ordering & limits)
- BR-32: A condition can't be registered if it would be true on a well-run store. For example, the "players with no contact details" card (C-25) was withdrawn because most stores have such players. (Home: Epic C — Presentation, ordering & limits)
- BR-33: When C-03 and C-08 both hold for the same division, only C-03 shows. C-03 must name the affected divisions or teams, e.g. "Division 3 and Division 7", not just give a count. (Home: Epic C — C2 — My Team(s))
- BR-34: C-03 and C-04 stay as two separate cards, because they link to different controls. Both can show at the same time. (Home: Epic C — C1 — Orders)
- BR-35: C-14 and C-15 stay as two separate cards. C-14 follows the days-left pill's urgent range, which is the last 7 days. C-15 fires at 14 days. ⚠ open question OI-3 ⚠ open question OI-11 ⚠ open question OI-37 (Home: Epic C — C4 — Lifecycle & schedule)
- BR-36: C-24 fires when an invite hasn't been activated for 7 days. ⚠ open question OI-11 (Home: Epic C — C5 — Settings & access)
- BR-37: C-05 counts a player who opted out ("I already own this") as satisfied. Home doesn't offer Send Reminder; it only links to the players. (Home: Epic C — C1 — Orders)
- BR-38: Home has no card for anything already blocked at save, e.g. uncategorized products, or League TR/TS items assigned to no team. (Home: Epic C — C3 — Products)
- BR-39: "Teams with no roster" and "incomplete roster" are never cards, because rosters are optional. A pending-order line that differs from the roster is not a card either. (Home: Epic C — C2 — My Team(s); Roster: Epic 2)

**Which cards can appear, by store state and type**
- BR-40: Draft stores can show C-04, C-08, C-09, C-16 and C-10 to C-13. They never show order, Roster Bank or ordering-window cards. ⚠ open question OI-8 (Home: Epic C — Which cards populate the list, by store state and store type)
- BR-41: Open stores can show every card except C-09, C-16, C-17, C-18 and C-20. (Home: Epic C — Which cards populate the list, by store state and store type)
- BR-42: Closed stores can show most cards, including Action tier, plus C-17, C-18 and C-20. They never show C-14. (Home: Epic C — Which cards populate the list, by store state and store type)
- BR-43: Archived stores show no cards. The section still appears and says the store is archived and read-only. No card is shown greyed out. (Home: Epic C — Which cards populate the list, by store state and store type)
- BR-44: Individual Team stores never show C-07 or C-08. Always-on stores never show C-14, C-15 or C-19. ⚠ open question OI-14 (Home: Epic C — Which cards populate the list, by store state and store type)

**Attention-card catalogue** (Home: Epic C — C1 to C5; card text from Home: Epic I — Rep-facing headlines). The "Condition" column is an internal name only. Never show it to the rep.

| ID | Condition (internal) | Tier | Shows when | Button → goes to | Clears when |
| --- | --- | --- | --- | --- | --- |
| C-01 | Pending orders awaiting submission | Action | ≥1 storefront order is pending (not yet submitted) | "Go to Pending Orders" → Orders → Pending Orders | All pending orders submitted or cancelled |
| C-02 | Shipping group below MOQ | Informational | ≥1 pending group is below its minimum quantity | "View group" → Pending Orders, scrolled to that group | Group reaches MOQ, or is submitted short |
| C-03 | Manager unassigned, orders waiting ⚠ OI-25 | Blocking | ≥1 pending group has no group/team manager | "Assign managers" → Settings → Distribution & Fulfillment, affected division opened | Every group has a manager |
| C-04 | No ship-to address | Blocking | Ship to Team Manager and the destination address is empty | "Add address" → Settings → Distribution & Fulfillment → Fulfillment Method | A verified address exists |
| C-05 | Players missing required gear ⚠ OI-32 | Action | ≥1 committed player hasn't ordered Team Required gear | "View players" → My Team(s) store-wide player view, filtered to incomplete | All required gear ordered or opted out |
| C-06 | Roster Bank captures to review | Action | ≥1 pending capture in the Roster Bank | "Open Roster Bank" → My Team(s) store-wide Roster Bank | All captures committed or dismissed |
| C-07 | Teams with no products (League) ⚠ OI-34 | Action | ≥1 team has zero products, direct or via its division | "Review coverage" → My Team(s) canvas or division coverage table | Every team has ≥1 product |
| C-08 | No fulfillment manager (League, Ship to Team Manager) | Action | ≥1 division/team shows "Not assigned" | "Assign managers" → Settings → Distribution & Fulfillment | Every division/team has a manager |
| C-09 | No visible products (Draft) ⚠ OI-18 | Blocking | Catalog has zero visible products | "Go to Products" → Products → Catalog | ≥1 product visible |
| C-10 | Images still generating | Action | ≥1 decorated product in "Render pending" | "View products" → Catalog, filtered | Renders land, or item undecorated |
| C-11 | Image generation failed ⚠ OI-10 ⚠ OI-36 | Blocking | ≥1 product's render failed | "Retry" → that product's detail page | Retry succeeds |
| C-12 | Bundle has one item left ⚠ OI-33 | Blocking | ≥1 bundle in the Incomplete state (one member) | "Fix bundles" → bundle detail → Members | Second member added, or bundle deleted |
| C-13 | Sizing not confirmed ⚠ OI-35 | Action | ≥1 product's application sizing not fully confirmed | "Confirm sizing" → product detail → Application Sizing | Sizing confirmed on every row |
| C-14 | Window closing soon ⚠ OI-37 | Informational | Open store, set window, days-left pill is urgent (7 days) | "Edit Store Schedule" → Settings → Schedule & Status | Window closes or close date moves out of range |
| C-15 | Closing with players missing gear ⚠ OI-3 | Action | C-14 and C-05 both hold (fires at 14 days) | "View players" → My Team(s) incomplete-player view | Either trigger clears |
| C-16 | Draft ready to launch ⚠ OI-10 ⚠ OI-18 | Action | Draft and ≥1 visible product | "Launch store" → header Launch control | Store becomes Open |
| C-17 | Close Report not viewed ⚠ OI-29 ⚠ OI-30 | Informational | Closed, and this user hasn't seen this close event's report | "View report" → Reports → Store Close Report | Report viewed or dismissed |
| C-18 | Orders still in production ⚠ OI-28 | Informational | Closed with ≥1 order not shipped | "View orders" → Orders → All Orders | All Delivered or cancelled |
| C-19 | Days with no team able to order ⚠ OI-16 | Action | Per-team-code scheduling, gap detection flags ≥1 day | "Review schedule" → Order Window Scheduler | Gap closed or accepted |
| C-20 | Unpaid orders after close ⚠ OI-15 ⚠ OI-27 | Action | ≥1 order in the window with an open PO | "View orders" → All Orders, filtered | PO settles |
| C-21 | Managers from the previous team | Action | ≥1 manager record from a team the store is no longer connected to | "Review managers" → Settings → General → Manager Information | Records kept or removed |
| C-22 | Previous-team manager still has access | Blocking | C-21 holds and that person has an active or pending invite | "Review access" → Settings → People & Access | Access revoked, or record confirmed kept |
| C-23 | Fundraising off, items still collecting | Informational | Fundraising read is "disabled-with-exemptions" | "View products" → Catalog, filtered to those items | No such item remains, or fundraising back on |
| C-24 | Invites never activated ⚠ OI-9 ⚠ OI-11 | Informational | ≥1 invite "Invited · not logged in" for 7+ days | "Review invites" → Settings → People & Access | Invite activates or is revoked |
| C-27 | Products not in a category ⚠ OI-40 | Action | ≥1 product's category was deleted at workspace level | "Re-file products" → Catalog, "Uncategorized" filter | Every affected product re-filed |

**Recently worked on**
- BR-45: Home records an event only when the rep's own edit saves, on a screen that has a stable deep link, in this store. Reads, filters, sorts, searches, tab switches, deletions, and edits by other reps, managers, buyers or the system never count. (Home: Epic D — What qualifies)
- BR-46: A bulk action records one event. For example, a CSV import of 40 players is one event: "imported 40 players". (Home: Epic D — What qualifies)
- BR-47: Repeated edits to the same entity on the same screen collapse into one row, timed at the latest edit. (Home: Epic D — Collapse, ordering & expiry)
- BR-48: The list shows 5 rows, newest first, and expands to show up to 15. Events expire after 30 days. (Home: Epic D — Collapse, ordering & expiry)
- BR-49: The section doesn't appear at all when the rep has no events. A row whose target has been deleted is quietly left out. (Home: Epic D — Presentation)
- BR-50: Each row shows the entity, the screen and a relative time. The button says "Open" or "Go to …", never "Resume". The rows are never styled as a to-do list or as progress. (Home: Epic D — What it is; Presentation)
- BR-51: The row label is built when the list is shown, from the item's current name. For example, "Home Jersey — pricing" shows the product's new name if it has been renamed since. (Home: Epic D — The resume record)
- BR-52: On Archived stores the list is read-only and links to the read-only screens. (Home: Epic D — Presentation)

**In your store rail**
- BR-53: The rail has one row each for My Team(s), Products, Orders and Reports, in tab order. Each label exactly matches its tab label; the first row says "My Team(s)", not "Rosters". ⚠ open question OI-12 ⚠ open question OI-39 (Home: Epic E — In your store (summary rail))
- BR-54: Roster entries are always called "players", never "members". The My Team(s) stats header also says "players". (Home: Epic E — In your store (summary rail); Roster: Epic 0)
- BR-55: Each row shows the tab's headline count. Where one exists, it adds the same figure the attention card shows, e.g. "148 players · 5 Roster Bank captures" or "24 orders · 4 to submit". Player counts don't include captures. Rows show even when the count is 0. (Home: Epic E — In your store (summary rail))
- BR-56: The Reports row is only a link. Home doesn't show revenue, dealer profit or fundraising breakdowns. Home may show the window's total raised as a plain figure, with no bar and no goal. (Home: Epic E — In your store (summary rail))

**Team Managers panel**
- BR-57: The panel reads and writes the same manager list that Settings (Epic A2c), Step 1 and coach import use. Home keeps no separate copy. (Home: Epic F — Team Managers panel)
- BR-58: Each row shows Name, Email, Phone and Contact Preference. The panel title is "League Manager Information" on League stores and "Team Manager Information" on Individual Team stores. (Home: Epic F — Team Managers panel)
- BR-59: Whether the designated manager is tagged "Point of Contact" depends on the contact mode set for each channel (email and phone). The tag also shows when the store has only one manager. It's never shown as "Primary" or "Primary Contact". ⚠ open question OI-20 (Home: Epic F — Team Managers panel)
  - At least one channel on Team Manager mode: the designated record is tagged "Point of Contact".
  - Only one channel on Team Manager mode: the tag names that channel, e.g. "Point of Contact · email".
  - Both channels on Salesperson or Custom: no row is tagged. The panel footer says who buyers actually see and links to the setting.
- BR-60: Home never changes which manager is the point of contact. It links to Settings → General for that. ⚠ open question OI-21 (Home: Epic F — Designating the point of contact)
- BR-61: "Add manager" opens the existing manager edit modal with all its fields and validation: First Name, Last Name, Email, Phone Number, Street Address and Contact Preference. Adding a manager never changes the point of contact. (Home: Epic F — Team Managers panel)
- BR-62: "Add manager" is the only add action on Home. To import a coach from the Team Database, the rep goes to Settings → General. ⚠ open question OI-22 (Home: Epic F — Availability)
- BR-63: Removing a manager from Home is blocked if no designated manager would be left. The block states the reason and links to Settings → General. (Home: Epic F — Designating the point of contact)
- BR-64: Adding, editing or removing a manager never creates, changes or removes portal access. The modal opened from Home says so and links to Settings → People & Access. (Home: Epic F — Adding a manager grants no access, and Home must say so in place)
- BR-65: Each manager row with an email offers "Invite", which links to People & Access. If the person already has an active or pending invite, the row shows that status instead of the button. ⚠ open question OI-9 ⚠ open question OI-24 (Home: Epic F — Team Managers panel)
- BR-66: Removing a manager who has an invite leaves the invite active. The confirmation says so and links to People & Access. (Home: Epic F — Adding a manager grants no access, and Home must say so in place)
- BR-67: When the point of contact's email or phone is edited from Home, the storefront footer updates straight away. The modal says so before saving. (Home: Epic F — Point-of-contact propagation)
- BR-68: The panel can be edited in every store state, because the manager list never locks after launch. On Archived stores it is read-only. (Home: Epic F — Availability)

**Brand assets panel**
- BR-69: The panel shows and edits Team Logo, Team Colors and Store Theme Color. It uses the existing Step 1 and Settings controls and the Prolook color picker; nothing is built new. (Home: Epic G — Brand assets panel)
- BR-70: The team artwork library is only linked, with a note that it belongs to the team, not the store. Changes there affect every store that team has. ⚠ open question OI-38 (Home: Epic G — Brand assets panel)
- BR-71: The theme color shows where it came from ("Team default" or "Custom") and offers "Reset to team color" on a custom value. Helper text says the color applies to "buttons and accents only". Home must keep the color's source flag; it can't be worked out from the color value alone. (Home: Epic G — Theme color behavior is inherited whole; Dependencies)
- BR-72: Home doesn't host "Change Team". It links to the Edit Store Details modal instead. (Home: Epic G — Theme color behavior is inherited whole)
- BR-73: The whole panel stays editable after launch. It is read-only on Archived stores. ⚠ open question OI-23 (Home: Epic G — Availability)

**League structure directory**
- BR-74: The directory shows only on League stores, and it is read-only. On Individual Team stores it doesn't appear and the rest of Home is unchanged. (Home: Epic H — League structure directory)
- BR-75: The directory shows the same divisions · teams · players counts as the My Team(s) stats header. Below that come the division rows with their teams nested inside, then standalone teams. Each row shows its player count, plus its pending Roster Bank capture count when there are any. (Home: Epic H — League structure directory)
- BR-76: Divisions always start collapsed, whatever the league's size. Whether a division is open lasts only for the session and isn't saved. The panel has a fixed maximum height and scrolls. (Home: Epic H — League structure directory)
- BR-77: Clicking a row opens My Team(s) at that division or team. The containing division opens automatically and the breadcrumbs stay intact. (Home: Epic H — League structure directory)
- BR-78: The directory never shows team codes, product thumbnails, product-count pills, coverage tables or the catalog drawer. (Home: Epic H — League structure directory)

**Card wording**
- BR-79: Each card's headline names the consequence and its button names the action. Card text comes from the Epic I table (see catalogue), never from the internal condition name. (Home: Epic I — Card copy)
- BR-80: Banned words on Home include "container" (say "group"), "below MOQ", "render gate", "blocked", "Active" (say "Open"), and "Primary" / "Primary Contact" as a manager tag. The full list is in the Epic I table. ⚠ open question OI-26 (Home: Epic I — Card copy; Product vocabulary)
- BR-81: Home's wording must use the product's current labels as of September 3, 2026. Examples: Stock Vault, Catalog Templates, Customizer, Other stores, My Team(s), Roster Bank, Pending Orders, Submit, Open, Closed, Draft, Archived, Point of Contact. Re-check the wording whenever a label changes. (Home: Epic I — Product vocabulary)
- BR-82: Cards never scold. There is no "you forgot", no "overdue", and no red on an Informational card. C-18, C-20 and C-23 deliberately reassure the rep, e.g. "nothing needed from you". (Home: Epic I — Product vocabulary; Rep-facing headlines)

## 4. Data
- **Resume event (new, the only new saved record):** (Home: Epic D — The resume record; Dependencies)
  - What it holds: the acting rep, the store, a surface key (the existing deep-link key), an optional entity reference, a field-group or operation ID, and a timestamp.
  - Each screen opts in to writing events. Don't use one hook on every save, because that would catch buyer and system writes.
  - When the list is read, events are collapsed (same screen + same entity), events older than 30 days are dropped, and only the requesting rep's events are returned.
  - A purge or retention rule for old events isn't stated.
- **Everything else is read from the tab that owns it.** Home keeps no store data of its own. Examples: (Home: Governing rule 1; Dependencies)
  - pending orders and MOQ status (Orders)
  - freight routing (Orders and Settings)
  - render state, Incomplete bundles, visible-product count and orphaned categories (Products)
  - the three-state fundraising read (Settings A4)
  - days left and coverage gaps (Settings E)
  - invite status (Settings A2b)
  - which team each manager was imported from (Settings A1)
  - captures and player counts (My Team(s))
- **Fields Home edits** all belong to Settings: (Home: Epic F, Epic G; Dependencies)
  - the manager list, with exactly one designated record
  - Team Logo and Team Colors
  - the store theme color and its source flag
- **Expanded divisions and the "n more" state** last only for the session and aren't saved. (Home: Epic C, Epic H)

## 5. Flows
- **Entering a store:** (Home: Epic A; Epic B)
  1. With no deep link, Home opens.
  2. If the Setup Guide or Close Report trigger holds, that sequence appears over Home first.
  3. When the rep closes it, Home is there underneath.
  4. With a deep link, the target opens directly.
- **Rendering Home:** (Home: Dependencies — attention-condition resolver)
  1. A resolver (the backend read that works out which cards apply) runs on every workspace entry.
  2. It decides which conditions to check from the store's state and type. Archived stores get an empty set with an "archived" reason code.
  3. It returns the conditions that hold, each with its count, oldest age, tier and link.
  4. Blocking conditions are worked out first, so the most important cards are never the last to appear.
- **Acting on a card:**
  1. The rep presses the card's single button.
  2. The owning screen opens, already scoped or filtered to the affected records.
  3. The rep fixes the problem there.
  4. The card is gone the next time Home renders.

  (Home: Epic J — Acceptance criteria; Epic C)
- **Recently worked on:**
  1. The rep saves an edit on a screen that qualifies.
  2. An event is recorded.
  3. On Home, the event shows as a row.
  4. "Open" takes the rep back to that screen and item.

  (Home: Epic D)
- **Adding a manager from Home:**
  1. The rep selects "Add manager".
  2. The shared manager modal opens, with a note that adding a manager grants no portal access.
  3. The rep saves.
  4. The row appears with "Invite" if it has an email.
  5. "Invite" takes the rep to People & Access.

  (Home: Epic F)
- **Removing a manager:**
  - Alternate path: if the record is the designated point of contact, removal is blocked with the reason and a link to Settings → General.
  - Alternate path: if the person has an invite, the confirmation says access stays until it is revoked in People & Access.

  (Home: Epic F)
- **Archived store:** every panel is read-only. The attention section says the store is archived and read-only, and no actions are offered. (Home: Epic C; Epic D; Epic F; Epic G; Epic H)

## 6. Integrations
- **Owning services Home reads from:** the shared internal order, roster, catalog, store-config and reporting services. Home must use each service's own query, not a copy of its logic. (Home: Dependencies)
- **Deep-link routes** are reused, never re-invented: (Home: Dependencies — Deep-link routing)
  - Settings section keys, which must stay stable when sections are added.
  - My Team(s) division jump-ins, with the targeted division opened automatically.
  - The Products catalog's "scroll to and focus" return path.
  - The Orders sub-tab and filter state.
- **Filters the owning tabs don't have yet** must be added there as states that can be linked to. Home's Dependencies section calls this "the most likely source of hidden scope". Audit what exists before estimating. ⚠ open question OI-32 (Home: Dependencies — Deep-link routing)
  - C-05: a store-wide player view filtered to incomplete players.
  - C-10: a render-pending filter.
  - C-23: an exempted-items filter.
- **Setup Guide:** Home's link calls the existing reopen path. **Close Report:** Home links to the report owned by Store Status & Lifecycle (Epic H). (Home: Epic B; Dependencies)
- **No notifications or emails** come from Home. (Home: Out of scope)

## 7. Non-Functional
- **Performance:** the resolver must be cheap enough to run on every workspace entry. Some checks are heavy on large stores, e.g. the roster-to-orders join for C-05, product coverage for C-07 and the catalog-wide fundraising read for C-23. Conditions are worked out progressively, Blocking first. The spec chose this over working everything out at once or caching it briefly. (Home: Dependencies & Technical Constraints)
- **Accuracy:** every count on Home must exactly match the owning tab. The target number of Home/tab disagreements is zero. (Home: Governing rule 1; Metrics & Success Criteria)
- **Security and access:** no route from Home may create, infer or revoke a portal entitlement. Removing a manager must not touch the invite table. (Home: Dependencies)
- **Scale:** the League directory has a bounded height so it can never push the attention list off the screen. (Home: Epic H; Dependencies)
- **Gating sits in the resolver, not the view:** League-only checks don't run on Single-Team stores, and window checks don't run on always-on stores. (Home: Dependencies)
- **Measurement:** the spec lists success metrics to instrument. Examples: share of conditions resolved within one session, time from Blocking to resolved, and share of sessions where Home is the only tab visited. (Home: Metrics & Success Criteria)

## 8. Acceptance Criteria
- AC-1: When a rep opens a store workspace, the Home tab is present and first in the navigation. (Home: Epic J — Acceptance criteria)
- AC-2: In every store state, store type and distribution format, the Home tab is present and enabled. No configuration shows five tabs. (Home: Epic J — Acceptance criteria)
- AC-3: In every store state, the Needs your attention section and the In your store rail both appear. Neither is ever hidden or disabled. (Home: Epic J — Acceptance criteria)
- AC-4: The rail's first row is labelled "My Team(s)", and roster entries are counted as "players". (Home: Epic J — Acceptance criteria)
- AC-5: No amber is used anywhere on Home. (Home: Epic J — Acceptance criteria)
- AC-6: When the Setup Guide or Close Report trigger is met, that sequence appears over Home, and Home is available once it is dismissed. (Home: Epic J — Acceptance criteria)
- AC-7: Every card matches a condition registered in Epic C. No card appears for an unregistered condition. (Home: Epic J — Acceptance criteria)
- AC-8: When more than one condition holds, cards are ordered Blocking, then Action, then Informational, and in the same order on every render for the same store state. ⚠ open question OI-5 (Home: Epic J — Acceptance criteria)
- AC-9: When more than 5 conditions hold, the top 5 show with an expander. If more than 5 are Blocking, all Blocking cards show. (Home: Epic J — Acceptance criteria)
- AC-10: Every card's count exactly matches the count on the owning tab. (Home: Epic J — Acceptance criteria)
- AC-11: A card's button takes the rep to the screen that owns the condition, scoped or filtered to the affected records where that screen supports it. (Home: Epic J — Acceptance criteria)
- AC-12: When a condition's state clears, its card is gone the next time Home renders. No card can be dismissed any other way. (Home: Epic J — Acceptance criteria)
- AC-13: When no conditions hold, the section says so plainly and shows nothing in place of cards. (Home: Epic J — Acceptance criteria)
- AC-14: On an Archived store, the section appears, says the store is archived and read-only, and no card has an action. (Home: Epic J — Acceptance criteria)
- AC-15: A Draft store with zero visible products shows C-09 at Blocking tier, and Home offers no launch action. ⚠ open question OI-18 (Home: Epic J — Acceptance criteria)
- AC-16: A Draft store with at least one visible product shows C-16, which links to the header launch control. ⚠ open question OI-18 (Home: Epic J — Acceptance criteria)
- AC-17: A qualifying write records a resume event against that rep, that store and the screen's existing deep-link key. (Home: Epic J — Acceptance criteria)
- AC-18: Repeated edits to the same item show as one row, timed at the latest edit. (Home: Epic J — Acceptance criteria)
- AC-19: Buyer orders, checkout write-backs, Roster Bank captures and system events record no resume event. (Home: Epic J — Acceptance criteria)
- AC-20: When two reps co-manage a store, each sees only their own list. (Home: Epic J — Acceptance criteria)
- AC-21: A row whose target was deleted is left out, with no error state. (Home: Epic J — Acceptance criteria)
- AC-22: When the rep has no qualifying events, the Recently worked on section is absent rather than empty. (Home: Epic J — Acceptance criteria)
- AC-23: No completion percentage, readiness score or setup-progress indicator appears anywhere on Home. (Home: Epic J — Acceptance criteria)
- AC-24: The Team Managers panel lists the same manager collection that Settings and Step 1 write. (Home: Epic J — Acceptance criteria)
- AC-25: When at least one channel is on Team Manager mode, the designated record is tagged "Point of Contact", even when it is the only record. It is never tagged "Primary" or "Primary Contact". ⚠ open question OI-20 (Home: Epic J — Acceptance criteria)
- AC-26: When only one channel is on Team Manager mode, the tag names that channel. (Home: Epic J — Acceptance criteria)
- AC-27: When both channels are on Salesperson or Custom, no row is tagged, and the panel says who buyers actually see. (Home: Epic J — Acceptance criteria)
- AC-28: Changing the point of contact routes to Settings → General; Home doesn't host it. ⚠ open question OI-21 (Home: Epic J — Acceptance criteria)
- AC-29: A removal from Home that would leave no designated record is blocked, with the reason and a link to Settings → General. (Home: Epic J — Acceptance criteria)
- AC-30: The manager modal opened from Home is the same modal Settings opens, with the full field set and validation and no Home-only version. (Home: Epic J — Acceptance criteria)
- AC-31: "Add manager" is the only add action. "Add from Team Database" isn't offered, and coach import routes to Settings → General. ⚠ open question OI-22 (Home: Epic J — Acceptance criteria)
- AC-32: No card shows its tier as a label. (Home: Epic J — Acceptance criteria)
- AC-33: No registered condition holds on a store with no outstanding work. (Home: Epic J — Acceptance criteria)
- AC-34: "Add manager" opens the existing modal with its full fields and validation, and says that adding a manager grants no portal access. (Home: Epic J — Acceptance criteria)
- AC-35: Adding, editing or removing a manager from Home gives the same result as doing it in Settings. No portal invite is created, changed or revoked. (Home: Epic J — Acceptance criteria)
- AC-36: Removing a manager with an active or pending invite shows a confirmation saying access stays until revoked in People & Access, with a link there. (Home: Epic J — Acceptance criteria)
- AC-37: When the point of contact's details are edited from Home on Team Manager mode, the storefront footer updates with no further action, and the modal said so before saving. (Home: Epic J — Acceptance criteria)
- AC-38: Team Logo, Team Colors and Store Theme Color use the existing Step 1 and Settings components and the Prolook picker, and all three stay editable after launch. ⚠ open question OI-23 (Home: Epic J — Acceptance criteria)
- AC-39: A manager row whose person has an active or pending invite shows that status instead of hiding the Invite action. ⚠ open question OI-24 (Home: Epic J — Acceptance criteria)
- AC-40: The theme swatch shows its source (Team default or Custom). "Reset to team color" is offered on a custom value, and helper text says "buttons and accents only". (Home: Epic J — Acceptance criteria)
- AC-41: The team artwork library is linked, with its team-level scope stated, and is not reproduced on Home. ⚠ open question OI-38 (Home: Epic J — Acceptance criteria)
- AC-42: On a League store, the directory shows divisions with nested teams, standalone teams separately, and the same counts as the My Team(s) stats header. Divisions are collapsed and the panel's height is bounded. (Home: Epic J — Acceptance criteria)
- AC-43: On an Individual Team store, the directory doesn't appear and Home is otherwise unchanged. (Home: Epic J — Acceptance criteria)
- AC-44: Selecting a directory row opens My Team(s) at that item, with the containing division opened and breadcrumbs intact. (Home: Epic J — Acceptance criteria)
- AC-45: The directory shows no product thumbnails, coverage tables, catalog drawer or team codes. (Home: Epic J — Acceptance criteria)
- AC-46: Every card headline names the consequence and every button names the action. No card states an internal system state or uses a banned word. (Home: Epic J — Acceptance criteria)
- AC-47: Card text is the Epic I headline for that condition, never the internal condition name. (Home: Epic J — Acceptance criteria)
- AC-48: C-03 names the specific affected divisions or teams, not just a count. (Home: Epic J — Acceptance criteria)
- AC-49: Every label on a card matches the label the owning spec currently uses. No retired terms. ⚠ open question OI-26 ⚠ open question OI-33 (Home: Epic J — Acceptance criteria)
- AC-50: After Home renders, the only data Home has written is the rep's resume event. (Home: Epic J — Acceptance criteria)

## 9. Dependencies & Assumptions
- **Appendix A amendments to other specs must land first,** but Appendix A is missing from the Markdown. ⚠ open question OI-2 (Home: Epic A; Epic F; Epic G; Epic I) These are the amendments:
  - The tab shell moves from five tabs to six (Tabbed Store Dashboard). ⚠ open question OI-17
  - Settings adopts "Point of Contact" (8e). ⚠ open question OI-20
  - Team Logo and Team Colors are added to the Settings lock-exemption list (8d). ⚠ open question OI-23
  - "Add from Team Database" goes on the Settings manager card (8b). ⚠ open question OI-22
- **The launch-gate rule must be agreed** ("visible" or "added") before C-09 and C-16 can be built. ⚠ open question OI-18 (Store Status & Lifecycle: Epic A; Products Tab: Base flow)
- **C-27 depends on the Products Tab orphaned-category state.** That state and its addressable "Uncategorized" filter now exist (Products Tab amendment, Oct 12, 2026). The category-deletion conflict between Products Tab and Product Categories is still open. ⚠ open question OI-40 (Home: Dependencies; Products Tab: Governing rule 2)
- **Owning tabs must add linkable targets and filters**, e.g. the C-05 player view, C-10, C-23 and C-02 "scroll to group". Audit them before estimating. ⚠ open question OI-32 (Home: Dependencies — Deep-link routing)
- **Some triggers have no owning query yet:** C-20 (PO settlement) and C-13 (sizing confirmation). ⚠ open question OI-27 ⚠ open question OI-35 (Order Management; Products Tab: Epic F)
- **Team Manager Portal scope** must be confirmed before build. ⚠ open question OI-13 ⚠ open question OI-31 (Home: User persona & use cases)
- **Assumption:** the Setup Guide and Close Report keep their current triggers and seen-state flags, and Home doesn't touch them. (Home: Dependencies)
- **Assumption:** the structure editor keeps its two current hosts. Home doesn't become a third. (Home: Governing rule 1; Epic H)
- **Known limitation:** the Markdown came from Confluence, and some widgets were dropped in conversion. Missing pieces (Appendix A, a per-condition rank) are raised as gaps rather than guessed. ⚠ open question OI-2 ⚠ open question OI-5

## Open items
All items are detailed and answered in `output/2026-10-26-store-home-confluence/clarification-questions.md`.
- ⚠ OI-1: Section name: "Pick up where you left off" or "Recently worked on".
- ⚠ OI-2: Appendix A (amendments 8b, 8d, 8e, item 10, tab shell) is missing from the file.
- ⚠ OI-3: C-15 fires at 14 days, but its trigger requires C-14, which fires at 7 days.
- ⚠ OI-4: Do Action-tier conditions put a dot on tab labels?
- ⚠ OI-5: The rank used to order cards within a tier is not listed.
- ⚠ OI-6: C-05 must show its oldest age, but its Epic I detail line has none. Its window date also doesn't apply to always-on stores.
- ⚠ OI-7: "24 registered conditions" and "six cases" don't match the tables (25 active IDs; 4 states plus 4 variants).
- ⚠ OI-8: Can C-07, C-21 to C-24 and C-27 hold on Draft stores?
- ⚠ OI-9: Invite status wording on manager rows doesn't match C-24 / Settings.
- ⚠ OI-10: Do the "Retry" (C-11) and "Launch store" (C-16) buttons act, or only route?
- ⚠ OI-11: Home defines its own thresholds (C-15 at 14 days, C-24 at 7 days), against Governing rule 1.
- ⚠ OI-12: Unclear rail content: where total raised goes, "summary strip" vs rail, and no Settings row.
- ⚠ OI-13: Does the Team Manager Portal get an equivalent of Home? Confirm before build.
- ⚠ OI-14: Can C-03 hold on Individual Team stores? (Other specs suggest League only.)
- ⚠ OI-15: C-20's trigger doesn't require the store to be Closed.
- ⚠ OI-16: C-19 "accepted": no accept action exists in Settings Epic E.
- ⚠ OI-17: Six tabs in Home's order conflicts with Tabbed Store Dashboard's "fixed at five" and its different order.
- ⚠ OI-18: Launch gate: "visible product" (Home, Products) vs "product added" (Lifecycle, Launch & Status).
- ⚠ OI-19: The claim that "Active" is still used in Launch & Status Controls is out of date.
- ⚠ OI-20: "Point of Contact" vs "primary" in Settings and Step 1.
- ⚠ OI-21: Is the point of contact designated inside the shared manager modal (Settings A2c) or not (Home)?
- ⚠ OI-22: "Add from Team Database" on the Settings card: closed per Home, still open per Settings.
- ⚠ OI-23: Brand assets editable after launch: Settings Epic B lock list is still TBD.
- ⚠ OI-24: Invite status labels: "Active" / "Invited · not logged in" (Settings) vs Home's wording.
- ⚠ OI-25: No card for an assigned manager with a missing address, which also blocks submission.
- ⚠ OI-26: Orders spec says pending orders are "not yet approved", a word Home bans.
- ⚠ OI-27: C-20 has no owning query for "open PO" or "PO settles".
- ⚠ OI-28: C-18: shipped-but-not-delivered orders fall between the trigger and the clear condition.
- ⚠ OI-29: C-17 clears as soon as the auto-presented Close Report is dismissed, so it may never be seen.
- ⚠ OI-30: The Reports tab spec has no Close Report entry for C-17 to link to.
- ⚠ OI-31: Team managers sign in to the workspace (Platform Overview, Lifecycle) vs a separate portal (Home).
- ⚠ OI-32: The store-wide player view that C-05 and C-15 link to doesn't exist in My Team(s).
- ⚠ OI-33: C-12 drops "Incomplete", but reps see that label on the Products tab.
- ⚠ OI-34: C-07 wording doesn't match "No products yet", and the card has two destinations.
- ⚠ OI-35: C-13: no defined per-row "confirmed" state for application sizing.
- ⚠ OI-36: C-11 is Blocking even when a re-render fails and the previous images stay live.
- ⚠ OI-37: C-14/C-15 with per-team-code or repeating windows, and whether day 7 counts as urgent.
- ⚠ OI-38: The team artwork library has no page or route to link to.
- ⚠ OI-39: What count, if any, the Reports row in the rail shows.
- ⚠ OI-40: C-27 depends on the unresolved category-deletion conflict (Products Tab vs Product Categories).
