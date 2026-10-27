# Claude Design prompt — Marucci reskin of the Team Stores Workspace - Third Party Integration file

Attach the image files alongside this prompt, then paste everything below the line.

---

Reskin the **Team Stores Workspace - Third Party Integration** file so it reads as a **Marucci** account. This is a data and branding pass, not a redesign.

## Scope

**Every instruction below applies to the Team Stores Workspace - Third Party Integration file and to no other file.** Every other file in this project stays exactly as it is.

**Nothing about the product changes** — no layouts, no components, no flows, no copy, no labels, no spacing. The same screens, with a different client's name, logo, and catalog in them. If a change seems to require moving or restyling something, stop and ask.

### The shared-component trap

The workspace header, the left nav, and the user avatar are likely **shared components used by other files in this project**. Editing a shared component changes every file that uses it, which is the one outcome this brief is trying to avoid.

Before changing anything in those areas, check whether it's an instance of a shared component. If it is, **detach the instance inside the Team Stores Workspace - Third Party Integration file** or override at the instance level — don't edit the main component. When finished, open a different file in the project and confirm it still shows the original branding.

---

## 1 — Rename the seed user

**Hingle McCringleberry → Jack White**, everywhere in the Team Stores Workspace - Third Party Integration file.

This is a sweep, not one edit. Search the whole of the Team Stores Workspace - Third Party Integration file and check each place the name can appear:

- The account menu and any profile area
- **Avatar initials — HM becomes JW**, which is easy to miss because it isn't the text you searched for
- Any greeting or welcome line
- Activity or recent-work rows attributed to the user
- Manager or contact records, if the seed data used the same name
- Order rows, if the seed data used it as a buyer
- Email addresses built from the name — if one reads `hmccringleberry@…`, it becomes `jwhite@…`

Keep the format of whatever you replace. If the seed data shows "Hingle M." somewhere, it becomes "Jack W.", not the full name.

---

## 2 — Load the attached images into the Stock Vault

Every attached image becomes an item in the **Stock Vault** in the Team Stores Workspace - Third Party Integration file.

- **Name each item from its filename**, cleaned up and title-cased — `marucci_cat9_bat.png` becomes *Cat9 Bat*. Strip extensions, underscores, and brand prefixes where the brand is already implied
- **Match the existing item structure exactly.** Use the same card layout, the same fields, the same image treatment and crop as the Stock Vault items already in the Team Stores Workspace - Third Party Integration file. Don't add fields the vault doesn't already show
- Where the vault shows a price, SKU, colorway, or category, use plausible values consistent with the existing seed items. Keep them obviously placeholder-ish rather than precise — this is a prototype, and a specific wrong price is worse than an approximate one
- **Replace the existing seed vault items** rather than adding to them. Leaving non-Marucci product in a Marucci account undercuts the whole illusion. If any existing item should survive, tell me which and I'll say

Use the term **Stock Vault**. Not "Product Vault" — that name was retired.

---

## 3 — Workspace header logo

Replace the logo in the workspace header with the attached **Marucci "M"** mark.

- **In the Team Stores Workspace - Third Party Integration file only.** See the shared-component note above
- Fit it to the existing logo's container and clear space. Don't resize the container, don't change the header's height or layout
- Don't recolor, stretch, crop, outline, or add effects to the mark. Use it as supplied
- If the header has a dark background and the supplied mark doesn't read against it, stop and ask rather than inverting it yourself

---

## 4 — Two customizers available

In the Team Stores Workspace - Third Party Integration file, the user should appear to have access to **both** the **Prolook** brand customizer **and** the **Victus** customizer, with the attached Victus logo.

- Show Victus as **already connected and usable**, sitting alongside Prolook as a peer. Not a "Connect" prompt, not a locked or upsell state — this account has it
- Wherever the Team Stores Workspace - Third Party Integration file currently presents a single customizer, that becomes a choice between two. Follow whatever selection pattern that file already uses for picking between sources; don't invent a new one
- Each option carries its brand mark and name
- If the Team Stores Workspace - Third Party Integration file has a **Catalog & Decoration** area in Settings, Victus should appear there as an enabled third-party vendor too, so the two places agree

Use the term **Customizer**. Not "Brand Catalog" — that name was retired.

---

## 5 — Replace the stores

The Team Stores Workspace - Third Party Integration file should contain **exactly two stores**, replacing whatever seed stores are there now. Both are:

- **League** stores, not Individual Team
- **Open** — the storefront is live and taking orders
- **Baseball**

**Use the word Open, not Active.** The product's four store states are **Draft, Open, Closed, Archived**. "Active" is a retired label that still lingers in older seed data and one stale spec page, and it has leaked into a prototype before. If the Team Stores Workspace - Third Party Integration file currently shows "Active" anywhere, that's a bug to fix while you're in there.

### Waiting on details

Store names, logos, and league structure — divisions and teams — are coming separately. Until they arrive:

- Build the two stores with **obvious placeholder names and marks**, clearly temporary rather than invented-and-plausible. A placeholder that looks like a real decision gets left in
- Keep the league structure shallow but real: a couple of divisions with a few teams each, enough that the structure panels, team pickers, and per-team views have something to render
- Everything else — order counts, totals raised, close dates, roster sizes — should be plausible seed data consistent with two live baseball leagues

### Knock-on effects to check

Replacing the stores reaches further than the store list:

- **Every screen that shows an Individual Team store breaks.** If the Team Stores Workspace - Third Party Integration file has screens built on a single-team store — the **My Team** singular nav label, a store with no division tier, a roster with no team picker — those have no store to belong to once both stores are League. Find them and tell me what you find before changing them
- The store switcher, any "Back to Stores" destination, and any store directory all need to show the same two stores
- Reports, orders, and roster screens that name a store need to name one of the two
- Both stores being League means **My Teams** (plural) throughout, plus division and team structure wherever the workspace shows it
- Baseball should be consistent in the catalog, which sits well with the Marucci and Victus product already going into the Stock Vault

---

## Check before you finish

- Open a different file in the project. If its branding or user name changed, a shared component was edited — undo, and redo that change as an instance override inside the Team Stores Workspace - Third Party Integration file
- Search the Team Stores Workspace - Third Party Integration file for "Hingle" and "McCringleberry". Zero results
- Search it for "HM" as avatar initials. Zero results
- No non-Marucci product images remain in its Stock Vault
- Prolook and Victus both appear as available customizers, neither in a connect or locked state
- Exactly two stores exist, both League, both Open, both Baseball
- The word "Active" appears nowhere as a store state
- No screen still depends on an Individual Team store

---

## One thing to confirm

**Should the theme and team colors change too?** The brief covers the Marucci mark and the two stores. If the Team Stores Workspace - Third Party Integration file still carries another brand's theme color and team colors underneath a Marucci logo, it will read as half-finished to anyone looking at it. Worth deciding alongside the store logos that are coming.

## Note on the brand assets

Marucci and Victus marks are real trademarks. They're fine in a client prototype, which is what this is — just keep them inside the Team Stores Workspace - Third Party Integration file and use them unmodified. If a mark needs altering to fit, the container is the thing to adjust, not the mark.
