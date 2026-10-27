---
title: Customize New Product
confluence_id: 4153049277
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049277/Customize+New+Product
last_modified: 2026-09-22
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

A rep clicking **Add Products → Customize New Product** currently proceeds without brand context enforced. In a multi-brand environment this creates licensing exposure — a rep could list product from a brand their dealership is not authorized to sell — and a bloated experience, since brands irrelevant to their entitlement are still visible. Separately, starting a custom product from a blank slate is overwhelming; reps need guided entry by sport and category.

#### The Solution

One brand context, resolved from QX7 and expressed in the **SOURCE pill** on the Add Products page. That selection does two things: it scopes which saved designs and saved carts appear under the **Customizer** source chip, and it determines **which brand customizer opens** when the rep clicks Customize New Product. From there the rep enters a sport/category picker scoped to that brand, hands off to the brand customizer, and returns with a staged custom product.

### User persona & use cases

**Who is this for?** Reps adding new custom products to a store — both during store creation (Step 2 – Products) and on an existing store's Products tab. Indirectly relevant to Prolook admins, who own brand entitlement in QX7 but do not act inside this flow.

**Scenarios encountered** Starting a new uniform from scratch for a store; entering the flow as a single-brand rep and going straight into the customizer; picking between two entitled brands before designing; switching to a second entitled brand partway through building a catalog, to add gear the first brand doesn't carry; opening a bookmarked customizer link for a brand the dealership has since lost access to; landing in the flow with no entitlements configured at all; browsing saved designs and carts scoped to the brand currently on the pill; picking a sport and category to reach the right design template; returning from the customizer with a finished item and configuring it before commit.

#### Functional Requirements & Core Workflows

##### User Stories

- As a rep entitled to one brand, I want to land straight in that brand's customizer when I click Customize New Product, so that the common path stays fast.
- As a rep entitled to several brands, I want to see only the brands I can actually sell, so that I pick the right one without wading through catalogs I have no access to.
- As a rep entitled to a licensed brand, I want it to appear alongside owned and manufactured brands, so that I can offer licensed product.
- As a rep, I want the brand I've selected to govern both the saved designs I browse and the customizer that opens, so that I'm working in one brand context rather than tracking two.
- As a rep, I want to switch to a different entitled brand mid-session without losing what I've already staged, so that building a multi-brand catalog isn't a start-over.
- As a rep, I want to be blocked from reaching a brand I'm not entitled to even by direct URL, so that I can't accidentally list something my dealership isn't authorized to sell.
- As a rep whose access to a brand has been removed, I want a clear access-denied message rather than a silent failure, so that I understand why a link that used to work no longer does.
- As a rep whose dealership has no entitlements configured, I want an explicit state telling me who to contact, so that I don't assume the tool is broken.
- As a rep, I want to pick a sport and category to start, so that I enter the right design template instead of a blank slate.
- As a rep, I want the customizer to open already carrying the store's team name, colors, and logos, so that I'm not re-entering branding the store already knows.

##### Acceptance Criteria

**Brand resolution**

- Given a rep opens the Add Products page, when the page loads, then the SOURCE pill resolves against QX7 and offers only the brands that rep's dealership is entitled to sell.
- Given QX7 returns exactly one entitled brand, when the page loads, then the pill resolves to that brand automatically and no picker is shown.
- Given QX7 returns two or more entitled brands, when the rep clicks Customize New Product before resolving the pill, then they are required to choose a brand before a customizer opens.
- Given QX7 returns no entitled brands, when the page loads, then the pill and the Customizer source chip render an explicit state naming the problem and directing the rep to their Prolook admin, while the Stock Vault, Catalog Templates, and Other stores chips continue to function normally.

**Scope of the selection**

- Given a brand is resolved on the pill, when the rep filters to the Customizer source chip, then only that brand's saved designs and saved carts are returned.
- Given a brand is resolved on the pill, when the rep clicks Customize New Product, then that brand's customizer opens.
- Given a brand is resolved on the pill, when the rep filters to Stock Vault, Catalog Templates, or Other stores, then results are unchanged by the brand selection.

**Switching and enforcement**

- Given a rep has resolved the pill to one brand, when they reopen the picker, then their prior selection is visible but not pre-committed and they must explicitly re-select.
- Given a rep switches the pill to a different entitled brand, when the switch commits, then the Customizer chip and the customizer target re-scope to the new brand and any already-staged items remain staged and unaffected.
- Given a rep navigates directly to a brand customizer or catalog route their dealership is not currently entitled to, when the request is made, then the server returns an access-denied response rather than catalog data.

**Picker and hand-off**

- Given the rep has reached the sport/category picker, when it renders, then only sport and category templates belonging to the resolved brand are shown.
- Given the picker, when the rep selects a sport/category card, then they are handed off to that brand's customizer on the matching design template.
- Given the customizer opens from this flow, when it loads, then Team Name, Team Colors, and Logos are pre-populated from the store's branding.
- Given the rep finishes a design, when they return from the customizer, then the item is staged as a custom product and configured through the standard per-item configuration modal, which is the last point at which its design can be changed.


#### Epic A — Brand entitlement & the SOURCE pill

**A1 — The brand list is entitlement-filtered from QX7.** The pill's **Change** link opens a **Choose a brand** picker listing only brands the rep's dealership is entitled to sell. There is no fixed brand list; the count varies per user.

**A2 — Single-entitlement reps never see the picker.** Where QX7 returns exactly one brand, the pill resolves to it automatically and Customize New Product opens that brand's customizer with no intermediate step.

**A3 — Multi-entitlement reps select explicitly.** Where QX7 returns two or more brands, the rep must resolve the pill before Customize New Product will open a customizer. Brand type (owned/manufactured vs. licensed) is shown where QX7 exposes it.

**A4 — Scope of the selection.** The pill governs the **Customizer source chip** and the **Customize New Product** button only. Stock Vault, Catalog Templates, and Other stores are not brand-scoped and are unaffected by it.

**A5 — Server-side enforcement.** Direct navigation to a brand's customizer or catalog the dealership is not currently entitled to is blocked server-side and returns an access-denied response, not data. Hiding the UI affordance is not sufficient. Enforcement must ship with the UI change, not after.

**A6 — Brand switching within a session.** The rep can reopen the picker and choose a different entitled brand at any point. The prior selection is visible but not pre-committed. Switching re-scopes the Customizer chip and the customizer target; already-staged items are unaffected.

**A7 — Zero-entitlement state.** Where QX7 returns no brands, the pill and the Customizer chip render an explicit state naming the problem and directing the rep to their Prolook admin — not a silent empty list. The rest of the Add Products page continues to function, since the other three sources do not depend on brand.

**A8 — Both entry points behave identically.** Step 2 of store creation and the Products tab of an existing store enforce A1–A7 the same way.

#### Epic B — Sport / category picker

**B1** — Selecting Customize New Product opens a grid of sport/category cards (baseball, basketball, football, soccer, apparel, accessories, and gendered variants).

**B2** — The grid is scoped to the resolved brand: only templates belonging to that brand appear.

**B3** — Selecting a card hands off to that brand's customizer on the matching design template.

### Epic C — Hand-off & return

**C1** — The customizer auto-populates Team Name, Team Colors, and Logos from the store's branding when opened from this flow.

**C2** — The finished item returns staged as a custom product and is configured through the standard per-item configuration modal (Product Catalog Management, Epic A), where design is changeable for the last time. Custom items carry a permanent design lock on commit per Governing rule 1.

### Metrics & Success Criteria

- Picker→customizer hand-off completion
- Time to start a new product

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires integration with the external “Customizer 3.0” design tool (referenced but outside these files) and a catalog of sport/category templates. Third-party / internal design-tool integration.
