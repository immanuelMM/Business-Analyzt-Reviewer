# Cancellation Request Workflow

### Executive Summary & Problem Statement

#### The Problem

Custom products can't always be canceled (once in production), but buyers still need a governed way to request it.

#### The Solution

A cancellation modal with a reason selector, optional note, per-item selection, and a clear policy notice that customized products can't be canceled once in production; submitting routes the request to the team administrator.

‌

### User persona & use cases

**Who is this for?** Buyers seeking to cancel; team administrators reviewing requests.

**Scenarios encountered** Canceling a still-processing order; attempting to cancel an in-production item (blocked by policy); an admin reviewing the request.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a buyer, I want to request cancellation with a reason, so that I can try to cancel within policy.
* As an administrator, I want requests routed to me, so that I can review and decide.

#### Acceptance Criteria

* Given an order is still processing, when I request cancellation, then I select items/reason and submit, and the request routes to the administrator.
* Given an item is in production, when I attempt cancellation, then policy blocks it with a clear notice.

‌

### Metrics & Success Criteria

* Preference-set rate
* Address-error-on-order reduction

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires account persistence and a notification/email service honoring preferences. The associated-player display requires a **roster join** linking the account to one or more roster identities (name + jersey number). Database updates + third-party messaging integration.
