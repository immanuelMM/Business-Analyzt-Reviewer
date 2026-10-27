---
title: Workspace
confluence_id: 4153245697
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153245697/Workspace
last_modified: 2026-10-19
pulled: 2026-10-26
---


### Executive Summary & Problem Statement

#### The Problem

Once inside, reps juggle distinct mental models — portfolio analytics, the store list, and what they are earning — and need to jump between them and find any store instantly. Account-level destinations — the rep's own profile, their brand Customizer, portfolio-wide orders, the stock library, portfolio-wide settings, and signing out — have no home in the header, and adding a nav tab for each would put occasionally-visited pages on equal footing with the three working views.

#### The Solution

A sub-tab bar (**Overview / Stores / Earnings**) carrying live store counts, plus a section-wide global search field on the right that swaps the content region without a full reload. Each sub-tab exposes its own contextual controls: the **Overview** tab carries a team store selector and an Export action in its header; the **Stores** tab carries Filter and Sort dropdowns; the **Earnings** tab carries its own month selector and sub-tabs, owned by its spec rather than by the header. Account-level destinations are collected into a single **account menu** under the rep's name at the far right of the header — persistent across all three sub-tabs, and not a navigation surface.

### User persona & use cases

**Who is this for?** Reps managing more than one store or league.

**Scenarios encountered** Switching from reviewing KPIs to editing a specific store; checking what the month's commission came to; narrowing the store list to only stores I own vs. stores shared with me; sorting a large portfolio by name or revenue; exporting a season's analytics snapshot; confirming how many active stores exist at a glance; opening the Stock Vault from the account menu to review stock blanks reusable across stores; jumping back to the brand Customizer I came from without losing the workspace; being a rep with no Customizer connected and never seeing that item at all; going to my account page to connect one; reaching portfolio-wide orders from wherever I am; changing my primary brand; signing out.

### Functional Requirements & Core Workflows

##### Epic A — Sub-tab navigation & global search

- As an operator, I want sub-tabs with live counts and a search field, so that I can pivot between analytics, stores, and earnings and find any record fast.
- Given I am in the Team Stores section, when I select a sub-tab, then the content region swaps to that view and the active tab is visually indicated.
- Given I type in global search, when results match a store, then matching records are surfaced for direct navigation.
- Given the main navigation, when I select **Earnings**, then the workspace-level earnings page renders in the content region — commission report and sales breakdown across every store on the workspace, under a single month selector, per [Earnings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4377968641/Earnings). The tab shows active state like Overview and Stores.
- **Three tabs only.** Given the main navigation, then the tabs are **Overview / Stores / Earnings** and nothing else.
    - **Stock Vault is not a nav tab.** It is reached from the **account menu** (Epic D). The dedicated workspace-level page itself is unchanged — only its entry point moved.
    - **Workspace Settings is not a nav tab.** It is reached only from the account menu, and that is its sole route.
    - **Catalog Templates is not a nav tab.** Templates are reachable as a source within Add Products, in the store workspace and at Step 2 of store creation — see *Product Catalog Management*, Epic M.
    - **There is no Settings tab.** The one that appeared in the prototype was never specified and is removed.

##### Epic B — Overview tab: store selector & Export

- As a rep, I want a store selector with multi-selection capabilities in the Overview header, so that the dashboard KPIs and panels can reflect a specific store(s) I'm reviewing rather than all-time totals.
- As a rep, I want an Export action on the Overview, so that I can pull a snapshot of the current portfolio analytics out of the platform for reporting.
- Given the store and Export controls, when I am on any other sub-tab (**Stores, Earnings**), then those controls are not shown — they are scoped to Overview only. The Earnings tab carries its own month selector and exports, specified in that page rather than here, and the two must not be conflated: the Overview selector scopes analytics by store, the Earnings selector scopes a settlement month.
- Given I am on the Overview tab, when I open the Store selector (defaulting to none selected), then I can choose a store scope and the dashboard metrics recompute against it.
- Given I am on the Overview tab, when I click Export, then a snapshot of the currently-scoped analytics is produced for download in a portable format.

##### Epic C — Stores tab: Filter & Sort controls

- As a rep, I want Filter and Sort dropdowns on the Stores tab, so that I can narrow a large portfolio and order it the way I want to scan it.
- Given the Stores tab toolbar, when I open the Filter dropdown, then I can choose **All**, a **Status** group, a **Sport** group, and a **Location** group — where the Sport and Location options are derived from the stores actually in scope so a choice never points at absent data.
- Given I apply a filter, when the grid re-renders, then only stores matching that filter remain, and if none match, an empty state reads “No stores match “\[filter\]”.”
- Given the Sort dropdown, when I open it, then I can choose **Name (A–Z)**, **Name (Z–A)**, **Revenue (high to low)**, or **Revenue (low to high)**, defaulting to Name (A–Z).
- Given I apply filter and sort together, when the grid re-renders, then both compose (filter narrows the pool, sort orders the result).
- **Status vocabulary follows the lifecycle spec** — Draft, Open, Closed, Archived (*Store Status & Lifecycle*, Epic G). The filter must not offer "Active" or "On Hold", which are retired terms.

##### Epic D — Account menu

- As a rep, I want my account-level destinations collected under my name, so that profile, brand, orders, the stock library, settings, and sign-out are one gesture away from anywhere in the workspace.
- As a rep, I want the menu to open rather than navigate, so that clicking my name never strands me on a page I didn't ask for.
- As a rep with no Customizer connected, I want that item absent rather than present and broken, so that the menu only ever offers me things I can actually use.

**Placement and persistence**

- Given the workspace header, then the rep's account avatar sits at the far right with a disclosure chevron, on every sub-tab. The menu is **persistent** — it is not one of the per-sub-tab contextual controls described in Epic B and Epic C, and it does not change with the active tab.

**Trigger**

- **Click opens, it does not navigate.** Given the rep's name or avatar, when the rep clicks it, then the menu opens. It **does not** navigate to My Account — this replaces the prior behavior where the name was a direct link.
- **Hover opens.** Given the rep's name or avatar, when the rep hovers it, then the same menu is presented, without a click.
- Given the menu is open, when the rep clicks outside it, presses Escape, or moves focus away, then it closes with no navigation.
- **Non-pointer equivalents.** Given a keyboard or touch user, then the menu is reachable and dismissible without hover — hover is an additional affordance, never the only one. No shared page in these specs owns menu interaction patterns, so keyboard focus order, Escape handling, and the touch equivalent of hover are owned here.

**Items and destinations**

Six items at most, in this order. Every item carries a leading icon.

| Item | Destination | Target | Always present? |
| --- | --- | --- | --- |
| **My Account** | The rep account page — [Rep Account & Brand Customizer Access](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4189650945/Account+Page) | **In-app**, same tab | Yes |
| **Customizer** | The rep's **primary brand** Customizer, per the primary-brand session state set at landing | **New browser tab** | **No** — only when a Customizer is connected |
| **Orders** | The portfolio-wide [All-Stores Orders Page](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4164812801/All-Stores+Orders+Page) | In-app, same tab | Yes |
| **Stock Vault** | The workspace-level [Stock Vault](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4275109889/Stock+Vault) page | In-app, same tab | Yes |
| **Workspace Settings** | [Workspace Settings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4301389828/Workspace+Settings) | In-app, same tab | Yes |
| **Logout** | Ends the Team Stores session | See OPEN below | Yes |

- **My Account — in-app.** Given the menu, when the rep selects My Account, then the rep account page opens **in the app, in the same tab**. It is not a new tab and not an external destination.
- **Customizer — conditional, primary brand, new tab.** Given a rep with a **connected Customizer**, when the menu renders, then the Customizer item is present; when the rep selects it, their **primary brand Customizer** opens in a **new browser tab**, resolved from the primary-brand session state established by the welcome modal or the logged-out sign-in path ([Team Stores Landing Page](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311233/Team+Stores+Landing+Page), Epics A2 and B). This is the reverse of the Customizer → Team Stores launch, and uses the same new-tab treatment so neither side loses work. The menu does **not** present a brand picker — changing which brand is primary is done on the account page.
    - **Absent, not disabled.** Given a rep with no connected Customizer, then the item **does not render** and the menu closes to five items. It is not shown greyed out, and no explanatory copy takes its place — an item a rep can never use is noise, not information.
    - **Connecting one is done on the account page.** Given a rep with no connected Customizer, when they want to connect one, then they do so from the rep account page ([Rep Account & Brand Customizer Access](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4189650945/Account+Page)), which is already where primary brand is changed — one page owns the rep's brand relationships rather than splitting them between a page and a menu. **The menu carries no connect affordance of its own**, which is the same ruling as *absent, not disabled* above: a row existing only to say the thing is unavailable is the disabled row this spec just rejected. That the capability lives there should be stated on the account page; see the note in Dependencies.
- **Orders — second entry point.** Given the menu, when the rep selects Orders, then the All-Stores Orders page opens. This is an **additional** entry point alongside the Overview Orders KPI card, and it is available from Stores and Earnings, not only Overview — the origin-aware breadcrumb this requires is specified in that page's Epic A.
- **Stock Vault — the only entry point.** Given the menu, when the rep selects Stock Vault, then the workspace-level Stock Vault page opens in the same tab. This is now the **sole** route to that page: it was previously a nav tab, and the move into the menu reflects how reps actually use it — a library consulted when stocking a store, not a working view switched between several times a session. The page itself, its Pro Stock / Sideline Stock line toggle, and its Add to Store and start-a-store flows are unchanged ([Stock Vault](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4275109889/Stock+Vault)).
- **Workspace Settings — only entry point.** Given the menu, when the rep selects Workspace Settings, then the Workspace Settings page opens. This is the **sole** route to that page.
- **Logout.** Given the menu, when the rep selects Logout, then the Team Stores session ends. **OPEN:** because entry is via cross-product session propagation from a Qstrike Customizer, it must be decided whether logout terminates only the Team Stores session or the propagated Customizer session as well, and where the rep lands (splash page vs. Customizer). As specified today, a rep who logs out and re-selects Team Store from the Customizer header would be silently re-authenticated by the same-session pass-through in Team Stores Landing Page, Epic A. See that page.

**Acceptance criteria**

- Given any sub-tab, then the rep's avatar is present in the header and the menu opens from it.
- Given the rep clicks their name or avatar, then the menu opens and no navigation occurs.
- Given the rep hovers their name or avatar, then the menu is presented without a click.
- Given a rep with a connected Customizer, then the menu lists exactly My Account, Customizer, Orders, Stock Vault, Workspace Settings, and Logout, in that order.
- Given a rep with no connected Customizer, then the menu lists exactly My Account, Orders, Stock Vault, Workspace Settings, and Logout, with no placeholder, disabled row, or connect affordance where Customizer would sit.
- Given a rep with no connected Customizer, when they open the rep account page, then they can connect one from there.
- Given the rep selects Customizer, then a new browser tab opens on their primary brand's Customizer and the workspace tab is left intact.
- Given the rep selects My Account, Orders, Stock Vault, or Workspace Settings, then the destination renders in the same tab with no new tab opened.
- Given the main navigation at any point, then the tabs are Overview, Stores, and Earnings — no Settings tab and no Stock Vault tab is present.
- Given the Stock Vault page, then it is reachable from the account menu and from nowhere else in the workspace navigation.

### Metrics & Success Criteria

- Search-to-open under 5s median
- Sub-tab adoption: \>70% of sessions use at least two tabs
- Filter/Sort engagement on portfolios \>12 stores: \>60% of list sessions apply at least one
- Export action: tracked usage per season with \<1% failed exports
- Account menu open rate per session, and item-level selection share — an item that is never selected does not earn its place in a six-item menu
- **Stock Vault visits per rep per month, before and after the move out of the nav** — the direct test of whether demoting it to the menu cost reps anything. A material drop alongside stores being stocked from other sources would argue for putting it back
- **Share of Stock Vault visits that end in an Add to Store or a start-a-store** — whether the reps who still find it are the ones who needed it
- Share of Orders-page visits arriving from the menu vs. the Overview KPI card
- Share of reps with no connected Customizer, and how many of them connect one from the account page — whether a rep who never sees the menu item ever finds the capability
- Mis-clicks on the rep's name that immediately close the menu — a signal the click-opens change is not landing

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires a read model / search index over the portfolio (**stores**, ownership flags, status, sport, location, revenue, counts) reflecting server-side state, not in-memory seed data. The ownership segments and Filter facets (Sport, Location) must be derived from real records in scope. The Overview **Store selector** requires **store-scoped** metric aggregation; Export requires a server-side report-generation / file-delivery service. Likely needs shared internal team services for analytics and a third-party export/file integration. The **Earnings** tab requires the monthly commission settlement and sales aggregation specified in [Earnings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4377968641/Earnings); this page owns only its place in the navigation. **Catalog Template** persistence is specified in Product Catalog Management, Epic M, and requires no workspace navigation surface.

The **account menu** requires the rep's display name and avatar from the identity read-through described in Rep Account & Brand Customizer Access; **resolution of the primary brand's Customizer URL** from primary-brand session state, so the new-tab launch targets the right brand instance; a **connected-Customizer predicate** resolved per rep at render time, driving whether that item is included at all; and a **session teardown path** for logout that is explicit about whether the propagated Customizer session is included. The menu's item set is therefore not static and must be composed per rep rather than hard-coded.

**Amendment needed on the account page.** Connecting a Customizer is now specified as an account-page capability, and [Rep Account & Brand Customizer Access](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4189650945/Account+Page) should state it explicitly — the entry point, what a rep with no brands sees, and how connecting one sets primary brand for the session state this menu reads. This page defines only the consequence: once connected, the Customizer item appears in the menu.

The **Stock Vault** entry requires the platform-level vault persistence and entitlement checks specified in [Stock Vault](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4275109889/Stock+Vault); moving it out of the navigation changes its route and nothing else about it. Workspace-scope settings persistence is specified in the child page [Workspace Settings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4301389828/Workspace+Settings).
