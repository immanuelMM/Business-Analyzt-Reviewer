# Implementation Summary — Store Home (Home Tab)
Sources: input/requirements/TS-Store Home (Home Tab)-161026-011919.pdf ("Home" in refs). Cross-checked against all 7 other inputs: Customize New Product, Launch & Status Controls, Order Management, Roster Management, Store Analytics, Store Settings, Store Status & Lifecycle (conflicts are cited as OIs; content covers Home only).

## 1. Scope
- New **Home** tab, first in the workspace nav. Sections: **Needs your attention** (attention cards), **Recently worked on** (resume trail), **In your store** (summary rail), **Team Managers** panel, **Brand assets** panel, **League structure directory** (League only). Plus a Setup Guide reopen link and a Close Report route (Home §Solution, Epics A–H)
- Home is a derived read layer. It adds no store state; its only new persisted data is the rep-scoped resume event (Home §Governing rule 1)
- Store-level only. A workspace-level (cross-store) equivalent is out of scope (Home §Epic A)
- Out of scope: cross-store attention; notifications/emails from conditions; snooze/dismiss; assigning conditions; full activity/audit log; per-rep config of conditions; configurable landing tab (v1); any Home-side authoring of store state; fundraising goal/progress bar; first-visit-per-tab hints; C-26 artwork "Needs vector" condition (not registered) (Home §Out of scope, §Epic A, §Epic E, §Epic G, §GR3)
- Team Manager Portal equivalent surface: recommended "no, this version", confirm before build ⚠ open question OI-13 (Home §User persona)

## 2. Actors & Roles
- **Rep (store owner)**: the only Home user. Works in any store state (Home §User persona)
- **Co-managing reps**: each sees only their own resume trail (Home §Epic D)
- **Team managers**: not Home users. If they ever are, the resolver must return a permission-filtered condition set (Home §Dependencies) ⚠ open question OI-13
- **Buyers/parents and the system**: their writes never produce resume events (Home §Epic D)

## 3. Business Rules

**Tab & navigation**
- BR-1 Six tabs in this order: Home, My Team(s), Products, Orders, Reports, Settings. Home is never hidden, disabled, conditional or removed, in any state (Draft/Open/Closed/Archived), type (Individual Team/League) or format (pop-up/always-on) ⚠ open question OI-25 (Home §Epic A; Lifecycle §Epic A)
- BR-2 Home is the default landing tab when no deep link specifies a tab. Deep links always open their target directly. No per-rep/per-store landing override in v1 (Home §Epic A)
- BR-3 Tab-label dot shows presence, not count. Blocking-tier conditions produce a dot; Informational do not ⚠ open question OI-19 (Home §Epic A, §Dependencies)
- BR-4 The Setup Guide (first entry after creation) and the Close Report (first entry after close) present over Home. Home is available on dismissal. No ordering rule between the two (they never both fire). Home reads/writes neither seen-flag (Home §Epic B)
- BR-5 The Setup Guide reopen link is always present on Home. It behaves like the header control (opens on card 1, no forced pacing, ignores seen-state) (Home §Epic B)
- BR-6 Closed or Archived store: Home shows a route to the Close Report. Availability and disabled copy are owned by Lifecycle Epic H ⚠ open question OI-28 (Home §Epic B)
- BR-7 Home does not replace the workspace header (status chip, URL, Preview Store, Setup Guide entry) (Home §Epic A)

**Governing rules (apply everywhere)**
- BR-8 No second computation: every count, threshold and condition comes from the owning surface's service. If Home and a tab disagree, Home is defective (Home §GR1)
- BR-9 Home may host an existing editor, never define one. A hosted editor writes the same field, carries full validation and disclosures, and the result is indistinguishable from the owning surface. If it can't pass those tests, Home routes instead (Home §GR1)
- BR-10 No enforcement: Home never blocks, gates or becomes a prerequisite (Home §GR1)
- BR-11 No new vocabulary: use the owning spec's labels ⚠ open question OI-26 (Home §GR1, §Epic I)
- BR-12 Every condition must be false on a well-run store. Empty attention list is the success state; no filler, tips or checklists (Home §GR3, §Presentation)

**Attention cards: tiers, ordering, limits**
- BR-13 Tiers. Blocking = red rail, primary button, first. Action = blue rail, secondary button, second. Informational = neutral rail, link or no action, last. Tier is fixed per condition and never escalates over time (Home §GR2)
- BR-14 No amber anywhere on Home. Palette is red/blue/neutral only ⚠ open question OI-4 (Home §GR2)
- BR-15 Order is Blocking → Action → Informational, then a fixed per-condition cost-of-delay rank. Not by recency or count. The same state gives the same order ⚠ open question OI-1 (Home §Presentation)
- BR-16 Cap of 5 cards plus an "n more" expander. All Blocking cards always render, even when there are more than 5 (Home §Presentation)
- BR-17 One card per condition, not per record. The card states the count (Home §Presentation)
- BR-18 Oldest age is required on C-01, C-05 and C-06 ⚠ open question OI-15 (Home §Presentation)
- BR-19 No manual dismissal/snooze. A card clears only when its underlying state clears (Home §Presentation)
- BR-20 Exactly one primary action per card (Home §Presentation)
- BR-21 Empty state: says plainly that nothing needs the rep and names the lifecycle state (Home §Presentation)
- BR-22 Archived: the section renders, states "archived, read-only, nothing to action", and shows no cards or disabled buttons (Home §Epic C Archived)
- BR-23 Only conditions registered in the Epic C catalogue may render. Retired IDs (C-25) are never reused (Home §Epic C)

**Condition catalogue** (ID, tier, trigger from the owning spec → route, clears when) (Home §Epic C tables)
- BR-24 C-01 Action: ≥1 pending order not submitted → Orders › Pending Orders. Clears when all are submitted or cancelled ⚠ open question OI-30 (Home §C1)
- BR-25 C-02 Informational: ≥1 pending group below MOQ → Pending Orders scrolled to the group. Clears when MOQ is reached or the group is submitted short (Home §C1)
- BR-26 C-03 Blocking: ≥1 pending group with an unassigned group/team manager → Settings › Distribution & Fulfillment, affected division auto-opened. The card must name the specific divisions/teams ⚠ open question OI-22 ⚠ open question OI-29 (Home §C1; Orders §Epic B)
- BR-27 C-04 Blocking: fulfillment = Ship to Team Manager and destination address empty → Settings › Distribution & Fulfillment › Fulfillment Method. Clears when a verified address exists. Settings only accepts a map-verified address, so non-empty means verified (Home §C1; Settings §Epic A3)
- BR-28 C-05 Action: ≥1 committed player with unordered Team Required gear. Opted-out players are not counted → My Team(s) store-wide player view filtered to incomplete. No Send Reminder from Home ⚠ open question OI-14 ⚠ open question OI-31 (Home §C1; Roster Mgmt; Orders §Epic C)
- BR-29 C-06 Action: ≥1 pending Roster Bank capture → My Team(s) store-wide Roster Bank. Clears when all are committed or dismissed (Home §C2)
- BR-30 C-07 Action, League only: ≥1 team with zero products (direct or via division) → canvas or the division coverage table (Home §C2)
- BR-31 C-08 Action, League + Ship-to-Manager only: ≥1 division/team "Not assigned" → Settings › Distribution & Fulfillment. C-03 suppresses C-08 for the same division (Home §C2)
- BR-32 C-09 Blocking, Draft only: zero visible products → Products › Catalog ⚠ open question OI-6 (Home §C3)
- BR-33 C-10 Action: ≥1 decorated product in Render pending → Catalog filtered. C-11 Blocking: render failed → product detail (Home §C3)
- BR-34 C-12 Blocking: ≥1 bundle with a single member → bundle detail › Members ⚠ open question OI-24 (Home §C3)
- BR-35 C-13 Action: application-sizing confirmation incomplete → product detail › Application Sizing. Copy must never claim buyers can't order (Home §C3)
- BR-36 C-27 Action: product's category deleted at workspace level → Catalog filtered. Clears only by re-filing; recreating a category with the same name does not count (Home §C3)
- BR-37 C-14 Informational: Open + set window + days-left pill urgent (final 7 days) → Settings › Schedule & Status › Edit Store Schedule (Home §C4)
- BR-38 C-15 Action: C-14 and C-05 both hold → My Team(s) incomplete-player view ⚠ open question OI-2 (Home §C4)
- BR-39 C-16 Action: Draft and ≥1 visible product → header Launch control. Clears on Open ⚠ open question OI-6 (Home §C4)
- BR-40 C-17 Informational: Closed and this user hasn't seen this close event's report → Reports › Store Close Report ⚠ open question OI-5 ⚠ open question OI-28 (Home §C4)
- BR-41 C-18 Informational: Closed with ≥1 order not shipped → Orders › All Orders ⚠ open question OI-18 (Home §C4)
- BR-42 C-19 Action, per-team-code scheduling only: scheduler gap detection flags ≥1 uncovered day → Order Window Scheduler. Clears when the gap is closed or accepted ⚠ open question OI-7 (Home §C4)
- BR-43 C-20 (tier disputed): ≥1 order with an open PO → All Orders filtered. Clears when the PO settles ⚠ open question OI-3 (Home §C5)
- BR-44 C-21 Action: manager record whose source team is no longer connected → Settings › General › League/Team Manager Information ⚠ open question OI-8 (Home §C5)
- BR-45 C-22 Blocking: C-21 holds and that person has an active/pending invite → Settings › People & Access ⚠ open question OI-8 (Home §C5)
- BR-46 C-23 Informational: fundraising resolves to disabled-with-exemptions → Catalog filtered to exempted items. Copy must not imply fault (Home §C5)
- BR-47 C-24 Informational: ≥1 invite "Invited · not logged in" for more than 7 days → People & Access ⚠ open question OI-9 (Home §C5)
- BR-48 Card population by state: Draft = C-04, C-08, C-09, C-16, C-10–C-13. Open = all except C-09, C-16, C-17, C-18, C-20. Closed = all except C-14. Archived = none ⚠ open question OI-17 (Home §Epic C population)
- BR-49 By variant: Individual Team excludes C-07 and C-08. Always-on excludes C-14, C-15 and C-19. Gating is done in the resolver, not the view (Home §Epic C population, §Dependencies)

**Resume trail ("Recently worked on")**
- BR-50 An event is written only for a rep-authored write against this store on a surface with a stable deep link. Reads, filters, sorts, searches, tab switches, buyer/system writes, other stores and workspace scope never qualify (Home §Epic D)
- BR-51 Destructive actions (delete product/bundle, clear roster) record no event. A bulk operation records one event (Home §Epic D)
- BR-52 Collapse by surface + entity, keeping the most recent. Show 5 by default, most recent first, expandable to 15. Events expire after 30 days. Per rep, always (Home §Epic D)
- BR-53 Section heading is "Recently worked on". The row action is a return ("Open", "Go to …"), never "Resume". Never styled as a to-do, percentage or score (Home §Epic D)
- BR-54 The section is absent (not empty) when there are no events. Rows with deleted targets are dropped silently. Archived stores show it read-only (Home §Epic D)

**Summary rail ("In your store")**
- BR-55 Rows in nav order: My Team(s), Products, Orders, Reports. Labels match the tabs exactly ("My Team(s)", not "Rosters"). Rows always render, including at zero ⚠ open question OI-36 (Home §Epic E)
- BR-56 Each row has the tab's headline count plus an attention overlay equal to the Epic C card's figure. Roster entries are "players" and exclude captures ⚠ open question OI-20 ⚠ open question OI-27 (Home §Epic E; Reports §Epic B)
- BR-57 Reports row is a route only: no revenue, profit or fundraising KPIs. No fundraising progress bar. Home may show "total raised" as a bare figure ⚠ open question OI-35 (Home §Epic E; Settings §Epic E)

**Team Managers panel**
- BR-58 Reads/writes the existing manager collection (Settings A2c). There is no Home-local copy. Title is "League Manager Information" / "Team Manager Information" by store type. Read view: Name, Email, Phone, Contact Preference ⚠ open question OI-34 (Home §Epic F)
- BR-59 Point of Contact tag. At least one channel on Team Manager mode: tag the designated record. Exactly one channel: the tag names it ("Point of Contact · email"). Both channels Salesperson/Custom: no tag, and a footer note says who buyers see, with a route. The tag also shows on single-manager stores. Never "Primary" or "Primary Contact" (Home §Epic F)
- BR-60 Home does not set the designation. It routes to Settings › General. A removal that would leave no designated record is blocked, with the reason and a route ⚠ open question OI-10 (Home §Epic F)
- BR-61 Add manager opens the existing full modal (First/Last Name, Email, Phone, Street Address, Contact Preference). No Add from Team Database on Home ⚠ open question OI-33 (Home §Epic F; Settings §Epic A1)
- BR-62 Adding a manager grants no access. The modal says so and links to People & Access. Rows with an email offer Invite, or show "Portal access active" / "Invited, not signed in". Removal never touches invites, and the confirmation says access remains ⚠ open question OI-32 (Home §Epic F; Settings §Epic A2b)
- BR-63 Renders in every state (exempt from post-launch locking). Read-only on Archived (Home §Epic F)

**Brand assets panel**
- BR-64 Team Logo and Team Colors use the existing Step 1/Settings components. Store Theme Color uses the Prolook picker; no bespoke controls (Home §Epic G)
- BR-65 Swatch shows its source (Team default/Custom). "Reset to team color" appears on a custom value. Helper copy says "buttons and accents only". The source flag is preserved and never inferred from the value (Home §Epic G, §Dependencies)
- BR-66 Team artwork library is linked with its Team-level scope stated, not embedded. Change Team is not hosted; it routes to Edit Store Details (Home §Epic G)
- BR-67 Editable in every state (no lock). Read-only on Archived ⚠ open question OI-11 (Home §Epic G)

**League structure directory**
- BR-68 League only; not rendered on Individual Team. Read-only and never instantiates the structure editor (Home §Epic H)
- BR-69 Shows divisions · teams · players counts (same as the My Team(s) stats header), then divisions with nested teams, then standalone teams. Per-row player count plus pending capture count (Home §Epic H)
- BR-70 Divisions always collapsed, with no size threshold. Expansion is per session, not persisted. The panel has a bounded height and scrolls (Home §Epic H)
- BR-71 Not shown: product thumbnails, product-count pills, coverage tables, catalog drawer, team codes (Home §Epic H)

**Copy & vocabulary**
- BR-72 Card copy comes only from Epic I headlines. Never ship the Epic C condition name. Name the consequence, then the action; say who is affected (Home §Epic I)
- BR-73 Banned on cards: Freight routing unresolved, Below MOQ, render gate, application sizing, re-bind/left-behind, coverage gap, blocked/submission blocked, container, Primary/Primary Contact, orphaned/dangling ⚠ open question OI-23 (Home §Epic I)
- BR-74 Tier is never shown as a label. No scolding ("forgot", "overdue"). No completion, readiness or score language anywhere (Home §Epic I)
- BR-75 Bound terms (as of 3 Sep 2026): Stock Vault, Catalog Templates, Customizer, Other stores, My Team(s), Roster Bank, Pending Orders, Submit, Open, Closed, Draft, Archived, Point of Contact. Never "Active" ⚠ open question OI-26 (Home §Epic I)

## 4. Data
- **Resume event (new, only new persisted record):** acting rep, store, surface key (existing deep-link key), optional entity ref, field-group/operation id, timestamp ⚠ open question OI-16 (Home §Epic D, §Dependencies)
  - Label composed at read time from the entity ref. Collapse, expiry and rep filtering happen on read
- **Attention resolver output** per store per render: set of conditions with count, oldest-affected timestamp (where applicable), tier, route, an archived reason code, and named entities for C-03/C-07 (Home §Dependencies)
- **Condition catalogue** is data (a registration), not code branches. Fields: ID, owning spec, tier, trigger, route, clear rule, cost-of-delay rank ⚠ open question OI-1 (Home §GR1, §Dependencies)
- **Read from existing sources:** manager collection (single-primary invariant), Team Logo/Colors, theme color + source flag, invite statuses, division/team/roster tree with player and capture counts, order/catalog counts (Home §Dependencies)
- **Not persisted:** card dismissals, tab visits, division expansion state, Setup Guide/Close Report flags (Home §GR1, §Epic H, §Epic B)

## 5. Flows
- **Workspace entry:** Setup Guide/Close Report present if triggered → Home renders beneath. If there is no deep link, Home is the default tab (Home §Epic A, §Epic B)
- **Attention:** the resolver runs progressively, Blocking predicates first → cards sorted and capped → the primary action deep-links scoped to the affected records (Home §Dependencies, §Presentation)
- **Resume:** qualifying write commits → event written (opt-in per surface) → on read: filter to rep → expire >30 days → collapse → drop deleted targets → show 5/15 (Home §Dependencies)
- **Add manager:** Add manager → shared modal with no-access notice + People & Access link → save to the collection (Home §Epic F)
- **Remove manager:** blocked if it would strand the designation (route to Settings › General). If the person has an invite, the confirmation says access remains and links to People & Access (Home §Epic F)
- **Edit primary's contact (Team Manager mode):** the modal discloses the footer change before saving → the storefront footer updates live (Home §Epic F)
- **Directory click:** division → opens that division. Team → team detail with the containing division auto-opened and breadcrumbs intact (Home §Epic H)
- **Archived store:** everything read-only, attention section states archived, rows route to read-only surfaces (Home §Epic C, §Epic D, §Epic H)

## 6. Integrations
- Internal services only: order, roster, catalog, store-config, reporting (Home §Dependencies)
- The resolver must call the owning predicates: pending-order query, MOQ evaluation, freight gate, render state, Incomplete-bundle flag, launch gate visible-product count, three-state fundraising read, days-left, coverage-gap analysis, invite status, re-bind source team (Home §Dependencies)
- Deep links reuse existing schemes: Settings section keys (must stay stable), My Team(s) division jump-ins, Products scroll-to-focus, Orders sub-tab/filter state. No parallel routing ⚠ open question OI-14 (Home §Dependencies)
- No notifications/emails are sent from Home (Home §Out of scope)

## 7. Non-Functional
- Performance: the resolver runs on every workspace entry and must not slow store opening. Progressive resolution with Blocking first was chosen over sync/TTL cache ⚠ open question OI-21 (Home §Dependencies)
- Directory rendering is bounded for large leagues and never pushes the attention list off-screen (Home §Epic H)
- Security/access: no Home code path may create, infer or revoke a portal entitlement. Manager removal must not touch the invite table (Home §Dependencies)
- Consistency: Home counts must equal the tab counts exactly. Metric target: zero disagreements (Home §Metrics)
- Instrumentation: metrics are listed (resolution times, cards per session, empty-list share, expander rates, resume CTR by age/position/tab, managers added by surface, invites after add, etc.). Events are needed to capture them (Home §Metrics)

## 8. Acceptance Criteria
- AC-1 Home tab is present and first in nav for every state/type/format, and is never disabled ⚠ open question OI-25 (Home §Epic J)
- AC-2 The attention section and the summary rail always render; never hidden or disabled (Home §Epic J)
- AC-3 First rail row is labelled "My Team(s)" and roster entries are counted as "players" (Home §Epic J)
- AC-4 No amber anywhere on Home ⚠ open question OI-4 (Home §Epic J)
- AC-5 Setup Guide/Close Report present over Home when triggered, and Home is available on dismissal (Home §Epic J)
- AC-6 Every card maps to a registered Epic C condition; unregistered conditions never render (Home §Epic J)
- AC-7 Ordering is Blocking → Action → Informational and identical across renders for the same state ⚠ open question OI-1 (Home §Epic J)
- AC-8 More than 5 conditions: top 5 plus an expander, unless more than 5 are Blocking, in which case all Blocking render (Home §Epic J)
- AC-9 The card count equals the owning tab count exactly ⚠ open question OI-27 (Home §Epic J)
- AC-10 The primary action lands on the owning surface, scoped/filtered where supported ⚠ open question OI-14 (Home §Epic J)
- AC-11 A card disappears when its state clears; no other dismissal exists (Home §Epic J)
- AC-12 Zero conditions: plain statement, no substitute content (Home §Epic J)
- AC-13 Archived: the section states archived/read-only, and no card has an action (Home §Epic J)
- AC-14 Draft with zero visible products: C-09 Blocking, and no launch action is offered on Home ⚠ open question OI-6 (Home §Epic J)
- AC-15 Draft with ≥1 visible product: C-16 renders and routes to the header launch control ⚠ open question OI-6 (Home §Epic J)
- AC-16 A qualifying write records a resume event against the rep, the store and the existing deep-link key (Home §Epic J)
- AC-17 Repeated edits to one entity show one event at the latest timestamp (Home §Epic J)
- AC-18 Buyer order, checkout write-back, Roster Bank capture or system event records no resume event (Home §Epic J)
- AC-19 Co-managing reps each see only their own trail (Home §Epic J)
- AC-20 A resume row with a deleted target is omitted with no error (Home §Epic J)
- AC-21 No events: the resume section is absent (Home §Epic J)
- AC-22 No completion %, readiness score or progress indicator anywhere on Home (Home §Epic J)
- AC-23 The Team Managers panel lists the same collection that Settings and Step 1 write (Home §Epic J)
- AC-24 Point of Contact tag rules hold (any TM channel → tag, incl. a single record; one channel → names it; none → no tag plus a "who buyers see" note); never "Primary"/"Primary Contact" (Home §Epic J)
- AC-25 Changing the designation routes to Settings › General. A stranding removal is blocked with the reason and a route ⚠ open question OI-10 (Home §Epic J)
- AC-26 The manager modal from Home is the Settings modal (full fields/validation) and states that no portal access is granted. Add manager is the only add affordance (Home §Epic J)
- AC-27 Add/edit/remove from Home is indistinguishable from Settings, and no invite is created, altered or revoked (Home §Epic J)
- AC-28 Removing a manager with an active/pending invite: the confirmation says access remains and links to People & Access (Home §Epic J)
- AC-29 Editing the primary's contact (TM mode): the footer updates without further action, and the modal disclosed this before saving (Home §Epic J)
- AC-30 A manager row with an active/pending invite shows that status instead of omitting Invite (Home §Epic J)
- AC-31 Brand panel uses the existing components and the Prolook picker, and all three assets stay editable after launch ⚠ open question OI-11 (Home §Epic J)
- AC-32 Theme swatch shows its source; Reset appears on custom; "buttons and accents only" helper copy is shown (Home §Epic J)
- AC-33 Artwork library is linked with its Team-level scope stated, not reproduced inline (Home §Epic J)
- AC-34 League directory: nested divisions/teams, standalone teams, header-matching counts, collapsed divisions, bounded height (Home §Epic J)
- AC-35 Individual Team: no directory; the rest of Home is unchanged (Home §Epic J)
- AC-36 Selecting a directory row opens My Team(s) at that entity with the division auto-opened and breadcrumbs intact (Home §Epic J)
- AC-37 Directory shows no thumbnails, coverage tables, catalog drawer or team codes (Home §Epic J)
- AC-38 Tier is never shown as a label on a card (Home §Epic J)
- AC-39 Every registered condition is false on a store with no outstanding work ⚠ open question OI-8 (Home §Epic J)
- AC-40 Card copy is the Epic I headline, never the internal name, and uses no banned term (Home §Epic J)
- AC-41 C-03 names the specific affected divisions/teams (Home §Epic J)
- AC-42 Every card label matches the owning spec's current label (Home §Epic J)
- AC-43 Rendering Home writes no store state other than the rep-scoped resume event (Home §Epic J)

## 9. Dependencies & Assumptions
- **Tabbed Store Dashboard shell** must be amended to allow 6 tabs (Appendix A) ⚠ open question OI-12 (Home §Epic A)
- **Settings must rename "primary" to "Point of Contact" first.** Home must not ship ahead of it (Appendix A 8e). Settings A1 open question closes "yes" for Add from Team Database on the manager card (8b) ⚠ open question OI-12 (Home §Epic F)
- **Settings Epic B lock list** must record Team Logo/Colors as non-locking (8d) ⚠ open question OI-11 (Home §Epic G)
- **Products Tab amendment for C-27** (queryable orphaned state + filter) must land first. Home must not scan category IDs itself (Home §Dependencies)
- **Owning-tab filters** for C-05, C-10, C-23 (and C-27) may be new work in those specs. Audit before estimating ⚠ open question OI-14 (Home §Dependencies)
- Owning specs referenced but not in this input set: Products Tab, Product Categories, Product Catalog Management, System Modals & Toasts, Tabbed Store Dashboard, Step 1 — Basics ⚠ open question OI-24 (Home §Epic C, §Epic I)
- Assumption, checked: Roster Management uses "players" (no "members" found), so no reconciliation is needed (Home §Epic E; Roster Mgmt)
- Assumption, checked: Launch & Status Controls already renamed Active → Open. Home's "stale page" remark is outdated; Lifecycle and Orders still use banned terms ⚠ open question OI-26 (Home §Epic I)
- Cross-check with no conflict found: Customize New Product (vocabulary, branding pre-population), days-left 7-day urgency, theme color/Prolook/Reset, Point of Contact modes, "Not assigned" state, store-wide Roster Bank (Settings §E, §I, §A2; Roster Mgmt §Epic 0, §Epic 5)

## Open items
See `clarification-questions.md` in this run folder for the full questions.
- ⚠ open question OI-1 — no cost-of-delay rank exists in the catalogue
- ⚠ open question OI-2 — C-15 trigger (7-day C-14) conflicts with "fires at 14 days"
- ⚠ open question OI-3 — C-20 tier Action vs Informational; trigger not limited to Closed
- ⚠ open question OI-4 — C-24 "blue on Home" vs Informational tier
- ⚠ open question OI-5 — C-17 reads the Close Report seen flag; the modal marks it seen first
- ⚠ open question OI-6 — launch gate "visible product" (Home) vs "product added" (Lifecycle)
- ⚠ open question OI-7 — C-19 "accepted" gap state doesn't exist in Settings
- ⚠ open question OI-8 — C-21/C-22 "kept" decision not persisted by Settings
- ⚠ open question OI-9 — C-24 7-day threshold has no owning spec
- ⚠ open question OI-10 — designation in the manager modal (Settings) vs not (Home)
- ⚠ open question OI-11 — Team Logo/Colors post-launch lock is TBD in Settings
- ⚠ open question OI-12 — Appendix A amendments are missing from the document
- ⚠ open question OI-13 — Team Manager Portal equivalent surface undecided
- ⚠ open question OI-14 — deep-link filters may not exist; unestimated scope
- ⚠ open question OI-15 — C-05 oldest-age requirement vs Epic I copy; always-on window date
- ⚠ open question OI-16 — resume record: stored label vs composed label
- ⚠ open question OI-17 — Draft allow-list incomplete; "24" vs 25 conditions
- ⚠ open question OI-18 — C-18 trigger (not shipped) vs clear rule (delivered); C-04 resolved by Settings §A3
- ⚠ open question OI-19 — do Action-tier conditions produce tab dots?
- ⚠ open question OI-20 — rail overlay mapping, "summary strip", total raised
- ⚠ open question OI-21 — no resolver latency budget or loading behaviour
- ⚠ open question OI-22 — C-03 on Individual Team stores
- ⚠ open question OI-23 — "container" banned on Home but used in the Orders spec
- ⚠ open question OI-24 — C-12 "Incomplete" label; Products spec not provided
- ⚠ open question OI-25 — six tabs (Home) vs Detail/Roster tab set (Lifecycle)
- ⚠ open question OI-26 — banned terms (approve, Pause, Active) still used by Orders/Lifecycle
- ⚠ open question OI-27 — "Pending Orders"/"Orders" counts defined differently by Orders and Reports
- ⚠ open question OI-28 — Close Report location: Reports (Lifecycle) vs not in Reports spec vs Settings
- ⚠ open question OI-29 — C-03 route: Settings D&F vs the Orders Assign Managers modal
- ⚠ open question OI-30 — C-01 "cancelled" clear path has no cancel action in Orders
- ⚠ open question OI-31 — C-05 opt-out not defined in Orders/Roster completion
- ⚠ open question OI-32 — invite status labels differ from Settings
- ⚠ open question OI-33 — Home decides Settings' open "Add from Team Database" question
- ⚠ open question OI-34 — Home manager read view omits Street Address
- ⚠ open question OI-35 — "total raised" = fundraising or order revenue?
- ⚠ open question OI-36 — tab label My Team(s) vs My Team / My Teams
