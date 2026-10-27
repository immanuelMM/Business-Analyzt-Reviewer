---
title: Step 2 - Divisions & Teams (League Stores)
confluence_id: 4299325441
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4299325441/Step+2+-+Divisions+Teams+League+Stores
last_modified: 2026-09-01
pulled: 2026-10-26
---
> **New — August 31, 2026.** League store creation gains a structure step between Basics and Add Products, making the League wizard **four steps** while Individual Team Store creation stays at three. This page specifies that step only; the structure it builds is owned by *Roster Management (My Team(s) Tab)*, Epic 0, and the step-count mechanics by *Step 1 — Basics*, Epic A0.

> *Amended September 1, 2026 — connect-to-team now imports **coach records** from the Team Database (see* [*Step 1 — Basics*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609/Step+1+-+Basics)*, Epic D2). Because the Team Database attaches coaches to individual teams, and this step is where a League store's teams are created, there is an open question about whether per-team coach import belongs here. It is recorded in Epic E below rather than answered — nothing about this step changes until it is decided.*

### Executive Summary & Problem Statement

#### The Problem

A league store's divisions and teams are the architecture everything else keys off — product assignment, pending-order shipping containers, fulfillment mapping, and reporting all read the same structure. Until now that structure could only be built after the store existed, in the My Team(s) tab. A rep setting up a league therefore reached **Add Products** with nothing to assign products to, and had to either assign everything store-wide and correct it later, or abandon the wizard, build the structure, and come back.

The reverse failure is just as real. Reps do not agree on when they want to do this work: usability testing found some want a store standing in minutes with details deferred, and others want everything configured before they leave the wizard. A step that forces either behavior is wrong for half the users.

#### The Solution

A **Divisions & Teams** step, present only for **League Store · Multi-Team Hub** stores, where the rep builds their league's structure before assigning products to it. The step reuses the **same divisions and teams component as the My Team(s) tab** rather than a parallel editor, so structure built here is indistinguishable from structure built later and the two surfaces cannot drift.

Structure is the step's priority; **rosters are available but never demanded**. A rep who wants a store live today creates divisions and teams — or nothing at all — and advances. A rep who prefers to finish everything upfront can populate rosters without leaving the wizard. The step blocks nothing either way.

Two elements of the workspace component are omitted in this context: **branding** and the **team code**, neither of which has a reason to appear in the detail panel during setup.

### User persona & use cases

**Who is this for?** Reps creating a League (Multi-Team Hub) store. The step does not exist for Individual Team Store creation.

**Scenarios encountered** Standing up a 12-team baseball league and naming every team before pricing anything; creating three city divisions and adding teams under each; setting up a league with two standalone teams and no division tier; deferring all structure to the workspace and advancing through an empty step to get a store live the same afternoon; a rep who prefers to finish everything upfront entering full rosters for four teams before reaching Add Products; correcting a mistyped division name mid-setup; discovering at Add Products that a team is missing and stepping back to add it.

### Step scope

The step owns **where** structure is created during store creation. It does not redefine what a division, team, or roster is — that model is owned by *Roster Management (My Team(s) Tab)*.

| Element | In this step | Notes |
| --- | --- | --- |
| **Divisions** | Create, rename, delete | Name only. Brand color and sport are **not** collected here (see Epic B). |
| **Teams** | Create inside a division or standalone, rename, delete | Every team must have a name. Nothing else is required. |
| **Rosters** | Optional, available | A rep may populate a team's roster inline. Never required, never a gate. |
| **Team codes** | Not shown | Generated deterministically on the backend; no rep-facing entry or display during setup. |
| **Branding** | Not shown | Division color, logo, and avatar are absent from the detail panel here. |
| **Coach import** | Not in this step — open question | Coaches attach to teams in the Team Database, and this step creates teams. Whether per-team import belongs here is unresolved (Epic E). |
| **Fulfillment mapping** | Not shown | Manager routing is configured in Settings → Distribution & Fulfillment after the store exists. |

### Functional Requirements & Core Workflows

#### User Stories

- As a rep creating a league store, I want to build my divisions and teams before I add products, so that I can assign products to real teams instead of fixing assignments afterward.
- As a rep in a hurry, I want to skip this step entirely and still get a store live, so that structure is not a launch prerequisite.
- As a thorough rep, I want to enter my rosters here too, so that I can finish setup in one sitting rather than returning to the workspace.
- As a rep, I want this step to look and behave exactly like the My Team(s) tab, so that I am not learning two different structure editors.
- As a rep, I want branding and team codes kept out of my way during setup, so that I am naming teams rather than making design decisions.
- As a rep, I want to step back from Add Products and add a team I missed, so that a forgotten team is a small correction rather than a restart.

##### Epic A — Step placement & navigation

- **Conditional presence:** Given a League Store was selected in Step 1, when the rep advances from Basics, then the Divisions & Teams step is the **second** of four steps. Given an Individual Team Store, the step is absent and Add Products is step 2 (see *Step 1 — Basics*, Epic A0).
- **Never blocking:** Given the step with no divisions and no teams created, when the rep chooses **Next**, then they advance to Add Products with no error, warning, or confirmation. There is no minimum structure.
- **Backward navigation preserves work:** Given structure created in this step, when the rep navigates back from Add Products or Review & Deploy, then every division, team, and roster record is intact and editable.
- **Type-switch discard:** Given structure created here, when the rep returns to Basics and switches the store to Individual Team Store, then the discard confirmation specified in *Step 1 — Basics*, Epic A0 fires before the structure is removed.

##### Epic B — Reused component, with branding and team code omitted

The step renders the **My Team(s) tab's league structure component** — the stats header (divisions · teams · players), the grid of division cards, the standalone-teams list, and the **New Team** / **New Division** actions — as specified in *Roster Management*, Epic 0. It is the same component, not a copy.

- **Single implementation:** Given the component is used in both the wizard and the workspace, when either surface changes, then both change. The structure editor must not be forked; behavior specified in *Roster Management* Epic 0 (create, rename, delete with confirmation, drill-in, division deletion re-homing teams as standalone) applies here without restatement.
- **No branding in the detail panel:** Given a division or team detail panel in this step, when it renders, then brand color, logo, and team avatar are **absent** — not disabled, not empty-stated. Divisions are created with a **name only**; the brand color the workspace collects is not requested here and takes its default.
- **No team code in the detail panel:** Given a division or team detail panel in this step, when it renders, then the team code is **not displayed**. Codes are backend routing keys, generated deterministically, and carry no setup-time meaning (see *Roster Management*, Epic 0 — "Team codes are a backend key").
- **Everything else carries over:** breadcrumbs on drill-in, confirmation on delete, and the standalone-vs-in-division distinction all behave as they do in the workspace.
- **Branding afterward:** given the store is deployed, when the rep opens the My Team(s) tab, then the full detail panel — branding and code included — is available. Nothing omitted here is lost; it is deferred.

##### Epic C — Optional rosters within the step

Structure is the step's purpose, but a rep who wants to finish everything upfront must be able to. Roster behavior is owned by *Roster Management*, Epics 1–4; this section covers only its availability here.

- **Available, not surfaced by default:** Given a team created in this step, when the rep drills into it, then the roster paths from *Roster Management* Epic 1 — the inline **Add Player** row and **Upload Roster** (CSV) — are available. The step's default view is the structure grid, not a player table.
- **Never a gate:** Given a team with no roster, when the rep advances or completes the wizard, then nothing is blocked and no warning fires. A team may exist with no roster indefinitely (see *Roster Management*, Object model).
- **Same records, same rules:** Given a player added here, when the store is deployed, then the record is indistinguishable from one entered in the workspace. Field requirements are unchanged — **First and Last Name only** — and no contact channel is required.
- **Duplicate-number policy applies from creation:** Given the **Allow Duplicate Numbers** default set in *Step 1 — Basics* Epic D1, when a roster is created in this step, then it inherits that value and jersey-number entry follows *Roster Management* Epic 4 — taken numbers render locked and unselectable rather than erroring at submit.
- **Deferral is signposted, not nagged:** helper copy states that rosters can be added at any time from the My Team(s) tab, before or during the ordering window. It reads as information, not as an outstanding task.

##### Epic D — Empty and partial states

- **Empty state:** Given the step with no structure created, when it renders, then the empty state explains what divisions and teams are for, that both are optional, and that they can be added later from My Team(s) — with the **New Division** and **New Team** actions available. It must not present as an error, a validation failure, or an incomplete checklist item.
- **Teams without divisions:** Given the rep creates teams without any division, when the step renders, then the standalone-teams list carries them and no prompt suggests a division is required. A league store with no division tier is a valid configuration.
- **Divisions without teams:** Given an empty division, when the step renders, then it shows a zero-team count without warning. Empty divisions survive to the workspace.

##### Epic E — Per-team coach import — OPEN, not in scope until decided

Connect-to-team now returns the Team Database's **coach records** for rep selection as manager records (*Step 1 — Basics*, Epic D2). In the Team Database those coaches attach to **individual teams**, not only to the organization — and this step is where a League store's individual teams are created. That makes per-team coach import a reasonable thing to want here, and it is deliberately **not specified** until the questions below are answered. **Nothing in this step changes today.**

**Why it is not simply "add it here"**

- **The teams differ in kind.** A team created in this step is a **Team Stores structure record** the rep typed a name into. A team in the Team Database is a record with its own identity, branding, and coaches. There is currently **no binding between them** — connect-to-team binds the **store** to a database team, not each wizard-created team. Per-team coach import would require per-team binding, which is a materially larger change than adding a picker.
- **It would reintroduce the burden this step removed.** The step exists partly because reps disagree about how much to configure upfront, and it blocks nothing by design. A coach-selection surface on every team in a 12-team league is exactly the kind of per-team obligation the step was written to avoid.
- **Managers are configured after the store exists.** Fulfillment mapping — the feature that actually consumes per-team managers — is explicitly out of this step and lives in Settings → Distribution & Fulfillment. Importing coaches here would put the data in before the surface that uses it exists.

**Questions to resolve**

1. Should a wizard-created team be **bindable to a Team Database team**, or does the store-level binding remain the only one? Everything else depends on this.
2. If per-team binding exists, do imported coaches land in the **single store-level manager collection** (Epic A2c of *Store General Settings*) with a team association, or does the manager model gain a per-team scope? The collection is currently flat and store-scoped.
3. Would per-team coaches **pre-populate Order Fulfillment Mapping**, which is where per-division and per-team managers are actually used? That is the strongest argument for the feature, and it is a Settings concern rather than a wizard one.
4. Is the right home for this the **My Team(s) tab** rather than the wizard — where a rep manages teams over the season, with no time pressure and with fulfillment mapping adjacent?

**Interim behavior.** Until these are answered, coach import happens **only at store level**, from the connect-to-team component in *Step 1 — Basics* Epic D2 and *Store General Settings* Epic A1. Managers imported there populate the pool that Order Fulfillment Mapping draws on, so a League rep who imports coaches at store level can still assign them per division or team afterward without retyping.

### Metrics & Success Criteria

- **Share of League stores advancing through this step with no structure created** — the deferral rate the step is explicitly designed to permit
- **Share of League stores entering rosters during creation vs. deferring to the workspace** — a direct read on whether both rep behaviors are being served
- Divisions and teams created per League store at creation, vs. the store's eventual total — how much structure work genuinely wants to happen upfront
- Product assignments corrected in the workspace within 7 days of launch — expected to fall, since products can now be assigned to real teams in Add Products
- Back-navigation from Add Products into this step — a proxy for structure discovered missing too late
- Median time spent in this step, split between the skip path and the fully-configured path
- Type-switch discards triggered from this step — should be rare
- Structure-editor defects reported against only one of the two surfaces — target zero, and a direct check on whether the component stayed unforked
- **Manager records hand-entered into Order Fulfillment Mapping for League stores that had already imported coaches at store level** — a read on whether store-level import is sufficient for leagues, and the evidence that should settle Epic E

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires the **division / team / roster architecture** as shared platform state, exactly as specified in *Roster Management (My Team(s) Tab)* — product assignment (Products tab), pending-order shipping containers (Orders tab), and Settings manager mapping all read the same structure, so structure created in the wizard must be written to that same state and not to a wizard-local staging model.

The structure editor must be **extracted as a single shared component** consumed by both this step and the My Team(s) tab, parameterized to suppress **branding** (division brand color, logo, team avatar) and the **team code** in the detail panel without forking behavior. Suppression is presentational: **team codes are still generated deterministically** on creation for order routing and reporting, and division brand color still takes its default — both are simply not exposed here.

Because structure is created **before the store is persisted**, creation must be **transactionally consistent with store deploy** (*Step 3 — Review & Deploy*): divisions, teams, and any player records built in the wizard commit atomically with the store, and abandoning the wizard leaves no orphaned structure. The step also depends on the **resolved step list** from *Step 1 — Basics* Epic A0 and on that spec's discard-confirmation path for League → Individual switches, which must delete wizard-held structure without touching any other wizard state.

Optional roster entry reuses the existing roster paths in full — the **CSV template generator** and parse/validation engine with per-row/per-cell reporting and skip-and-import semantics, field-level validation with **First and Last Name as the only required fields**, and the **per-roster taken-number set** driving locked number selection. Rosters created here read the store-level **Allow Duplicate Numbers** default written in Step 1, consistent with new-roster inheritance elsewhere.

**Per-team Team Database binding is not a dependency of this step** and must not be built speculatively. Team Stores structure records currently carry no reference to a Team Database team; only the **store** is bound. Should Epic E resolve in favor of per-team import, that binding — and any per-team scoping of the manager collection — becomes a new dependency to be specified then. Shared internal team services + database updates.
