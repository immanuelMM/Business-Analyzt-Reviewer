---
title: Order History & Production Timeline
confluence_id: 4154818627
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154818627/Order+History+Production+Timeline
last_modified: 2026-09-22
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

Custom bulk-produced gear has a long, opaque lifecycle; buyers anxiously wonder where their order is.

#### The Solution

A searchable/sortable list of order cards with status pills, line items, totals, and View Details; an order detail with a production timeline (Order placed → Confirmed → Artwork → Factory production → Shipped → Delivered) with active/done states, optional tracking, itemized recap with contributions, shipping address, and actions (Reorder, Request Cancellation while processing, Contact Support).


### User persona & use cases

**Who is this for?** All buyers tracking orders.

**Scenarios encountered** Checking production status; finding a tracking number; reordering last season’s gear.

### Functional Requirements & Core Workflows

#### User Stories

- As a buyer, I want to track my order through production stages, so that I know where it is and what’s next.

#### Acceptance Criteria

- Given an order, when I open detail, then a stage timeline shows current/completed steps.
- Given an order is shipped, when tracking exists, then a tracking number/link is shown.


### Metrics & Success Criteria

- Self-serve status checks vs. support contacts
- Reorder rate

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires persistent order records, production status updates from fulfillment, and carrier tracking integration. Fulfillment + third-party shipping integrations + database updates.
