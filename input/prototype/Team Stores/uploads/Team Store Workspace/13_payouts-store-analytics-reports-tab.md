# Payouts and Store Analytics (Reports Tab)

### Executive Summary & Problem Statement

#### The Problem

The platform's main Overview dashboard reports across _all_ of a rep's stores. A rep managing a single team store has no equivalent, store-scoped read on how _that_ store is performing — revenue, order volume, pending work, and payouts — without mentally filtering the global view.

#### The Solution

A **Reports** tab inside the store manager that **mirrors the Overview dashboard's layout and components exactly**, but scopes every data point to the **currently-viewed store**. Same KPI cards, same vertical bar chart, same payouts widget — re-pointed at this one store — so the experience feels cohesive and familiar.

‌

### User persona & use cases

**Who is this for?** The store manager (rep) reviewing performance of the specific store they're in.

**Scenarios encountered** Checking a single store's team profit and order counts; watching team profit accrue over the window; tracking payout status; exporting the store's figures.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want a per-store version of the Overview dashboard, so that I can read this store's performance without filtering the global view.
* As a rep, I want to export this store's figures, so that I can share or archive them.

##### Epic A — Component parity with the Overview dashboard

The Reports tab **reuses the Overview dashboard's exact visual layout, structure, and UI components** — all data scoped to the current store.

* **Header actions bar:** Given the Reports tab, when it renders, then it shows an **Export** action button matching the Overview dashboard's **solid minimalist black** shape, icon framework, and alignment.

##### Epic B — Top-row KPI summary cards (4)

A horizontal row of **four uniform KPI summary cards** using the same card design as the Overview dashboard, each showing a value and a **trend vs. last month**.

* **Card 1 · Total Revenue** — total dollar amount (e.g. **$3,810**) and percentage trend vs. last month (e.g. **12.4% vs last month**).
* **Card 2 · Orders** — total volume count of closed sales (e.g. **83**) and directional trend vs. last month.
* **Card 3 · Pending Orders** — count of active orders currently processing in line and trend vs. last month.
* **Card 4 · Avg. Order Value** — average amount spent per order/session (e.g. **$46**) and trend vs. last month.

##### Epic C — Team Profit chart & Payouts tracker

Two components sit **side by side, spanning the full content width** below the KPI row.

* **Team Profit chart:** Given the Reports tab, then it implements the **same vertical column bar chart** used for revenue trends on the Overview dashboard — identical bar widths, gray axis baseline, and spacing — re-purposed to map **team profit / margin returns over time**.
* **Payouts tracker:** Given the Reports tab, then it replicates the Overview dashboard's **payouts snapshot** widget, listing: a conditional **status indicator** (e.g. a green _On Track_ badge), **Total Payouts** baseline $ amount, **Pending Clearance** $ value, and **Paid This Season** $ value.

‌

### Metrics & Success Criteria

* Reports-tab engagement per store
* Export usage
* Accuracy of store-scoped figures vs. source orders/payouts

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Reuses the Overview dashboard's **KPI-card, vertical-bar-chart, and payouts-widget components**, re-pointed at a single store rather than the rep's whole portfolio. Requires **store-scoped aggregation** (revenue, closed-order count, pending count, average order value, and month-over-month trends), a **team-profit time series** for the chart, **payout status** data (total / pending clearance / paid this season + status badge), and an **export** path. Shared internal order / payout / analytics services.
