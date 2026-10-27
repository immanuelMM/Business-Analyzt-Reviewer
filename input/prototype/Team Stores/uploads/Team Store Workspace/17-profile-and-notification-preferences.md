---
title: Profile & Notification Preferences
page_id: 4155342851
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155342851
folder: Consumer Storefront
parent: Account, Orders & Cancellation
---

# Profile & Notification Preferences

### Executive Summary & Problem Statement

#### The Problem

Buyers need to manage who they are, where gear ships, and which messages they receive.

#### The Solution

A profile with an identity card (team, name, role/player numbers), account details, shipping addresses, and notification preference toggles. When the account is **associated with a player** (a player/parent account), the profile also surfaces the **player(s) they are linked to**.

### User persona & use cases

**Who is this for?** All registered buyers.

**Scenarios encountered** Updating a shipping address; turning off marketing messages; reviewing linked players.

### Functional Requirements & Core Workflows

#### User Stories

* As a buyer, I want to manage my profile, addresses, and notifications, so that my account stays accurate and quiet where I want.
* As a player/parent account, I want to see the player(s) I'm associated with in my profile, so that I know which roster identities my account is linked to.

#### Acceptance Criteria

* Given I edit an address or toggle a preference, when saved, then the change persists and applies to future orders/notifications.
* Given my account is **associated with a player** (player/parent account), when I open my profile, then I see the **associated player(s)** — with their name and jersey number — listed in my profile. (An account with no player association does not show this section.)

### Metrics & Success Criteria

* Preference-set rate
* Address-error-on-order reduction

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires account persistence and a notification/email service honoring preferences. The associated-player display requires a **roster join** linking the account to one or more roster identities (name + jersey number). Database updates + third-party messaging integration.
