# Claude Design prompt — "Use as Template"

Paste everything below the line.

---

Build **Use as Template** for the Prolook Team Stores workspace: a way for a rep to start a new store from a store that already exists, instead of building it again from scratch. The main case is a rep opening next season's store from last season's.

**Build only what this brief specifies. If something seems missing, ask — do not invent it.**

## This is not a template library

There is **no template object, no saved templates, no template management screen**. The source is always a real store in the rep's list. "Template" is what the rep *does* with a store, not a thing they create and keep.

This matters because a separate template entity existed in this product and was removed in August 2026. Don't rebuild it. Specifically: no "Save as template", no template gallery, no template picker, no "My templates" anywhere.

## Both paths are the same flow

The simplifying idea of the whole feature. **Both options put the rep into store creation and land them on Review & Deploy**, with every earlier step filled in and freely navigable. They differ only in how much arrives pre-filled:

| | Pre-filled | Rep fills in |
| --- | --- | --- |
| **Duplicate the whole store** | Branding, products, league structure, settings, fundraising, and managers if the rep opts in | Rosters, schedule, URL, anything they want to change |
| **Use only the products** | Products | Everything else |

One flow, two starting densities. Build it once.

## Vocabulary

| Use | Never |
| --- | --- |
| Draft / Open / Closed / Archived | Active, On Hold, Paused |
| Players | Members |
| Point of Contact | Primary, Primary Contact |
| Visible *(a product customers can see)* | Published |

Never build a completion percentage, readiness score, or progress meter.

---

## Entry point

**Use as Template** sits in the overflow menu on a store card in the store list.

**Available on any store the rep can see — their own and other reps' stores.** Reusing a colleague's well-built store is a legitimate and valuable case.

Available in **any** state: Draft, Open, Closed, Archived. The highest-value source is a **Closed** store from last season, so that case must work, not merely be permitted.

When the source belongs to another rep, say so in the modal. A rep should never be unclear about whose store they're copying. **The source's owner is not notified and sees no record of the copy** — don't design anything on their side.

---

## The choice modal

Two options as selectable cards rather than a dropdown — the difference between them is the whole decision and the rep needs to see both at once.

**Each option states what comes across and what doesn't.** This is the most important copy in the feature. A rep who guesses wrong either rebuilds branding they thought they'd copied, or assumes a roster came along that didn't.

### Option 1 — Duplicate the whole store

> Products, branding, settings, and your league's divisions and teams come across. **Players don't** — every team starts with an empty roster. You'll land on the final review step with everything else filled in.

*(On an Individual Team store, drop the divisions-and-teams clause.)*

### Option 2 — Use only the products

> Just the product catalog. You'll set up branding, structure, rosters, and settings yourself.

The modal names the source store, and its owner when that isn't the current rep.

Nothing is created until the rep confirms.

---

## Path A — Duplicate the whole store

### What copies

Products with their pricing, decoration, and visibility · team logo and colors · store theme color · **divisions and teams on a League store** · per-team product assignments · fulfillment and distribution settings · fundraising configuration · announcement message · the store's **team binding** in the Team Database.

**Structure copies; players don't.** A division and a team carry no personal data, and they're most of a league rep's setup work — three divisions and twelve teams rebuilt by hand is the thing this feature exists to avoid. Per-team product assignments can copy precisely because both the teams and the products are present. Every team arrives with an empty roster.

### What must not copy

As important as the list above, and some of it isn't obvious:

- **Player records.** No rosters come across, on either store type. A new season has new players, and last season's names and contact details don't belong in a store those players haven't ordered from.
- **Orders, order history, and Roster Bank captures.** The new store has no sales.
- **Portal access and invites.** Where a manager record copies, their **access to the new store does not**. Access is granted only by explicit invite in Settings → People & Access, per store. Duplicating entitlements would silently hand someone reporting and roster access to a store nobody meant to share — a larger risk now that another rep's store can be the source.
- **The storefront URL.** Slugs are unique; the new store gets its own.
- **The ordering window dates.** Last season's close date on this season's store is a defect waiting to happen. Leave the schedule unset.
- **Store status.** The new store is always **Draft**, whatever the source was.

### Managers are an explicit choice, not an assumption

The confirmation step asks whether to bring the manager records across, **listing them by name** rather than offering an abstract toggle:

> **Copy managers?**
> ☐ Dana Whitfield · dana@ncbl.org
> ☐ Marcus Lee · marcus.lee@ncbl.org
>
> Copying a manager creates a contact record only — it does not grant them access to the new store.

Naming them makes the decision concrete. "Copy managers" as a bare checkbox gets accepted without thought; "Copy Dana Whitfield and Marcus Lee" gets considered.

**Default checked when the rep owns the source store, unchecked when they don't.** Duplicating your own store for a new season usually means keeping the same coach. Copying a colleague's store usually means you want their catalog and branding, not their contact list.

The access disclaimer stays visible whatever the state, and uses that wording — it's the same sentence used elsewhere in the product, and this is exactly the moment a rep assumes they've just given someone access.

### The team binding copies, so make it visible

The new store points at the **same team** in the Team Database as the source. That's usually right for a new season — and wrong whenever a rep is copying a colleague's store to build one for a different team.

It's the rep's job to notice and change it. **The design's job is to make noticing easy.** Show the bound team on Review & Deploy as a named, editable field with the team's logo beside it, not buried in a settings summary. A rep who duplicated a colleague's store and shipped it under that colleague's team has had a bad day this field prevents.

### Naming

Defaults to the source store's name with **Copy** appended — *North County Baseball League Copy*. If that name exists, increment: *Copy 2*, *Copy 3*. Never create two stores with the same name silently.

**Editable in the confirmation step, before anything is created.** A rep duplicating last season's store almost always wants "2026 Season", not "Copy", and renaming afterward is worse than offering the field once.

### Confirmation

One step showing the new store's name (editable), the source and whose it is, the manager choice above, and a short summary of what's coming across. Include one line on the three things that don't: **players, orders, and portal access**.

### Working state

An indeterminate progress state while the store is built, in plain language.

**Don't fake a percentage or a step-by-step checklist.** If the operation can't report true progress, an invented bar is a lie the rep catches when it stalls at 80%. "Setting up your new store — this takes a few seconds" is better.

Design a **failure state**. Copying a large catalog and a full league structure is exactly the operation that times out. If it fails: say so plainly, say whether anything was created, and offer a retry. A spinner with no exit is the worst outcome here.

### Landing

The rep lands on **Review & Deploy**, with the stepper complete and clickable. Going back to Basics to change the name, the team, or the branding is one click, and returning loses nothing.

On a League store, the league configuration step arrives **pre-filled with the copied divisions and teams, each roster empty** — so a rep can adjust the structure before deploying without rebuilding it.

Review & Deploy states what still needs attention before the store can deploy: the schedule is unset, the URL needs confirming, rosters are empty. **Phrase this as deploy requirements, not a setup checklist.** It's a gate on one action, not a score on the store. Empty rosters are worth naming but must not read as an error — rosters are optional in this product and a store can launch without them.

---

## Path B — Use only the products

Store creation with the product step already satisfied by the source catalog. **Nothing else comes across — including the league structure**, which is why a league store still needs its configuration step here.

### Routing

**Individual Team store**
`Basics → Review & Deploy`
*(Add Products is skipped — the catalog came from the source store)*

**League store**
`Basics → League configuration → Review & Deploy`
*(League configuration defines divisions and teams, which don't come from a product catalog, so it's never skipped)*

### Renumber the stepper

**The rep must never see "Step 1" followed by "Step 3".** A gap reads as something broken or skipped by mistake.

Number what the rep will actually do: **1 of 2** and **2 of 2** for an Individual Team store, **1 of 3** through **3 of 3** for a League store. Path A uses the same numbering.

### Show the provenance

A quiet persistent line through the flow naming where the products came from — *"Products from North County Baseball League"* — with a count, and the owning rep when it isn't the current one. The rep chose this path deliberately; confirmation that it worked belongs in front of them, not at the end.

### Review & Deploy

Lists the inherited products in full, with a route to edit or remove before deploying. Since the rep never saw an Add Products step, this is their **first and only** chance to check what came across. Treat it as a real review, not a summary line.

---

## Edge cases to design

- **A source store with no products**, where the rep picked products-only. Say so in the modal and don't offer that option.
- **An Archived source.** Archived stores are read-only, but reading is all this does. Make sure the menu item isn't disabled along with everything else on an archived card.
- **A source with no managers.** The manager question doesn't render at all — don't show an empty checklist.
- **A League source used for products only.** The catalog copies; divisions, teams, and per-team product assignments don't. Say so in the option copy so a league rep doesn't expect their structure to survive this path.
- **Another rep's store as source.** The new store belongs to the rep who created it. Make ownership unambiguous on Review & Deploy.
