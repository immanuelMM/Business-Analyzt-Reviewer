---
title: Product Categories
confluence_id: 4381245441
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4381245441/Product+Categories
last_modified: 2026-10-12
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

A rep running many stores sells much the same kind of product in each of them — uniforms, practice gear, fan apparel. Until now the categories those products are filed under were defined per store, so a rep with a dozen similar stores built the same short list a dozen times. The work is trivial individually and tedious in aggregate, and it drifts: the same concept ends up spelled differently across stores, which makes anything that groups or reports by category inconsistent for no good reason.

#### The Solution

**Product Categories** — a workspace-level list of categories and their subcategories, defined once and applied across every store. Two categories are seeded for a new workspace, **Team Gear** and **Fan Gear**, each with subcategories; both are ordinary records a rep can rename, extend, or remove. Categories and subcategories surface as dropdowns when editing a product inside a store, so the taxonomy built here is what a rep picks from there.

### Governing rules

1. **Defined once, applied everywhere.** There is one taxonomy, held at workspace level, and every store uses it. A rep setting up their tenth similar store inherits it rather than rebuilding it. **There is no per-store override** — see the scope note below.
2. **The seeded categories are not protected.** Team Gear and Fan Gear are starting content, not system fixtures. A workspace that does not sell that way removes them, and the feature is expected to work with neither present.
3. **This is a vocabulary, not an assignment.** Nothing here puts a product in a category. It defines the options a rep chooses from in a store's product editor.
4. **Stock Vault items are out of scope.** Vault items are not categorized by this taxonomy, and the section says so.
5. **Open to every workspace user.** Unlike *Pricing Tiers*, which is admin-only because it moves money, this section is editable by any workspace user.
6. **Destructive changes are warned about, never blocked.** A rep may delete a category that products depend on. The platform's job is to state the consequences before the deletion and surface the resulting problem afterward — not to prevent the rep from doing it. The store keeps running and keeps selling; the damage is to organization and reporting, and the rep who manages that store is the one who repairs it.
7. **History is immutable.** Reporting already published under a category name keeps that name. Renaming a category changes what future sales are reported under; it never rewrites a period that has already closed.

### Scope note — there is no per-store override

Earlier prototype copy described these as workspace defaults that **stores can override**. That was not planned and is not in scope. No per-store category list exists, no store can hide or rename an inherited category, and no store-scoped overlay is built. **The section description must be reworded** to drop the override claim; as written it promises behavior the product does not have.

### Scope boundary

This page owns the **workspace taxonomy**: creating, renaming, and removing categories, and adding and removing their subcategories. **Assigning** a product to a category happens in the store's product editor and is owned by *Product Catalog Management (Products Tab)*, which also owns the error state this page can produce. The Home-tab action item is owned by *Store Home (Home Tab)*, Epic C.

### User persona & use cases

**Who is this for?** Any workspace user, most valuably a rep running several stores with similar product mixes.

**Scenarios encountered** Setting up the taxonomy once before building a season's worth of stores; adding a subcategory the seeded set does not cover; correcting a category name that was misspelled when it was created; removing a seeded category a workspace will never use; deleting a category and being told exactly how many products and how much in sales it touches before confirming; opening a store a week later and finding products flagged because the category they were filed under no longer exists; re-filing those products one at a time; inheriting the defaults and changing nothing at all.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep with many similar stores, I want to define categories once at workspace level, so that I am not rebuilding the same list per store.
- As a rep, I want to add subcategories under a category, so that the taxonomy is specific enough to be useful when filing a product.
- As a rep, I want to rename a category, so that fixing a bad name is an edit rather than a delete and a re-file.
- As a rep, I want to remove categories I will never use, including the seeded ones, so that the dropdown in the product editor is short and relevant.
- As a rep, I want to be told what a deletion will break before I confirm it, so that I am not discovering the damage in a sales report weeks later.
- As a rep managing an affected store, I want the problem surfaced where I work, so that a change someone made at workspace level does not quietly degrade my storefront.
- As a rep editing a product, I want the workspace categories already available, so that filing a product is a selection rather than a setup task.

##### Epic A — The Product Categories surface

- **Placement.** A section of **Workspace Settings**, between Integrations and Pricing Tiers. The page header states that Workspace Settings apply across every store and that store-specific settings live in each store's Settings tab.
- **Section description** states that categories and subcategories appear as dropdowns when editing a store product, and that Vault items are not categorized here. It **must not** claim that stores can override (see the scope note).
- **Adding a category.** A name field paired with an **Add Category** action sits above the list, unavailable while the field is empty.
- **Category cards.** Each category renders as a card carrying its **name**, a **product-count pill**, a **rename** affordance, a **delete** affordance, a labelled **subcategories** area, and an inline add-subcategory control. Cards lay out in a responsive grid.
- **Empty state.** Given every category has been removed, when the section renders, then it states that no categories are defined and that store products will be uncategorized until one is added. Because Governing rule 2 makes an empty taxonomy legitimate, this is a reachable state in normal use and not an error.
- **OPEN — to be confirmed:** whether category order is editable, and what it defaults to. No reorder control is shown, so the dropdown order in the product editor is currently whatever creation order produces.
- **OPEN — to be confirmed:** duplicate-name handling, both for categories and for subcategories within one category.

##### Epic B — Subcategories

- **Two levels, and only two.** A category holds subcategories; a subcategory holds nothing. The taxonomy does not nest further.
- **Display.** Subcategories render as removable chips under a labelled heading within their category's card.
- **Adding.** Each card carries its own name field and **Add** action, so a subcategory is always created in the context of its parent.
- **Removing a subcategory falls back, it does not orphan.** Given a subcategory is removed, when products are filed under it, then those products **remain filed under the parent category** and lose only their subcategory. They stay categorized, stay filterable at category level, and produce **no error and no action item**. This is deliberately lighter than category deletion (Epic D), because the product retains a valid place in the taxonomy.
- Given a category with no subcategories, then it remains valid — a category is usable on its own.
- **OPEN — to be confirmed:** whether subcategory removal warns at all. The fallback is benign, but a rep removing a subcategory carrying many products is still losing a level of organization they may not intend to lose.

##### Epic C — Renaming a category

- Given a category, when the rep renames it, then every product filed under it keeps its filing and the new name appears everywhere the category is displayed — the product editor, storefront organization, and future reporting. **Renaming re-files nothing**, because products reference the category rather than its name.
- **Reporting already published keeps the old name.** Given sales were reported under the previous name, when the rename takes effect, then **past periods continue to report under the name in force at the time** and only subsequent sales use the new one. A closed month does not change because someone edited a label afterward.
- Helper copy states this plainly at the point of rename, so a rep does not expect historical reports to re-label and does not read the mismatch as a defect.
- **OPEN — to be confirmed:** how a reporting surface presents a category that appears under two names across a date range spanning the rename — two rows, or one row annotated. *Earnings* → Sales breakdown is the surface that has to answer this.

##### Epic D — Deleting a category **High-impact**

The consequential path, and the reason the product-count pill exists.

**The warning**

- Given a category with **no products** filed under it, when the rep deletes it, then it is removed with a light confirmation. There is nothing downstream to affect.
- Given a category with **products** filed under it, when the rep deletes it, then a **significant warning** is presented before anything is written, naming the number of affected products and the stores they sit in.
- Given affected products that **carry sales**, then the warning escalates further and names the sales attached to the category as well as the product count.
- **The warning names the downstream effects specifically**, not in general terms. It must state that affected products become uncategorized on the storefront and stop being filterable or searchable by category; that *Earnings* → Sales breakdown loses its grouping for those products going forward; that category-based reporting is affected; and that each affected product must be re-filed by hand.
- **Deletion is never blocked.** Per Governing rule 6, the rep confirms and it proceeds. The warning exists to make the decision informed, not to prevent it.

**What happens to the store**

- **The store keeps running.** Affected products remain visible and purchasable on the storefront. Nothing is unpublished, nothing is removed from a cart, and no order is affected.
- **The products become uncategorized.** They lose category filtering and category search on the storefront, so a shopper browsing by category will not find them — they are reachable, just not organized. This is a real UX degradation and is accepted as the cost of an unblocked deletion.
- **Subcategories go with the category.** Deleting a category removes its subcategories; products filed under them are uncategorized along with the rest, since the parent they would fall back to no longer exists.

**How the rep finds out**

- **Error state on the Products tab.** Given a store holds products whose category no longer exists, when the rep opens the Products tab, then those products render in an **error state** identifying the missing category as the cause. Owned by *Product Catalog Management (Products Tab)* — see the cross-spec note below.
- **Action item on the Home tab.** The same condition surfaces as a card in **Needs your attention** on the store's Home tab, routing to the Products tab filtered to the affected items. Owned by *Store Home (Home Tab)*, Epic C, where it must be registered before it can render.
- **Tier is Action, not Blocking.** Nothing is stopped — buyers can still order and orders still ship. Under the Home spec's severity model, Blocking means buyers, orders, or fulfillment are halted right now, which is not the case here. Rep work is queued and has a cost if it keeps waiting, which is the definition of Action tier.
- **It is the store rep's problem to resolve.** A workspace-level action produced a store-level consequence, and the rep managing that store is who sees and fixes it.

**Recovery**

- **Re-filing is manual, product by product.** Given affected products, when the rep wants to resolve the condition, then they assign each one to a category in the product editor. The condition clears when no product in the store references a missing category.
- **Recreating a category with the same name does not reattach anything.** A new category is a new record, and the orphaned products do not find their way back to it. Helper copy on the warning should say so, since "I'll just make it again" is the obvious assumption and it is wrong.
- **OPEN — to be confirmed:** whether the Products tab offers a **bulk re-file** for affected items. A deletion can orphan a large number of products across several stores, and resolving one at a time is proportionate only for small cases. Recommend yes; confirm the surface with the Products spec.

##### Epic E — How the taxonomy reaches a store

- Given a rep editing a product inside a store, when the category control renders, then the workspace categories are the options, with that category's subcategories available as a dependent selection.
- Given a workspace category added after a store already exists, then it becomes available in that store with no per-store action — this is the point of the feature.
- **Stock Vault items are excluded.** A vault item is not filed against this taxonomy, and the section states so plainly so a rep does not go looking for a vault categorization control.
- **OPEN — to be confirmed:** whether a product may be left uncategorized *by choice* at creation, as distinct from being orphaned by a deletion. If a product can be saved with no category, the orphaned state and the never-filed state look identical on the Products tab and need distinguishing.
- **OPEN — to be confirmed, and cross-spec:** whether this taxonomy is what *Earnings* → Sales breakdown groups by. That surface groups sales under a product-type vocabulary — hoodies, bats, gloves, uniforms — which is not the shape of Team Gear and Fan Gear. The warning in Epic D asserts that deleting a category affects Sales breakdown, which is only true if they are the same field. If they are two taxonomies, a product carries both and the warning copy must be corrected. Confirm before build.

#### Acceptance Criteria

- Given Workspace Settings, when the rep opens Product Categories, then every workspace category is listed with its subcategories and a product count.
- Given a name in the new-category field, when the rep adds it, then a card appears with no subcategories and a zero product count.
- Given a category, when the rep renames it, then no product changes its filing and the new name appears in the product editor and on the storefront.
- Given sales reported under a category's previous name, when the category is renamed, then those past periods still report under the old name.
- Given a subcategory carrying products, when it is removed, then those products remain filed under the parent category and no error or action item is produced.
- Given a category carrying products, when deletion is attempted, then a warning names the affected product count, the stores involved, any attached sales, and each downstream effect before anything is written.
- Given the warning is confirmed, then the deletion proceeds — it is never blocked.
- Given a deleted category, when a shopper visits an affected store, then the affected products remain visible and purchasable but are not filterable or searchable by category.
- Given a store holding orphaned products, when the rep opens the Products tab, then those products render in an error state naming the missing category.
- Given the same store, when the rep opens Home, then an Action-tier card reports the condition and routes to the affected products.
- Given the rep re-files every affected product, then the error state and the Home card both clear.
- Given a category is recreated with the same name, then previously orphaned products remain orphaned.
- Given a Stock Vault item, then no category from this taxonomy is applied to it.
- Given any workspace user, then they can add, rename, and remove categories and subcategories — this section is not admin-gated.
- Given any store, then no per-store category list exists and no store can hide, rename, or replace an inherited category.

### Metrics & Success Criteria

- **Share of workspaces that modify the seeded taxonomy** — if almost nobody changes Team Gear and Fan Gear, the editing surface is doing less work than the defaults are
- Categories and subcategories per workspace — a read on whether two levels are enough
- **Stores per workspace at the time categories are edited** — the feature's value scales with store count, so edits by single-store workspaces suggest it is being used for something other than the stated case
- **Category deletions confirmed against a non-zero product count**, and the product count at the moment of deletion — the direct measure of how often the warning is being overridden and at what scale
- **Deletions cancelled at the warning** — the warning earning its place; a near-zero cancel rate on large deletions means it is not landing
- **Time from a category deletion to the last affected product being re-filed** — how long stores sit degraded, and the clearest read on whether unblocked deletion was the right call
- Orphaned products that are never re-filed — the residue of the policy, and the argument for a bulk re-file if it is high
- Category renames per workspace — a high rate relative to deletions means rename was the missing affordance it looked like

---

### Dependencies & Technical Constraints

Requires a **workspace-scoped category collection**, each category holding a name and an ordered set of subcategories, with the seeded Team Gear and Fan Gear written as **ordinary records at workspace creation** rather than system constants — Governing rule 2 means no code path may treat them as undeletable or recreate them on absence. **No per-store category storage of any kind is built** (see the scope note); there is one collection and every store reads it.

Store products must reference categories **by id rather than by name**. This is what makes renaming non-destructive, and it is also what makes a recreated category a genuinely different record from the one deleted. The **product count** on each card requires a reverse lookup from category to referencing products across every store on the workspace, and the deletion warning needs that same lookup plus the stores involved and the sales attached.

**Deletion is permitted with referencing products, so the orphaned state must be a first-class, queryable state** rather than a dangling reference discovered at render time. A product whose category id no longer resolves must be identifiable by query, because three surfaces depend on finding them: the Products tab error state, the Home attention card, and the storefront's decision to render the product without category placement. A silent null that each surface interprets for itself will diverge.

**Reporting must retain the category name in force at the time of sale**, not resolve the name at read time. This is the same shape as the commission constraint in *Pricing Tiers* — a figure already reported must not change because a record was edited afterward. Either the sale records the name alongside the category id, or the category keeps a name history with effective dates; the first is simpler and sufficient.

The store product editor consumes this collection as its category and subcategory options (*Product Catalog Management (Products Tab)*), reading the workspace list live so a category added later is available to existing stores with no migration. **Stock Vault** items carry no field from this collection.

**Two other specs must be amended before this ships.** *Product Catalog Management (Products Tab)* must define the **error state** for a product whose category is missing, and — if the open item in Epic D is taken — a bulk re-file path and an addressable filter for affected items. *Store Home (Home Tab)* must **register the condition in its Epic C catalogue** with an id, Action tier, trigger, resolution route, and clears-when, plus rep-facing copy in its Epic I table; that spec is explicit that a condition with no owning registration is not shippable, and that Home may not compute a condition the owning surface does not already resolve. The next free id is **C-27** — C-25 is retired and not reusable, and C-26 is informally reserved for the artwork-library candidate noted in that spec.
