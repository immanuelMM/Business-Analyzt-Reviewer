# Team Stores Platform Overview

## Summary

**Team Stores** is a standalone application that operates as its own separate display layer. Instead of pulling data directly from CorpSoft or the Customizer, the Team Store accesses the shared service layers.

‌

## Why this platform exists

Ordering team uniforms and fan gear for youth sports is difficult because the needs of parents, coaches, league administrators, and sales reps often conflict.

* **Parents** often manage multiple children across teams and sports. They are forced to use separate links, separate logins, and separate checkouts, while worrying about size mistakes and duplicate jersey numbers.
* **Reps** must launch stores quickly, but mistakes are costly. Ordering custom apparel without coach approval or removing products after payment can create expensive production errors.
* **Team managers (League directors and coaches)** need different things. Directors want oversight across the whole league, while coaches need flexibility to manage rosters, uniform designs, and deadlines for their own teams.

‌

## **Users & Key Use Cases**

| User | Role in the platform | Primary need |
| --- | --- | --- |
| **Rep** | Platform power-user who configures stores and connects manufacturer catalog products. | Fast setup with safeguards that reduce ordering mistakes |
| **Team Manager (coach)** | Coach responsible for team oversight and approval. This person is main contact of the rep. | Visibility into progress plus control over roster and uniform decisions |
| **Player / Parent** | Primary buyer purchasing required gear and optional items for children | A fast, reassuring, error-free purchase experience |
| **Fan** | Extended family or supporters buying public merchandise | Quick access to simple team gear without account friction |

‌

# Requirements

[Global Navigation](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4151476250)

[Brand Landing & Section Entry](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311233)
[Access / Compliance Gate](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153016322)
[Team Stores Workspace](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153245697)

[Stores Tab](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153344001)
[Overview Dashboard](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152918026)

[KPI Summary Cards](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153278468)
[Revenue chart](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153180162)
[Top Performing Stores](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152852486)
[Active Order Windows](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152033291)

[Store Creation Flow](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4152164607)

[Step 1 - Basics](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609)
[Step 2 - Products](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152000524)
[Step 3 - Review & Deploy](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311250)

[Manage Store Workspace](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4153409537)

[Tabbed Store Dashboard](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153409540)
[Launch and Status Controls](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802774)
[Customizer & Picker Page](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049277)
[Store General Settings (Details Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493)
[Product Catalog Management & Publishing (Products Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773)
[Order Management (Orders Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153933836)
[Roster Management (Roster Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153507841)
[Payouts and Store Analytics (Reports Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049253)

[System Support](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4153901065)

[System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806)

[Consumer Storefront](https://qstrike.atlassian.net/wiki/spaces/TS/folder/4152426506)

[Storefront Landing & Account Onboarding](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155473922)
[Branded Storefront Landing & Role Selection](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153606269)
[Connection Success Confirmation](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130433)
[Roster-Matched Account Creation & Multi-Player Management](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152623289)

[Storefront Home](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154491000)
[Role-Adaptive Welcome & Layout](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155506693)
[Ordering-Window Banner](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154163201)
[Product Catalog, Required-Gear & Search](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153049301)

[End-User Product Configuration](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154228849)
[Single Product Detail (PDP)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154195969)
[Bundle / Uniform Kit Configurator](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130449)

[Carts & Checkout Flow](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154228866)
[Cart & Order Summary](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155670529)
[Checkout](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155113576)
[Order Confirmation](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154687575)

[Account, Orders & Cancellation](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155572225)
[Profile & Notification Preferences](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155342851)
[Order History & Production Timeline](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154818627)
[Cancellation Request Workflow](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155539478)

# Ecosystem Architecture

A layered architecture that creates a harmonious relationship between the systems:

* **Product & Account Synergy:** Because everything relies on the same data layers, a rep can log into their account they use for the customizer, create a design in the customizer, and have those saved designs or active carts instantly available to pull into a Team Store.
* **Hierarchical Permissions:** Dealership and brand hierarchies managed internally are fed through the service layers, allowing the Team Store to automatically recognize a user's permissions and organizational structure without requiring a separate, redundant database.
* **Unified Product Feeding:** When an item is configured internally, it is pushed to an "item service layer," which then simultaneously feeds the updated product data to CorpSoft, the Customizer, and the Team Store.

Ultimately, CorpSoft provides the internal administrative oversight to spin up, manage, and analyze the stores, while the **service layers act as the crucial bridge**, supplying the standalone Team Store platform with the necessary products, user account details, and design assets

CorpSoft and the Team Store do not communicate directly, but rather exist in the same ecosystem and interact through shared **service layers**. At the foundation of this ecosystem is a database that stores all information. This data is pushed up through specific service layers, such as an **item service layer** or a **saved designs service layer**.

‌

# **Success Criteria**

* Coaches and team managers keep control over team-specific decisions.
* Reps can launch stores quickly without bypassing critical checks.
* Parents can shop for multiple children with less confusion and fewer mistakes.
* Fans can purchase simple merchandise with minimal friction.

‌

## **Out of Scope**

* **League Management** Leagues tab in the team stores workspace, create a league, league groups
* **Team manager portal** Stand alone team manager portal within the storefront they can approve designs, and manage roster
