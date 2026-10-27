---
title: Bundle / Uniform Kit Configurator
page_id: 4154130449
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130449
folder: Consumer Storefront
parent: End-User Product Configuration
---

# Bundle / Uniform Kit Configurator

### Executive Summary & Problem Statement

#### The Problem

Ordering a uniform kit (e.g. a jersey + pant) means getting several items' sizes, numbers, and names right — and a household ordering for multiple players faces that same task repeated, combinatorially and error-prone.

#### The Solution

A configurator that **shares the PDP's page structure, meta-data, and personalization flow** (see Single Product Detail) and applies it to every item in the bundle. **Bundles work for a single player too** — they are _not_ exclusive to multi-player accounts; a one-player bundle (jersey + pant) uses the identical flow. When configuring for **multiple players**, the same flow simply repeats — the buyer enters **Name on Jersey, Jersey Number, and sizing once per player**. Each player gets an expandable kit card with per-item size + personalization, an include/exclude checkbox, a "copy sizes from [player]" shortcut, readiness indicators (e.g. "1/2 sizes", "Ready"), and a coverage/savings callout; the sticky bar tallies kits/items and the grand total, disabled until all required sizes are set.

### User persona & use cases

**Who is this for?** Any rostered player/parent ordering a bundle — a single player buying a one-player kit, or a parent with multiple players.

**Scenarios encountered** A single player configuring a jersey + pant bundle; a parent configuring kits for two kids; copying one child's sizes to another; excluding an already-owned item.

### Functional Requirements & Core Workflows

#### User Stories

* As a single player, I want to configure a multi-item bundle in one flow, so that ordering a kit is as simple as a single product.
* As a parent with multiple players, I want a per-player kit configurator with copy and readiness cues, so that I correctly order full kits for everyone at once.

#### Acceptance Criteria

* **Shared config flow:** Given any item in a bundle, when configured, then it uses the **same Name-on-Jersey / Jersey-Number / size flow as the PDP** — including the **00–99 numeric + uniqueness** validation and the **roster pre-fill / write-back** rules (defined in Single Product Detail, Epics B–C).
* **Single player:** Given a bundle and one associated player, when I configure, then I complete the flow **once** for that player across the bundle's items.
* **Multiple players:** Given multiple players, when I configure, then each gets a kit card and I enter name/number/sizing **per player**, with per-item include/exclude.
* Given I use copy-sizes, when applied, then sizes transfer to the target player.
* Given any required size is unset, when I try to add, then the sticky Add bar stays disabled and readiness shows what's missing.

### Metrics & Success Criteria

* Single- and multi-player kit completion rate
* Reduce size errors on kit orders by X%
* Copy-sizes usage

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires the roster (players per account, including the **single-player** case), catalog kit definitions, coverage/savings computation, and the **shared PDP configuration flow** — reusing its **jersey-number validation (00–99, unique)** and **roster pre-fill / write-back** logic rather than duplicating it. Shared catalog + roster services.
