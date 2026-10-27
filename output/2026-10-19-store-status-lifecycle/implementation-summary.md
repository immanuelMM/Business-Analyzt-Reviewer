# Implementation Summary — Store Status & Lifecycle
Sources: `input/requirements/TS-Store Status & Lifecycle-161026-094525.pdf` (cited as **SSL**, page + section)
Cross-checked for conflicts only: TS-Launch & Status Controls (**LSC**), TS-Store Settings (**SET**), TS-Store Analytics (**ANA**), TS-Store Home (**HOME**)

## 1. Scope
- In scope: the authoritative store state machine (Draft, Open, Closed, Archived), its transitions, behaviour per surface, buyer closed screen, status badges/filters/KPI, and the Store Close Report (SSL p1 Solution; p8 Store Close Report)
- Other features own only the UI surface that triggers a transition; this spec owns the semantics (SSL p1 Solution)
- Archive UI (Danger Zone placement, modal copy) is owned by "Store Detail Tab — Epic C"; this spec owns the behavioural contract (SSL p7 Epic E). ⚠ open question OI-2
- Close Report UI and its on-demand entry are owned by the Reports tab; the secondary link is owned by the Store Status card; the paced card shell is owned by System Modals & Toasts (SSL p8–9)
- Out of scope: store deletion (none exists) (SSL p3 Note); self-service un-archive (SSL p7 Epic E); image/share-card export (SSL p10 Exports); separate dealer/decorator report view (SSL p11 Roles); in-product reduce-motion control (SSL p11 Experience principles)
- Unrelated "application verification" dependency block (EIN, banking, admin review queue) appears in this spec ⚠ open question OI-20 (SSL p14)

## 2. Actors & Roles
- **Rep (managing rep):** launches, closes, re-opens; full workspace access in Draft/Open/Closed (SSL p2 Transitions)
- **Store owner (rep):** the only user who can Archive; Archive is hidden from non-owners (SSL p7 Epic E). How owner differs from other managing reps is undefined ⚠ open question OI-21
- **Team-manager role:** full parity with the rep for the Close Report (view + export); owner-only lifecycle actions stay hidden (SSL p11 Roles). Conflicts with SET's scoped manager variant ⚠ open question OI-12. Rights on launch/close/re-open are unstated ⚠ open question OI-21
- **System:** performs the auto-close at the pop-up close date/time (SSL p2 Transitions)
- **Prolook support staff:** the only actor who can reverse Archived (SSL p3 Transitions; p7 Epic E). Definitions say "managing rep" ⚠ open question OI-1
- **Buyer:** sees the storefront only when it is Open (SSL p3 Behavior Matrix)

## 3. Business Rules
- BR-1: Every newly created store starts in Draft (SSL p1 Definitions; p5 Epic A)
- BR-2: Draft → Open only by a manual rep "Launch Store" action and only if the store has ≥1 product added. ⚠ open question OI-5 (added vs visible). ⚠ open question OI-7 (confirmation modal and launch email per LSC) (SSL p2 Transitions; p5 Epic A)
- BR-3: No transition back to Draft from Open, Closed or Archived; there is no "revert to draft" action anywhere in the UI (SSL p3 Transitions; p5 Epic A)
- BR-4: Open → Closed happens either manually (rep, Store Status card) or automatically when a pop-up store's configured close date/time is reached (system). ⚠ open question OI-3 (Pause vs Close Store label) (SSL p2 Transitions; p6 Epic C)
- BR-5: Closed → Open only by a manual rep "Re-open Store" action, available at any time, with no confirmation modal (SSL p3 Transitions; p6 Epic D)
- BR-6: Open → Archived and Closed → Archived only by the store owner via "Archive Store" in the Danger Zone. ⚠ open question OI-2 (location) (SSL p2–3 Transitions)
- BR-7: Archived → Open/Closed is not self-service; support staff only. ⚠ open question OI-1 (SSL p3 Transitions)
- BR-8: There is no Draft → Archived transition and no deletion. ⚠ open question OI-19 (SSL p3 Transitions, Note)
- BR-9: Close Store and Re-open Store are mutually exclusive on the Store Status card; only the one valid for the current state is shown (SSL p5 Epic B; p6 Epic D)
- BR-10: New orders are allowed only in Open; blocked in Draft, Closed and Archived (SSL p3 Behavior Matrix)
- BR-11: Existing/in-flight orders are unaffected by Closed or Archived; no automatic cancellation or hold (SSL p3 Behavior Matrix; p6 Epic B)
- BR-12: Management workspace is fully editable in Draft, Open and Closed; read-only in Archived. ⚠ open question OI-6 (post-launch partial lock in SET) (SSL p3 Behavior Matrix)
- BR-13: Edits made while Closed go live on the storefront when the store is re-opened (SSL p3 Behavior Matrix; p6 Epic D)
- BR-14: Ordering window (pop-up only): configurable but not running in Draft; runs in Open; "suspended — does not advance" in Closed; closed immediately and permanently on Archive. ⚠ open question OI-11, OI-10 (SSL p3–4 Behavior Matrix)
- BR-15: Stores list shows Draft, Open and Closed with badges; Archived stores are removed from the list entirely. ⚠ open question OI-8 (how archived stores are reached) (SSL p3 Behavior Matrix; p8 Epic G)
- BR-16: The Open Stores KPI counts only Open stores; Draft, Closed and Archived are not counted. ⚠ open question OI-4 (label) (SSL p4 Behavior Matrix; p8 Epic G)
- BR-17: A close event is any transition into Closed (manual or automatic); each close event generates exactly one Store Close Report scoped to that Active Order Window. ⚠ open question OI-22 (window start) (SSL p8 Definition & scope)
- BR-18: Re-open then re-close produces a new close event and a new report; prior reports are retained and never overwritten (SSL p7 Epic D; p8 Definition & scope)
- BR-19: Archiving does not trigger the auto-presented report; existing reports stay viewable read-only with working exports. ⚠ open question OI-9 (archive from Open without prior close) (SSL p9 Trigger; p12 Epic H)
- BR-20: Close Report auto-trigger fires when the store is Closed and the current user has not seen the report for that close event; seen state is per user per close event (SSL p9 Trigger & presentation)
- BR-21: Any dismissal (View full report, Done, close icon, Escape, backdrop) marks the report seen for that user (SSL p9 Trigger & presentation)
- BR-22: Always-open (non-pop-up) stores have no scheduled close, so their auto-trigger only follows a manual Close Store (SSL p9 Trigger & presentation)
- BR-23: The Close Report is a read layer only: no new metrics or state; every figure must come from the same source as, and reconcile exactly with, the Reports tab and Orders tab (SSL p8–9 Note; p14–15 Dependencies)
- BR-24: Refunds and cancellations net out of revenue the same way as on the Reports tab, and the netting is stated on the report (SSL p10 Report contents)
- BR-25: Summary hero figures are Total Revenue, Orders, Net Fundraising (or Avg. Order Value when Team Fundraising is disabled), and top product by quantity ordered. Each shows exact value, unit, an "as of [close date]" stamp and a vs-last-period trend delta. ⚠ open question OI-15, OI-16 (SSL p10 Report contents)
- BR-26: Team Fundraising disabled means the Net Fundraising hero and the fundraising breakdown are omitted and AOV takes the hero slot (SSL p13 Edge cases)
- BR-27: Zero orders means superlatives and celebratory framing are suppressed, the detail layer shows an empty state, and exports produce valid files with headers and zero rows (SSL p12–13 Edge cases)
- BR-28: Single order means the top-product superlative is phrased so it does not imply a ranking (SSL p13 Edge cases)
- BR-29: Export formats are PDF and CSV only; file names are `StoreCloseReport_[StoreName]_[CloseDate].pdf` / `.csv` (SSL p10–11 Exports)
- BR-30: Summary layer is user-paced (click, tap, arrow keys; no auto-advance), one figure per view, with a persistent "Skip to full report" control and a progress indicator (SSL p11 Experience principles)
- BR-31: Motion uses fades/scale-ins of about 200–300 ms and a count-up on the hero figure only; no parallax, confetti or looping animation (SSL p11 Experience principles)
- BR-32: Three type levels only (hero figure, section header, label) with tabular lining numerals; report uses the store's Team Colors and Team Logo, with colour used only for trend up/down (SSL p11 Experience principles)

## 4. Data
- **Store.status:** enum `draft | open | closed | archived`; default `draft` (SSL p1 Definitions)
- **Store.type:** pop-up (has configured ordering window open/close date-time) vs always-open (SSL p9 Trigger & presentation)
- **Store.owner:** needed for owner-only Archive. ⚠ open question OI-21 (SSL p7 Epic E)
- **Product count** per store, read by the launch gate. ⚠ open question OI-5 (SSL p5 Epic A)
- **Close-event record (durable):** store id, window open timestamp, window close timestamp, trigger source (rep name or "system") (SSL p14 Dependencies)
- **Seen-state record (persistent, not session):** user id × close-event id (SSL p14 Dependencies)
- **Close Report detail rows** at line-item grain: Web Order #, Factory Order #, order origin badge, buyer, roster/team, product, size, quantity, unit price, line total, personalization (name/number), production stage, PO number, tracking, fulfilment status, Minimum Quantity Fee (SSL p10 Report contents)
- **Detail layer aggregates:** Team Profit chart ⚠ open question OI-13; Pending Orders count; below-MOQ containers open at close (MOQ progress + itemized fee); Fundraising breakdown (Collected, Platform Fees, Card Processing Fees, Net); AOV; production-stage mix (Order placed → Confirmed → Artwork → Factory production → Shipped → Delivered); refunds/cancellations count + amount; not-yet-shipped count; open-PO/unsettled-payment flags (SSL p10 Report contents; p13 Edge cases)
- Detail layer includes every order in the window, including cancelled and refunded orders (SSL p12 Epic H)
- Archived: all order history, reports, roster data and product records are retained permanently (SSL p7 Epic E)

## 5. Flows
- **Create → Draft:** wizard deploy → store in Draft, no buyer URL; Store Setup Guide cover card states "not yet live" on first entry (status only, it does not enforce the gate) (SSL p5 Epic A)
- **Launch:** zero products → Launch disabled + explanatory message; ≥1 product → Launch Store → Open immediately, storefront public. ⚠ open question OI-5, OI-7 (SSL p5 Epic A)
- **Manual close:** Open → Store Status card → Close Store → confirmation (no new orders; existing orders unaffected; can re-open any time) → Closed instantly; closed landing page; badge = Closed; close event + report created (SSL p5–6 Epic B)
- **Auto-close (pop-up):** configured close date/time reached → Closed with no rep action; behaves exactly like a manual close; rep is notified on next workspace entry via the Close Report modal. ⚠ open question OI-17 (SSL p6 Epic C)
- **Re-open:** Closed → Re-open Store (no confirmation) → Open; workspace edits go live; badge updates in store list, workspace header and KPIs; rep may optionally edit the store schedule. ⚠ open question OI-10 (SSL p6 Epic C–D)
- **Archive:** owner → Archive Store → modal discloses 4 consequences (storefront hidden; no new orders + window closed; removed from active list; history/reports retained) + "only undone by Prolook support" → Archived; URL serves neutral closed screen; workspace read-only (SSL p7 Epic E)
- **Un-archive:** rep contacts Prolook support → support reverses; no product UI path. ⚠ open question OI-1 (SSL p7 Epic E)
- **Buyer on Closed/Archived URL:** neutral closed screen; no products, cart or checkout; direct product/checkout URLs redirect to that screen; Archived is indistinguishable from Closed. ⚠ open question OI-18 (SSL p7–8 Epic F)
- **Close Report first entry:** Closed + unseen → full-screen modal (full-page route at narrow viewports) → paced summary → View full report (detail layer) or dismiss → marked seen; later entries show the normal Closed workspace. ⚠ open question OI-14 (SSL p9 Trigger & presentation)
- **Close Report on demand:** Reports tab top entry (enabled for Closed/Archived; disabled with "Available when the store closes" for Draft/Open) or "View Close Report" link on Store Status card → review mode (summary, no forced pacing, detail one click away) (SSL p9 On-demand access)

## 6. Integrations
- Storefront routing must enforce status: closed screen and direct-URL redirect for Closed/Archived; inaccessible for Draft (SSL p3 Behavior Matrix; p8 Epic F)
- Scheduler/job to auto-close pop-up stores at the configured close date/time (SSL p6 Epic C)
- Close Report aggregation reads the same source as the Reports tab KPI cards and the Fundraising Report (SSL p15 Dependencies)
- Summary PDF uses the existing Fundraising Report export service (Download PDF pattern with settings step: summary style, detailed breakdown, date range, report notes) (SSL p10 Exports; p15 Dependencies)
- CSV uses the existing All Orders export service and respects the current column-visibility selection (SSL p10 Exports; p15 Dependencies)
- Summary layer uses the shared paced card sequence component from System Modals & Toasts (SSL p9; p15 Dependencies)
- Trigger source recorded consistently with System Emails ("system" for auto-close). ⚠ open question OI-17 (SSL p14 Dependencies)

## 7. Non-Functional
- Very large stores: summary layer is fixed size; the detail table paginates and virtualizes; exports contain the complete data set (SSL p13 Edge cases)
- Responsive: the modal becomes a dedicated full-page route at narrow viewports (SSL p9 Trigger & presentation)
- Accessibility/input: summary advances by click, tap or arrow keys; Escape dismisses (SSL p9; p11)
- Seen state and close events must be durable, not session-only (SSL p14 Dependencies)
- Targets: 0% launches with zero products; 100% pop-up auto-close accuracy; zero orders accepted in Closed/Archived; 100% of close events produce a viewable report (SSL p14 Metrics)

## 8. Acceptance Criteria
- AC-1: Given a store is created via the wizard, then it is Draft and no buyer-facing URL is accessible (SSL p5 Epic A)
- AC-2: Given a Draft store, then all workspace tabs are accessible and fully editable. ⚠ open question OI-2 (tab list) (SSL p5 Epic A)
- AC-3: Given a Draft store with zero products, then Launch is disabled with a message that at least one product is required (SSL p5 Epic A)
- AC-4: Given a Draft store with ≥1 product, when Launch Store is clicked, then the store is Open immediately and the storefront is public (SSL p5 Epic A)
- AC-5: Given a launched store (Open/Closed/Archived), then no "revert to draft" action exists anywhere in the UI (SSL p5 Epic A)
- AC-6: Given a Draft store, then the Stores list shows a Draft badge and it is excluded from the Open Stores KPI (SSL p5 Epic A)
- AC-7: Given a new Draft store, on first workspace entry the Setup Guide cover card states the store is not yet live (SSL p5 Epic A)
- AC-8: Given an Open store, then the Store Status card shows Close Store; given Closed, it is not shown (SSL p5 Epic B)
- AC-9: Given Close Store is clicked, then the confirmation states: no new orders, existing orders unaffected, can re-open any time (SSL p6 Epic B)
- AC-10: Given confirmation, then the store is Closed instantly, the storefront shows the closed landing page and the badge shows Closed (SSL p6 Epic B)
- AC-11: Given a Closed store, then all workspace tabs remain fully editable (SSL p6 Epic B)
- AC-12: Given a Closed store with in-flight orders, then they process normally with no cancellation or hold (SSL p6 Epic B)
- AC-13: Given a transition into Closed by any path, then a Store Close Report is generated for that close event (SSL p6 Epic B; p11 Epic H)
- AC-14: Given a pop-up store reaches its close date/time, then it becomes Closed with no rep action (SSL p6 Epic C)
- AC-15: Given auto-close, then storefront, orders, editability and badge behave identically to a manual close (SSL p6 Epic C)
- AC-16: Given auto-close, when the rep next opens the workspace, then they are informed the window has closed (via the Close Report modal). ⚠ open question OI-17 (SSL p6 Epic C)
- AC-17: Given an auto-closed store, then the rep can re-open from the Store Status card and optionally edit the schedule (SSL p6 Epic C)
- AC-18: Given a Closed store, then Re-open Store is shown and Close Store is not (SSL p6 Epic D)
- AC-19: Given Re-open Store is clicked, then the store is Open immediately with no confirmation modal (SSL p6 Epic D)
- AC-20: Given edits made while Closed, when re-opened, then they appear on the live storefront immediately (SSL p6 Epic D)
- AC-21: Given re-open, then the badge shows Open in the store list, workspace header and KPI aggregations (SSL p6 Epic D)
- AC-22: Given re-open, then the prior close event's report remains viewable and is not overwritten; a later close creates a new report (SSL p7 Epic D)
- AC-23: Given an Open/Closed store, when a non-owner rep views the Danger Zone location, then Archive Store is not visible (SSL p7 Epic E)
- AC-24: Given the owner clicks Archive Store, then the modal states all four consequences and "can only be undone by Prolook support" (SSL p7 Epic E)
- AC-25: Given archive is confirmed, then the storefront URL immediately serves the neutral closed screen and is not discoverable or shoppable (SSL p7 Epic E)
- AC-26: Given an Archived store, then it no longer appears in the Stores tab list (SSL p7 Epic E)
- AC-27: Given an Archived store, then settings, products, roster and orders are visible but no field or action is editable (SSL p7 Epic E)
- AC-28: Given an Archived store, then all order history, reports, roster and product records are retained and accessible read-only (SSL p7 Epic E)
- AC-29: Given a rep wants to un-archive, then only Prolook support can do it; there is no self-service path (SSL p7 Epic E)
- AC-30: Given a buyer visits a Closed store URL, then they see "This store is currently closed" with no products, cart or checkout. ⚠ open question OI-18 (SSL p7 Epic F)
- AC-31: Given a buyer visits an Archived store URL, then they see the same closed screen with no sign that the store is archived (SSL p7 Epic F)
- AC-32: Given Closed or Archived, when a buyer opens a product or checkout URL directly, then they are redirected to the closed screen (SSL p8 Epic F)
- AC-33: Given the Stores list, then badges are Draft (blue), Open (green), Closed (amber); Archived stores do not appear (SSL p8 Epic G)
- AC-34: Given the Stores tab Filter, then the status values are Draft, Open, Closed; Archived is not offered (SSL p8 Epic G)
- AC-35: Given the Overview KPI card, then it counts only Open stores. ⚠ open question OI-4 (SSL p8 Epic G)
- AC-36: Given a Closed store and a user who has not seen the report, when they open the workspace, then the report is shown as a full-screen modal before other content is actionable. ⚠ open question OI-14 (SSL p11 Epic H)
- AC-37: Given the user has viewed or dismissed the report, then it does not re-appear on later entries (SSL p11–12 Epic H)
- AC-38: Given Closed → Open → Closed, then the modal fires once more for the new close event, scoped to the new window (SSL p12 Epic H)
- AC-39: Given the modal is open, then View full report, Done, close icon, Escape or backdrop each close it and mark it seen; View full report opens the detail layer (SSL p12 Epic H)
- AC-40: Given a Closed or Archived store, then the Reports tab shows a Store Close Report entry that opens review mode. ⚠ open question OI-9 (SSL p12 Epic H)
- AC-41: Given a Draft or Open store, then the Reports tab entry is visible but disabled, with "available when the store closes" helper text (SSL p12 Epic H)
- AC-42: Given a Closed store, then the Store Status card shows a View Close Report link next to Re-open Store (SSL p12 Epic H)
- AC-43: Given the report, then every summary figure matches the Reports tab figure for the same window (SSL p12 Epic H)
- AC-44: Given the detail layer, then every order in the window is present, including cancelled and refunded orders, with current production stage and fulfilment status (SSL p12 Epic H)
- AC-45: Given export, then a summary PDF and a full line-item CSV are available, named per convention; no other format is offered (SSL p12 Epic H)
- AC-46: Given a team-manager-role user, then they can view and export the same report content as the rep, and owner-only actions stay hidden. ⚠ open question OI-12 (SSL p12 Epic H)
- AC-47: Given re-open or archive, then previously generated reports remain viewable and their exports work (SSL p12 Epic H)
- AC-48: Given the summary layer at any step, then "Skip to full report" is visible and jumps to the detail layer (SSL p12 Epic H)

## 9. Dependencies & Assumptions
- Status persistence plus propagation to the storefront, store list, workspace header and Overview KPI (SSL p6 Epic D; p8 Epic G)
- Durable close-event record and per-user per-close-event seen-state record (SSL p14 Dependencies)
- Reports tab, Orders tab, Fundraising Report, All Orders CSV export and Fundraising PDF export services already exist and are reused (SSL p10; p15 Dependencies)
- Shared paced card sequence component (System Modals & Toasts) and Store Setup Guide (Tabbed Store Dashboard, Epic B) are external specs not provided here (SSL p5 Epic A; p9)
- Team Profit data source is assumed by this spec but has been removed per ANA. ⚠ open question OI-13 (SSL p10 Report contents)
- Application verification / EIN / banking / admin review queue dependency. ⚠ open question OI-20 (SSL p14 Dependencies)

## Open items
See the consolidator's question file for this run (`output/2026-10-19-store-status-lifecycle/`).
- ⚠ OI-1 Archive reversal: managing rep vs support staff only
- ⚠ OI-2 Store Status card / Danger Zone location (Detail tab vs Settings → Schedule & Status) and the workspace tab list
- ⚠ OI-3 Manual close label: "Pause" vs "Close Store"
- ⚠ OI-4 KPI label: "Open Stores" vs "Active Stores"
- ⚠ OI-5 Launch gate counts products added vs visible products
- ⚠ OI-6 Fully editable after launch vs SET partial post-launch lock
- ⚠ OI-7 Launch confirmation/success modals and launch email (LSC) are missing from the lifecycle spec
- ⚠ OI-8 No navigation path to Archived stores once removed from the list
- ⚠ OI-9 Archive from Open with no prior close: is a report created, and what does the Reports entry show?
- ⚠ OI-10 Re-open after the close date has passed; scheduled auto-open; Draft pop-up open date
- ⚠ OI-11 Does Closed "suspend" the window countdown/close date?
- ⚠ OI-12 Team-manager full parity vs scoped manager variant (SET)
- ⚠ OI-13 Team Profit chart/trend no longer has a data source (ANA/SET)
- ⚠ OI-14 Modal blocks workspace vs "gates nothing" (SET); celebratory vs restrained tone
- ⚠ OI-15 Comparison period for the "vs last period" trend delta
- ⚠ OI-16 Final hero-figure list (4 defined vs "three to five"; SET metric set OPEN)
- ⚠ OI-17 Auto-close banner/indicator and email: is either built?
- ⚠ OI-18 Closed screen copy, and one vs two screens for Closed/Archived
- ⚠ OI-19 Draft stores cannot be archived or deleted
- ⚠ OI-20 Unrelated verification/EIN dependency block: is it in scope?
- ⚠ OI-21 Owner vs managing rep vs team manager rights per transition
- ⚠ OI-22 Active Order Window start for always-open and re-opened stores
