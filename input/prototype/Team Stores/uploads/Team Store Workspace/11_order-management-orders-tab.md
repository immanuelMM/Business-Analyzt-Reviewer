# Order Management (Orders Tab)

### Executive Summary & Problem Statement

#### The Problem

A rep running a team store has orders coming from three directions — their own rep-placed orders, individual player orders for team-required/supplied gear, and fan orders — and no single place to see them. Two operational realities make this acute: most manufacturers enforce **minimum order quantities (MOQs)**, so submitting too early incurs large fees; and reps must know **which rostered players are still missing required gear** before deadlines.

#### The Solution

An **Orders** tab inside the store manager that consolidates all order activity into three sub-tabs — **All Orders**, **Pending Orders**, and **Player Orders**. Pending Orders is built around the MOQ workflow (let orders pile up, then submit in batches with below-MOQ warnings); Player Orders is organized as per-player cards that surface ordered vs. still-missing required gear at a glance. Any order expands into a side-drawer order detail.

‌

### User persona & use cases

**Who is this for?** The store manager (rep) viewing and managing all orders in their team store — their own orders, player orders, and fan orders.

**Scenarios encountered** Letting pending orders accumulate to hit a factory MOQ before submitting; submitting one / selected / all pending orders; knowingly submitting below MOQ and accepting the fee; entering payment + shipping and reviewing items before final submit; scanning player cards to spot who is missing required gear; opening any order to inspect its full detail.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want every order in my store — mine, players', and fans' — in one Orders tab, so that I can manage fulfillment from a single place.
* As a rep, I want to let pending orders accumulate and submit them in batches, so that I hit factory MOQs and avoid below-minimum fees.
* As a rep, I want a clear warning when I submit below MOQ, so that I don't incur a large fee by accident.
* As a rep, I want a per-player view of ordered vs. missing required gear, so that I can quickly chase down players who haven't ordered.
* As a rep, I want to expand any order into a detail drawer, so that I can inspect items, status, pricing, and shipping.

##### Epic A — Orders tab & sub-tabs

The Orders page presents **three sub-tabs**. A search bar (by name, email, or order number) filters within the active sub-tab.

* **All Orders (default):** Given the Orders tab, when it opens, then **All Orders** is shown by default, consolidating **pending orders, player orders, fan orders, and the rep's own orders** into one view, with each row badged by origin (My Order / Fan).
* **Pending Orders:** Given the Pending sub-tab, then it lists orders that have been **placed in the storefront but not yet approved by the rep and sent to the factory**.
* **Player Orders:** Given the Player sub-tab, then it shows the per-player card layout (Epic C).

##### Epic B — Pending Orders & MOQ submission **High-impact**

Pending orders are grouped by **shipping group / factory**, each showing a **minimum-quantity progress ring**, the % to MOQ, and the **Minimum Quantity Fee** that would apply if submitted short. This workflow matters because reps deliberately let orders pile up until they hit MOQ to avoid large below-minimum fees.

* **Selection & submit scope:** Given the pending list, when the rep selects **any number** of pending orders, then they can **Submit Selected**; they may also **Submit All** or submit a **single** pending order from its row.
* **Below-MOQ guard (destructive):** Given a submission whose quantity is **below the MOQ threshold**, when the rep submits, then a **destructive-action confirmation modal** appears and the rep must explicitly confirm they want to move forward (accepting the minimum-quantity fee).
* **At/above-MOQ submit:** Given a submission that is **not below MOQ**, when the rep submits, then a **confirmation modal** opens where they can enter **payment details** and **shipping address**, **review the items / prices** in the order (grouped by shipping group, with subtotal, any fee, and total), and **submit the order**.

##### Epic C — Player Orders (per-player cards) **High-importance**

The Player Orders tab is unique: each rostered player has a **designated card** aggregating all of their orders of **team-required / team-supplied** gear.

* Given a rostered player, when the Player Orders tab loads, then that player has a dedicated card showing **basic player info (name and jersey number)**.
* Given the player's card, then it shows **what they have ordered** and **what they still have left to order** (e.g. "N team-required items missing"), so the rep can immediately see which players are **missing required gear**.
* Given a player missing required items, when the rep chooses, then they can **send a reminder** to that player.

##### Epic D — Order detail drawer

* Given any order in any sub-tab, when the rep clicks it, then a **side drawer** slides in with the full order detail — product art, status with a production-stage stepper, quantity / sport / PO / tracking, delivery, rep/dealership, and item pricing — toggleable between **Order View** and **Item View**.

### Metrics & Success Criteria

* Share of submissions made at/above MOQ (below-MOQ fee avoidance)
* Below-MOQ confirmations / fees incurred
* Time from storefront order → rep submission to factory
* Required-gear completion rate per roster before deadline
* Reminder → player-order conversion

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires an **order service** spanning rep-placed, player, and fan orders with a **storefront → pending → submitted** lifecycle. Pending submission needs **per-shipping-group / per-factory MOQ thresholds** and **minimum-quantity fee** calculation, **batch submission** (single / selected / all), a **below-MOQ destructive-confirmation** branch, and an at/above-MOQ **submission modal** capturing payment + shipping and computing subtotal / fee / total. Player Orders requires a **roster join** to derive each player's **ordered-vs-missing required/supplied gear** plus a reminder channel. The drawer requires **order-detail + production-stage** data. Shared internal order / roster / factory services.
