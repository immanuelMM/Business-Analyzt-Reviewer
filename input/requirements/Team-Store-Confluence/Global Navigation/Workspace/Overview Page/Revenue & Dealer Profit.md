---
title: Revenue & Dealer Profit
confluence_id: 4153180162
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153180162/Revenue+Dealer+Profit
last_modified: 2026-09-22
pulled: 2026-10-26
---


### Executive Summary & Problem Statement

#### The Problem

A single number hides seasonality and trend; operators need the shape of performance over time. One combined series also conflated two things a rep reads differently: **what the stores took in** and **what the rep actually earned**. Those move independently — a high-revenue store carrying heavy fundraising and fees is not a high-margin one — and collapsing them into one series hid exactly the gap a rep needs to see. Rendering them as two separate cards created the opposite problem: the comparison that matters was left for the rep to perform by eye, across two charts with their own axes and their own controls.

#### The Solution

A single full-width **Revenue & Dealer Profit** chart plotting both series on one time axis, beneath the KPI row and above Top Performing Stores. The card carries a title, a one-line definition covering both metrics, one **Day / Month / Year** granularity control, a row of three summary tiles, and the chart itself.

- **Revenue** — what all stores took in.
- **Dealer Profit** — what the rep earns across all stores.

Reading them together is the point: the two series diverging is the cost of goods, fees, tax, and the team's fundraising widening. The **Margin** tile states that relationship as a number so it does not have to be inferred from the drawing.

#### Chart rendering

- **Two line series on a shared time axis.** Revenue and Dealer Profit render as smooth curves, distinguished by colour, with a legend above the plot naming each series and the axis it reads against.
- **Dual Y axes.** Revenue reads against the **left** axis and Dealer Profit against the **right**, each scaled to its own range so the smaller series is legible rather than compressed against the baseline. Both axes start at **$0**.
- **The vertical gap between the series is not a quantity.** Because the axes differ, the visual distance between the two lines has no dollar meaning and must not be captioned, annotated, or explained as though it does. The deduction is expressed by the **Margin** tile and by the definition line, never by the spacing. Each axis must be labelled with its series in the legend so the reader is not left to assume a shared scale.
- **Definition line.** Directly beneath the title: *Gross revenue across all stores vs. dealer profit — revenue minus manufacturing cost (COGS), platform fee, sales tax, and team fundraising.* One line covers both series; neither series carries its own definition.
- **Current period.** The period in progress is marked at the end of each series with a point marker, and its axis label renders emphasised against completed periods, so a partial period is not misread as a decline.

### Scope boundary — this is the dealer-side view

The workspace Overview reports **dealer-side and gross figures only**. Team-side money — team revenue and fundraising — is **store-scoped** and lives on the Reports tab inside a store. This split is deliberate and should be preserved: a rep reading the portfolio is reading their own business; a rep accounting to a team is reading one store.

### User persona & use cases

**Who is this for?** Reps overseeing multiple stores.

**Scenarios encountered** Reading the shape of the portfolio's revenue across a season; checking whether margin is tracking revenue or falling behind it; spotting a month where revenue rose but dealer profit did not; reading the current month's revenue, profit, and margin at a glance without interrogating the chart; switching to a daily view during an active ordering window; comparing year over year.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want to see revenue and my own profit as separate trends on one chart, so that I can tell a busy month from a profitable one without comparing two pictures.
- As a rep, I want the current period's revenue, profit, and margin stated as numbers, so that I do not have to read them off an axis.
- As a rep, I want to change the time granularity, so that I can read an active window day by day and a season year by year.

#### Epic B — Dealer Profit series

- **Reports:** total dealer profit across **all** of the rep's stores, over the selected granularity. Plotted against the **right** Y axis.
- **Canonical definition:** gross revenue minus manufacturing cost (COGS), platform fee, sales tax, and team fundraising. This is the product's canonical definition of realized dealer profit and is referenced by *Products Tab*, Governing rule 3. It is carried in the chart's shared definition line rather than on the series itself.
- **Fundraising is a deduction here.** Money entered in an item's Fundraising input is added to retail and routed to the team, and comes **out** of the dealer's realized profit. A portfolio running heavy fundraising will show the two series diverging and a lower Margin figure; that is the model working, not an error.

#### Epic C — Revenue series

- **Reports:** total revenue across **all** of the rep's stores, over the selected granularity. Plotted against the **left** Y axis.
- **Gross figure.** Revenue is what the stores took in, before COGS, fees, tax, and fundraising are deducted. It must never be described as revenue-minus-costs — that is the Dealer Profit definition, and applying it to both series makes the chart read as one metric drawn twice.

#### Epic D — Granularity control

- **Three options:** Day, Month, Year. **Month** is the default.
- **One control governs both series.** The segmented control sits at the card's top right and re-renders the whole chart. Because the two series now share a chart and a time axis, they cannot be read at differing granularities — the question of independent versus linked toggles is resolved by the single-chart design and is closed.
- Changing granularity also re-resolves the summary tiles (Epic E) to the new current period.

#### Epic E — Summary tiles

A row of three tiles sits between the header and the plot, each stating the current period's value and its movement against the prior period.

- **Revenue · \[period\]** — the current period's gross revenue, with percentage change.
- **Dealer Profit · \[period\]** — the current period's realized dealer profit, with percentage change.
- **Margin · \[period\]** — dealer profit as a percentage of revenue for that period, with change expressed in **percentage points**, not percent. This tile is what carries the relationship between the two series, since the dual axes prevent the chart from carrying it.
- **Each tile is labelled with the period it reports**, and that label follows the granularity control — a month name under Month, a date under Day, a year under Year.
- **Direction is signed and coloured**: a decline and an improvement must be distinguishable without reading the sign.
- **OPEN — to be confirmed:** what the current-period tiles compare against while that period is still in progress. Comparing a partial month against a completed one produces a decline that is an artifact of the calendar — the seeded design shows Revenue at −19% for an in-progress September. Either the comparison is period-to-date against the same point in the prior period, or the tile states that it is partial. This should be settled before build; it is the same failure mode the current-period marker exists to prevent.

#### OPEN items carried forward from the previous spec

Neither of the following appears in the approved design. Both are recorded here so their removal is a decision rather than an omission.

- **Team Store selector.** The previous spec put a store selector in the chart header, drilling the chart into a single store or the aggregated portfolio. The approved design has a page-level **All Stores** filter in the Overview header instead. **Confirm** whether the page-level filter scopes this chart (making the per-chart selector redundant and correctly removed), or whether per-chart drill-down is a capability being dropped. The previous acceptance criterion — choosing a store re-renders the chart to that store's figures — has no home until this is settled.
- **Export.** The previous spec carried an Export action returning the underlying data for the selected scope, and a success metric of "\>40% of managers per period." Neither the action nor a replacement appears in the approved design. **Confirm** whether export moves elsewhere in the Overview, is dropped, or was simply not drawn.

### Metrics & Success Criteria

- Granularity switch re-renders under 1s
- **Granularity distribution across Day / Month / Year** — a read on whether three options earn their surface area or whether reps live in Month
- **Hover and tooltip engagement with each series** — whether reps interrogate both trends or read only revenue, which would question the dual-axis treatment
- **Whether the Margin tile is read** — it exists because the dual axes prevent the chart from expressing the relationship; if it goes unused, the comparison is not landing
- Export usage, if export is retained (see OPEN above)

---

### Dependencies & Technical Constraints

Requires the analytics pipeline aggregating, across the rep's whole portfolio and at day, month, and year granularity: **gross revenue**, and **realized dealer profit** resolved as gross revenue minus COGS, platform fee, sales tax, and team fundraising. It must also resolve a **margin percentage per period** and a **prior-period comparison for each of the three tiles**, including a defined treatment of the in-progress period (see Epic E). The dealer-profit series therefore depends on fundraising line items being recorded per order — the same records the store-scoped Fundraising Report reads (*Store Analytics (Reports Tab)*, Epic D) — so the two surfaces cannot disagree about how much fundraising was collected.

**No series on this page depends on Team Profit.** That input has been removed from the product; any aggregation, column, or seed series still referencing it must be retired rather than re-pointed.

This chart is a **dual-axis multi-series line chart** and no longer shares a component with the Reports tab's Team Revenue chart, which remains a single-series bar chart (*Store Analytics (Reports Tab)*, Epic C). The two are now independent: a change to axis styling, curve treatment, or the current-period marker here does not propagate there, and the parity argument that previously linked them no longer applies. Series are currently partly hard-coded from seed data; the seeded axis maxima and tile deltas in the approved design do not reconcile with each other and should not be treated as specification.
