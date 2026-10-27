# Checkout

### Executive Summary & Problem Statement

#### The Problem

A long checkout loses buyers; they need a guided, reassuring path with saved details.

#### The Solution

A guided numbered stepper — Shipping, Payment, and Review (line items + editable Ship-to/Payment) — that adapts to the buyer's history. **First-time buyers** enter shipping and payment **manually**; **repeat buyers** can **reuse a saved shipping address and payment method** from past orders (radio cards) or add new ones. Secure-encrypted-checkout reassurance throughout. Placing the order generates an order number, clears the cart, and routes to confirmation.

‌

### User persona & use cases

**Who is this for?** All buyers checking out — both first-time and repeat buyers.

**Scenarios encountered** A first-time buyer entering a shipping address and card manually; a repeat buyer selecting a saved address and saved card; adding a new shipping address; reviewing before placing.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a first-time buyer, I want to enter my shipping and payment details, so that I can complete my first order.
* As a repeat buyer, I want to reuse a shipping address and payment method from a past order, so that I can check out quickly.

#### Acceptance Criteria

* **First-time buyer:** Given a buyer with **no saved details**, when they reach Shipping and Payment, then they must **input shipping information and payment information manually**.
* **Repeat buyer:** Given a buyer with **previously used details**, when they reach Shipping and Payment, then they can **select an existing saved address and saved payment method** (radio cards) or add a new one.
* Given I place the order, when it succeeds, then an order number is generated, the cart clears, and I land on confirmation.

‌

### Metrics & Success Criteria

* Checkout completion rate
* Steps-to-complete / time-on-task

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires payment processing, address/payment validation, server-side order-number generation, and tax finalization. Adds **per-account persistence and retrieval of saved shipping addresses + payment methods** so repeat buyers can reuse prior details while first-time buyers enter them manually. Third-party payment + tax integrations + database updates.
