---
title: Cancellation Request Workflow
confluence_id: 4155539478
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155539478/Cancellation+Request+Workflow
last_modified: 2026-09-22
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

Custom products can’t always be canceled (once in production), but buyers still need a governed way to request it.

#### The Solution

A cancellation modal with a reason selector, optional note, per-item selection, and a clear policy notice that customized products can’t be canceled once in production; submitting routes the request to the team administrator.


### User persona & use cases

**Who is this for?** Buyers seeking to cancel; team administrators reviewing requests.

**Scenarios encountered** Canceling a still-processing order; attempting to cancel an in-production item (blocked by policy); an admin reviewing the request.


### Functional Requirements & Core Workflows

#### User Stories

- As a buyer, I want to request cancellation with a reason, so that I can try to cancel within policy.
- As an administrator, I want requests routed to me, so that I can review and decide.

#### Acceptance Criteria

- Given an order is still processing, when I request cancellation, then I select items/reason and submit, and the request routes to the administrator.
- Given an item is in production, when I attempt cancellation, then policy blocks it with a clear notice.


### Metrics & Success Criteria

- Preference-set rate
- Address-error-on-order reduction

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires a cancellation workflow: request state, routing/notifications to administrators, approval handling, and refund coordination with payments. Database updates + shared services + payment integration.
