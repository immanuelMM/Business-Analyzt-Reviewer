---
title: Active Ordering Windows Monitor
page_id: 4152033291
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152033291
folder: Global Navigation
parent: Analytics Dashboard (Overview Tab)
---

# Active Ordering Windows Monitor

### Executive Summary & Problem Statement

#### The Problem

Time-boxed stores fail quietly when an ordering window closes before buyers complete orders; operators need urgency visibility.

#### The Solution

Per-store progress rows showing days-left (flagged urgent under 7 days), amount raised, and a progress bar.

### User persona & use cases

**Who is this for?** Reps running temporary pop-up / seasonal stores.

**Scenarios encountered** Monitoring a closing window; deciding whether to extend a deadline; nudging a team before close.

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want to see which windows are closing soon and how much each has raised, so that I can intervene before they close.

#### Acceptance Criteria

* Given a store has an ordering window, when fewer than 7 days remain, then the row is flagged urgent.
* Given a window has activity, when the row renders, then it shows amount raised and progress toward goal.

### Metrics & Success Criteria

* Reduce windows closing under target by X%
* Urgent-window engagement (extend/nudge) rate

**Dependency & Technical Constraint**

Requires store schedule data (launch/close dates), live order totals per store, and the window/deadline math — plus a notification service for nudges.
