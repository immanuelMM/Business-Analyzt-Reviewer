---
title: Step 2 - Add Products
confluence_id: 4152000524
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152000524/Step+2+-+Add+Products
last_modified: 2026-10-09
pulled: 2026-10-26
---
*Audited July 16, 2026. Consolidated August 20, 2026. Rewritten August 24, 2026 — per-item pricing now uses the shared price settings component with $ / % mode. Updated August 25, 2026: the Image Editor is renamed the **Artwork Editor**. Updated August 31, 2026: this step's **position in the wizard is now store-type dependent** — step 2 for Individual Team Stores, step 3 for League Stores, which gain a Divisions & Teams step.*

*Updated August 31, 2026 — relabelling and the Catalog Template change. **Brand Catalog** is now the **Customizer** source; the **Product Vault** is now the **Stock Vault**; **Product Packages** are now **Catalog Templates** and have left the vault. Epic A is rewritten to match the built Add Products page — one search field over a unified grid with source filter chips, not stacked sections with sub-tabs. Templates are authored from a store's catalog and carry that store's branding; see* [*Product Catalog Management (Products Tab)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab)*, Epic M.*

*Amended September 1, 2026 — **Team Profit is removed** from the per-item configuration modal along with every other surface. **Fundraising is now the sole team-side markup** and carries a **per-item toggle** inside the price settings component, so a rep decides item by item whether that product collects fundraising rather than only store-wide. Epic B and the Dependencies are amended; the component itself is specified in* [*Product Catalog Management (Products Tab)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab)*, Governing rule 3.*

### Problem

Operators must populate a store with the right products, each with correct sizing, team setting, categorization, and pricing — a tedious, mistake-prone task. A store cannot be created with an empty catalog, so this step is mandatory, but building the same set of gear from scratch for every new team is the slowest part of standing up a store.

### Solution

A single Add Products surface presenting four sources in one grid: the **Customizer** (saved designs, saved carts, and new customizations), the **Stock Vault** (Pro Stock and Sideline Stock), **Catalog Templates**, and **Other stores**. Every added item passes through a per-item configuration modal before commit.

Items commit as **live catalog records** — there is no draft or pending state — but every item is **Hidden by default** and reaches the storefront only once its Visibility toggle is on and the store launches. Full catalog behavior is specified in [Product Catalog Management (Products Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab); this page covers the Add Products step of store creation.

**Adding a product is required to create a team store.** The user must add at least one product before the store can be created. Note that **store launch** additionally requires at least one **visible** product.

**Position in the wizard.** This step is **step 2 of 3** in an Individual Team Store and **step 3 of 4** in a League Store, which inserts [Step 2 - Divisions & Teams (League Stores)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4299325441/Step+2+-+Divisions+Teams+League+Stores) between Basics and this step. The step's content, requirements, and validation are identical in both flows; only its number changes. Step-count resolution is specified in *Step 1 — Basics*, Epic A0.

**This step is also the way a store is started from a Catalog Template.** There is no interstitial template-choice screen and no template path off Add Store — Add Store still enters Step 1 directly, and the rep picks a template here.

### User persona & use cases

**Who is this for?** PROLOOK sales reps creating a new store.

**Scenarios encountered** Building a catalog from saved designs and carts; standing up a store from a template captured from last season's store for the same team; reusing an item already placed in another of the rep's stores; customizing a brand-new product mid-wizard; dropping a logo onto stock gear as it is added; re-decorating a template member that arrived wearing another team's branding; pricing some items at a flat dollar profit and others at a percentage of base cost; setting a different margin on Youth than on Adult; running fundraising on the required uniform while leaving it off the fan-gear tee in the same batch; assigning team gear to the divisions and teams just built in the preceding step; arriving at this step already populated after starting a store from the Stock Vault.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want to add products from the Customizer, the Stock Vault, a Catalog Template, or my other stores and configure each item's sizing, category, and pricing, so that the catalog is accurate before launch.
- As a rep, I want to enter profit as a dollar amount or a percentage of base cost as I add each item, so that I price gear the way I actually think about it without doing the math myself.
- **As a rep, I want to decide per item whether it collects fundraising as I add it, so that the required uniform can raise money without every fan-gear item doing the same.**
- As a rep, I want to start from a template I captured from a previous store, so that a new store is minutes rather than hours.
- As a rep bringing a team back for another season, I want the template to arrive already decorated, so that I am not re-applying the same logos I applied last year.
- As a rep running a league, I want to assign team gear to the teams I just created, so that assignment is a selection rather than a correction I make after launch.

**Epic A — Intake sources.** This step mirrors the workspace **Add Products page** exactly, including its source chips: a page title, a one-line description, a **single unified product grid**, and a sticky **Cancel / Confirm Selection (n)** footer. **n is the running count of staged items** and is visible in the footer before the rep commits, so the rep always knows how many products they are about to add. There are no stacked source sections and no per-source sub-tabs. Every product card shows the product image, product name, and style description, with a **+ Add to Store** action that stages that item; multi-item cards additionally show a stacked-thumbnail collage, an **n items** badge, and a combined price.

- **Source pill.** A **SOURCE** pill above the grid shows the current brand mark, with a **Change** link opening the **"Choose a brand"** picker. It scopes the **Customizer** source only.
- **Search.** One field across all sources, by name or SKU.
- **Customize New Product.** A button at the right of the search row opens the **Prolook Customizer** to build a brand-new product from scratch. When it opens from this flow it **auto-populates the product** with the Team Name, Team Colors, and Logos entered in Step 1 (Team Branding & Sport), so new products start pre-branded. It is a button, not a source chip.
- **Source chips.** One row of filter chips scoping the grid, each with its own count:
    - **All sources** — the default.
    - **Customizer** — the rep's saved designs and saved carts from the selected brand. A saved cart renders as one multi-item card; selecting it stages all of its items. Use case: re-using a complete prior set.
    - **Stock Vault** — Pro Stock and Sideline Stock blanks. These can be decorated in the **Artwork Editor** as they are added.
    - **Catalog Templates** — the rep's saved templates. Selecting one stages all of its members. Members arrive **carrying the origin store's branding** — a template is a branded snapshot, not a style-block reference. In a store for the same team that is the point; in a differently-branded store the rep re-decorates stock members in the Artwork Editor, and members whose source was a Saved Design, Saved Cart, or Customize **cannot be re-branded at all**.
    - **Other stores** — products the rep has already placed in their **own** stores. Selecting an item adds it at its **style block** — the original brand-customizer styling — not the configured state it holds in the other store. This is the deliberate inverse of a Catalog Template: use Other stores for the gear without the branding, a template for the gear with it.
- **One template per creation.** Selecting a Catalog Template at this step is how a store is started from one. Multi-template selection is out of scope for this version.

**RESOLVED (October 8, 2026) — Customizer interaction model:** the user is presented with the Customizer **embedded within the store-creation context** (option b). The user is not taken to the Customizer in a separate or same-window page. This previously open engineering decision is closed.

**Epic B — Per-item configuration.** With no draft stage, the configuration modal is the only checkpoint before an item is buyer-visible in a launched store.

- Given I add an item from any source, when the config modal opens, then I must set **application sizing**, team setting, **price settings**, and **Category** before committing.
- **Price settings** use the shared price settings component defined in **Governing rule 3** of the Products Tab spec: a **row per size band** — **Youth** and **Adult** — each carrying **Base Cost** (read-only), **Dealer Profit**, **Fundraising**, and a derived **Retail**.
    - **Two markup inputs, not three.** **Team Profit is removed from the product** and does not appear in this modal. Dealer Profit is the dealer's margin; Fundraising is the team's money. There is no third field and no successor to Team Profit.
    - **Per-item Fundraising toggle.** The component carries a toggle enabling or disabling fundraising **for this item alone**. It initialises to the store's **Team Fundraising** setting (set in Step 1 — Basics) and the rep may change it here as they configure the item. Placement within the component is a design decision; what matters is that the control is present in this modal.
    - **Fundraising renders only when two flags agree** — the store's Team Fundraising flag and this item's toggle. When either is off, the Fundraising column is absent from every row and from the header line, retail computes without it, and **Dealer Profit is the only markup available on that item**.
    - **Turning the toggle off preserves the amount.** A figure entered and then switched off is stored, not cleared, and reappears if fundraising is turned back on.
    - A single **$ / %** toggle governs the **entire section** — every row, every markup column. There is no per-row or per-field mode.
    - In **%** mode each input is a percentage of **that row's own base cost**, never of retail; retail stays additive and is computed per band as `base cost + dealer profit + fundraising`.
    - Switching the **$ / %** toggle swaps the **prefix icon on every markup input** in the section and **clears all entered values across every row** — values are never converted between modes.
    - The summary line **"Retail price visible to customers"** reports the retail per size band.
    - **Zero fundraising has one expression:** switching the toggle off. Entering `0.00` with the toggle on produces the same retail but is transient, not a second mechanism. (This replaces the former "$0 or 0% in Team Profit" zero-commission mechanism, which lost its field when Team Profit was removed.)
    - Team Supplied items hide the section and show **Covered** — no rows, no inputs, no mode control, no fundraising toggle.
- **Visibility** is set in the modal and defaults to **off**. An item can be committed hidden and made visible later from its product detail page.
- **Restricted sources (Saved Designs, Saved Carts, Customize — including template members captured from them):** the config modal is the **last point at which the item's design is changeable** — design locks permanently on add, and remaining non-placement fields lock at the item's first non-cancelled order. The modal displays the notice: *"This item is made to order. Its design cannot be changed after it is added to the store, and no changes can be made after its first order."*
- **Stock-sourced items** (Pro Stock, Sideline Stock, stock template members): no design lock at add. Stock items are decorated in the **Artwork Editor**, reachable here at add time and afterward from the item's catalog card menu via **Edit artwork** — until the item's first non-cancelled order, at which point decoration locks with the other commercial fields.
- **The fundraising toggle locks with the commercial fields.** Once an item receives its first non-cancelled order, its toggle is non-interactive in whatever state it holds — and that lock outranks a later store-level disable (Governing rule 1). Items configured here are therefore setting a value that becomes fixed at first order.
- **Category required:** every committed item must carry a Category (Subcategory optional) or the storefront cannot place it. A product belongs to exactly one category. Team Required / Team Supplied items are filed under **Team Gear** (locked while a team toggle is on; subcategory selectable); all other items require an explicit selection, pre-filled from source metadata where available.
- **Captured bundles deploy as bundles.** A Catalog Template may contain a bundle. It arrives with its type, membership, profit set, price mode, fundraising state, and display flags intact, and is subject to the ordinary bundle rules including the two-member minimum. A bundle's fundraising **replaces** its members' on the bundle line rather than stacking with it (Products Tab spec, Epic J).
- **Team assignment (League stores):** setting Team Required or Team Supplied requires assignment to **at least one Team** before the item can be committed; the system binds the item to the selected Teams' team codes. Because League stores now build their structure in the preceding **Divisions & Teams** step, the assignment picker is normally already populated with the rep's real divisions and teams. **Inline Team creation** (team name plus auto-generated team code) remains available as the fallback for a store whose structure step was skipped or which is missing a team — it is a convenience, not the primary path, and teams created this way are written to the same shared structure the My Team(s) tab reads. Items with no team setting require no assignment.
- Given a configured item, when I remove it, then on confirmation it leaves the store catalog.

**Epic C — Stock Vault intake.**

- **Start store from the Stock Vault:** the dedicated Stock Vault page supports multi-select (checkboxes plus select-all) with a **"Start store with selected (n)"** bulk action. This launches store creation at **Step 1 (Basics)** with the selected Stock Vault items pre-loaded, so **the Add Products step arrives already complete** — shown in the stepper as **completed, review-optional**, not invisibly skipped. For a League store this is the third step rather than the second; the pre-load behavior is identical. Pre-loaded items are **staged, uncommitted selections** and remain subject to the normal per-item confirm before committing as live catalog records.
- **SKU search:** Stock Vault surfaces search by **name or SKU** (placeholder: "Search by name or SKU"); a pasted exact SKU returns its item as the top result.
- **Reference pricing:** the Stock Vault picker's Price column shows the item's reference or default price, visually muted and "ref."-affixed — vault items carry no committed store pricing; pricing is confirmed on every deploy.
- **Vault categories:** Stock Vault surfaces filter by vault-side categories (All always present; the component accepts any list — category names are never hardcoded). These are distinct from store Categories, which are assigned at the confirm step.
- **No deposit path.** Nothing in this step writes back to the Stock Vault. Saving a set of gear for reuse is done by capturing a **Catalog Template** from a store's catalog after the store exists, not from this wizard.

### Metrics & Success Criteria

- Config-modal completion rate
- Mis-priced items at launch near zero
- Uncategorized committed items = zero (enforced)
- Split of price entry between $ and % mode at add time
- **Share of items whose fundraising toggle is changed from the store default during configuration** — the read on whether per-item control is used at the point of add or only later from the product detail page
- Share of stock items re-decorated from the catalog after add — a read on whether add-time decoration is getting it right
- **Re-decoration rate on template members within the first session after deploy** — a high rate means templates are being used cross-team and reps are paying for the branded-snapshot behavior
- Median time to a populated catalog, template path vs. manual path
- Distribution of adds across the four source chips
- **Inline Team creations from the assignment prompt in League stores** — expected to fall now that structure is built in the preceding step; a persistent rate means the Divisions & Teams step is being skipped

### Dependencies & Technical Constraints

Requires the product catalog and variant/pricing model, the Saved Designs and Saved Carts libraries, **Stock Vault persistence at platform scope** (Pro Stock and Sideline Stock only, read-only with no write path from this step), **Catalog Template persistence at rep scope**, and the pricing/profit engine.

Pricing in this step uses the **shared price settings component** specified in Governing rule 3 of the Products Tab spec — **two markup inputs per size band (Dealer Profit and Fundraising), with Team Profit removed from the data model as well as the UI**, each band carrying a read-only base cost and a derived retail; a **$ / % mode persisted at section scope**; percentages resolved against the row's own base cost; and clear-on-mode-switch semantics — so this modal must consume that component rather than implement its own pricing inputs.

The modal must also write the **per-item fundraising flag**, initialised from the store's Team Fundraising setting and independently editable at configuration time. Fundraising rendering is gated on the **conjunction** of the store flag and the item flag; the entered amount persists independently of both, so an item committed with fundraising off retains any figure the rep entered. The flag joins the commercial-lock set at the item's first non-cancelled order.

Template intake requires the **frozen per-member snapshot** described in Epic M of the Products Tab spec, including resolved artwork and imprint records from the origin store and captured bundle structures (type, membership, profit set, price mode, fundraising state, display flags), plus preservation of each member's source type so edit-locking resolves identically after deploy. A deployed member's fundraising must be **re-resolved against the destination store's flag** rather than carried over as enabled.

The **Other stores** source requires cross-store product lookup scoped to the rep's own stores, returning each item at its **style block** — the deliberate inverse of template capture. A **unified Add Products query** must return all four sources into one grid with per-source counts, brand-scoped for the Customizer source only. The **Customize New Product** avenue depends on a Prolook Customizer integration that **embeds the Customizer within the store-creation context** (resolved October 8, 2026). Decoration at add time requires the **Artwork Editor** writing placement and imprint records plus the server-side compositor; the same editor is reachable post-add from the catalog card menu, gated on source type, zone-map presence, and order state (see Epic H of the Products Tab spec).

Also required: category and subcategory persistence with a single-category constraint per product and required-category validation at commit; a visibility flag defaulting to off; Team-assignment (team-code binding) validation for TR/TS items in League stores, reading the **shared division/team structure** that the Divisions & Teams step writes, with inline Team creation retained as a fallback writing to that same state; SKU-indexed vault search; reference-price display; and the Start-store-from-Stock-Vault pre-load path into Step 1 with the Add Products step in a completed, review-optional stepper state, positioned per the store type's resolved step list. Database updates plus shared internal catalog/order services and brand-customizer integration.
