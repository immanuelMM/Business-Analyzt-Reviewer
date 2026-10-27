---
title: Store Analytics (Reports Tab)
confluence_id: 4153049253
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049253/Store+Analytics+Reports+Tab
last_modified: 2026-09-11
pulled: 2026-10-26
---


### Executive Summary & Problem Statement

#### The Problem

The platform's main Overview dashboard reports across *all* of a rep's stores. A rep managing a single team store has no equivalent, store-scoped read on how *that* store is performing — revenue, order volume, pending work, and fundraising — without mentally filtering the global view.

#### The Solution

A **Reports** tab inside the manage-store workspace that summarizes every data point to the **currently-viewed store**. KPI summary cards, team/league revenue chart, followed by a **Fundraising Report** — a date-ranged breakdown of fundraising collected, fees, and net, with a configurable PDF export.

### User persona & use cases

**Who is this for?** The store manager (rep) reviewing performance of the specific store they're in.

**Scenarios encountered** Checking a single store's team revenue and order counts; watching team revenue accrue over the window; reviewing fundraising collected vs. net after fees for a date range; downloading a fundraising PDF for the team; jumping from the Orders / Pending Orders KPI cards straight into the Orders tab; reading the fundraising figures for a store where fundraising has since been switched off but ordered items are still collecting.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want a per-store version of the Overview dashboard, so that I can read this store's performance without filtering the global view.
- As a rep, I want a fundraising report showing what was collected, what fees came out, and the net amount, so that I can account to the team for their fundraising money.
- As a rep, I want to export the fundraising figures as a configurable PDF, so that I can share or archive them.
- **As a rep who has switched fundraising off mid-season, I want the fundraising figures to stay visible while ordered items are still collecting, so that I can still account for money that is still coming in.**

##### Epic A — Reports tab composition

The Reports tab is a **store-scoped analytics page in its own right**, not a per-store rendering of the workspace Overview dashboard. Every figure on it is scoped to the **currently-viewed store**. The page stacks three components, in order:

- **KPI summary row** — four cards: **Total Revenue**, **Orders** (total), **Pending Orders** (total), and **Average Order Value**. Specified in Epic B.
- **Team Revenue chart** — a large, full-width bar chart below the KPI row, titled **League Revenue** and filterable by team or division in league stores. Specified in Epic C.
- **Team Fundraising Report** — a full-width report container, rendered conditionally. Specified in Epic D.

**Fundraising Report visibility.** The Team Fundraising Report is present only when **team fundraising is enabled at the store level**, or when **any individual item within the store** has fundraising enabled. When neither holds, the page ends at the Team Revenue chart. Epic D carries the full render conditions, including the case where a store-level disable leaves already-ordered items still collecting.

**Component ownership.** The four KPI summary cards **reuse the Overview dashboard's KPI card components** — that sharing is deliberate and should be maintained. The **Team Revenue chart and the Team Fundraising Report are independent components owned by this page.** Neither is the Overview's chart re-pointed at a single store, and changes made to the Overview's graph cards do not propagate to them.

There is no separate header Export action — export lives on the Fundraising Report as **Download PDF**.

**OPEN — to be confirmed:** whether the Team Revenue chart carries a **Day / Month / Year granularity toggle** and a highlighted current-period bar. The workspace Overview has added both to its Dealer Profit and Revenue graph cards, but because the Team Revenue chart is an independent component it does not inherit them by default — this is a standalone design decision for this page.

##### Epic B — Top-row KPI summary cards (4)

A horizontal row of **four uniform KPI summary cards** using the same card design as the Overview dashboard, each showing a value and a **trend vs. last month**.

- **Card 1 · Total Revenue** — total dollar amount (e.g. **$3,810**) and percentage trend vs. last month (e.g. **12.4% vs last month**).
- **Card 2 · Orders** — total volume count of closed sales (e.g. **83**) and directional trend. The card is clickable and jumps to the Orders tab's All Orders view.
- **Card 3 · Pending Orders** — count of active orders currently processing and trend. The card is clickable and jumps to the Orders tab's Pending Orders sub-tab.
- **Card 4 · Avg. Order Value** — average amount spent per order/session (e.g. **$46**) and trend vs. last month.

##### Epic C — Team Revenue chart (League Revenue in league stores)

Renamed from the **Team Profit chart**, September 1, 2026. The former name described a margin figure derived from the Team Profit input; with that input removed, the chart reports revenue attributable to the team instead.

- **Team Revenue chart:** Given the Reports tab, then it implements a** vertical column bar chart**— identical bar widths, gray axis baseline, and spacing — re-purposed to map **team revenue over time**, spanning the **full content width** below the KPI row.
- **This is a revenue chart, not a margin chart.** The rename is not cosmetic. The former chart plotted the team's margin; the new one plots revenue. Any copy, axis label, tooltip, or export header describing it as profit or margin must be updated, or the chart will read as the old metric under a new name.
- **RESOLVED — September 11, 2026. Definition confirmed.** **Team revenue** resolves to **gross buyer spend on orders attributable to the team** — not fundraising collected. The series aggregates the full buyer-paid amount on those orders. Because fundraising collected is a distinct figure reported in the Fundraising Report below (Epic D), the chart and the report are **not** two views of the same money, and both stay on the page. The aggregation is settled and the series can be built.
- **League stores — League Revenue.** In a **league store** the component is titled **League Revenue** and reports **gross buyer spend on orders attributable to all teams and divisions within the league**, rather than a single team. It additionally carries a **filter control** allowing the rep to narrow the revenue shown to a specific **team or division** within the league. In a single-team store the component keeps the **Team Revenue** title, reports that one team's revenue, and carries no filter.
- The **Payouts tracker widget** is not part of the Reports tab in the current build — payout status is covered by the cross-store Overview dashboard; the space below the chart is occupied by the Fundraising Report (Epic D).

##### Epic D — Fundraising Report

A full-width report card accounting for the store's team-fundraising money.

- **Render conditions.** The report renders when **Team Fundraising is enabled** for the store (Settings → Store Details), **or** when the store has **any item still collecting fundraising** despite a store-level disable. The second condition exists because the commercial lock outranks the store-level disable: an item carrying a non-cancelled order keeps collecting the fundraising its buyers already paid, and hiding the report would conceal money that is still arriving. The report is hidden only when no fundraising is enabled and none is being collected.
- **Mixed-state banner.** Given the store-level flag is off while exempted items are still collecting, when the report renders, then it carries a banner stating that fundraising has been disabled for the store and that the figures below cover items that were already ordered. This mirrors the mixed-state treatment on the Settings card (see *Store General Settings*, Epic A4).
- **Per-item scope.** Because fundraising is now set **per item**, the report covers only those items whose fundraising was enabled at the time of the order. An item with fundraising switched off contributes nothing from that point forward but its historical contributions remain in the totals — figures are a record of what was collected, never recalculated against current settings.
- **Date-range picker:** the report header carries a range control with presets — **This season** (the store's open window), **Last 7 days**, **Last 30 days**, **Year to date** — that scope the figures.
- **Detailed breakdown:** a line-item table lists **Fundraising Collected**, **Platform Fees**, **Card Processing Fees**, and the bolded **Net Fundraising** total, followed by an analytical sentence summarizing collected → fees → net across all orders to-date.
- **Scope note:** a banner clarifies the report **only includes price additions marked as "Fundraising"** in the item's price settings. Since Team Profit was removed, fundraising is the only team-side markup, so this note now describes the whole of the team's take rather than one slice of it.
- **Configurable PDF export: Download PDF** opens a **Fundraising Report Settings** modal — a summary-mode radio (**Net Fundraising Summary**, default, vs. **Gross Total Summary**) plus report-detail checkboxes (**Detailed Breakdown**, **Selected Date Range**, **Include PDF Report Notes**) — before generating the PDF.

### Metrics & Success Criteria

- Reports-tab engagement per store
- Fundraising PDF download usage
- Accuracy of store-scoped figures vs. source orders and fundraising line items
- KPI-card click-through to the Orders tab
- **Fundraising Report views on stores in the mixed state** — a read on whether reps go looking for the figures after disabling fundraising, and therefore whether keeping the report visible was the right call
- **Share of a store's catalog contributing to the fundraising total** — with fundraising now per-item, a low share means reps are using the toggle selectively as intended rather than leaving it uniformly on

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Reuses the Overview dashboard's **KPI-card components**, re-pointed at a single store rather than the rep's whole portfolio. Requires **store-scoped aggregation** (revenue, closed-order count, pending count, average order value, and month-over-month trends) and a **team-revenue time series** for the chart — replacing the former team-profit series, which has no source now that the Team Profit input is removed — plus cross-tab navigation hooks so the Orders / Pending Orders KPI cards can deep-link into the Orders tab's sub-tabs. The team-revenue series aggregates **gross buyer spend on orders attributable to the team** (confirmed September 11, 2026), so it reads from order totals rather than from fundraising line items. In **league stores** the same series must aggregate across **all teams and divisions in the league** and be filterable by team or division, which requires the order→team and team→division joins to be available to the analytics query.

The **Fundraising Report** requires fundraising-flagged price-addition line items aggregated per order and date range, **platform-fee and card-processing-fee** calculations to derive net fundraising, and a **PDF generation path** honoring the settings modal (net vs. gross summary; optional breakdown, date range, and report notes).

**Report gating is no longer a boolean read of the store flag.** It requires a **three-state resolution** — fundraising enabled; fundraising disabled with no items collecting; fundraising disabled with commercially-locked items still collecting — matching the three-state read specified in *Product Catalog Management*, Governing rule 3, and surfaced on the Settings card in *Store General Settings*, Epic A4. The report renders in the first and third states and is hidden only in the second.

Fundraising line items must be recorded **as they were at order time** and never recomputed against an item's current fundraising flag, so that switching fundraising off on an item never retroactively alters historical figures. Shared internal order / analytics services.
