---
title: Store Settings (Settings Tab)
confluence_id: 4154130493
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab
last_modified: 2026-10-12
pulled: 2026-10-26
---
**Audit update — August 3, 2026:** re-audited against the current Team Stores Workspace prototype. The Settings tab now uses a **six-section left sub-nav** (previously a two-section pill nav): **General**, **Schedule & Status**, **Team & Roster**, **People & Access**, **Distribution & Fulfillment**, and **Catalog & Decoration** (only when a third-party vendor is enabled for the store). League/Team Manager Information moved into **General**; team-manager portal invites moved out of Distribution into the new **People & Access** section; **Distribution & Fulfillment** is now only the fulfillment method plus the team-manager order-fulfillment mapping. *Rewritten August 24, 2026 following the team store testing walkthrough: the Store Point of Contact **Service** mode is replaced by **Team Manager**, and the tax **State** select is searchable. Updated August 25, 2026: **Allow Duplicate Numbers** becomes a bulk default over per-roster settings, and the **Store Close Report** is specified (Epic H). Updated August 31, 2026: the **ship-to destination address** for Ship to Team Manager is editable here (Epic A3); the manager card holds **multiple manager records** with a designated primary; **Team & Roster** values can now also be set during store creation; the card previously called "Store Distribution Model" is named the **Fulfillment Method** card throughout, matching the section table and Step 1.* **The six-section count in this August 3 note is superseded by the September 2, 2026 amendment below — the sub-nav now carries seven sections.**

*Amended September 1, 2026 (a) — **Team Fundraising becomes a store-level master over per-item toggles.** Following the removal of Team Profit and the introduction of a per-item fundraising toggle in the price settings component (see* [*Product Catalog Management (Products Tab)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab)*, Governing rule 3), the Team Fundraising control on the Store Details card is no longer a simple boolean. Disabling it now sweeps the catalog through a confirmation interstitial, cannot override the commercial lock on already-ordered items, and therefore resolves to a **three-state read**. Specified in the new **Epic A4**.*

*Amended September 1, 2026 (b) — **connect-to-team now imports coach records.** The Team Database attaches coach records to its teams and organizations; the connect-to-team component previously pulled only branding, leaving reps to hand-type contact details the platform already held. Coaches are now returned on connect and offered for **verification and selection** as manager records. Epic A1 covers the behavior on re-bind, which is materially harder than at creation because the store already carries managers, orders, and portal invites. The creation-time flow is owned by* [*Step 1 — Basics*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609/Step+1+-+Basics)*, Epic D2.*

*Amended September 2, 2026 (c) — **a seventh Settings section, Store Customization & Design**, positioned after Team & Roster. It holds the **store theme color** (defaulting to the connected team's primary color, overridable via the Prolook color picker, applied to buttons and accents only) and the storefront **Announcement Message** (rich text, rendered per* [*Storefront Announcement Banner*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4305616902/Storefront+Announcement+Banner)*). Specified in the new **Epic I**. The announcement message is also authored during store creation — see* [*Step 1 — Basics*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609/Step+1+-+Basics)*, Epic H — and writes the same store-level field this section reads. Both controls are **explicitly exempt from post-launch locking** (Epic B): a banner whose purpose is communicating deadlines on a live store is useless if it freezes at launch. Storefront theme color was previously treated as post-initial-release and is now in scope, deliberately limited to buttons and accents rather than full theming.*

*Amended October 12, 2026 (d) — **the ship-to destination can be chosen from saved Pick-up Locations.** Destinations are saved once at workspace level and selected per store rather than typed into each one. Added as a bullet under **Epic A3**; the locations themselves are owned by* [*Pick Up Locations*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4380065805/Pick+Up+Locations)*, and the creation-time equivalent by* [*Step 1 — Basics*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609/Step+1+-+Basics)*, Epic F. Manual address entry is unchanged.*

### Executive Summary & Problem Statement

#### The Problem

The settings a rep chooses during store creation (name, web address, format, timeline, branding, contacts, fulfillment, tax) aren't final — names get corrected, dates shift, branding updates, contacts change. Without a place to revisit them, a rep would have to recreate a store to fix a setting. As the tab grew (ordering windows, roster rules, jersey numbers, manager portal access, freight mapping), a two-section split stopped scaling: unrelated concerns shared a page, and store identity sat alongside people management.

A closed store also has no moment of closure. The rep hits their deadline, the storefront locks, and the outcome of weeks of work is left sitting in a reports table nobody opens.

A third gap appeared once fundraising became a per-item decision. A store-level switch that silently rewrites every product in the catalog is a large, invisible action — and one that cannot be allowed to reach items buyers have already paid against.

A fourth: coaching changes are the most common contact edit a rep makes, and until now every one of them was typed by hand even where the Team Database already held the new coach's record.

A fifth, and the reason this tab gains a section: the rep has **no way to tell buyers anything**. Key dates, order deadlines, returns, sizing, and shipping are the questions parents actually ask, and no field in this tab holds an answer to any of them. Usability research found reps treat store information as setup rather than decoration — they expect somewhere to type it, and there wasn't one.

#### The Solution

A **Settings** tab inside the store manager where the rep edits and manages the store's information after creation, organized as a **left sub-nav of seven sections**. Each section holds read-only cards with their own pencil-edit affordance opening a **focused edit modal**. Closing a store produces a **Store Close Report** — a summary presented once, on the rep's next return to the workspace, with a scoped variant for team managers. Disabling Team Fundraising presents the rep with exactly what it will change before it changes it. Re-connecting the store to a team offers that team's coaches as manager records rather than leaving the rep to retype them. **Store Customization & Design** gives the rep a place to set the storefront's accent color and to write the announcement message buyers read at the top of the store.

| Section | Sub-nav description | Contents |
| --- | --- | --- |
| **General** | Details, branding & contact | Store Details card (identity, branding, fundraising, Store Point of Contact) + League/Team Manager Information card (one or more manager records, primary designated) |
| **Schedule & Status** | Order window & close dates | Active Order Window card (+ Order Window Scheduler, repeating close dates) + Store Status card (close/re-open, Create Template, Danger Zone) + Store Close Report |
| **Team & Roster** | Roster rules & jersey numbers | Roster Rules card + Jersey Number Selection card |
| **Store Customization & Design** | Storefront color & announcement | Store Theme Color card + Announcement Message card. On League stores, per-division and per-standalone-team announcement overrides and division-color application |
| **People & Access** | Invites & portal access | Team Manager Access — send an invite, invitee table, Resend / Revoke / View portal as |
| **Distribution & Fulfillment** | Fulfillment method & destination | Fulfillment Method card (incl. ship-to destination address) + Team Manager & Order Fulfillment Mapping |
| **Catalog & Decoration** | Seller scope & art policy | Seller scope + art policy. **Conditional:** the section and its sub-nav entry appear only when the store has a **third-party vendor enabled** (multi-source store). Prolook-only stores never see it. |

Fields stay freely editable while the store is in **draft mode**; once launched, a (still-TBD) subset locks while the rest remain editable.

### User persona & use cases

**Who is this for?** The store manager (rep) editing and managing store information after or as a store has been created.

**Scenarios encountered** Fixing a store name or web address before launch; extending a pop-up's closing deadline or setting per-team-code order windows; swapping the imported team logo/colors; changing the point-of-contact from the team manager to a salesperson; correcting a team manager's phone number and having the storefront footer follow; adding a second coach to the manager list after setup, or promoting one to primary; **re-connecting a store bound to the wrong team and pulling the right team's coaches in the same action; adding a mid-season replacement coach who is already in the Team Database rather than typing their details; re-connecting a team and being warned that the manager already invited to the portal came from the old team;** entering the bulk-shipment destination address a rep skipped during creation, or correcting one they mistyped; **pointing a store at a saved pick-up location instead of retyping the dealership's address; swapping a store from one saved location to another when freight moves;** changing the duplicate-number rule that was set during store creation; setting the rule for every team at once and then adjusting one division; deciding who picks jersey numbers; **writing the order deadline, return policy, and sizing guidance buyers see at the top of the storefront; updating that deadline mid-window because the mill pushed the production date; giving one division of a league its own deadline while the rest of the league keeps the league-wide message; accepting the team's primary color as the storefront accent, or overriding it with a color the coach asked for; applying a division's own brand color to the storefront for shoppers who select that division;** inviting a team manager to the portal and revoking access later; assigning division/team managers for freight routing; turning fundraising off for a whole store and seeing exactly which products it affects before confirming; discovering that two already-ordered items will keep collecting; turning fundraising back on months later and finding every item as it was left; reviewing how a store performed after it closes; sharing a manager-scoped version of that report with a coach; switching the fulfillment method while still in draft; setting art policy on a store that carries a third-party vendor's catalog.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want a Settings tab to edit my store's information, so that I can correct or update settings without recreating the store.
- As a rep, I want settings grouped by concern in a sub-nav, so that I can find a setting by what it does rather than scrolling one long page.
- As a rep, I want each card edited in its own focused modal, so that I can update one area at a time without wading through every field.
- As a rep, I want to reconnect the store to a different team, so that I can re-import the correct logo, colors, and sports if it was bound to the wrong team.
- **As a rep, I want a reconnect to offer me the new team's coaches, so that fixing a wrong team binding doesn't leave me retyping contact details that already exist.**
- **As a rep, I want to pull a coach from the Team Database when the coaching staff changes mid-season, so that a routine personnel change is a selection rather than data entry.**
- **As a rep, I want to be told when a reconnect leaves behind managers from the old team — especially any who have portal access — so that a branding fix doesn't quietly leave the wrong person able to see this store.**
- As a rep, I want the storefront contact to follow the team manager's record, so that fixing their phone number in one place fixes it everywhere.
- As a rep, I want to add or remove managers after setup and control which one is the primary contact, so that a coaching change is an edit rather than a rebuild.
- As a rep shipping in bulk, I want to see and edit the destination address in one obvious place, so that a store I launched without one is easy to complete.
- **As a rep who ships to the same place repeatedly, I want to pick a saved pick-up location rather than retype its address, so that a corrected address is corrected everywhere at once.**
- As a rep, I want the roster rules I chose during store creation to be exactly what I find here, so that I am not wondering which of two places wins.
- As a rep, I want to set the duplicate-number rule across every roster at once, so that per-team control doesn't mean configuring each roster by hand.
- **As a rep, I want somewhere to write the key dates, deadlines, returns, sizing, and shipping information buyers keep asking me about, so that the answers are on the storefront instead of in my text messages.**
- **As a rep, I want to edit that message on a live store, so that a moved production date is a two-minute fix rather than something I cannot change until the window closes.**
- **As a rep running a league, I want a division to be able to carry its own message, so that one division's different deadline doesn't require me to write a message covering every division at once.**
- **As a rep, I want the storefront to pick up my team's color without my doing anything, and to let me change it when the coach asks, so that the default is right and the override is available.**
- As a rep, I want a single place to invite and revoke team-manager portal access, so that people management isn't buried in fulfillment settings.
- As a rep running a League store that ships to team managers, I want to map a manager to every division or team, so that bulk freight is routed to the right person.
- As a rep, I want to see every product I am about to change before I turn fundraising off for the store, so that a one-click switch isn't a blind rewrite of my catalog.
- As a rep, I want to be told which items can't have fundraising removed because they've already been ordered, so that I understand why the store isn't fully switched off.
- As a rep, I want turning fundraising back on to restore what I had, so that re-enabling isn't a fresh configuration job.
- As a rep, I want a summary of how a store performed once it closes, so that the result of the season is a moment rather than a spreadsheet.
- As a team manager, I want my own version of that summary covering only my team, so that I can see how we did without seeing the rep's margins.
- As a rep, I want to freely edit everything while the store is in draft, so that I can fully dial it in before going live.

##### Epic A — Seven-section Settings layout & per-card edit modals

The Settings tab renders a sticky **left sub-nav** (label + one-line description per section); the selected section fills the content area. Each card is read-only with a pencil-edit affordance opening a focused modal; field types and conditional logic mirror *Step 1 — Basics* of the creation flow. Order: General → Schedule & Status → Team & Roster → **Store Customization & Design** → People & Access → Distribution & Fulfillment → Catalog & Decoration (conditional).

- **General → Store Details card → "Edit Store Details" modal.** Read view shows Store Name, **Store Type** (Individual Team Store / League Store), Team Name, Sport, boxed **Team Logo** and **Team Colors**, plus in-card blocks for **Team Fundraising** (a **three-state pill** — see Epic A4) and the **Store Point of Contact** (Email + Phone channels, each showing its mode and resolved value). The modal edits Store Name, Team Name, **Team Branding & Sport** (connect-to-team component with coach import, Team Logo drop zone, Team Colors, Sports multi-select), the **Roster Rules** and **Team Fundraising** toggles, **Compliance & Taxation** (Collect Sales Tax toggle; when on, a **searchable State select** — type-ahead filtering on state name and two-letter postal abbreviation — that auto-fills the read-only flat Tax Rate %), and the **Store Point of Contact**.
- **General → League/Team Manager Information card → edit modal.** Titled **League Manager Information** for League stores and **Team Manager Information** for single-team stores. The card holds **one or more manager records** (see Epic A2c). Each record's read view shows Name, Street Address (street/apt, city, state, ZIP), Phone Number, Email, and **Contact Preference** (Email/Phone chips), with the **primary** record marked. This card lives in **General** — it is the store's contact record of record, not a fulfillment setting. Because the Store Point of Contact can inherit from the primary record (Epic A2), edits there propagate to the storefront footer.
- **Schedule & Status.** Active Order Window card → **"Edit Store Schedule" modal**, plus the Order Window Scheduler and repeating close dates (Epic E). Store Status card → **Close / Re-open Store** (Epic D), the **Create Template** action, and the **Danger Zone → Archive Store** (Epic C). The **Store Close Report** (Epic H) is reachable from this section once the store has closed.
- **Team & Roster.** Roster Rules card (Allow Duplicate Numbers — a bulk default over per-roster settings, see Epic F) and the **Jersey Number Selection** card (Epic F). Both controls are **also surfaced during store creation** in *Step 1 — Basics*, Epic D1; that panel and these cards read and write the **same store-level values**, so whatever the rep chose at setup is what appears here.
- **Store Customization & Design.** The **Store Theme Color** card and the **Announcement Message** card (Epic I). On League stores the section additionally lists divisions and standalone teams for per-scope announcement overrides and division-color application. The announcement message is **also surfaced during store creation** in *Step 1 — Basics*, Epic H, writing the **same store-level value**; the theme color is not offered in the wizard.
- **People & Access.** **Team Manager Access** — invites and portal access for this store (Epic A2b).
- **Distribution & Fulfillment.** The **Fulfillment Method** card → its own edit modal (Ship to Team Manager (FREE) vs. Direct-To-Home Residential Delivery, shown with icon, badge, and helper copy, plus the **ship-to destination address** when Ship to Team Manager is selected — Epic A3), and — for League stores shipping to team managers — the **Team Manager & Order Fulfillment Mapping** (Epic A3). Nothing else lives here.
- **Catalog & Decoration.** Seller scope and art policy — rendered **only when a third-party vendor is enabled** for the store (Epic G).

##### Epic A1 — Connect-to-Team component & coach import

The **Edit Store Details** modal (General) carries a **connect-to-team** component under *Team Branding & Sport*, letting the rep bind or re-bind the store to a team profile and pull its official branding **and its coach records**.

**Binding and re-binding**

- **Connected state:** Given a store bound to a team, when the modal opens, then a banner reads **"Connected — \[Team Name\]"** noting the official logo, colors, and sports were imported, with a **Change Team** action (unbound stores show "Import Team Profile" with a **Connect to Team** action).
- **Reconnect / switch:** Given the connected banner, when the rep clicks **Change Team**, then they can reconnect to a different team profile via the team-database picker and the Team Logo, Team Colors, and Sports **re-import** from the newly connected team. The **store theme color** re-derives on the same action where it is still on the team default — see Epic I.

**Coach import — same model as creation, harder context**

The Team Database attaches **coach records to its teams and organizations**. A connect returns those records alongside the branding, and the rep converts the ones they want into manager records on the League/Team Manager Information card (Epic A2c). The selection model is identical to *Step 1 — Basics*, Epic D2 and is not restated here: nothing is imported silently, records are shown in full for verification, multiple coaches are multi-selectable, and imported records are **point-in-time copies** that never write back to the Team Database and never live-sync from it.

What differs after the store exists:

- **The store already has managers.** A connect **adds**; it never replaces. Given the rep selects coaches from a newly connected team, when they save, then those records are appended to the existing manager collection. No existing record is overwritten, demoted, or deleted as a side effect of a reconnect.
- **Re-binding surfaces the managers that came from the old team.** Given the rep re-binds a store to a different team, when the reconnect completes, then the modal lists any existing manager records **imported from the previously connected team** and asks whether they should be kept or removed. It is a prompt, not an automatic cleanup — a coach may legitimately follow a team, and a rep may have hand-corrected a record until it is right.
    - **Records carrying portal access are called out separately.** Given one of those managers has an **active or pending invite** in People & Access (Epic A2b), then the prompt names them and states plainly that removing the manager record does **not** revoke their portal access, which is a separate action in People & Access. A branding fix must never quietly leave the wrong person able to read this store's reporting and rosters, and it must never silently revoke access the rep did not ask to revoke.
    - **Hand-entered records are never listed here.** The prompt covers only records whose origin was an import from the team being replaced. A manager the rep typed is theirs and is left alone.
- **The primary is protected.** Given the current primary manager record would be removed by the re-bind prompt, when the rep confirms, then removal is blocked until another record is designated primary — the existing rule in Epic A2c applies unchanged. A reconnect can never leave a store with zero managers where a point-of-contact channel depends on one.
- **Point-of-contact consequences are stated before saving.** Given a point-of-contact channel is on Team Manager mode, when a reconnect changes which record is primary, then the modal states that the storefront footer will change and shows the resolved values, consistent with Epic A2c's treatment of primary re-designation. This is buyer-visible and is never applied silently.

**Mid-season coach changes**

- A rep does not need to re-bind the store to import a coach. Given the store is already connected to the correct team, when the rep opens the connect-to-team component, then the current team's coach records are available for selection — so a mid-season staff change is a selection against the team the store is already bound to, not a reconnect.
- **OPEN — to be confirmed:** whether this re-fetch should be surfaced on the **League/Team Manager Information card** as well (e.g. an "Add from Team Database" action beside "Add manager"), which is where a rep looking to add a coach would naturally go, rather than only inside the branding component. Recommend yes; confirm the surface before build.

**Import grants nothing**

- Importing a coach creates a **contact record only**. It provisions no account, sends no email, and grants no portal access. Team Manager Portal entitlement is created solely by an explicit invite in People & Access (Epic A2b). This rule is absolute and is the single most important constraint on the feature.

##### Epic A2 — Store Point of Contact (General → Store Details)

The **Store Point of Contact** block lives in the **Store Details card** (read view) and is edited in the **Edit Store Details** modal — not the Team Manager modal. It sets the contact info shown in the storefront footer. Modes and behavior mirror *Step 1 — Basics*, Epic E.

- **Email channel:** one primary email selected from **Team Manager Email** (default), **Salesperson Email**, or **Custom Email**.
- **Phone channel:** one primary phone selected from **Team Manager Phone** (default), **Salesperson Phone**, or **Custom Phone**.
- **Team Manager mode inherits from the primary manager, and it does not copy.** A channel set to Team Manager renders read-only in the modal, showing the value from the **primary** record on the League/Team Manager Information card with a note that it follows that record. Editing the value means editing the manager card; the point-of-contact block links straight to it. Non-primary manager records never feed the point of contact.
- **Live propagation:** given a channel on Team Manager mode, when the primary manager's Email or Phone Number changes on the League/Team Manager Information card, then the storefront footer reflects the new value with no further action. This binding is internal to Team Stores — it does not extend back to the Team Database, so a coach's details changing there do not alter a live storefront.
- **Mode is per channel:** Email and Phone are chosen independently — a store may publish the team manager's email alongside a salesperson's phone.
- **Blank-value guard:** given a channel on Team Manager mode whose underlying primary manager field is empty, when the rep saves, then an inline error directs them to the League/Team Manager Information card to fill it, or to switch that channel to Salesperson or Custom. This applies equally to imported records — a coach record with no email on file does not satisfy an Email channel on Team Manager mode.
- **Storefront display:** the resolved channel values are surfaced as the buyer-facing contact in the storefront footer.

##### Epic A2b — People & Access (Team Manager Portal invites)

The **People & Access** section owns everything about who can get into this store's portal. It previously sat at the bottom of Distribution & Fulfillment.

- **Scope copy:** the section explains the invitee lands in a slimmed-down portal with exactly two areas — **Reporting** and **Rosters** (no products, orders, settings, or vault) — scoped to **this store only**.
- **Send an invite:** an email field + **Send Invite** (disabled until the address validates; Enter submits). On send, the invite is added to the table and a toast confirms; helper copy notes the invitee receives an email link to set a Team Manager Portal password.
- **Manager records are not invitations.** Manager records entered during store creation, imported from the Team Database, or added on the manager card (Epic A2c) create **no portal access** — access is granted only by an explicit invite sent from here. Where a manager record carries an email, this section offers **Invite** against it so the rep is not retyping an address they already entered. An imported coach is offered in exactly the same way as a typed one; the import path confers nothing.
- **Removing a manager record does not revoke access.** Given a manager record is deleted from the manager card — including by the re-bind prompt in Epic A1 — then any invite issued against that person **remains active** until revoked here. The two are deliberately separate: a contact record and an entitlement are different things, and inferring one from the other in either direction would produce surprises. Where the manager card removes a record with live access, it says so and links here.
- **Invitee table:** columns **Invitee** (avatar + email), **Invited** (date), **Status**, actions. Status is either **Active** (green dot, with *Last login* when known) or **Invited · not logged in** (amber dot). Empty state: "No team managers invited yet."
- **Row actions:** **View portal as** for active managers (opens the manager portal in their context), **Resend** for pending invites, and **Revoke** on every row.
- **Revoke confirmation:** a modal warns the invitee immediately loses access to Reporting and Rosters for this store and that they can be re-invited at any time; confirming removes the row and toasts.
- **Close-report access:** an active team manager also receives the **manager version of the Store Close Report** (Epic H) for this store. Revoking access removes it.

##### Epic A2c — Multiple manager records (General → League/Team Manager Information)

A store may carry more than one manager. Records originate in three places — *Step 1 — Basics* (Epic E, "Add another manager"), **coach import from the Team Database** (*Step 1* Epic D2 and Epic A1 above), or here — and all three write the same collection.

- **Origin does not create classes of record.** An imported coach and a hand-typed manager are the same kind of record: same fields, same editability, same eligibility for primary designation, invites, and fulfillment mapping. No downstream consumer distinguishes them.
- **Add / remove:** Given the manager card, when the rep opens its modal, then they can **add** further manager records (First Name, Last Name, Email, Phone Number, Street Address, Contact Preference) and **remove** any non-primary record.
- **Editing an imported record is local.** Given an imported manager record, when the rep corrects a field, then the change applies to this store only and is **never written back to the Team Database**. Team Stores consumes that data; it does not maintain it.
- **Exactly one primary:** Given the collection, then exactly one record is designated **primary** at all times. The primary is the inheritance source for the Store Point of Contact (Epic A2) and the only record whose contact fields are subject to point-of-contact validation.
- **Changing the primary:** Given a non-primary record, when the rep designates it primary, then the previous primary is demoted, and any point-of-contact channel on Team Manager mode **immediately resolves to the new primary's value** on the storefront footer. The modal states this before saving, since the change is buyer-visible.
- **Removing the primary:** Given the primary record, when removal is attempted, then it is blocked until another record is designated primary. A store never has zero managers where a point-of-contact channel depends on one.
- **Removal and portal access are separate.** Removing a manager record does not revoke a portal invite issued to that person (Epic A2b). Where the record being removed has an active or pending invite, the confirmation says so and links to People & Access.
- **Addresses:** every manager record carries an address, used for order fulfillment routing (Epic A3). For a single-manager store shipping to the team manager, that address **is** the ship-to destination. **OPEN:** whether Team Database coach records carry an address that could populate this on import — see *Step 1 — Basics*, Epic F.

##### Epic A3 — Fulfillment Method, ship-to destination & Order Fulfillment Mapping (Distribution & Fulfillment)

The **Fulfillment Method** card owns the store's shipping model and, when that model is bulk, where the bulk shipment goes.

- **Method:** Ship to Team Manager (FREE) vs. Direct-To-Home Residential Delivery, mirroring *Step 1 — Basics*, Epic F.
- **Ship-to destination address** *(conditional — Ship to Team Manager only)*. Given the method is Ship to Team Manager, when the card renders, then it shows the destination address (street/apt, city, state, ZIP) with the card's edit affordance; the rep can **edit** it or **clear** it. Given the method is Direct-To-Home, then no destination address is shown.
    - **Choosing from saved Pick-up Locations.** Given the workspace has saved **Pick-up Locations** (see *Pick Up Locations*) and the method is Ship to Team Manager, when the rep edits the destination, then they may either **select a saved location** or **enter a Ship-To Address manually**; where no locations exist, manual entry behaves exactly as it does today and the rep is prompted that destinations can be saved once and reused. A selected location is held as a **reference, not a copy** — an edit to that location in Workspace Settings propagates here with no action, and a location switched off at workspace level leaves this store with **no destination**, surfaced as the "No destination address" state below and blocked at the freight gate until one is supplied (*Pick Up Locations*, Epic C). Selecting a location and typing an address write the **same destination field**; a store has one destination however it was supplied, and the rep can swap between the two input methods freely.
    - **One address, two surfaces.** This is the **same record** as the address captured in *Step 1 — Basics*, Epic F, and the same address held on the store's primary manager record (Epic A2c) — not a third copy. An address entered during creation appears here unchanged, and an edit here is what the freight gate reads. Neither surface holds a value the other cannot see.
    - **Clearing is permitted, and consequential.** Given the rep clears the destination address, when they save, then the save succeeds and the card shows a **"No destination address"** state with the consequence stated: pending orders cannot be submitted for fulfillment until an address exists. The clear is not blocked — a rep correcting a wrong address should not have to keep a wrong one — but the store is visibly not fulfillment-ready.
    - **Backend verification:** an entered address is validated against the map service before it is accepted, using the same verification path as manager-record addresses. An address arriving via coach import is verified on the same path — imported data is not trusted over typed data.
- **Order Fulfillment Mapping.** Shown only for **League stores** whose fulfillment method is **Ship to Team Manager**. Mirrors the My Team(s) tab's division/team structure live and maps a freight recipient to every shipping container.
    - **Per-division mode:** each division routes to the **league manager**, a single **division manager**, or **individual team managers** (with per-team override entries). Manager records collect First/Last Name, Email, 10-digit Phone, and Address — the address is required for order fulfillment. The picker draws on the store's existing manager collection (Epic A2c), so managers named during store creation — or imported from the Team Database — are selectable rather than re-entered.
    - **Submission gate:** incomplete manager assignments — or a missing destination address on an assigned manager — block pending-order submission (see the Order Management spec). The header shows "n division · m team" assignment counts, and jump-ins from the My Team(s) tab land on **Settings → Distribution & Fulfillment** with the right division auto-opened (auto-switching it to individual-teams mode when a specific team was targeted).

##### Epic A4 — Team Fundraising as a store-level master (General → Store Details)

Fundraising is now set **per item** in the price settings component (see [Product Catalog Management (Products Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab), Governing rule 3). The **Team Fundraising** control on this card is the store-level master over those per-item toggles. It is no longer a boolean, and turning it off is no longer a silent write.

**The control**

- **Enabling** Team Fundraising makes the Fundraising input available across the catalog, subject to each item's own toggle. New items added after this point default their toggle to on.
- **Disabling** Team Fundraising suppresses fundraising across the catalog — but only through the interstitial below, and never on a commercially-locked item.
- **A per-item toggle can always narrow, never widen.** An item's fundraising renders only when the store flag **and** the item toggle are both on. A rep cannot enable fundraising on one item in a store where fundraising is off.

**The disable interstitial**

- **Trigger:** Given Team Fundraising is on, when the rep switches it off in the Edit Store Details modal, then an interstitial is presented **before the change is applied**. The toggle does not take effect until the rep confirms.
- **Two lists, not one.** The interstitial has two sections:
    - **Will be disabled** — every product and bundle in the catalog with fundraising currently enabled, each shown with its name and **its current fundraising amount**, so the rep can see the scale of what they are switching off rather than a bare count.
    - **Cannot be disabled** — items exempted by the commercial lock, each with the reason stated plainly: fundraising cannot be removed from an item that has already been ordered. This section is omitted entirely when nothing is exempt.
- **Confirmation copy** asks the rep to confirm they want to disable fundraising for the listed products, and states that entered amounts are kept.
- **Actions:** **Cancel** (the toggle reverts, nothing is written) and a confirm action. On confirm, fundraising is disabled for every item in the first list — including items where it was individually enabled — and the exempted items are left untouched.
- **Empty case:** where no catalog item has fundraising enabled and none is exempt, the interstitial is skipped and the toggle applies directly. There is nothing to review.
- This modal is registered in the inventory in *System Modals & Toasts*.

**Amounts are preserved, on both paths**

- Disabling fundraising — at store level or per item — **never clears an entered amount**. Figures are stored and reappear intact whenever fundraising is turned back on. The rep is not asked to remember a number they set months ago.
- This is deliberately consistent across the two routes: the store-level sweep behaves exactly as a rep flipping each item's toggle by hand would.

**Re-enabling restores prior state**

- Given fundraising was disabled at store level, when the rep re-enables it, then **every item returns to the enabled/disabled state it held immediately before the disable**, with its preserved amount. Re-enabling is a restore, not a blanket switch-on: an item the rep had individually turned off before the store-level disable comes back off.

**The commercial lock wins**

- An item carrying a **non-cancelled order** has its fundraising toggle locked along with the rest of its commercial fields (*Products Tab*, Governing rule 1). The store-level disable **cannot** override that lock — buyers have already paid the fundraising on those items, and removing it would misstate what the store collected.
- The consequence is a legitimate mixed state: **Team Fundraising off at store level while ordered items continue to collect.** This is expected, not a defect.
- Exempted items re-resolve automatically. If every order against an exempted item is later cancelled, its commercial lock releases and the store-level disable applies to it from that point.

**Three-state read on the card**

The Team Fundraising block in the Store Details read view reports one of three states rather than an enabled/disabled binary:

| State | Pill | Detail line |
| --- | --- | --- |
| Enabled | **Enabled** | Count of catalog items currently collecting |
| Disabled, nothing collecting | **Disabled** | — |
| Disabled with exemptions | **Disabled · n items still collecting** | Link into the Products tab filtered to those items |

This follows the **mixed-state** pattern already established by the Roster Rules card in Epic F, which reports divergence with a count and a link rather than implying uniformity.

**Reporting follows the same three states.** The Fundraising Report under Reports renders in the enabled state and in the disabled-with-exemptions state, and is hidden only when fundraising is off and nothing is collecting (see *Store Analytics (Reports Tab)*, Epic D).

##### Epic B — Edit permissions by store state — TBD

- **Draft — fully editable:** Given a store in **draft mode** (created but not yet launched), when the rep opens the Settings tab, then **all** store settings and information can be edited/changed.
- **Launched — partial lock TBD:** Given a **launched** store, when the rep opens the Settings tab, then a subset of fields becomes non-editable while the rest stay editable.

**OPEN — to be determined:** the exact fields/inputs that lock after launch are *TBD* and must be defined before build (likely candidates touch fulfillment, tax, format/timeline, and the web address — anything that would disrupt live orders or buyer expectations). The **Store Point of Contact** is a deliberate exception to lock: contact details must stay editable on a live store so buyers are never pointed at a stale address or a departed manager. The **ship-to destination address** is a second deliberate exception, for the same reason — a live bulk store must be able to correct where its freight is going. **Team Fundraising** is a third: it must remain switchable on a launched store, with the commercial lock protecting individual ordered items rather than the store-level control being frozen wholesale. The **manager collection** is a fourth, for the same reason as the point of contact — coaching changes happen mid-season and must not require a store rebuild. Whether **re-binding the store to a different team** should be permitted after launch is part of the TBD lock list and should be decided explicitly, since re-binding changes buyer-visible branding on a live storefront.

**Store Customization & Design is the fifth exception, and both of its controls are exempt from post-launch locking.** The **Announcement Message** exists to communicate order deadlines, returns, sizing, and shipping on a **live** store; a production date that moves after launch is the ordinary case rather than the exception, and a message frozen at launch is worse than no message because buyers will read it as current. The **store theme color** is exempt on the same basis — a coach asking for a different color mid-season is a cosmetic change, not a commercial one. Neither control affects pricing, fulfillment, tax, or any placed order, so neither carries the risk the lock list exists to manage. This exemption is not part of the TBD list; it is decided.

##### Epic C — Store archiving (Schedule & Status → Danger Zone)

There is **no store deletion**. Instead, the **rep who owns the store** can **archive** it from the Danger Zone inside the Store Status card (hidden for manager-role users). Archiving shuts the store down while preserving it as a historical record — nothing is destroyed.

- **Owner-only:** Given a store, when the **owning rep** opens Schedule & Status, then an **Archive Store** action is available to them.
- **Confirmation:** Given Archive Store, when clicked, then a confirmation modal lists the consequences — hides the storefront from all buyers immediately, stops all new orders and closes any active ordering window, and removes the store from the active list — noting order history and reports are retained and the action **can only be undone by support**.
- **Storefront shutdown:** Given the store is archived, when a guest visits the **public storefront URL**, then it is **completely shut down** and routes them to a neutral *"This store is closed"* landing screen.
- **Read-only historical record:** Given the store is archived, when the rep opens the backend management dashboard, then it is **transitioned into a read-only historical record** (orders, roster, products, and settings remain viewable but no longer editable) — the Store Status card shows an **Archived** pill and the close/archive actions disappear. Any Store Close Report already generated remains viewable.

##### Epic D — Store closing (Schedule & Status → Store Status)

**Closing is distinct from archiving** — both shut the storefront, but closing is **reversible** while archiving is not (support-only undo). A closed store can be re-opened at any time and keeps a **fully editable** management workspace.

- **Triggers — manual or scheduled:** Given a store, when the rep **manually closes** it (Close Store on the Store Status card, with a confirmation modal), OR when its configured **close date** is reached, then the store enters the **closed** state.
- **Storefront locked:** Given a closed store, when an end-user visits the storefront, then it is **locked** and they see a *"This store is closed"* landing page (no shopping/checkout). The announcement banner does not render in this state — see *Storefront Announcement Banner*, Epic A.
- **Full management access retained:** Given a closed store, when the rep/owner opens the **Manage-Store Workspace**, then they retain **full access** to manage the store (products, roster, orders, settings remain editable — unlike archiving).
- **Manual re-open to publish changes:** Given a closed store with edits made in the workspace, when the rep wants those changes live, then they must **manually re-open the store** (Re-open Store) — changes are **not reflected on the storefront until the store is re-opened**.
- **Close triggers the report:** entering the closed state generates the **Store Close Report** (Epic H).
- **Create Template:** the same card carries **Create Template** — saving this store's products, pricing, and settings as a reusable blueprint for future stores.

##### Epic E — Active Order Window, scheduler & repeating close dates (Schedule & Status)

The Active Order Window card renders for **every** store: pop-up stores with a set window get the full progress treatment, while always-on stores show an **"Always open"** pill and a note that the store stays open until closed manually.

- **Total raised:** the card shows the **total $ amount raised** during the window alongside the team avatar and name.
- **Progress bar & days left:** a set window renders a **progress bar** between the open and close dates with a **"days left" pill** that turns urgent (red) inside the final 7 days and reads "Closed" once the store is closed.
- **Edit Store Schedule modal:** a **Store Schedule** toggle offers **Set window** vs. **Always open**; choosing **Set window** reveals **Opens** and **Closes** date pickers defining the order-accepting range.
- **Order Window Scheduler:** below the window, the rep can schedule at **store level** or **per team code** — a searchable, status-sorted table of team codes with start/end/timezone per row, multi-select **bulk apply** (with an "only unset" option), status counts, and **coverage-gap detection** that flags days between sequential windows where no team is open.
    - **Not the same key as customization overrides.** This scheduler is keyed **per team code**. The announcement and color overrides in Epic I are keyed **per division and per standalone team**. The two surfaces are deliberately similar in ergonomics and deliberately different in key; neither should be implemented from the other.
- **Repeating close dates:** League stores can turn the single window into a **repeating close** cadence — Weekly, Every 2 weeks, Monthly, or End of season — with the next close date derived from the current one.

##### Epic F — Team & Roster

Roster policy that shapes buyer-facing and roster behavior, split out from store identity.

**Also set at creation.** Both cards in this section are surfaced during store creation in *Step 1 — Basics*, Epic D1, writing the **same store-level values**. A value chosen at setup is what these cards display, and editing here overwrites it. There is no separate creation-time copy.

- **Roster Rules card — Allow Duplicate Numbers is a bulk default, not the enforcement layer.** The duplicate-number rule is owned **per roster** (see Roster Management, Epic 4), because divisions within one league legitimately differ. The control on this card is a **select-all / bulk apply**: setting it **writes the value to every roster in the store**, and each roster may then override it. The store-level value never overrides a roster afterward, and validation always reads the roster's own setting.
    - **Mixed state:** where rosters disagree, the control reports a **mixed state** rather than implying uniformity, with a count of how many rosters diverge and a link into the My Team(s) tab. Team Fundraising uses this same pattern for its own mixed state (Epic A4), as does the announcement override list in Epic I.
    - **New rosters** inherit the current store-level value at creation, then diverge freely. This includes rosters created during store creation in the League Divisions & Teams step, which read the value set in Step 1.
    - Enforcement — locking taken numbers at selection rather than flagging at submit — is specified in Roster Management, Epic 4.
- **Jersey Number Selection card:** two exclusive modes — **Team manager chooses on behalf of players** (numbers assigned on the roster; buyers see their assigned number, no entry at checkout) or **Players choose their own numbers** (buyers enter a number on the product page and the roster fills in as orders arrive). Selecting a mode saves immediately with a confirmation toast; helper copy states where number entry lives and notes duplicate-number rules still apply per roster.

##### Epic G — Catalog & Decoration (third-party vendor stores only)

**Conditional section.** Catalog & Decoration — and its entry in the Settings sub-nav — renders **only when the store has a third-party vendor enabled** (a multi-source store carrying more than Prolook's catalog). On Prolook-only stores the section is absent entirely and the sub-nav shows six sections.

- **Seller scope:** which sellers' catalogs the store may pull products from.
- **Art policy:** how third-party decoration/art is handled — including the default policy that blocks publishing until art is cleared.

##### Epic H — Store Close Report

When a store closes, the rep gets a summary of how it performed — presented as a moment rather than left in a reports table.

- **Trigger:** generated when the store enters the **closed** state (Epic D), whether closed manually or by reaching its scheduled close date, and **auto-presented on the rep's first return to the workspace after the close**.
- **Format:** a high-summary, celebratory retrospective — a "year in review" treatment rather than a data table, summarising the closed order window.
- **Once, then persistent:** it auto-presents once and is dismissible. Afterward it remains reachable from the **Store Status card** in Schedule & Status, so the rep can return to it. It gates nothing and blocks no action.
- **Team-manager version:** a **separate variant** is generated for team managers with portal access (Epic A2b), **scoped to what that manager can see** — their own team's participation and **team revenue / fundraising** — and made **visually distinct** from the rep version so the two are never mistaken for each other. It **excludes dealer profit** and any figure outside that manager's scope. The team-facing figure was formerly team profit; with that input removed (see *Products Tab*, Governing rule 3), it now reports team revenue and fundraising, matching the Reports tab.
- **Re-opening:** if a closed store is re-opened (Epic D) and later closes again, the report regenerates against the new window. The prior report remains available as a record of that earlier window.
- **Archiving:** archiving (Epic C) does not generate or regenerate a report. A report already produced stays viewable as part of the archived store's read-only record.

**OPEN — to be confirmed:** the exact metric set on each version. The rep version is expected to cover total raised, orders and units, roster participation, and profit; the manager version a scoped subset. Confirm the figure list — and whether the manager version is emailed on close or only surfaced in-portal — before build.

##### Epic I — Store Customization & Design

The seventh section. Two cards: the store's storefront accent color, and the announcement message buyers read at the top of the store. The buyer-facing render of both is owned by [Storefront Announcement Banner](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4305616902/Storefront+Announcement+Banner) and is not restated here.

**Store Theme Color card**

- **Read view:** Given the section renders, then the current theme color is shown as a swatch with its **source** — **Team default** or **Custom** — so the rep can tell at a glance whether they have overridden anything.
- **The picker is Prolook's.** Given the rep opens the color control, then the **Prolook color picker component** is presented. No bespoke picker is built for this card.
- **Default derivation:** Given a store connected to a team, then the theme color defaults to that team's **primary color** as imported from the Team Database in *Step 1 — Basics*, Epic D.
- **Change Team re-derives a defaulted color.** Given the theme color is still on the team default, when the rep changes the store's connected team (Epic A1), then the color **re-derives to the new team's primary color**. This is a deliberate departure from the point-in-time-copy pattern that governs coach import — the theme color is a live default, not a snapshot.
- **A custom color survives Change Team.** Given the rep has explicitly selected a custom color, when the connected team changes, then the custom color is **retained and not overwritten**. Re-derivation applies only to values still sitting on the team default. A rep who made a deliberate choice does not have it silently reverted by a branding fix.
- **Reset:** Given a custom color, then a **Reset to team color** action returns the field to the derived default and restores its source label to Team default, re-arming future re-derivation.
- **Scope is stated on the card.** Helper copy states that the color applies to **buttons and accents only**, so the rep is not expecting a full restyle and does not report the unchanged page background as a bug.
- **Contrast — OPEN.** Whether the picker warns or blocks on a color with insufficient contrast against button label text is undecided; see the open questions on *Storefront Announcement Banner*.

**Announcement Message card**

- **Read view:** Given the section renders, then the current message is shown as **rendered rich text**, not as markup, with an edit affordance. Given no message, then the empty state states plainly that the storefront shows no banner while the field is empty — the absence is the designed behavior, not an incomplete setup step.
- **Editor:** Given the rep edits the message, then a **rich-text editor** is presented in a focused edit modal, registered in *System Modals & Toasts*.
- **Placeholder guidance:** Given an empty editor, then placeholder text demonstrates the intended use with a worked example covering **key dates, order deadlines, returns, sizing, and shipping**. The placeholder is illustrative and is never saved as content.
- **One field, two surfaces.** Given a message entered in *Step 1 — Basics*, Epic H, when the rep opens this section, then the same value is present. There is **no creation-time copy** — the wizard and this card write the same store-level field, consistent with the ship-to address and Team & Roster patterns.
- **Live propagation:** Given a launched store, when the message is saved, then the storefront banner reflects it without a republish and without re-opening a closed store.
- **Free text, and the rep owns its accuracy.** The message is not parsed, date-checked, or reconciled against the store's configured ordering window. A rep may type a deadline that differs from the countdown on the Ordering-Window Banner, and the system will not detect or warn about it. This is an accepted consequence of a free-text field.
- **Character limit and permitted marks — OPEN.** A ceiling on message length and the permitted rich-text feature set (in particular whether links are allowed) are undecided and implementation-blocking; see the open questions on *Storefront Announcement Banner*.

**League stores: per-division and per-standalone-team overrides**

- **Conditional surface:** Given a **League Store**, then the section additionally lists the store's **divisions** and **standalone teams**, each with an optional announcement message. Given an **Individual Team Store**, then no override surface is present — there is no division tier and one team.
- **Override granularity is division and standalone team only.** A team **inside** a division does not carry its own message; it inherits its division's. This is the deliberate boundary on the feature's complexity.
- **Inheriting is shown as inheriting.** Given a division or standalone team carrying no message, then the read view shows it as **inheriting the store-level message**, not as empty — the same mixed-state honesty the Roster Rules card applies in Epic F.
- **Division color reuse — no second color field.** Given a division, then its color contribution is the **existing division brand color** set in the My Team(s) tab detail panel. This section offers a per-division toggle to **apply the division's brand color to the storefront** for shoppers resolved to that division, and links out to My Team(s) to change the color itself. No division-specific color is stored here.
- **Deleting a division drops its customization.** Given a division carrying a message or an applied color is deleted, when its teams become standalone, then they drop both along with the division's branding and resolve to store level unless they carry their own — matching the existing delete semantics in *Roster-Optional Architecture*, Epic B.
- **Ergonomics for large leagues:** the override list is **searchable with multi-select bulk apply**, mirroring the Order Window Scheduler's ergonomics. It does **not** mirror its key — see Epic E.
- **Resolution is a storefront concern.** How a shopper is matched to a division or team, and the fallback order when they are matched to neither, is specified in *Storefront Announcement Banner*, Epic C, and keys off the team selector in *Roster-Optional Architecture*, Epic D.

### Metrics & Success Criteria

- Store edits made without recreating a store
- Setting-change error rate near zero
- Time-to-find for a given setting (seven-section nav vs. the prior two-section layout)
- Post-launch edit attempts blocked on locked fields (once defined)
- Share of stores keeping the Team Manager point-of-contact default vs. switching to Salesperson or Custom
- Manager-record edits that correctly propagate to the storefront footer — target 100%
- Managers per store, and share of stores changing their primary manager after launch
- **Manager records added post-launch by coach import vs. by hand** — the read on whether the Team Database path is reachable from where reps actually go to add a manager, and the input to the OPEN question about surfacing it on the manager card
- **Re-binds that leave managers from the previous team**, and the split between keeping and removing them — a read on whether the prompt is set at the right default
- **Re-binds where a left-behind manager held active portal access** — the failure case the callout exists to prevent; the metric to watch is whether reps then go to People & Access and act
- **Ship-to destination addresses added here after launch** — the recovery path for stores that skipped it at creation, and a read on how often creation-time capture is being skipped
- **Destination-address clears followed by a re-entry within the same session** — a read on whether clearing is being used for correction (expected) or by mistake
- **Share of destinations here resolving to a saved Pick-up Location vs. a typed address**, and stores left without a destination after a location was switched off at workspace level
- **Fundraising disable interstitials cancelled vs. confirmed** — a high cancel rate means the sweep was larger than the rep expected, which is exactly what the interstitial exists to reveal
- **Stores sitting in the disabled-with-exemptions mixed state, and how long they stay there**
- **Store-level fundraising disables followed by a re-enable within 30 days** — a read on whether the master switch is being used to explore rather than to decide, and on whether state restoration is doing real work
- Bulk duplicate-number applies per store, and share of rosters subsequently overriding — a read on whether the bulk default is set to the right value
- Share of stores whose Team & Roster values were set at creation and never edited here — a read on whether the creation-time panel is doing its job
- **Share of live stores carrying a non-empty announcement message** — the read on whether reps treat this as setup, as research suggested
- **Announcement messages entered at creation (Step 1 Epic H) vs. added here after the fact** — a read on whether the wizard panel is placed where reps will use it
- **Announcement message edits on launched stores, and time from launch to first edit** — the metric that justifies the Epic B lock exemption; a write-once pattern would suggest the exemption is unused
- **Share of League stores using division or standalone-team overrides vs. store-level only** — whether override granularity earns its complexity
- **Share of stores overriding the default theme color vs. accepting the team primary color**, and share of overrides that are later reset to the team color
- **Theme colors retained through a Change Team** — confirmation that a custom choice is surviving a re-bind as specified
- Scheduled vs. manual closures; re-open rate
- Store Close Report view rate on first return after close; share of reps re-opening it later
- Manager-version close report views per store with an active team manager
- Total raised per pop-up window; orders in final days; per-team-code window coverage gaps resolved
- Team-manager invites sent / activated / revoked per store, and share sent against an existing manager record rather than a fresh address
- Archived stores retained as read-only records
- Manager-mapping completeness for Ship-to-Team-Manager League stores (freight-gate readiness)

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Reuses the entire **Step 1 — Basics** field set and validation (Team Database pull for logo/colors/sports/coaches, salesperson/contact directory, scheduling persistence, and the **Collect Sales Tax** toggle with its searchable state select, state→flat-rate lookup, and liability agreement), split across per-card edit modals (Store Details, League/Team Manager Information, Fulfillment Method, Edit Store Schedule, Store Theme Color, Announcement Message) under a **seven-section Settings layout** driven by a single section key — deep links from elsewhere in the workspace (e.g. My Team(s) → manager mapping) must target the correct section id, and adding a section must not renumber or invalidate existing section keys. The **Edit Store Details** modal owns Team Branding & Sport (connect-to-team re-binding with branding re-import and coach import), the **Roster Rules** and **Team Fundraising** toggles, **Compliance & Taxation**, and the **Store Point of Contact**; the manager card holds the manager collection's names, addresses, phones, emails, and contact preferences.

**Coach import** requires the Team Database connect to return the **coach records attached to the selected team or organization** in the same payload as the branding. Imported coaches are written into the same manager collection as hand-entered records — no separate entity, no parallel table, no origin-based behavior in any downstream consumer. The import is a **point-in-time copy with no live binding in either direction**: manager edits never write back to the Team Database, and Team Database changes never mutate an existing store's records. Re-binding requires the connect to resolve **which existing manager records originated from the team being replaced**, which means retaining a source-team reference on imported records; hand-entered records carry none and are excluded from the re-bind prompt. Resolving that set must also join against the People & Access invite table so records with active or pending access can be called out. The Team Database coach schema — specifically whether records carry a mailing address and a role or title — is an **open dependency** (see *Step 1 — Basics*, Epic D2 and Epic F).

**Import must carry no access-granting side effect.** No account, invite, entitlement, or notification may be created by importing a coach, and no code path may infer portal access from the presence of a manager record. Conversely, deleting a manager record must not revoke an invite. The manager collection and the invite table are independent, and every surface that touches both must state the consequence rather than resolve it silently.

**Team Fundraising is no longer a boolean store field.** It requires: a **catalog-wide read** returning every product and bundle with fundraising enabled, together with its current amount, to populate the disable interstitial; an **exemption pass** resolving which of those items carry a non-cancelled order and are therefore protected by the commercial lock; a **bulk write** that clears the per-item flag across the non-exempt set on confirm; **amount preservation** so no write ever clears a stored fundraising figure; **prior-state retention** capturing each item's own flag at the moment of a store-level disable so that re-enabling restores rather than switches on; and a **three-state resolution** — enabled, disabled, disabled-with-exemptions — consumed by the Store Details pill, by the Fundraising Report's render gate (*Store Analytics (Reports Tab)*, Epic D), and by the price settings component's conditional Fundraising column (*Products Tab*, Governing rule 3). Exemption status must re-resolve automatically when an item's orders are all cancelled, releasing it to the store-level setting. Team Fundraising must be excluded from the post-launch lock list.

**Store Customization & Design** requires a **store-level theme color field carrying its own source flag** (team-derived vs. rep-selected) — the flag is not inferrable from the value, since a rep may legitimately pick the same color the team default would have produced, and re-derivation on Change Team depends on knowing which it is. Re-derivation must be wired into the connect-to-team save path in Epic A1 and must fire only where the source flag reads team-derived. The color is consumed through **token-level indirection scoped to buttons and accents**; it must not be implemented as a global brand-color override, so that the blast radius is bounded by the token set rather than by a stylesheet search.

It also requires a **store-level announcement message field** holding sanitized rich text, written by this card and by *Step 1 — Basics* Epic H against the same persisted value with **no creation-time copy**, plus **optional announcement message fields on division and standalone-team structure records** as specified in *Roster-Optional Architecture*, Epic B. Teams inside a division carry no such field. The division's color contribution is the **existing division brand color** and introduces no new storage. Deleting a division must drop its announcement message and applied-color flag on the same path that already drops its branding. Rich text requires a **sanitizing renderer** on the storefront — script, embed, iframe, and event-handler content stripped rather than escaped-and-displayed — and the editor must not be treated as a trusted-input boundary merely because the author is a rep. Both controls must be **excluded from the post-launch lock list**, and the storefront must read live store state so a mid-window edit propagates without a republish. The override list's bulk-apply must write per division and per standalone team; it must **not** reuse the Order Window Scheduler's per-team-code write path.

The **manager card** requires a **collection of manager records with exactly one designated primary**, writable from this card, from *Step 1 — Basics* Epic E, and from coach import, all against the same persisted collection. Primary designation drives point-of-contact inheritance and is the only record subject to point-of-contact validation; re-designation must repoint the live storefront footer without a store re-save, and removal of the primary must be blocked until another is designated — including when the removal originates from the re-bind prompt. Manager records must carry **no access-granting side effect** — portal entitlement is created only by an invite record in People & Access.

The **Store Point of Contact** requires a per-channel mode persisted independently for Email and Phone and a **live binding to the primary manager record** so contact edits propagate to the storefront footer without re-saving the store, plus a blank-value guard at save. That binding is internal to Team Stores and does not extend to the Team Database.

The **ship-to destination address** must be a **single persisted field** shared by three surfaces — *Step 1 — Basics* Epic F, the Fulfillment Method card here, and the primary manager record — never a wizard-local value copied forward. It requires the same backend **map-service verification** as manager-record addresses, applied equally to addresses arriving via coach import, a **clearable** state that saves successfully while reporting the store as not fulfillment-ready, and consumption by the **pending-order freight gate** so a cleared or missing address blocks submission rather than shipping to nowhere. Where the destination is supplied as a saved **Pick-up Location**, it must be held as a **reference to that location** rather than a copy of its address, so a workspace-level edit propagates and a location switched off leaves the store detectably without a destination (*Pick Up Locations*, Governing rule 3 and Epic C); reading the saved-location list requires the workspace-scoped location service, and a workspace with no locations must render the manual path with no error. It must be excluded from the post-launch lock list.

**Allow Duplicate Numbers** must be implemented here as a **bulk write across the store's rosters plus a mixed-state read**, not as a parent value inherited at read time — the authoritative value lives on each roster (Roster Management, Epic 4), and new rosters read this control only at creation, including rosters created during store creation. **Jersey number selection** writes a store-level mode consumed by both the roster editor and the buyer product page. Both values are written by *Step 1 — Basics* Epic D1 to the same store-level fields these cards read; no duplicate creation-time storage may exist.

**People & Access** requires store-scoped invite records with status/last-login, an email-invite + password-set flow, a revoke path that also withdraws close-report access, an impersonation ("View portal as") entry into the two-area Team Manager Portal, and a read of the manager collection so an invite can be sent against an existing record's email — imported and hand-entered alike. The **Order Fulfillment Mapping** requires the shared roster-org state (divisions / standalone teams mirrored live with the My Team(s) tab), per-division fulfillment modes, manager records with required addresses selected from the store's manager collection, and the freight gate consumed by pending-order submission. The **Order Window Scheduler** needs per-team-code window persistence with timezones, bulk apply, and gap analysis.

The **Store Close Report** requires a **close-triggered aggregation job** over the completed order window (revenue, orders, units, roster participation, profit split, top products), a **generated-report record per close event** so re-opening and re-closing produces a new report without destroying the prior one, a **seen/dismissed flag per rep** driving the auto-present-once behavior on next workspace entry, a **persistent entry point** on the Store Status card, and a **manager-scoped projection** of the same aggregation that excludes dealer profit and any out-of-scope figures, gated on active team-manager access. The manager projection's team-facing figure reads team revenue and fundraising, not team profit, which no longer exists. Archiving must not trigger generation, and archived stores must retain existing reports as read-only.

Adds a **store-state-aware edit-permission layer**: in **draft** every field is writable; once **launched**, a **TBD subset of fields is locked** (the lock list must be finalized before build), with the Store Point of Contact, the ship-to destination address, Team Fundraising, the manager collection, and **both Store Customization & Design controls** explicitly excluded from locking, and the re-bind action's post-launch availability an explicit open item. **Archiving** requires an owner-scoped state transition that **disables the public storefront route** (serving a neutral "store closed" screen) and flips the management dashboard to **read-only** while retaining all records — undoable only by support. **Closing** is a separate **reversible** state (manual or triggered by the scheduled close date) that **locks the storefront** behind a "This store is closed" page while keeping the workspace fully editable; storefront changes only go live on a **manual re-open**. The **Active Order Window card** + **Edit Store Schedule** modal require an aggregate of **order revenue raised during the window** and a **countdown** derived from the store's open/close dates (rendered for always-on stores as an "Always open" state). **Catalog & Decoration** is gated on a per-store **third-party vendor enabled** flag; when false, neither the section nor its nav entry is rendered. Database updates + shared internal team / tax services.
