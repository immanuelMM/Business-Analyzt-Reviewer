---
title: Team Stores Landing Page
confluence_id: 4153311233
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153311233/Team+Stores+Landing+Page
last_modified: 2026-10-13
pulled: 2026-10-26
---
**Amended ****: Hybrid authentication & account linking.** Team Stores now supports **native Team Stores accounts in addition to Customizer authentication**. Reason: some of our customers won't have access to a Customizer and will require native authentication capabilities. Customizer sign-in remains fully supported. Password criteria for native accounts are defined in Epic D. This amendment overrides any earlier content or amendments on this page where they conflict.

### Executive Summary & Problem Statement

#### The Problem

Reps need a single recognizable entry point into the Team Stores suite, and the platform must read as a premium brand surface, not an internal admin panel. Some customers don't have access to a Qstrike Customizer, so Team Stores cannot depend on Customizer sign-in as its only way in.

#### The Solution

Team Stores supports two ways to authenticate that resolve to **one Team Stores user record**. **Customizer sign-in (federated):** reps reach Team Stores from within any **Qstrike Customizer** by selecting **Team Store** in the Customizer header, which launches the experience in a **new tab**; session identity carries over as specified in Epics A and B. **Native sign-in:** reps can also go to Team Stores directly, create a Team Stores account, and sign in with Team Stores credentials, then connect any brand Customizers they're entitled to. Where the same person has both a Customizer identity and a native account, the accounts are **linked** so stores, orders, access status and brand settings are shared. **Brand connections** reuse the existing account structure in qx7, giving reps quick access and fast onboarding, and inherit the user permissions already set up in qx7 rather than rebuilding them in Team Stores. Multi-brand access is resolved automatically where emails match, entitled brands without a Customizer account can be requested from Prolook, and a rep with no dealership association is routed into business registration before getting access.


### User persona & use cases

**Who is this for?** PROLOOK sales reps, including reps who sign in through a Customizer and reps who don't have Customizer access and sign up natively.

**Scenarios encountered** A rep clicks Team Store from a Customizer header mid-design; an already-authenticated rep is passed straight through to Overview; a logged-out rep hits the splash page and chooses to sign in with a Customizer or with a Team Stores account; a rep without Customizer access signs up natively; a rep authorized to sell multiple brands is auto-signed into those Customizers; a rep who used different emails per brand connects the unrecognized brands; a rep entitled to a brand with no Customizer account requests access; a rep who has both a Customizer identity and a native account has them linked into one; a rep with no dealership association registers their business and waits for Prolook approval.

### Functional Requirements & Core Workflows

Epic A — Customizer-origin authentication & multi-brand sign-in

*This epic describes the federated path only. Native sign-in is covered in Epic D.*

- As a rep already logged into a Qstrike Customizer, I want Team Stores to recognize me automatically, so that I don't have to log in again.
- As a rep authorized to sell multiple brands, I want to be signed into all my brand Customizers automatically, so that I can add products from any of them.
- As a rep who used different emails across brand Customizers, I want clear guidance on which brands need a manual sign-in, so that I can unlock all the brands I'm entitled to sell.

- **Same-session pass-through:** Given a rep is **already logged into a Customizer**, when they select Team Store, then the Team Store platform is **already authenticated** with those same credentials — no second login is required.
- **Logged-out prompt:** Given a rep is **not** logged into the Customizer, when they select Team Store, then they reach the splash page and can sign in with their existing Customizer credentials **or** with a Team Stores account (Epic B) before continuing to Overview.
- **Auto multi-brand sign-in:** Given a rep entering from a Customizer is authorized to sell **other brands under the same email**, then they are **automatically signed into those brand Customizers** and can add products from them. Brands where the rep has **no Customizer account** are skipped and appear on the Account Page with the **Request access** option.
- **Email-mismatch use case:** Given a rep has access to multiple brands but authenticated to some brand Customizers with **different emails**, then the platform **cannot auto-recognize** that access (dealership↔brand entitlements are linked to reps by email); those brands are surfaced in the account page with **clear instructions to connect** them (Epic E). *Background: entitlements are modeled as dealerships → offered brands, with reps connected to dealerships via email; a mismatched email breaks auto-recognition for that brand only.*

Epic A2 — First-visit welcome modal & primary-brand selection

- As a rep arriving from a signed-in Customizer for the first time, I want to be told I've been auto signed-in and which account was used, so that I understand how I got in and trust the session.
- As a rep with access to multiple brands, I want to choose my primary brand customizer on entry, so that the workspace session defaults to the brand I care about.
- As a rep who signed in natively for the first time, I want a welcome that explains how to connect my brands, so that I can start adding products.

- **First-visit trigger:** Given a rep reaches the Team Stores landing for the **first time** by either path, then a **Welcome to Team Stores** modal is shown. *(Shown on first visit; not repeated on subsequent entries.)*
- **Auto sign-in recognition (Customizer path):** Given the rep arrived from a signed-in Customizer, then the welcome modal displays a **"Signed in automatically"** confirmation and states that the rep was signed in using their **\[Brand\] Customizer account** (the Customizer they came from), set as their **primary brand for this workspace session**.
- **Native-path variant:** Given the rep signed in natively, then the welcome modal does **not** show the "Signed in automatically" confirmation. It shows any brands already connected or found in qx7 for the rep's email, and a prompt to **connect brand Customizers** (Epic E). If the rep has no connected brands yet, no primary brand is set until one is connected.
- **Primary Brand Selection:** Given the rep has access to **multiple brands**, then a **Primary Brand Selection** group presents each entitled brand as a selectable card (logo + brand name + parent label). On the Customizer path the brand they entered from is **preselected**; on the native path the default is an open question (see Open Questions). The rep can pick a different one. Brands with no Customizer account, or with an access request pending, cannot be selected as primary.
- **Single-brand case:** Given the rep has access to **only one brand**, then that brand is shown as the selected primary (no meaningful alternative to choose).
- **Changeable later:** Given the selection, then helper copy notes the primary brand **can be changed anytime from My Account** (see Rep Account & Brand Customizer Access).
- **Confirm & Enter:** Given a primary brand is selected, when the rep clicks **Confirm & Enter**, then the modal closes, the chosen brand is set as the session's primary, and the rep proceeds to the Overview. Dismissing via **close (×)** retains the preselected/default primary brand.

Epic B — Splash page, new tab & transitional state

- As a rep, I want Team Store to open in its own tab without losing my Customizer work, so that I can move between the two.
- As an already-authenticated rep, I want a smooth hand-off into the Overview, so that entering doesn't feel abrupt or broken.
- As a rep who isn't signed in, I want to choose between signing in with a brand Customizer or with a Team Stores account, so that I can reach the workspace whether or not I have Customizer access.
- As a rep entitled to a brand I don't have a Customizer account for, I want to know that before I try to sign in, so that I can request access instead of hitting a dead end.
- **New tab launch:** Given the Customizer header, when the rep clicks **Team Store**, then the Team Store experience launches in a **new browser tab**.
- **Direct entry:** Given a rep navigates to the Team Stores URL directly (not from a Customizer), then they land on the **splash page**, or on the Overview if they already have an active Team Stores session.
- **Authenticated → Overview:** Given the rep is logged in when they select Team Store, then they arrive **automatically on the Overview page**.
- **Transitional state:** Given an already-logged-in rep is being routed from the Customizer to Overview, then a **transitional / loading state** is shown between the Customizer and the Overview page.**NEEDED:** a transitional state between the Customizer and the Overview must exist for the already-logged-in path.
- **Splash sign-in choice:** Given the rep is **not** logged in, when they click to open the Team Stores workspace from the splash page, then they can choose **Sign in with a Customizer** (the flow below) or **Sign in / Sign up with a Team Stores account** (Epic D).
- **Customizer sign-in → email verification:** Given the rep chooses to sign in with a Customizer, then they are shown a **"Continue to Team Stores"** modal prompting them to enter the **email tied to their Customizer account**. Copy explains the email is used to verify which brands they're entitled to before showing any sign-in options.
- **qx7 entitlement lookup:** Given the rep submits an email, when they click **Continue**, then the system **cross-checks the email against qx7** (the database storing rep↔email brand associations) to determine which brand Customizers they can access.
- **Customizer account validation:** Given qx7 confirms the rep's brand entitlements, then before showing the brand list the system checks whether the rep has an **existing account** in each entitled brand's Customizer.
- **Email found → Choose a Customizer:** Given the email **is found in qx7**, then a **"Choose a Customizer"** modal is shown listing the **brand Customizers the rep is entitled to** as cards, with a **"Use a different email"** option to return to the previous step. Brands where the rep has an account are selectable. Brands where they don't show the **Request access** state instead.
- **No account found:** Given an entitled brand where no Customizer account exists for the rep's email, then its card shows the message "You don't have an account for this Customizer yet" with two options: **Request access to this brand**, or **Sign in with a different email** for reps whose account exists under another email. Reps cannot register for a brand Customizer themselves, because accounts are added internally by Prolook.
- **Request access:** Given the rep selects Request access to this brand, then the request is sent to Prolook and the card shows **Access pending**. The rep cannot submit a duplicate request for that brand while it is pending. The same pending state appears on the Account Page.
- **No usable brand:** Given none of the rep's entitled brands has a Customizer account, then alongside Request access the rep is offered **Sign in / Sign up with a Team Stores account** (Epic D), so they are never stuck on the splash page.
- **Email not found:** Given the email is **not** found in qx7, then the rep is offered the option to **sign up for a Team Stores account** (Epic D) instead.
- **Selection sets primary:** Given the Choose-a-Customizer modal, when the rep selects a Customizer they have an account for, then that Customizer becomes their **primary brand by default** and they are prompted to **enter their password** for that account.
- **Successful auth → Overview:** Given a valid password, when authentication succeeds, then the rep is taken to the **workspace Overview** page, subject to the Access / Authentication gate.

Epic C — New-organization onboarding 

- As a rep whose dealership is new to Team Stores, I want to be guided to provide our business information, so that our organization is set up correctly before I start selling.
- **New-org prompt:** Given a rep signs up and is **not associated with a dealership**, when they enter Team Stores, then they are prompted to **register their organization (business)** with the Team Stores platform before proceeding.
- **Stripe-generated registration form:** Given the registration prompt, then the business registration form is **generated by Stripe**.
- **Internal review:** Given a submitted business registration, then it is **reviewed internally by someone at Prolook**, who approves or denies it (see Access / Authentication, Epic B).
- **No access until approved:** Given a rep's business registration is submitted but not yet approved, then the rep has **no access to Team Stores**. This is a hard block, not a prompt the rep can skip.

Epic D — Native Team Stores accounts

- As a rep without Customizer access, I want to create a Team Stores account directly, so that I can use Team Stores.
- As a rep with a Team Stores account, I want to sign in and manage my credentials in Team Stores, so that I'm not dependent on a Customizer.
- As a rep creating a password, I want to see the requirements as I type, so that I don't have to guess why my password was rejected.

- **Sign up:** Given a rep chooses to sign up on the splash page, then they create a Team Stores account with an email and a password that meets the password criteria below, and must **verify their email** before the account is active.
- **Existing email:** Given a rep tries to sign up with an email that already belongs to a Team Stores user (including one created through Customizer sign-in), then **no second account is created**; the rep is routed to account linking (Epic E).
- **Sign in:** Given a rep with a native account, when they enter valid Team Stores credentials, then they are signed in and taken to the Overview, subject to the Access / Authentication gate and Epic C.
- **Dealership check:** Given a rep completes native sign-up, then the system checks their email against qx7. If a dealership association is found, their entitled brands are surfaced for connection (Epic E). If none is found, the rep enters business registration (Epic C).

**Password criteria**

- **Length:** Given a rep sets a password, then it must be **at least 12 characters** and no more than **128 characters**.
- **Allowed characters:** Given a rep sets a password, then any characters are accepted, including spaces, symbols and non-English characters. No specific mix of uppercase, numbers or symbols is required.
- **Blocked passwords:** Given a rep sets a password, then it is rejected if it appears on a list of **common or previously breached passwords**, or if it contains the rep's email address.
- **Live requirements:** Given the password field on sign-up, reset or change, then the requirements are shown as a checklist that updates as the rep types, and any error names the specific rule that wasn't met.
- **Show / hide and paste:** Given any password field, then the rep can show or hide what they've typed, and pasting is allowed so password managers work.
- **No forced expiry:** Given a native account, then the rep is **not** required to change their password on a schedule. A change is required only if the account is suspected to be compromised.
- **Storage:** Given any password, then it is stored only as a salted hash using a slow, purpose-built password hashing algorithm, and is never stored, logged or emailed in plain text.
- **Failed sign-in message:** Given a rep enters a wrong email or password, then the error reads **"Email or password is incorrect"** without revealing whether the email has an account.
- **Lockout:** Given **5 consecutive failed sign-in attempts** on an account, then sign-in for that account is paused for **15 minutes**, and the rep is shown the option to reset their password.
- **Password reset request:** Given a rep selects "Forgot password" and enters an email, then the same confirmation message is shown whether or not the email has an account, and a reset link is emailed only if it does.
- **Reset link:** Given a reset email, then the link works **once** and expires after **60 minutes**.
- **New password on reset:** Given a rep sets a new password through a reset link, then it must meet all password criteria and must differ from their current password.
- **After a reset or change:** Given a rep's password is reset or changed, then all of their other Team Stores sessions are signed out and a confirmation email is sent to the account email.
- **Change password:** Given a signed-in native-account rep, then they can change their password from My Account by entering their current password and a new one that meets the criteria (see Account Page).
- **Linked accounts:** Given a rep whose native account is linked to a Customizer identity, then the Team Stores password applies only to native Team Stores sign-in and never changes their Customizer password.

Epic E — Account linking & brand connections

- As a rep who signs in different ways, I want one Team Stores account, so that my stores and orders are always in the same place.
- As a native-account rep, I want to connect the brand Customizers I'm entitled to, so that I get quick access to my existing qx7 accounts and permissions and can add products from those brands.

- **Purpose of a connection:** Given a brand connection, then it represents the rep's qx7-backed access to that brand: it reuses their existing qx7 account and inherits the permissions set up for them in qx7. Adding products from that brand is what it unlocks in Team Stores.
- **One user record:** Given a rep has both a Customizer identity and a native Team Stores account, then both resolve to **one Team Stores user record**. Stores, orders, Access / Authentication gate status, primary brand and brand connections are shared across both sign-in methods.
- **No duplicate accounts:** Given any sign-in or sign-up, then the system must never create a second Team Stores user for a person who already has one. The exact linking rule (automatic on a verified matching email vs. explicit confirmation) is an open question.
- **Link existing account:** Given a rep's Customizer email differs from their native account email, then the rep can link the two from the Account page by authenticating with both.
- **Sign in either way:** Given a linked account, then the rep can sign in through a Customizer or with Team Stores credentials and reach the same workspace.
- **Connect a brand:** Given a signed-in rep, then they can connect a brand Customizer they're entitled to from the welcome modal or the Account page. A connection is valid only when the connected Customizer account maps to the rep's dealership in qx7.
- **Account validation on connect:** Given a rep tries to connect a brand, then the same Customizer account check as Epic B applies. If no account exists, the rep sees the Request access and Sign in with a different email options and the brand cannot be connected until Prolook adds the account.
- **Customizer-path connections:** Given a rep enters through a Customizer, then the brands they're auto-signed into (Epic A) are recorded as brand connections on their user record, so downstream features see one consistent list of brands regardless of sign-in method.
- **Session reset:** Given a rep clears their session or browser cache, or opens Team Stores in a different browser, then their Team Stores session ends and they must sign in again by either path. Brands whose Customizer email matches qx7 are reconnected automatically at the next sign-in.


### Metrics & Success Criteria

- Time-to-section under 3s from landing
- \< 1% mis-clicks bouncing back to brand home per session
- Native sign-up completion rate (sign-up started → email verified)
- Zero duplicate Team Stores user records for the same person
- Share of native-account reps with at least one connected brand
- Brand access requests submitted from sign-in, and median time from request to access granted

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires shared internal authentication / identity context to decide landing vs. gate. Team Stores supports **two authentication paths** resolving to one user record. The Customizer path needs **cross-product single sign-on / session propagation** (Customizer → Team Store, opened in a new tab), plus the **dealership→brand entitlement model** that links reps to dealerships by email and drives auto multi-brand sign-in (and the email-mismatch fallback). The native path needs a **Team Stores identity service** (sign-up, email verification, sign-in, password reset and change) that enforces the Epic D password criteria, including a **common/breached-password check**, salted password hashing, sign-in lockout, and single-use expiring reset links sent through a **transactional email service**. Both paths depend on an **account-linking service** that prevents duplicate users and maps Customizer identities and native credentials to one Team Stores user ID, and on a **brand-connection model** validated against qx7. Brand account validation needs a **per-brand Customizer lookup** that reports whether an account exists for an email, available for every brand Customizer, and an **access-request service** that routes requests to Prolook and tracks pending status across the Landing Page and Account Page. Reps with no dealership association require a **Stripe-generated business registration form** and internal Prolook review before access. The logged-out splash path needs an **email-entitlement lookup against qx7** (the rep↔email brand-association database) to resolve which brand Customizers to offer, followed by per-brand Customizer password authentication with the selected brand set as primary. The first-visit welcome modal needs a **first-visit flag** per rep, the list of the rep's **entitled brands (with logos)** for the Primary Brand Selection, and **primary-brand session state** that is editable later from My Account. Also needs a CMS-or-asset service for the splash/brand hero imagery and top-level marketing nav (currently a single static hero).

### Open Questions

- **Linking rule:** link automatically on a verified matching email, or always require explicit confirmation?
- **Native primary brand default:** first connected brand, or a required choice?
- **Logout scope:** does logging out of Team Stores end the Customizer pass-through, and can a natively logged-out rep be silently signed back in from the Customizer header? (See Team Stores Workspace.)
- **MFA:** is multi-factor authentication required for native accounts?
- **Brand connection mechanism:** can brand Customizers support an authorization hand-off so Team Stores doesn't collect Customizer passwords directly?
- **Connection persistence:** should brands connected under a different email be stored on the rep's Team Stores account so they survive a new session, cleared cache or a different browser? Pending developer confirmation of how long a Customizer will honor a stored connection.
- **Access requests:** who at Prolook receives brand access requests, and how is the rep told when access is granted?
