---
title: Top Performing Stores Leaderboard
confluence_id: 4152852486
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152852486/Top+Performing+Stores+Leaderboard
last_modified: 2026-09-22
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

Managers can’t tell which stores drive the portfolio or which need attention.

#### The Solution

A ranked table (Store · Orders · Revenue · Trend) with per-row navigation directly into the store management workspace and an “All stores →” shortcut.


### User persona & use cases

**Who is this for?** Reps prioritizing where to spend operational effort.

**Scenarios encountered** Finding the top earner to replicate; spotting an underperformer; jumping straight into a store from the ranking.Functional Requirements & Core Workflows


### Functional Requirements & Core Workflows

#### User Stories

- As a manager, I want a store leaderboard with click-through, so that I can prioritize and act on the right store immediately.

#### Acceptance Criteria

- Given the leaderboard renders, when I click a row, then I am navigated into that store’s management workspace.
- Given more stores exist than shown, when I click All stores, then I am taken to the full store list.


### Metrics & Success Criteria

- Leaderboard row click-through \>25%
- Faster path to a store than via the Stores tab


**Dependency & Technical Constraint**

Requires the analytics read model ranking stores by orders/revenue with trend, joined to each store’s management route.
