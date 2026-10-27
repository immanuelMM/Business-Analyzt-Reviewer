---
title: Stock Vault
confluence_id: 4275109889
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4275109889/Stock+Vault
last_modified: 2026-10-19
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

Most of what a rep puts in a team store is not a fully custom garment. It is a blank — a hoodie, a tee, a jogger — carrying the team's logo. Routing those through the brand customizer is disproportionate: the rep does not want to design a garment, they want to pick one off the shelf and put a mark on it. At the same time these blanks cannot be an open catalog. They are physically stocked goods with known cost, color availability, and print geometry, and the artwork editor can only place a logo on an item whose printable area is known. Letting reps add arbitrary items would break both the supply assumption and the decoration path.

#### The Solution

**Stock Vault** — a workspace-level collection of blank, decorable items provisioned by Prolook. Every user's vault is seeded with Prolook's **Pro Stock** and **Sideline Stock** lines. From the vault a rep can add an item to one or more existing stores, select several items to stand up a new store, or open an item in the Team Artwork builder to place a logo. Users cannot add items to their own vault; additions are requested and provisioned by Prolook, including when Prolook acts on a client's behalf.

### Governing rules

These four constraints are the point of the feature and should not be relaxed without revisiting it.

1. **The vault is Prolook-provisioned.** There is no user-facing path to add an item. Reps request additions; Prolook fulfills them. This holds even when the request originates with a client and Prolook is acting for them.
2. **Stock Vault items are the only artwork-eligible items.** The Team Artwork builder operates on vault items and nothing else, because only vault items carry the print geometry the builder requires. Items sourced from the brand customizer, saved designs, or other stores are not eligible.
3. **The vault sits above stores, not inside one.** It is scoped to the user's workspace. Adding an item to a store places a copy in that store's catalog; the vault entry is unchanged and remains available to every other store.
4. **Vault pricing is the stock list price, not the store price.** Prices shown on a vault card are the baseline Adult/Youth figures. Per-store pricing, team settings, sizes, and My Team(s) assignment are set in the store's catalog (*Product Catalog Management (Products Tab)*).

### Scope boundary

This spec covers the vault browse page, the Add to Store flow, store creation from the vault, and Stock Vault settings. The **Team Artwork builder** — logo upload, printable-area placement, size and rotation, per-color-way tuning, and the source-placement propagation model — is a substantial surface in its own right and is specified separately. This page defines only the entry points into it.

### User persona & use cases

**Who is this for?** Reps building and stocking team stores. Prolook staff provision vault contents but do not act inside these screens.

**Scenarios encountered** Adding a hoodie to a store that already exists; adding the same item to several stores at once ahead of a season; picking a handful of blanks and standing up a new store from them; narrowing an item to the two color ways a team actually wants before it reaches the catalog; opening an item in the artwork builder to place a team logo; turning on auto-add so every new store starts with the full vault; asking Prolook for a garment the vault does not carry.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want a curated set of blanks available across all my stores, so that I can stock a store without designing anything.
- As a rep, I want to add one item to several stores in a single pass, so that I am not repeating the same work per store.
- As a rep, I want to choose which color ways carry through to a store, so that a team sees only the colors that match them.
- As a rep, I want to select several vault items and start a new store from them, so that a new store begins with a catalog rather than empty.
- As a rep, I want every new store to start with the full vault when I choose, so that I am not re-adding the same staples each time.
- As a rep, I want to ask for an item the vault does not carry, so that the collection reflects what my teams actually order.
- As a rep, I want to see at a glance what a vault item costs and how many color ways it offers, so that I can judge fit before opening it.

##### Epic A — The vault page

- **Placement.** Stock Vault is a **workspace-level** destination, reached outside any individual store.
    - **It is not a navigation tab.** The workspace navigation carries **Overview, Stores, and Earnings** only. The vault was briefly specified as a third nav tab and is no longer — see *Workspace*, the October 19, 2026 amendment.
    - **The account menu is the sole entry point.** Given the workspace header, when the rep opens the **account menu** under their avatar and selects **Stock Vault**, then this page opens in the same tab (*Workspace*, Epic D). There is no other route to it from the workspace.
    - **Only the route moved.** Nothing on this page changes as a consequence — the line toggle, the grid, Add to Store, and the start-a-store flow are all unaffected. The demotion reflects how the vault is used: a library consulted while stocking a store, not a working view switched between several times a session.
- **Header.** The page title is followed by a count of total styles across both lines (*19 stock styles* against the current default contents).
- **Line toggle.** A segmented control switches between **Pro Stock** and **Sideline Stock**, each carrying a count badge of the styles in that line. One line is shown at a time; Pro Stock is the default.
- **Selection panel.** The grid sits in a panel headed **SELECT AN ITEM**, with a right-aligned line stating how many stock items are on file for the active line and that selecting several starts a new store (Epic C).
- **Grouping.** Items are grouped under headings naming the line and gender — *Pro Stock (HCM) — Men's*, *Pro Stock (HCM) — Women's*, and the equivalents for Sideline Apparel (QXX).
- **Card anatomy.** Each card shows the garment image, the style name, a metadata line giving **sizing availability and color-way count** (*Men/Youth · 8 color ways*), and a price line giving **Adult and Youth** list prices. Where a style carries no youth sizing — true of most Sideline items and the women's Tapered Jogger — the card shows adult sizing and the Adult price only, and must not render an empty or zero Youth figure.
- Given the vault page, when the rep clicks a single card, then the **Add to Store** modal opens for that item (Epic B).

##### Epic B — Add to Store

A modal that places a vault item into one or more existing stores.

- **Item header.** The modal leads with the garment image, the style name, and an identifier line giving **SKU · base color · line** (e.g. *HCM-SSC-M · Black · ProStock*).
- **Color ways offered.** A labelled grid of every color way the style carries, each a selectable tile with a swatch, the color name, and a check state. **All color ways are selected by default**, with a running *n of n selected* count and a **Clear** action.
- **What the selection means.** Explanatory copy states that the item lands in the store's catalog and that **pricing, team setting, sizes, and My Team(s) assignment are confirmed there** — the modal is a placement step, not a configuration step.
- **Store picker.** A searchable, multi-select list of the rep's stores. Each row shows the store's avatar, its name, and a metadata line giving **store name · status · product count**, so a rep can tell an Active store from a Draft one and see how stocked it already is. Both Active and Draft stores are selectable.
- **Commit.** The primary **Add to Store** action is **disabled until at least one store is selected**. Cancel and a header close control both dismiss without writing.
- **Customize.** A **Customize** action in the modal footer opens the item in the Team Artwork builder. **OPEN — to be confirmed:** whether Customize commits the add first and then opens the builder, or carries the staged item and color-way selection into the builder and commits on return. The two produce different recovery behavior if the rep abandons the builder.
- **OPEN — to be confirmed:** whether the color-way selection applies uniformly to every selected store, or is resolved per store. Uniform is the simpler model and matches the single selection control shown; per-store would require the modal to restructure.
- **OPEN — to be confirmed:** whether zero selected color ways is a valid commit. **Clear** can take the selection to none, which would place an item with no purchasable variant.

##### Epic C — Start a new store from the vault

- Given the vault page, when the rep selects **more than one** item, then the flow shifts from Add to Store to **new store creation**, seeded with the selected items.
- The selection panel advertises this behavior in its header line, so multi-select is discoverable rather than incidental.
- The selected items are carried into store creation and land in the new store's catalog, where each is configured through the standard per-item configuration modal (*Product Catalog Management*, Epic A).
- **OPEN — to be confirmed:** where the handoff lands. Store creation is a multi-step flow with its own Step 2 – Products; the selected items could seed that step and let the rep continue adding, or bypass it. The former is consistent with the existing creation flow.
- **OPEN — to be confirmed:** how color ways are resolved for items seeded this way, given the Add to Store modal — where color ways are chosen — is not part of this path.
- **OPEN — to be confirmed:** whether multi-select spans the Pro Stock and Sideline Stock lines, or is confined to the active line.

##### Epic D — Stock Vault settings

- **Auto-add to every store.** A workspace-level setting makes **all vault items add to every store by default**, so a rep who always stocks the full vault does not re-add it per store.
- **OPEN — to be confirmed, and blocking:** the scope of auto-add. Three questions have to be answered together. Does it apply only to stores created after it is switched on, or retroactively to existing stores? Does it add **all** color ways of each item, or a default one? And can a store remove an auto-added item, or does the setting re-assert it? Retroactive application against existing stores is the risky case — it could add dozens of items to stores a rep considers finished.
- **Requesting additional items.** A rep can ask for vault items the collection does not carry. **OPEN — not yet decided:** whether this is an in-app request form inside Stock Vault settings, a route to their Prolook rep outside the product, or something else. Whichever is chosen, Governing rule 1 holds — the request produces a Prolook action, never a direct write to the vault.
- **OPEN — to be confirmed:** where Stock Vault settings live — a section of the vault page itself, or workspace-level settings alongside other account configuration. Now that the vault itself is reached from the account menu rather than the navigation, placing its settings in **Workspace Settings** would keep both on the same route; a section of the vault page keeps the setting next to the thing it governs. Either is defensible; it should be decided rather than left to fall out of implementation.

#### Acceptance Criteria

**Reaching and browsing the vault**

- Given the workspace header, when the rep opens the account menu and selects Stock Vault, then this page opens in the same tab.
- Given the workspace navigation, then no tab leads to the Stock Vault — the tabs are Overview, Stores, and Earnings.
- Given the Stock Vault page, when it loads, then the Pro Stock line is shown by default and the toggle reports the style count for each line.
- Given the Sideline Stock toggle, when the rep selects it, then the grid, the group headings, and the on-file count all re-scope to that line.
- Given a style with no youth sizing, when its card renders, then only adult sizing and the Adult price are shown.

**Adding to a store**

- Given the vault grid, when the rep selects a single item, then the Add to Store modal opens with every color way pre-selected and the count reading *n of n selected*.
- Given the modal, when no store is selected, then the Add to Store action is disabled.
- Given one or more selected stores, when the rep confirms, then a copy of the item carrying the selected color ways is placed in each store's catalog, and the vault entry is unchanged.
- Given an item added to a store, when the rep opens it in that store's catalog, then pricing, team setting, sizes, and My Team(s) assignment are configurable there.
- Given the store picker, when the rep types in the search field, then the list filters to matching stores while preserving any selections already made.

**Creating a store from the vault**

- Given the vault grid, when the rep selects two or more items, then the action available to them is new store creation rather than Add to Store.
- Given a new store created this way, when it is first opened, then the selected items are present in its catalog awaiting configuration.

**Vault governance**

- Given any surface in the product, when a rep looks for a way to add an item to their own vault, then none exists.
- Given an item that did not originate in the Stock Vault, when the rep attempts to open it in the Team Artwork builder, then the builder is unavailable for that item.

### Metrics & Success Criteria

- Share of stores containing at least one Stock Vault item — the basic read on whether the vault is how stores get stocked
- **Vault visits per rep per month, before and after the move out of the navigation** — the direct test of whether reaching it from the account menu costs reps anything. A material drop alongside stores still being stocked would mean the route is too quiet
- Add to Store completions, and the share committing to **more than one store** at once — the multi-select exists to save repeated work; if it goes unused it is not earning its complexity
- Stores created from a multi-item vault selection, against stores created empty
- **Color-way deselection rate** — if reps routinely strip an eight-way item down to two, the default-all behavior is wrong and the modal is making work rather than saving it
- Auto-add adoption, and whether stores created under it are later pruned — pruning would indicate the setting adds more than reps want
- **Item-addition requests per period, by garment** — the clearest demand signal for what the vault should carry next
- Share of vault items that ever reach the artwork builder — the decoration path is the vault's reason for existing

---

### Dependencies & Technical Constraints

Requires a **workspace-scoped vault record** per user, seeded at account creation with the Prolook default collection, and a **Prolook-side provisioning path** to add items to an individual vault. There is deliberately no user-facing write path; the absence of one is a requirement, not an omission, and the provisioning tool is internal.

Each stock item must carry **SKU, line (Pro Stock / Sideline), gender, the full set of color ways with swatch values and display names, adult and youth list pricing with an explicit no-youth-sizing state, and size availability**. Items must additionally carry **print geometry** — printable area dimensions and print locations per view — because artwork eligibility under Governing rule 2 depends on it; an item without print geometry cannot be a vault item.

The page is routed from the **account menu** rather than the workspace navigation (*Workspace*, Epic D), so it requires a workspace-level route that is addressable and deep-linkable but absent from the tab set. Nothing else about the page depends on how it is reached.

The store picker requires a store-list service exposing **name, status, and product count** per store. Adding an item **copies** it into the store catalog rather than referencing the vault entry, so later changes to a vault item do not retroactively alter items already placed in stores — and conversely, a store-level price or size change never writes back to the vault. Placed items are configured through the standard per-item configuration modal (*Product Catalog Management (Products Tab)*, Epic A) and are subject to that spec's commercial lock rules once ordered.

Auto-add requires the setting to be stored at workspace level and evaluated during store creation, and — depending on how the blocking OPEN in Epic D resolves — potentially a backfill path against existing stores with a corresponding undo. An **artwork-eligibility flag** derived from vault membership gates entry to the Team Artwork builder and must be enforced server-side, not only by hiding the entry point.

---

### Appendix — Default vault contents

The collection every user's vault is seeded with. Color-way codes: B=Black, W=White, SG=Silver Gray, FG=Forest Green, M=Maroon, R=Red, NB=Navy Blue, RB=Royal Blue, DT=Detroit Gray, SL=Slate Gray, HT=Heather Gray, KH=Khaki.

#### Pro Stock (HCM) — Men's

- Scuba Hoodie (B, SG, FG, M, R, NB, RB, DT) — Adult $92 · Youth $82.80
- Short Sleeve Scuba Hoodie (B, SG, FG, M, R, NB, RB, DT) — Adult $92 · Youth $82.80
- Full Zip Scuba Hoodie (B, DT, NB) — Adult $86 · Youth $79
- Raglan Long Sleeve (B, W, SG, FG, M, R, NB, RB, DT) — Adult $36.80 · Youth $34.50
- Raglan Short Sleeve (B, W, SG, FG, M, R, NB, RB, DT) — Adult $32.20 · Youth $29.90
- Woven Short (B, DT) — Adult $43.70 · Youth $40.25
- Tapered Jogger (B, DT, NB) — Adult $92 · Youth $82.80

#### Pro Stock (HCM) — Women's

- Scuba Hoodie (B, SG, FG, M, R, NB, RB, DT) — Adult $92 · Youth $82.80
- Full Zip Scuba Hoodie (B, DT, NB) — Adult $86 · Youth $79
- Raglan Long Sleeve (B, W, SG, FG, M, R, NB, RB, DT) — Adult $36.80 · Youth $34.50
- Raglan Short Sleeve (B, W, SG, FG, M, R, NB, RB, DT) — Adult $32.20 · Youth $29.90
- Woven Short (B, DT) — Adult $43.70 · Youth $40.25
- Tapered Jogger (B, DT, NB) — Adult $92 · *no youth sizing*

#### Sideline Apparel (QXX) — Men's

- 1/4-Zip Sideline Pullover (B, HT, R, RB, NB) — Adult $81.78 · *no youth sizing*
- Sideline Polo (W, B, R, RB, NB, SL) — Adult $74.11 · *no youth sizing*
- Sideline Pant (B, SG, KH) — Adult $102.35 · *no youth sizing*
- Sideline Short (B, SG, KH) — Adult $89.44 · *no youth sizing*

#### Sideline Apparel (QXX) — Women's

- 1/4-Zip Sideline Pullover (B, HT, R, RB, NB) — Adult $81.78 · *no youth sizing*
- Stock Legging (B, R, RB, NB) — Adult $58.78 · Youth $58.78
