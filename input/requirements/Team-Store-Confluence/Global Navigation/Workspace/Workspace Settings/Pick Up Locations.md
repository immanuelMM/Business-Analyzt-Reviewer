---
title: Pick Up Locations
confluence_id: 4380065805
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4380065805/Pick+Up+Locations
last_modified: 2026-10-12
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

A store set to **Ship to Team Manager** needs somewhere for the bulk shipment to go, and today that destination is typed by hand, one store at a time. A rep who runs a dozen stores that all ship to the same place retypes the same address a dozen times, and a typo in any one of them becomes a freight problem discovered at order submission rather than at setup. There is no shared record of the places a rep actually ships to, so nothing accumulates: the eleventh store is no easier to set up than the first, and the addresses drift apart as they are re-entered.

#### The Solution

**Pick-up Locations** — a workspace-level list of saved destinations, managed in Workspace Settings. Each location carries a name, a street address, opening hours, and pick-up instructions. When a store is set to Ship to Team Manager, the rep selects a saved location instead of typing an address. Defined once, available to every store on the workspace. Typing an address by hand remains available for one-off destinations.

### Governing rules

1. **A pick-up location is a destination for Ship to Team Manager and nothing else.** It is where the bulk shipment goes. A store on Direct-To-Home Residential Delivery never references one, because every order on that store ships to its own buyer.
2. **Created at workspace level, chosen at store level.** Locations are defined once in Workspace Settings and are available to every store. Nothing here turns pick-up on for a store; each store chooses its own destination in its own Settings.
3. **Selecting a location and typing an address write the same field.** Both resolve to the store's ship-to destination — the single field shared by Step 1 Epic F, Settings → Distribution & Fulfillment, and the pending-order freight gate. A saved location is an input method, not a second address.
4. **Saved locations never remove the manual option.** A rep with a one-off destination types it, exactly as today. Having locations on file must never become a requirement to use one.

### Scope boundary

This spec owns the **management** of pick-up locations: the Workspace Settings section, the add and edit modals, and the availability toggle. **Selecting** a location for a store is owned by the two surfaces where the ship-to destination is set — *Step 1 — Basics*, Epic F during store creation, and *Store Settings (Settings Tab)*, Distribution & Fulfillment afterward. This page defines what exists to be chosen; those pages define the choosing.

### User persona & use cases

**Who is this for?** Reps and admin reps who set up stores and own where bulk freight lands.

**Scenarios encountered** Saving the dealership's own address once so every store can ship there; adding a school's athletic office as a destination for the four stores that program runs; correcting a suite number on a saved location and having every store that uses it pick up the fix; setting hours so the front desk is not receiving freight on a Sunday; writing instructions telling whoever collects the shipment where to ask; retiring a location the dealership no longer occupies; setting up a store whose destination is a one-off address and typing it by hand instead.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want to save the addresses I ship to, so that I am not retyping the same destination for every store.
- As a rep, I want to correct a saved address once, so that every store using it is corrected too.
- As a rep, I want to record hours and instructions with an address, so that whoever receives the shipment knows when and where.
- As a rep, I want to see how many stores depend on a location before I change or retire it, so that I do not break freight for stores I have forgotten about.
- As a rep with a one-off destination, I want to type an address directly, so that saving a location I will never reuse is not forced on me.

##### Epic A — The Pick-up Locations section

- **Placement.** A section of **Workspace Settings**, in the left sub-nav alongside User Management, Emails, Integrations, Product Categories, and Pricing Tiers. The page header states that Workspace Settings apply across every store and that store-specific settings live in each store's Settings tab.
- **Section header.** A title, a description of what a location is and how stores use it, and an **Add location** action at the right.
- **Location cards.** Each saved location renders as a card carrying: a location icon, the **location name**, an **availability badge**, the full address on one line, the **hours** as day-range and time pairs, the **pick-up instructions**, a usage line stating how many stores use it, an **availability toggle**, and an **Edit** action.
- **The usage line is the safety mechanism.** A rep editing or retiring a location needs to know what depends on it before acting, since the consequence lands on stores they are not currently looking at.
- **OPEN — to be confirmed:** the empty state. A workspace with no locations saved should say what a location is for and point to Add location, rather than rendering an empty section.
- **OPEN — to be confirmed:** whether every rep can manage locations or only admin reps. Because a change here propagates to stores owned by other reps, this is an access question rather than a cosmetic one.

##### Epic B — Add and edit a location

A modal, identical in both modes but for its title and commit action.

- **Fields:** **Location name**, **Street address**, and **City / State / ZIP** on one row.
- **Hours:** a repeatable row pairing a **day range** with a **time range**, each row individually removable, with an **Add hours** action appending another. A day range may be set to closed rather than carrying times.
- **Pick-up instructions:** a free-text field with helper copy naming where the text appears.
- **Commit:** the primary action is **disabled until the required fields are populated**. Cancel dismisses without writing.
- **Edit mode** opens the same modal titled with the location's name, pre-populated, committing with **Save**.
- **Edits propagate.** Given a location used by stores, when the rep saves a change, then every store referencing it resolves to the updated address. This is the reason the feature exists and must not be implemented as a copy taken at selection time.
- **OPEN — to be confirmed:** which fields are required. Name and street address are evidently required; whether a location can be saved without hours or instructions is not stated by the design.
- **OPEN — to be confirmed:** whether the day and time controls are selects or free text. The approved design shows values that read as free text, which would let two locations express the same hours differently and would make hours unusable by any downstream logic.
- **OPEN — to be confirmed:** the pre-filled **State** value in the add modal — whether it derives from the workspace's own address or is a seeded placeholder.
- **OPEN — to be confirmed:** whether a location can be **deleted** as distinct from switched off. The approved design offers no delete affordance, which may be deliberate — retiring by toggle preserves the record for stores that have historical orders against it.
- **OPEN — to be confirmed:** whether the address is verified against a map service on save. The ship-to destination is already subject to backend verification at the freight gate (*Step 1 — Basics*, Epic F), so verifying here would catch a bad address at the point it is entered rather than at submission.

##### Epic C — Availability toggle

- **On:** the location is available to stores and the card carries an availability badge.
- **Off:** the location is **removed everywhere immediately, including from stores already using it**. It is not merely hidden from future selection.
- **This is a destructive action and must be presented as one.** A store whose destination was that location is left with **no ship-to destination**, and per the existing freight gate its pending orders cannot be submitted for fulfillment until a destination is restored. Switching a location off can therefore block fulfillment on stores the rep is not looking at.
- Given a location used by one or more stores, when the rep switches it off, then a **confirmation names the number of stores affected** and states that those stores will be left without a destination, before the change is applied.
- Given a location switched off, when a rep opens an affected store's Distribution & Fulfillment settings, then the missing destination is surfaced as a condition to resolve rather than rendering as an empty field with no explanation.
- **OPEN — to be confirmed:** whether switching a location back on restores it to the stores that previously used it, or whether those stores must re-select it. Restoration is the kinder behavior but requires retaining the reference after removal.
- **OPEN — to be confirmed:** whether affected store owners are notified. A rep whose store silently lost its destination will discover it at submission, which is the latest and most expensive moment.

##### Epic D — Selection within a store

Specified elsewhere and recorded here only so the full path is legible.

- Given a store set to **Ship to Team Manager** and a workspace with saved locations, when the rep sets the destination, then they may **select a saved location or type an address manually**. Specified in *Step 1 — Basics*, Epic F and *Store Settings (Settings Tab)*, Distribution & Fulfillment.
- Given a workspace with no saved locations, when the rep selects Ship to Team Manager, then manual entry behaves exactly as it does today and the rep is prompted that locations can be saved for reuse. Having no locations never blocks store creation.

#### Acceptance Criteria

- Given Workspace Settings, when the rep opens Pick-up Locations, then every saved location is listed with its address, hours, instructions, availability state, and the count of stores using it.
- Given the Add location modal, when a required field is empty, then the commit action is disabled.
- Given a saved location used by stores, when the rep edits its address and saves, then every store referencing it resolves to the new address with no per-store action.
- Given a location used by stores, when the rep switches it off, then a confirmation states how many stores are affected before the change applies.
- Given a location switched off, when an affected store is inspected, then it has no ship-to destination and its pending orders are blocked at the freight gate until one is set.
- Given a store on Direct-To-Home Residential Delivery, when its fulfillment settings render, then no pick-up location control is offered.
- Given a workspace with saved locations, when a rep sets a store's destination, then manual address entry remains available alongside the saved list.

### Metrics & Success Criteria

- Share of Ship to Team Manager stores whose destination resolves to a saved location rather than a typed address — the basic read on adoption
- Average stores per saved location — reuse is the entire value; a workspace where every location serves one store has gained nothing
- Time to set a destination during store creation, before and after
- **Ship to Team Manager stores launching with no destination**, measured against the baseline in *Step 1 — Basics* — saved locations should reduce the gap that metric tracks
- Location edits, and stores corrected per edit — the propagation benefit, made visible
- **Freight-gate blocks attributable to a location switched off** — should be near zero; a non-trivial rate means the confirmation is not landing

---

### Dependencies & Technical Constraints

Requires a **workspace-scoped pick-up location record** holding name, street address, city, state, ZIP, a repeatable set of hours entries, pick-up instructions, and an availability state. Stores must **reference the location rather than copy it**, since propagation of an edit to every consuming store is the feature's purpose; a selection that snapshots the address at the time of choosing defeats it.

A selected location must resolve to the **same persisted ship-to destination** that a manually typed address writes — the field shared by *Step 1 — Basics* Epic F, *Store Settings* Distribution & Fulfillment, and the pending-order freight gate in *Order Management*. There must be no parallel destination field and no precedence rule between them, because a store has exactly one destination however it was supplied.

The store-usage count requires a **reverse lookup from location to referencing stores**, read both for the card's usage line and for the confirmation when a location is switched off. Switching a location off must **clear the destination on every referencing store in one transaction** and leave those stores in a state the freight gate recognises as missing rather than malformed.

**OPEN — not yet decided:** **shopper range**. The location card reserves space for it and reports it as unconfigured. Nothing in the current model defines what range means, how a rep sets it, or what consumes it. It must be specified or removed from the card before build — a field that renders permanently as unconfigured reads as a defect.

**OPEN — the section's own description copy contradicts this spec.** The approved design describes a pick-up location as a place a shopper collects an order instead of shipping, says each store turns pick-up on in its own Settings, and says checkout only offers it to shoppers in range. That describes a **shopper-facing checkout fulfilment option**, which is not what this feature is: a pick-up location is the destination for a Ship to Team Manager bulk shipment, selected by the rep, never offered to a shopper at checkout. The same tension appears in the add/edit modal, whose helper copy states the instructions are shown on the order confirmation and a *Ready for pick-up* email — buyer-facing surfaces that imply a per-shopper pick-up flow. Either the copy is rewritten to describe a bulk destination, or a shopper-facing pick-up option is a real second feature that needs its own specification. This must be settled before build; it changes what the feature is, not how it looks.
