# Cart & Order Summary

### Executive Summary & Problem Statement

#### The Problem

Buyers with multi-player kits and mixed items lose track of what they're buying and what the team covers.

#### The Solution

A cart with line items grouped by bundle (image, size/personalization metadata, status badge, quantity stepper, remove), and an Order Summary listing Subtotal, Team Contributions (credit), Estimated Shipping (Free), Estimated Tax, and Total — pinned in a sticky sidebar on desktop, a sticky bar on mobile.

‌

### User persona & use cases

**Who is this for?** All buyers.

**Scenarios encountered** Reviewing a multi-kit cart; adjusting a quantity; confirming the team credit before paying.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a buyer, I want a grouped cart with a clear summary including team credit, so that I understand exactly what I'm paying.

#### Acceptance Criteria

* Given items in the cart, when it renders, then they group by bundle with editable quantity and remove.
* Given covered items, when the summary renders, then Team Contributions appears as a credit and the Total reflects it.

‌

### Metrics & Success Criteria

* Cart→checkout rate
* Cart-abandonment reduction

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires persistent carts (currently in-memory, reset on reload), the pricing-coverage engine, and tax estimation. Database updates + third-party tax service.
