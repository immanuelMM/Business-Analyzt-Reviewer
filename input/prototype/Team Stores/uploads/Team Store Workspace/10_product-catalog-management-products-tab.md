# Product Catalog Management & Publishing (Products Tab)

### Executive Summary & Problem Statement

#### The Problem

Reps add products mid-season but they shouldn't go live until correctly configured — and once items are live and being ordered by players, pulling them down carelessly can orphan or break in-flight orders. Reps also need to revise an item's details after the fact, and publish designs without the coach's sign-off, creating disputes over who owns a design error.

#### The Solution

A single catalog surface where each product is added as a draft, configured, edited, and published through a **design-approval gate**. Editing happens in a per-product **side drawer** whose fields are enabled in draft and locked once published (with unpublish-to-edit). Unpublishing is governed by **order-state and item-type rules** that protect items already ordered by rostered players, while still allowing safe removal of un-ordered or fan-gear items via confirmation.

‌

### User persona & use cases

**Who is this for?** Store owners / reps maintaining the catalog; indirectly the team manager (coach) whose design approval is referenced.

**Scenarios encountered** Adding a mid-season item; drafting several products before publishing; editing a product's price, team setting, name, application sizes, or customizations; renaming the storefront-facing product name; deleting a product; publishing a design without formal coach sign-off; attempting to unpublish an item that players have already ordered.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want to keep products as drafts and publish when ready, so that buyers never see misconfigured items.
* As an rep, I want to add a product either by customizing a new one or by pulling from what I've already saved or ordered, so that I don't rebuild work that already exists.
* As a rep, I want a checkpoint confirming the team manager approved the design before I publish, so that responsibility for design errors is clear.
* As a rep, I want unpublishing blocked or guided when an item has live orders, so that I never orphan a rostered player's in-flight or fulfilled order.
* As an rep, I want to edit a product's settings from its card, so that I can correct pricing, type, name, sizing, or design without rebuilding it.

#### Acceptance Criteria - base publishing flow

* Given I add a product, when added, then it is a draft until configured and published.
* Given a draft item is fully configured, when I publish, then it becomes visible in the storefront.

##### Epic A — Adding a product (entry point)

Clicking **+ Add Product** presents **two options**. Either path lands the item in the store's pending-products list as a draft for per-item configuration.

* **Customize New Product** — opens the **Prolook Customizer** to build a brand-new product from scratch; on completion the resulting item is injected as a pending product. Use case: a product that doesn't exist in any saved library yet.
* **Add from Saved** — opens a picker drawing from **three reusable sources**:

    * **Saved Designs** — the operator's previously saved _single_ designs (jersey, shorts, etc.), each showing a thumbnail, title, sport, category, and default adult/youth pricing. Selecting one injects that single item.
    * **Saved Carts** — previously saved _multi-item_ carts, each card showing a stacked-thumbnail preview of the products inside. Selecting a cart injects _all_ of its items at once (e.g. last season's full uniform set).
    * **Previous Orders (from the Customizer)** — the rep's **order history** from the Prolook Customizer. They can pull **individual products** out of a past multi-product order (not just the whole order) and inject them as pending products — re-ordering exactly what was produced before without rebuilding the design.

##### Epic B — Design-approval publish gate

* Given a configured draft item, when the rep clicks Publish, then a modal asks whether they have obtained **design approval from the team manager (coach)** before the item goes live.
* Given there is _no_ system link between this confirmation and an actual team-manager account, when the rep responds, then they **can bypass** the approval — there is no enforced coach sign-off.
* Given the rep chooses to bypass, when they proceed, then they must **explicitly accept/acknowledge that they (the rep) take responsibility for any design errors**; only after

##### Epic C — Unpublishing workflow

Behavior on an unpublish attempt depends on the item's type (_Team Required / Team Supplied_ vs. _Fan Gear_) and whether a rostered player has ordered it, and that order's state.

* **Blocked — fulfilled order:** Given a **Team Required or Team Supplied** item that has been ordered by **at least one rostered player and that order is fulfilled**, when the user attempts to unpublish, then unpublishing is **not allowed** (hard block).
* **Guided — pending order:** Given a **Team Required or Team Supplied** item that has been ordered but the order is **pending**, when the user attempts to unpublish, then a modal appears offering **"Keep Published"** or **"Go to Pending Orders"** — the latter routes them to cancel the pending order, after which the item can be unpublished.
* **Allowed — confirmation only:** Given **Fan Gear**, OR a Team Required / Team Supplied item that has **not** been ordered by any rostered player, when the user attempts to unpublish, then a **confirmation modal** is shown and, on confirm, the item is unpublished.

##### Epic D — Editing products (catalog management)

Applies to both draft and published products. Editing is reached from the **edit icon on the product card**, which opens a **side drawer** exposing all editing capabilities — each control enabled or disabled by publish state.

* Given any product card (draft or published), when I click its **edit icon**, then a **side drawer** opens containing the full set of editable controls for that product.
* Given the drawer, the editable fields are: **price settings**, **team settings** (Team Required / Team Supplied / Fan Gear), **application sizes**, **product name** (the storefront-facing name), **customizations**, and **delete product**.
* Given a product in **draft**, when the drawer is open, then all of those controls are **enabled** and editable.
* Given a product that is **published**, when the drawer is open, then those controls are **disabled**; to change them the user must first **unpublish** the product (subject to the Epic C unpublish rules), after which the fields become editable.

##### Epic E — Product bundles

Bundles let a rep or team manager package an entire team uniform into a single purchasable unit (e.g. basketball jersey + basketball shorts) so rostered players buy the complete kit in one action instead of adding each piece separately. Created from the Products tab via **+ Create Bundle**.

* Given the Products tab, when I click **+ Create Bundle**, then the Create Bundle surface opens with a name field, a product picker (selecting from the store's draft products), and the team-setting controls.
* **Name:** Given the Create Bundle surface, when I save, then a non-empty **bundle name** is required.
* **Member products (≥ 2):** Given product selection, when I build the bundle, then I must add **more than one product** — a bundle requires at least two member products. (Selected products show a running count and total; available drafts are pickable from a quick grid or the full "See All Products" picker.)
* **Bundle distinction:** Given the bundle is set as **Team Required** or **Team Supplied**, when the bundle is created, then the entire bundle adopts that distinction; if **any single member product is Team Required or Team Supplied, the whole bundle inherits that distinction**.
* **Create:** Given a valid bundle (named, ≥ 2 products, distinction set), when I click **Create Bundle**, then it is added to the catalog as a single bundle product (shown with a stacked-thumbnail / 2×2 collage preview of its member items) and follows the same draft → publish lifecycle as other products.
* **Edit:** Given an existing bundle, when I open its edit drawer, then I can adjust the **bundle settings** (Team Required / Team Supplied) and the per-item pricing of its members, consistent with the publish-state locking rules in Epic B.

##### Epic F — Bulk pricing

Bulk pricing lets a rep set profit margins across many products at once instead of editing each product individually. Presented in a **modal**, and — because profit amounts cannot be changed on published products — it operates **only on products in draft mode**.

* **Inputs:** Given the Bulk Pricing modal, when it opens, then it exposes two dollar-amount inputs: **Dealer Profit** ($) and **Team Profit** ($).
* **Scope toggles (mutually exclusive):** Given the modal, there are two toggles — **"Apply pricing to all products"** and **"Apply pricing to selected products"** — of which **only one can be active at a time**. Selecting one deactivates the other.
* **All-products mode:** Given _"Apply pricing to all products"_ is active, when applied, then the entered Dealer/Team profit is set on **every draft product** in the store.
* **Selected-products mode:** Given _"Apply pricing to selected products"_ is active, then a product picker is revealed (mirroring the Create Bundle picker) so the rep chooses which draft products to re-price; pricing applies only to those selected.
* **Draft-only constraint:** Given bulk pricing, when products are targeted, then **only products in draft mode are eligible** — published products are excluded because their profit amounts cannot be changed.
* **Apply:** Given a valid entry (a profit amount and at least one targeted draft product), when I click **Set Pricing**, then the entered Dealer/Team profit is written to all targeted draft products.

‌

### Metrics & Success Criteria

* Draft→published conversion
* Misconfigured live items near zero
* Design-approval acknowledgment captured on 100% of publishes
* Zero unpublish actions that orphan a fulfilled rostered-player order
* Edit-drawer task completion (price/type/name/sizes/customizations) without errors

‌

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires catalog persistence with publish state, the per-item config/pricing engine, and **edit-write paths** for product fields (price, team setting, application sizes, storefront name, customizations, delete) whose enable/disable is driven by publish state. The **Add from Saved** entry point requires per-account persistence of **Saved Designs** and **Saved Carts** plus **read access to the rep's Prolook Customizer order history**, decomposed to the **individual product / line-item level** so single items can be pulled from a multi-product order. The **unpublish rules** require **order-state data** (which rostered players ordered an item, and whether each order is _pending_ vs. _fulfilled_) joined to **item type** (Team Required / Team Supplied / Fan Gear) and the roster. The **design-approval acknowledgment** must be recorded as a rep-responsibility audit trail even though no team-manager account is linked. Database updates + shared internal catalog / order / roster services + Customizer integration.
