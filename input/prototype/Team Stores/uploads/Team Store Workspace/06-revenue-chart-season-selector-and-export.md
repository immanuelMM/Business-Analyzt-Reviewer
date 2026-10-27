---
title: Revenue Chart, Season Selector & Export
page_id: 4153180162
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153180162
folder: Global Navigation
parent: Analytics Dashboard (Overview Tab)
---

# Revenue Chart, Season Selector & Export

### Executive Summary & Problem Statement

#### The Problem

A single number hides seasonality and trend; operators need the shape of revenue over time and the ability to pull it into their own reporting.

#### The Solution

A monthly bar chart with Y-axis ticks and gridlines, a **Team Store selector** in the header to drill the chart down into a specific store (or view the aggregated portfolio), and an Export action.

### User persona & use cases

**Who is this for?** Reps

**Scenarios encountered** Drilling into one team store's revenue curve to see how it's performing on its own; switching between stores to compare; exporting figures for an external report.

### Functional Requirements & Core Workflows

#### User Stories

* As a manager, I want a revenue chart I can drill down to a specific team store and export, so that I can analyze a single store's trend and report externally.

#### Acceptance Criteria

* Given the Team Store selector, when I choose a specific store, then the chart re-renders to reflect only that store's monthly revenue; when I choose the aggregate/all-stores option, then bars reflect the combined portfolio.
* Given I trigger Export, when it completes, then I receive the underlying data for the currently-selected store scope in a portable format.

### Metrics & Success Criteria

* Export used by >40% of managers per period
* Store-selector switch re-renders under 1s

**Dependency & Technical Constraint**

Requires the analytics pipeline plus an export/reporting service (file generation). Series are currently partly hard-coded from seed data.
