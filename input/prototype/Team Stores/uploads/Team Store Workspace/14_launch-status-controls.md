# Launch & Status Controls

### Executive Summary & Problem Statement

#### The Problem

Reps need an explicit, reversible action to take a store live and to pause it.

#### The Solution

Every new store begins as a **draft** so the rep can fully configure it before launching. A Launch control — gated by readiness rules — flips the store live/active (with confirmation toast and an onboarding milestone signal). After launch, a **status-control component** lets the rep switch the store between **Active** and **On Hold** (technically equivalent to a draft). This control appears in **two places**: the **Manage-Store Workspace header** and on each **team store card in the Team Store Workspace dashboard**.

‌

### User persona & use cases

**Who is this for?** Store owners / reps

**Scenarios encountered** Going live after setup; pausing a store on hold; confirming a store is active.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want explicit launch and hold controls, so that I command exactly when buyers can order.
* As an rep, I want to change a store's status from either the store workspace or its dashboard card, so that I can pause/resume a store from wherever I am.

#### Acceptance Criteria

* **Draft on creation:** Given a rep creates a new store, when it is created, then it starts as a **draft** — deliberately not live — so the rep can fully configure it before launching.
* **Gate · basics:** Given a draft store, when the required Step 1 – Basics details have **not** all been entered, then the Launch control is **disabled**.
* **Gate · at least one product:** Given a draft store, when **no product** has been added, then Launch is **disabled** (at least one product is required).
* **Gate · roster for team items:** Given a draft store that includes a **Team Required or Team Supplied** item, when the roster has **no players**, then Launch is **disabled** until at least one player is added to the roster.
* **Launch enabled:** Given all applicable gates are satisfied (basics complete, ≥1 product, and ≥1 rostered player when a team item exists), when I Launch, then the store goes active, a confirmation toast appears, and the onboarding milestone advances.
* Given a live store, when I set hold, then ordering is suspended.
* **Status control · two options:** Given a launched store, when the rep uses the **status-control component**, then they can set status to **Active** or **On Hold**. **On Hold is technically equivalent to a draft store** (storefront not taking orders), but unlike a never-launched draft it can be flipped back to Active directly.
* **Status control · placement:** Given the status-control component, then it is surfaced in **two locations** — the **Manage-Store Workspace header** and on each **individual team store card in the Team Store Workspace dashboard** — and changing status in one reflects in the other.

‌

### Metrics & Success Criteria

* Launch success rate
* Accidental-launch reversals near zero
* Status changes made from dashboard card vs. workspace header

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires store status persistence and propagation to the storefront (open/closed behavior). The **status-control component** (**Active / On Hold**, where On Hold is technically the same as a **draft**) is shared between the **manage-store workspace header** and the **dashboard store cards**, so both surfaces read and write the same status state and stay in sync. Database updates.
