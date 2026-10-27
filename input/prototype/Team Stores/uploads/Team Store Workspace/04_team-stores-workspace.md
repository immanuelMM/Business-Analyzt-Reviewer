# Team Stores Workspace

### Executive Summary & Problem Statement

#### The Problem

Once inside, reps juggle three distinct mental models, portfolio analytics and the store list and need to jump between them and find any store instantly.

#### The Solution

A sub-tab bar (Overview / Stores ) carrying live store counts, plus a section-wide global search field on the right that swaps the content region without a full reload. Each sub-tab exposes its own contextual controls: the **Overview** tab carries a team store selector and an Export action in its header; the **Stores** tab carries Filter and Sort dropdowns.

### User persona & use cases

**Who is this for?** Reps managing more than one store or league.

**Scenarios encountered** Switching from reviewing KPIs to editing a specific store; narrowing the store list to only stores I own vs. stores shared with me; sorting a large portfolio by name or revenue; exporting a season's analytics snapshot; confirming how many active stores exist at a glance.

### Functional Requirements & Core Workflows

##### Epic A — Sub-tab navigation & global search

* As an operator, I want sub-tabs with live counts and a search field, so that I can pivot between analytics and stores and find any record fast.
* Given I am in the Team Stores section, when I select a sub-tab, then the content region swaps to that view and the active tab is visually indicated.
* Given I type in global search, when results match a store, then matching records are surfaced for direct navigation.

##### Epic B — Overview tab: store selector & Export

* As a rep, I want a store selector with multi-selection capabilities in the Overview header, so that the dashboard KPIs and panels can reflect a specific store(s) I'm reviewing rather than all-time totals.
* As a rep, I want an Export action on the Overview, so that I can pull a snapshot of the current portfolio analytics out of the platform for reporting.
* Given the store and Export controls, when I am on any other sub-tab (Stores), then those controls are not shown — they are scoped to Overview only.
* Given I am on the Overview tab, when I open the Store selector (defaulting to the none selected), then I can choose a store scope and the dashboard metrics recompute against it.
* Given I am on the Overview tab, when I click Export, then a snapshot of the currently-scoped analytics is produced for download in a portable format.

##### Epic C — Stores tab: Filter & Sort controls

* As a rep, I want Filter and Sort dropdowns on the Stores tab, so that I can narrow a large portfolio and order it the way I want to scan it.
* Given the Stores tab toolbar, when I open the Filter dropdown, then I can choose **All**, a **Status** group (Active, and On Hold when any held store exists), a **Sport** group, and a **Location** group — where the Sport and Location options are derived from the stores actually in scope so a choice never points at absent data.
* Given I apply a filter, when the grid re-renders, then only stores matching that filter remain, and if none match, an empty state reads "No stores match "\[filter\]"."
* Given the Sort dropdown, when I open it, then I can choose **Name (A–Z)**, **Name (Z–A)**, **Revenue (high to low)**, or **Revenue (low to high)**, defaulting to Name (A–Z).
* Given I apply filter and sort together, when the grid re-renders, then both compose (filter narrows the pool, sort orders the result).

‌

‌

### Metrics & Success Criteria

* Search-to-open under 5s median
* Sub-tab adoption: >70% of sessions use at least two tabs
* Filter/Sort engagement on portfolios >12 stores: >60% of list sessions apply at least one
* Export action: tracked usage per season with <1% failed exports

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires a read model / search index over the portfolio (**stores**, ownership flags, status, sport, location, revenue, counts) reflecting server-side state, not in-memory seed data. The ownership segments and Filter facets (Sport, Location) must be derived from real records in scope. The Overview **Store selector** requires **store-scoped** metric aggregation; Export requires a server-side report-generation / file-delivery service. Likely needs shared internal team services for analytics and a third-party export/file integration.
