---
title: Workspace Settings
confluence_id: 4301389828
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4301389828/Workspace+Settings
last_modified: 2026-09-10
pulled: 2026-10-26
---
**New — September 1, 2026 (approved design).** A workspace-level settings page, reached **only** from the account menu in the workspace header (see [Team Stores Workspace](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153245697/Workspace), Epic D). It is **not** a navigation tab — the workspace navigation remains three tabs (Overview / Stores / Stock Vault). A Settings tab appeared briefly in the prototype and was never specified; it has been removed and no spec described it.

### Executive Summary & Problem Statement

#### The Problem

Some settings are true of a rep's whole portfolio rather than of any one store — which transactional emails the platform sends on their behalf, and what product categories their storefronts are organized by. Today the only settings surface is the per-store Settings tab, so a rep who wants a consistent rule across six stores has to set it six times, and there is no place at all to define a category taxonomy the stores can inherit. Putting portfolio-wide settings on a nav tab, however, gives a rarely-visited page the same weight as Overview and Stores.

#### The Solution

A dedicated **Workspace Settings** page carrying a left sub-nav with two sections — **Emails** and **Product Categories** — reached from the account menu rather than the main navigation. Everything on the page is a **workspace default that individual stores inherit and can override**; nothing here edits a single store. The page header states that boundary explicitly: settings apply across every store on the workspace, and store-specific settings live in each store's Settings tab.

### User persona & use cases

**Who is this for?** Reps operating a portfolio of stores who need one rule to hold across all of them.

**Scenarios encountered** A rep turns off a transactional email they don't want any of their stores sending; a rep reviews which emails go to team managers versus buyers before launching a league store; a rep defines the category and subcategory taxonomy their storefronts should use; a rep adds a subcategory mid-season and expects new stores to pick it up; a rep looks for a store-specific setting here and needs to be pointed to that store's Settings tab.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want portfolio-wide settings in one place, so that I set a rule once instead of once per store.
- As a rep, I want it obvious which settings are workspace-level and which are store-level, so that I do not hunt for a store setting here or a workspace setting there.
- As a rep, I want control over which transactional emails the platform sends on my behalf, so that my buyers and team managers only get messages I stand behind.
- As a rep, I want to define my own product categories and subcategories, so that every store I create is organized the way I sell.

##### Epic A — Page shell, access & scope boundary

- **Menu-only entry.** Given the workspace header, when the rep selects **Workspace Settings** from the account menu, then this page opens in-app (same tab). It has no nav tab and no other entry point.
- **Three-tab rule preserved.** Given the main navigation, then Workspace Settings **does not appear as a fourth tab**, on this page or any other. This mirrors the existing treatment of Catalog Templates.
- **Left sub-nav.** Given the page, then a left sub-nav lists **Emails** ("Transactional email templates") and **Product Categories** ("Categories & subcategories"), with the active section visually indicated. Emails is the default section on open.
- **Scope statement.** Given the page header, then it reads **Workspace Settings** above a subtitle stating the settings apply across every store on the workspace and that store-specific settings live in each store's Settings tab. This copy is load-bearing, not decoration — it is the only place the two settings scopes are distinguished for the rep.
- **Nothing store-scoped here.** Given any control on this page, then it writes a workspace default. No control on this page edits a single store's record.

##### Epic B — Emails section

Workspace defaults for every transactional email the platform sends. This section owns **enablement and template override only**. The email inventory, triggers, recipient sets, content, and timing are owned by [System Emails](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4169138177/System+Emails) and must not be redefined here.

- **Section description.** Given the Emails section, then it states that these are workspace defaults for every transactional email, that individual stores can override a template from that store's Settings, and that all emails are trigger-based — no schedules, no duplicates per event. The last clause restates the Global Rules in System Emails and must stay consistent with them.
- **All Emails master toggle.** Given the section, then a leading **All Emails** row carries a single toggle with supporting copy reflecting current state (e.g. *Every system email is active*). Turning it off suppresses every send on the workspace.
- **Recipient grouping.** Given the email list, then it is grouped by recipient audience, in this order, each with the group's recipient rule stated beneath the heading:

| Group | Recipient rule shown | Emails listed |
| --- | --- | --- |
| **Reps & Team Managers** | Sent to the store-owning rep and the team manager on record. With no manager on file, only the rep receives it. | Store Status Changed; New Buyer Account Created; New Storefront Order Placed; Rostered Player Account Created; Rostered Player Ordered Team Gear |
| **Reps Only** | Sent exclusively to the store-owning rep. | Consumer Cancellation Request; Pending Batch Ready (MOQ Reached) |
| **Consumers** | Sent to the buyer whose account or order triggered the event. All include an unsubscribe/preference link. | Order Confirmation; Order Status Update; Store Closing Notice; Ordering Window Closed; Ordering Window Closing Soon; Order Error; Cancellation Request Confirmation |

- **Groups mirror System Emails.** Given the three groups, then they correspond one-to-one to System Emails Epics A, B, and C, and the listed emails are that spec's inventory in full. An email added to or removed from System Emails must appear or disappear here — the two lists cannot diverge.
- **Per-email row.** Given any email row, then it shows the email name, a one-line plain-language statement of its trigger, an enable/disable toggle, and an expand affordance for the template detail.
- **Per-email disable.** Given an email is toggled off at workspace level, when its trigger fires in any store on the workspace, then no send occurs and the event is not queued for later delivery.
- **Master toggle interaction.** Given **All Emails** is off, then individual rows are suppressed regardless of their own state, and their individual states are retained so that re-enabling All Emails restores the rep's prior per-email configuration rather than turning everything on.
- **Store override.** Given a store's Settings, then that store can override a template it inherits from here. Precedence is store over workspace. **OPEN:** confirm whether a store may also override *enablement* (send/don't send) or only template content — the section copy currently promises template override only.
- **Unsubscribe is not overridable.** Given any consumer-facing email, then the unsubscribe/preference link required by System Emails is present regardless of workspace or store template edits.

##### Epic C — Product Categories section

Workspace defaults applied to every store, which stores can override. The taxonomy defined here is what a rep picks from when categorizing a store product; how categories drive storefront presentation and ordering is owned by [Product Catalog Management (Products Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab).

- **Section description.** Given the Product Categories section, then it states that these are workspace defaults applied to every store, that stores can override, that categories and subcategories appear as dropdowns when editing a store product, and that **Stock Vault items are not categorized here**.
- **Add a category.** Given the section, then a **New category name** field and an **Add Category** action create a new top-level category on the workspace.
- **Category card.** Given a category, then it renders as a card carrying the category name, a **product-count badge** stating how many products across the workspace currently sit in it (e.g. *1 product*, *0 products*), a delete affordance, a **Subcategories** row of chips each with a remove (×) control, and an **Add subcategory** field with an **Add** action.
- **Seeded taxonomy.** Given a new workspace, then it is seeded with **Team Gear** (subcategories *Uniforms*, *Practice Gear*) and **Fan Gear** (subcategories *Apparel*, *Accessories*).
- **Inheritance.** Given a store is created, then it inherits the workspace taxonomy as it stands at creation. Given a workspace category or subcategory is added afterward, then it becomes available to stores that have not overridden the taxonomy.
- **Vault exclusion.** Given the Stock Vault, then its items carry no category from this section — vault items are uncategorized blanks until pulled into a store and configured there.
- **Delete guard.** Given a category or subcategory with products assigned to it, then deletion is blocked rather than silently reassigning or orphaning those products, and the product count is what tells the rep why.

#### Acceptance criteria

- Given the workspace header, when the rep selects Workspace Settings from the account menu, then this page opens in-app and no nav tab is added.
- Given the page opens, then the Emails section is active and the scope subtitle is visible without scrolling.
- Given the Emails section, then every email specified in System Emails appears exactly once, in its correct recipient group.
- Given an email is disabled here, when its trigger fires in any store, then no send occurs.
- Given All Emails is toggled off and then on, then each email returns to the state the rep last set it to.
- Given a new category is added, when a rep next edits a product in any store that has not overridden the taxonomy, then the new category is selectable.
- Given a category holding at least one product, when the rep attempts to delete it, then the deletion is refused and the reason is stated.
- Given a Stock Vault item, then no category field from this section is applied to it.

#### Out of scope

Per-store settings of any kind; marketing or promotional email; email send scheduling or cadence; category-driven storefront layout and ordering (owned by Product Catalog Management); Catalog Template contents; rep identity and brand entitlements (owned by [Rep Account & Brand Customizer Access](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4189650945/Account+Page)).

### Metrics & Success Criteria

- Share of reps who visit the page at least once per season — a near-zero rate on a menu-only page means reps cannot find settings they need
- Number of emails disabled at workspace level, by email — a consistently disabled email is a candidate for removal from System Emails
- Share of stores that override an inherited email template, by template — high override rates indicate the workspace default is wrong
- Categories and subcategories added beyond the seeded set, per rep
- Store-level category override rate — high rates indicate the workspace taxonomy is not general enough
- Support contacts asking where a store-level setting lives, before and after this page ships

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires **workspace-scope (account-scope) persistence** distinct from the per-store record, plus a **resolution order** — store value over workspace default — applied consistently by both the email dispatcher and the product editor.

The **Emails** section requires the transactional ESP and event-bus integration specified in System Emails to consult workspace enablement state **before** dispatch, so a disabled email is suppressed at source rather than filtered at the template layer; a per-email template store supporting a workspace default with per-store overrides; and a mechanism keeping this section's inventory synchronized with System Emails so the two cannot drift.

The **Product Categories** section requires a **workspace taxonomy record** (categories with nested subcategories) consumed by the product editor's category dropdowns in every store, a **per-category product count** aggregated across the portfolio to drive the badge and the delete guard, and an explicit exclusion of Stock Vault items from categorization. Storefront presentation of categories remains owned by Product Catalog Management.

Access is scoped to the rep who owns the workspace; the page carries no store context.

### Open questions

- **Store override of enablement.** Can a store turn an email off, or only re-template it? Epic B currently promises template override only.
- **Protected categories.** Are **Team Gear** and **Fan Gear** protected system categories or ordinary editable ones? Team Required and Team Supplied products are specified as filing under Team Gear (see [Tabbed Store Dashboard](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153409540/Tabbed+Store+Dashboard), Setup Guide card 4), so renaming or deleting Team Gear may break behavior specified elsewhere. **Reciprocal edit required** in Product Catalog Management (Products Tab) to state whether its category model treats these as fixed.
- **Override semantics.** Does a store-level override fork the entire taxonomy or layer onto it, and what happens to an overriding store when a workspace category it inherited is later deleted?
- **Template editor scope.** What does the per-email expand affordance let the rep change — body copy only, or subject line and recipient set too?
- **Collaborator visibility.** Can reps with joined-store access, or team managers with scoped workspace access, reach this page? If so, read-only or editable?
