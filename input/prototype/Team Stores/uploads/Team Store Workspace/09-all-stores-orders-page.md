---
title: All-Stores Orders Page
page_id: 4164812801
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4164812801
folder: Global Navigation
parent: Analytics Dashboard (Overview Tab)
---

# All-Stores Orders Page

### Executive Summary & Problem Statement

#### The Problem

The Overview's Orders KPI reports a single portfolio-wide count, but operators have **no drill-down** to act on it. To inspect or fulfill orders today they must open each store's Orders tab one at a time — there is no single, cross-store view of every order and every pending submission.

#### The Solution

A dedicated **Orders page** reached by clicking the **Orders** KPI card on the Overview. It aggregates orders across _all_ stores into two tabs — **All Orders** and **Pending Orders** — mirroring the per-store Orders layout but adding a **store identifier tag** on every order so operators always know which store an order belongs to.

### User persona & use cases

**Who is this for?** Reps overseeing multiple stores who need a portfolio-wide fulfillment view, not a single store's.

**Scenarios encountered** Drilling from the Orders KPI into the full list; scanning every store's pending orders to consolidate against shipping-group MOQs; finding an order without first knowing which store it's in; submitting a pending order; checking production status / tracking across the whole portfolio.

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want to click the Orders KPI and see every order across all my stores, so that I can manage portfolio-wide fulfillment from one place.
* As a rep, I want each order tagged with its store, so that I can attribute and locate orders when the list spans many stores.
* As a rep, I want an All Orders table and a Pending Orders view, so that I can both audit history and act on what still needs submitting.

##### Epic A — Entry point & navigation context

* **Entry from KPI:** Given the Overview, when the operator clicks the **Orders** KPI summary card, then they are navigated to the All-Stores Orders page.
* **Stays in Overview environment:** Given the Orders page, when it renders, then the **global header remains selected on Overview** and the **Overview / Stores sub-tabs persist** — the operator has _not_ entered any individual store. A **"Back to overview"** breadcrumb returns to the dashboard.
* **Does not replace per-store Orders:** Given a single store's manager, then its own Orders tab (Touchpoint 05) is unchanged — this page is an _additional_, portfolio-wide aggregation, not a replacement.

##### Epic B — Page header & controls

* Given the page, when it renders, then it shows the title **"Orders"** with a header actions row: **Show Filters**, **Sort By**, and a **Search Orders** field that filters within the active tab.
* Given the two tabs, then they appear as a pill toggle — **All Orders** and **Pending Orders** — with one active at a time; search, sort, and filters apply to the active tab.

##### Epic C — Tab 1: All Orders (cross-store table)

A dense table of every order across all stores. Each row leads with product art and carries the columns in the data model below, plus the store tag (Epic E).

* **Status badges:** Given any row, then its **Status** renders as a colored badge — e.g. **Artwork Production** (amber), **Shipped** (blue), **On Hold** (red, with the entire row tinted red), **Delivered** (green).
* **Tracking & order links:** Given a Shipped or Delivered row, then a **tracking number** link appears under the status; Factory Order # and Web Order # render as links.
* **Due/ship-date urgency:** Given a due/ship date that is overdue or at risk, then it renders in **red with an alert icon**; an on-track delivered date may show an info icon.

##### Epic D — Tab 2: Pending Orders (cross-store, grouped by shipping group)

Mirrors the per-store Pending Orders workflow but spanning all stores. Orders are grouped by **shipping group / factory**, each group showing a **minimum-quantity progress ring**, the **% to MOQ**, and the **Minimum Quantity Fee** that applies if submitted short.

* Given a shipping-group section, then it shows a header (**"Shipping Group: PMP"**), the MOQ ring + percentage, the fee amount, and the **store tag(s)** represented in that group (Epic E).
* Given a pending row, then it shows item art + name, order date, customer, size, factory, order # link, a row checkbox, and a **Submit Order** action.
* Given selections, then the operator can submit a single, selected, or all pending orders, subject to the same below-MOQ destructive-confirmation guard defined in Touchpoint 05.

##### Epic E — Store identifier tag **New — not in current designs**

Because this view spans every store, each order must be attributable to its source store — the single capability missing from the reference screens.

* **All Orders:** Given a row, then a **store identifier tag** (store / organization name) is shown on or alongside the row, distinct from the existing Organization / Customer fields, so the order's owning store is unambiguous.
* **Pending Orders:** Given a shipping-group section that contains orders from more than one store, then each pending order (or its sub-group) carries its **store tag** so the operator can tell which store each pending item belongs to before submitting.
* **Filter / sort by store:** Given the store tags, then **Show Filters** and **Sort By** expose a **store** dimension so the operator can narrow the list to one or more stores.

#### Information Architecture — All Orders columns

| Field | Required | Notes |
| --- | --- | --- |
| Product | Required | Product thumbnail(s) + product name (e.g. `Waist Cut, FB V-Neck Jersey`). |
| Store Tag | Required | Owning store / organization identifier. The new field that makes a cross-store list usable. |
| Organization | Required | Org the order belongs to (e.g. `Pleasant Grove Junior High`). |
| Factory Order # | Optional | Factory reference, rendered as a link. |
| Web Order # | Required | Storefront order number, rendered as a link. |
| Cart Name | Optional | Cart label (e.g. `PG Junior Bears FB`). |
| Customer | Required | Ordering customer name. |
| Sport | Optional | Associated sport (e.g. `Basketball`). |
| Quantity | Required | Integer line quantity. |
| Shipping Group | Required | Factory / shipping group code (e.g. `PMP`). |
| Due/Ship Date | Required | Date; rendered red + alert icon when overdue / at risk. |
| Status | Required | Colored badge: `Artwork Production`, `Shipped`, `On Hold`, `Delivered`; tracking link when shipped/delivered. |

### Metrics & Success Criteria

* Orders-KPI click-through into the page
* Share of pending submissions made from the cross-store view (vs. per-store)
* Time to locate an order when its store is unknown
* Store-filter usage rate on the page

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

A new portfolio-wide aggregation page branching from the Overview **Orders KPI**, rendered **inside the Overview environment** (no store context entered). It **reuses** the per-store Orders table, the **shipping-group / MOQ pending workflow**, and the below-MOQ submission path (Touchpoint 05), but **unscoped across the rep's entire portfolio**. Each order must resolve its **owning store** to drive the new **store-identifier tag** and store-level filter/sort. **No source MD spec exists** for this page — defined here as net-new.
