# Order Confirmation

### Executive Summary & Problem Statement

#### The Problem

Buyers need immediate proof the order succeeded and what to expect next.

#### The Solution

A success state showing the **order number**, **order date**, **quantity**, **each item with its configurations and price**, and the **total price** — with two call-to-action buttons: **Request Cancellation** and **Continue Shopping**.

‌

### User persona & use cases

**Who is this for?** All buyers post-purchase.

**Scenarios encountered** Right after placing an order; reviewing the itemized order; requesting cancellation; continuing to shop.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a buyer, I want a clear confirmation with my order number, date, and full itemized recap, so that I know exactly what I ordered and that it went through.
* As a buyer, I want to request a cancellation or keep shopping right from the confirmation, so that I can act immediately after ordering.

#### Acceptance Criteria

* **Content:** Given an order is placed, when confirmation renders, then it shows the **order number**, **order date**, **quantity**, **each item with its configurations (name on jersey, number, size) and price**, and the **total price**.
* **Request Cancellation:** Given the confirmation page, when the buyer clicks **Request Cancellation**, then a cancellation request is submitted for the order (subject to rep review / production status).
* **Continue Shopping:** Given the confirmation page, when the buyer clicks **Continue Shopping**, then they are routed back to the storefront.

‌

### Metrics & Success Criteria

* Confirmation→repeat-shop rate (Continue Shopping)
* Cancellation-request rate
* Post-order support contact rate (lower = clearer)

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires persistent order records exposing the **order number, date, per-item configurations + pricing, and total**, plus a **cancellation-request** path tied to order/production status (request, not guaranteed cancellation). Database updates + order / fulfillment service.
