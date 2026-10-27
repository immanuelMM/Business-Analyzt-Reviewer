---
title: All-Stores Orders Page
confluence_id: 4164812801
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4164812801/All-Stores+Orders+Page
last_modified: 2026-09-22
pulled: 2026-10-26
---
**Audit update — July 16, 2026:** this spec was audited against the current Team Stores Workspace prototype and updated to match its behavior — most notably, **pending orders no longer populate on this page**; it is a single cross-store All Orders view with the shared toolbar/export toolset.

**Amendment — September 1, 2026 (approved design):** the page gains a **second entry point** — the **Orders** item in the workspace account menu ([Team Stores Workspace](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153245697/Workspace), Epic D) — which is available from every workspace tab, not just Overview. Because the rep can now arrive from Stores or Stock Vault, the **breadcrumb and header selection are origin-aware** rather than hardcoded to Overview. Epic A is rewritten below.

### Executive Summary & Problem Statement

#### The Problem

The Overview's Orders KPI reports a single portfolio-wide count, but operators have **no drill-down** to act on it. To inspect orders today they must open each store's Orders tab one at a time — there is no single, cross-store view of every order.

#### The Solution

A dedicated **Orders page** reached by clicking the **Orders** KPI card on the Overview, or by selecting **Orders** in the account menu from anywhere in the workspace. It aggregates rep-placed and fan orders across *all* stores into a single **All Orders** table — pending orders do not populate here; pending submission stays in each store's Orders tab — with a **store identifier tag** on every row so operators always know which store an order belongs to.

### User persona & use cases

**Who is this for?** Reps overseeing multiple stores who need a portfolio-wide fulfillment view, not a single store's.

**Scenarios encountered** Drilling from the Orders KPI into the full list; jumping to portfolio orders from the account menu while working in the Stores list or the Stock Vault; finding an order without first knowing which store it's in; checking production status / tracking across the whole portfolio; exporting portfolio-wide order data to CSV; returning to whatever view they were in before.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want to click the Orders KPI and see every order across all my stores, so that I can manage portfolio-wide fulfillment from one place.
- As a rep, I want to reach portfolio orders from anywhere in the workspace, so that I don't have to return to Overview first.
- As a rep, I want the way back to land me where I was, so that jumping to orders doesn't cost me my place.
- As a rep, I want each order tagged with its store, so that I can attribute and locate orders when the list spans many stores.
- As a rep, I want the full All Orders toolset — search, sort, filters, column control, selection, and CSV export — on the cross-store list, so that I can audit history at portfolio scale.

##### Epic A — Entry points & navigation context

- **Entry from KPI:** Given the Overview, when the operator clicks the **Orders** KPI summary card, then they are navigated to the All-Stores Orders page.
- **Entry from the account menu:** Given any workspace tab — Overview, Stores, or Stock Vault — when the operator selects **Orders** from the account menu, then they are navigated to this same page. The two entry points resolve to one page; there is no variant view per route.
- **Still no store context:** Given either entry point, when the page renders, then the operator has *not* entered any individual store. The page always runs at portfolio scope regardless of which tab they came from.
- **Origin-aware breadcrumb:** Given the page, then a breadcrumb above the page title returns the operator to the tab they arrived from, and is **labelled for that origin** — "Back to overview", "Back to stores", or "Back to stock vault". It must never name a view the operator was not in.
- **Origin-aware header selection:** Given the page, then the global header retains the selected state of the **originating tab**, so the header and the breadcrumb agree. Arriving from the Stock Vault leaves Stock Vault selected, not Overview.
- **Fallback origin:** Given the page is reached without a resolvable origin — a direct link, a refresh, a restored session — then it defaults to the **Overview** environment: header selected on Overview and the breadcrumb reading "Back to overview". This is the pre-amendment behavior, retained as the default rather than the rule.
- **Page title:** Given the page, then the title reads **"Orders"** with a subtitle counting the aggregated stores ("Orders across all N stores"), unchanged by entry point.
- **Does not replace per-store Orders:** Given a single store's manager, then its own Orders tab is unchanged — this page is an *additional*, portfolio-wide aggregation, not a replacement. **Pending orders never populate here** — the MOQ / shipping-group submission workflow lives exclusively in each store's Orders → Pending Orders sub-tab.

##### Epic B — Page header & controls

- Given the page, when it renders, then it carries the shared **All Orders experience** toolbar — search, sort, filter, a date-range picker, a **column-visibility** control, row selection with a bulk bar (**Export Selected**), pagination, and a **CSV Export** — plus the **Order Status Guide**. There is no tab toggle: the page is a single All Orders view.

##### Epic C — All Orders (cross-store table)

A dense table of every rep-placed and fan order across all stores. Each row leads with product art and carries the columns in the data model below, plus the store tag (Epic D).

- **Status badges:** Given any row, then its **Status** renders as a colored badge — e.g. **Artwork Production** (amber), **Shipped** (blue), **On Hold** (red, with the entire row tinted red), **Delivered** (green).
- **Tracking & order links:** Given a Shipped or Delivered row, then a **tracking number** link appears under the status; Factory Order # and Web Order # render as links.
- **Due/ship-date urgency:** Given a due/ship date that is overdue or at risk, then it renders in **red with an alert icon**; an on-track delivered date may show an info icon.
- **Order detail drawer:** Given any row, when clicked, then the shared **order detail drawer** opens scoped to the order's owning store (Order View / Item View, production stepper — see the Order Management spec).

##### Epic D — Store identifier tag

Because this view spans every store, each order must be attributable to its source store.

- **Store tag:** Given a row, then a **store identifier tag** — a pill with a color-coded initials avatar and the store name, placed in a dedicated **Store** column immediately after Product — is shown, distinct from the Organization / Customer fields, so the order's owning store is unambiguous.
- **Store in search & export:** Given the store tags, then the toolbar search matches store names (alongside customer, order numbers, cart, and product), and the store name is included as a column in CSV exports.

#### Information Architecture — All Orders columns

| Field | Required | Notes |
| --- | --- | --- |
| Product | Required | Product thumbnail(s) + product name (e.g. `Waist Cut, FB V-Neck Jersey`). |
| Store Tag | Required | Owning store identifier — initials-avatar pill + store name, in its own Store column after Product. |
| Organization | Required | Org the order belongs to (e.g. `Pleasant Grove Junior High`). |
| Factory Order # | Optional | Factory reference, rendered as a link. |
| Web Order # | Required | Storefront order number, rendered as a link. |
| Cart Name | Optional | Cart label (e.g. `PG Junior Bears FB`). |
| Customer | Required | Ordering customer name (falls back to the rep for rep-placed orders). |
| Sport | Optional | Associated sport (e.g. `Basketball`). |
| Quantity | Required | Integer line quantity. |
| Shipping Group | Required | Factory / shipping group code (e.g. `PMP`). |
| Due/Ship Date | Required | Date; rendered red + alert icon when overdue / at risk. |
| Status | Required | Colored badge: `Artwork Production`, `Shipped`, `On Hold`, `Delivered`; tracking link when shipped/delivered. |

### Metrics & Success Criteria

- Orders-KPI click-through into the page
- Share of visits arriving from the account menu vs. the Overview KPI card
- Breadcrumb use rate, and share of breadcrumb clicks that return the operator to a non-Overview tab — the behavior this amendment exists to support
- Time to locate an order when its store is unknown
- Cross-store CSV export usage (full and selected)
- Store-name search usage on the page

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

A portfolio-wide aggregation page reachable from the Overview **Orders KPI** and from the workspace **account menu**, rendered **inside the workspace shell** with no store context entered. It reuses the shared **All Orders experience** (toolbar, rich table, selection, pagination, column preferences, CSV export, status guide) and the shared **order detail drawer**, unscoped across the rep's entire portfolio — rep-placed and fan orders only. Pending orders and the MOQ submission workflow are **excluded**; they remain in each store's Orders tab. Each order must resolve its **owning store** to drive the store-identifier tag, store-name search, per-row drawer scoping, and the store column in CSV exports.

The origin-aware breadcrumb and header selection require the **originating workspace tab to be carried in navigation state** (route param or equivalent) and to survive an in-page refresh, with a defined **Overview fallback** when it cannot be resolved.
