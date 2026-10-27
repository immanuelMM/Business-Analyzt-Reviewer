---
title: Team Stores Platform Overview
confluence_id: 4153049096
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049096/Team+Stores+Platform+Overview
last_modified: 2026-09-22
pulled: 2026-10-26
---
## Summary

**Team Stores**  is a standalone application that operates as its own separate display layer. Instead of pulling data directly from CorpSoft or the Customizer, the Team Store accesses the shared service layers.

‌

## Why this platform exists

Ordering team uniforms and fan gear for youth sports is difficult because the needs of parents, coaches, league administrators, and sales reps often conflict.

- **Parents** often manage multiple children across teams and sports. They are forced to use separate links, separate logins, and separate checkouts, while worrying about size mistakes and duplicate jersey numbers.
- **Reps** must launch stores quickly, but mistakes are costly. Ordering custom apparel without coach approval or removing products after payment can create expensive production errors.
- **Team managers (League directors and coaches)** need different things. Directors want oversight across the whole league, while coaches need flexibility to manage rosters, uniform designs, and deadlines for their own teams.

‌

## **Users & Key Use Cases**

| User | Role in the platform | Primary need |
| --- | --- | --- |
| **Rep** | Platform power-user who configures stores and connects manufacturer catalog products. | Fast setup with safeguards that reduce ordering mistakes |
| **Team Manager (coach)** | Coach responsible for team oversight and approval. This person is main contact of the rep. Granted scoped access to the workspace for their own store — see Team Manager Access below. | Visibility into progress plus control over roster and uniform decisions |
| **Player / Parent** | Primary buyer purchasing required gear and optional items for children | A fast, reassuring, error-free purchase experience |
| **Fan** | Extended family or supporters buying public merchandise | Quick access to simple team gear without account friction |

‌

## Team Manager Access

Team managers are **in scope**. Access is granted as a **permission inside the Team Stores workspace**, not as a standalone portal on the storefront.

- An invited team manager signs into the workspace and sees a **slimmed-down view scoped to their own store only** — **Reporting** and **Rosters**. No products, orders, settings, or Product Vault.
- Within that scope the manager can review their store's reporting and **help the rep fill the roster**, which is the main reason the access exists: roster completion is the rep's most common bottleneck and the coach is the person who actually knows the players.
- Invites, invitee status, Resend, Revoke, and the rep's **View portal as** entry point are specified in [**Store General Settings (Settings Tab)**](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab), Epic A2b — People & Access. That page is the source of truth for this feature; this section is orientation only.

‌

# Requirements

[Global Navigation](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4151476250?atlOrigin=eyJpIjoiYTIzZGE5ZjYxZjY2NGQwOGFhOTg3ZThlNmU5ZTk5ZGMiLCJwIjoiYyJ9)

[Brand Landing & Section Entry](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311233/Team+Stores+Landing+Page)      
[Access / Compliance Gate](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153016322/Access+Authentication)      
[Team Stores Workspace](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153245697/Workspace)

[Stores Tab](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153344001/Stores+Page)      
[Overview Dashboard](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152918026/Overview+Page)

[KPI Summary Cards](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153278468/KPI+Summary+Cards)      
[Revenue chart](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153180162/Revenue+Dealer+Profit)      
[Top Performing Stores](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152852486/Top+Performing+Stores+Leaderboard)      
[Active Order Windows](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152033291/Active+Ordering+Windows+Monitor)      
[All Stores Orders Page](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4164812801/All-Stores+Orders+Page)

[Store Creation Flow](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4152164607?atlOrigin=eyJpIjoiOTMxNTk2Nzk2MjExNDVjZWJiNWM1OTRkMWNhOWMwNzUiLCJwIjoiYyJ9)

[Step 1 - Basics](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609/Step+1+-+Basics)      
[Step 2 - Divisions & Teams (League Stores)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4299325441/Step+2+-+Divisions+Teams+League+Stores)      
[Step 2 - Add Products](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152000524/Step+2+-+Add+Products)      
[Step 3 - Review & Deploy](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311250/Step+3+-+Review+Deploy)

[Manage Store Workspace](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4153409537?atlOrigin=eyJpIjoiYWY1YjJmODcxZDMyNGUxZDhhNTQxZGUzOGMxZjZjYWUiLCJwIjoiYyJ9)

[Tabbed Store Dashboard](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153409540/Tabbed+Store+Dashboard)      
[Launch and Status Controls](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802774/Launch+Status+Controls)      
[Customizer & Picker Page](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049277/Customize+New+Product)      
[Store General Settings (Settings Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab)      
[Product Catalog Management (Products Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab)      
[Order Management (Orders Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153933836/Order+Management+Orders+Tab)      
[Roster Management (Roster Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153507841/Roster+Management+My+Team+s+Tab)      
[Payouts and Store Analytics (Reports Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049253/Store+Analytics+Reports+Tab)

[System Support](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4153901065?atlOrigin=eyJpIjoiOGRiZmFiZjk4MGU3NDZhMGEzN2FjNWE4MzdjM2EyMjciLCJwIjoiYyJ9)

[System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts)

[Consumer Storefront](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4152426506?atlOrigin=eyJpIjoiMThjMTYyMDZiNDQ5NDY0ZmI0NzcxODYwZWFlMWY2MTMiLCJwIjoiYyJ9)

[Storefront Landing & Account Onboarding](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155473922/Storefront+Landing+Account+Onboarding)      
[Branded Storefront Landing & Role Selection](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153606269/Branded+Storefront+Landing)      
[Connection Success Confirmation](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130433/Connection+Success+Confirmation)      
[Roster-Matched Account Creation & Multi-Player Management](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152623289)

[Storefront Home](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154491000/Storefront+Home)      
[Role-Adaptive Welcome & Layout](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155506693)      
[Ordering-Window Banner](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154163201/Ordering-Window+Banner)      
[Storefront Announcement Banner](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4305616902/Storefront+Announcement+Banner)      
[Product Catalog, Required-Gear & Search](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049301/Product+Catalog+Required-Gear+Search)

[End-User Product Configuration](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154228849/End-User+Product+Configuration)      
[Single Product Detail (PDP)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154195969/Single+Product+Detail+PDP)      
[Bundle / Uniform Kit Configurator](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130449/Bundle+Configurator)

[Carts & Checkout Flow](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154228866/Carts+Checkout+Flow)      
[Cart & Order Summary](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155670529/Cart+Order+Summary)      
[Checkout](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155113576/Checkout)      
[Order Confirmation](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154687575/Order+Confirmation)

[Account, Orders & Cancellation](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155572225/Account+Orders+Cancellation)      
[Profile & Notification Preferences](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155342851/Profile)      
[Order History & Production Timeline](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154818627/Order+History+Production+Timeline)      
[Cancellation Request Workflow](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155539478/Cancellation+Request+Workflow)

[Cross-Cutting Architecture](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4230545435/Roster-Optional+Architecture+Open+Access+Stores)

[Roster-Optional Architecture (Open Access Stores)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4230545435/Roster-Optional+Architecture+Open+Access+Stores)

# Ecosystem Architecture

A layered architecture that creates a harmonious relationship between the systems:

- **Product & Account Synergy:** Because everything relies on the same data layers, a rep can log into their account they use for the customizer, create a design in the customizer, and have those saved designs or active carts instantly available to pull into a Team Store.
- **Hierarchical Permissions:** Dealership and brand hierarchies managed internally are fed through the service layers, allowing the Team Store to automatically recognize a user's permissions and organizational structure without requiring a separate, redundant database. Team manager access is granted within this model as a store-scoped permission rather than a separate application.
- **Unified Product Feeding:** When an item is configured internally, it is pushed to an "item service layer," which then simultaneously feeds the updated product data to CorpSoft, the Customizer, and the Team Store.

Ultimately, CorpSoft provides the internal administrative oversight to spin up, manage, and analyze the stores, while the **service layers act as the crucial bridge**, supplying the standalone Team Store platform with the necessary products, user account details, and design assets

CorpSoft and the Team Store do not communicate directly, but rather exist in the same ecosystem and interact through shared **service layers**. At the foundation of this ecosystem is a database that stores all information. This data is pushed up through specific service layers, such as an **item service layer** or a **saved designs service layer**.

‌

# **Success Criteria**

- Coaches and team managers keep control over team-specific decisions.
- Reps can launch stores quickly without bypassing critical checks.
- Parents can shop for multiple children with less confusion and fewer mistakes.
- Fans can purchase simple merchandise with minimal friction.

‌

## **Out of Scope**

- **League Management** Leagues tab in the team stores workspace, create a league, league groups
- **Standalone storefront portal for team managers** A separate team-manager application living on the storefront remains out of scope. The capability itself is in scope and shipped as a workspace permission instead — see Team Manager Access above.

‌

*Amended September 2, 2026: added* [*Storefront Announcement Banner*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4305616902/Storefront+Announcement+Banner) *to the Consumer Storefront → Storefront Home group — a rep-authored banner carrying key dates, deadlines, returns, sizing, and shipping, authored in Settings → Store Customization & Design and in Step 1 — Basics. Storefront theme color (buttons and accents only) enters scope with it; it was never listed above as out of scope, so nothing here is reversed. Also added the previously-missing index entries for* [*Step 2 - Divisions & Teams (League Stores)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4299325441/Step+2+-+Divisions+Teams+League+Stores) *and* [*Roster-Optional Architecture (Open Access Stores)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4230545435/Roster-Optional+Architecture+Open+Access+Stores)*, both approved specs that were absent from this list.*
