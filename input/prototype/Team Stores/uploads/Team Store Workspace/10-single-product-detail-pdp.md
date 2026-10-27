---
title: Single Product Detail (PDP)
page_id: 4154195969
confluence_url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154195969
folder: Consumer Storefront
parent: End-User Product Configuration
---

# Single Product Detail (PDP)

### Executive Summary & Problem Statement

#### The Problem

Custom gear requires correct name, number, size, and quantity; getting any wrong produces unwearable product.

#### The Solution

A PDP with image + status badge, price (MSRP/waived treatment), collapsible info accordions (Description, Material, Fit, Decoration, Size Chart), related products, and a sticky Add-to-Cart bar showing the line total. Its core is the **product configuration flow** — **Name on Jersey**, **Player Number**, and **sizing** — for users associated with a rostered player. This flow and the page's structure/meta-data are **shared with the Bundle / Uniform Kit Configurator** (which repeats this same flow per item, and per player when more than one).

### User persona & use cases

**Who is this for?** Players/parents (personalized) and fans (fan gear).

**Scenarios encountered** A player ordering a personalized jersey; a fan buying a tee; checking the size chart before choosing.

### Functional Requirements & Core Workflows

#### User Stories

* As a rostered player/parent, I want to enter name on jersey, player number, and size, so that I order a correctly personalized item.
* As a buyer, I want the system to only let me pick an available jersey number, so that I don't accidentally duplicate a teammate's number.
* As a player/parent, I want any details the coach already entered to be pre-filled, so that I only fill in (or correct) what's left.

##### Epic A — Product configuration flow (shared with bundles)

* Given I am associated with a rostered player, when the PDP loads, then the configuration flow collects **Name on Jersey**, **Player Number**, and **size** for that player.
* Given required fields (size, personalization) are set and valid, when complete, then Add-to-Cart is enabled and shows the line total.
* **This exact flow is reused by the Bundle / Uniform Kit Configurator** — once per item, and repeated per player when configuring for multiple players.

##### Epic B — Jersey-number validation

* **Numeric range:** Given the **Player/Jersey Number** field, when the buyer types, then it accepts **only numeric values** in the range **00–99**.
* **Uniqueness:** Given jersey numbers **cannot be duplicated**, when the buyer enters a number, then the system **only allows available numbers**; entering a number already taken throws an inline error: _"That number is taken."_

##### Epic C — Roster pre-fill & write-back

Reps are only _required_ to enter a player's first/last name, contact email, and contact phone in the roster — jersey number and name on jersey are optional there, which drives three cases at configuration time:

* **Rep left both blank → buyer enters them:** Given the roster has **no** jersey number / name on jersey for the player, when the player/parent configures, then both fields are **empty and editable** for the buyer to enter.
* **Rep filled them → pre-filled:** Given the roster **has** these values, when the player/parent configures, then the **Jersey Number** is **pre-filled and visible but disabled**, and **Name on Jersey** is **pre-filled but editable** (so buyers can fix a misspelling).
* **Write-back:** Given the rep left jersey number / name on jersey blank, when the player/parent enters them while ordering, then that information **feeds back into the roster** — letting player/parents complete the remaining roster data on the rep's behalf.

### Metrics & Success Criteria

* PDP→add-to-cart conversion
* Size/personalization error rate near zero
* Duplicate-number errors caught before checkout
* Roster fields completed via storefront write-back

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires catalog/variant data, the pricing-coverage engine for MSRP/waived display, and **roster pre-fill** with field-level state (jersey number visible-but-disabled when set; name on jersey editable). Needs a **real-time jersey-number availability check** (numeric **00–99**, unique across the roster) and a **storefront → roster write-back** path so buyer-entered numbers/names populate empty roster fields. _Note: the roster-management spec lists jersey number as 0–99; reconcile the accepted range (00–99 here) before build._ Shared catalog + roster services.
