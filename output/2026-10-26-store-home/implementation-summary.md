# Implementation Summary — Store Home (Home Tab)
Sources: TS-Store Home (Home Tab)-161026-011919.pdf (summarized). Cross-checked against: TS-Customize New Product-161026-094448.pdf, TS-Launch & Status Controls-161026-094523.pdf, TS-Order Management (Orders Tab)-161026-094455.pdf, TS-Roster Management (My Team(s) Tab)-161026-092450.pdf, TS-Store Analytics (Reports Tab)-161026-094501.pdf, TS-Store Settings (Settings Tab)-161026-094514.pdf, TS-Store Status & Lifecycle-161026-094525.pdf, TS-Tabbed Store Dashboard-191026-075922.pdf.

References: `Home: <title>` = the section of the Store Home PDF with that title (a Governing rule, an Epic, or a closing section). Other specs are named in short form (Settings, Orders, Roster, Reports, Lifecycle, Launch, Dashboard, Customize).

## 1. Scope
- **In scope:** a new **Home** tab inside the store workspace (the screen where a rep manages one store) (Home: Executive Summary & Problem Statement › The Solution; Epic A — The Home tab & workspace navigation). Home has these parts:
  - **Needs your attention:** a short list of cards, most important first. Each card reports one problem from a fixed, agreed list of conditions (Epic C). For example, a card appears when orders are waiting to be submitted (Home: Epic C — Needs your attention: the attention-card catalogue).
  - **Recently worked on:** the things this rep changed lately, each with a link straight back to where they made the change (Epic D). The heading used to be "Pick up where you left off" (Home: Epic D — Recently worked on).
  - **In your store:** a short summary with one row per tab, such as a player count for My Team(s) (Epic E) (Home: Epic E — In your store (summary rail)).
  - **Team Managers panel:** a list of the store's managers. The rep can add, edit or remove a manager using the same pop-up form Settings uses (Epic F) (Home: Epic F — Team Managers panel).
  - **Brand assets panel:** Team Logo, Team Colors and Store Theme Color, plus a link to the Team artwork library (Epic G) (Home: Epic G — Brand assets panel).
  - **League structure directory:** a view-only list of divisions and teams. It appears on League stores only (Epic H) (Home: Epic H — League structure directory (League stores only)).
  - A link to reopen the Setup Guide, and a link to the Close Report (Epic B) (Home: Epic B — Interaction with the two existing auto-presenting sequences).
- **Out of scope:** (Home: Out of scope)
  - alerts that cover more than one store
  - notifications or emails triggered by a card
  - snoozing or dismissing a card, or assigning it to someone
  - a full history of every change (activity or audit log)
  - letting each rep choose which cards they see
  - changing store data from Home in any way not listed in this summary
  - letting the rep pick a different landing tab (not in v1) (Home: Epic A — The Home tab & workspace navigation)
  - hints shown the first time a rep visits each tab (Home: Governing rule 3 — Guidance without a checklist)
  - a fundraising progress bar or goal (Home: Epic E — In your store (summary rail))
  - a strip of headline numbers from Reports (Home: Epic E — In your store (summary rail))
  - Add from Team Database on Home (Home: Epic F — Team Managers panel)
  - the Change Team control (Home: Epic G — Brand assets panel)
  - editing the league structure (Home: Epic H — League structure directory (League stores only))
  - the C-26 artwork-readiness card, which was never added to the list (Home: Epic G — Brand assets panel)
  - a card for orders whose details differ from the roster (for example, a different size on the order than on the roster) (Orders Dependencies; Roster Epic 2)
- **A Home tab for the Team Manager Portal:** the source leaves this OPEN and recommends "no" for this version (Home: User persona & use cases). ⚠ open question OI-20

## 2. Actors & Roles
- **Rep (store owner):** the only user the spec names. A rep works on one store at a time, in any status (Draft, Open, Closed or Archived) (Home: User persona & use cases).
- **Reps who share a store:** each rep sees only their own "Recently worked on" list (Home: Epic D — Recently worked on).
- **Team managers:** the source says Home is not for them. Other specs suggest they can get into the workspace (Lifecycle Close Report; Settings Epic C; Roster Solution). ⚠ open question OI-20
- **If Home is ever opened to managers:** the system must leave out the cards a manager isn't allowed to act on. It must not show every card with the buttons greyed out (Home: Dependencies & Technical Constraints).
- **Owner-only actions** stay with the owner and do not appear on Home. For example, Archive stays in the Settings Danger Zone (Lifecycle Epic E).

## 3. Business Rules

### Governing rules
- BR-1 Home only shows information that already lives in the other tabs. It doesn't save its own copy of anything about the store. For example, '16 pending orders' comes from the Orders tab and the team logo comes from Settings. The one thing Home saves is each rep's own 'Recently worked on' list (Home: Governing rule 1 — Home is derived, and derives only from published state; Dependencies & Technical Constraints).
- BR-2 If Home lets the rep edit something, the edit must follow three rules (Home: Governing rule 1 — Home is derived, and derives only from published state):
  - It saves to the same field the owning tab uses. Home keeps no copy of its own.
  - It runs the same checks and shows the same warnings as the owning tab.
  - The result is exactly the same as making the edit on the owning tab.

  If an editor can't meet all three rules, Home doesn't host it. Instead, Home sends the rep to the owning tab (Home: Governing rule 1 — Home is derived, and derives only from published state).
- BR-3 Home never works out a number for itself. Every count, limit and condition comes from the tab that owns it. If Home and a tab ever show different figures, the tab is correct (Home: Governing rule 1 — Home is derived, and derives only from published state).
- BR-4 Home invents no new labels. It uses the same words as the tab that owns the item (Home: Governing rule 1 — Home is derived, and derives only from published state). ⚠ open question OI-21
- BR-5 Home never stops the rep from doing anything, and nothing requires a visit to Home first. It only explains the existing checks that hold up launch and shipping (Home: Governing rule 1 — Home is derived, and derives only from published state).
- BR-6 Every card must report a fact that can be true or false right now. A card shows because a check found a real problem, and it goes when the problem goes. Don't add a condition that would show on a well-run store most of the time (Home: Governing rule 3 — Guidance without a checklist; Epic C — Needs your attention: the attention-card catalogue).

### Tiers and visual treatment
- BR-7 Every card belongs to one of three tiers (levels of urgency). Blocking means buyers, orders or shipping are stopped right now. Action means the rep has work waiting that will cost something if it keeps waiting. Informational means something the rep should know about (Home: Governing rule 2 — Severity tiers):

  | Tier | Rail | Action | Order |
  |---|---|---|---|
  | Blocking | red | main (primary) button | first |
  | Action | blue | secondary button | second |
  | Informational | neutral | a link, or no action | last |

- BR-8 Each condition always has the same tier. A card never becomes more urgent just because it has been there a long time. Where time really matters, the spec uses two separate conditions instead. For example, C-14 (window closing soon) and C-15 (window closing and players still missing gear) (Home: Governing rule 2 — Severity tiers).
- BR-9 Home never uses amber, and never adds a fourth colour (Home: Governing rule 2 — Severity tiers). ⚠ open question OI-27
- BR-10 Every Blocking card says who is stopped, not what the system state is. For example, "Customers can't order this yet" rather than an internal status name (Home: Governing rule 2 — Severity tiers).
- BR-11 A card never shows its tier as a word, such as "Blocking" (Home: Epic I — Copy & vocabulary).

### Navigation and landing
- BR-12 The workspace shows six tabs in this order: Home, My Team(s), Products, Orders, Reports, Settings. Home comes first (Home: Epic A — The Home tab & workspace navigation). ⚠ open question OI-1
- BR-13 The Home tab is always there and always clickable, whatever the store's status, type or distribution format (Home: Epic A — The Home tab & workspace navigation).
- BR-14 When a rep opens a store, they land on Home, unless the link they followed points to a specific tab. A link to a specific tab always wins (Home: Epic A — The Home tab & workspace navigation).
- BR-15 A tab label shows a small dot (no number) when at least one Blocking card sends the rep to that tab. Informational cards never add a dot (Home: Epic A — The Home tab & workspace navigation; Dependencies & Technical Constraints). ⚠ open question OI-7
- BR-16 Two existing walkthroughs open on their own and appear over Home: the Setup Guide (the first visit after a store is created) and the Close Report (the first visit after a store closes). They can never both happen on the same visit, so no rule decides which goes first. Home neither reads nor changes the record of whether the rep has seen either one (Home: Epic B — Interaction with the two existing auto-presenting sequences; Dependencies & Technical Constraints).

### Attention list behaviour
- BR-17 Cards show in this order: Blocking, then Action, then Informational. Inside each tier, each condition has a fixed position. The same store data always gives the same order (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-6
- BR-18 The list shows at most 5 cards, with an "n more" link to show the rest. Blocking cards are never hidden behind that link. So if there are more than 5 Blocking cards, all of them show (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-19 There is one card per condition, not one card per order or player. The card shows how many are affected, for example "16 orders" (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-20 Cards C-01, C-05 and C-06 also show how long the oldest affected item has been waiting (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-11
- BR-21 The rep can't dismiss, snooze or tick off a card. A card goes away only when the problem behind it is fixed (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-22 Each card has exactly one main action (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-23 Home shows only conditions from the agreed Epic C list. To add a new one, someone must list it with the spec that owns it, its tier, what sets it off and where it sends the rep. A condition that no spec owns can't be released (Home: Governing rule 1 — Home is derived, and derives only from published state; Epic C — Needs your attention: the attention-card catalogue).
- BR-24 C-25 has been withdrawn, and its ID must never be used again (Home: Epic C — Needs your attention: the attention-card catalogue).

### Condition catalogue
- BR-25 The table below lists every condition: its tier, what sets it off, where the card sends the rep, and when the card goes away (Home: Epic C — Needs your attention: the attention-card catalogue). It has 25 IDs, but the source says there are "24" (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-8

| ID | Internal condition | Tier | Trigger (owning spec) | Resolves to | Clears when |
|---|---|---|---|---|---|
| C-01 | Pending orders awaiting submission | Action | At least 1 order is pending and not yet submitted (Orders A) | Orders → Pending Orders | Every pending order is submitted or cancelled |
| C-02 | Shipping group below MOQ | Info | At least 1 pending group is under the minimum order quantity (MOQ) (Orders B) | Orders → Pending, scrolled to the group | The group reaches MOQ, or is submitted short |
| C-03 | Manager unassigned with pending orders | Blocking | At least 1 pending group has no group or team manager (Orders B; Settings A3) | Settings → Distribution & Fulfillment, with the division already open | Every assigned group has a manager |
| C-04 | No ship-to destination address | Blocking | Shipping is set to Ship to Team Manager, and the destination address is empty (Settings A3) | Settings → Distribution & Fulfillment → Fulfillment Method | A verified destination address exists |
| C-05 | Rostered players missing required gear | Action | At least 1 confirmed player hasn't ordered Team Required gear (Orders C; Roster 2) | My Team(s) → store-wide player view, filtered to incomplete players | Every player has ordered or opted out |
| C-06 | Roster Bank captures awaiting review | Action | At least 1 captured player sign-up is waiting for review (Roster 5) | My Team(s) → store-wide Roster Bank | Every capture is added to the roster or dismissed |
| C-07 | Teams with no products (League) | Action | At least 1 team has 0 products, directly or through its division (Roster 6) | My Team(s) canvas or division coverage table | Every team has at least 1 product |
| C-08 | Divisions/teams with no fulfillment manager (League, Ship-to-Manager) | Action | At least 1 division or team shows "Not assigned" (Roster 0) | Settings → Distribution & Fulfillment | Every one has a manager in effect |
| C-09 | No visible products (Draft) | Blocking | The catalog has 0 visible products (Products; Lifecycle A) | Products → Catalog | At least 1 product is visible |
| C-10 | Products held by render gate | Action | At least 1 decorated product is still waiting for its images to be generated (Products H) | Products → Catalog, filtered | The images exist, or the product has no decoration |
| C-11 | Render failure | Blocking | Image generation failed for at least 1 product (Products H) | Product detail page | A retry succeeds |
| C-12 | Bundles Incomplete | Blocking | At least 1 bundle has only one item in it (Products J) | Bundle detail → Members | A second item is added, or the bundle is deleted |
| C-13 | Unconfirmed application sizing | Action | Decoration sizing hasn't been confirmed on every row (Products F) | Product detail → Application Sizing | Every row is confirmed |
| C-14 | Window closing soon | Info | The store is Open, has a set order window, and the days-left pill shows as urgent (Settings E) | Settings → Schedule & Status → Edit Store Schedule | The window closes, or the end date moves out of range |
| C-15 | Window closing + players missing gear | Action | C-14 and C-05 are both true | My Team(s) incomplete-player view | Either C-14 or C-05 stops being true |
| C-16 | Draft and ready to launch | Action | The store is Draft and has at least 1 visible product (Lifecycle A) | Workspace header → Launch | The store becomes Open |
| C-17 | Close Report not viewed | Info | The store is Closed and this user hasn't seen the report for this close (Lifecycle H) | Reports → Store Close Report | The report is viewed or dismissed |
| C-18 | Orders in production after close | Info | The store is Closed and at least 1 order hasn't shipped (Lifecycle edge cases) | Orders → All Orders | Every order is Delivered or cancelled |
| C-19 | Order-window coverage gap (per-team-code scheduling only) | Action | The scheduler finds at least 1 day when no team can order (Settings E) | Settings → Schedule & Status → Order Window Scheduler | The gap is closed or accepted |
| C-20 | Closed with unsettled payment | Action | At least 1 order in the window has an unpaid purchase order (PO) (Lifecycle edge cases) | Orders → All Orders, filtered | The PO is paid |
| C-21 | Managers left behind by re-bind | Action | At least 1 manager record came from a team the store is no longer linked to (Settings A1) | Settings → General → League/Team Manager Information | Each record is kept or removed |
| C-22 | Left-behind manager holds portal access | Blocking | C-21 is true, and that person has an active or pending portal invite (Settings A1, A2b) | Settings → People & Access | Access is revoked, or the rep confirms the record is kept |
| C-23 | Fundraising disabled, items still collecting | Info | Fundraising is turned off but some items are exempt and still collect (Settings A4) | Products → Catalog, filtered to exempt items | No exempt items remain, or fundraising is turned back on |
| C-24 | Team-manager invites never activated | Info | An invite has shown "Invited · not logged in" for more than 7 days (Settings A2b) | Settings → People & Access | The invite is accepted or revoked |
| C-27 | Products orphaned by deleted category | Action | A product's category no longer exists (Product Categories D; Products) | Products → Catalog, filtered | The product is moved into an existing category |

### Condition-specific rules
- BR-26 C-03 and C-04 are separate cards, and both can show at the same time (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-27 If C-03 and C-08 are both true for the same division, only C-03 shows. C-03's text must then name the divisions or teams affected, for example "Division 3 and Division 7", not just a count (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-13
- BR-28 C-05 rules (Home: Epic C — Needs your attention: the attention-card catalogue):
  - A player who chose "I already own this" counts as done.
  - Home offers no Send Reminder button for this card.
  - The card's detail line says how many of the affected players have no email or phone on file. C-15 carries the same note (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-29 C-14 uses the existing days-left pill, which turns urgent in the last 7 days (Home: Epic C — Needs your attention: the attention-card catalogue). The source says C-15 appears earlier, at 14 days (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-4
- BR-30 C-14 and C-15 stay as two separate cards. Home has no "Extend deadline" button; the card sends the rep to Edit Store Schedule instead (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-31 Why some cards have the tier they do (Home: Epic C — Needs your attention: the attention-card catalogue):
  - C-11 (images failed) is Blocking. C-10 (images still generating) is not.
  - C-12 is Blocking because an incomplete bundle doesn't appear on the storefront.
  - C-13's text must never say customers can't order, because they can.
- BR-32 Problems the system already prevents when saving never get a card. Examples: a product with no category, and League TR/TS items assigned to 0 teams (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-33 C-27 is Action tier. Creating a new category with the same name as the deleted one does not clear the card (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-34 C-22 is the only Blocking card that comes from Settings (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-35 C-23 is Informational. Its text must not suggest that something is wrong (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-5
- BR-36 C-24 appears once an invite has gone unused for 7 days (Home: Epic C — Needs your attention: the attention-card catalogue).
- BR-37 C-21 and C-22 need the system to remember when a rep decides to keep a left-behind manager. No spec defines where that decision is saved (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-15
- BR-38 C-19 needs an "accepted gap" status, meaning the rep has agreed to leave a gap open. No spec defines it (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-16
- BR-39 C-20 needs a status that says a purchase order is paid. No spec defines it (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-14
- BR-40 C-17 uses the same trigger as the Close Report that opens on its own (Home: Epic C — Needs your attention: the attention-card catalogue; Lifecycle H). ⚠ open question OI-9
- BR-41 C-18 appears when an order is "not shipped", but it only goes away once the order is "Delivered" (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-10
- BR-42 C-02 shows one card even when several groups are under MOQ. It is unclear which group the card's text should name (Home: Epic C — Needs your attention: the attention-card catalogue; Epic I — Copy & vocabulary). ⚠ open question OI-12

### Card population gating
- BR-43 Which cards can appear depends on the store's status and type (Home: Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-18

  | State or type | Cards that can hold | Cards that cannot hold |
  |---|---|---|
  | Draft | C-04, C-08, C-09, C-16, C-10 to C-13 | Order, Roster Bank and order-window cards |
  | Open | All cards | C-09, C-16, C-17, C-18, C-20 |
  | Closed | Most cards; C-17, C-18 and C-20 appear only when Closed | C-14 |
  | Archived | None | — |
  | Individual Team | — | C-07, C-08 |
  | Always-on | — | C-14, C-15, C-19 |

- BR-44 C-04 is Blocking even on Draft stores. That conflicts with the definition of Blocking, because no buyer can be stopped on a store that isn't live yet (Home: Governing rule 2 — Severity tiers; Epic C — Needs your attention: the attention-card catalogue). ⚠ open question OI-19
- BR-45 The service that works out the cards decides which ones apply, not the screen. For an Archived store, it returns no cards plus a reason code saying the store is archived (Home: Dependencies & Technical Constraints).

### Launch-related cards
- BR-46 On a Draft store (Home: Epic C — Needs your attention: the attention-card catalogue; Epic J — Acceptance criteria). ⚠ open question OI-3
  - With 0 visible products, C-09 shows and Home offers no way to launch.
  - With at least 1 visible product, C-16 shows and sends the rep to the Launch button in the workspace header.

### Recently worked on (resume trail)
- BR-47 Each time a rep saves a qualifying change, the system records it. The record holds: the rep, the store, the existing link key for the screen, the item changed (optional), what kind of change it was, and the time (Home: Epic D — Recently worked on; Dependencies & Technical Constraints).
- BR-48 A change counts only if all of these are true (Home: Epic D — Recently worked on). ⚠ open question OI-28
  - The rep made it themselves.
  - It was made on a screen that has a fixed link the rep can return to.
  - It was made in this store.
- BR-49 These never count (Home: Epic D — Recently worked on):
  - viewing, filtering, sorting, searching or switching tabs
  - changes with no screen to link back to
  - changes in other stores, or settings that cover all stores
  - changes made by buyers or by the system: orders, data written back at checkout, captured sign-ups, automatic store closing, finished image generation
  - deletions, such as deleting a product, clearing a roster or deleting a bundle
- BR-50 A bulk action counts as one entry, for example "imported 40 players" (Home: Epic D — Recently worked on).
- BR-51 Several changes to the same item on the same screen show as one entry, using the latest one. For example, editing a product three times shows one row (Home: Epic D — Recently worked on).
- BR-52 The list shows 5 rows at first, newest first. The rep can expand it to 15 (Home: Epic D — Recently worked on).
- BR-53 Entries disappear after 30 days (Home: Epic D — Recently worked on).
- BR-54 Each rep has their own list. It is never shared with other reps (Home: Epic D — Recently worked on).
- BR-55 Row labels use the item's current name. So if a product is renamed, the row shows the new name. If the item was deleted, its row is quietly left out (Home: Epic D — Recently worked on).
- BR-56 The list must never look like a to-do list, a progress tracker or a score. Row buttons say "Open" or "Go to …", never "Resume" (Home: Epic D — Recently worked on).

### Summary rail
- BR-57 There is one row per tab, in the same order as the tabs: My Team(s), Products, Orders, Reports. Row labels match the tab names exactly (Home: Epic E — In your store (summary rail)). ⚠ open question OI-26
- BR-58 People on a roster are always called "players", never "members". The Roster tab's own stats header also says "players" (Home: Epic E — In your store (summary rail); Roster Epic 0).
- BR-59 Each row shows the main count from its tab. Where there is a problem, it also shows the same number as the matching card. Player counts don't include captured sign-ups that haven't been added yet (Home: Epic E — In your store (summary rail); Roster Epic 5).
- BR-60 Rows always show, even when the count is zero. There is no fundraising progress bar. The rail may show the total raised, but not against a goal (Home: Epic E — In your store (summary rail)).
- BR-61 The Reports row is only a link. It never repeats revenue, profit or fundraising figures (Home: Epic E — In your store (summary rail)).

### Team Managers panel
- BR-62 The panel shows and changes the same list of managers that Settings A2c, Step 1 and coach import use. There is only one list (Home: Epic F — Team Managers panel).
- BR-63 The panel title is "League Manager Information" on League stores and "Team Manager Information" on Individual Team stores (Home: Epic F — Team Managers panel).
- BR-64 Each row shows Name, Email, Phone and Contact Preference (Home: Epic F — Team Managers panel).
- BR-65 Rules for the Point of Contact tag (Home: Epic F — Team Managers panel). ⚠ open question OI-22
  - The chosen contact is tagged **Point of Contact**, never "Primary" or "Primary Contact".
  - The tag shows when at least one contact channel (email or phone) is set to Team Manager mode. This applies even when the store has only one manager.
  - If only one channel is in Team Manager mode, the tag names that channel, for example "Point of Contact · email".
  - If both channels are set to Salesperson or Custom, no row is tagged. A note at the bottom of the panel says who buyers will see, and links to the Store Point of Contact setting.
- BR-66 Invite status on each row (Home: Epic F — Team Managers panel):
  - Every row with an email offers an Invite button, which takes the rep to People & Access.
  - If the person already has an invite, the row shows its status instead: "Portal access active" or "Invited, not signed in".
- BR-67 Add, edit and remove all open the existing manager pop-up, with all its fields and checks. The fields are First Name, Last Name, Email, Phone Number, Street Address and Contact Preference (Home: Epic F — Team Managers panel).
- BR-68 Choosing the point of contact (Home: Epic F — Team Managers panel):
  - Exactly one manager is the point of contact at all times.
  - The rep can't remove that manager. Home explains why and links to Settings → General.
  - The rep can't change the point of contact on Home. Home links to Settings → General.
  - Adding a manager never changes who the point of contact is.
- BR-69 When the pop-up opens from Home, it says that adding a manager does not give them portal access. It links to People & Access (Home: Epic F — Team Managers panel).
- BR-70 Removing a manager does not cancel their invite. The confirmation message says so and links to People & Access (Home: Epic F — Team Managers panel).
- BR-71 Contact changes reach the storefront (Home: Epic F — Team Managers panel):
  - When Team Manager mode is on and the rep changes the point of contact's email or phone, the storefront footer updates straight away. The pop-up warns about this before the rep saves.
  - Home doesn't show the control that picks the point-of-contact mode.
- BR-72 When the panel is available (Home: Epic F — Team Managers panel). ⚠ open question OI-24
  - It shows in every store status. On Archived stores it is view-only.
  - Home doesn't offer Add from Team Database; it links to Settings → General instead.

### Brand assets panel
- BR-73 What the panel contains (Home: Epic G — Brand assets panel):
  - Team Logo and Team Colors, using the same controls as Step 1 and Settings.
  - Store Theme Color, using the standard Prolook color picker. No custom-built picker.
  - A link to the Team artwork library, saying that the library belongs to the team, not just this store. The library itself is not shown on Home.
- BR-74 Theme color swatch (Home: Epic G — Brand assets panel; Settings I):
  - It shows where the color came from: Team default or Custom.
  - When the color is Custom, the rep can use Reset to team color.
  - Helper text says the color applies to "buttons and accents only".
  - Every save keeps the record of where the color came from.
- BR-75 Home doesn't host Change Team. It links to Edit Store Details instead (Home: Epic G — Brand assets panel).
- BR-76 The rep can still edit everything in this panel after the store launches. On Archived stores the panel is view-only (Home: Epic G — Brand assets panel). ⚠ open question OI-23

### League structure directory
- BR-77 The directory shows on League stores only. It doesn't appear on Individual Team stores (Home: Epic H — League structure directory (League stores only)).
- BR-78 The directory is view-only (Home: Epic H — League structure directory (League stores only)):
  - The header shows how many divisions, teams and players there are.
  - Each division lists its teams underneath it. Teams that aren't in a division are listed separately.
  - Each row shows its player count and how many captured sign-ups are waiting.
- BR-79 Clicking a row opens My Team(s) at that division or team (Home: Epic H — League structure directory (League stores only)):
  - For a team, its division opens automatically and the breadcrumb trail is correct.
  - A click never lands on the general My Team(s) canvas with nothing selected.
- BR-80 Divisions always start closed. If the rep opens one, it stays open only until the session ends. The panel has a fixed maximum height and scrolls inside (Home: Epic H — League structure directory (League stores only)).
- BR-81 The directory never shows thumbnails, coverage tables, the catalog drawer or team codes (Home: Epic H — League structure directory (League stores only)).

### Copy and vocabulary
- BR-82 Card text comes only from Epic I. The internal condition names (the "Internal condition" column above) never appear on screen (Home: Epic C — Needs your attention: the attention-card catalogue; Epic I — Copy & vocabulary). ⚠ open question OI-29
- BR-83 Rules for card text, most important first (Home: Epic I — Copy & vocabulary):
  1. Say what happens, then what to do.
  2. Don't use internal status names.
  3. Say who is affected.
- BR-84 Words that must not appear on cards, and what to write instead (Home: Epic I — Copy & vocabulary):

  | Don't write | Write instead |
  |---|---|
  | Freight routing unresolved | Needs a manager before orders can ship |
  | Below MOQ | Under the minimum to ship |
  | Held by the render gate | Still generating images |
  | Unconfirmed application sizing | Sizing needs confirming |
  | Team re-bind / left-behind records | From the team you switched away from |
  | Order-window coverage gap | Some days have no team able to order |
  | Submission blocked / cannot be submitted | Add a manager so these orders can ship |
  | Container | Group |
  | Primary / Primary Contact | Point of Contact |
  | Orphaned products / dangling category reference | Products aren't in a category |

  The word "blocked" never appears on a card.
- BR-85 Agreed terms, as of 3 Sep 2026 (Home: Epic I — Copy & vocabulary). ⚠ open question OI-31
  - Use exactly as written: Customizer, Other stores, My Team(s), Roster Bank, Pending Orders, Draft, Archived.
  - Use the new term, not the old one: Stock Vault (not Product Vault), Catalog Templates (not Product Packages), Customizer (not Brand Catalog), Submit (not approve), Open (not Active), Closed (not Paused or On Hold), Point of Contact (not Primary).
- BR-86 Tone (Home: Epic I — Copy & vocabulary):
  - Never tell the rep off: no "you forgot", no "overdue", and no red on Informational cards.
  - Never talk about completion, readiness or scores anywhere on Home.
  - C-18, C-20 and C-23 are worded to reassure the rep.

## 4. Data
- **Resume event:** the only new record Home saves. It powers the "Recently worked on" list (Home: Dependencies & Technical Constraints). ⚠ open question OI-28
  - Fields: rep_id, store_id, surface_key (the existing link key for the screen), optional entity_ref (the item changed), a field-group or operation id (what kind of change), timestamp.
  - Only screens that are deliberately signed up write these records. Don't record every save in the system automatically.
  - When read: entries for the same screen and item are merged, entries older than 30 days are dropped, and only the current rep's entries are returned.
- **Card results:** worked out fresh for each store every time Home loads, and never saved (Home: Dependencies & Technical Constraints). Each result holds the condition id, the count, the age of the oldest affected item where relevant, the tier, and where the card sends the rep.
- **Condition list:** kept as data, not written into the code as a series of special cases. Each entry holds the id, the owning spec, the tier, a reference to the check that sets it off, the destination and its position within the tier (Home: Dependencies & Technical Constraints). ⚠ open question OI-6
- **Data Home reads but never changes:**
  - Orders: pending orders, MOQ checks, the check that holds up shipping.
  - Products: image-generation status, the Incomplete-bundle flag, the visible-product count used for launch.
  - Settings: fundraising setting (on, off, or off with exemptions), days left, order-window gaps, invite status, the team the store used to be linked to.
  - Roster: counts and captured sign-ups.
  - Lifecycle: store status.

  (Home: Dependencies & Technical Constraints)
- **Existing fields Home changes through shared controls:** (Home: Dependencies & Technical Constraints; Settings A2c, I)
  - the manager list (exactly one point of contact at all times)
  - Team Logo and Team Colors
  - the store theme color, plus a flag saying where it came from (team default or chosen by the rep). The flag is needed because you can't tell from the color alone.
- **Home never changes:**
  - whether the rep has seen the Setup Guide (stored per rep, per store type)
  - whether the user has seen the Close Report (stored per user, per close)
  - the invite records
  - the point-of-contact mode

  (Home: Epic F — Team Managers panel; Dependencies & Technical Constraints)

## 5. Flows
- **Opening the workspace**
  1. If the link names a specific place, open it.
  2. Otherwise, if the Setup Guide or Close Report is due, it appears over Home.
  3. Otherwise, Home shows. Once the rep closes a walkthrough, Home is fully usable.

  (Home: Epic A — The Home tab & workspace navigation; Epic B — Interaction with the two existing auto-presenting sequences)
- **Attention card**
  1. The system checks the conditions in stages, Blocking ones first, so the most serious cards appear first (Home: Dependencies & Technical Constraints).
  2. The screen sorts the cards, applies the 5-card limit and shows them.
  3. The rep clicks the card's one action and lands on the right screen, already filtered to the problem.
  4. Once the problem is fixed, the card is gone the next time Home loads (Home: Epic J — Acceptance criteria).
- **No cards:** the section says nothing needs the rep's attention and names the store's status. It shows nothing else in its place (Home: Epic C — Needs your attention: the attention-card catalogue).
- **Archived store:** the section says the store is archived and view-only. The summary, recent list, panels and directory are all view-only. No greyed-out cards are shown (Home: Epic C — Needs your attention: the attention-card catalogue).
- **Recently worked on**
  1. The rep saves a qualifying change, and the system stores an entry.
  2. When Home loads, entries are merged, old ones are dropped, and only this rep's entries are kept. Each row gets a label.
  3. Rows for deleted items are dropped.
  4. Clicking a row opens the screen using the existing link scheme (Home: Epic D — Recently worked on).
  5. If there are no entries, the section doesn't appear at all (Home: Epic D — Recently worked on).
- **Add manager:** the shared pop-up opens. It says adding a manager gives no portal access and links to People & Access. Saving adds the manager to the shared list. The new row then offers Invite (Home: Epic F — Team Managers panel).
- **Remove manager:** not allowed if this manager is the point of contact. Otherwise, the confirmation says any invite stays active and links to People & Access (Home: Epic F — Team Managers panel).
- **Change point of contact:** Home sends the rep to Settings → General (Home: Epic F — Team Managers panel).
- **Coach import:** Home sends the rep to Settings → General (Home: Epic F — Team Managers panel). ⚠ open question OI-24
- **Directory row click:** opens My Team(s) at that division or team, the same way existing links into My Team(s) work (Home: Epic H — League structure directory (League stores only)).
- **Reopening the Setup Guide from Home:** it opens on card 1, and the rep can move through it at their own pace, whether or not they've seen it before (Home: Epic B — Interaction with the two existing auto-presenting sequences; Dashboard Epic B).
- **Close Report link** (Closed or Archived stores only): goes to the Close Report entry on the Reports tab, which the Reports spec owns (Home: Epic B — Interaction with the two existing auto-presenting sequences). ⚠ open question OI-25

## 6. Integrations
- **Internal services only:** order, roster, catalog, store settings and reporting services. No outside systems or APIs (Home: Dependencies & Technical Constraints).
- **Links** reuse the existing link schemes (Home: Dependencies & Technical Constraints):
  - Settings section keys. These must not change.
  - Links into a My Team(s) division or team, which open it automatically.
  - Products catalog links that scroll to and highlight an item.
  - Orders links that pick a sub-tab and set filters.
- **New filtered views** are needed in other tabs. Before estimating, check which ones already exist; this is where most hidden work lies (Home: Dependencies & Technical Constraints).
  - C-05 view of players missing gear ⚠ open question OI-17
  - C-10 view of products waiting for images
  - C-23 view of exempt items
- **C-27** needs a Products Tab change to land first: a status for products whose category was deleted, how it is shown as an error, and a filter for it (Home: Dependencies & Technical Constraints). ⚠ open question OI-32
- **No notifications or emails** are sent because of a card (Home: Out of scope).

## 7. Non-Functional
- **Performance** (Home: Dependencies & Technical Constraints). ⚠ open question OI-30
  - The cards are worked out every time a rep opens a workspace.
  - Cards load in stages, Blocking first.
  - Decided: no short-lived cache, and no waiting for every check to finish before showing anything.
  - The slowest checks are: C-05 (matching roster against orders), C-07 (product coverage across all teams) and C-23 (reading the whole catalog).
- **Consistency:** every count on Home must exactly match the count on the owning tab (Home: Epic J — Acceptance criteria).
- **Security and access:** nothing on Home may give, assume or remove portal access. Removing a manager must not touch the invite records (Home: Dependencies & Technical Constraints).
- **Size limits:** a very large league must not push the attention list off the screen (Home: Dependencies & Technical Constraints).
- **Localisation and accessibility:** not stated.

## 8. Acceptance Criteria
- AC-1 When a rep opens a workspace, the Home tab is there and is first in the tab bar (Home: Epic J — Acceptance criteria).
- AC-2 Home is there and clickable for every store status, type and format. The workspace never shows only five tabs (Home: Epic J — Acceptance criteria).
- AC-3 Needs your attention and In your store show for every store status. They are never hidden and never greyed out (Home: Epic J — Acceptance criteria).
- AC-4 The first row of the summary is labelled My Team(s), and it counts roster entries as players (Home: Epic J — Acceptance criteria).
- AC-5 Home uses no amber anywhere (Home: Epic J — Acceptance criteria).
- AC-6 When the Setup Guide or Close Report is due, it appears over Home, and Home is usable once the rep closes it (Home: Epic J — Acceptance criteria).
- AC-7 Every card matches a condition on the Epic C list. No other card ever shows (Home: Epic J — Acceptance criteria).
- AC-8 Cards show Blocking first, then Action, then Informational. The same store data always gives the same order (Home: Epic J — Acceptance criteria).
- AC-9 With more than 5 cards, the top 5 show plus a link to show more. If more than 5 are Blocking, every Blocking card shows (Home: Epic J — Acceptance criteria).
- AC-10 The count on each card equals the count on the owning tab (Home: Epic J — Acceptance criteria).
- AC-11 A card's action takes the rep to the owning screen, already filtered to the problem where that screen supports it (Home: Epic J — Acceptance criteria).
- AC-12 Once the problem is fixed, the card is gone the next time Home loads. There is no other way to remove it (Home: Epic J — Acceptance criteria).
- AC-13 With no cards, the section says so plainly and shows nothing else in its place (Home: Epic J — Acceptance criteria).
- AC-14 On an Archived store, the section says the store is archived and view-only, and no card has an action (Home: Epic J — Acceptance criteria).
- AC-15 Draft store with 0 visible products: C-09 shows as Blocking, and there is no way to launch from Home (Home: Epic J — Acceptance criteria). ⚠ open question OI-3
- AC-16 Draft store with at least 1 visible product: C-16 shows and takes the rep to the Launch button in the header (Home: Epic J — Acceptance criteria).
- AC-17 A qualifying change saves an entry with the rep, the store and the existing link key (Home: Epic J — Acceptance criteria).
- AC-18 Several edits to the same item show as one entry, with the time of the latest edit (Home: Epic J — Acceptance criteria).
- AC-19 Buyer orders, data written back at checkout, captured sign-ups and system events add no entry (Home: Epic J — Acceptance criteria).
- AC-20 Reps who share a store each see only their own list (Home: Epic J — Acceptance criteria).
- AC-21 If an entry's item was deleted, its row is left out and no error shows (Home: Epic J — Acceptance criteria).
- AC-22 With no entries, the "Recently worked on" section doesn't appear at all. It is not shown empty (Home: Epic J — Acceptance criteria).
- AC-23 Home never shows a completion percentage, readiness score or progress bar (Home: Epic J — Acceptance criteria).
- AC-24 The Team Managers panel shows the same list that Settings and Step 1 save to (Home: Epic J — Acceptance criteria).
- AC-25 With at least 1 channel in Team Manager mode, the chosen manager is tagged Point of Contact, even when they are the only manager. The tag never says Primary or Primary Contact (Home: Epic J — Acceptance criteria).
- AC-26 With only one channel in Team Manager mode, the tag names that channel (Home: Epic J — Acceptance criteria).
- AC-27 With both channels on Salesperson or Custom, no one is tagged and the panel says who buyers see (Home: Epic J — Acceptance criteria).
- AC-28 Changing the point of contact takes the rep to Settings → General (Home: Epic J — Acceptance criteria).
- AC-29 The rep can't remove a manager if that would leave no point of contact. Home explains why and links to Settings → General (Home: Epic J — Acceptance criteria).
- AC-30 The manager pop-up on Home is the same one Settings uses, with all its fields and checks (Home: Epic J — Acceptance criteria).
- AC-31 Add manager is the only way to add a manager on Home. There is no Add from Team Database (Home: Epic J — Acceptance criteria).
- AC-32 No card shows its tier as a label (Home: Epic J — Acceptance criteria).
- AC-33 A store with no outstanding work shows no cards (Home: Epic J — Acceptance criteria).
- AC-34 Add manager opens the full pop-up, which says it gives no portal access (Home: Epic J — Acceptance criteria).
- AC-35 Adding, editing or removing a manager on Home gives the same result as doing it in Settings. No invite is created, changed or cancelled (Home: Epic J — Acceptance criteria).
- AC-36 When the rep removes a manager who has an active or pending invite, the confirmation says their access stays and links to People & Access (Home: Epic J — Acceptance criteria).
- AC-37 With Team Manager mode on, editing the point of contact's details updates the storefront footer straight away, and the pop-up warned about this before saving (Home: Epic J — Acceptance criteria).
- AC-38 The brand panel uses the existing controls and the Prolook picker, and the rep can still edit all three after launch (Home: Epic J — Acceptance criteria). ⚠ open question OI-23
- AC-39 A row whose person has an active or pending invite shows that status in place of the Invite button (Home: Epic J — Acceptance criteria).
- AC-40 The theme swatch shows where its color came from, offers Reset on a custom color, and shows the "buttons and accents" helper text (Home: Epic J — Acceptance criteria).
- AC-41 The artwork library is a link, says it belongs to the team, and is not shown on Home itself (Home: Epic J — Acceptance criteria).
- AC-42 On League stores, the directory shows divisions with their teams underneath, then teams with no division. It shows the same counts as the Roster stats header, starts with divisions closed and has a fixed maximum height (Home: Epic J — Acceptance criteria).
- AC-43 On Individual Team stores, there is no directory, and the rest of Home is the same (Home: Epic J — Acceptance criteria).
- AC-44 Clicking a directory row opens My Team(s) at that division or team, with the division already open and the breadcrumb trail correct (Home: Epic J — Acceptance criteria).
- AC-45 The directory shows no thumbnails, coverage tables, catalog drawer or team codes (Home: Epic J — Acceptance criteria).
- AC-46 Card headlines say what happens, buttons say what to do, and no banned word appears (Home: Epic J — Acceptance criteria).
- AC-47 Card text is the Epic I headline, never the internal condition name (Home: Epic J — Acceptance criteria).
- AC-48 C-03 names the divisions or teams affected (Home: Epic J — Acceptance criteria).
- AC-49 Every label matches the current label in the tab that owns it (Home: Epic J — Acceptance criteria). ⚠ open question OI-21
- AC-50 Loading Home saves nothing about the store except "Recently worked on" entries (Home: Epic J — Acceptance criteria).

## 9. Dependencies & Assumptions
- **Tabbed Store Dashboard** must change from five fixed tabs to six. The spec refers to Appendix A changes, but Appendix A is missing from the PDF (Home: Epic A — The Home tab & workspace navigation). ⚠ open question OI-1, OI-2
- **Settings must switch to "Point of Contact"** before Home is released (change 8e) (Home: Epic F — Team Managers panel). ⚠ open question OI-22
- **Settings Epic B list of locked fields** must say that Team Logo and Team Colors stay editable after launch (change 8d) (Home: Epic G — Brand assets panel). ⚠ open question OI-23
- **Add from Team Database** must exist on the manager card in Settings (change 8b) (Home: Epic F — Team Managers panel). ⚠ open question OI-24
- **The status label in the workspace header** must stop showing "Active" (change 10). Launch & Status Controls now uses Open/Closed (Home: Epic I — Copy & vocabulary; Launch AC).
- **The Products Tab change for C-27** must land first (Home: Dependencies & Technical Constraints). ⚠ open question OI-32
- **New filtered views** are needed in Orders, Products and My Team(s) for cards to link to (Home: Dependencies & Technical Constraints). ⚠ open question OI-17
- **Missing statuses:** no spec defines where these are saved: C-20 "PO paid", C-21/C-22 "manager kept" and C-19 "gap accepted". ⚠ open question OI-14, OI-15, OI-16
- **A Close Report entry on the Reports tab** is assumed, but the Reports spec Epic A doesn't list it. ⚠ open question OI-25
- **Whether team managers can enter the workspace** is unclear. ⚠ open question OI-20
- **Specs not included in this review:** Products Tab, Product Categories, System Modals & Toasts, Step 1 — Basics. So the triggers for C-09 to C-13 and C-27 can't be checked. ⚠ open question OI-32
- **Customize New Product** has no conflicts with Home. The only overlap is the agreed term "Customizer" (Customize Epic A).
- **Specs agree on these points (no OI):**
  - Whether the Close Report was seen is stored per user, per close (Lifecycle H).
  - Whether the Setup Guide was seen is stored per rep, per store type (Dashboard B).
  - The days-left pill turns urgent at 7 days (Settings E).
  - Orders that differ from the roster don't get a Home card (Orders; Roster Epic 2).
  - The Roster tab says "players" (Roster Epic 0).
  - Settings has seven sections, one of which shows only in some cases (Settings A; Dashboard).

## Open items
All items are in `output/2026-10-26-store-home/clarification-questions.md`, matched to Q-IDs by consolidator-store-home.
- OI-1 Six tabs vs Dashboard's fixed five tabs and their order
- OI-2 Appendix A missing from the PDF
- OI-3 Launch gate: "visible" vs "added" product
- OI-4 C-15 trigger: 7 days vs 14 days
- OI-5 C-20 tier: Action vs Informational
- OI-6 No within-tier rank in the catalogue
- OI-7 Do Action-tier conditions add a tab dot?
- OI-8 24 vs 25 registered conditions
- OI-9 C-17 is cleared by the Close Report auto-trigger before Home is usable
- OI-10 C-18: shipped vs delivered
- OI-11 C-05 oldest-age requirement
- OI-12 C-02 with multiple groups below MOQ
- OI-13 Assigned manager missing an address is not covered by any card
- OI-14 C-20 PO settlement state undefined
- OI-15 C-21/C-22 "kept" decision not persisted
- OI-16 C-19 "accepted gap" undefined
- OI-17 Store-wide player view doesn't exist
- OI-18 Card population per state incomplete
- OI-19 C-04 Blocking on Draft stores
- OI-20 Team-manager-role users and Home
- OI-21 Orders spec uses "approved" and "container"
- OI-22 Settings still uses "primary"
- OI-23 Brand lock after launch is TBD in Settings
- OI-24 Add from Team Database still open in Settings
- OI-25 Close Report entry missing from the Reports spec
- OI-26 Summary rail rows and counts
- OI-27 Amber in echoed header state and invite status
- OI-28 Qualifying resume surfaces not listed
- OI-29 Missing non-card copy
- OI-30 No resolver performance target
- OI-31 C-12 "Incomplete" label
- OI-32 Owning specs missing from the input set
