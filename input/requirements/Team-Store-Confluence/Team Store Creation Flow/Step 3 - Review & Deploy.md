---
title: Step 3 - Review & Deploy
confluence_id: 4153311250
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311250/Step+3+-+Review+Deploy
last_modified: 2026-09-22
pulled: 2026-10-26
---
*Updated August 31, 2026: this step's **position in the wizard is now store-type dependent** — step 3 for Individual Team Stores, step 4 for League Stores — and the review summary is extended to cover the settings added to Step 1 and the new League Divisions & Teams step.*

### Executive Summary & Problem Statement

#### The Problem

Without a final confirmation, operators launch stores with wrong dates, pricing, or missing products.

Store creation has also grown. Step 1 now carries roster policy, multiple managers, and a bulk-freight destination address, and League stores build their division and team structure mid-wizard. A review step that summarizes only what it summarized before would quietly stop being a review of the whole store.

#### The Solution

A Review step confirming all settings; deploying shows a loading state, finalizes the store, lands the user in its management dashboard with a success toast, and triggers the onboarding tour for a first-ever store.

**Position in the wizard.** This is **step 3 of 3** in an Individual Team Store and **step 4 of 4** in a League Store, which inserts [Step 2 - Divisions & Teams (League Stores)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4299325441/Step+2+-+Divisions+Teams+League+Stores) between Basics and Add Products. Step-count resolution is specified in *Step 1 — Basics*, Epic A0.

‌

### User persona & use cases

**Who is this for?** Reps completing setup.

**Scenarios encountered** Final sanity check before going live; confirming the jersey-number mode and duplicate-number rule chosen at setup; checking that the right coach is listed as the primary contact and that the bulk shipment has a destination; reviewing a league's divisions and teams before committing; deploying a league store deliberately with no structure yet; first-ever store triggering onboarding.

‌

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want a final review and one-click deploy, so that I can confirm everything and launch confidently.
- As a rep running a league, I want to see my divisions and teams in the review, so that a mistyped or missing team is caught before launch rather than after products are assigned.

#### Acceptance Criteria

- Given I reach Review, when settings render, then all wizard inputs are summarized.
- Given I deploy, when it finalizes, then I land in the store's management dashboard with a success toast (and the onboarding tour if it's my first store).

##### What the summary must cover

The summary mirrors the wizard, so it grows with it. In addition to the store identity, schedule, branding, fulfillment, and tax settings already summarized:

- **Team & Roster** (from *Step 1 — Basics*, Epic D1) — the **Allow Duplicate Numbers** default and the **Jersey Number Selection** mode, both shown as the values that will apply, whether set explicitly or left at their defaults.
- **Managers** (Epic E) — every manager record entered, with the **primary** manager marked as such so it is visible which record the storefront point of contact inherits from.
- **Ship-to destination address** (Epic F) — shown **only** when the fulfillment method is Ship to Team Manager. Given the address was left blank, when the summary renders, then it states that orders cannot be submitted for fulfillment until a destination is added, with a pointer to Settings → Distribution & Fulfillment. This is informational: it does **not** block deploy.
- **Divisions & teams** (League stores only) — counts plus the division and team names built in Step 2. Given no structure was created, when the summary renders, then it says so neutrally and notes that divisions and teams can be added anytime from the My Team(s) tab. It must **not** render as a warning, an error, or an unmet requirement — skipping that step is a supported path.
- **Rosters** (League stores, where players were entered in Step 2) — a player count only. The review does not reproduce player tables.

##### Deploy gate is unchanged

Given the additions above, when the rep deploys, then the only creation requirement remains **at least one product** (see *Step 2 — Add Products*). None of the Step 1 additions and no amount of league structure — including none at all — gates deploy. Launch, separately, still requires at least one **visible** product (see *Launch & Status Controls*).

‌

### Metrics & Success Criteria

- Post-deploy edit rate (lower = better review)
- First-store tour start rate
- Back-navigations initiated from the review, by target step — which summary line is catching the most errors
- Share of League stores deploying with no divisions or teams — the deferral rate, expected and permitted
- Ship-to-Team-Manager stores deploying with no destination address, and how quickly the address is added afterward

‌

---

**Dependency & Technical Constraint**

Requires transactional store creation (atomic persistence of all wizard data) and first-store state tracking. The atomic commit now includes any **divisions, teams, and player records** built in the League Divisions & Teams step — abandoning the wizard must leave no orphaned structure — and the **manager collection** with its designated primary. The **ship-to destination address** must commit to the same persisted field that Settings → Distribution & Fulfillment reads, not a wizard-local copy. The summary is generated from the **resolved step list** for the store type, so the review renders the League-only structure block for League stores and omits it entirely for Individual Team Stores rather than showing an empty section. Database updates.
