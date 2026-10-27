---
title: Checkout
confluence_id: 4155113576
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155113576/Checkout
last_modified: 2026-09-22
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

A long checkout loses buyers; they need a guided, reassuring path with saved details.

#### The Solution

A guided numbered stepper — Shipping, Payment, and Review (line items + editable Ship-to/Payment) — that adapts to the buyer’s history. **First-time buyers** enter shipping and payment **manually**; **repeat buyers** can **reuse a saved shipping address and payment method** from past orders (radio cards) or add new ones. Secure-encrypted-checkout reassurance throughout. Placing the order generates an order number, clears the cart, and routes to confirmation.


### User persona & use cases

**Who is this for?** All buyers checking out — both first-time and repeat buyers.

**Scenarios encountered** A first-time buyer entering a shipping address and card manually; a repeat buyer selecting a saved address and saved card; adding a new shipping address; reviewing before placing.


### Functional Requirements & Core Workflows

#### User Stories

- As a first-time buyer, I want to enter my shipping and payment details, so that I can complete my first order.
- As a repeat buyer, I want to reuse a shipping address and payment method from a past order, so that I can check out quickly.
- As a buyer on a store using Group Coach Freight Sorting, I want to check out without entering a shipping address, so that I can place my order knowing delivery is handled through the team’s consolidated shipment.

#### Acceptance Criteria

- **First-time buyer:** Given a buyer with **no saved details**, when they reach Shipping and Payment, then they must **input shipping information and payment information manually**.
- **Repeat buyer:** Given a buyer with **previously used details**, when they reach Shipping and Payment, then they can **select an existing saved address and saved payment method** (radio cards) or add a new one.
- **Group Coach Freight Sorting — shipping step omitted:** Given the store’s distribution model is set to **Group Coach Freight Sorting**, when a buyer proceeds to checkout, then the **Shipping step is not shown** and no shipping address is collected or required. The stepper advances directly from cart review to Payment.
- **Group Coach Freight Sorting — no address stored:** Given the Group Coach Freight Sorting model is active, when the order is placed, then **no shipping address is saved** to the buyer’s account for this order, and the Order Confirmation screen omits the Ship-to summary.
- Given I place the order, when it succeeds, then an order number is generated, the cart clears, and I land on confirmation.


### Metrics & Success Criteria

- Checkout completion rate
- Steps-to-complete / time-on-task

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires payment processing, address/payment validation, server-side order-number generation, and tax finalization. Adds **per-account persistence and retrieval of saved shipping addresses + payment methods** so repeat buyers can reuse prior details while first-time buyers enter them manually. Third-party payment + tax integrations + database updates.
