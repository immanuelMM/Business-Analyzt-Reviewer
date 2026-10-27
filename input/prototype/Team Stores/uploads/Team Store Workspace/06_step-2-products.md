# Step 2 - Products

Product Curation & Per Item Configuration

‌

### Executive Summary & Problem Statement

#### The Problem

Operators must populate a store with the right products, each with correct sizing, team setting, and pricing — a tedious, mistake-prone task.

#### The Solution

Curate from Saved Designs and Saved Carts (segmented tabs) or Customize a New Product. Each added item passes through a per-item configuration modal (application sizes, team setting, adult/youth pricing and team profit) before commit; items are removable with confirmation.

‌

**Adding a product is required to create a team store.** The user must add **at least one product** to the store before the store can be created — a store cannot be completed/created with an empty catalog.

‌

### User persona & use cases

**Who is this for?** PROLOOK sales reps,

**Scenarios encountered** First visit of a session; returning to the home surface from deep inside a store workspace; sharing the platform with a new colleague who lands on the brand page first.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want to add products from saved libraries, my previous orders, or a new customization and configure each item's sizing and pricing, so that the catalog is accurate before launch.

‌

##### Epic A — Adding a product (entry point)

Clicking **+ Add Product** presents **two options**. Either path injects one or more items into the store's pending-products list, where they enter per-item configuration (Epic B).

* **1 · Customize New Product** (primary action) — opens the **Prolook Customizer** to build a brand-new product from scratch. On completion the resulting custom item is injected into the store as a pending product. Use case: a product that doesn't exist in any saved library yet. _When the Customizer opens from this flow, it **auto-populates the product** with the **Team Name, Team Colors, and Logos** entered/selected in Step 1 — Basics (Team Branding & Sport section), so new products start pre-branded for the team._

**OPEN — Engineering decision required:** the interaction model for entering the Customizer from this flow is _undetermined_. The user must either (a) be taken to the Customizer _in the same window_ and returned to the store-creation context on completion, or (b) be presented with the Customizer _embedded within_ the store-creation context window. Which approach is used is for the engineering team to decide and must be resolved before build.

* **2 · Add from Saved** — opens a picker drawing from **three reusable sources**:

    * **Saved Designs** — a grid of the operator's previously saved _single_ designs (jersey, shorts, etc.), each showing a thumbnail, title, sport, category, and default adult/youth pricing. Selecting a design injects that single item. Use case: dropping in a one-off design reused across stores/seasons.
    * **Saved Carts** — previously saved _multi-item_ carts, each card showing a stacked-thumbnail preview of the products inside. Selecting a cart injects _all_ of its items at once. Use case: re-using a complete prior package (e.g. last season's full uniform set) in one action.
    * **Previous Orders (from the Customizer)** _(specified — not yet built in the prototype)_ — the rep's **order history** of past orders placed in the Prolook Customizer. They can pull **individual products** from a past multi-product order (not just the whole order) and inject them as pending products. Use case: re-ordering exactly what was produced before without rebuilding the design. _Documented here as a requirement; not represented in the current prototype UI._

##### Epic B — Per-item configuration

* Given I add an item from any avenue, when the config modal opens, then I must set **application sizes**, team setting, and adult/youth pricing + team profit before committing.
* Given a configured item, when I remove it, then on confirmation it leaves the store catalog.

‌

### Metrics & Success Criteria

* Config-modal completion rate
* Mis-priced items at launch near zero

---

‌

**Dependency & Technical Constraint**

Requires the product catalog & variant/pricing model, the Saved Designs/Carts libraries, and the pricing/profit engine. The **Previous Orders** avenue additionally requires read access to the user's **Prolook Customizer order history**. The **Customize New Product** avenue depends on a **Prolook Customizer integration** whose embedding / hand-off model is an **open engineering decision** (same-window redirect vs. embedded-in-context). Database updates + shared internal catalog/order services + Customizer integration.
