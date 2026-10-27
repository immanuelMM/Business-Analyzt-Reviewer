---
title: Account Page
confluence_id: 4189650945
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4189650945/Account+Page
last_modified: 2026-10-19
pulled: 2026-10-26
---
*Amended August 31, 2026: terminology note added. **Customizer** is now also the name of a product source on the Add Products page. This page continues to use "Customizer" in its original sense — the external brand tool a rep signs into — and the brand picker on Add Products has been relabelled **Choose a brand** to keep the two apart.*

*Amended September 1, 2026: this page finally has a documented entry point. **My Account** in the workspace account menu (*[*Team Stores Workspace*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153245697/Workspace)*, Epic D) opens this page **in-app, in the same tab**. The same menu carries a separate **Customizer** item that opens the rep's **primary brand** Customizer in a **new browser tab** — see Epic B. The two items are deliberately distinct: My Account is where brand access is managed, the Customizer item is a shortcut out to one brand's tool.*

### Executive Summary & Problem Statement

#### The Problem

A rep's dealership, brand entitlements and permissions already live in qx7 and the brand Customizers, not in Team Stores. Duplicating and editing that data here would create conflicting sources of truth. Yet reps still need one place to see and manage their brand access: brands whose access wasn't auto-recognized (email mismatch), brands they're entitled to but have no Customizer account for, and, for reps who signed up natively, their Team Stores password.

#### The Solution

An account page whose identity data is **shown read-only** from its source, with an editable **Brands** section and, for native-account reps, a **password change**. Brand connections exist to reuse the existing qx7 account structure, giving reps quick access and fast onboarding, and to inherit the user permissions already set up in qx7. Each brand the rep is entitled to sell is shown as a card whose state tells the rep what to do next: connected, sign in (different email), request access (no Customizer account), or access pending. The page is reached from the account menu in the workspace header.

‌

### User persona & use cases

**Who is this for?** Reps managing their profile and brand-selling access inside Team Stores, whether they sign in through a Customizer or with a native Team Stores account.

**Scenarios encountered** A rep confirms the profile/contact info carried over from their Customizer; a rep sees which dealership they're connected to and which brands they can sell; a rep whose brand access used a different email follows the on-card instructions to log in and unlock that brand; a rep entitled to a brand with no Customizer account requests access from Prolook; a rep checks on a pending access request; a native-account rep changes their Team Stores password; a Customizer-only rep tries to change their password and is directed to the Customizer; a rep links their Customizer identity and native account; a rep changes which brand is their primary for the workspace session.

‌

‌

### Requirements & Core Workflows

Epic A — View-only account data & password

- As a rep, I want my account details to reflect what's already on record for me, so that there's one source of truth and nothing to re-enter.
- As a native-account rep, I want to change my Team Stores password here, so that I can manage my credentials without a Customizer.
- **Entry point.** Given the workspace header, when the rep selects **My Account** from the account menu, then this page opens **in-app, in the same tab**. This is the page's entry point; the rep's name in the header no longer links here directly — it opens the menu. See Team Stores Workspace, Epic D.
- **Populated from source, view-only:** Given the rep opens the account page, then the following are **view-only**: **First & Last Name, Email Address, Phone Number, Country, State, City, Zip Code**, a **Dealership call-out** (what dealership they are connected to), and a **Brand call-out** (which brands they have access to sell). For reps who entered through a Customizer, these come from that Customizer. For native-account reps, they come from their Team Stores account and, where they have a dealership association, from qx7.
- **Change password (native accounts):** Given a rep with a native Team Stores account, then they can change their password here by entering their current password and a new one that meets the password criteria in [Team Stores Landing Page](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311233/Team+Stores+Landing+Page), Epic D. Changing it signs out their other Team Stores sessions and sends a confirmation email.
- **Customizer-only reps:** Given a rep who has no native Team Stores account, then they **cannot update a password in Team Stores**. The page directs them to update it in their **Customizer account**.
- **Linked accounts:** Given a rep whose native account is linked to a Customizer identity, then changing their Team Stores password here never changes their Customizer password, and the page makes clear which password is being changed.
- **Link accounts:** Given a rep whose Customizer email differs from their native account email, then they can link the two from this page by authenticating with both (Team Stores Landing Page, Epic E).

Epic B — Editable Brands section, account validation & access requests

- As a rep who wasn't auto-signed into all my brands, I want to log into them from my account page, so that I can add products from every brand I'm entitled to sell.
- As a rep entitled to a brand I don't have a Customizer account for, I want to request access from this page, so that Prolook can set me up.
- **Editable areas:** Given the account page, then the **Brands section**, the native-account password change and account linking are the only editable areas; all other fields are read-only.
- **Access visibility:** Given the Brands section, then it **shows every brand Customizer the rep is entitled to** through their dealership in qx7, whether or not they were auto-signed-in.
- **Customizer account validation:** Given the Brands section loads, then for each entitled brand the system checks whether the rep has an account in that brand's Customizer, and each card shows one of these states:
    - **Connected:** the rep has an account and is connected. The brand is available for products.
    - **Sign in:** the rep has an account under a different email and hasn't connected it yet.
    - **Request access:** no account was found for the rep's email.
    - **Access pending:** the rep has requested access and Prolook hasn't completed it yet.
- **Manual login for mismatched-email brands:** Given a rep was **not auto-logged in** to a brand (they used a different email for that brand Customizer), then that **brand card displays clear instructions to log in**, and the rep can **manually log in** to it from here to gain product access.
- **No account found:** Given no Customizer account was found for the rep's email, then the card shows the message "You don't have an account for this Customizer yet" with two options: **Request access to this brand**, or **Sign in with a different email** for reps whose account exists under another email. Reps cannot register for a brand Customizer themselves, because accounts are added internally by Prolook.
- **Request access:** Given the rep selects Request access to this brand, then the request is sent to Prolook and the card changes to **Access pending**.
- **Pending state:** Given a request is pending, then the card shows that it was sent and the rep cannot submit a duplicate request for that brand.
- **Access granted:** Given Prolook has added the rep's account for that brand, then the card changes from Access pending to the state that lets the rep connect it.
- **Primary brand is set here.** Given the Brands section, then the rep can change which entitled brand is their **primary** for the workspace session — the promise made by the first-visit welcome modal ([Team Stores Landing Page](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311233/Team+Stores+Landing+Page), Epic A2) that the primary brand can be changed anytime from My Account. This page owns that write path; no other surface changes the primary brand. A brand in the **Request access** or **Access pending** state cannot be set as primary.
- **This list feeds the Add Products brand picker.** Given the rep opens **Change** on the SOURCE pill of the Add Products page, then the **Choose a brand** picker lists the brands resolved here, using the same entitlement model and the same brand connections. A brand the rep has not connected on this page, including any brand in the Request access or Access pending state, is not selectable there. See [Product Catalog Management (Products Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab), Epic A.
- **This list also resolves the account menu's Customizer item.** Given the rep selects **Customizer** from the account menu, then their **primary brand's** Customizer opens in a **new browser tab**, resolved from the primary-brand session state this page controls. The menu presents no brand picker — it always targets the primary brand, and changing the target means changing the primary brand here. **OPEN:** what the menu item does when the primary brand is one the rep has **not** connected (email mismatch, never manually logged in) — land them on that brand's Customizer login, or suppress the item and direct them to this page.

‌

### Metrics & Success Criteria

- Share of entitled brands that end up signed-in per rep
- Manual brand-login completions from the account page
- Brand access requests submitted, and median time from request to access granted
- Support tickets about “missing” brand access reduced
- My Account visits arriving from the account menu, and primary-brand changes made per rep per season
- Account-menu Customizer selections that land on a connected brand vs. a login wall — the signal for how urgent the OPEN above is

‌

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires a **read-through to the rep's profile record** (name, contact, address, dealership, brand entitlements) rendered read-only here: the originating Customizer for Customizer-path reps, and the Team Stores account plus qx7 for native-account reps. The **Brands** section depends on the **dealership→brand entitlement model keyed by email** in qx7, a **per-brand Customizer lookup** that reports whether an account exists for an email (required for every brand Customizer), an **access-request service** that routes requests to Prolook and tracks their status, and the **brand-connection model** shared with the Landing Page. The same entitlement list and connections are consumed by the **Choose a brand** picker on the Add Products page and by the **account menu's Customizer item**, so all three surfaces cannot diverge. The primary-brand value written here must be the same **primary-brand session state** established at landing and read by the account menu to resolve its new-tab Customizer target. Native-account password changes use the Team Stores identity service and the password criteria in Team Stores Landing Page, Epic D; Customizer-only reps' password changes are delegated to the Customizer account (deep link, not an editable field here).

### Open Questions

- **Access requests:** who at Prolook receives brand access requests, and how is the rep told when access is granted?
- **Connection persistence:** should brands connected under a different email be stored on the rep's Team Stores account so they survive a new session, cleared cache or a different browser? Pending developer confirmation of how long a Customizer will honor a stored connection.
- **Native profile data:** where does a native-account rep with no Customizer or qx7 record get their name and contact details, and can they edit them here?

‌
