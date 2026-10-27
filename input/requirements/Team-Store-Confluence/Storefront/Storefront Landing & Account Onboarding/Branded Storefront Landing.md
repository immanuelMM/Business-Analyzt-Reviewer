---
title: Branded Storefront Landing
confluence_id: 4153606269
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153606269/Branded+Storefront+Landing
last_modified: 2026-09-22
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

The team store link is **public** — there are no private stores, so anyone with the URL can open it. A coach typically shares it with parents (where it reads like an invitation), but the same link is also how fans arrive. The store still needs to immediately tell each visitor what this store is and route them to the right experience — and, critically, prevent non-team buyers from purchasing team-required / team-supplied gear.

#### The Solution

A branded storefront landing (“Grizzlies Basketball Team Store · Spring 2026”) with two role cards — **Player/Parent** (Access Team Gear) and **Fan/Supporter** (Shop Fan Gear) — plus create-account and sign-in entry points. Role selection isn’t cosmetic: because stores aren’t private, role choice is how the store **gatekeeps team gear** — team-required/supplied items are only unlocked for users who sign up as **Player/Parent** using the **same email associated with their player on the roster**.


### User persona & use cases

**Who is this for?** Players, parents/guardians, fans/supporters.

**Scenarios encountered** A parent opening the link a coach shared with them (reads like an invitation, but it’s just the storefront URL); a fan who found the same link and has no roster spot; a returning buyer signing in.

### Functional Requirements & Core Workflows

#### User Stories

- As any visitor with the link, I want a branded landing and a clear role choice, so that I get the right experience immediately.
- As a player/parent, I want choosing my role to unlock my team gear, so that I can buy the required items the coach expects me to.
- As the store rep, I want team gear gated behind the Player/Parent role + roster-email match, so that non-team buyers on a public link can’t purchase team-required/supplied items.

#### Acceptance Criteria

- Given anyone opens the store link (no invitation/token required), when it renders, then the team/season branding and the two role cards are shown.
- Given I select a role, when chosen, then I proceed to account creation or sign-in for that role.
- Given I choose **Player/Parent**, then access to team-required/supplied gear is contingent on signing up with the **email associated with a player on the roster** (roster match enforced in account creation).
- Given I choose **Fan/Supporter** (or can’t match the roster), then I can shop **Fan Gear only** and team gear stays locked.


### Metrics & Success Criteria

- Invite→role-selection rate \>85%
- Correct-role selection (low role-switch rate)

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

No invite-token system — the store link is a **public URL** anyone can open. Requires the store’s branding from config and, because there are **no private stores**, **role-based gating** of team gear backed by a **roster email-match** check at account creation (team-required/supplied gear unlocks only for Player/Parent accounts whose email matches a roster entry). Database updates + shared team services.
