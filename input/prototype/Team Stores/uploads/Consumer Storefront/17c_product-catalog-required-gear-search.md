# Product Catalog, Required-Gear & Search

### Executive Summary & Problem Statement

#### The Problem

Buyers need to find products quickly, and rostered players must not miss the gear they're required to order — while everyone (including fans) should still be able to browse and buy what's available to them.

#### The Solution

A storefront catalog organized into **two sections** — **Team Gear** (team-required + team-supplied) and **All Products** — plus a **required-gear nudge** ("2 required items to order") for rostered players and a **product search bar**. Sections render as horizontal snap-scrollers on mobile and grids on desktop.

‌

### User persona & use cases

**Who is this for?** Rostered players/parents (required-gear nudge + Team Gear) and all buyers including fans/supporters (All Products + search).

**Scenarios encountered** A player with outstanding required items; a fan browsing everything in the store; any buyer searching for a specific product by name.

### Functional Requirements & Core Workflows

#### User Stories

* As a rostered player/parent, I want a clear count of my required items and a Team Gear section, so that I order everything I'm required to.
* As any buyer, I want an All Products section, so that I can browse and buy anything the store offers.
* As any buyer, I want a search bar, so that I can find a specific product without scrolling.

#### Acceptance Criteria

* **Team Gear section:** Given the store contains team-required / team-supplied gear, when home renders, then a **Team Gear** section shows those items. For **rostered players** these items are **required** to order; for users **not associated with a rostered player** (fans/supporters) the section is still **visible but optional** to purchase.
* **All Products section:** Given the store catalog, when home renders, then an **All Products** section shows every product available in the store, available to **everyone**.
* **Required-gear nudge:** Given a rostered player with outstanding required items, when home renders, then a nudge shows the outstanding count and links to those items.
* **Search:** Given the search bar, when a buyer types a query, then matching products are surfaced from the catalog.

### Metrics & Success Criteria

* Required-item completion rate >95%
* Search usage & search→product / add-to-cart rate
* All Products engagement / add-to-cart

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires the catalog with **team-setting flags** to split **Team Gear** from **All Products**, **per-buyer required-item computation** against roster/coverage (required for rostered players, visible-but-optional for non-associated buyers), and **product search / indexing** over the catalog. Shared catalog + roster services.
