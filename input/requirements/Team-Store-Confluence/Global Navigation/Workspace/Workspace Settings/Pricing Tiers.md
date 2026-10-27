---
title: Pricing Tiers
confluence_id: 4380557314
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4380557314/Pricing+Tiers
last_modified: 2026-10-12
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

A team store sells to several audiences at once and they should not all pay the same price. A fan browsing the public storefront, a rostered player's parent, a booster the team is courting, and the coaching staff are four different commercial relationships, and a single retail price serves none of them well. Until now the only lever was a cart discount — a promotion applied on top of one price — which cannot express "this group buys at a different price level" and leaves no durable record of who paid what and why.

Commission has the same root problem. If every shopper pays one price there is nothing to compute a margin against, so the rep's earnings have no structural definition — they are whatever is left over.

#### The Solution

**Pricing Tiers** — an admin-managed, workspace-level ladder of price levels ordered highest price first. Each tier is a **percentage off retail**. Shoppers pay **Retail** by default; entering a store or team code on the storefront resolves them to that code's tier, and they see that tier's prices. **Commission is the spread between the tier paid and the tier immediately below it.**

The section carries two tabs: **Tiers**, the ladder itself, and **Codes**, every code across every store on the workspace with the tier each one carries.

### Governing rules

1. **Retail is the default.** No code means Retail. The storefront is public at Retail prices and a shopper only ever moves down the ladder by entering a code.
2. **The ladder is ordered, and the order is load-bearing.** Commission is the spread between the tier paid and the one immediately below it, so reordering tiers changes the commission earned on every code sitting at the affected levels. Order is not presentation.
3. **A tier is a percentage off retail.** Every tier — including those that arrive from a connected **third-party product source** — resolves as a discount against the retail price. The source badge records where a tier came from; it does not mean that tier is priced differently in kind.
4. **Base is the floor.** Base is the Prolook cost floor and nothing sells below it. No tier may resolve to a price beneath it.
5. **Admins only.** Tiers and their codes are configured by admin reps. A non-admin never creates, edits, reorders, or deletes a tier, because a tier change moves prices and commission across every store on the workspace.
6. **Fundraising is not a tier.** It adds on top of the tier price and reports separately (see *Product Catalog Management (Products Tab)*, Governing rule 3). A tier never absorbs or offsets fundraising.

### A note on the product source

Some tiers originate outside Team Stores, in whatever **third-party product source** the client runs their catalog and price lists from. This spec deliberately does **not** name a specific system. The source is a client-dependent integration, and a tier's behavior in Team Stores does not vary by which system it came from — only by whether it came from one at all. Any surface naming a particular product system should be reworded to the generic term; the badge currently shown on sourced tiers in the prototype is an artifact of the seeded client, not a product decision.

### Scope boundary

This page owns the **tier ladder** and the **workspace-wide view of every code**. A store's own codes — including storefront entry gating, promotional cart discounts, and the league join model — are owned by *Store Settings (Settings Tab)* → **Store Codes**. The two surfaces read and write the **same code records**: the workspace list shows every code across every store, and a store's Store Codes section shows only the codes attached to that store. **Promotions are not tiers.** A promotion discounts a cart on top of whatever tier the shopper resolved to; it never changes which tier they are on.

### User persona & use cases

**Who is this for?** Admin reps who set pricing policy across the workspace. Non-admin reps see the prices their stores sell at but do not configure them. Shoppers never see this surface — they experience it as a price that changes when they enter a code.

**Scenarios encountered** Reviewing what each audience pays before a season opens; adding a tier for a group the sourced tiers do not cover; checking what a jersey actually costs at every tier without opening a product page; minting a code for a team's coaching staff so they buy at the coach price; moving a code from the default tier to a lower one after a sponsor conversation; auditing every code on the workspace to find one sitting at the wrong tier; working out why a particular order produced the commission it did; confirming that nothing has been configured to sell below the cost floor.

### Functional Requirements & Core Workflows

#### User Stories

- As an admin, I want a ladder of price levels, so that fans, players, boosters, and coaches can each pay a price appropriate to them.
- As an admin, I want to see what a real product costs at every tier, so that I am setting percentages against money rather than against abstractions.
- As an admin, I want to attach a tier to a code, so that handing someone a code is how I give them a price.
- As an admin, I want every code on the workspace in one list with its tier, so that I can audit pricing across stores without opening each one.
- As an admin, I want to change a code's tier in place, so that a correction is one action rather than a rebuild.
- As an admin, I want to understand how commission falls out of the ladder, so that I can see what reordering or adding a tier will cost me.
- As an admin, I want a floor that nothing can be priced beneath, so that a mis-set percentage cannot sell below cost.

##### Epic A — Tiers tab

- **Placement.** A section of **Workspace Settings**, alongside User Management, Emails, Integrations, Product Categories, and Pick-up Locations. The section header states the default-Retail rule, that every store and team code carries a tier, and that commission is the spread between the tier paid and the one below it.
- **Two tabs:** **Tiers** (default) and **Codes** (Epic C).
- **The ladder is presented highest price first**, and the list is explicitly labelled as such so the ordering is not mistaken for an arbitrary sort.
- **Columns:** the tier's name, badges, and description; **Off retail** as a percentage; a **sample SKU price** resolved at that tier; and a **code count** — the number of codes currently carrying it.
- **Badges.** A **source badge** marks a tier that originated in the connected third-party product source rather than being created here. Exactly one tier carries **Default for codes** — the tier a newly minted code takes unless the admin chooses another.
- **Reordering.** Each row carries up and down controls. Because order determines commission (Governing rule 2), a reorder changes earnings on existing codes and must be presented as a consequential action rather than a sort.
- **The sample-price column names the adjacent tier.** Each row shows the resolved price for one sample product together with a label referencing the next tier down — the spread that becomes commission. The bottom tier has nothing below it and carries no such label. **OPEN — the current copy reads backwards:** the label beneath the highest tier names the tier below it in a phrasing that scans as though the higher tier sits underneath. Reword before build.
- **Code-count cell states its meaning.** The top tier reports that no code is needed rather than a count of zero, since Retail is reached by not entering a code; a tier with no codes reports none.
- **Price by tier · sample SKUs.** A supporting card showing several real products priced across every tier, stating that product pages show the same numbers. This is the surface that makes percentages legible as money.
- **How codes and commission work.** An explainer card walking one worked example end to end: a shopper sees the retail price, enters a team code, the price drops to that code's tier, and commission is the spread to the tier below. The card closes by stating that fundraising adds on top of the tier price and reports separately.
- **OPEN — not yet decided, and blocking:** the worked example in the approved design reports **commission of $0** on a sale at the Team / Player tier, where the rule stated two lines above it yields the difference between that tier and Coach & Staff. Either the example is wrong, or commission is not the spread the page says it is. This must be settled before build — every other number on the page depends on which is true.
- **OPEN — to be confirmed:** whether tiers can be **deleted**, and what happens to codes carrying a deleted tier. Deletion changes prices on live stores, so it may be deliberately absent.
- **OPEN — to be confirmed:** whether a tier may be ordered below Base, and whether the floor is enforced by preventing the reorder or by rejecting the resulting price.

##### Epic B — Add and edit a tier

A modal, the same in both modes but for its title and the provenance note.

- **Fields:** **Name**, **Description** (prompting for who the tier is for), and **Discount off retail** as a slider paired with a numeric percentage input — the two bound to one value.
- **Live price preview.** Beneath the control, a sentence resolves a sample product at the current percentage and updates as the admin drags. An admin should never have to compute what a percentage means in dollars.
- **Commit** is disabled until the required fields are populated; Cancel dismisses without writing.
- **Sourced tiers carry a provenance note.** Editing a tier that originated in the connected third-party product source states that its price list comes from there and that edits override it within Team Stores until the next sync replaces them. The note names the source generically; it must not name a specific system.
- **OPEN — to be confirmed, and consequential:** what a sync from the product source actually does to an edited tier. The note says a sync *replaces* local edits, which means an admin's deliberate change can be silently reverted — moving prices and commission across every store carrying that tier. Confirm whether sync overwrites, skips edited tiers, or flags a conflict, and whether the admin is notified. As written this is a silent-data-loss path.
- **OPEN — to be confirmed:** the **rounding rule**, and whether it applies to the displayed price or the charged price. The approved design resolves percentages to whole dollars throughout. If display rounds but the charge does not, the sample card and the product page will disagree with the cart; if the charge rounds, commission must be computed from rounded prices or the spread will not reconcile against the Earnings tab.
- **OPEN — to be confirmed:** whether changing a tier's percentage applies to **live stores immediately**, and what it does to orders already placed. Placed orders must retain the price they were bought at; the question is whether a mid-window change to open carts is acceptable.

##### Epic C — Codes tab

- **Scope:** **every code across every store on the workspace**, which is what distinguishes this view from a store's own Store Codes section. The two read the same records; this one is unfiltered by store.
- **Controls:** a search over codes and store names, a code-type filter, a tier filter, and **Mint pricing code** (Epic D).
- **Columns:** a selection checkbox, the **code**, a **used-for** cell pairing a type badge with the scope it applies to, the **store**, the **pricing tier** as an inline control, and a row overflow menu.
- **Code types are visually distinct.** A **store code** applies store-wide; a **team code** applies to one team and names that team alongside the badge. A store carries one store code and as many team codes as it has teams.
- **Tier is editable in place.** Given any row, when the admin changes the tier control, then that code's tier changes without opening a modal. Because this changes the price every holder of that code pays, the change must be confirmed or reversible rather than silently committed on selection.
- **Bulk selection.** Row checkboxes and a header select-all support acting on many codes at once — the realistic case, since a league store generates a team code per team and they are typically all moved together.
- **OPEN — to be confirmed:** which bulk actions are offered. Re-tiering a selection is the evident one; deletion and export are not shown.
- **OPEN — to be confirmed:** the **uniqueness scope** of a code string. The same code appears against several different stores elsewhere in the product, which implies uniqueness is per store rather than per workspace. Confirm, since it determines what happens when a shopper enters a code that exists in more than one store.

##### Epic D — Mint a pricing code

- **Purpose,** stated in the modal: a code the team hands to a specific group — coaches, boosters, sponsors — where anyone entering it on the storefront sees that tier's prices.
- **Fields:** the **code** itself (minimum four letters or numbers, stated as helper text), the **store** it belongs to, the **pricing tier** it carries, and a **who gets this code** label describing the intended audience.
- **The tier selector names its discount** alongside the tier name, so the admin is choosing a price rather than a label.
- **Commit** is disabled until the code, store, and tier are valid.
- **Default tier.** A new code takes the tier flagged **Default for codes** unless the admin chooses otherwise.
- **OPEN — to be confirmed:** whether a code minted here can be a **team code** or only a store-scoped one. The modal collects a store but no team, while the Codes tab distinguishes the two — which suggests team codes originate with teams rather than here.
- **OPEN — to be confirmed:** validation on collision with an existing code, and whether codes are case-insensitive on entry.

#### Acceptance Criteria

**The ladder**

- Given the Tiers tab, when it renders, then tiers are listed highest price first with each one's discount, resolved sample price, and code count.
- Given a tier with a discount set, when its price resolves, then it equals the retail price reduced by that percentage, and never falls below the Base tier.
- Given the Add tier modal, when the admin moves the discount control, then the sample price updates live.
- Given a tier that originated in the product source, when the admin opens it, then the provenance note is shown and the tier is editable on the same terms as any other.
- Given a non-admin rep, when they reach Workspace Settings, then they cannot create, edit, reorder, or delete a tier, and the restriction is enforced server-side rather than by hiding the control.

**Codes**

- Given the Codes tab, when it renders, then it lists codes from every store on the workspace, each showing its type, scope, store, and tier.
- Given a code, when the admin changes its tier in place, then the code resolves to the new tier and the affected store's own Store Codes section reflects the change.
- Given a store's Store Codes section, when it renders, then it shows only that store's codes, and they are the same records listed here.
- Given the Mint modal, when the code is shorter than the minimum or no store or tier is chosen, then the commit action is disabled.

**Storefront effect**

- Given a shopper with no code, when they browse the storefront, then they see Retail prices.
- Given a shopper who enters a valid code, when it resolves, then they see that code's tier prices across the store.
- Given an order placed at a tier, when commission is computed, then it is the spread between the price paid and the price the tier immediately below would have charged — subject to the blocking OPEN in Epic A.
- Given an item carrying fundraising, when a tier resolves, then the fundraising amount is added on top of the tier price rather than absorbed into it.

### Metrics & Success Criteria

- Share of workspaces adding a tier beyond those that arrive from the product source — the read on whether the ladder needs to be editable at all
- **Share of orders placed at Retail vs. at a coded tier** — the basic read on whether codes are reaching shoppers; a high Retail share means the distribution problem is unsolved, not the pricing one
- Distribution of codes across tiers, and the share left on the default tier — a high default share suggests the tier choice at mint time is being skipped
- **Average commission per order by tier** — the direct read on whether the ladder spacing produces workable margins
- **Tier reorders per workspace** — should be rare. A workspace reordering frequently has a ladder that was set up wrong, and every reorder moves commission
- Inline tier changes on the Codes tab, and how soon after minting they occur — a short interval means the mint modal is not surfacing the right choice
- Attempts to configure a price below the Base floor — should be zero; any occurrence means rule 4 is being enforced too late
- **Product-source syncs that overwrite an admin edit** — the measurable form of the silent-revert risk in Epic B

---

### Dependencies & Technical Constraints

Requires a **workspace-scoped, ordered tier collection**, each tier holding a name, description, discount percentage, explicit order index, a **source provenance flag**, and a **default-for-codes flag** of which exactly one may be set. Order must be a stored property rather than derived from the discount, since the ladder's sequence is what commission reads. The provenance flag records **that** a tier came from an external product source, not **which** one; no behavior may branch on the identity of the source system.

**Price resolution** is retail reduced by the tier percentage, evaluated against the same product prices the storefront and product pages render, so that the sample-SKU card cannot drift from what a shopper sees. The **rounding rule** must be defined once and applied identically to the display price, the charged price, and the commission computation (see the OPEN in Epic B) — three different roundings would make the Earnings tab irreconcilable with the cart.

**Commission depends on the ladder's state at the time of the order, not at the time of reporting.** Because the spread is computed against the adjacent tier, an order must record the tier it was bought at **and the price of the tier below it at that moment**. Without that, reordering or re-pricing a tier would retroactively change commission already earned and reported — including figures already settled in *Earnings*. This is the sharpest constraint the feature introduces and must not be deferred.

**Codes are a single entity with two views.** The workspace Codes tab and a store's Store Codes section read and write the same records, differing only in filter — the workspace view is unfiltered, the store view is scoped to one store. There must be no parallel code table and no sync between the two. Each code holds its string, an audience label, its store, its scope (store-wide or a named team), its tier reference, and a usage count. The **uniqueness scope** of the code string is an open dependency (Epic C).

A code's tier is a **reference to the tier record**, not a copied percentage, so that editing a tier moves every code carrying it. **Storefront resolution** requires code entry to set the shopper's tier for the session and every price surface — product pages, cart, checkout — to read the resolved tier rather than retail. **Fundraising is applied on top of the resolved tier price** and reported separately, consistent with *Product Catalog Management (Products Tab)*, Governing rule 3 and the Fundraising Report in *Store Analytics (Reports Tab)*, Epic D.

The **admin-only restriction** must be enforced server-side on every write — tier creation, edit, reorder, deletion, code minting, and inline re-tiering — because a tier change moves prices across every store on the workspace and hiding a control is not access control.

The **third-party product source integration** supplies the initial tiers and continues to sync. It is a **client-dependent integration**: which system a given client runs is a deployment detail, so the integration must be modelled behind a generic interface and no tier behavior, label, or stored value may hard-code a particular vendor. Its behavior against locally edited tiers is an open dependency (Epic B) and must be resolved before build, since the specified behavior as written permits an admin's pricing decision to be silently reverted by a scheduled job.

Downstream, the tier and its rate are consumed by *Earnings* → Store code performance, which reports gross sales, fundraising, and commission per identity code and names each code's tier and percentage. That surface must read the same tier records rather than its own copy.
