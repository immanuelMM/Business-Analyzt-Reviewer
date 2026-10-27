---
title: Roster-Matched Account Creation & Multi-Player Management
page_id: 4152623289
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152623289
folder: Consumer Storefront
parent: Storefront Landing & Account Onboarding
---

# Roster-Matched Account Creation & Multi-Player Management

### Executive Summary & Problem Statement

#### The Problem

Parents managing multiple players, and players themselves, must be linked to the correct roster spot(s) without manual lookup.

#### The Solution

Account creation matches the invite email to the team roster and pre-fills the user's player(s); parents can manage multiple players and add a player inline (first/last, jersey #, name-on-jersey).

### User persona & use cases

**Who is this for?** Players and parents/guardians (especially multi-child households).

**Scenarios encountered** A parent with two kids on the team; a player matched automatically; adding a player not yet on the roster.

### Functional Requirements & Core Workflows

#### User Stories

* As a parent, I want my email matched to my players and the ability to add more, so that I manage everyone's gear in one account.

#### Acceptance Criteria

* Given my email matches the roster, when I create an account, then my linked player(s) are pre-filled.
* Given a player is missing, when I add first/last, jersey #, and name-on-jersey, then they are added to my account.

### Metrics & Success Criteria

* Auto-match success >90%
* Multi-player accounts correctly linked

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires real authentication/accounts and genuine roster integration for email-to-roster matching and roster edits. Shared internal team services + database updates.
