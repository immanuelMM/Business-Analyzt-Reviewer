---
title: Ordering-Window Banner
page_id: 4154163201
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154163201
folder: Consumer Storefront
parent: Storefront Home
---

# Ordering-Window Banner

### Executive Summary & Problem Statement

#### The Problem

Buyers miss deadlines on time-boxed stores, producing late or failed orders.

#### The Solution

A banner reflecting window state — Open / Closing soon with countdown / Closed — driven by the store's configured schedule. **Applies only to temporary pop-up stores** (which have a launch/close timeline); **always-on 24/7 locker stores have no ordering window, so this banner does not appear**.

### User persona & use cases

**Who is this for?** All buyers on **temporary pop-up** stores. (Not applicable to always-on 24/7 locker stores.)

**Scenarios encountered** Open window with plenty of time; a closing-soon countdown; a closed store with disabled ordering.

### Functional Requirements & Core Workflows

#### User Stories

* As a buyer, I want to see whether ordering is open and how long I have, so that I don't miss the deadline.

#### Acceptance Criteria

* Given the store is configured as a **temporary pop-up**, when home renders, then the ordering-window banner is shown; given an **always-on 24/7 store**, the banner is **not rendered**.
* Given the window is closing soon, when home renders, then a countdown is shown.
* Given the window is closed, when home renders, then a closed banner shows and add-to-cart is disabled.

### Metrics & Success Criteria

* On-time order rate
* Closed-window error attempts near zero

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires the store schedule (launch/close) from store config and server time; **gated on the store's distribution format — only temporary pop-up stores have a schedule, so 24/7 stores skip this entirely**; ties to closed-store read-only behavior. Database updates.
