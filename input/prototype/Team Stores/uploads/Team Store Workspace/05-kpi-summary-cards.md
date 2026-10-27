---
title: KPI Summary Cards
page_id: 4153278468
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153278468
folder: Global Navigation
parent: Analytics Dashboard (Overview Tab)
---

# KPI Summary Cards

### Executive Summary & Problem Statement

#### The Problem

Reps have no fast read on whether all of their stores are healthy without opening each store individually.

#### The Solution

A 4-up KPI row — Total Revenue, Orders, Active Stores, Average Order Value — each with an icon, a large figure, and a trend delta vs. last month.

### User persona & use cases

**Who is this for?** Reps overseeing multiple stores.

**Scenarios encountered** Daily health check; comparing this period against last month; spotting a revenue or AOV dip early.

### Functional Requirements & Core Workflows

#### User Stories

* As a manager, I want top-line KPIs with month-over-month deltas, so that I can gauge portfolio health in seconds.

#### Acceptance Criteria

* Given the Overview loads, when KPIs render, then a 4-up card row appears, each card showing an icon, a label, a large figure, and (where applicable) a signed month-over-month delta with an up/down arrow colored green for up and red for down.

##### Epic — Per-card specifications

* **Card 1 · Total Revenue** — Aggregate revenue summed across _all_ stores, all-time. Displays a currency figure plus a month-over-month trend delta vs. last month (up/down arrow, green/red).
* **Card 2 · Orders** — Total number of orders across _all_ stores, all-time. Displays a count plus a month-over-month trend delta vs. last month (up/down arrow, green/red).
* **Card 3 · Active Stores** — Total number of orders across _all_ stores, all-time. Displays a count plus a month-over-month trend delta vs. last month (up/down arrow, green/red). **This card is interactive:** clicking it navigates to the **All-Stores Orders page** without leaving the Overview environment — the global header stays selected on **Overview**.
* **Card 4 · Avg. Order Value** — Average order value (total revenue ÷ total orders). Displays a currency figure plus a month-over-month trend delta vs. last month (up/down arrow, green/red).

### Metrics & Success Criteria

* Dashboard load under 2s
* Managers check KPIs ≥3×/week

**Dependency & Technical Constraint**

Requires a reporting / analytics pipeline aggregating revenue, orders, store status, and AOV across the portfolio with period-over-period comparison (currently computed from seed data).
