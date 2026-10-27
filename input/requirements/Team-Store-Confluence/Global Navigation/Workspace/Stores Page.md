---
title: Stores Page
confluence_id: 4153344001
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153344001/Stores+Page
last_modified: 2026-10-09
pulled: 2026-10-26
---
**Audit update — July 17, 2026** — this spec was audited against the current Team Stores Workspace prototype. Sections marked **UPDATED** or **NEW** reflect changed or new behavior — most notably the **ownership sub-tabs** (All / My / Joined Stores), the toolbar (filter, sort, search), and changes to the store card itself. Unmarked sections were verified as still accurate. Items tagged **NOT IN PROTOTYPE** are agreed logic requirements the prototype does not yet demonstrate.

### Executive Summary & Problem Statement

#### The Problem

Operators with many stores need to scan, distinguish, and act on each. Managing reps additionally oversee stores created by the reps under them, so the directory must separate what they own from what they merely have access to.

#### The Solution *(updated)*

A store card grid with team crest, store name, status pill, **store type** (Team Store / League Store), and **created-by attribution**. Location is no longer shown on the card — it lives in the toolbar's filter instead. Sport is no longer shown on the card. Each card opens the management workspace via an explicit **Manage Store** button, the header rolls up portfolio stats (store count + total revenue), and **ownership sub-tabs** scope the grid for managing reps.

### User persona & use cases

**Who is this for?** Reps running multiple stores, including **managing reps** who oversee other reps and need visibility into the stores those reps create.

**Scenarios encountered** Locating a store to manage; checking a store's status; separating drafts from open stores at a glance; distinguishing single-team from league stores; filtering by status, sport, or location; a managing rep reviewing the stores their reps have created; archiving a finished store.

### Functional Requirements & Core Workflows

#### User Stories

- As an operator, I want a store list showing status, so that I can find and open the right store.
- *(new)* As a managing rep, I want to switch between all stores, my stores, and the stores my reps created, so that I can review my team's work without losing track of my own.
- *(new)* As a rep, I want to filter, sort, and search the directory, so that I can find one store among many in seconds.
- *(new)* As a rep, I want to create and archive stores from the directory, so that store lifecycle actions don't require entering each workspace.

#### Acceptance Criteria — base directory

- Given I open Stores, when the list of cards renders, then each store shows logo, store name, status, **store type**, and **"Created by"** attribution. **Location is no longer displayed on the card** — it is available as a toolbar filter. **Sport is no longer displayed on the card.** *(updated)*
- Given I click a store, when it opens, then I land in that store's management workspace. **Updated:** opening is via the card's explicit **Manage Store** button (or the kebab menu's Edit) — the card body itself is not click-to-open.

#### Epic A — Directory header & portfolio stats (NEW)

- The header shows a **store count** and **total revenue** rollup that recompute against the current scope — sub-tab, filter, and search all narrow the stats along with the grid.
- **Add Store** sits in the header toolbar and launches the store-creation wizard directly from the directory.
- **Zero state:** a rep with no stores sees a first-run empty state with a single **"Create Your First Store"** action — no sub-tabs, stats, or toolbar.

#### Epic B — Ownership sub-tabs & rep-hierarchy visibility (NEW)

Directory scope is driven by the rep hierarchy. A **managing rep** (a rep with other reps working under them) sees three sub-tab pills with counts: **All Stores**, **My Stores**, and **Joined Stores**.

- **My Stores** — stores the logged-in rep created themselves.
- **Joined Stores** — the stores **created by the reps working under them**. This tab is a roll-up of their reps' work, not stores the managing rep was invited to.
- **All Stores** — the union: every storefront the logged-in rep has access to (their own plus their reps').
- **NOT IN PROTOTYPE — Non-managing reps:** a rep with **no reps under them** does **not** see the All / My / Joined sub-tabs at all — the directory renders as a single flat list of **their own stores**, since that is the full extent of their access. The prototype only demonstrates the managing-rep view.
- **Empty scope messaging:** an empty My Stores reads "You haven't created any stores yet."; an empty Joined Stores reads "No stores have been shared with you yet."

#### Epic C — Filter, sort & search (NEW)

- **Filter** exposes **Status** (Open / Draft / Closed), **Sport**, and **Location** sub-menus; options are derived from the stores currently in scope so a choice never points at absent data. The button relabels to the active filter ("Filter: Basketball"). *(updated — On Hold removed; it was an earlier name for Closed, not a separate status)*
- **Sort** offers Name (A-Z / Z-A) and Revenue (high-to-low / low-to-high); default is Name (A-Z).
- **Search** matches store name, team name, sport, and city as you type; no-match states name the offending filter ("No stores match 'Football'.").

#### Epic D — Store card & lifecycle actions (UPDATED)

- **Status pill** has four states — **Draft** (not yet launched), **Open**, **Closed**, and **Archived**. There is no On Hold status; it was an earlier name for Closed. *(updated)*
- **Archived cards appear only in the Archived Stores section of the Account page.** Archived stores are excluded from the directory, so the Archived state never renders on the Stores tab. *(new)*
- **Store type** distinguishes **Team Store** (single team) from **League Store** (multi-team hub). It is a text label on the card, beneath the store name — the separate store-type badge has been removed. *(updated)*
- **Crest** renders the uploaded team logo, falling back to a two-letter monogram circle in the team's primary color.
- A **kebab (3-dot) menu** on each card exposes **Edit** (opens the workspace), **Visit Store** (the live storefront), and **Archive**. **Create Template has been removed from this menu.** *(updated)*
- **Manage Store** reads the same in every state, including Closed and Archived — the control describes where it goes (the Manage Store workspace) rather than the store's status. *(new)*
- **Archive confirmation:** archiving warns that the storefront is hidden from buyers immediately, new orders stop, any active ordering window closes, and the store leaves the active list; order history and reports are retained, and the action is reversible only by support.

### Metrics & Success Criteria

- Store-find time under 5s
- Misopened-store rate near zero
- *(new)* Correct ownership scoping: a rep never sees a store outside their hierarchy, and Joined counts reconcile with their reps' created stores

### Dependencies & Technical Constraints

Requires the store service with a **status lifecycle** (draft → open → closed → archived) and **per-store revenue rollups** for the header stats and revenue sort. Ownership scoping requires **rep-hierarchy data** — each store's creator rep id joined to a manages-reps relation — to compute All / My / Joined membership **and to gate whether the sub-tabs render at all** (managing reps only; non-managing reps get a flat own-stores list). Card actions need an **archive write path** and the store's public storefront URL for Visit Store. Filter/sort/search run client-side over the directory payload (name, sport, city, status, revenue per store).
