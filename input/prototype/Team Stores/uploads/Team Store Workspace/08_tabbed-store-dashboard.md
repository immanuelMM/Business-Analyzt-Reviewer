# Tabbed Store Dashboard

The operational home for a single store, opened without marketing chrome — tabbed General / Products / Roster plus launch controls.

### Executive Summary & Problem Statement

#### The Problem

Running a live store means editing settings, catalog, and roster in one place without distraction.

#### The Solution

A focused full-height workspace that drops the storefront chrome, with General / Products / Roster tabs, plus the ability to view the live storefront, switch stores, and open the Customizer.

‌

### User persona & use cases

**Who is this for?** Store owners

**Scenarios encountered** Editing store details; jumping to the live storefront; switching to another store without leaving the workspace.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As an owner, I want a tabbed, chrome-free store workspace, so that I can operate one store efficiently.

#### Acceptance Criteria

* Given I open a store, when the workspace loads, then marketing chrome is hidden and General/Products/Roster tabs are available.
* Given I choose View live storefront, when it opens, then I see the consumer view of this store.

‌

### Metrics & Success Criteria

* Tab task-completion time
* Workspace bounce rate

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires the store data model and a link from management state to the rendered storefront instance.
