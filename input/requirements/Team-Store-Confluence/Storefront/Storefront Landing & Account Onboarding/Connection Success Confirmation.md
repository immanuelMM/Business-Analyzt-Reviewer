---
title: Connection Success Confirmation
confluence_id: 4154130433
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130433/Connection+Success+Confirmation
last_modified: 2026-09-22
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

Buyers need assurance they’re linked to the right team and players before spending money.

#### The Solution

A success screen confirming the connected team and linked players before “Start Shopping.”


### User persona & use cases

**Who is this for?** Newly registered players/parents.

**Scenarios encountered** Right after account creation; verifying linked players are correct.


### Functional Requirements & Core Workflows

#### User Stories

- As a buyer, I want a confirmation of my team and players, so that I trust the store before I shop.

#### Acceptance Criteria

- Given account creation succeeds, when the success screen renders, then the connected team and linked players are shown with a Start Shopping action.


### Metrics & Success Criteria

- Success→shopping continuation \>90%
- Post-link correction rate (lower = better matching)

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires account + roster link persistence. Database updates.
