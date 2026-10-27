---
title: Launch & Status Controls
confluence_id: 4153802774
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802774/Launch+Status+Controls
last_modified: 2026-09-22
pulled: 2026-10-26
---
**Audit update — July 16, 2026:** this spec was audited against the current Team Stores Workspace prototype and updated to match its behavior — including the launch gate, the launch confirmation/success modals, and the post-launch header (Preview Store button + Create Template menu).

### Executive Summary & Problem Statement

#### The Problem

Reps need an explicit, reversible action to take a store live and to pause it.

#### The Solution

Every new store begins as a **draft** so the rep can fully configure it before launching. A Launch control — gated on the store having at least one **product added** — flips the store open through a confirmation modal and a success modal (View Store / Stay In Editor). After launch, the workspace header swaps to a **Preview Store** button (opens the live storefront) and a **store menu** with a **Create Template** action; status is surfaced on each dashboard store card, while the actionable pause/resume control lives on the Settings tab's Store Status card (Close / Re-open).

### User persona & use cases

**Who is this for?** Store owners / reps

**Scenarios encountered** Going live after setup; previewing the live storefront from the workspace header; creating a reusable template from a proven store; checking a store's Draft / Open / Closed state from its dashboard card; pausing a store; confirming a store is open.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want explicit launch and close controls, so that I command exactly when buyers can order.
- As a rep, I want to preview my live storefront and spin a reusable template off a launched store straight from the workspace header, so that I can verify what buyers see and reuse a proven setup.

#### Acceptance Criteria

- **Draft on creation:** Given a rep creates a new store, when it is created, then it starts as a **draft** — deliberately not live — so the rep can fully configure it before launching.
- **Gate — one product added:** Given a draft store with zero products in its catalog, when the rep views the workspace header, then **LAUNCH STORE** is disabled with the tooltip "Add at least one product to launch your store." Basics completeness is enforced upstream by the creation wizard's per-step validation, and no roster gate applies at launch. *(updated — the gate is products added, not published; "published" is no longer a valid term, having been replaced by the per-item visibility toggle)*
- **Launch confirmation modal:** Given an enabled Launch control, when clicked, then a **"Launch Team Store"** modal confirms the consequences — all players and the team manager receive an email that the store was created and can purchase team goods, and the store can be closed at any time — with Cancel / Launch Team Store actions.
- **Launch:** Given the confirmation, when the rep confirms, then the store goes open, a **"Your store is now live!"** success modal offers **View Store** or **Stay In Editor**, and the onboarding milestone advances.
- **Live header controls:** Given a launched store, when the workspace renders, then the LAUNCH STORE button is replaced by a **Preview Store** button that opens the live storefront (same behavior as the former View Store link) and a **store menu** whose single option, **Create Template**, spins a reusable store template off this store.
- **Status semantics:** Given a launched store, then it can be **Open** or **Closed** — Closed suspends ordering (technically equivalent to a draft) but, unlike a never-launched draft, flips back to Open directly. Status changes confirm with toasts, and the actionable pause/resume control lives on the Settings tab's **Store Status card** (Close Store / Re-open Store — see the Store General Settings spec), not in the workspace header. *(updated — this state was previously named On Hold, and the live state was previously named Active; Open and Closed are the names used throughout, per Store Status & Lifecycle)*
- **Status surfaces:** Given the status state, then it is displayed as a **Draft / Open / Closed** tag on each dashboard store card, and the Stores tab's Filter control offers **Open**, **Draft**, and **Closed** as filter values; changing status anywhere reflects everywhere. **Archived** is a fourth status, but archived stores are excluded from the directory and their cards appear only in the Archived Stores section of the Account page. *(updated)*

### Metrics & Success Criteria

- Launch success rate
- Accidental-launch reversals near zero
- Launches blocked by the product gate (and time to first product added)
- Storefront previews from the header; templates created from launched stores

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires store status persistence (**draft / open / closed / archived**) and propagation to the storefront (open/closed behavior). The launch gate reads the store's **catalog count** (≥1 product added); confirming launch triggers a **notification send** to all rostered players and the team manager and fires the onboarding-milestone event. The post-launch header requires a **storefront preview route** and a **create-template flow** seeded from the store's configuration. Status is a shared read model consumed by dashboard-card tags and the Stores-tab filter, so every surface stays in sync; the pause/resume write path lives on the Settings tab's Store Status card. Database updates.
