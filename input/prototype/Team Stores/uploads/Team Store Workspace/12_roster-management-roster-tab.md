# Roster Management (Roster Tab)

### Executive Summary & Problem Statement

#### The Problem

The storefront's roster matching and pre-filled personalization depend on an accurate roster, which changes during a season. Without a populated roster there is no secure verification gate for team-required and team-supplied items at parent checkout.

#### The Solution

A dedicated **Roster tab** inside the Team Store platform that lets store managers (coaches or sales reps) populate — or pre-populate before going live — the store's roster. This powers email-to-roster matching, pre-filled names/numbers on the storefront, and the secure verification gate during the parent checkout flow.

### User persona & use cases

**Who is this for?** Reps, team managers

**Scenarios encountered** Pre-populating a roster before launch; adding a small team or late player one-by-one; importing a large roster via CSV; correcting a player's details or jersey number; removing a player and releasing their number back into the pool.

‌

### Each roster record must contain the following defined schema

| Field | Required | Type / Validation | Notes |
| --- | --- | --- | --- |
| First Name | Required | String, max `50` characters |  |
| Last Name | Required | String, max `50` characters. |  |
| Jersey Number | Required | Integer, `0`–`99` | Must be unique on the active roster. |
| Name on Jersey | Optional | String, max `15` characters | Converted to **UPPERCASE** dynamically. |
| Contact Email | Required | Valid email format. | Used for parent/guardian communication and roster matching. |
| Contact Phone Number | Required | String, validated to a `10`-digit numeric format |  |

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a rep or team manager, I want to add a player to the roster manually, so that I can quickly input a small team or make singular late adjustments.
* As a rep or team manager, I want to download a template, populate it, and re-upload it, so that I can quickly import a large roster of players.
* As a rep or team manager, I want to edit any field of an existing player's record, so that I can correct spelling or update contact details.
* As a rep or team manager, I want to remove a player from the active roster, so that their jersey number is released back into the pool of available numbers.

##### Epic 1 — Filling the roster

**Add manually (1-by-1).** Inline form or drawer modal containing all player data fields.

* Given the add form/drawer, when it opens, then it contains all player data fields from the schema above.
* **Real-time duplicate validation:** Given the entered **Jersey Number** already exists on the active roster, when the field is evaluated, then an inline error is thrown: _"Number \[X\] is already assigned to \[Player Name\]."_
* Given a valid record, when I click **\[ Save Player \]**, then the record is added to the roster table instantly.

**Roster data import (batch CSV).**

* Given the roster tab, when I click **"Download CSV Template,"** then a structured `.csv` skeleton exports with headers matching the data model.
* Given the drag-and-drop upload zone, when I drop a file, then it accepts `.csv` files up to **5 MB**.
* Given an uploaded file, when the parse engine validates all rows and validation fails, then a clear inline error log pinpoints exactly which row and cell contains the error (e.g., _"Row 12: Invalid Email Format"_).

##### Epic 2 — Managing & editing player records

**Edit player details.**

* Given a player row, when I click the **Edit (pencil)** icon, then the manual input modal opens pre-populated with the player's current details.
* Given I change a jersey number on save, when it collides with another active player, then the duplication constraint still applies and the save is blocked with the inline error.

**Delete player.**

* Given a player row, when I click the **Delete (trash)** icon, then a confirmation modal appears: _"Are you sure you want to remove \[Player Name\] from the roster? This will delete all saved custom details."_
* Given the confirmation, when I confirm deletion, then the record is removed instantly and the associated jersey number is freed back into the available pool.

### Metrics & Success Criteria

* Roster-match success rate on the storefront >90%
* Roster edit→storefront latency
* CSV import success rate; rows rejected per upload
* Manual add → save completion without duplicate-number errors
* Roster fully populated before launch (verification-gate readiness)

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires genuine team-database integration: roster sync, email matching, and member/role management. Field-level validation must enforce the schema (string max-lengths, jersey integer **0–99**, valid email, **10-digit** phone) with **real-time uniqueness checks** on jersey number. The batch path needs a **CSV template generator** and a parse/validation engine that accepts files up to **5 MB** and returns **per-row / per-cell** error reporting. Deleting a record must release its jersey number back into the available pool. Shared internal team services + database updates.
