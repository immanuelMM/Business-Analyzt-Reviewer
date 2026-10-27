# Implementation Summary — Store Analytics (Reports Tab)
Sources: input/requirements/TS-Store Analytics (Reports Tab)-161026-094501.pdf (primary, cited as "SA"). Cross-checked against: TS-Order Management (Orders Tab) ("OM"), TS-Store Settings (Settings Tab) ("SS"), TS-Store Status & Lifecycle ("SL"), TS-Store Home (Home Tab) ("SH").

## 1. Scope
- In scope: a **Reports** tab in the manage-store workspace; every figure scoped to the currently-viewed store (SA §Epic A).
- Page stacks, in order: KPI summary row (4 cards) → Team Revenue / League Revenue chart → Team Fundraising Report (conditional) (SA §Epic A).
- Store Close Report entry at the top of the Reports tab is specified by another doc but missing from this one ⚠ open question OI-10 (SL §Store Close Report "On-demand access").
- Out of scope: separate header Export action (export is only the Fundraising Report's Download PDF) (SA §Epic A).
- Out of scope: Payouts tracker widget (covered by the cross-store Overview dashboard) (SA §Epic C).
- Not in scope: a per-store copy of the Overview's chart. Team Revenue chart and Fundraising Report are this page's own components (SA §Epic A "Component ownership").
- Day/Month/Year granularity toggle and highlighted current-period bar on the chart are undecided ⚠ open question OI-2 (SA §Epic A "OPEN").

## 2. Actors & Roles
- Rep (store manager): views the Reports tab for the store they are in, exports the Fundraising PDF, and clicks through to the Orders tab (SA §User persona).
- Team-manager portal users have a "Reporting" area scoped to the store, but what they see on this tab, whether the Orders deep-links apply, PDF rights and league-filter scoping are not defined ⚠ open question OI-13 (SS §Epic A2b; SL §Roles & permissions).

## 3. Business Rules
- BR-1: Every figure on the tab is scoped to the currently-viewed store only (SA §Epic A).
- BR-2: KPI cards reuse the Overview dashboard's KPI card components and design. This sharing must be kept (SA §Epic A, §Epic B).
- BR-3: The Team Revenue chart and the Fundraising Report are independent components. Changes to the Overview's graph cards must not propagate to them (SA §Epic A).
- BR-4: Every KPI card shows a value and a trend vs. last month ⚠ open question OI-4 (SA §Epic B).
- BR-5: Total Revenue = total dollar amount plus % trend vs. last month ⚠ open question OI-3 ⚠ open question OI-6 (SA §Epic B Card 1).
- BR-6: Orders = count of closed sales plus directional trend ⚠ open question OI-5 ⚠ open question OI-9 (SA §Epic B Card 2).
- BR-7: Pending Orders = count of active orders currently processing plus trend ⚠ open question OI-5 ⚠ open question OI-9 (SA §Epic B Card 3). The Orders tab defines Pending as "placed ... not yet approved by the rep and sent to the factory" (OM §Epic A).
- BR-8: Avg. Order Value = average amount spent per order/session plus trend ⚠ open question OI-5 (SA §Epic B Card 4).
- BR-9: Team revenue = gross buyer spend (full buyer-paid amount) on orders attributable to the team. It is read from order totals, not from fundraising line items (resolved 2026-09-11) ⚠ open question OI-6 (SA §Epic C; §Dependencies).
- BR-10: The chart is a revenue chart, not a margin chart. No copy, axis label, tooltip or export header may say "profit" or "margin" (SA §Epic C).
- BR-11: Single-team store: chart is titled **Team Revenue**, shows that team's revenue and has no filter (SA §Epic C).
- BR-12: League store: chart is titled **League Revenue**, aggregates all teams and divisions in the league, and has a filter to narrow to one team or division (SA §Epic C).
- BR-13: Fundraising Report gating uses three states: (1) enabled → render; (2) disabled, nothing collecting → hide; (3) disabled with commercially-locked items still collecting → render ⚠ open question OI-1 (SA §Epic D; §Dependencies; SS §Epic A4).
- BR-14: "Still collecting" item = item carrying a non-cancelled order (commercial lock outranks the store-level disable). If all its orders are cancelled, the lock releases (SA §Epic D; SS §Epic A4).
- BR-15: In state (3) the report shows a mixed-state banner: fundraising has been disabled for the store and the figures cover items that were already ordered (SA §Epic D "Mixed-state banner").
- BR-16: Report covers only items whose fundraising was enabled at order time. Historical contributions stay in totals and are never recalculated against current flags (SA §Epic D "Per-item scope"; §Dependencies).
- BR-17: Report only includes price additions marked "Fundraising" in the item's price settings. A scope-note banner says so (SA §Epic D "Scope note").
- BR-18: Net Fundraising = Fundraising Collected − Platform Fees − Card Processing Fees ⚠ open question OI-7 (SA §Epic D; §Dependencies).
- BR-19: Date-range presets: This season (store's open window), Last 7 days, Last 30 days, Year to date. The selected range scopes the report figures ⚠ open question OI-8 ⚠ open question OI-15 (SA §Epic D).
- BR-20: PDF settings modal: summary mode radio (Net Fundraising Summary is the default; Gross Total Summary is the alternative) plus checkboxes Detailed Breakdown, Selected Date Range, Include PDF Report Notes ⚠ open question OI-14 (SA §Epic D).
- BR-21: Figures on the Store Close Report must match the Reports tab for the same window, read from the same source (SL §Acceptance "Figures reconcile"; §Dependencies). The Close Report still uses Team Profit naming ⚠ open question OI-11, and its fundraising handling in the mixed state differs ⚠ open question OI-12 (SL §Report contents).

## 4. Data
- KPI aggregates per store: revenue, closed-order count, pending count, AOV, month-over-month trends ⚠ open question OI-3 (SA §Dependencies).
- Team-revenue time series from order totals. It replaces the team-profit series, which no longer has a source (SA §Dependencies).
- League stores: order→team and team→division joins must be available to the analytics query (SA §Dependencies).
- Fundraising line items: fundraising-flagged price additions, stored as they were at order time, aggregated per order and date range (SA §Dependencies).
- Store flag: Team Fundraising (Settings → General → Store Details). Item flag: per-item fundraising toggle in price settings (SA §Epic D; SS §Epic A4).
- Fee data: platform-fee and card-processing-fee calculations; rates and sources not given ⚠ open question OI-7 (SA §Dependencies).

## 5. Flows
- Open Reports tab → KPI row → chart → Fundraising Report (if gated in) (SA §Epic A).
- Click Orders card → Orders tab, All Orders view (SA §Epic B Card 2).
- Click Pending Orders card → Orders tab, Pending Orders sub-tab (SA §Epic B Card 3).
- League store: rep picks a team or division in the chart filter → chart narrows to it (SA §Epic C).
- Fundraising Report: pick a date preset → table and figures re-scope (SA §Epic D).
- Download PDF → Fundraising Report Settings modal → choose options → PDF generated (SA §Epic D).
- Empty/zero-data states and behaviour per store status (Draft/Archived) are not specified ⚠ open question OI-15 (SL lifecycle states).

## 6. Integrations
- Shared internal order/analytics services (SA §Dependencies).
- Cross-tab navigation hooks into the Orders tab sub-tabs (SA §Dependencies).
- PDF generation service honouring the modal settings. The Store Close Report reuses this export service (SA §Dependencies; SL §Dependencies).
- Three-state fundraising read shared with Product Catalog Management Governing rule 3 and the Store Settings card Epic A4 (SA §Dependencies).

## 7. Non-Functional
- Accuracy: store-scoped figures must reconcile with source orders and fundraising line items (SA §Metrics).
- Immutability: historical fundraising figures are never recomputed (SA §Dependencies).
- Analytics events implied by the metrics: tab engagement per store, PDF downloads, KPI-card click-through, Fundraising Report views in the mixed state, share of catalog contributing to fundraising (SA §Metrics).

## 8. Acceptance Criteria
- AC-1: Given any store, the Reports tab shows KPI row, then chart, then (if gated) Fundraising Report, all scoped to that store only (SA §Epic A).
- AC-2: Given the Orders card is clicked, the Orders tab opens on All Orders. Given Pending Orders is clicked, it opens on the Pending Orders sub-tab (SA §Epic B).
- AC-3: Given the Reports tab, the chart is a full-width vertical column bar chart (identical bar widths, gray axis baseline, same spacing) of team revenue over time below the KPI row (SA §Epic C).
- AC-4: No chart copy, axis label, tooltip or export header refers to profit or margin (SA §Epic C).
- AC-5: Given a league store, the chart is titled League Revenue, aggregates all teams/divisions and offers a team/division filter. Given a single-team store, it is titled Team Revenue with no filter (SA §Epic C).
- AC-6: Chart revenue equals the sum of buyer-paid order totals for the team, independent of fundraising figures (SA §Epic C RESOLVED).
- AC-7: Given fundraising is disabled and nothing is collecting, the page ends at the chart (SA §Epic A; §Dependencies).
- AC-8: Given the store flag is off and locked items are still collecting, the report renders with the mixed-state banner (SA §Epic D).
- AC-9: Given an item's fundraising is switched off, its earlier contributions remain in the totals unchanged (SA §Epic D "Per-item scope").
- AC-10: The breakdown table lists Fundraising Collected, Platform Fees, Card Processing Fees and a bolded Net Fundraising, followed by a collected → fees → net summary sentence ⚠ open question OI-8 (SA §Epic D).
- AC-11: The scope-note banner states the report only includes price additions marked "Fundraising" (SA §Epic D).
- AC-12: Download PDF opens the settings modal with Net Fundraising Summary preselected, and the generated PDF honours the chosen summary mode and checkboxes (SA §Epic D; §Dependencies).
- AC-13: No header-level Export action and no Payouts widget appear on the tab (SA §Epic A; §Epic C).

## 9. Dependencies & Assumptions
- Depends on the Overview dashboard KPI-card components (SA §Dependencies).
- Depends on Product Catalog Management Governing rules 1 and 3 (commercial lock, per-item fundraising). That doc is not in the input set (SA §Dependencies; SS §Epic A4).
- Depends on Store Settings Epic A4 for the store flag, three-state read and mixed-state banner wording (SS §Epic A4).
- Depends on Orders tab sub-tab routes and status definitions (OM §Epic A).
- Store Close Report (SL) reads from the same aggregates. Any change here must keep it in sync (SL §Dependencies).

## Open items
Questions are in output/2026-10-19-store-analytics/clarification-questions.md.
- ⚠ OI-1 Fundraising Report gating: Epic A (item enabled) vs Epic D (item still collecting).
- ⚠ OI-2 Chart granularity toggle / current-period highlight undecided.
- ⚠ OI-3 Time window for KPI values and chart axis/buckets not stated.
- ⚠ OI-4 Trend calculation (calendar vs rolling month, % vs arrow, zero base).
- ⚠ OI-5 Status mapping for closed/pending orders; AOV per order vs session.
- ⚠ OI-6 Gross buyer spend inclusions (tax, shipping, discounts, refunds) and team attribution.
- ⚠ OI-7 Platform and card-processing fee formulas; refunds/cancellations in fundraising.
- ⚠ OI-8 Summary sentence "all orders to-date" vs date range; default preset; timezone.
- ⚠ OI-9 Pending/Orders card definitions vs Orders tab sub-tab definitions.
- ⚠ OI-10 Store Close Report entry on Reports tab missing from this spec.
- ⚠ OI-11 Close Report still uses Team Profit chart/trend naming.
- ⚠ OI-12 Close Report omits fundraising when disabled, vs mixed-state rendering here.
- ⚠ OI-13 Team-manager access to and scope of the Reports tab.
- ⚠ OI-14 PDF modal defaults, Gross summary content, notes source, file naming.
- ⚠ OI-15 Empty states, per-status availability, "This season" for always-open stores.
