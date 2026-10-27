---
title: Roster-Optional Architecture (Open Access Stores)
confluence_id: 4230545435
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4230545435/Roster-Optional+Architecture+Open+Access+Stores
last_modified: 2026-08-31
pulled: 2026-10-26
---
**Epic spec — approved for build.** This spec adds roster-optional (Open Access) behavior to Team Stores: rosters become optional and fillable from either direction (front-loaded or back-filled from checkout), and team-gear access is gated by financial risk instead of roster-match. Background research is retained in the archived [Roster-Optional Team Stores — Direction Proposal](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4224122882). Related specs it revises: [Roster Management (My Team(s) Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153507841/Roster+Management+My+Team+s+Tab), Branded Storefront Landing & Account Onboarding, Carts & Checkout Flow, Account/Orders & Cancellation, System Emails, Step 1 — Basics, and Team Manager & Freight Mapping (Settings).

### Executive Summary & Problem Statement

#### The Problem

The Team Stores platform is built around a populated roster. The storefront's roster-match gate, pre-filled personalization, per-player tracking, and freight sorting all assume the rep assembled a roster — names, numbers, emails, sizes, addresses — before or shortly after launch. Research with high-value reps found this assumption wrong: many do not build rosters up front on other platforms, and being required to do so before a store is useful is real friction. The friction is the roster as an *upfront obligation*, not player tracking itself — reps still want to know who ordered, who is missing required gear, and how to sort a shipment. One rep routes around us entirely with a shared coupon code for team-supplied gear, accepting no record of who ordered as the cost.

A second, related finding: reps often do not hold parent or player contact details at all. Any model that requires an email per player before launch fails for the same reason the roster does.

#### The Solution

Make the roster **optional and fillable from either direction**, and stop using roster-match as the access gate. Concretely:

1. A roster is never required to launch. The rep adds teams and rosters in the **My Team(s)** tab whenever they choose, and any roster can be **front-loaded** (CSV, manual entry, share-roster link) and/or **back-filled** from end-user team-gear checkout captures.
2. Team-gear captures land in the **Roster Bank** — a staging area where the system pre-groups likely-same-player captures and the rep commits them to a roster with one click.
3. Storefront access moves to **tiered gating keyed to financial risk** (fan gear fully open, team gear behind a deliberately loose gate) with buyer identity captured at checkout.
4. Shoppers resolve themselves to a team by **selecting it from a team selector at storefront arrival**. Team codes remain as backend routing and reporting keys and are never entered by a shopper or a rep.
5. Player records require only a first and last name. No contact channel is required.

Buying never requires an account; the checkout capture (with buyer opt-in) is what feeds the roster. We refer to this public, tiered-gate, capture-to-bank behavior as **Open Access**.

**Team structure is unchanged by this epic.** League stores keep the existing **division → team** structure (a division carries branding and contains teams; teams may also stand alone), and fulfillment mapping keeps its three modes. What changes is that a team can exist and function with **no roster attached**, and that rosters fill from orders as well as from the rep.

### User persona & use cases

**Who is this for?** Reps, team managers, league directors (workspace side); players, parents/guardians, and fans (storefront side).

**Scenarios encountered** Launching a store with no roster and letting it build itself from orders; creating a team now and deciding about its roster later; adding a roster later and choosing to front-load it via CSV, manual entry, or a share link; watching team-gear orders accumulate as Roster Bank captures and committing them to the right roster with one click; splitting a capture cluster that wrongly merged two siblings; a fan buying spirit wear with no code and no account; a parent arriving at a league store, picking their player's team from the selector, buying a required jersey, and entering their player's name; a rep protecting $0 team-supplied items behind an optional approval step.

### Resolved decisions

| Question | Resolution |
| --- | --- |
| **Roster as a mode vs. always-optional** | Not a per-store mode toggle. There is one model: rosters are always optional and always fillable from either direction. A store launches with or without rosters; rosters are added and filled at any time. "Open Access" names the behavior (public store + tiered gate + capture-to-bank), not a setting the rep picks against a "Verified" alternative. |
| **League structure** | Unchanged from Roster Management. Divisions contain teams; teams may stand alone; a roster attaches to a team and is optional. Team and roster are **distinct entities** — a team can exist with no roster, and one team holds at most one roster. |
| **Gating mechanism per tier** | A **loose gate**, deliberately. Shoppers select their team from a storefront team selector and provide mandatory "who is this order for?" identity capture; there is no shared secret and no code entry. **This is an accepted risk:** reps and team managers have confirmed they prefer easy accessibility over a secure gate, including for $0 team-supplied items. **Team Supplied** additionally supports an optional rep-enabled **order-approval** step (default off) for reps who want more protection. No per-player tokens in v1. |
| **Contact details on a roster record** | **No contact channel is required.** First and last name are the only required fields. Reps frequently do not hold parent contact details; email and phone are validated for format when supplied and arrive most often from checkout captures rather than rep entry. |
| **Uncommitted captures** | Captures count for jersey-number uniqueness and completion tracking **immediately**, before the rep commits them — otherwise the store is blind to real orders and two buyers could take the same number in the gap. |
| **Roster Bank location** | **Both.** A per-team queue on the team detail view and a store-wide queue from the My Team(s) home, reading the same records. |
| **Clear / Delete Roster vs. captures** | Pending captures live in the Roster Bank, not on the roster. **Clear Roster** empties a roster's committed players and keeps the roster entity; **Delete Roster** removes the roster entity and leaves its team in place. Neither destroys pending captures. |
| **Duplicate-number policy** | Per roster, authoritative. A league-level setting acts as a bulk default that cascades through divisions to every team's roster; any roster may then override it. Supersedes this spec's earlier "Jersey Number 00–99 unique". |
| **Launch with no players** | Valid. The launch gate stays product-based (≥1 published product), never roster-based. The "all players" launch email becomes a rep-distributed store link; player-addressed emails fire as captures arrive. |
| **Guest checkout scope** | **Account optional but encouraged.** No account is required to buy anything (fan or team gear). The priority is capturing player info + contact at checkout to feed the workspace; fans holding accounts is explicitly not a goal. Account creation is offered post-purchase as a convenience (saved address/payment), never required. |
| **Automations on rosters** | Out of scope for this epic; noted as a future fast-follow. |

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want to launch a store without building a roster first, so that I can go live immediately and let the roster fill in from orders.
- As a rep, I want to create teams without rosters, so that I can set up structure without committing to player data.
- As a rep, I want to add a roster in the My Team(s) tab at any time and fill it by CSV, manual entry, a share-roster link, or by banking checkout captures — in any mix — so that roster-building fits how I actually work.
- As a rep, I want team-gear orders to accumulate as captures I can review and commit to a roster with one click, so that the roster builds itself without me doing upfront data entry.
- As a rep, I want the system to pre-group captures that look like the same player, and to split or merge those groups myself, so that I get the speed of automation without the risk of a wrong automatic merge.
- As a fan, I want to buy spirit wear with no code and no account, so that shopping is frictionless.
- As a parent, I want to pick my player's team from a list when I arrive, buy their required gear by entering their name, and not be asked for a code or an account, so that ordering takes a minute.
- As a rep, I want to protect $0 team-supplied items behind an approval step when I choose to, so that the team's money is not exposed.

##### Epic A — Roster is optional & fillable from either direction

A roster is never a launch prerequisite. Stores launch on the existing product-based gate (≥1 published product). Teams and rosters are created and filled from the My Team(s) tab at any point in the store lifecycle.

- **Launch with no roster:** Given a store with at least one published product and zero rosters (or empty rosters), when the rep launches, then launch succeeds and the storefront is live. No roster-readiness gate exists.
- **Teams without rosters are valid:** Given a team with no roster, then it functions fully for product assignment, catalog scoping, shipping containers, and fulfillment mapping. A roster is created on that team when the rep adds one, or automatically when the rep commits that team's first Roster Bank capture.
- **Add a roster anytime:** Given the My Team(s) tab, when the rep adds a roster to a team, then it can be filled by any combination of: **CSV upload**, **manual entry**, **share-roster link/template** (existing front-load paths, retained and specified in Roster Management, Epic 1), and **Roster Bank commits** (new back-fill path, Epic C).
- **Front-load and back-fill coexist:** Given a roster partially front-loaded by the rep, when checkout captures arrive for players not yet on it, then those captures enter the Roster Bank for review rather than colliding with or overwriting existing records (dedupe handled in Epic C). Where a capture's details match an existing record with blank fields, the existing checkout write-back path completes that record instead of creating a capture (Roster Management, Epic 3).
- **Schema:** roster records keep the schema defined in Roster Management — First Name and Last Name **required**; Jersey Number (00–99, uniqueness governed by that roster's duplicate-number policy), Name on Jersey, Contact Email, Contact Phone, conditional Player Shipping Address, and Associated Emails all **optional**. A record with no contact channel is valid. Captures populate the same fields.

##### Epic B — Team structure under Open Access

League (Multi-Team Hub) stores keep the structure specified in Roster Management, Epic 0: **divisions** carry branding (name, color, sport) and contain **teams**; teams may also **stand alone** under the league; a **roster** attaches to a team and is optional. Single-Team Locker stores have no division tier — the store is one team.

This epic makes no structural change. The following clarifications apply because rosters may now be absent:

- **Structure is independent of player data.** Divisions, teams, branding, product-to-team assignment, shipping containers, and fulfillment mapping all key off **structure**, not player records, and therefore behave identically whether a team's roster is full, partly filled, or absent.
- **Fulfillment mapping is unchanged:** three modes — **league**, **division**, or **individual team** — configurable in Settings → Team Manager & Freight Mapping and on the division and team detail components. Pending-order shipping containers and the freight-routing submission gate key off division-or-team.
- **Delete semantics are unchanged:** deleting a division keeps its teams, which become standalone teams and drop the division's branding, carrying their rosters with them.
- **Team codes** are per division and per team, deterministic and human-readable (e.g. RT47A). Under this epic they are **backend routing and reporting keys only** — stamped onto orders for container routing and reporting, visible read-only in the workspace, and **never entered by a shopper or a rep**. Shopper→team resolution happens through the storefront team selector (Epic D).
- **The My Team(s) home view design is being reworked** as part of the tab redesign; this epic specifies the structure it represents and the Roster Bank surfaces it must accommodate (Epic C), not its visual design.

##### Epic C — The Roster Bank: capture, pre-group, commit

The mechanism that back-fills rosters from orders. A staging area sits between orders and the roster proper; captures are *potential* roster entries until a human commits them.

- **Capture scope — team gear only:** Given a completed order, when it contains **Team Required or Team Supplied** items, then a capture is created in the Roster Bank for the relevant team; **Fan Gear orders never create captures** (fans are not players, and including them would flood the roster). A capture carries the buyer-entered details from the order — player name, name-on-jersey, jersey number, size, contact email, phone, and shipping address where present.
- **Consent-gated (see Dependencies):** a capture only flows to the Roster Bank when the buyer has opted in at checkout (Epic E). Orders from buyers who decline still fulfill normally but do not create a roster capture.
- **Pre-grouping:** Given multiple captures, when the Roster Bank renders, then the system **clusters captures that share signals** — same/similar contact email, phone number, shipping address, or player name — into proposed players, so the rep reviews coherent groups rather than an unordered pile. Pre-grouping is a **suggestion, not an authority**.
- **Grouping signals come from the order, not the roster.** Because roster records may carry no contact details, clustering must not assume an email exists on the rep-entered side; captures themselves are the richer source, and player name plus shipping address must be sufficient signals on their own.
- **One-click commit (fast path):** Given a proposed player (a single capture, or a bundle of captures the system grouped), when the rep clicks **Add to roster**, then that capture/bundle is promoted onto the corresponding team's roster as one player record, merging the captured fields into the schema. If the team has no roster yet, committing creates one.
- **Manual split & merge (override):** Given a wrongly-grouped cluster (e.g. two siblings on one family email), when the rep splits it, then the captures separate into distinct players; given two clusters the system failed to connect (e.g. "Jonathan" and "Jon" under different contacts), when the rep multi-selects and merges them, then they combine into one player. The human always makes the final call in both directions.
- **Dismissing a capture:** Given a capture the rep does not want on the roster, when they dismiss it, then it leaves the queue, releases any jersey number it was holding, and the underlying order is unaffected.
- **Uncommitted captures still count:** Given captures sitting unpromoted in the Roster Bank, when jersey-number uniqueness is evaluated or completion tracking is displayed, then those captures **are counted** — a number claimed by an uncommitted capture is unavailable on a roster that disallows duplicates, and an uncommitted capture counts toward its player's team-gear completion. On a roster that allows duplicates, captures impose no number constraint.
- **Captures are not roster members:** they do not appear in the player table, are not included in player counts, and are **not affected by Clear Roster or Delete Roster**. Clearing or deleting a roster leaves that team's pending captures intact and still committable.
- **Roster Bank location — both views:** a **per-team queue** on the team detail view, and a **store-wide queue** from the My Team(s) home with a team column and filters. Both read the same records; committing from either has the same effect. Pending-capture counts surface on division cards, team cards, and the stats header.

##### Epic D — Storefront team selection & tiered access gate

Replaces roster-match gating with gating keyed to financial risk, and replaces shopper code entry with team selection at arrival.

- **Team selector at arrival (league stores):** Given a league store, when a shopper arrives, then they are presented with a **team selector** — division, then team — that resolves them to one team. Selecting a team scopes the catalog to that team's assigned products plus league-wide items, and stamps the resulting order's team for container routing and reporting. Fans who only want spirit wear can proceed without selecting a team where the catalog permits.
- **Single-Team stores:** Given a Single-Team Locker store, then no selector is shown — the store is one team and every order is stamped with it.
- **Fan Gear — fully open:** Given fan-gear products, when any visitor shops, then no gate, no code, and no account are required to browse or buy.
- **Team gear — a deliberately loose gate:** Given team-required or team-supplied products, when a buyer attempts to add or purchase, then they must have resolved to a team (via the selector) and must provide **"who is this order for?"** identity capture (player name; contact for order comms). There is **no shared secret, no code, and no membership check** — the gate produces signal, not lockdown.
- **Accepted risk.** Because team selection is open to anyone, a determined or mistaken buyer can reach team-required and team-supplied items, including $0 team-paid ones. Reps and team managers have accepted this tradeoff in favor of easy accessibility. Reps who want more protection enable order approval below. Product copy and the store-setup flow should set this expectation rather than implying a secure gate.
- **Team Supplied — optional approval:** Given team-supplied ($0, team-paid) products, when the rep has enabled **order approval** for the store, then such orders enter a rep-approval queue before they are confirmed. Approval defaults **off**.
- **Identity capture feeds the Roster Bank:** the "who is this for?" details plus contact become the capture in Epic C — access and identity capture are the same moment.

##### Epic E — Guest checkout & opt-in roster capture

Buying requires no account. Checkout captures the data the workspace needs, with buyer consent.

- **Guest purchase:** Given any buyer, when they check out, then they can complete the purchase with contact + payment (and, for direct-to-home, shipping) without creating an account. The existing 3-step checkout is preserved; account creation is removed as a precondition.
- **Opt-in roster join (friendly framing):** Given a team-gear checkout, when the buyer reaches the identity-capture step, then they are offered a clearly-worded opt-in — e.g. *"Join the team roster so checkout is faster next time?"* — that authorizes their player/contact details to be shared with the team organizer for roster and fulfillment purposes. Only when opted in does the capture flow to the Roster Bank (Epic C).
- **Account optional but encouraged:** Given a completed guest purchase, when the confirmation renders, then the buyer is **offered** (not required) account creation, framed around saved address/payment for faster future checkout. Order lookup, status, and cancellation for guests work via an emailed magic link.
- **Fans:** no identity capture, no opt-in, no account prompt is necessary for fan-only purchases — capturing fans is explicitly not a goal.

### Metrics & Success Criteria

- Time-to-launch for stores that launch with no roster (should drop materially vs. roster-first stores).
- Share of stores launching with empty or absent rosters (adoption of the roster-optional path).
- Roster completeness at ordering-window close (share of players committed from captures vs. estimated true team size).
- **Roster Bank health:** uncommitted captures remaining at window close (backlog); one-click-commit share vs. manual split/merge (pre-grouping real-world accuracy).
- Team-gear checkout opt-in rate (share of team-gear buyers who agree to join the roster) — the ceiling on how much the roster can back-fill.
- Share of committed records carrying a contact channel — a read on reminder and share-link coverage, given that no channel is required.
- Team-selector completion rate at league-store arrival, and share of orders stamped to the correct team (mis-stamped orders are the cost of an open selector).
- Unauthorized Team Supplied redemptions — tracked as a known, accepted exposure rather than a gate-failure metric; a material rate is the signal to revisit optional approval defaults.
- Fan-gear conversion (should be equal-or-better than roster-gated behavior, confirming the open tier removed friction).
- Guest-checkout completion rate; post-purchase account-creation take rate (secondary — not a primary goal).

---

### Dependencies & Technical Constraints

**Consent / privacy — build-blocking for the capture-to-roster flow, pending legal review.** Capturing a buyer's personal information at checkout and surfacing it on a rep-facing roster is a secondary use of that PI (third-party team administration), which in most privacy regimes requires a lawful basis — notice and, depending on jurisdiction and the involvement of minors, opt-in consent. Youth sports makes this acute: much of the captured PI concerns children, implicating stricter regimes (e.g. COPPA-style rules in the US, GDPR parental-consent provisions in the EU). This is not legal advice. The proposed default is a checkout **opt-in checkbox** framed as a buyer benefit ("join the roster for faster checkout next time") that authorizes sharing the buyer's details with the team organizer for roster/fulfillment purposes; captures do not flow to the Roster Bank without it. **The exact consent mechanism, retention, and parental-consent handling must be confirmed with legal/privacy before the capture-to-roster flow ships.** The storefront must include a consent affordance in the UI regardless, so the flow is designed around consent rather than retrofitted.

**Roster Bank.** Requires a capture store distinct from committed roster records; a capture→player promotion path that can create a roster on a team that has none; a dismissal path that releases held jersey numbers; and a pre-grouping/clustering service over capture signals (email, phone, address, normalized name) returning proposed player groups with confidence sufficient to drive one-click commit, plus split/merge operations. Clustering must not depend on roster-side contact data, which may be absent. Uncommitted captures must be readable by the jersey-uniqueness validator and the completion-tracking join, and must survive Clear Roster and Delete Roster. Capture creation is scoped to Team Required / Team Supplied orders only and gated on buyer consent. The Bank must be queryable both per team and store-wide, with pending counts joined onto division cards, team cards, and the My Team(s) stats header.

**Team and roster as distinct entities.** Persisted structure is division → team, with a roster as an optional child of a team (at most one per team). Every consumer of structure — product-to-team assignment, shipping containers, the freight-routing submission gate, fulfillment mapping — must tolerate a team with no roster. No migration of existing structure is required by this epic; the labels division/team/roster match the existing model.

**Storefront team selection & tiered gate.** The team selector must expose the store's division/team structure publicly, resolve a shopper to exactly one team, scope the catalog to that team's assigned products plus league-wide items, and stamp the order's team for container routing and reporting. Access logic keys off product tier (Fan / Team Required / Team Supplied) rather than roster membership. Identity capture must be collected at the gate/checkout and carried into the capture record. Team Supplied needs an optional per-store approval-queue state on orders. Team codes remain generated and stored as backend routing/reporting keys with no shopper- or rep-facing entry path.

**Roster schema.** First and Last Name are the only required fields. Email and phone are validated for format only when supplied. Every surface that depends on a contact channel — Send Reminder, share-link sends, player-addressed system emails, guest magic-link order lookup — must handle a record with no channel by degrading to a disabled or copy-only state with a stated reason, never by blocking record creation or capture commit.

**Duplicate-number policy.** Per roster and authoritative; the league-level control is a bulk write cascading through divisions to every roster, plus a mixed-state read. The taken-number set for a roster is the union of its committed player records and the pending captures banked against its team, exposed to every selection surface (roster add row, edit drawer, storefront PDP, checkout) so unavailable numbers render disabled rather than being validated after submit. Suppressed entirely on rosters that allow duplicates.

**Guest checkout.** Checkout must complete without account creation; order-access via tokenized magic link for lookup/status/cancellation; post-purchase optional account creation that can adopt the guest's captured details. Existing 3-step checkout and bundle-grouped cart are preserved.

**Scope of change by surface:** Step 1 — Basics (no roster prerequisite, no mode toggle); Roster Management → optional rosters, team/roster split, Roster Bank surfaces, backend-only team codes, optional contact fields; Branded Storefront Landing & Account Onboarding (team selector + tiered gate replaces role/roster-match); Carts & Checkout Flow (guest path + identity capture + opt-in); Account/Orders & Cancellation (magic-link guest access); System Emails (Open-Access equivalents; launch email → store link; no-contact-channel fallbacks); Settings → Team Manager & Freight Mapping (unchanged three modes, now also editable from division/team detail); Products/Orders tabs (orders feed the Roster Bank). Stores continue to function unchanged where a rep front-loads a roster the traditional way — this epic adds paths, it does not remove the front-load ones.
